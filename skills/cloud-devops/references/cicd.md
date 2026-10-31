# CI/CD Reference (GitHub Actions + GitOps)

GitHub Actions is the most-used CI for repo-driven workflows (tight Git integration). Pair it with Argo CD for pull-based GitOps CD. CI proves the artifact; CD ships it.

## Division of Labor
- **CI (GitHub Actions):** lint → typecheck → test → build image → scan → push to registry → bump image tag in gitops repo
- **CD (Argo CD):** detect Git change → reconcile cluster → health check → auto-rollback on failure

GitHub Actions uses a **push** model. Argo CD adds the **pull-based** reconciliation, drift detection, and rollback that define true GitOps.

## CI Pipeline (.github/workflows/ci.yml)
```yaml
name: ci
on:
  push: { branches: [main] }
  pull_request:

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: postgres }
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready --health-interval 5s
          --health-timeout 5s --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
```

## Build, Scan & Push (.github/workflows/release.yml)
```yaml
name: release
on:
  push: { branches: [main] }

permissions:
  contents: read
  packages: write
  id-token: write        # for OIDC / cosign keyless signing

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ghcr.io/${{ github.repository }}:sha-${{ github.sha }}
            ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Scan image with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ghcr.io/${{ github.repository }}:sha-${{ github.sha }}
          format: table
          exit-code: '1'              # fail build on findings
          severity: CRITICAL,HIGH
          ignore-unfixed: true

      - name: Sign image (cosign keyless)
        run: |
          cosign sign --yes ghcr.io/${{ github.repository }}:sha-${{ github.sha }}
```

## GitOps Image Bump (update config repo, triggers Argo CD)
```yaml
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout gitops config repo
        uses: actions/checkout@v4
        with:
          repository: org/gitops-config
          token: ${{ secrets.GITOPS_PAT }}

      - name: Update image tag
        run: |
          cd apps/api
          yq -i '.image.tag = "sha-${{ github.sha }}"' values-prod.yaml
          git config user.name "ci-bot"
          git config user.email "ci@org.com"
          git commit -am "deploy: api sha-${{ github.sha }}"
          git push
      # Argo CD detects this commit and reconciles the cluster automatically
```

## Cloud OIDC (no long-lived keys)
Use GitHub's OIDC to assume a cloud role for short-lived credentials:
```yaml
      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/github-ci
          aws-region: us-east-1
```
Never store static cloud access keys in GitHub secrets when OIDC is available.

## Environments & Promotion
- Use GitHub **Environments** (staging, production) with required reviewers for prod
- Promote the **same image SHA** through environments — don't rebuild per env
- staging deploys on merge to main; production deploys on manual approval or tag

## Pipeline Stages Summary
```
PR opened    → lint, typecheck, test, build (no push)
Merge main   → build + scan + sign + push image → bump staging tag → Argo CD deploys staging
Promote      → bump prod tag (with approval) → Argo CD deploys production
On failure   → Argo CD health check fails → auto-rollback to last-good
```

## Alternatives (when not GitHub)
- **GitLab CI/CD** — all-in-one (SCM + CI + registry + K8s agent); good for compliance/governance
- **Argo Workflows** — Kubernetes-native CI for complex DAG pipelines
- **Flux** — alternative GitOps CD to Argo CD (lighter, more toolkit-style)
- **Jenkins** — maximum flexibility/plugins, more maintenance overhead
Pick based on existing stack; GitHub Actions + Argo CD is the common modern default.
