import { App, TerraformStack, TerraformOutput } from 'cdktf';
import { Construct } from 'constructs';
// Note: These imports will be available after running 'cdktf get'
// import { KindProvider } from '../.gen/providers/kind/provider';
// import { Cluster } from '../.gen/providers/kind/cluster';

class AdvancedKindClusterStack extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Initialize the KIND provider
    // new KindProvider(this, 'kind');

    // Create an advanced KIND cluster with multiple workers and custom configuration
    // const cluster = new Cluster(this, 'advanced-cluster', {
    //   name: 'production-like-cluster',
    //   config: `
    // kind: Cluster
    // apiVersion: kind.x-k8s.io/v1alpha4
    // networking:
    //   ipFamily: dual
    //   apiServerAddress: "127.0.0.1"
    //   apiServerPort: 6443
    // nodes:
    // - role: control-plane
    //   kubeadmConfigPatches:
    //   - |
    //     kind: InitConfiguration
    //     nodeRegistration:
    //       kubeletExtraArgs:
    //         node-labels: "ingress-ready=true"
    //         authorization-mode: "Webhook"
    //   extraPortMappings:
    //   - containerPort: 80
    //     hostPort: 8080
    //     protocol: TCP
    //   - containerPort: 443
    //     hostPort: 8443
    //     protocol: TCP
    //   - containerPort: 30000
    //     hostPort: 30000
    //     protocol: TCP
    // - role: worker
    //   extraMounts:
    //   - hostPath: /dev
    //     containerPath: /dev
    //     propagation: HostToContainer
    // - role: worker
    //   extraMounts:
    //   - hostPath: /proc
    //     containerPath: /host/proc
    //     readOnly: true
    //     propagation: HostToContainer
    // - role: worker
    //   `,
    //   extraMounts: [
    //     {
    //       hostPath: '/tmp/kind-data',
    //       containerPath: '/data',
    //       readOnly: false
    //     },
    //     {
    //       hostPath: '/var/log',
    //       containerPath: '/host/var/log',
    //       readOnly: true
    //     }
    //   ],
    //   nodeImage: 'kindest/node:v1.27.3@sha256:3966ac761ae0136263ffdb6cfd4db23ef8a83cba8a463690e98317add2c9ba72',
    //   retain: true,
    //   waitForReady: true
    // });

    // Example outputs
    // new TerraformOutput(this, 'cluster-name', {
    //   value: cluster.name,
    //   description: 'The name of the KIND cluster'
    // });
    // 
    // new TerraformOutput(this, 'cluster-endpoint', {
    //   value: cluster.endpoint,
    //   description: 'The cluster API server endpoint'
    // });
    // 
    // new TerraformOutput(this, 'kubeconfig-path', {
    //   value: cluster.kubeconfigPath,
    //   description: 'Path to the kubeconfig file'
    // });
    // 
    // new TerraformOutput(this, 'client-certificate', {
    //   value: cluster.clientCertificate,
    //   sensitive: true,
    //   description: 'Client certificate for cluster authentication'
    // });
    // 
    // new TerraformOutput(this, 'client-key', {
    //   value: cluster.clientKey,
    //   sensitive: true,
    //   description: 'Client key for cluster authentication'
    // });
    // 
    // new TerraformOutput(this, 'cluster-ca-certificate', {
    //   value: cluster.clusterCaCertificate,
    //   sensitive: true,
    //   description: 'Cluster CA certificate'
    // });
  }
}

// Example usage
const app = new App();
new AdvancedKindClusterStack(app, 'advanced-kind-cluster');
app.synth();

export { AdvancedKindClusterStack };