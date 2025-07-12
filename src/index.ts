// Main entry point for the KIND CDKTF provider
// This will export the generated provider classes after running 'cdktf get'

export * from './examples/basic-cluster';
export * from './examples/advanced-cluster';

// These exports will be available after code generation
// export { KindProvider } from './.gen/providers/kind/provider';
// export { Cluster } from './.gen/providers/kind/cluster';

// Type definitions that will be generated
// export interface ClusterConfig {
//   name: string;
//   config?: string;
//   extraMounts?: Array<{
//     hostPath: string;
//     containerPath: string;
//     readOnly?: boolean;
//     propagation?: string;
//   }>;
//   nodeImage?: string;
//   retain?: boolean;
//   waitForReady?: boolean;
// }