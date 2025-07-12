"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KindClusterStack = void 0;
const cdktf_1 = require("cdktf");
// Note: These imports will be available after running 'cdktf get'
// import { KindProvider } from '../.gen/providers/kind/provider';
// import { Cluster } from '../.gen/providers/kind/cluster';
class KindClusterStack extends cdktf_1.TerraformStack {
    constructor(scope, id) {
        super(scope, id);
        // Initialize the KIND provider
        // new KindProvider(this, 'kind');
        // Create a basic KIND cluster
        // new Cluster(this, 'example-cluster', {
        //   name: 'my-development-cluster',
        //   config: `
        // kind: Cluster
        // apiVersion: kind.x-k8s.io/v1alpha4
        // nodes:
        // - role: control-plane
        //   kubeadmConfigPatches:
        //   - |
        //     kind: InitConfiguration
        //     nodeRegistration:
        //       kubeletExtraArgs:
        //         node-labels: "ingress-ready=true"
        //   extraPortMappings:
        //   - containerPort: 80
        //     hostPort: 80
        //     protocol: TCP
        //   - containerPort: 443
        //     hostPort: 443
        //     protocol: TCP
        // - role: worker
        // - role: worker
        //   `,
        //   extraMounts: [
        //     {
        //       hostPath: '/tmp/shared',
        //       containerPath: '/shared'
        //     }
        //   ]
        // });
        // Example outputs that would be available
        // Output the cluster endpoint and kubeconfig
        // new TerraformOutput(this, 'cluster-endpoint', {
        //   value: cluster.endpoint
        // });
        // 
        // new TerraformOutput(this, 'kubeconfig', {
        //   value: cluster.kubeconfig,
        //   sensitive: true
        // });
    }
}
exports.KindClusterStack = KindClusterStack;
// Example usage
const app = new cdktf_1.App();
new KindClusterStack(app, 'kind-cluster-example');
app.synth();
//# sourceMappingURL=basic-cluster.js.map