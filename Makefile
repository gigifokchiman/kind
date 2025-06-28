PROVIDER_NAME=terraform-provider-mlplatform
VERSION=0.1.0
OS_ARCH=$(shell go env GOOS)_$(shell go env GOARCH)

# Local installation path for Terraform to find the provider
INSTALL_PATH=~/.terraform.d/plugins/mlplatform.local/your-org/mlplatform/$(VERSION)/$(OS_ARCH)

.PHONY: build install test clean docs

build:
	go build -o $(PROVIDER_NAME)

install: build
	mkdir -p $(INSTALL_PATH)
	cp $(PROVIDER_NAME) $(INSTALL_PATH)/

test:
	go test ./... -v

test-unit:
	go test -run "^Test[^Acc]" ./... -v

test-acc:
	TF_ACC=1 go test -run "^TestAcc" ./... -v -timeout 30m

test-coverage:
	go test ./... -v -coverprofile=coverage.out
	go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report generated: coverage.html"

clean:
	rm -f $(PROVIDER_NAME)
	rm -rf $(INSTALL_PATH)

docs:
	go generate ./...

# Development helper - build and install in one command
dev: clean build install
	@echo "Provider installed to: $(INSTALL_PATH)"
	@echo ""
	@echo "Add this to your Terraform configuration:"
	@echo "terraform {"
	@echo "  required_providers {"
	@echo "    mlplatform = {"
	@echo "      source = \"mlplatform.local/your-org/mlplatform\""
	@echo "      version = \"$(VERSION)\""
	@echo "    }"
	@echo "  }"
	@echo "}"