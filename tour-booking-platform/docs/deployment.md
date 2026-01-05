# Deployment & Scaling

## Docker
- Use provided `docker-compose.yml` for local testing and development.

## Production
- Containerize services and deploy to a managed container service (ECS, AKS, GKE).
- Use managed Postgres (RDS, Cloud SQL) with read replicas and backups.
- Put API behind a load balancer and use auto-scaling groups.
- Use Redis for caching and session storage.

## Observability
- Use Prometheus + Grafana for metrics, and a hosted service for logs (Datadog, Logz.io, Sumo Logic).
