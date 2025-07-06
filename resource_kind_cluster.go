package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
	"gopkg.in/yaml.v2"
)

func resourceKindCluster() *schema.Resource {
	return &schema.Resource{
		CreateContext: resourceKindClusterCreate,
		ReadContext:   resourceKindClusterRead,
		UpdateContext: resourceKindClusterUpdate,
		DeleteContext: resourceKindClusterDelete,
		Importer: &schema.ResourceImporter{
			StateContext: schema.ImportStatePassthroughContext,
		},

		Timeouts: &schema.ResourceTimeout{
			Create: schema.DefaultTimeout(10 * time.Minute),
			Delete: schema.DefaultTimeout(5 * time.Minute),
		},

		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "The name of the Kind cluster",
			},
			"node_image": {
				Type:        schema.TypeString,
				Optional:    true,
				Default:     "kindest/node:v1.28.0",
				Description: "Docker image to use for cluster nodes",
			},
			"wait_for_ready": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     true,
				Description: "Wait for the cluster to be ready",
			},
			"kubeconfig_path": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Path to the kubeconfig file",
			},
			"endpoint": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "Kubernetes API server endpoint",
			},
			"cluster_ca_certificate": {
				Type:        schema.TypeString,
				Computed:    true,
				Sensitive:   true,
				Description: "Cluster CA certificate (base64 encoded)",
			},
			"client_certificate": {
				Type:        schema.TypeString,
				Computed:    true,
				Sensitive:   true,
				Description: "Client certificate (base64 encoded)",
			},
			"client_key": {
				Type:        schema.TypeString,
				Computed:    true,
				Sensitive:   true,
				Description: "Client key (base64 encoded)",
			},
			"kind_config": {
				Type:        schema.TypeList,
				Optional:    true,
				MaxItems:    1,
				Description: "Kind cluster configuration",
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"kind": {
							Type:     schema.TypeString,
							Optional: true,
							Default:  "Cluster",
						},
						"api_version": {
							Type:     schema.TypeString,
							Optional: true,
							Default:  "kind.x-k8s.io/v1alpha4",
						},
						"node": {
							Type:     schema.TypeList,
							Optional: true,
							Elem: &schema.Resource{
								Schema: map[string]*schema.Schema{
									"role": {
										Type:     schema.TypeString,
										Required: true,
									},
									"extra_port_mappings": {
										Type:     schema.TypeList,
										Optional: true,
										Elem: &schema.Resource{
											Schema: map[string]*schema.Schema{
												"container_port": {
													Type:     schema.TypeInt,
													Required: true,
												},
												"host_port": {
													Type:     schema.TypeInt,
													Required: true,
												},
												"protocol": {
													Type:     schema.TypeString,
													Optional: true,
													Default:  "TCP",
												},
											},
										},
									},
									"kubeadm_config_patches": {
										Type:     schema.TypeList,
										Optional: true,
										Elem:     &schema.Schema{Type: schema.TypeString},
									},
									"extra_mounts": {
										Type:     schema.TypeList,
										Optional: true,
										Description: "Extra volume mounts from host to container",
										Elem: &schema.Resource{
											Schema: map[string]*schema.Schema{
												"host_path": {
													Type:     schema.TypeString,
													Required: true,
													Description: "Path on the host to mount",
												},
												"container_path": {
													Type:     schema.TypeString,
													Required: true,
													Description: "Path in the container to mount to",
												},
												"readonly": {
													Type:     schema.TypeBool,
													Optional: true,
													Default:  false,
													Description: "Mount as read-only",
												},
												"selinux_relabel": {
													Type:     schema.TypeBool,
													Optional: true,
													Default:  false,
													Description: "Enable SELinux relabeling",
												},
												"propagation": {
													Type:     schema.TypeString,
													Optional: true,
													Default:  "None",
													Description: "Mount propagation mode",
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
	}
}

func resourceKindClusterCreate(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	config := m.(*ProviderConfig)
	clusterName := d.Get("name").(string)

	log.Printf("[INFO] Creating Kind cluster: %s", clusterName)

	// Check if cluster already exists
	if clusterExists(clusterName) {
		return diag.Errorf("Kind cluster %s already exists", clusterName)
	}

	// Generate Kind configuration
	kindConfig := generateKindConfig(d)
	
	// Create temporary config file
	configFile, err := os.CreateTemp("", "kind-config-*.yaml")
	if err != nil {
		return diag.Errorf("Failed to create temp config file: %s", err)
	}
	defer os.Remove(configFile.Name())

	// Write configuration to file
	configData, err := yaml.Marshal(kindConfig)
	if err != nil {
		return diag.Errorf("Failed to marshal Kind config: %s", err)
	}

	if _, err := configFile.Write(configData); err != nil {
		return diag.Errorf("Failed to write Kind config: %s", err)
	}
	configFile.Close()

	// Create Kind cluster
	cmd := exec.Command("kind", "create", "cluster", 
		"--name", clusterName,
		"--config", configFile.Name(),
		"--image", d.Get("node_image").(string))

	if config.DockerHost != "" {
		cmd.Env = append(os.Environ(), fmt.Sprintf("DOCKER_HOST=%s", config.DockerHost))
	}

	output, err := cmd.CombinedOutput()
	if err != nil {
		return diag.Errorf("Failed to create Kind cluster: %s\nOutput: %s", err, string(output))
	}

	log.Printf("[INFO] Kind cluster created successfully: %s", clusterName)

	// Wait for cluster to be ready
	if d.Get("wait_for_ready").(bool) {
		if err := waitForClusterReady(clusterName); err != nil {
			return diag.Errorf("Cluster failed to become ready: %s", err)
		}
	}

	// Set resource ID
	d.SetId(clusterName)

	// Get cluster information
	return resourceKindClusterRead(ctx, d, m)
}

func resourceKindClusterRead(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	clusterName := d.Id()

	log.Printf("[INFO] Reading Kind cluster: %s", clusterName)

	// Check if cluster exists
	if !clusterExists(clusterName) {
		log.Printf("[WARN] Kind cluster %s not found, removing from state", clusterName)
		d.SetId("")
		return nil
	}

	// Get kubeconfig
	kubeconfig, err := getKubeconfig(clusterName)
	if err != nil {
		return diag.Errorf("Failed to get kubeconfig: %s", err)
	}

	// Parse kubeconfig to extract cluster information
	kubeconfigData, err := parseKubeconfig(kubeconfig)
	if err != nil {
		return diag.Errorf("Failed to parse kubeconfig: %s", err)
	}

	// Set basic attributes
	d.Set("name", clusterName)
	
	// For imported resources, we can't determine the original node_image,
	// so we'll set it to the default if not already set
	if d.Get("node_image").(string) == "" {
		d.Set("node_image", "kindest/node:v1.28.0")
	}
	
	// Set computed attributes
	d.Set("kubeconfig_path", getKubeconfigPath(clusterName))
	d.Set("endpoint", kubeconfigData.Endpoint)
	d.Set("cluster_ca_certificate", kubeconfigData.ClusterCA)
	d.Set("client_certificate", kubeconfigData.ClientCert)
	d.Set("client_key", kubeconfigData.ClientKey)

	return nil
}

func resourceKindClusterUpdate(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	// Kind clusters cannot be updated in place
	// Any changes should trigger a ForceNew
	return resourceKindClusterRead(ctx, d, m)
}

func resourceKindClusterDelete(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	config := m.(*ProviderConfig)
	clusterName := d.Id()

	log.Printf("[INFO] Deleting Kind cluster: %s", clusterName)

	cmd := exec.Command("kind", "delete", "cluster", "--name", clusterName)
	
	if config.DockerHost != "" {
		cmd.Env = append(os.Environ(), fmt.Sprintf("DOCKER_HOST=%s", config.DockerHost))
	}

	output, err := cmd.CombinedOutput()
	if err != nil {
		// If cluster doesn't exist, consider it deleted
		if strings.Contains(string(output), "not found") {
			log.Printf("[WARN] Kind cluster %s not found, considering it deleted", clusterName)
			return nil
		}
		return diag.Errorf("Failed to delete Kind cluster: %s\nOutput: %s", err, string(output))
	}

	log.Printf("[INFO] Kind cluster deleted successfully: %s", clusterName)
	return nil
}

// Helper functions

func clusterExists(name string) bool {
	cmd := exec.Command("kind", "get", "clusters")
	output, err := cmd.Output()
	if err != nil {
		return false
	}

	clusters := strings.Split(strings.TrimSpace(string(output)), "\n")
	for _, cluster := range clusters {
		if cluster == name {
			return true
		}
	}
	return false
}

func waitForClusterReady(name string) error {
	// Wait up to 5 minutes for cluster to be ready
	timeout := time.After(5 * time.Minute)
	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-timeout:
			return fmt.Errorf("timeout waiting for cluster to be ready")
		case <-ticker.C:
			cmd := exec.Command("kubectl", "cluster-info", "--context", fmt.Sprintf("kind-%s", name))
			if err := cmd.Run(); err == nil {
				// Check if all nodes are ready
				cmd = exec.Command("kubectl", "get", "nodes", "--context", fmt.Sprintf("kind-%s", name))
				output, err := cmd.Output()
				if err == nil && strings.Contains(string(output), "Ready") {
					return nil
				}
			}
		}
	}
}

func generateKindConfig(d *schema.ResourceData) map[string]interface{} {
	// Default configuration
	config := map[string]interface{}{
		"kind":       "Cluster",
		"apiVersion": "kind.x-k8s.io/v1alpha4",
	}

	// Process custom configuration if provided
	if v, ok := d.GetOk("kind_config"); ok {
		kindConfigs := v.([]interface{})
		if len(kindConfigs) > 0 && kindConfigs[0] != nil {
			customConfig := kindConfigs[0].(map[string]interface{})
			
			// Override defaults with custom values
			if kind, ok := customConfig["kind"]; ok {
				config["kind"] = kind
			}
			if apiVersion, ok := customConfig["api_version"]; ok {
				config["apiVersion"] = apiVersion
			}
			
			// Process nodes configuration
			if nodes, ok := customConfig["node"]; ok {
				nodesList := nodes.([]interface{})
				var processedNodes []map[string]interface{}
				
				for _, node := range nodesList {
					nodeMap := node.(map[string]interface{})
					processedNode := map[string]interface{}{
						"role": nodeMap["role"],
					}
					
					// Process extra port mappings
					if portMappings, ok := nodeMap["extra_port_mappings"]; ok {
						portsList := portMappings.([]interface{})
						var processedPorts []map[string]interface{}
						
						for _, port := range portsList {
							portMap := port.(map[string]interface{})
							processedPorts = append(processedPorts, map[string]interface{}{
								"containerPort": portMap["container_port"],
								"hostPort":      portMap["host_port"],
								"protocol":      portMap["protocol"],
							})
						}
						processedNode["extraPortMappings"] = processedPorts
					}
					
					// Process kubeadm config patches
					if patches, ok := nodeMap["kubeadm_config_patches"]; ok {
						patchesList := patches.([]interface{})
						var processedPatches []string
						for _, patch := range patchesList {
							processedPatches = append(processedPatches, patch.(string))
						}
						processedNode["kubeadmConfigPatches"] = processedPatches
					}
					
					// Process extra mounts
					if extraMounts, ok := nodeMap["extra_mounts"]; ok {
						mountsList := extraMounts.([]interface{})
						var processedMounts []map[string]interface{}
						
						for _, mount := range mountsList {
							mountMap := mount.(map[string]interface{})
							processedMount := map[string]interface{}{
								"hostPath":      mountMap["host_path"],
								"containerPath": mountMap["container_path"],
							}
							
							// Add optional fields if present
							if readOnly, ok := mountMap["readonly"]; ok {
								processedMount["readOnly"] = readOnly
							}
							if selinuxRelabel, ok := mountMap["selinux_relabel"]; ok {
								processedMount["selinuxRelabel"] = selinuxRelabel
							}
							if propagation, ok := mountMap["propagation"]; ok {
								processedMount["propagation"] = propagation
							}
							
							processedMounts = append(processedMounts, processedMount)
						}
						processedNode["extraMounts"] = processedMounts
					}
					
					processedNodes = append(processedNodes, processedNode)
				}
				config["nodes"] = processedNodes
			}
		}
	}

	return config
}

type KubeconfigData struct {
	Endpoint   string
	ClusterCA  string
	ClientCert string
	ClientKey  string
}

func getKubeconfig(clusterName string) (string, error) {
	cmd := exec.Command("kind", "get", "kubeconfig", "--name", clusterName)
	output, err := cmd.Output()
	if err != nil {
		return "", err
	}
	return string(output), nil
}

func getKubeconfigPath(clusterName string) string {
	home, _ := os.UserHomeDir()
	return fmt.Sprintf("%s/.kube/config", home)
}

func parseKubeconfig(kubeconfig string) (*KubeconfigData, error) {
	// This is a simplified parser. In production, you'd want to use
	// a proper kubeconfig parser library
	var config map[string]interface{}
	if err := yaml.Unmarshal([]byte(kubeconfig), &config); err != nil {
		return nil, err
	}

	data := &KubeconfigData{}

	// Extract cluster information
	if clusters, ok := config["clusters"].([]interface{}); ok && len(clusters) > 0 {
		if cluster, ok := clusters[0].(map[interface{}]interface{}); ok {
			if clusterData, ok := cluster["cluster"].(map[interface{}]interface{}); ok {
				if server, ok := clusterData["server"].(string); ok {
					data.Endpoint = server
				}
				if cert, ok := clusterData["certificate-authority-data"].(string); ok {
					data.ClusterCA = cert
				}
			}
		}
	}

	// Extract user information
	if users, ok := config["users"].([]interface{}); ok && len(users) > 0 {
		if user, ok := users[0].(map[interface{}]interface{}); ok {
			if userData, ok := user["user"].(map[interface{}]interface{}); ok {
				if cert, ok := userData["client-certificate-data"].(string); ok {
					data.ClientCert = cert
				}
				if key, ok := userData["client-key-data"].(string); ok {
					data.ClientKey = key
				}
			}
		}
	}

	return data, nil
}