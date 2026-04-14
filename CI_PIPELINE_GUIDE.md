# CI/CD Pipeline Guide

## Overview

This project uses **GitHub Actions** for continuous integration and continuous deployment. The pipelines automatically validate code quality, build the application, and prepare releases.

---

## Workflows

### 1. Backend CI/CD (`.github/workflows/backend-ci.yml`)

**Trigger:** Push  to `main` or `develop` branches, or PR targeting these branches (Backend files modified)

**Jobs:**
- **build-and-test:** Builds the entire solution using .NET 8.0
- **lint-analysis:** Runs code quality analysis
- **verify-package-refs:** Lists all NuGet package dependencies
- **build-docker:** Attempts to build Docker images for microservices (if Dockerfile exists)

**What It Does:**
1. Sets up .NET 8.0 environment
2. Restores NuGet packages
3. Builds solution in Release configuration
4. Runs code analysis (optional)
5. Uploads build artifacts
6. Attempts Docker builds

**Artifacts Generated:**
- Backend build output (DLLs, metadata)
- Available for 5 days

---

### 2. Frontend CI/CD (`.github/workflows/frontend-ci.yml`)

**Trigger:** Push to `main` or `develop` branches, or PR targeting these branches (Frontend files modified)

**Jobs:**
- **build-and-test:** Tests on Node.js 18.x and 20.x
- **code-quality:** Checks for security vulnerabilities
- **type-checking:** Validates TypeScript types
- **dependency-check:** Verifies package-lock.json is up-to-date

**What It Does:**
1. Sets up Node.js environment
2. Installs npm dependencies
3. Runs TypeScript type checking
4. Runs tests (if configured)
5. Builds React application
6. Checks for security vulnerabilities
7. Verifies package-lock.json consistency

**Artifacts Generated:**
- Frontend build output (React optimized bundle)
- Available for 5 days

---

### 3. Database Migration Check (`.github/workflows/database-migration.yml`)

**Trigger:** Push/PR affecting Backend or Database folders

**Jobs:**
- **validate-scripts:** Ensures SQL scripts exist and are readable
- **check-entity-framework:** Validates EF Core configuration
- **syntax-validation:** Validates SQL syntax
- **lint-sql-files:** Lints SQL for best practices

**What It Does:**
1. Verifies SQL scripts are present
2. Checks for Entity Framework DbContext
3. Validates SQL syntax using sqlparse
4. Lints SQL files for quality issues

---

### 4. Pull Request Validation (`.github/workflows/pr-validation.yml`)

**Trigger:** Pull requests to `main` or `develop`

**Jobs:**
- **pr-checks:** Validates PR title and commit messages
- **check-file-changes:** Detects which components changed
- **documentation-check:** Ensures docs are updated with code changes

**What It Does:**
1. Validates PR title format (conventional commits)
2. Checks for breaking changes
3. Displays affected files
4. Validates commit message quality
5. Checks if documentation was updated

---

## Workflow Execution Flow

```
Push/PR to main or develop
    ↓
Trigger GitHub Actions
    ↓
┌─────────────────────────────────────────┐
│ Parallel Execution:                     │
├─────────────────────────────────────────┤
│ ✓ Backend CI/CD                         │
│ ✓ Frontend CI/CD                        │
│ ✓ Database Migration Check              │
│ ✓ PR Validation (if PR)                 │
└─────────────────────────────────────────┘
    ↓
All checks pass?
    ├─ YES → Merge button enabled
    └─ NO → Merge blocked, review errors
```

---

## How to Use

### For Developers

**Before Pushing Code:**
1. Ensure local builds pass:
   ```bash
   # Backend
   dotnet build Backend/WildlifeSafari.sln
   
   # Frontend
   npm run build --prefix Frontend/wildlife-safari-app
   ```

2. Run tests locally:
   ```bash
   npm test --prefix Frontend/wildlife-safari-app --watchAll=false
   ```

3. Follow conventional commit messages:
   ```
   feat(auth): add JWT token validation
   fix(booking): resolve slot availability bug
   docs(readme): update setup instructions
   ```

**Opening a Pull Request:**
1. Create feature branch: `git checkout -b feat/your-feature`
2. Make changes and commit
3. Push to remote: `git push origin feat/your-feature`
4. Open PR on GitHub
5. Wait for CI checks to complete
6. Address any failing checks

### Monitoring CI Runs

1. Go to your GitHub repository
2. Click "Actions" tab
3. Select workflow to view details
4. Check individual job logs

### Interpreting Results

| Status | Meaning | Action |
|--------|---------|--------|
| ✅ Passed | All checks passed | Safe to merge |
| ❌ Failed | One or more checks failed | Review logs and fix issues |
| ⏳ Running | Workflow in progress | Wait for completion |
| ⊘ Skipped | Job/step was skipped | Check conditions |

---

## Configuration Files

### `.github/workflows/backend-ci.yml`
- **Path:** `.github/workflows/backend-ci.yml`
- **Purpose:** Backend build and validation
- **Edit:** Modify to change .NET version, add more services, configure test runners

### `.github/workflows/frontend-ci.yml`
- **Path:** `.github/workflows/frontend-ci.yml`
- **Purpose:** Frontend build and validation
- **Edit:** Modify Node.js versions, add E2E testing, configure deployment

### `.github/workflows/database-migration.yml`
- **Path:** `.github/workflows/database-migration.yml`
- **Purpose:** Database schema and migration validation
- **Edit:** Add migration testing, configure database validation

### `.github/workflows/pr-validation.yml`
- **Path:** `.github/workflows/pr-validation.yml`
- **Purpose:** Pull request quality checks
- **Edit:** Add protected branch rules, enforce naming conventions

---

## Common Issues & Solutions

### Issue: Backend build fails with "SDK not found"
**Solution:** 
- Workflow uses .NET 8.0. Ensure all projects target net8.0
- Check `TargetFramework` in `.csproj` files

### Issue: Frontend build fails with "npm ERR!"
**Solution:**
- Check package-lock.json is committed to repo
- Ensure Node.js version matches local development
- Clear npm cache: `npm cache clean --force`

### Issue: Database validation fails
**Solution:**
- Verify SQL scripts syntax is valid
- Check file paths in GitHub Actions
- Ensure Entity Framework is properly configured

### Issue: Workflow doesn't trigger on PR
**Solution:**
- Check branch protection rules
- Verify paths filter in workflow file
- Ensure PR targets correct branch (main/develop)

---

## Best Practices

### 1. **Small, Focused PRs**
   - Easier to review
   - Faster CI execution
   - Reduce merge conflicts

### 2. **Meaningful Commit Messages**
   ```
   ✓ Good:   feat(auth): implement JWT token refresh
   ✗ Bad:    updated code
   ```

### 3. **Update Documentation**
   - Keep README.md current
   - Document API changes in comments
   - Update SETUP_GUIDE.md for new dependencies

### 4. **Test Locally First**
   - Run builds before pushing
   - Validate changes match assumptions
   - Test all three backend services

### 5. **Review CI Logs**
   - Understanding failures helps prevent future issues
   - Share learnings with team
   - Document non-obvious fixes

---

## Adding New Workflows

### Example: Add E2E Testing
```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18.x'
      - name: Install Playwright
        run: npm install --save-dev @playwright/test
      - name: Run E2E tests
        run: npx playwright test
```

---

## Performance Optimization

### Current Pipeline Times
- Backend CI/CD: ~3-5 minutes
- Frontend CI/CD: ~2-4 minutes (varies by Node version)
- Database Check: ~1-2 minutes
- Total: ~6-11 minutes

### Ways to Improve
1. **Cache dependencies:** Already enabled for npm and NuGet
2. **Parallel jobs:** Already running in parallel
3. **Split large jobs:** Consider separating test and build steps
4. **Use matrix strategy:** Currently used for Node versions

---

## Security & Best Practices

### Secrets Management
- Never commit `.env` files
- Use GitHub Secrets for sensitive data:
  ```yaml
  - name: Build
    env:
      DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
    run: dotnet build
  ```

### Access Control
- Restrict who can merge PRs
- Require PR reviews before merge
- Require all CI checks to pass

### Keep Workflows Updated
- Review workflow syntax regularly
- Update action versions
- Monitor GitHub Actions security advisories

---

## Maintenance

### Regular Tasks
- **Monthly:** Review and update action versions
- **Quarterly:** Audit workflow performance
- **Annually:** Major version upgrades for SDKs

### Monitoring
- Track build success rates
- Monitor average execution times
- Identify flaky tests or steps

### Documentation
- Keep this guide updated
- Document any custom steps
- Share workflow knowledge with team

---

## Useful Commands

```bash
# View workflow runs locally (requires act tool)
act -l

# Run specific workflow locally
act -j build-and-test

# View GitHub Actions logs
gh run list
gh run view <run-id> --log
```

---

## Support & Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [.NET 8.0 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-8)
- [React Build Documentation](https://create-react-app.dev/)

