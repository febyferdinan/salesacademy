# Terraform / OpenTofu Reference

Terraform is the gold standard for Infrastructure as Code. **OpenTofu** is the open-source (MPL) fork — identical HCL syntax, drop-in compatible. Everything here works for both; swap `terraform` for `tofu` in commands if using OpenTofu.

## Principles
- **Declarative** — describe the desired state; the tool computes the diff
- **Remote state with locking** — never local state for teams; encrypt it
- **Modules** — reuse infra definitions across environments via variables
- **Plan before apply** — always review the diff; gate `apply` behind approval in CI
- **No manual changes** — all infra through code, or drift detection catches you out

## Project Structure
```
infra/
├── modules/
│   ├── network/          # VPC, subnets, security groups
│   ├── cluster/          # managed K8s (EKS/GKE/AKS)
│   ├── database/         # managed Postgres (RDS/Cloud SQL/Neon)
│   └── cache/            # managed Redis
├── environments/
│   ├── staging/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── terraform.tfvars
│   │   └── backend.tf
│   └── production/
│       └── ...
└── versions.tf
```

## Provider & Version Pinning (versions.tf)
```hcl
terraform {
  required_version = ">= 1.7"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
  }
}
```

## Remote State Backend (backend.tf) — AWS example
```hcl
terraform {
  backend "s3" {
    bucket         = "myorg-tfstate"
    key            = "production/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "tf-locks"     # state locking
    encrypt        = true
  }
}
```
(GCP: `backend "gcs"`. Or use Terraform Cloud / Spacelift for managed state + policy.)

## Module Example — Managed Postgres (modules/database/main.tf)
```hcl
variable "name"        { type = string }
variable "environment" { type = string }
variable "instance_class" {
  type    = string
  default = "db.t3.medium"
}

resource "aws_db_instance" "this" {
  identifier              = "${var.name}-${var.environment}"
  engine                  = "postgres"
  engine_version          = "16"
  instance_class          = var.instance_class
  allocated_storage       = 20
  storage_encrypted       = true
  multi_az                = var.environment == "production"
  backup_retention_period = var.environment == "production" ? 30 : 7
  deletion_protection     = var.environment == "production"
  skip_final_snapshot     = var.environment != "production"
}

output "endpoint" {
  value = aws_db_instance.this.endpoint
}
```

## Composing in an Environment (environments/production/main.tf)
```hcl
module "network" {
  source      = "../../modules/network"
  environment = "production"
  cidr_block  = "10.0.0.0/16"
}

module "cluster" {
  source       = "../../modules/cluster"
  environment  = "production"
  vpc_id       = module.network.vpc_id
  subnet_ids   = module.network.private_subnet_ids
  node_count   = 3
  node_size    = "t3.large"
}

module "database" {
  source         = "../../modules/database"
  name           = "app"
  environment    = "production"
  instance_class = "db.r6g.large"
}
```

## Core Workflow
```bash
terraform init          # download providers, configure backend
terraform fmt           # format
terraform validate      # syntax check
terraform plan -out=tfplan   # preview changes
terraform apply tfplan       # apply reviewed plan
terraform destroy            # tear down (careful!)
```

## State & Secrets
- **Never commit state** — it can contain secrets in plaintext
- **Never hardcode credentials** — use provider env vars or cloud OIDC
- Mark sensitive outputs: `sensitive = true`
- For app secrets, provision the secret container (e.g. AWS Secrets Manager) with Terraform, but inject values out-of-band

## CI Integration (plan on PR, apply on merge)
- Run `terraform plan` on every PR, post the diff as a comment
- Gate `terraform apply` behind manual approval or merge to main
- Use cloud OIDC so CI gets short-lived credentials (no static keys)
- Consider **Spacelift**, **Atlantis**, or **Terraform Cloud** for plan/apply gating, policy-as-code, and drift detection

## Crossplane (alternative, K8s-native)
If your org is all-in on Kubernetes, **Crossplane** lets you manage cloud infra as Kubernetes custom resources (managed via kubectl/Helm/Argo CD), unifying app + infra under one GitOps workflow. Consider it when you want infra reconciled like any other K8s resource and want to avoid a separate IaC tool. Otherwise, Terraform/OpenTofu remains the mainstream default.

## Drift Detection
- Manual changes to cloud resources cause drift from your code
- `terraform plan` reveals drift; tools like Spacelift detect and alert automatically
- Policy: treat the cloud console as read-only; all changes go through code
