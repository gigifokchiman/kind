# Terraform Provider Installation Guide

# Purpose:
- This is an exercise for understanding how the terraform packages work, e.g. the CRUD operations.
- Kubernetes in Docker (Kind) was chosen as a starting point as the basic CRUD operation is simple for the demo purpose.
- As it is for a demo purpose, the artifact is not signed. It can be loaded to the local computer for a quick validation.
- The validation can be written in HCL or TypeScript.

## Installation Methods

### Method 1: Download from GitHub Releases (Recommended)

Download pre-built binaries from [GitHub Releases](https://github.com/gigifokchiman/kind/releases):

1. **Download the provider binary** for your platform:
   - macOS Intel: `terraform-provider-kind_vX.X.X_darwin_amd64.tar.gz`
   - macOS Apple Silicon: `terraform-provider-kind_vX.X.X_darwin_arm64.tar.gz`  
   - Linux: `terraform-provider-kind_vX.X.X_linux_amd64.tar.gz`
   - Windows: `terraform-provider-kind_vX.X.X_windows_amd64.zip`

2. **Extract and install**:
   ```bash
   # Create plugin directory
   mkdir -p ~/.terraform.d/plugins/kind.local/gigifokchiman/kind/0.1.4/darwin_arm64
   
   # Extract and copy binary (adjust paths for your platform)
   tar -xzf terraform-provider-kind_v0.1.4_darwin_arm64.tar.gz
   cp terraform-provider-kind ~/.terraform.d/plugins/kind.local/gigifokchiman/kind/0.1.4/darwin_arm64/
   ```

3. **Download SDKs** (optional):
   - TypeScript SDK: Built artifacts in `lib/` directory
   - Python SDK: Built package in `python/` directory

### Method 2: Local Development Installation

For development, use the Makefile:

```bash
make build
make install
```

This will:
- Build the provider binary
- Install it to `~/.terraform.d/plugins/kind.local/gigifokchiman/kind/0.1.4/`
- Allow you to use the provider in your Terraform configurations

### Other Makefile Commands

```bash
# Build only (without installing)
make build

# Run all tests
make test

# Run unit tests only
make test-unit

# Run acceptance tests
make test-acc

# Generate test coverage report
make test-coverage

# Clean built artifacts
make clean

# Generate documentation
make docs

# Development workflow (clean, build, install)
make dev
```

## Provider Configuration

### For Local Development (after `make install`)

```hcl
terraform {
  required_providers {
    kind = {
      source  = "kind.local/gigifokchiman/kind"
      version = "0.1.3"
    }
  }
}

provider "kind" {
  # Optional: specify docker host
  # docker_host = "tcp://localhost:2375"
}

resource "kind_cluster" "default" {
  name = "my-cluster"
  # other configuration...
}
```

### For Registry Installation (after `make install-registry`)

```hcl
terraform {
  required_providers {
    kind = {
      source  = "registry.terraform.io/gigifokchiman/kind"
      version = "0.1.3"
    }
  }
}

provider "kind" {
  # Optional: specify docker host
  # docker_host = "tcp://localhost:2375"
}

resource "kind_cluster" "default" {
  name = "my-cluster"
  # other configuration...
}
```

## Using the TypeScript SDK

Download the TypeScript SDK from [GitHub Releases](https://github.com/gigifokchiman/kind/releases) and use it in your CDKTF projects:

```typescript
import { App, TerraformStack } from "cdktf";
import { KindProvider } from "./path/to/downloaded/sdk";
import { Cluster } from "./path/to/downloaded/sdk";

class MyStack extends TerraformStack {
  constructor(scope: App, name: string) {
    super(scope, name);

    new KindProvider(this, "kind", {});

    new Cluster(this, "my-cluster", {
      name: "test-cluster",
      waitForReady: true,
    });
  }
}

const app = new App();
new MyStack(app, "my-stack");
app.synth();
```

## Using the Python SDK

Download the Python SDK from [GitHub Releases](https://github.com/gigifokchiman/kind/releases) and install it locally:

```bash
# Extract and install Python SDK
pip install ./python/dist/*.whl
```

```python
from cdktf import App, TerraformStack
from kind_provider import KindProvider, Cluster

class MyStack(TerraformStack):
    def __init__(self, scope: App, name: str):
        super().__init__(scope, name)
        
        KindProvider(self, "kind")
        
        Cluster(self, "my-cluster",
            name="test-cluster",
            wait_for_ready=True
        )

app = App()
MyStack(app, "my-stack")
app.synth()
```

## Troubleshooting

### Error: Failed to install provider

If you encounter installation errors:

1. Make sure you've run `make install` or `make install-registry`
2. Verify the correct provider source in your Terraform configuration
3. Run `terraform init` after installation
4. Check that the binary exists in the expected plugin directory

### Platform-Specific Notes

The Makefile automatically detects your OS and architecture. Supported platforms:
- macOS Intel: `darwin_amd64`
- macOS Apple Silicon: `darwin_arm64`
- Linux: `linux_amd64`
- Windows: `windows_amd64`

### Development Workflow

1. Make changes to the provider code
2. Run `make dev` to rebuild and reinstall
3. Run `terraform init` in your test configuration
4. Test your changes

## Important Notes

- Use `make install` for local development
- Use `make install-registry` to test registry-style installation
- Always run `terraform init` after installing or updating the provider
- The resource type is `kind_cluster` (not `mlplatform_kind_cluster`)