package main

import (
	"testing"

	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"github.com/stretchr/testify/assert"
)

// TestGenerateKindConfig tests the Kind configuration generation
func TestGenerateKindConfig(t *testing.T) {
	tests := []struct {
		name     string
		input    map[string]interface{}
		expected map[string]interface{}
	}{
		{
			name:  "default configuration",
			input: map[string]interface{}{},
			expected: map[string]interface{}{
				"kind":       "Cluster",
				"apiVersion": "kind.x-k8s.io/v1alpha4",
			},
		},
		{
			name: "configuration with nodes",
			input: map[string]interface{}{
				"kind_config": []interface{}{
					map[string]interface{}{
						"node": []interface{}{
							map[string]interface{}{
								"role": "control-plane",
							},
							map[string]interface{}{
								"role": "worker",
							},
						},
					},
				},
			},
			expected: map[string]interface{}{
				"kind":       "Cluster",
				"apiVersion": "kind.x-k8s.io/v1alpha4",
				"node": []map[string]interface{}{
					{
						"role": "control-plane",
						"extraPortMappings": []map[string]interface{}(nil),
						"kubeadmConfigPatches": []string(nil),
					},
					{
						"role": "worker",
						"extraPortMappings": []map[string]interface{}(nil),
						"kubeadmConfigPatches": []string(nil),
					},
				},
			},
		},
		{
			name: "configuration with port mappings",
			input: map[string]interface{}{
				"kind_config": []interface{}{
					map[string]interface{}{
						"node": []interface{}{
							map[string]interface{}{
								"role": "control-plane",
								"extra_port_mappings": []interface{}{
									map[string]interface{}{
										"container_port": 80,
										"host_port":      8080,
										"protocol":       "TCP",
									},
								},
							},
						},
					},
				},
			},
			expected: map[string]interface{}{
				"kind":       "Cluster",
				"apiVersion": "kind.x-k8s.io/v1alpha4",
				"node": []map[string]interface{}{
					{
						"role": "control-plane",
						"extraPortMappings": []map[string]interface{}{
							{
								"containerPort": 80,
								"hostPort":      8080,
								"protocol":      "TCP",
							},
						},
						"kubeadmConfigPatches": []string(nil),
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create a resource data object with the test input
			d := schema.TestResourceDataRaw(t, resourceKindCluster().Schema, tt.input)
			
			// Generate the configuration
			result := generateKindConfig(d)
			
			// Compare the results
			assert.Equal(t, tt.expected, result)
		})
	}
}

// TestParseKubeconfig tests the kubeconfig parsing
func TestParseKubeconfig(t *testing.T) {
	testKubeconfig := `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTi...
    server: https://127.0.0.1:6443
  name: kind-test-cluster
contexts:
- context:
    cluster: kind-test-cluster
    user: kind-test-cluster
  name: kind-test-cluster
current-context: kind-test-cluster
kind: Config
preferences: {}
users:
- name: kind-test-cluster
  user:
    client-certificate-data: LS0tLS1CRUdJTi...
    client-key-data: LS0tLS1CRUdJTi...`

	data, err := parseKubeconfig(testKubeconfig)
	assert.NoError(t, err)
	assert.NotNil(t, data)
	assert.Equal(t, "https://127.0.0.1:6443", data.Endpoint)
	assert.Equal(t, "LS0tLS1CRUdJTi...", data.ClusterCA)
	assert.Equal(t, "LS0tLS1CRUdJTi...", data.ClientCert)
	assert.Equal(t, "LS0tLS1CRUdJTi...", data.ClientKey)
}

// TestClusterExists tests the cluster existence check
func TestClusterExists(t *testing.T) {
	// This test is mocked since it requires actual Kind cluster
	tests := []struct {
		name           string
		clusterName    string
		mockOutput     string
		expectedResult bool
	}{
		{
			name:           "cluster exists",
			clusterName:    "test-cluster",
			mockOutput:     "test-cluster\nother-cluster\n",
			expectedResult: true,
		},
		{
			name:           "cluster does not exist",
			clusterName:    "test-cluster",
			mockOutput:     "other-cluster\nanother-cluster\n",
			expectedResult: false,
		},
		{
			name:           "no clusters exist",
			clusterName:    "test-cluster",
			mockOutput:     "",
			expectedResult: false,
		},
	}

	// Note: In a real test, you would mock the exec.Command call
	// This is just demonstrating the test structure
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// In actual implementation, you'd mock the command execution
			// For now, this is a placeholder
			t.Logf("Would test cluster existence for: %s", tt.clusterName)
		})
	}
}

// TestResourceSchema tests that the resource schema is properly defined
func TestResourceSchema(t *testing.T) {
	resource := resourceKindCluster()
	
	// Test required fields
	assert.True(t, resource.Schema["name"].Required)
	
	// Test optional fields with defaults
	assert.False(t, resource.Schema["node_image"].Required)
	assert.Equal(t, "kindest/node:v1.28.0", resource.Schema["node_image"].Default)
	
	assert.False(t, resource.Schema["wait_for_ready"].Required)
	assert.Equal(t, true, resource.Schema["wait_for_ready"].Default)
	
	// Test computed fields
	assert.True(t, resource.Schema["endpoint"].Computed)
	assert.True(t, resource.Schema["kubeconfig_path"].Computed)
	assert.True(t, resource.Schema["cluster_ca_certificate"].Computed)
	assert.True(t, resource.Schema["client_certificate"].Computed)
	assert.True(t, resource.Schema["client_key"].Computed)
	
	// Test sensitive fields
	assert.True(t, resource.Schema["cluster_ca_certificate"].Sensitive)
	assert.True(t, resource.Schema["client_certificate"].Sensitive)
	assert.True(t, resource.Schema["client_key"].Sensitive)
}

// TestResourceTimeouts tests that timeouts are properly configured
func TestResourceTimeouts(t *testing.T) {
	resource := resourceKindCluster()
	
	assert.NotNil(t, resource.Timeouts)
	assert.NotNil(t, resource.Timeouts.Create)
	assert.NotNil(t, resource.Timeouts.Delete)
	
	// Default timeouts should be reasonable
	assert.Equal(t, "10m0s", resource.Timeouts.Create.String())
	assert.Equal(t, "5m0s", resource.Timeouts.Delete.String())
}