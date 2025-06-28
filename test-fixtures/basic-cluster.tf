terraform {
  required_providers {
    mlplatform = {
      source  = "mlplatform.local/your-org/mlplatform"
      version = "0.1.0"
    }
  }
}

provider "mlplatform" {
  # Docker host can be configured here or via DOCKER_HOST env var
  # docker_host = "unix:///var/run/docker.sock"
}

# Basic cluster for testing
resource "mlplatform_kind_cluster" "test" {
  name           = "test-basic-cluster"
  wait_for_ready = true
}

output "cluster_endpoint" {
  value = mlplatform_kind_cluster.test.endpoint
}

output "cluster_ca_cert" {
  value     = mlplatform_kind_cluster.test.cluster_ca_certificate
  sensitive = true
}