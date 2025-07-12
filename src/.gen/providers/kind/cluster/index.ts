// https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface ClusterConfig extends cdktf.TerraformMetaArguments {
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#id Cluster#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * The name of the Kind cluster
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#name Cluster#name}
  */
  readonly name: string;
  /**
  * Docker image to use for cluster nodes
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#node_image Cluster#node_image}
  */
  readonly nodeImage?: string;
  /**
  * Wait for the cluster to be ready
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#wait_for_ready Cluster#wait_for_ready}
  */
  readonly waitForReady?: boolean | cdktf.IResolvable;
  /**
  * kind_config block
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#kind_config Cluster#kind_config}
  */
  readonly kindConfig?: ClusterKindConfig;
  /**
  * timeouts block
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#timeouts Cluster#timeouts}
  */
  readonly timeouts?: ClusterTimeouts;
}
export interface ClusterKindConfigNodeExtraMounts {
  /**
  * Path in the container to mount to
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#container_path Cluster#container_path}
  */
  readonly containerPath: string;
  /**
  * Path on the host to mount
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#host_path Cluster#host_path}
  */
  readonly hostPath: string;
  /**
  * Mount propagation mode
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#propagation Cluster#propagation}
  */
  readonly propagation?: string;
  /**
  * Mount as read-only
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#readonly Cluster#readonly}
  */
  readonly readonly?: boolean | cdktf.IResolvable;
  /**
  * Enable SELinux relabeling
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#selinux_relabel Cluster#selinux_relabel}
  */
  readonly selinuxRelabel?: boolean | cdktf.IResolvable;
}

export function clusterKindConfigNodeExtraMountsToTerraform(struct?: ClusterKindConfigNodeExtraMounts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    container_path: cdktf.stringToTerraform(struct!.containerPath),
    host_path: cdktf.stringToTerraform(struct!.hostPath),
    propagation: cdktf.stringToTerraform(struct!.propagation),
    readonly: cdktf.booleanToTerraform(struct!.readonly),
    selinux_relabel: cdktf.booleanToTerraform(struct!.selinuxRelabel),
  }
}


export function clusterKindConfigNodeExtraMountsToHclTerraform(struct?: ClusterKindConfigNodeExtraMounts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    container_path: {
      value: cdktf.stringToHclTerraform(struct!.containerPath),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    host_path: {
      value: cdktf.stringToHclTerraform(struct!.hostPath),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    propagation: {
      value: cdktf.stringToHclTerraform(struct!.propagation),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    readonly: {
      value: cdktf.booleanToHclTerraform(struct!.readonly),
      isBlock: false,
      type: "simple",
      storageClassType: "boolean",
    },
    selinux_relabel: {
      value: cdktf.booleanToHclTerraform(struct!.selinuxRelabel),
      isBlock: false,
      type: "simple",
      storageClassType: "boolean",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class ClusterKindConfigNodeExtraMountsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param complexObjectIndex the index of this item in the list
  * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean) {
    super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
  }

  public get internalValue(): ClusterKindConfigNodeExtraMounts | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._containerPath !== undefined) {
      hasAnyValues = true;
      internalValueResult.containerPath = this._containerPath;
    }
    if (this._hostPath !== undefined) {
      hasAnyValues = true;
      internalValueResult.hostPath = this._hostPath;
    }
    if (this._propagation !== undefined) {
      hasAnyValues = true;
      internalValueResult.propagation = this._propagation;
    }
    if (this._readonly !== undefined) {
      hasAnyValues = true;
      internalValueResult.readonly = this._readonly;
    }
    if (this._selinuxRelabel !== undefined) {
      hasAnyValues = true;
      internalValueResult.selinuxRelabel = this._selinuxRelabel;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: ClusterKindConfigNodeExtraMounts | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._containerPath = undefined;
      this._hostPath = undefined;
      this._propagation = undefined;
      this._readonly = undefined;
      this._selinuxRelabel = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._containerPath = value.containerPath;
      this._hostPath = value.hostPath;
      this._propagation = value.propagation;
      this._readonly = value.readonly;
      this._selinuxRelabel = value.selinuxRelabel;
    }
  }

  // container_path - computed: false, optional: false, required: true
  private _containerPath?: string; 
  public get containerPath() {
    return this.getStringAttribute('container_path');
  }
  public set containerPath(value: string) {
    this._containerPath = value;
  }
  // Temporarily expose input value. Use with caution.
  public get containerPathInput() {
    return this._containerPath;
  }

  // host_path - computed: false, optional: false, required: true
  private _hostPath?: string; 
  public get hostPath() {
    return this.getStringAttribute('host_path');
  }
  public set hostPath(value: string) {
    this._hostPath = value;
  }
  // Temporarily expose input value. Use with caution.
  public get hostPathInput() {
    return this._hostPath;
  }

  // propagation - computed: false, optional: true, required: false
  private _propagation?: string; 
  public get propagation() {
    return this.getStringAttribute('propagation');
  }
  public set propagation(value: string) {
    this._propagation = value;
  }
  public resetPropagation() {
    this._propagation = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get propagationInput() {
    return this._propagation;
  }

  // readonly - computed: false, optional: true, required: false
  private _readonly?: boolean | cdktf.IResolvable; 
  public get readonly() {
    return this.getBooleanAttribute('readonly');
  }
  public set readonly(value: boolean | cdktf.IResolvable) {
    this._readonly = value;
  }
  public resetReadonly() {
    this._readonly = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get readonlyInput() {
    return this._readonly;
  }

  // selinux_relabel - computed: false, optional: true, required: false
  private _selinuxRelabel?: boolean | cdktf.IResolvable; 
  public get selinuxRelabel() {
    return this.getBooleanAttribute('selinux_relabel');
  }
  public set selinuxRelabel(value: boolean | cdktf.IResolvable) {
    this._selinuxRelabel = value;
  }
  public resetSelinuxRelabel() {
    this._selinuxRelabel = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get selinuxRelabelInput() {
    return this._selinuxRelabel;
  }
}

export class ClusterKindConfigNodeExtraMountsList extends cdktf.ComplexList {
  public internalValue? : ClusterKindConfigNodeExtraMounts[] | cdktf.IResolvable

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param wrapsSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  constructor(protected terraformResource: cdktf.IInterpolatingParent, protected terraformAttribute: string, protected wrapsSet: boolean) {
    super(terraformResource, terraformAttribute, wrapsSet)
  }

  /**
  * @param index the index of the item to return
  */
  public get(index: number): ClusterKindConfigNodeExtraMountsOutputReference {
    return new ClusterKindConfigNodeExtraMountsOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}
export interface ClusterKindConfigNodeExtraPortMappings {
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#container_port Cluster#container_port}
  */
  readonly containerPort: number;
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#host_port Cluster#host_port}
  */
  readonly hostPort: number;
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#protocol Cluster#protocol}
  */
  readonly protocol?: string;
}

export function clusterKindConfigNodeExtraPortMappingsToTerraform(struct?: ClusterKindConfigNodeExtraPortMappings | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    container_port: cdktf.numberToTerraform(struct!.containerPort),
    host_port: cdktf.numberToTerraform(struct!.hostPort),
    protocol: cdktf.stringToTerraform(struct!.protocol),
  }
}


export function clusterKindConfigNodeExtraPortMappingsToHclTerraform(struct?: ClusterKindConfigNodeExtraPortMappings | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    container_port: {
      value: cdktf.numberToHclTerraform(struct!.containerPort),
      isBlock: false,
      type: "simple",
      storageClassType: "number",
    },
    host_port: {
      value: cdktf.numberToHclTerraform(struct!.hostPort),
      isBlock: false,
      type: "simple",
      storageClassType: "number",
    },
    protocol: {
      value: cdktf.stringToHclTerraform(struct!.protocol),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class ClusterKindConfigNodeExtraPortMappingsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param complexObjectIndex the index of this item in the list
  * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean) {
    super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
  }

  public get internalValue(): ClusterKindConfigNodeExtraPortMappings | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._containerPort !== undefined) {
      hasAnyValues = true;
      internalValueResult.containerPort = this._containerPort;
    }
    if (this._hostPort !== undefined) {
      hasAnyValues = true;
      internalValueResult.hostPort = this._hostPort;
    }
    if (this._protocol !== undefined) {
      hasAnyValues = true;
      internalValueResult.protocol = this._protocol;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: ClusterKindConfigNodeExtraPortMappings | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._containerPort = undefined;
      this._hostPort = undefined;
      this._protocol = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._containerPort = value.containerPort;
      this._hostPort = value.hostPort;
      this._protocol = value.protocol;
    }
  }

  // container_port - computed: false, optional: false, required: true
  private _containerPort?: number; 
  public get containerPort() {
    return this.getNumberAttribute('container_port');
  }
  public set containerPort(value: number) {
    this._containerPort = value;
  }
  // Temporarily expose input value. Use with caution.
  public get containerPortInput() {
    return this._containerPort;
  }

  // host_port - computed: false, optional: false, required: true
  private _hostPort?: number; 
  public get hostPort() {
    return this.getNumberAttribute('host_port');
  }
  public set hostPort(value: number) {
    this._hostPort = value;
  }
  // Temporarily expose input value. Use with caution.
  public get hostPortInput() {
    return this._hostPort;
  }

  // protocol - computed: false, optional: true, required: false
  private _protocol?: string; 
  public get protocol() {
    return this.getStringAttribute('protocol');
  }
  public set protocol(value: string) {
    this._protocol = value;
  }
  public resetProtocol() {
    this._protocol = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get protocolInput() {
    return this._protocol;
  }
}

export class ClusterKindConfigNodeExtraPortMappingsList extends cdktf.ComplexList {
  public internalValue? : ClusterKindConfigNodeExtraPortMappings[] | cdktf.IResolvable

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param wrapsSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  constructor(protected terraformResource: cdktf.IInterpolatingParent, protected terraformAttribute: string, protected wrapsSet: boolean) {
    super(terraformResource, terraformAttribute, wrapsSet)
  }

  /**
  * @param index the index of the item to return
  */
  public get(index: number): ClusterKindConfigNodeExtraPortMappingsOutputReference {
    return new ClusterKindConfigNodeExtraPortMappingsOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}
export interface ClusterKindConfigNode {
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#kubeadm_config_patches Cluster#kubeadm_config_patches}
  */
  readonly kubeadmConfigPatches?: string[];
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#role Cluster#role}
  */
  readonly role: string;
  /**
  * extra_mounts block
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#extra_mounts Cluster#extra_mounts}
  */
  readonly extraMounts?: ClusterKindConfigNodeExtraMounts[] | cdktf.IResolvable;
  /**
  * extra_port_mappings block
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#extra_port_mappings Cluster#extra_port_mappings}
  */
  readonly extraPortMappings?: ClusterKindConfigNodeExtraPortMappings[] | cdktf.IResolvable;
}

export function clusterKindConfigNodeToTerraform(struct?: ClusterKindConfigNode | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    kubeadm_config_patches: cdktf.listMapper(cdktf.stringToTerraform, false)(struct!.kubeadmConfigPatches),
    role: cdktf.stringToTerraform(struct!.role),
    extra_mounts: cdktf.listMapper(clusterKindConfigNodeExtraMountsToTerraform, true)(struct!.extraMounts),
    extra_port_mappings: cdktf.listMapper(clusterKindConfigNodeExtraPortMappingsToTerraform, true)(struct!.extraPortMappings),
  }
}


export function clusterKindConfigNodeToHclTerraform(struct?: ClusterKindConfigNode | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    kubeadm_config_patches: {
      value: cdktf.listMapperHcl(cdktf.stringToHclTerraform, false)(struct!.kubeadmConfigPatches),
      isBlock: false,
      type: "list",
      storageClassType: "stringList",
    },
    role: {
      value: cdktf.stringToHclTerraform(struct!.role),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    extra_mounts: {
      value: cdktf.listMapperHcl(clusterKindConfigNodeExtraMountsToHclTerraform, true)(struct!.extraMounts),
      isBlock: true,
      type: "list",
      storageClassType: "ClusterKindConfigNodeExtraMountsList",
    },
    extra_port_mappings: {
      value: cdktf.listMapperHcl(clusterKindConfigNodeExtraPortMappingsToHclTerraform, true)(struct!.extraPortMappings),
      isBlock: true,
      type: "list",
      storageClassType: "ClusterKindConfigNodeExtraPortMappingsList",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class ClusterKindConfigNodeOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param complexObjectIndex the index of this item in the list
  * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean) {
    super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
  }

  public get internalValue(): ClusterKindConfigNode | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._kubeadmConfigPatches !== undefined) {
      hasAnyValues = true;
      internalValueResult.kubeadmConfigPatches = this._kubeadmConfigPatches;
    }
    if (this._role !== undefined) {
      hasAnyValues = true;
      internalValueResult.role = this._role;
    }
    if (this._extraMounts?.internalValue !== undefined) {
      hasAnyValues = true;
      internalValueResult.extraMounts = this._extraMounts?.internalValue;
    }
    if (this._extraPortMappings?.internalValue !== undefined) {
      hasAnyValues = true;
      internalValueResult.extraPortMappings = this._extraPortMappings?.internalValue;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: ClusterKindConfigNode | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._kubeadmConfigPatches = undefined;
      this._role = undefined;
      this._extraMounts.internalValue = undefined;
      this._extraPortMappings.internalValue = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._kubeadmConfigPatches = value.kubeadmConfigPatches;
      this._role = value.role;
      this._extraMounts.internalValue = value.extraMounts;
      this._extraPortMappings.internalValue = value.extraPortMappings;
    }
  }

  // kubeadm_config_patches - computed: false, optional: true, required: false
  private _kubeadmConfigPatches?: string[]; 
  public get kubeadmConfigPatches() {
    return this.getListAttribute('kubeadm_config_patches');
  }
  public set kubeadmConfigPatches(value: string[]) {
    this._kubeadmConfigPatches = value;
  }
  public resetKubeadmConfigPatches() {
    this._kubeadmConfigPatches = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get kubeadmConfigPatchesInput() {
    return this._kubeadmConfigPatches;
  }

  // role - computed: false, optional: false, required: true
  private _role?: string; 
  public get role() {
    return this.getStringAttribute('role');
  }
  public set role(value: string) {
    this._role = value;
  }
  // Temporarily expose input value. Use with caution.
  public get roleInput() {
    return this._role;
  }

  // extra_mounts - computed: false, optional: true, required: false
  private _extraMounts = new ClusterKindConfigNodeExtraMountsList(this, "extra_mounts", false);
  public get extraMounts() {
    return this._extraMounts;
  }
  public putExtraMounts(value: ClusterKindConfigNodeExtraMounts[] | cdktf.IResolvable) {
    this._extraMounts.internalValue = value;
  }
  public resetExtraMounts() {
    this._extraMounts.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get extraMountsInput() {
    return this._extraMounts.internalValue;
  }

  // extra_port_mappings - computed: false, optional: true, required: false
  private _extraPortMappings = new ClusterKindConfigNodeExtraPortMappingsList(this, "extra_port_mappings", false);
  public get extraPortMappings() {
    return this._extraPortMappings;
  }
  public putExtraPortMappings(value: ClusterKindConfigNodeExtraPortMappings[] | cdktf.IResolvable) {
    this._extraPortMappings.internalValue = value;
  }
  public resetExtraPortMappings() {
    this._extraPortMappings.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get extraPortMappingsInput() {
    return this._extraPortMappings.internalValue;
  }
}

export class ClusterKindConfigNodeList extends cdktf.ComplexList {
  public internalValue? : ClusterKindConfigNode[] | cdktf.IResolvable

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param wrapsSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  constructor(protected terraformResource: cdktf.IInterpolatingParent, protected terraformAttribute: string, protected wrapsSet: boolean) {
    super(terraformResource, terraformAttribute, wrapsSet)
  }

  /**
  * @param index the index of the item to return
  */
  public get(index: number): ClusterKindConfigNodeOutputReference {
    return new ClusterKindConfigNodeOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}
export interface ClusterKindConfig {
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#api_version Cluster#api_version}
  */
  readonly apiVersion?: string;
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#kind Cluster#kind}
  */
  readonly kind?: string;
  /**
  * node block
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#node Cluster#node}
  */
  readonly nodeAttribute?: ClusterKindConfigNode[] | cdktf.IResolvable;
}

export function clusterKindConfigToTerraform(struct?: ClusterKindConfigOutputReference | ClusterKindConfig): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    api_version: cdktf.stringToTerraform(struct!.apiVersion),
    kind: cdktf.stringToTerraform(struct!.kind),
    node: cdktf.listMapper(clusterKindConfigNodeToTerraform, true)(struct!.nodeAttribute),
  }
}


export function clusterKindConfigToHclTerraform(struct?: ClusterKindConfigOutputReference | ClusterKindConfig): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    api_version: {
      value: cdktf.stringToHclTerraform(struct!.apiVersion),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    kind: {
      value: cdktf.stringToHclTerraform(struct!.kind),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    node: {
      value: cdktf.listMapperHcl(clusterKindConfigNodeToHclTerraform, true)(struct!.nodeAttribute),
      isBlock: true,
      type: "list",
      storageClassType: "ClusterKindConfigNodeList",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class ClusterKindConfigOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false, 0);
  }

  public get internalValue(): ClusterKindConfig | undefined {
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._apiVersion !== undefined) {
      hasAnyValues = true;
      internalValueResult.apiVersion = this._apiVersion;
    }
    if (this._kind !== undefined) {
      hasAnyValues = true;
      internalValueResult.kind = this._kind;
    }
    if (this._node?.internalValue !== undefined) {
      hasAnyValues = true;
      internalValueResult.nodeAttribute = this._node?.internalValue;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: ClusterKindConfig | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this._apiVersion = undefined;
      this._kind = undefined;
      this._node.internalValue = undefined;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this._apiVersion = value.apiVersion;
      this._kind = value.kind;
      this._node.internalValue = value.nodeAttribute;
    }
  }

  // api_version - computed: false, optional: true, required: false
  private _apiVersion?: string; 
  public get apiVersion() {
    return this.getStringAttribute('api_version');
  }
  public set apiVersion(value: string) {
    this._apiVersion = value;
  }
  public resetApiVersion() {
    this._apiVersion = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get apiVersionInput() {
    return this._apiVersion;
  }

  // kind - computed: false, optional: true, required: false
  private _kind?: string; 
  public get kind() {
    return this.getStringAttribute('kind');
  }
  public set kind(value: string) {
    this._kind = value;
  }
  public resetKind() {
    this._kind = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get kindInput() {
    return this._kind;
  }

  // node - computed: false, optional: true, required: false
  private _node = new ClusterKindConfigNodeList(this, "node", false);
  public get nodeAttribute() {
    return this._node;
  }
  public putNodeAttribute(value: ClusterKindConfigNode[] | cdktf.IResolvable) {
    this._node.internalValue = value;
  }
  public resetNodeAttribute() {
    this._node.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get nodeAttributeInput() {
    return this._node.internalValue;
  }
}
export interface ClusterTimeouts {
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#create Cluster#create}
  */
  readonly create?: string;
  /**
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#delete Cluster#delete}
  */
  readonly delete?: string;
}

export function clusterTimeoutsToTerraform(struct?: ClusterTimeouts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    create: cdktf.stringToTerraform(struct!.create),
    delete: cdktf.stringToTerraform(struct!.delete),
  }
}


export function clusterTimeoutsToHclTerraform(struct?: ClusterTimeouts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  const attrs = {
    create: {
      value: cdktf.stringToHclTerraform(struct!.create),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
    delete: {
      value: cdktf.stringToHclTerraform(struct!.delete),
      isBlock: false,
      type: "simple",
      storageClassType: "string",
    },
  };

  // remove undefined attributes
  return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined));
}

export class ClusterTimeoutsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false);
  }

  public get internalValue(): ClusterTimeouts | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._create !== undefined) {
      hasAnyValues = true;
      internalValueResult.create = this._create;
    }
    if (this._delete !== undefined) {
      hasAnyValues = true;
      internalValueResult.delete = this._delete;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: ClusterTimeouts | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._create = undefined;
      this._delete = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._create = value.create;
      this._delete = value.delete;
    }
  }

  // create - computed: false, optional: true, required: false
  private _create?: string; 
  public get create() {
    return this.getStringAttribute('create');
  }
  public set create(value: string) {
    this._create = value;
  }
  public resetCreate() {
    this._create = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get createInput() {
    return this._create;
  }

  // delete - computed: false, optional: true, required: false
  private _delete?: string; 
  public get delete() {
    return this.getStringAttribute('delete');
  }
  public set delete(value: string) {
    this._delete = value;
  }
  public resetDelete() {
    this._delete = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get deleteInput() {
    return this._delete;
  }
}

/**
* Represents a {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster kind_cluster}
*/
export class Cluster extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "kind_cluster";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a Cluster resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the Cluster to import
  * @param importFromId The id of the existing Cluster that should be imported. Refer to the {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the Cluster to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "kind_cluster", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs/resources/cluster kind_cluster} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options ClusterConfig
  */
  public constructor(scope: Construct, id: string, config: ClusterConfig) {
    super(scope, id, {
      terraformResourceType: 'kind_cluster',
      terraformGeneratorMetadata: {
        providerName: 'kind',
        providerVersion: '0.1.3',
        providerVersionConstraint: '0.1.3'
      },
      provider: config.provider,
      dependsOn: config.dependsOn,
      count: config.count,
      lifecycle: config.lifecycle,
      provisioners: config.provisioners,
      connection: config.connection,
      forEach: config.forEach
    });
    this._id = config.id;
    this._name = config.name;
    this._nodeImage = config.nodeImage;
    this._waitForReady = config.waitForReady;
    this._kindConfig.internalValue = config.kindConfig;
    this._timeouts.internalValue = config.timeouts;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // client_certificate - computed: true, optional: false, required: false
  public get clientCertificate() {
    return this.getStringAttribute('client_certificate');
  }

  // client_key - computed: true, optional: false, required: false
  public get clientKey() {
    return this.getStringAttribute('client_key');
  }

  // cluster_ca_certificate - computed: true, optional: false, required: false
  public get clusterCaCertificate() {
    return this.getStringAttribute('cluster_ca_certificate');
  }

  // endpoint - computed: true, optional: false, required: false
  public get endpoint() {
    return this.getStringAttribute('endpoint');
  }

  // id - computed: true, optional: true, required: false
  private _id?: string; 
  public get id() {
    return this.getStringAttribute('id');
  }
  public set id(value: string) {
    this._id = value;
  }
  public resetId() {
    this._id = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get idInput() {
    return this._id;
  }

  // kubeconfig_path - computed: true, optional: false, required: false
  public get kubeconfigPath() {
    return this.getStringAttribute('kubeconfig_path');
  }

  // name - computed: false, optional: false, required: true
  private _name?: string; 
  public get name() {
    return this.getStringAttribute('name');
  }
  public set name(value: string) {
    this._name = value;
  }
  // Temporarily expose input value. Use with caution.
  public get nameInput() {
    return this._name;
  }

  // node_image - computed: false, optional: true, required: false
  private _nodeImage?: string; 
  public get nodeImage() {
    return this.getStringAttribute('node_image');
  }
  public set nodeImage(value: string) {
    this._nodeImage = value;
  }
  public resetNodeImage() {
    this._nodeImage = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get nodeImageInput() {
    return this._nodeImage;
  }

  // wait_for_ready - computed: false, optional: true, required: false
  private _waitForReady?: boolean | cdktf.IResolvable; 
  public get waitForReady() {
    return this.getBooleanAttribute('wait_for_ready');
  }
  public set waitForReady(value: boolean | cdktf.IResolvable) {
    this._waitForReady = value;
  }
  public resetWaitForReady() {
    this._waitForReady = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get waitForReadyInput() {
    return this._waitForReady;
  }

  // kind_config - computed: false, optional: true, required: false
  private _kindConfig = new ClusterKindConfigOutputReference(this, "kind_config");
  public get kindConfig() {
    return this._kindConfig;
  }
  public putKindConfig(value: ClusterKindConfig) {
    this._kindConfig.internalValue = value;
  }
  public resetKindConfig() {
    this._kindConfig.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get kindConfigInput() {
    return this._kindConfig.internalValue;
  }

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new ClusterTimeoutsOutputReference(this, "timeouts");
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: ClusterTimeouts) {
    this._timeouts.internalValue = value;
  }
  public resetTimeouts() {
    this._timeouts.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get timeoutsInput() {
    return this._timeouts.internalValue;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      id: cdktf.stringToTerraform(this._id),
      name: cdktf.stringToTerraform(this._name),
      node_image: cdktf.stringToTerraform(this._nodeImage),
      wait_for_ready: cdktf.booleanToTerraform(this._waitForReady),
      kind_config: clusterKindConfigToTerraform(this._kindConfig.internalValue),
      timeouts: clusterTimeoutsToTerraform(this._timeouts.internalValue),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      id: {
        value: cdktf.stringToHclTerraform(this._id),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      name: {
        value: cdktf.stringToHclTerraform(this._name),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      node_image: {
        value: cdktf.stringToHclTerraform(this._nodeImage),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      wait_for_ready: {
        value: cdktf.booleanToHclTerraform(this._waitForReady),
        isBlock: false,
        type: "simple",
        storageClassType: "boolean",
      },
      kind_config: {
        value: clusterKindConfigToHclTerraform(this._kindConfig.internalValue),
        isBlock: true,
        type: "list",
        storageClassType: "ClusterKindConfigList",
      },
      timeouts: {
        value: clusterTimeoutsToHclTerraform(this._timeouts.internalValue),
        isBlock: true,
        type: "struct",
        storageClassType: "ClusterTimeouts",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}
