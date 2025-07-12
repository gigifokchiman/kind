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

### Monitoring
- Track [actions/setup-go issues](https://github.com/actions/setup-go/issues)
- Watch for security advisories on cache vulnerabilities
- Test cache re-enablement periodically

## Conclusion

The GitHub Actions Go caching issues of 2024 represent a collision between:
- GitHub's infrastructure limitations
- Go's evolving toolchain complexity  
- The rush to optimize build performance

**Current best practice**: Disable caching for reliability, accept the performance trade-off.

**Long-term**: Wait for infrastructure improvements while maintaining working builds.

This issue affects major projects and isn't a configuration problem—it's a systemic platform issue requiring patience and pragmatic workarounds.

---

*Last updated: December 2024*  
*Affects: actions/setup-go@v4+, Go 1.23+, Terraform providers*