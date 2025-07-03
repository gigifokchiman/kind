package main

import (
	"fmt"
	"os/exec"
	"regexp"
	"testing"

	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/acctest"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/resource"
	"github.com/hashicorp/terraform-plugin-sdk/v2/terraform"
)

// TestAccKindCluster_basic tests the basic creation and deletion of a Kind cluster
func TestAccKindCluster_basic(t *testing.T) {
	rName := fmt.Sprintf("tf-acc-test-%s", acctest.RandString(10))
	resourceName := "kind_cluster.test"

	resource.Test(t, resource.TestCase{
		PreCheck:          func() { testAccPreCheck(t) },
		ProviderFactories: testAccProviderFactories,
		CheckDestroy:      testAccCheckKindClusterDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccKindClusterConfig_basic(rName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckKindClusterExists(resourceName),
					resource.TestCheckResourceAttr(resourceName, "name", rName),
					resource.TestCheckResourceAttr(resourceName, "wait_for_ready", "true"),
					resource.TestCheckResourceAttr(resourceName, "node_image", "kindest/node:v1.28.0"),
					resource.TestCheckResourceAttrSet(resourceName, "endpoint"),
					resource.TestCheckResourceAttrSet(resourceName, "kubeconfig_path"),
					resource.TestCheckResourceAttrSet(resourceName, "cluster_ca_certificate"),
					resource.TestCheckResourceAttrSet(resourceName, "client_certificate"),
					resource.TestCheckResourceAttrSet(resourceName, "client_key"),
				),
			},
			// Test import
			{
				ResourceName:      resourceName,
				ImportState:       true,
				ImportStateVerify: true,
				ImportStateVerifyIgnore: []string{
					"wait_for_ready", // This is not stored in the cluster
					"kind_config",    // This is only used during creation
				},
			},
		},
	})
}

// TestAccKindCluster_withConfig tests creation with custom configuration
func TestAccKindCluster_withConfig(t *testing.T) {
	rName := fmt.Sprintf("tf-acc-test-%s", acctest.RandString(10))
	resourceName := "kind_cluster.test"

	resource.Test(t, resource.TestCase{
		PreCheck:          func() { testAccPreCheck(t) },
		ProviderFactories: testAccProviderFactories,
		CheckDestroy:      testAccCheckKindClusterDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccKindClusterConfig_withPortMappings(rName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckKindClusterExists(resourceName),
					resource.TestCheckResourceAttr(resourceName, "name", rName),
					resource.TestCheckResourceAttr(resourceName, "kind_config.#", "1"),
					resource.TestCheckResourceAttr(resourceName, "kind_config.0.node.#", "3"),
					resource.TestCheckResourceAttr(resourceName, "kind_config.0.node.0.role", "control-plane"),
					resource.TestCheckResourceAttr(resourceName, "kind_config.0.node.0.extra_port_mappings.#", "2"),
					resource.TestCheckResourceAttrSet(resourceName, "kind_config.0.node.0.extra_port_mappings.0.host_port"),
					resource.TestCheckResourceAttrSet(resourceName, "kind_config.0.node.0.extra_port_mappings.1.host_port"),
				),
			},
		},
	})
}

// TestAccKindCluster_customNodeImage tests using a custom node image
func TestAccKindCluster_customNodeImage(t *testing.T) {
	rName := fmt.Sprintf("tf-acc-test-%s", acctest.RandString(10))
	resourceName := "kind_cluster.test"

	resource.Test(t, resource.TestCase{
		PreCheck:          func() { testAccPreCheck(t) },
		ProviderFactories: testAccProviderFactories,
		CheckDestroy:      testAccCheckKindClusterDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccKindClusterConfig_customNodeImage(rName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckKindClusterExists(resourceName),
					resource.TestCheckResourceAttr(resourceName, "node_image", "kindest/node:v1.27.0"),
				),
			},
		},
	})
}

// TestAccKindCluster_multipleNodes tests creation with multiple worker nodes
func TestAccKindCluster_multipleNodes(t *testing.T) {
	rName := fmt.Sprintf("tf-acc-test-%s", acctest.RandString(10))
	resourceName := "kind_cluster.test"

	resource.Test(t, resource.TestCase{
		PreCheck:          func() { testAccPreCheck(t) },
		ProviderFactories: testAccProviderFactories,
		CheckDestroy:      testAccCheckKindClusterDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccKindClusterConfig_multipleWorkers(rName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckKindClusterExists(resourceName),
					resource.TestCheckResourceAttr(resourceName, "kind_config.0.node.#", "4"), // 1 control-plane + 3 workers
					testAccCheckKindClusterNodeCount(resourceName, 4),
				),
			},
		},
	})
}

// TestAccKindCluster_disappears tests that the resource handles external deletion
func TestAccKindCluster_disappears(t *testing.T) {
	rName := fmt.Sprintf("tf-acc-test-%s", acctest.RandString(10))
	resourceName := "kind_cluster.test"

	resource.Test(t, resource.TestCase{
		PreCheck:          func() { testAccPreCheck(t) },
		ProviderFactories: testAccProviderFactories,
		CheckDestroy:      testAccCheckKindClusterDestroy,
		Steps: []resource.TestStep{
			{
				Config: testAccKindClusterConfig_basic(rName),
				Check: resource.ComposeTestCheckFunc(
					testAccCheckKindClusterExists(resourceName),
					testAccCheckKindClusterDisappears(rName),
				),
				ExpectNonEmptyPlan: true,
			},
		},
	})
}

// Helper functions

func testAccPreCheck(t *testing.T) {
	// Check that Docker is available
	if !isDockerAvailable() {
		t.Skip("Docker is not available")
	}

	// Check that Kind CLI is available
	if !isKindCLIAvailable() {
		t.Skip("Kind CLI is not available")
	}
}

func testAccCheckKindClusterExists(n string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("Not found: %s", n)
		}

		if rs.Primary.ID == "" {
			return fmt.Errorf("No Kind cluster ID is set")
		}

		if !clusterExists(rs.Primary.ID) {
			return fmt.Errorf("Kind cluster %s does not exist", rs.Primary.ID)
		}

		return nil
	}
}

func testAccCheckKindClusterDestroy(s *terraform.State) error {
	for _, rs := range s.RootModule().Resources {
		if rs.Type != "kind_cluster" {
			continue
		}

		if clusterExists(rs.Primary.ID) {
			return fmt.Errorf("Kind cluster %s still exists", rs.Primary.ID)
		}
	}

	return nil
}

func testAccCheckKindClusterDisappears(name string) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		// Manually delete the cluster outside of Terraform
		cmd := exec.Command("kind", "delete", "cluster", "--name", name)
		if err := cmd.Run(); err != nil {
			return fmt.Errorf("Failed to delete Kind cluster: %s", err)
		}
		return nil
	}
}

func testAccCheckKindClusterPortMapping(n string, containerPort, hostPort int) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("Not found: %s", n)
		}

		// Check that the port mapping exists in the configuration
		found := false
		for i := 0; ; i++ {
			containerPortKey := fmt.Sprintf("kind_config.0.node.0.extra_port_mappings.%d.container_port", i)
			hostPortKey := fmt.Sprintf("kind_config.0.node.0.extra_port_mappings.%d.host_port", i)

			cp, cpOk := rs.Primary.Attributes[containerPortKey]
			hp, hpOk := rs.Primary.Attributes[hostPortKey]

			if !cpOk || !hpOk {
				break
			}

			if cp == fmt.Sprintf("%d", containerPort) && hp == fmt.Sprintf("%d", hostPort) {
				found = true
				break
			}
		}

		if !found {
			return fmt.Errorf("Port mapping %d:%d not found", containerPort, hostPort)
		}

		return nil
	}
}

func testAccCheckKindClusterNodeCount(n string, expectedCount int) resource.TestCheckFunc {
	return func(s *terraform.State) error {
		rs, ok := s.RootModule().Resources[n]
		if !ok {
			return fmt.Errorf("Not found: %s", n)
		}

		// Use kubectl to check actual node count
		cmd := exec.Command("kubectl", "get", "nodes", "--context", fmt.Sprintf("kind-%s", rs.Primary.ID), "-o", "json")
		output, err := cmd.Output()
		if err != nil {
			return fmt.Errorf("Failed to get nodes: %s", err)
		}

		// Simple check: count occurrences of "Ready" status
		readyCount := len(regexp.MustCompile(`"type":"Ready"`).FindAllString(string(output), -1))
		if readyCount != expectedCount {
			return fmt.Errorf("Expected %d nodes, got %d", expectedCount, readyCount)
		}

		return nil
	}
}

// Test configurations

func testAccKindClusterConfig_basic(name string) string {
	return fmt.Sprintf(`
resource "kind_cluster" "test" {
  name           = "%s"
  wait_for_ready = true
}
`, name)
}

func testAccKindClusterConfig_withPortMappings(name string) string {
	// Use dynamic ports to avoid conflicts
	basePort := 9000 + (int(acctest.RandInt()) % 1000)
	return fmt.Sprintf(`
resource "kind_cluster" "test" {
  name = "%s"

  kind_config {
    node {
      role = "control-plane"
      
      extra_port_mappings {
        container_port = 80
        host_port      = %d
      }
      
      extra_port_mappings {
        container_port = 443
        host_port      = %d
      }
    }
    
    node {
      role = "worker"
    }
    
    node {
      role = "worker"
    }
  }
}
`, name, basePort, basePort+1)
}

func testAccKindClusterConfig_customNodeImage(name string) string {
	return fmt.Sprintf(`
resource "kind_cluster" "test" {
  name       = "%s"
  node_image = "kindest/node:v1.27.0"
}
`, name)
}

func testAccKindClusterConfig_multipleWorkers(name string) string {
	return fmt.Sprintf(`
resource "kind_cluster" "test" {
  name = "%s"

  kind_config {
    node {
      role = "control-plane"
    }
    
    node {
      role = "worker"
    }
    
    node {
      role = "worker"
    }
    
    node {
      role = "worker"
    }
  }
}
`, name)
}