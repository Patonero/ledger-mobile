# Version Management Guide

This project uses automated semantic versioning based on commit messages.

## How It Works

When you push to `main`, the CI/CD pipeline automatically:

1. **Analyzes recent commit messages** to determine version bump type
2. **Updates package.json and app.json** with new versions
3. **Increments build numbers** (Android versionCode, iOS buildNumber)
4. **Commits changes back** to the repository
5. **Builds the app** with the new version

## Commit Message Format

Use these prefixes to control version bumping:

### Major Version (1.0.0 → 2.0.0)
- `feat!: breaking change description`
- `BREAKING CHANGE: description` (in commit body)

### Minor Version (1.0.0 → 1.1.0)  
- `feat: add new feature`
- `feature: add new feature`

### Patch Version (1.0.0 → 1.0.1) - Default
- `fix: bug fix description`
- `chore: maintenance task`
- `docs: documentation update`
- Any other commit message format

## Examples

```bash
# Will bump to 1.1.0 (minor)
git commit -m "feat: add orientation indicator to life totals"

# Will bump to 1.0.1 (patch)  
git commit -m "fix: resolve React version compatibility issue"

# Will bump to 2.0.0 (major)
git commit -m "feat!: redesign app architecture"
```

## Build Numbers

- **Android versionCode**: Increments by 1 each build (1, 2, 3...)
- **iOS buildNumber**: Increments by 1 each build ("1", "2", "3"...)

## Automated Release Process

When you push to `main`, the system will:

1. **Bump version** based on commit messages
2. **Update version files** (package.json, app.json)
3. **Generate changelog** from commit history
4. **Create git tag** for the release
5. **Build the app** with EAS Build
6. **Create GitHub release** with:
   - Categorized changelog
   - Build information
   - Download links
   - Technical details
   - Testing coverage info

## Version Files Updated

- `package.json` - npm version
- `app.json` - Expo version, versionCode, buildNumber
- Git commit with `[skip ci]` to avoid infinite loops
- Git tag created for release

## Skipping Version Bump

Add `[skip ci]` to commit message to skip the entire pipeline:

```bash
git commit -m "docs: update README [skip ci]"
```