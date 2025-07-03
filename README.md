# Terraform Provider for Kind

This is a custom Terraform provider for managing Kind (Kubernetes in Docker) clusters.

## Features

- Create and manage Kind clusters
- Configure port mappings for local development
- Extract kubeconfig and cluster credentials
- Support for custom Kind configurations

## Installation

### Build and Install Locally

```bash
# Build the provider
make build

# Install to local Terraform plugins directory
make install

# Or do both
make dev
```

### Use in Terraform

```hcl
terraform {
  required_providers {
    kind = {
      source  = "kind.local/gigifokchiman/kind"
      version = "0.1.0"
    }
  }
}

provider "kind" {
  # Docker host configuration (optional)
  # docker_host = "unix:///var/run/docker.sock"
}

# Create a Kind cluster
resource "kind_cluster" "default" {
  name = "my-kind-cluster"
  
  kind_config {
    kind        = "Cluster"
    api_version = "kind.x-k8s.io/v1alpha4"
    
    node {
      role = "control-plane"
      
      kubeadm_config_patches = [
        "kind: InitConfiguration\nnodeRegistration:\n  kubeletExtraArgs:\n    node-labels: \"ingress-ready=true\""
      ]
      
      extra_port_mappings {
        container_port = 80
        host_port      = 8080
      }
      extra_port_mappings {
        container_port = 443
        host_port      = 8443
      }
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

# Use the cluster credentials
provider "kubernetes" {
  host                   = mlplatform_kind_cluster.default.endpoint
  cluster_ca_certificate = base64decode(mlplatform_kind_cluster.default.cluster_ca_certificate)
  client_certificate     = base64decode(mlplatform_kind_cluster.default.client_certificate)
  client_key             = base64decode(mlplatform_kind_cluster.default.client_key)
}
```

## Development

### Prerequisites

- Go 1.21+
- Terraform 1.0+
- Kind CLI installed
- Docker running

### Building

```bash
# Get dependencies
go mod download

# Build
go build

# Run tests
go test ./...
```

### Testing the Provider

```bash
# Create a test configuration
cat > test.tf <<EOF
terraform {
  required_providers {
    mlplatform = {
      source  = "mlplatform.local/your-org/mlplatform"
      version = "0.1.0"
    }
  }
}

provider "mlplatform" {}

resource "mlplatform_kind_cluster" "test" {
  name = "test-cluster"
}
EOF

# Initialize and apply
terraform init
terraform apply
```

## Provider Configuration

### Provider Arguments

- `docker_host` - (Optional) Docker daemon socket. Defaults to `DOCKER_HOST` environment variable.

### Resource: mlplatform_kind_cluster

#### Arguments

- `name` - (Required) Name of the Kind cluster.
- `node_image` - (Optional) Docker image for nodes. Default: `kindest/node:v1.28.0`.
- `wait_for_ready` - (Optional) Wait for cluster to be ready. Default: `true`.
- `kind_config` - (Optional) Kind cluster configuration block.

#### Attributes

- `kubeconfig_path` - Path to the kubeconfig file.
- `endpoint` - Kubernetes API server endpoint.
- `cluster_ca_certificate` - Base64 encoded cluster CA certificate.
- `client_certificate` - Base64 encoded client certificate.
- `client_key` - Base64 encoded client key.

## Why a Custom Provider?

1. **Control**: Full control over cluster creation process
2. **Customization**: Add ML Platform-specific configurations
3. **Integration**: Direct integration with your platform
4. **No Dependencies**: No reliance on third-party provider maintenance
5. **Learning**: Understand Terraform provider development

## Future Enhancements

- [ ] Add ML model deployment resources
- [ ] Add training job resources
- [ ] Add feature store resources
- [ ] Add experiment tracking resources
- [ ] Support for remote Docker hosts
- [ ] Cluster backup and restore
- [ ] Custom node configurations

## License

MIT