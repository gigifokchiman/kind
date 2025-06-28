# Terraform Provider Compatibility Note

## Go Version Requirements

The custom ML Platform Terraform provider requires **Go 1.16 or later** due to dependencies on:
- Terraform Plugin SDK v2
- Modern Go standard library features (io/fs, embed, crypto/ecdh)

Your current Go version (1.13.5) is not compatible.

## Options

### Option 1: Upgrade Go (Recommended)
```bash
# Using Homebrew (macOS)
brew install go

# Or download from https://golang.org/dl/
```

### Option 2: Use the third-party Kind provider
Instead of the custom provider, use the existing third-party provider:

```hcl
terraform {
  required_providers {
    kind = {
      source  = "tehcyx/kind"
      version = "~> 0.0.16"
    }
  }
}

provider "kind" {}

resource "kind_cluster" "local" {
  name           = "ml-platform-local"
  wait_for_ready = true
  
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
        protocol       = "TCP"
      }
      
      extra_port_mappings {
        container_port = 443
        host_port      = 8443
        protocol       = "TCP"
      }
    }
    
    node {
      role = "worker"
    }
  }
}
```

### Option 3: Use a Docker-based approach
Create the Kind cluster using Docker directly in your CI/CD pipeline:

```bash
# In your scripts or GitHub Actions
kind create cluster --name ml-platform-local --config kind-config.yaml
```

## Testing Without the Custom Provider

If you cannot upgrade Go, you can still test the infrastructure:

1. **Skip provider tests**: Comment out the custom provider tests in `run-all.sh`
2. **Use manual cluster creation**: Create Kind clusters using the `kind` CLI
3. **Focus on Kubernetes/application tests**: These don't require the custom provider

## Next Steps

1. Check your Go version: `go version`
2. If < 1.16, consider upgrading or using alternatives
3. Update your Terraform configurations accordingly