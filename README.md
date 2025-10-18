# Ledger Mobile 🎮

> A minimalistic, battery-efficient life tracker for Trading Card Games

[![Quality Control](https://github.com/Patonero/ledger-mobile/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Patonero/ledger-mobile/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2053-black.svg)](https://expo.dev/)

Ledger is a cross-platform mobile app designed for tracking life totals in Trading Card Games like **Magic: The Gathering** and **Lorcana**. Built with React Native and Expo for optimal battery efficiency during long gaming sessions.

## 📱 Download

<div align="center">

### Coming Soon to App Stores!

<!-- Uncomment when published to app stores -->
<!--
[![Download on the App Store](https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg)](https://apps.apple.com/app/your-app-id)
[![Get it on Google Play](https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png)](https://play.google.com/store/apps/details?id=your.package.name)
-->

**iOS** • **Android** • **Web**

### 📸 Screenshots

<img height="380" alt="Ledger Mobile - Life Tracking Interface" src="https://github.com/user-attachments/assets/0d3c9f28-2642-48d3-a24e-628bd28d9104" />
<img height="180" alt="Ledger Mobile - Settings Menu" src="https://github.com/user-attachments/assets/bfff6e81-a325-4373-9c93-b4be8f496a94" />

</div>

## ✨ Features

- **🎯 Tabletop Optimized**: Large touch zones (left/right thirds) for easy interaction across the table
- **🔄 Dual Player Support**: Player sections with 180° rotation for across-table visibility
- **🔋 Battery Efficient**: Dark theme and optimized rendering for long gaming sessions
- **⚙️ Flexible Settings**: Configurable starting life totals (0, 20, 40) to support different game formats
- **📱 Cross-Platform**: Runs on Android, iOS, and Web
- **🎮 Minimalistic Design**: Clean, distraction-free interface focused on gameplay

## 🚀 Quick Start

### Prerequisites

- Node.js (v22 or higher)
- npm or yarn
- Expo CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ledger

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

**Mobile (Recommended)**:

1. Install Expo Go on your phone
2. Scan the QR code from the terminal/browser
3. App loads instantly for testing

**Android Emulator**:

```bash
npm run android
```

**iOS Simulator**:

```bash
npm run ios
```

**Web Browser**:

```bash
npm run web
```

## 🎮 How to Use

### Basic Controls

- **Tap left third** of player section: Decrease life by 1
- **Tap right third** of player section: Increase life by 1
- **Center section displays** current life total

### Settings Menu

- **Tap the ⚙️ button** in the center to open settings
- **Restart**: Reset both players to current starting life
- **Starting Life**: Choose from 0, 20, or 40 life

### Game Format Support

- **20 Life**: Magic: The Gathering
- **40 Life**: MTG Commander/EDH, Two-Headed Giant
- **0 Life**: Lorcana

## 🏗️ Technical Details

### Built With

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and build tools
- **React Native Web** - Web compatibility layer

### Key Design Decisions

- **Large Touch Targets**: Each button zone covers 1/3 of the screen width for tabletop accessibility
- **Player Rotation**: Top player section rotated 180° so both players can read their life totals
- **Battery Optimization**: Dark theme, minimal animations, screen wake lock during play
- **Responsive Design**: Works on phones, tablets, and desktop browsers

### Project Structure

```
├── App.js              # Main application component
├── app.json            # Expo configuration
├── package.json        # Dependencies and scripts
├── web/
│   └── index.html      # Web build template
└── README.md           # This file
```

## 🔧 Development

### Common Commands

- `npm start` - Start development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run in browser
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Check code quality

### Architecture Notes

- Single-file React Native component for simplicity
- Modal-based settings menu for clean UX
- Flexbox layout with touch zones spanning full height
- Platform-specific optimizations (keep-awake on mobile)

### Testing

The app includes comprehensive unit tests with **91.86% code coverage**:

- **Core functionality**: Life tracking, bounds checking, haptic feedback
- **Persistence**: AsyncStorage integration and error handling
- **UI interactions**: Life change indicators and timeout behavior
- **Error resilience**: Graceful degradation when storage fails

Run tests with `npm test` or `npm run test:coverage` for detailed reports.

## 🔄 Release Process

This project uses automated semantic versioning and professional release management:

- **Patch** (`fix:`): Bug fixes and minor improvements
- **Minor** (`feat:`): New features and enhancements  
- **Major** (`feat!:` or `BREAKING CHANGE:`): Breaking changes

Every push to `main` triggers automated testing, linting, and GitHub release generation with professional changelogs.

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes and add tests (maintain 90%+ coverage)
4. **Test** your changes (`npm test` and `npm run lint`)
5. **Commit** using conventional commits (`feat: add amazing feature`)
6. **Push** to your branch (`git push origin feature/amazing-feature`)
7. **Create** a Pull Request

### Development Setup
```bash
git clone https://github.com/Patonero/ledger-mobile.git
cd ledger-mobile
npm install
npm start
```

## 📞 Support & Community

- **🐛 Bug Reports**: [Create an issue](https://github.com/Patonero/ledger-mobile/issues/new?template=bug_report.md)
- **💡 Feature Requests**: [Request a feature](https://github.com/Patonero/ledger-mobile/issues/new?template=feature_request.md)
- **💬 Discussions**: [GitHub Discussions](https://github.com/Patonero/ledger-mobile/discussions)
- **📚 Documentation**: Check our [Wiki](https://github.com/Patonero/ledger-mobile/wiki)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Roadmap

- [ ] Sound effects or haptics for life changes
- [ ] Game timer
- [ ] Multiple player support (3-4 players)

## 🙏 Acknowledgments

Built with ❤️ for the Trading Card Game community.

Special thanks to all contributors and the open-source community.

---

<div align="center">

**Made for gamers, by gamers** 🎮

[⭐ Star this repo](https://github.com/Patonero/ledger-mobile) if you find it useful! • [🍴 Fork](https://github.com/Patonero/ledger-mobile/fork) to contribute

**Perfect for tournament play, casual games, and long EDH sessions!** 🎲

</div>
