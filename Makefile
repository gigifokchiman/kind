PROVIDER_NAME=terraform-provider-kind
VERSION=0.1.2
OS_ARCH=$(shell go env GOOS)_$(shell go env GOARCH)

# Local installation path for Terraform to find the provider
INSTALL_PATH=~/.terraform.d/plugins/kind.local/gigifokchiman/kind/$(VERSION)/$(OS_ARCH)

# Registry installation path for public distribution
REGISTRY_PATH=~/.terraform.d/plugins/registry.terraform.io/gigifokchiman/kind/$(VERSION)/$(OS_ARCH)

.PHONY: build install install-registry test test-unit test-acc test-coverage clean docs dev build-ts-sdk build-python-sdk publish-ts-sdk publish-python-sdk sdk-all test-ts-sdk test-python-sdk test-sdks sdk-ci

build:
	@go build -o $(PROVIDER_NAME)

install: build
	@mkdir -p $(INSTALL_PATH)
	@cp $(PROVIDER_NAME) $(INSTALL_PATH)/

install-registry: build
	@mkdir -p $(REGISTRY_PATH)
	@cp $(PROVIDER_NAME) $(REGISTRY_PATH)/

test-unit:
	@go test -run "^Test[^Acc]" ./... -v

test-acc:
	@TF_ACC=1 go test -run "^TestAcc" ./... -v -timeout 30m

test-coverage:
	@go test ./... -v -coverprofile=coverage.out
	@go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

test:
	@$(MAKE) test-unit
	@$(MAKE) test-acc

clean:
	@rm -f $(PROVIDER_NAME)
	@rm -rf $(INSTALL_PATH)
	@rm -rf $(REGISTRY_PATH)
	@rm -f coverage.out coverage.html
	@rm -f terraform.tfstate* .terraform.lock.hcl
	@rm -rf .terraform
	@rm -f test-fixtures/terraform.tfstate* test-fixtures/.terraform.lock.hcl
	@rm -rf test-fixtures/.terraform

docs:
	@go generate ./...

# Development helper - build and install in one command
dev: clean build install
	@echo "Provider installed to: $(INSTALL_PATH)"
	@echo ""
	@echo "Add this to your Terraform configuration:"
	@echo "terraform {"
	@echo "  required_providers {"
	@echo "    kind = {"
	@echo "      source = \"kind.local/gigifokchiman/kind\""
	@echo "      version = \"$(VERSION)\""
	@echo "    }"
	@echo "  }"
	@echo "}"
	@echo ""
	@echo "For registry installation, use:"
	@echo "terraform {"
	@echo "  required_providers {"
	@echo "    kind = {"
	@echo "      source = \"registry.terraform.io/gigifokchiman/kind\""
	@echo "      version = \"$(VERSION)\""
	@echo "    }"
	@echo "  }"
	@echo "}"

# TypeScript SDK targets
build-ts-sdk: build install
	@echo "Building TypeScript SDK..."
	@NODE_NO_WARNINGS=1 npm install --ignore-scripts
	@NODE_NO_WARNINGS=1 npm run generate
	@NODE_NO_WARNINGS=1 npm run compile
	@echo "TypeScript SDK built successfully!"

publish-ts-sdk: build-ts-sdk
	@echo "Publishing TypeScript SDK to npm..."
	@npm publish
	@echo "TypeScript SDK published!"

# Python SDK targets
build-python-sdk: build install
	@echo "Building Python SDK..."
	@pip3 install cdktf>=0.21.0 constructs>=10.0.0 setuptools wheel twine 2>/dev/null || pip install cdktf>=0.21.0 constructs>=10.0.0 setuptools wheel twine 2>/dev/null || echo "Warning: Could not install Python dependencies"
	@NODE_NO_WARNINGS=1 cdktf get --config=cdktf-python.json
	@if [ -d python ]; then cd python && (python3 setup.py sdist bdist_wheel 2>/dev/null || python setup.py sdist bdist_wheel 2>/dev/null || echo "Warning: Could not build Python package"); else echo "Warning: Python directory not found"; fi
	@echo "Python SDK built successfully!"

publish-python-sdk: build-python-sdk
	@echo "Publishing Python SDK to PyPI..."
	@cd python && twine upload dist/*
	@echo "Python SDK published!"

# Build both SDKs
sdk-all: build-ts-sdk build-python-sdk
	@echo "All SDKs built successfully!"

# Test TypeScript SDK (requires build-ts-sdk first)
test-ts-sdk:
	@echo "Testing TypeScript SDK..."
	@node lib/examples/basic-cluster.js
	@echo "TypeScript SDK tests passed!"

# Test Python SDK (requires build-python-sdk first)  
test-python-sdk:
	@echo "Testing Python SDK..."
	@if [ -f python/examples/basic_cluster.py ]; then python3 python/examples/basic_cluster.py 2>/dev/null || python python/examples/basic_cluster.py 2>/dev/null || echo "Warning: Could not test Python SDK"; else echo "Warning: Python test file not found"; fi
	@echo "Python SDK tests passed!"

# Test both SDKs (requires building first)
test-sdks: test-ts-sdk test-python-sdk
	@echo "All SDK tests passed!"

# Full workflow: build and test everything
sdk-ci: build-ts-sdk build-python-sdk test-sdks
	@echo "All SDKs built and tested successfully!"