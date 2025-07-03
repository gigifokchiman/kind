terraform {
  required_providers {
    kind = {
      source  = "github.com/gigifokcm/kind"
      version = "0.1.0"
    }
  }
}

provider "kind" {}

# Full configuration test
resource "kind_cluster" "test" {
  name       = "test-full-config"
  node_image = "kindest/node:v1.27.0"

  kind_config {
    kind        = "Cluster"
    api_version = "kind.x-k8s.io/v1alpha4"

    # Control plane with port mappings
    node {
      role = "control-plane"

      kubeadm_config_patches = [
        "kind: InitConfiguration\nnodeRegistration:\n  kubeletExtraArgs:\n    node-labels: \"ingress-ready=true\""
      ]

      extra_port_mappings {
        container_port = 80
        host_port      = 8080
        protocol       = "TCP"
      }

      extra_port_mappings {
        container_port = 443
        host_port      = 8443
        protocol       = "TCP"
      }

      extra_port_mappings {
        container_port = 30000
        host_port      = 30000
        protocol       = "TCP"
      }
    }

    # Multiple worker nodes
    node {
      role = "worker"
    }

    node {
      role = "worker"
    }

    node {
      role = "worker"
    }
  }

  wait_for_ready = true
}

# Test that we can use the cluster credentials
provider "kubernetes" {
  host                   = kind_cluster.test.endpoint
  cluster_ca_certificate = base64decode(kind_cluster.test.cluster_ca_certificate)
  client_certificate     = base64decode(kind_cluster.test.client_certificate)
  client_key             = base64decode(kind_cluster.test.client_key)
}

# Create a test namespace to verify cluster is working
resource "kubernetes_namespace" "test" {
  metadata {
    name = "test-namespace"
  }
}

output "test_results" {
  value = {
    cluster_name    = kind_cluster.test.name
    cluster_ready   = kind_cluster.test.wait_for_ready
    namespace_created = kubernetes_namespace.test.metadata[0].name
  }
}