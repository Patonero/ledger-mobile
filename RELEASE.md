# Release Process

This document describes how releases work for Ledger Mobile.

## Automated Release Process (Recommended)

The project uses GitHub Actions to automatically create releases when you push to `main`. No manual intervention needed!

### How It Works

1. **Push to main branch**: Every commit to `main` triggers the workflow
2. **Quality checks run**: Linting and tests must pass
3. **Automatic release detection**: The workflow checks if there are any `feat:` or `fix:` commits since the last release
4. **Version bump**: The version is automatically calculated based on commit types:
   - `feat:` commits → **minor** version bump (1.0.0 → 1.1.0)
   - `fix:` commits → **patch** version bump (1.0.0 → 1.0.1)
   - `BREAKING CHANGE:` or `!:` in commit → **major** version bump (1.0.0 → 2.0.0)
5. **Changelog generation**: A formatted changelog is automatically created from commits
6. **Git tag created**: A new git tag (e.g., `v1.0.0`) is pushed
7. **GitHub Release published**: A release appears on GitHub with the changelog

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>: <description>

[optional body]
```

**Types that trigger releases:**
- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)
- `perf:` - Performance improvements (patch version bump)
- `revert:` - Reverted commits (patch version bump)

**Types that don't trigger releases:**
- `chore:` - Build/tooling changes
- `docs:` - Documentation only
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Test changes
- `ci:` - CI/CD changes

### Example Commits

```bash
# Will trigger a minor release (1.0.0 → 1.1.0)
git commit -m "feat: add poison counter tracking"

# Will trigger a patch release (1.0.0 → 1.0.1)
git commit -m "fix: correct life total calculation"

# Will trigger a major release (1.0.0 → 2.0.0)
git commit -m "feat!: redesign UI with new layout"

# Will NOT trigger a release
git commit -m "chore: update dependencies"
git commit -m "docs: update README"
```

## Manual Release Process (Fallback)

If you need to create a release manually or the automated process fails:

### 1. Update Version in package.json

```bash
# Bump patch version (1.0.0 → 1.0.1)
npm version patch

# Bump minor version (1.0.0 → 1.1.0)
npm version minor

# Bump major version (1.0.0 → 2.0.0)
npm version major
```

This updates `package.json` and creates a git tag automatically.

### 2. Push the Tag

```bash
git push origin main --tags
```

### 3. Create GitHub Release

Go to https://github.com/YOUR_USERNAME/ledger-mobile/releases/new

- Select the tag you just created
- Add release title: `🚀 Ledger Mobile v1.0.0`
- Write release notes (or copy from the automated format below)
- Click "Publish release"

### Release Notes Template

```markdown
# 🚀 Release v1.0.0

## ✨ Features
- Add new feature X
- Implement feature Y

## 🐛 Bug Fixes
- Fix issue with life counters
- Resolve crash on startup

## 🏗️ Technical Improvements
- Update dependencies
- Improve test coverage

## 📱 App Store Links
- 🍎 **iOS**: Coming soon to the App Store
- 🤖 **Android**: Coming soon to Google Play Store
- 🌐 **Web**: [Try it online](https://ledger-mobile.netlify.app)

## 🛠️ Technical Details
- **React Native**: 0.79.5
- **Expo SDK**: 53
- **Test Coverage**: 91.86%
- **Platforms**: iOS, Android, Web

---
*Built with ❤️ for the Trading Card Game community*
```

## Troubleshooting

### "ambiguous argument 'v0.0.0..HEAD'" Error

**Problem**: This happens when the repository has no git tags yet.

**Solution**: This has been fixed in the workflow. If you still see this error:
1. Pull the latest changes from the `main` branch
2. The next push will create your first release automatically

### No Release Created

**Problem**: You pushed to main but no release was created.

**Solution**: Check your commit messages:
- Make sure you used `feat:`, `fix:`, `perf:`, or `revert:` prefixes
- Other commit types (`chore:`, `docs:`, etc.) don't trigger releases
- You can manually create a release using the steps above

### Release Failed Quality Checks

**Problem**: The release job didn't run because tests or linting failed.

**Solution**:
1. Check the Actions tab on GitHub to see what failed
2. Fix the issues locally:
   ```bash
   npm run lint:fix  # Fix linting issues
   npm test          # Run tests
   ```
3. Commit and push the fixes

### Need to Create a Release for Non-Feature Commits

**Problem**: You want to release changes that are only `chore:` or `docs:` commits.

**Solution**: Manually bump the version and push:
```bash
npm version patch
git push origin main --tags
```

Or include a `feat:` or `fix:` commit that summarizes the changes.

## Checking Current Version

```bash
# View version in package.json
node -p "require('./package.json').version"

# View latest git tag
git describe --tags --abbrev=0

# View all tags
git tag -l
```

## Release History

Check the [Releases page](https://github.com/YOUR_USERNAME/ledger-mobile/releases) to see all past releases.
