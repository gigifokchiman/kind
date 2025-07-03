# Full configuration test
resource "kind_cluster" "full_test" {
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

output "test_results" {
  value = {
    cluster_name    = kind_cluster.full_test.name
    cluster_ready   = kind_cluster.full_test.wait_for_ready
    endpoint        = kind_cluster.full_test.endpoint
  }
}