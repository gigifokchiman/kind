PROVIDER_NAME=terraform-provider-kind
VERSION=0.1.0
OS_ARCH=$(shell go env GOOS)_$(shell go env GOARCH)

# Local installation path for Terraform to find the provider
INSTALL_PATH=~/.terraform.d/plugins/kind.local/gigifokchiman/kind/$(VERSION)/$(OS_ARCH)

# Registry installation path for public distribution
REGISTRY_PATH=~/.terraform.d/plugins/registry.terraform.io/gigifokchiman/kind/$(VERSION)/$(OS_ARCH)

.PHONY: build install install-registry test test-unit test-acc test-coverage clean docs dev

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