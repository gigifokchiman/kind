terraform {
  required_providers {
    kind = {
      source  = "kind.local/gigifokchiman/kind"
      version = "0.1.4"
    }
  }
}

provider "kind" {
  # Docker host can be configured here or via DOCKER_HOST env var
  # docker_host = "unix:///var/run/docker.sock"
}

# Basic cluster for testing
resource "kind_cluster" "test" {
  name           = "test-basic-cluster"
  wait_for_ready = true
}

output "cluster_endpoint" {
  value = kind_cluster.test.endpoint
}

output "cluster_ca_cert" {
  value     = kind_cluster.test.cluster_ca_certificate
  sensitive = true
}