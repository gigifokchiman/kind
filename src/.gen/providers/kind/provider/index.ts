// https://kind.local/providers/gigifokchiman/kind/0.1.3/docs
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface KindProviderConfig {
  /**
  * Docker daemon host
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs#docker_host KindProvider#docker_host}
  */
  readonly dockerHost?: string;
  /**
  * Alias name
  *
  * Docs at Terraform Registry: {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs#alias KindProvider#alias}
  */
  readonly alias?: string;
}

/**
* Represents a {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs kind}
*/
export class KindProvider extends cdktf.TerraformProvider {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "kind";

  // ==============
  // STATIC Methods
  // ==============
  /**
  * Generates CDKTF code for importing a KindProvider resource upon running "cdktf plan <stack-name>"
  * @param scope The scope in which to define this construct
  * @param importToId The construct id used in the generated config for the KindProvider to import
  * @param importFromId The id of the existing KindProvider that should be imported. Refer to the {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs#import import section} in the documentation of this resource for the id to use
  * @param provider? Optional instance of the provider where the KindProvider to import is found
  */
  public static generateConfigForImport(scope: Construct, importToId: string, importFromId: string, provider?: cdktf.TerraformProvider) {
        return new cdktf.ImportableResource(scope, importToId, { terraformResourceType: "kind", importId: importFromId, provider });
      }

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://kind.local/providers/gigifokchiman/kind/0.1.3/docs kind} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options KindProviderConfig = {}
  */
  public constructor(scope: Construct, id: string, config: KindProviderConfig = {}) {
    super(scope, id, {
      terraformResourceType: 'kind',
      terraformGeneratorMetadata: {
        providerName: 'kind',
        providerVersion: '0.1.3',
        providerVersionConstraint: '0.1.3'
      },
      terraformProviderSource: 'kind.local/gigifokchiman/kind'
    });
    this._dockerHost = config.dockerHost;
    this._alias = config.alias;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // docker_host - computed: false, optional: true, required: false
  private _dockerHost?: string; 
  public get dockerHost() {
    return this._dockerHost;
  }
  public set dockerHost(value: string | undefined) {
    this._dockerHost = value;
  }
  public resetDockerHost() {
    this._dockerHost = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get dockerHostInput() {
    return this._dockerHost;
  }

  // alias - computed: false, optional: true, required: false
  private _alias?: string; 
  public get alias() {
    return this._alias;
  }
  public set alias(value: string | undefined) {
    this._alias = value;
  }
  public resetAlias() {
    this._alias = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get aliasInput() {
    return this._alias;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      docker_host: cdktf.stringToTerraform(this._dockerHost),
      alias: cdktf.stringToTerraform(this._alias),
    };
  }

  protected synthesizeHclAttributes(): { [name: string]: any } {
    const attrs = {
      docker_host: {
        value: cdktf.stringToHclTerraform(this._dockerHost),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
      alias: {
        value: cdktf.stringToHclTerraform(this._alias),
        isBlock: false,
        type: "simple",
        storageClassType: "string",
      },
    };

    // remove undefined attributes
    return Object.fromEntries(Object.entries(attrs).filter(([_, value]) => value !== undefined && value.value !== undefined ))
  }
}
