package main

import (
	"os"
	"os/exec"
	"testing"

	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

var testAccProviderFactories = map[string]func() (*schema.Provider, error){
	"kind": func() (*schema.Provider, error) {
		return Provider(), nil
	},
}

func Provider() *schema.Provider {
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
}

func TestProvider(t *testing.T) {
	if err := Provider().InternalValidate(); err != nil {
		t.Fatalf("err: %s", err)
	}
}

func TestProvider_impl(t *testing.T) {
	var _ *schema.Provider = Provider()
}

// Utility functions for tests

func isDockerAvailable() bool {
	cmd := exec.Command("docker", "info")
	if err := cmd.Run(); err != nil {
		return false
	}
	return true
}

func isKindCLIAvailable() bool {
	cmd := exec.Command("kind", "version")
	if err := cmd.Run(); err != nil {
		return false
	}
	return true
}

func testAccPreCheckEnvVars(t *testing.T) {
	// Check for any required environment variables
	if v := os.Getenv("SKIP_KIND_TESTS"); v != "" {
		t.Skip("SKIP_KIND_TESTS is set, skipping Kind cluster tests")
	}

	// Check Docker socket
	if dockerHost := os.Getenv("DOCKER_HOST"); dockerHost != "" {
		t.Logf("Using DOCKER_HOST: %s", dockerHost)
	}
}