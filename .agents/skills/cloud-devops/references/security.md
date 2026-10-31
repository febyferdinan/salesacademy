# DevOps / Cloud Security Reference

Security spans the whole pipeline: build, ship, run. Apply defense in depth.

## Secrets Management (NEVER commit secrets)
Options, best to acceptable:
1. **External Secrets Operator (ESO)** — syncs secrets from AWS Secrets Manager / GCP Secret Manager / Vault into K8s Secrets. App references K8s Secret; real value never in Git.
2. **Sealed Secrets (Bitnami)** — encrypt secrets so they CAN live in Git safely; only the cluster controller can decrypt.
3. **SOPS + age/KMS** — encrypt secret files in Git, decrypt at deploy.
4. **Cloud secrets manager directly** — app fetches at startup via IAM role.

Rules:
- Plain K8s Secrets are only base64-encoded (NOT encrypted) — enable encryption at rest on etcd
- Never bake secrets into images or pass via plain ConfigMaps
- Rotate regularly; use short-lived credentials where possible

## Image Security
- **Scan in CI** with Trivy or Grype; fail the build on CRITICAL/HIGH CVEs
- **Minimal base images** — distroless or alpine; fewer packages = smaller attack surface
- **Run as non-root**, `readOnlyRootFilesystem: true`, drop all capabilities
- **Pin versions** — no `:latest` in production
- **No secrets in layers** — they persist in image history even if deleted later

## Supply Chain Security
- **SBOM** — generate a Software Bill of Materials (`syft`) for every image
- **Sign images** — `cosign sign` (keyless via OIDC); verify signatures before deploy
- **Verify in cluster** — admission controller (Kyverno / Sigstore policy-controller) rejects unsigned images
- **Pin dependencies** — lockfiles committed; use Dependabot/Renovate for updates

## Kubernetes RBAC (least privilege)
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: production
  name: api-role
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: api-rolebinding
  namespace: production
subjects:
  - kind: ServiceAccount
    name: api
roleRef:
  kind: Role
  name: api-role
  apiGroup: rbac.authorization.k8s.io
```
- Apps get their own ServiceAccount with only needed permissions
- NEVER bind workloads to `cluster-admin`
- Disable automounting the default SA token if unused

## Network Policies (default-deny)
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: production
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: production
spec:
  podSelector: { matchLabels: { app: db } }
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector: { matchLabels: { app: api } }
      ports:
        - { protocol: TCP, port: 5432 }
```
Start with default-deny, then explicitly allow required traffic. Consider **Cilium** for richer policy + observability.

## Pod Security
- Enforce **Pod Security Standards** (restricted profile) via namespace labels:
```yaml
metadata:
  labels:
    pod-security.kubernetes.io/enforce: restricted
```
- securityContext: `runAsNonRoot`, `allowPrivilegeEscalation: false`, drop ALL capabilities, read-only root FS

## Cloud Credentials
- **OIDC from CI → cloud** for short-lived tokens (no static keys in GitHub secrets)
- IAM roles scoped to least privilege per workload (IRSA on EKS, Workload Identity on GKE)
- Rotate and audit access regularly

## Policy as Code
- **Kyverno** or **OPA/Gatekeeper** — enforce cluster policies (no `:latest`, require limits, require signed images, no privileged pods)
- **Terraform/OpenTofu policy** — Sentinel, OPA, or Spacelift policies gate infra changes (e.g. no public S3 buckets)

## TLS / Certificates
- **cert-manager** auto-provisions and renews TLS certs (Let's Encrypt) for Ingress
- Enforce HTTPS-only; redirect HTTP → HTTPS at the ingress

## DevSecOps — Shift Left
- Scan IaC (`tfsec`, `checkov`) and images in CI before merge
- Secret scanning (gitleaks) on every commit
- Dependency scanning (Dependabot, Snyk)
- SAST on application code
- Fail fast in the pipeline — cheaper to fix before production

## Checklist
- [ ] No secrets in Git or images; managed via ESO / Sealed Secrets / SOPS
- [ ] Images scanned in CI, build fails on critical CVEs
- [ ] Images signed (cosign) and verified at admission
- [ ] SBOM generated per image
- [ ] Workloads run non-root with restricted securityContext
- [ ] RBAC least-privilege; no cluster-admin for apps
- [ ] Default-deny network policies with explicit allows
- [ ] OIDC for CI→cloud; no static cloud keys
- [ ] Policy-as-code enforced (Kyverno/OPA)
- [ ] cert-manager TLS on all ingress; HTTPS enforced
- [ ] IaC scanned (tfsec/checkov) + secret scanning (gitleaks) in CI
