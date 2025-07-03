# Terraform Provider Installation Guide

## Installation Methods (macos)

### Method 1: Local Development Installation (Recommended)

Use the Makefile for easy local development:

```bash
make build
# Build and install for local development
make install
```

This will:
- Build the provider binary
- Install it to `~/.terraform.d/plugins/kind.local/gigifokchiman/kind/0.1.0/`
- Allow you to use the provider in your Terraform configurations

### Method 2: Registry-Style Installation

For testing registry-style installation:

```bash
# Build and install as if from registry
make install-registry
```

This installs to `~/.terraform.d/plugins/registry.terraform.io/gigifokchiman/kind/0.1.0/`

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
      version = "0.1.0"
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
      version = "0.1.0"
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