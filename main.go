package main

import (
	"context"
	"log"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/hashicorp/terraform-plugin-sdk/v2/plugin"
)

func main() {
	plugin.Serve(&plugin.ServeOpts{
		ProviderFunc: func() *schema.Provider {
			return &schema.Provider{
				Schema: map[string]*schema.Schema{
					"docker_host": {
						Type:        schema.TypeString,
						Optional:    true,
						DefaultFunc: schema.EnvDefaultFunc("DOCKER_HOST", ""),
						Description: "Docker daemon host",
					},
				},
				ResourcesMap: map[string]*schema.Resource{
					"mlplatform_kind_cluster": resourceKindCluster(),
				},
				ConfigureContextFunc: providerConfigure,
			}
		},
	})
}

func providerConfigure(ctx context.Context, d *schema.ResourceData) (interface{}, diag.Diagnostics) {
	var diags diag.Diagnostics

	config := &ProviderConfig{
		DockerHost: d.Get("docker_host").(string),
	}

	log.Printf("[INFO] Initializing ML Platform provider with Docker host: %s", config.DockerHost)

	return config, diags
}

type ProviderConfig struct {
	DockerHost string
}