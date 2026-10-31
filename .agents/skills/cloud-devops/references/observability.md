# Observability Reference

The CNCF-standard observability stack: **Prometheus** (metrics), **Grafana** (dashboards), **OpenTelemetry** (vendor-neutral instrumentation: metrics/traces/logs), **Loki** (logs), and **Alertmanager** (alerting). You can't fix what you can't see.

## The Three Pillars
- **Metrics** — numeric time-series (request rate, latency, error count, CPU). Prometheus.
- **Logs** — structured event records. Loki (or ELK).
- **Traces** — request lifecycle across services. OpenTelemetry → Jaeger/Tempo.

Instrument once with **OpenTelemetry** and export to all three — one standard for apps and infra.

## Golden Signals (what to actually monitor)
1. **Latency** — how long requests take (p50, p95, p99)
2. **Traffic** — request rate
3. **Errors** — rate of failed requests
4. **Saturation** — how full the system is (CPU, memory, queue depth)

Dashboard and alert on these four for every service.

## Deploying the Stack (Helm)
Use the community **kube-prometheus-stack** chart — bundles Prometheus, Grafana, Alertmanager, node-exporter, kube-state-metrics:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace \
  -f monitoring-values.yaml
```
Deploy it the GitOps way via Argo CD for reproducibility.

## Exposing App Metrics

### Node/TypeScript (prom-client)
```typescript
import client from 'prom-client';

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

// expose /metrics
app.get('/metrics', async (c) => {
  return c.text(await register.metrics(), 200, { 'Content-Type': register.contentType });
});
```

### Python/FastAPI (prometheus-fastapi-instrumentator)
```python
from prometheus_fastapi_instrumentator import Instrumentator
Instrumentator().instrument(app).expose(app)   # adds /metrics
```

## ServiceMonitor (tell Prometheus to scrape your app)
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: api
  labels: { release: monitoring }
spec:
  selector:
    matchLabels: { app: api }
  endpoints:
    - port: http
      path: /metrics
      interval: 15s
```

## OpenTelemetry Instrumentation (Node)
```typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();
```
Run an **OpenTelemetry Collector** in-cluster to receive, process, and fan out to Prometheus (metrics), Tempo/Jaeger (traces), Loki (logs).

## Alerting (PrometheusRule)
```yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: api-alerts
  labels: { release: monitoring }
spec:
  groups:
    - name: api
      rules:
        - alert: HighErrorRate
          expr: |
            sum(rate(http_request_duration_seconds_count{status=~"5.."}[5m]))
            / sum(rate(http_request_duration_seconds_count[5m])) > 0.05
          for: 5m
          labels: { severity: critical }
          annotations:
            summary: "Error rate above 5% for {{ $labels.route }}"

        - alert: HighLatencyP95
          expr: |
            histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le)) > 1
          for: 10m
          labels: { severity: warning }
          annotations:
            summary: "p95 latency above 1s"
```
Route alerts via **Alertmanager** to Slack, PagerDuty, Opsgenie, etc.

## Logs (Loki)
- Apps emit **structured JSON logs** to stdout (Pino / structlog)
- Promtail or the Grafana Alloy collector ships them to Loki
- Query in Grafana alongside metrics — correlate a latency spike with the logs behind it
- Include a `traceId` in logs to jump between traces and logs

## SLOs (Service Level Objectives)
- Define targets: e.g. "99.9% of requests succeed", "p95 latency < 300ms"
- Track **error budget** (allowed failures); alert when burn rate is too high
- SLO-based alerts beat threshold-spam — they fire on user-impacting problems

## Grafana Dashboards
- Import community dashboards for kube-prometheus-stack (cluster, node, pod views)
- Build a per-service dashboard with the four golden signals
- Share dashboards across engineering, finance, leadership for shared visibility

## Health Endpoints (recap from backend)
```
GET /health  → liveness (process up)        → K8s livenessProbe
GET /ready   → readiness (DB + Redis ok)     → K8s readinessProbe
GET /metrics → Prometheus scrape target
```

## Checklist
- [ ] /metrics exposed and scraped by Prometheus
- [ ] Grafana dashboards for the four golden signals
- [ ] Alerts on error rate, latency, saturation → routed to on-call
- [ ] OpenTelemetry tracing across services
- [ ] Structured logs centralized in Loki with traceId correlation
- [ ] SLOs defined with error-budget alerting
