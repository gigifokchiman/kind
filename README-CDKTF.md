# KIND Terraform Provider - TypeScript CDK Integration

This directory contains TypeScript CDK for Terraform (CDKTF) bindings for the KIND provider.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate TypeScript bindings:**
   ```bash
   npm run generate
   ```

3. **Build the TypeScript code:**
   ```bash
   npm run build
   ```

## Usage Examples

### Basic Cluster

```typescript
import { App, TerraformStack } from 'cdktf';
import { KindProvider, Cluster } from '@chimanfok/kind-cdktf';

class MyStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    new KindProvider(this, 'kind');
    
    new Cluster(this, 'my-cluster', {
      name: 'development-cluster'
    });
  }
}

const app = new App();
new MyStack(app, 'my-stack');
app.synth();
```

### Advanced Cluster with Custom Configuration

```typescript
new Cluster(this, 'advanced-cluster', {
  name: 'production-cluster',
  config: `
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 80
    hostPort: 8080
- role: worker
- role: worker
  `,
  extraMounts: [{
    hostPath: '/tmp/data',
    containerPath: '/data'
  }]
});
```

## Development Workflow

1. **Make changes to the Go provider** (main.go, resource_kind_cluster.go, etc.)
2. **Build the provider:**
   ```bash
   make build
   ```
3. **Regenerate TypeScript bindings:**
   ```bash
   npm run generate
   ```
4. **Rebuild TypeScript:**
   ```bash
   npm run build
   ```

## Project Structure

```
terraform-provider-kind/
├── main.go                     # Go provider source
├── resource_kind_cluster.go    # Go provider source  
├── package.json               # npm configuration
├── tsconfig.json              # TypeScript configuration
├── cdktf.json                 # CDKTF configuration
├── src/
│   ├── index.ts              # Main TypeScript exports
│   ├── examples/             # TypeScript usage examples
│   └── .gen/                 # Generated TypeScript bindings (auto-generated)
└── lib/                      # Compiled JavaScript output
```

## Publishing

To publish the TypeScript SDK:

```bash
npm run build
npm publish
```

## Single Source, Multiple Targets

- **Source**: Go Terraform provider
- **Native Terraform**: Binary distribution 
- **TypeScript SDK**: Generated CDKTF bindings
- **Python SDK**: Can also be generated with CDKTF