# GitHub Actions Cache Issues in Go Projects (2024)

## Overview

This document chronicles a widespread issue affecting GitHub Actions workflows using `actions/setup-go` with caching enabled, particularly impacting Terraform provider development in 2024.

## The Problem

### Symptoms
```
Failed to restore: "/usr/bin/tar" failed with error: The process '/usr/bin/tar' failed with exit code 2

/usr/bin/tar: ../../../go/pkg/mod/golang.org/toolchain@v0.0.1-go1.24.4.linux-amd64/VERSION: Cannot open: File exists
/usr/bin/tar: ../../../go/pkg/mod/golang.org/toolchain@v0.0.1-go1.24.4.linux-amd64/lib/time/zoneinfo.zip: Cannot open: File exists
[Multiple similar errors...]
Error: /usr/bin/tar: Exiting with failure status due to previous errors
```

### Impact
- **Workflow failures**: CI/CD pipelines fail during cache restoration
- **Development bottlenecks**: Unable to release or test code changes
- **Inconsistent behavior**: Same configuration works for some projects, fails for others
- **Time lost**: Hours spent debugging what appears to be infrastructure issues

## Root Causes

### 1. Go Toolchain Evolution (Go 1.23+)
- **New file structure**: Go 1.23+ introduced complex toolchain layouts
- **Toolchain conflicts**: Files already exist when cache tries to restore
- **FIPS140 modules**: New security components cause file conflicts
- **Telemetry files**: Go telemetry config files conflict during restoration

### 2. GitHub Actions Cache System Flaws
- **Poor error handling**: tar fails on existing files instead of skipping
- **No validation**: Cache extraction doesn't verify paths before overwriting
- **Concurrency issues**: Multiple jobs accessing same cache simultaneously
- **Cache corruption**: Once corrupted, caches continue to fail

### 3. Default Caching Changes
- **actions/setup-go@v4+**: Caching enabled by default (March 2023)
- **Silent failures**: What was an improvement became a reliability issue
- **Breaking change**: Existing workflows broke without configuration changes

## Evidence from the Community

### GitHub Issues (2024)
- **Issue #506**: Cache restore fails with Go 1.23
- **Issue #424**: Tar errors on cache restore after toolchain installation  
- **Issue #403**: setup-go action should allow for existing cache files
- **Issue #498**: Fail to cache with Go version 1.23

### Security Implications
- **Cache Poisoning**: Documented vulnerability allowing workflow lateral movement
- **Supply Chain Risk**: Compromised caches can affect multiple repositories
- **OIDC Exploitation**: Cache poisoning used to access release signing keys

#### **Critical Security Paths & Monitoring**

**Primary Vulnerability Sources:**
- **actions/setup-go issues**: https://github.com/actions/setup-go/issues
- **GitHub Security Advisories**: https://github.com/advisories (filter: GitHub Actions)
- **Key vulnerability issues**: #506, #424, #403, #498 (cache restore failures)

**Attack Vectors:**
- **Workflow Lateral Movement**: Compromised cache files execute in trusted contexts
- **Release Artifact Poisoning**: Malicious code injected into published packages
- **Signing Key Compromise**: Cache poisoning to access OIDC tokens and release signing keys
- **Multi-Repository Impact**: Single poisoned cache affects multiple dependent repositories

**High-Risk Scenarios:**
- Release workflows with signing key access
- Workflows publishing to package registries
- Multi-tenant CI environments
- Workflows with elevated permissions (`contents: write`, `packages: write`)

## Attempted Solutions & Why They Failed

### 1. Manual Caching
```yaml
- name: Cache Go modules
  uses: actions/cache@v4
  with:
    path: ~/go/pkg/mod
    key: ${{ runner.os }}-go-${{ hashFiles('**/go.sum') }}
```
**Result**: Same tar extraction errors

### 2. Built-in Caching with Explicit Config
```yaml
- uses: actions/setup-go@v5
  with:
    go-version: '1.21'
    cache: true
    cache-dependency-path: go.sum
```
**Result**: "File exists" errors persist

### 3. Different Cache Versions
- Tried `actions/cache@v3` vs `actions/cache@v4`
- Used different cache key patterns
- Added cache warming steps
**Result**: All variations failed with same tar errors

### 4. Copying Working Examples
Attempted to replicate configuration from `terraform-provider-github`:
```yaml
- uses: actions/setup-go@v5.2.0
  with:
    go-version-file: 'go.mod'
    cache: true
```
**Result**: Same failures, suggesting the issue affects multiple projects

## The Working Solution

### Disable All Caching
```yaml
- name: Set up Go
  uses: actions/setup-go@v5
  with:
    go-version: '1.21'
    cache: false
    
- name: Download dependencies
  run: go mod download
```

### Why This Works
- **No cache conflicts**: Fresh downloads every time
- **Predictable behavior**: No dependency on cache state
- **Platform independent**: Works across all runner types
- **Version agnostic**: Compatible with all Go versions

### Trade-offs
- **Performance**: 2-3 minutes slower per job
- **Network usage**: Re-downloads dependencies each run
- **Reliability**: 100% success rate vs hours of debugging

## Recommendations

### For New Projects
1. **Start with `cache: false`** until GitHub fixes the underlying issues
2. **Monitor GitHub issues** for updates on cache improvements
3. **Consider cache only for stable dependencies** if performance is critical

### For Existing Projects
1. **Audit failing workflows** for cache-related errors
2. **Temporarily disable caching** to unblock development
3. **Document cache issues** for team awareness

### For Terraform Providers Specifically
```yaml
# Recommended configuration for Terraform providers (2024)
- name: Set up Go
  uses: actions/setup-go@v5
  with:
    go-version: '1.21'
    cache: false

- name: Download Go modules
  run: go mod download

- name: Build provider
  run: go build -v .
```

## Timeline of Issues

- **March 2023**: actions/setup-go@v4 enables caching by default
- **March 2024**: Cache poisoning vulnerability disclosed
- **Mid-2024**: Go 1.23 release exacerbates cache conflicts
- **Late 2024**: Widespread reports of tar extraction failures
- **Current**: Multiple open issues, no definitive fix

## Future Outlook

### Potential Fixes
1. **GitHub Actions improvements**: Better tar handling, file conflict resolution
2. **Go toolchain changes**: More cache-friendly file layouts
3. **setup-go updates**: Smarter cache key generation, conflict detection

### Security Monitoring Protocol

#### **Continuous Monitoring (Weekly)**
- **actions/setup-go issues**: https://github.com/actions/setup-go/issues
  - Filter for: cache, security, vulnerability keywords
  - Watch for: New cache-related CVEs, security patches
- **GitHub Security Advisories**: https://github.com/advisories
  - Filter: GitHub Actions, Actions/cache, Actions/setup-go
  - Alert on: High/Critical severity advisories

#### **Monthly Security Review**
- **Supply Chain Security Updates**: Review SLSA attestation changes
- **Token Security**: Monitor OIDC token validity changes (currently 90 minutes)
- **Permission Audit**: Verify minimal permissions in release workflows
- **Cache Behavior**: Check for unexpected cache restoration patterns

#### **Quarterly Assessment**
- **Security Architecture**: Review GitHub Actions security model changes
- **Cache Re-enablement Testing**: Controlled testing of cache features (security permitting)
- **Incident Response**: Update procedures based on new attack vectors

#### **Red Flag Indicators**
- Unexpected cache hits in clean environments
- OIDC token abuse reports in security channels
- Release artifact integrity failures
- Multi-repository compromise patterns
- New cache-related CVE disclosures

#### **Emergency Response Triggers**
- **Immediate Action Required**: Disable all caching if:
  - New cache poisoning CVE (CVSS 7.0+)
  - Confirmed attack in production environment
  - GitHub Actions security advisory specifically mentions cache vulnerabilities
  - Release signing key compromise suspected

#### **Infrastructure Change Monitoring**
- **February 2025**: GitHub Actions cache storage migration monitoring
- **March 2025**: Actions/cache v1-v2 retirement readiness
- **Ongoing**: Setup-go version updates and security implications

## Conclusion

The GitHub Actions Go caching issues of 2024 represent a collision between:
- GitHub's infrastructure limitations
- Go's evolving toolchain complexity  
- The rush to optimize build performance
- **Security vulnerabilities in caching systems**

**Current best practice**: Disable caching for reliability and security, accept the performance trade-off.

**Security Priority**: Release workflows MUST disable caching to prevent cache poisoning attacks that can compromise signing keys and supply chain integrity.

**Long-term**: Wait for infrastructure improvements while maintaining working builds.

This issue affects major projects and isn't a configuration problem—it's a systemic platform issue requiring patience and pragmatic workarounds with security as the top priority.

## Security Compliance Checklist

### **For Release Workflows** ✅
- [ ] `cache: false` set on all setup-go actions
- [ ] Minimal permissions (`contents: write` only)
- [ ] No manual caching actions (`actions/cache@v*`)
- [ ] Security comments documenting cache poisoning prevention
- [ ] Go version 1.24.5+ (latest security patches)

### **Monitoring Setup** 📊
- [ ] Weekly check of actions/setup-go issues
- [ ] GitHub Security Advisory notifications enabled
- [ ] Quarterly security review scheduled
- [ ] Emergency response plan documented
- [ ] Red flag indicators monitored

### **Documentation Maintenance** 📝
- [ ] Security recommendations updated
- [ ] Vulnerability paths documented
- [ ] Emergency procedures accessible
- [ ] Team awareness training completed

---

*Last updated: January 2025*  
*Affects: actions/setup-go@v4+, Go 1.23+, Terraform providers*  
*Security Priority: Cache poisoning prevention in release workflows*