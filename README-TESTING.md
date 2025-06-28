# Testing the ML Platform Terraform Provider

This document describes how to test the custom Terraform provider for Kind clusters.

## Test Structure

```
terraform-provider-mlplatform/
├── resource_kind_cluster_test.go      # Acceptance tests
├── resource_kind_cluster_unit_test.go  # Unit tests
├── provider_test.go                    # Provider tests
├── test-fixtures/                      # Test Terraform configs
│   ├── basic-cluster.tf               # Basic test configuration
│   └── full-config.tf                 # Full feature test
└── test-e2e.sh                        # End-to-end test script
```

## Running Tests

### Quick Start

```bash
# Run all tests
./test-e2e.sh

# Run only unit tests
./test-e2e.sh unit
make test-unit

# Run only acceptance tests
TF_ACC=1 ./test-e2e.sh acc
TF_ACC=1 make test-acc

# Run end-to-end tests
./test-e2e.sh e2e

# Generate coverage report
make test-coverage
```

### Unit Tests

Unit tests test individual functions without creating real resources:

```bash
go test -run "^Test[^Acc]" ./... -v
```

**What they test:**
- Configuration parsing
- Schema validation
- Helper functions
- Error handling

### Acceptance Tests

Acceptance tests create real Kind clusters to test the provider:

```bash
TF_ACC=1 go test -run "^TestAcc" ./... -v -timeout 30m
```

**What they test:**
- Cluster creation and deletion
- Port mapping configuration
- Multi-node clusters
- Import functionality
- External deletion handling

### End-to-End Tests

The E2E test script tests the complete workflow:

```bash
./test-e2e.sh
```

**What it does:**
1. Builds and installs the provider
2. Runs unit tests
3. Runs acceptance tests (if TF_ACC=1)
4. Tests real Terraform configurations
5. Generates coverage report
6. Cleans up resources

## Test Cases

### Basic Cluster Test
- Creates a simple Kind cluster
- Verifies cluster is accessible
- Tests computed attributes (endpoint, certificates)

### Configuration Test
- Tests custom node configuration
- Tests port mappings
- Tests kubeadm patches
- Tests multiple worker nodes

### Edge Cases
- Cluster already exists
- External deletion (disappears test)
- Invalid configurations
- Docker daemon unavailable

### Integration Test
- Creates cluster
- Configures Kubernetes provider
- Creates resources in the cluster
- Verifies end-to-end functionality

## Environment Variables

```bash
# Enable acceptance tests
export TF_ACC=1

# Use custom Docker host
export DOCKER_HOST=unix:///var/run/docker.sock

# Skip Kind tests
export SKIP_KIND_TESTS=1

# Enable debug logging
export TF_LOG=DEBUG
```

## Debugging Failed Tests

### Check test logs
```bash
TF_LOG=DEBUG go test -run TestAccKindCluster_basic -v
```

### Check Kind clusters
```bash
# List all clusters
kind get clusters

# Check cluster details
docker ps -a | grep kind

# Get cluster logs
kind export logs --name test-cluster
```

### Clean up stuck resources
```bash
# Delete test clusters
kind get clusters | grep "tf-acc-test" | xargs -I {} kind delete cluster --name {}

# Remove Docker containers
docker rm -f $(docker ps -aq -f name=kind)
```

## Writing New Tests

### Unit Test Template
```go
func TestMyFunction(t *testing.T) {
    tests := []struct {
        name     string
        input    string
        expected string
        wantErr  bool
    }{
        {
            name:     "valid input",
            input:    "test",
            expected: "result",
            wantErr:  false,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := myFunction(tt.input)
            if (err != nil) != tt.wantErr {
                t.Errorf("myFunction() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if got != tt.expected {
                t.Errorf("myFunction() = %v, want %v", got, tt.expected)
            }
        })
    }
}
```

### Acceptance Test Template
```go
func TestAccKindCluster_myFeature(t *testing.T) {
    rName := fmt.Sprintf("tf-acc-test-%s", acctest.RandString(10))
    resourceName := "mlplatform_kind_cluster.test"

    resource.Test(t, resource.TestCase{
        PreCheck:          func() { testAccPreCheck(t) },
        ProviderFactories: testAccProviderFactories,
        CheckDestroy:      testAccCheckKindClusterDestroy,
        Steps: []resource.TestStep{
            {
                Config: testAccKindClusterConfig_myFeature(rName),
                Check: resource.ComposeTestCheckFunc(
                    testAccCheckKindClusterExists(resourceName),
                    // Add your checks here
                ),
            },
        },
    })
}
```

## Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Go
      uses: actions/setup-go@v4
      with:
        go-version: '1.21'
    
    - name: Install Kind
      run: |
        curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
        chmod +x ./kind
        sudo mv ./kind /usr/local/bin/kind
    
    - name: Run tests
      run: |
        make test-unit
        TF_ACC=1 make test-acc
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.out
```

## Best Practices

1. **Always clean up resources** - Use defer statements and cleanup functions
2. **Use unique names** - Append random strings to avoid conflicts
3. **Test error cases** - Verify the provider handles errors gracefully
4. **Mock external calls** - Use interfaces for testability
5. **Keep tests fast** - Use parallel testing where possible
6. **Document test purpose** - Clear test names and comments

## Troubleshooting

### Common Issues

**"cluster already exists"**
```bash
kind delete cluster --name <cluster-name>
```

**"Docker daemon not accessible"**
```bash
# Check Docker is running
docker info

# Check socket permissions
ls -la /var/run/docker.sock
```

**"timeout waiting for cluster"**
- Increase timeout in test
- Check Docker resources (CPU/memory)
- Check for conflicting ports

**"failed to build provider"**
```bash
# Clean and rebuild
make clean
go mod tidy
make build
```