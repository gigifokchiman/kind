#!/bin/bash
set -e

# Suppress Node.js deprecation warnings
export NODE_NO_WARNINGS=1

echo "🏗️  Testing KIND Terraform Provider with TypeScript and Python CDKs"

# Install CDKTF CLI if not present
if ! command -v cdktf &> /dev/null; then
    echo "📦 Installing CDKTF CLI..."
    npm install -g cdktf-cli@latest
fi

# Clean and test all SDKs using Makefile
echo "🧹 Cleaning previous builds..."
make clean

echo "🚀 Building and testing all SDKs using Makefile..."
make sdk-ci

echo ""
echo "📊 Summary:"
echo "  ✓ Go provider built and installed locally"
echo "  ✓ TypeScript SDK generated and tested"
echo "  ✓ Python SDK generated and tested"
echo ""
echo "🔧 Available Makefile targets:"
echo "  make build-ts-sdk     - Build TypeScript SDK"
echo "  make build-python-sdk - Build Python SDK"
echo "  make sdk-all          - Build both SDKs"
echo "  make test-sdks        - Build and test both SDKs"
echo "  make publish-ts-sdk   - Publish TypeScript SDK to npm"
echo "  make publish-python-sdk - Publish Python SDK to PyPI"
echo ""
echo "🚀 When published, users can install:"
echo "  📦 npm install @chimanfok/kind-cdktf"
echo "  🐍 pip install kind-cdktf"