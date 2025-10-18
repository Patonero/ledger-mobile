# Contributing to Ledger Mobile 🤝

Thank you for your interest in contributing to Ledger Mobile! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Code Style](#code-style)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- **Node.js** v22 or higher
- **npm** or **yarn**
- **Git**
- **Expo CLI** (optional but recommended)

### Development Setup

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ledger-mobile.git
   cd ledger-mobile
   ```

3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/Patonero/ledger-mobile.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Start development server**:
   ```bash
   npm start
   ```

6. **Run tests**:
   ```bash
   npm test
   ```

## 🎯 Contributing Guidelines

### What to Contribute

We welcome contributions in these areas:

- 🐛 **Bug fixes** - Help us squash those pesky bugs
- ✨ **New features** - Add functionality that enhances the gaming experience
- 📱 **Platform improvements** - iOS, Android, or Web-specific enhancements
- 🎨 **UI/UX improvements** - Make the app more beautiful and usable
- 🧪 **Tests** - Improve our test coverage (currently 91.86%)
- 📚 **Documentation** - Help others understand and use the app
- ⚡ **Performance** - Make the app faster and more battery-efficient

### Getting Assigned to Issues

1. **Browse** open issues labeled `good first issue` for newcomers
2. **Comment** on an issue you'd like to work on
3. **Wait** for maintainer assignment before starting work
4. **Ask questions** if you need clarification

## 📝 Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/) for automated versioning and changelog generation.

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools

### Examples

```bash
feat: add haptic feedback for life changes
fix: resolve modal overlay positioning on small screens
docs: update README with new installation steps
perf: optimize life total rendering performance
test: add unit tests for settings persistence
```

### Breaking Changes

For breaking changes, add `!` after the type or include `BREAKING CHANGE:` in the footer:

```bash
feat!: remove support for Node.js v18
feat: add new game mode

BREAKING CHANGE: Node.js v18 is no longer supported
```

## 🔄 Pull Request Process

### Before Creating a PR

1. **Sync** with upstream:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Create** a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make** your changes and commit using conventional commits

4. **Test** your changes:
   ```bash
   npm test
   npm run lint
   ```

5. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

### Creating the PR

1. **Go** to GitHub and create a Pull Request
2. **Fill out** the PR template completely
3. **Link** any related issues using keywords (`closes #123`)
4. **Add** screenshots for UI changes
5. **Request** review from maintainers

### PR Requirements

- ✅ All tests pass (`npm test`)
- ✅ Code follows our style guide (`npm run lint`)
- ✅ Maintains or improves test coverage (90%+ required)
- ✅ Includes appropriate documentation updates
- ✅ Follows conventional commit format
- ✅ PR description explains the changes clearly

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- App.test.js

# Run tests in watch mode
npm test -- --watch
```

### Writing Tests

- **Unit tests** for all new functionality
- **Integration tests** for complex features
- **Maintain 90%+ code coverage**
- **Use descriptive test names**
- **Follow existing test patterns**

### Test Categories

1. **Core functionality** - Life tracking, settings, persistence
2. **UI components** - Buttons, modals, layouts  
3. **Platform-specific** - Mobile vs web behavior
4. **Error handling** - Graceful degradation
5. **Performance** - Battery optimization features

## 🎨 Code Style

### ESLint Configuration

We use ESLint with our custom configuration. Run the linter:

```bash
npm run lint
```

### Style Guidelines

- **Use descriptive variable names**
- **Keep functions small and focused**
- **Add comments for complex logic**
- **Follow React Native best practices**
- **Optimize for battery efficiency**
- **Consider cross-platform compatibility**

### File Organization

```
├── App.js              # Main application component
├── __tests__/          # Test files
├── .github/            # GitHub templates and workflows
├── package.json        # Dependencies and scripts
└── README.md           # Project documentation
```

## 🎮 Gaming Focus

Remember that Ledger Mobile is built for gamers:

- **Battery efficiency** is crucial for long gaming sessions
- **Large touch targets** for tabletop use
- **Clear visibility** in various lighting conditions
- **Fast, responsive** interactions
- **Cross-platform** consistency

## 📞 Community

### Getting Help

- **💬 Discussions**: [GitHub Discussions](https://github.com/Patonero/ledger-mobile/discussions)
- **🐛 Bug Reports**: [Create an issue](https://github.com/Patonero/ledger-mobile/issues/new?template=bug_report.md)
- **💡 Feature Requests**: [Request a feature](https://github.com/Patonero/ledger-mobile/issues/new?template=feature_request.md)

### Communication Guidelines

- **Be respectful** and constructive
- **Provide context** when asking questions
- **Search existing** issues and discussions first
- **Use clear, descriptive** titles
- **Include relevant details** (platform, version, etc.)

## 🎉 Recognition

Contributors are recognized in several ways:

- **GitHub contributor** graph
- **Release notes** mention significant contributors
- **Special thanks** in project documentation
- **Maintainer consideration** for consistent contributors

## 📄 License

By contributing to Ledger Mobile, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

Thank you for helping make Ledger Mobile better for the Trading Card Game community! 🎮❤️