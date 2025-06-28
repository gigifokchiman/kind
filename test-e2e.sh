#!/bin/bash
set -euo pipefail

# End-to-end test script for the ML Platform Terraform provider

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    local level=$1
    shift
    local message="$*"
    
    case $level in
        "INFO")  echo -e "${BLUE}[INFO]${NC}  $message" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC}  $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $message" ;;
        "SUCCESS") echo -e "${GREEN}[SUCCESS]${NC} $message" ;;
    esac
}

# Check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."
    
    # Check for required tools
    for tool in go terraform kind kubectl docker; do
        if ! command -v "$tool" &> /dev/null; then
            log "ERROR" "$tool is not installed"
            exit 1
        fi
    done
    
    # Check Docker is running
    if ! docker info &> /dev/null; then
        log "ERROR" "Docker is not running"
        exit 1
    fi
    
    log "SUCCESS" "All prerequisites met"
}

# Build and install the provider
build_provider() {
    log "INFO" "Building and installing provider..."
    
    make clean
    make dev
    
    log "SUCCESS" "Provider built and installed"
}

# Run unit tests
run_unit_tests() {
    log "INFO" "Running unit tests..."
    
    make test-unit
    
    log "SUCCESS" "Unit tests passed"
}

# Run acceptance tests
run_acceptance_tests() {
    log "INFO" "Running acceptance tests..."
    
    # Clean up any existing test clusters
    kind get clusters | grep "tf-acc-test" | xargs -I {} kind delete cluster --name {} 2>/dev/null || true
    
    # Run acceptance tests
    TF_ACC=1 go test -run "^TestAcc" ./... -v -timeout 30m
    
    log "SUCCESS" "Acceptance tests passed"
}

# Test the provider with real Terraform configurations
test_terraform_configs() {
    log "INFO" "Testing Terraform configurations..."
    
    # Test basic configuration
    log "INFO" "Testing basic cluster configuration..."
    cd test-fixtures
    
    # Initialize Terraform
    terraform init
    
    # Plan and apply basic configuration
    terraform plan -var-file="basic-cluster.tf"
    terraform apply -auto-approve -var-file="basic-cluster.tf"
    
    # Verify cluster exists
    if ! kind get clusters | grep -q "test-basic-cluster"; then
        log "ERROR" "Basic cluster was not created"
        exit 1
    fi
    
    # Test that we can connect to the cluster
    kubectl --context kind-test-basic-cluster get nodes
    
    # Destroy the basic cluster
    terraform destroy -auto-approve -var-file="basic-cluster.tf"
    
    # Test full configuration
    log "INFO" "Testing full configuration..."
    terraform plan -var-file="full-config.tf"
    terraform apply -auto-approve -var-file="full-config.tf"
    
    # Verify full config cluster
    if ! kind get clusters | grep -q "test-full-config"; then
        log "ERROR" "Full config cluster was not created"
        exit 1
    fi
    
    # Verify namespace was created
    if ! kubectl --context kind-test-full-config get namespace test-namespace &> /dev/null; then
        log "ERROR" "Test namespace was not created"
        exit 1
    fi
    
    # Destroy the full config cluster
    terraform destroy -auto-approve -var-file="full-config.tf"
    
    cd ..
    log "SUCCESS" "Terraform configuration tests passed"
}

# Test coverage report
generate_coverage() {
    log "INFO" "Generating coverage report..."
    
    make test-coverage
    
    log "SUCCESS" "Coverage report generated: coverage.html"
}

# Clean up
cleanup() {
    log "INFO" "Cleaning up test resources..."
    
    # Delete any remaining test clusters
    kind get clusters | grep -E "(test-|tf-acc-test)" | xargs -I {} kind delete cluster --name {} 2>/dev/null || true
    
    # Clean build artifacts
    make clean
    
    log "SUCCESS" "Cleanup complete"
}

# Main test execution
main() {
    log "INFO" "Starting ML Platform Terraform Provider E2E Tests"
    
    # Set up error handling
    trap cleanup EXIT
    
    check_prerequisites
    build_provider
    run_unit_tests
    
    # Only run acceptance tests if TF_ACC is set
    if [[ "${TF_ACC:-}" == "1" ]]; then
        run_acceptance_tests
    else
        log "WARN" "Skipping acceptance tests (set TF_ACC=1 to run)"
    fi
    
    test_terraform_configs
    generate_coverage
    
    log "SUCCESS" "All tests passed!"
}

# Run with specific test only
if [[ "${1:-}" == "unit" ]]; then
    check_prerequisites
    build_provider
    run_unit_tests
elif [[ "${1:-}" == "acc" ]]; then
    check_prerequisites
    build_provider
    run_acceptance_tests
elif [[ "${1:-}" == "e2e" ]]; then
    check_prerequisites
    build_provider
    test_terraform_configs
else
    main
fi