"use strict";
// Main entry point for the KIND CDKTF provider
// This will export the generated provider classes after running 'cdktf get'
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./examples/basic-cluster"), exports);
__exportStar(require("./examples/advanced-cluster"), exports);
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
//# sourceMappingURL=index.js.map