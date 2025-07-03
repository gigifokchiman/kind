# Testing Guide

This document focuses exclusively on testing the Terraform provider. For installation and usage, see [README.md](README.md).

## Test Structure

The provider uses multiple test layers:

```
tests/
├── resource_kind_cluster_test.go      # Acceptance tests (TF_ACC=1)
├── resource_kind_cluster_unit_test.go # Unit tests (no external deps)
├── provider_test.go                   # Provider configuration tests
├── test-fixtures/                     # Terraform test configurations
│   ├── basic-cluster.tf              # Basic test setup
│   └── full-config.tf               # Advanced features test
└── test-e2e.sh                      # End-to-end test script
```

## Test Types

### Unit Tests
Fast tests without external dependencies:
```bash
make test-unit
```

**Coverage:**
- Configuration parsing and validation
- Schema validation
- Helper functions
- Error handling logic

### Acceptance Tests
Integration tests with real Kind clusters:
```bash
TF_ACC=1 make test-acc
```

**Coverage:**
- Full resource lifecycle (create, read, update, delete)
- Multi-node cluster configurations
- Port mapping functionality
- Import/export scenarios
- External deletion handling

### End-to-End Tests
Complete workflow validation:
```bash
./test-e2e.sh
```

**What it validates:**
- Provider build and installation
- Real Terraform configurations
- Cluster accessibility via kubectl
- Full integration scenarios

## GitHub Actions CI

Automated testing runs on every push/PR:

### CI Pipeline (`.github/workflows/ci.yml`)
Triggers: Push to `master`/`main`, Pull Requests

**Test Steps:**
```yaml
- name: Set up Go
  uses: actions/setup-go@v5
  with:
    go-version: '1.21'

- name: Install dependencies
  run: |
    # kubectl, kind, terraform auto-installed
    
- name: Run unit tests
  run: make test-unit
  
- name: Run acceptance tests  
  run: TF_ACC=1 make test-acc
  
- name: Generate coverage report
  run: make test-coverage
  
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v4
```

### Build Pipeline (`.github/workflows/build.yml`)
Triggers: Git tags (`v*`), Manual dispatch

**Multi-Platform Builds:**
```yaml
strategy:
  matrix:
    include:
      - goos: linux,   goarch: amd64
      - goos: linux,   goarch: arm64
      - goos: darwin,  goarch: amd64  
      - goos: darwin,  goarch: arm64  # Apple Silicon
      - goos: windows, goarch: amd64
      - goos: windows, goarch: arm64
```

**Release Process:**
1. Build binaries for all platforms
2. Create archives (`.tar.gz` for Unix, `.zip` for Windows)
3. Upload artifacts
4. Create GitHub release with binaries

## Test Environment Setup

### Prerequisites
```bash
# Quick dependency check
./install-deps.sh --check

# Install missing dependencies
./install-deps.sh
```

### Environment Variables
```bash
# Enable acceptance tests
export TF_ACC=1

# Custom Docker configuration
export DOCKER_HOST=unix:///var/run/docker.sock

# Debug logging
export TF_LOG=DEBUG
export TF_LOG_PATH=./terraform.log

# Skip certain tests
export SKIP_KIND_TESTS=1
```

## Debugging Test Failures

### Test-Specific Debugging
```bash
# Run single test with debug logging
TF_LOG=DEBUG go test -run TestAccKindCluster_basic -v -timeout 30m

# Run with race detection
go test -race -run TestAccKindCluster_basic

# Check test artifacts
ls -la test-fixtures/
```

### Cluster State Inspection
```bash
# List active test clusters
kind get clusters | grep tf-acc-test

# Inspect cluster details
kubectl --context kind-tf-acc-test-cluster get nodes

# Export cluster logs
kind export logs --name tf-acc-test-cluster ./logs/

# Check Docker containers
docker ps -f name=kind
```

### Cleanup Stuck Resources
```bash
# Clean test clusters
kind get clusters | grep "tf-acc-test" | xargs -I {} kind delete cluster --name {}

# Remove orphaned containers
docker rm -f $(docker ps -aq -f name=kind)

# Clean Terraform state
make clean
```

## Writing Tests

### Unit Test Pattern
```go
func TestKindConfigGeneration(t *testing.T) {
    tests := []struct {
        name        string
        input       map[string]interface{}
        expected    map[string]interface{}
        expectError bool
    }{
        {
            name: "basic configuration",
            input: map[string]interface{}{
                "node_image": "kindest/node:v1.28.0",
            },
            expected: map[string]interface{}{
                "kind": "Cluster",
                "apiVersion": "kind.x-k8s.io/v1alpha4",
            },
            expectError: false,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := generateKindConfig(tt.input)
            if tt.expectError {
                assert.Error(t, err)
                return
            }
            assert.NoError(t, err)
            assert.Equal(t, tt.expected["kind"], result["kind"])
        })
    }
}
```

### Acceptance Test Pattern
```go
func TestAccKindCluster_portMapping(t *testing.T) {
    rName := fmt.Sprintf("tf-acc-test-%s", acctest.RandString(8))
    resourceName := "kind_cluster.test"

    resource.Test(t, resource.TestCase{
        PreCheck:          func() { testAccPreCheck(t) },
        ProviderFactories: testAccProviderFactories,
        CheckDestroy:      testAccCheckKindClusterDestroy,
        Steps: []resource.TestStep{
            {
                Config: testAccKindClusterConfig_portMapping(rName),
                Check: resource.ComposeTestCheckFunc(
                    testAccCheckKindClusterExists(resourceName),
                    resource.TestCheckResourceAttr(resourceName, "name", rName),
                    resource.TestCheckResourceAttrSet(resourceName, "endpoint"),
                    testAccCheckPortMapping(resourceName, 8080, 30080),
                ),
            },
        },
    })
}
```

## Performance Testing

### Load Testing
```bash
# Test multiple clusters concurrently
TF_ACC=1 go test -run TestAccKindCluster -parallel 4

# Memory usage monitoring
TF_ACC=1 go test -memprofile=mem.prof -run TestAccKindCluster_basic

# CPU profiling
TF_ACC=1 go test -cpuprofile=cpu.prof -run TestAccKindCluster_basic
```

### Resource Limits
```bash
# Set Docker resource limits for testing
docker update --memory 1g --cpus 0.5 kind-control-plane
```

## Test Coverage

### Generate Coverage Reports
```bash
# Unit test coverage
go test -coverprofile=unit.out ./... -run "^Test[^Acc]"

# Acceptance test coverage
TF_ACC=1 go test -coverprofile=acc.out ./... -run "^TestAcc"

# Combined coverage
make test-coverage
open coverage.html
```

### Coverage Goals
- **Unit tests**: >90% line coverage
- **Acceptance tests**: All major user workflows
- **Integration tests**: End-to-end scenarios

## Common Test Issues

### Timing Issues
```bash
# Increase test timeouts
go test -timeout 45m -run TestAccKindCluster_basic

# Add retry logic for flaky operations
resource.Retry(5*time.Minute, func() *resource.RetryError {
    // retry logic
})
```

### Resource Conflicts
```bash
# Use unique test names
rName := fmt.Sprintf("tf-acc-test-%d", time.Now().Unix())

# Cleanup in defer blocks
defer func() {
    kind delete cluster --name $rName
}()
```

### CI-Specific Issues
```bash
# GitHub Actions debugging
echo "::debug::Cluster creation started"
echo "::error::Cluster creation failed"

# Check runner resources
free -h
df -h
docker system df
```

## Test Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up resources (use defer)
3. **Naming**: Use descriptive test names with context
4. **Speed**: Keep unit tests fast, acceptance tests thorough
5. **Reliability**: Handle timing issues and retries
6. **Coverage**: Test both success and failure scenarios