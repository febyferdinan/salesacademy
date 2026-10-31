# Kubernetes Reference

Use Kubernetes for multi-service apps that need scaling, self-healing, and where the team owns infra. For MVPs, prefer a PaaS (see containerization.md).

## Core Objects
- **Deployment** — declarative pod management, rolling updates, replicas
- **Service** — stable network endpoint for a set of pods (ClusterIP internal, LoadBalancer external)
- **Ingress** — HTTP routing + TLS into the cluster
- **ConfigMap / Secret** — config and sensitive data (secrets should come from a secrets manager, not raw)
- **HorizontalPodAutoscaler (HPA)** — scale pods on CPU/memory/custom metrics
- **PodDisruptionBudget (PDB)** — keep minimum pods available during node drains

## Deployment (production-grade)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  labels: { app: api }
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
      containers:
        - name: api
          image: ghcr.io/org/api:sha-abc1234   # immutable tag
          ports: [{ containerPort: 3000 }]
          envFrom:
            - secretRef: { name: api-secrets }
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "512Mi" }
          livenessProbe:
            httpGet: { path: /health, port: 3000 }
            initialDelaySeconds: 10
            periodSeconds: 15
          readinessProbe:
            httpGet: { path: /ready, port: 3000 }
            initialDelaySeconds: 5
            periodSeconds: 10
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
```

## Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector: { app: api }
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP
```

## Ingress (with TLS via cert-manager)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
    - hosts: [api.example.com]
      secretName: api-tls
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api
                port: { number: 80 }
```

## HorizontalPodAutoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization, averageUtilization: 70 } }
```
For event-driven scaling (queue depth, Kafka lag, etc.) use **KEDA** instead of plain HPA.

## PodDisruptionBudget
```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api
spec:
  minAvailable: 2
  selector:
    matchLabels: { app: api }
```

## Database Migration as a pre-deploy Job
```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: migrate-{{ .Release.Revision }}
  annotations:
    "helm.sh/hook": pre-upgrade,pre-install
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
        - name: migrate
          image: ghcr.io/org/api:sha-abc1234
          command: ["npx", "prisma", "migrate", "deploy"]
          envFrom: [{ secretRef: { name: api-secrets } }]
```

---

## Helm — Package & Templatize

Structure:
```
chart/
├── Chart.yaml
├── values.yaml              # defaults
├── values-staging.yaml      # env overrides
├── values-prod.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── hpa.yaml
    └── _helpers.tpl
```

Chart.yaml:
```yaml
apiVersion: v2
name: api
version: 0.1.0
appVersion: "1.0.0"
```

values.yaml:
```yaml
image:
  repository: ghcr.io/org/api
  tag: ""          # set per-deploy to git SHA
replicaCount: 3
resources:
  requests: { cpu: 100m, memory: 128Mi }
  limits:   { cpu: 500m, memory: 512Mi }
ingress:
  enabled: true
  host: api.example.com
```

Templated deployment uses values:
```yaml
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: api
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources: {{- toYaml .Values.resources | nindent 12 }}
```

Commands:
```bash
helm upgrade --install api ./chart -f values-prod.yaml --set image.tag=sha-abc1234 -n production
helm rollback api -n production        # roll back to previous release
```

For cluster-level monitoring, prefer the community **kube-prometheus-stack** chart (bundles Prometheus, Grafana, Alertmanager, node-exporter, kube-state-metrics).

---

## Argo CD — GitOps Continuous Delivery

Argo CD is the de-facto GitOps CD tool. It watches a Git repo and continuously reconciles the cluster to match it — automatic sync, drift detection, and rollback.

Application manifest:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/org/gitops-config.git
    targetRevision: main
    path: apps/api
    helm:
      valueFiles: [values-prod.yaml]
  destination:
    server: https://kubernetes.default.svc
    namespace: production
  syncPolicy:
    automated:
      prune: true          # remove resources deleted from Git
      selfHeal: true       # revert manual drift
    syncOptions: [CreateNamespace=true]
    retry:
      limit: 3
      backoff: { duration: 5s, factor: 2, maxDuration: 3m }
```

GitOps flow:
1. CI builds image, pushes to registry with git SHA tag
2. CI updates the image tag in the **gitops-config** repo (separate from app source)
3. Argo CD detects the Git change → syncs cluster → runs health checks
4. On failed health check → Argo CD can auto-rollback to last-good revision

Keep app source and deployment config in **separate repos** (or clearly separated paths) so CI commits to config don't retrigger CI builds.

---

## Environment Promotion
- Separate `values-{dev,staging,prod}.yaml` (or separate branches/paths in gitops repo)
- Promote the **same image** (same SHA) through environments — never rebuild per environment
- Use Argo CD per-environment Applications, or ApplicationSets for fan-out

## When NOT to use Kubernetes
- Single service / MVP → Cloud Run, Railway, Render, Fly.io
- Edge API → Cloudflare Workers, Vercel
- K8s adds real operational overhead; adopt it when the complexity is justified by scale or multi-service needs.
