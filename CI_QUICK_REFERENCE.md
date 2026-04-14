# CI/CD Quick Reference

## Pre-Push Checklist ✓

### Before Committing Code

```bash
# 1. Update dependencies
npm install --prefix Frontend/wildlife-safari-app
dotnet restore Backend/

# 2. Verify code compiles
dotnet build Backend/WildlifeSafari.sln

# 3. Build frontend
npm run build --prefix Frontend/wildlife-safari-app

# 4. Run local tests (optional)
npm test --prefix Frontend/wildlife-safari-app --watchAll=false
```

### Commit & Push

```bash
# Use conventional commit format
git add .
git commit -m "feat(booking):  add payment gateway integration"
git push origin your-branch
```

---

## Commit Message Examples ✍️

### ✅ Good Examples
```
feat(auth): implement JWT token refresh mechanism
fix(booking): resolve race condition in slot availability
docs(setup): add Docker setup instructions
refactor(admin): simplify photo upload logic
style(frontend): align button spacing for consistency
test(auth): add unit tests for token validation
chore(deps): upgrade React to 18.2.0
```

### ❌ Bad Examples
```
updated code
fixed bug
frontend stuff
backend changes
work in progress
asdf
```

---

## Workflow Triggers

| Action | Triggers |
|--------|----------|
| Push to `main`/`develop` | All relevant workflows |
| Push to feature branch | None (workflows run on PR) |
| Create PR to `main`/`develop` | PR validation + relevant build workflows |
| PR merged | All workflows + artifact generation |

---

## Monitoring Your Build

### 1. **Real-time Monitoring**
   - Go to GitHub repo → **Actions** tab
   - Click your workflow run
   - Watch jobs execute in real-time

### 2. **Understanding Status Icons**
   - 🟡 **Yellow** = Running
   - ✅ **Green** = Passed
   - ❌ **Red** = Failed
   - ⊘ **Skipped** = Conditions not met

### 3. **Troubleshooting Failed Builds**
   - Click failed job
   - Expand failed step
   - Read error message
   - Refer to [CI_PIPELINE_GUIDE.md](CI_PIPELINE_GUIDE.md#troubleshooting)

---

## Workflow Job Requirements

### Backend ✓
- [ ] .NET 8.0 SDK installed
- [ ] Solution files intact
- [ ] No compilation errors
- [ ] All NuGet packages restore

### Frontend ✓
- [ ] Node.js 18+ installed
- [ ] npm dependencies resolved
- [ ] TypeScript types valid
- [ ] No ESLint errors (optional)

### Database ✓
- [ ] SQL scripts syntactically valid
- [ ] Migration scripts included
- [ ] DbContext properly configured
- [ ] Connection strings documented

### Pull Request ✓
- [ ] Title follows convention
- [ ] Commits are meaningful
- [ ] Documentation updated
- [ ] Code changes are focused

---

## Environment Setup

### One-Time Setup
```bash
# Navigate to project
cd C:\path\to\WildlifeSafariFinal

# Create feature branch
git checkout -b feat/my-feature

# Install dependencies
dotnet restore Backend/
npm install --prefix Frontend/wildlife-safari-app
```

### Before Each Work Session
```bash
# Pull latest changes
git pull origin develop

# Restore dependencies
dotnet restore Backend/
npm install --prefix Frontend/wildlife-safari-app

# Verify builds
dotnet build Backend/WildlifeSafari.sln
npm run build --prefix Frontend/wildlife-safari-app
```

---

## Service Ports Reference

| Service | Port | Type |
|---------|------|------|
| AuthService | 5001 | Backend|
| BookingService | 5002 | Backend |
| AdminService | 5003 | Backend |
| Frontend | 3000 | React |
| Database | 1433 | SQL Server |

---

## Key Files Location

| File | Path | Purpose |
|------|------|---------|
| Solution | `Backend/WildlifeSafari.sln` | Main .NET solution |
| Package.json | `Frontend/wildlife-safari-app/package.json` | npm configuration |
| DB Scripts | `Database/Scripts/` | SQL setup scripts |
| Workflows | `.github/workflows/` | CI/CD configurations |

---

## Common git Commands

```bash
# Create feature branch
git checkout -b feat/feature-name

# Stage changes
git add Backend/            # Stage entire folder
git add .                   # Stage all changes

# Commit with message
git commit -m "feat(scope): description"

# Push to remote
git push origin feat/feature-name

# Create pull request
# (Use GitHub web interface or GitHub CLI)
gh pr create --base develop --head feat/feature-name

# Update from main branch
git fetch origin
git rebase origin/develop

# View branch status
git status
git log --oneline -5
```

---

## Workflow Reference Table

| Workflow | Triggered By | Files Checked | Status Badge |
|----------|--------------|---------------|--------------|
| Backend CI/CD | Backend/ changes on push/PR | `Backend/**` | Build status |
| Frontend CI/CD | Frontend/ changes on push/PR | `Frontend/**` | Build status |
| Database Check | Database/ changes on push/PR | `Database/**` | Validation status |
| PR Validation | PR creation to main/develop | All | Quality status |

---

## Emergency Procedures

### ❌ Build Failed - What to Do

1. **Check the logs** → GitHub Actions → Your workflow → Failed step
2. **Common issues:**
   - Typo in code → Fix locally
   - Dependency missing → Update package files
   - Configuration wrong → Check appsettings.json
3. **Fix locally and push again**
4. **Review against:** [CI_PIPELINE_GUIDE.md](CI_PIPELINE_GUIDE.md#troubleshooting)

### ❌ PR Blocked by Checks

**Possible causes:**
- Build failed
- Tests didn't pass
- PR title format wrong
- Documentation not updated

**Solution:**
- Resolve issues locally
- Add and commit fixes
- Push again - checks re-run automatically

### ❌ Accidental Push to Wrong Branch

```bash
# If not yet merged:
git revert <commit-hash>    # Create revert commit
git push

# If already merged:
# Contact repo admin for rollback guidance
```

---

## Performance Tips

### Speeds Up CI/CD

✅ **Keep commits focused** - Smaller PRs build faster  
✅ **Add meaningful messages** - Helps reviewers assist  
✅ **Update deps regularly** - Prevents large updates later  
✅ **Cache locally** - `dotnet restore`, `npm install` work offline  
✅ **Batch related changes** - Group by service/component  

### Slows Down CI/CD

❌ **Large unrelated changes** - Too much to review  
❌ **Multiple services modified** - Triggers all workflows  
❌ **Outdated dependencies** - Longer resolution time  
❌ **Failing tests** - Blocks workflow progression  

---

## Branching Strategy

```
main (Production)
  ├── Releases only
  └── Protected: Requires PR + passing checks

develop (Development)
  ├── Integration branch
  └── Feature branches merge here

feature/task-name
  ├── Created from: develop
  └── Merged back to: develop (via PR)

hotfix/urgent-fix
  ├── Created from: main (for urgent issues)
  └── Merged to: main & develop
```

---

## Documentation Standards

### Update Docs When

- [ ] Adding new feature
- [ ] Changing API endpoint
- [ ] Modifying deployment process
- [ ] Updating dependencies
- [ ] Fixing known issue

### Files to Update

- `README.md` - Feature overview
- `SETUP_GUIDE.md` - Installation changes
- `PROJECT_CONFIGURATION.md` - Tech stack updates
- Service comments - Code-level documentation

---

## Resources

### Quick Links
- GitHub Actions: [docs.github.com/actions](https://docs.github.com/actions)
- .NET 8.0: [learn.microsoft.com/dotnet](https://learn.microsoft.com/dotnet)
- React: [react.dev](https://react.dev)
- Git: [git-scm.com/docs](https://git-scm.com/docs)

### Local Testing
```bash
# Test backend build
dotnet build Backend/WildlifeSafari.sln

# Test frontend build
npm run build --prefix Frontend/wildlife-safari-app

# Test database scripts
sqlcmd -S .\SQLEXPRESS -i Database\Scripts\CreateDatabase.sql
```

---

## Support Escalation

| Issue | Check | Escalate |
|-------|-------|----------|
| Build fails locally | Your code | Team lead |
| Workflow error | GitHub Actions logs | DevOps |
| Database issue | Schema/connection | DBA |
| Dependency conflicts | package versions | Dev |

---

## Checklist Before Merge Request

- [ ] Code builds locally without errors
- [ ] All tests pass (if configured)
- [ ] No console warnings or errors  
- [ ] Commit messages follow conventions
- [ ] Branch is up-to-date with target (`develop` or `main`)
- [ ] Documentation files updated
- [ ] No secrets in code (.env, keys, passwords)
- [ ] Code follows team conventions
- [ ] PR description explains changes

---

*Last Updated: 2026-04-14*  
*Quick Reference Version: 1.0*
