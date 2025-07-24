# Ledger

A minimalistic cross-platform life tracker for Trading Card Games like Magic: The Gathering and Disney Lorcana.

<img height="380" alt="image" src="https://github.com/user-attachments/assets/0d3c9f28-2642-48d3-a24e-628bd28d9104" />

## ✨ Features

- **🎯 Tabletop Optimized**: Large touch zones (left/right thirds) for easy interaction across the table
- **🔄 Dual Player Support**: Player sections with 180° rotation for across-table visibility
- **🔋 Battery Efficient**: Dark theme and optimized rendering for long gaming sessions
- **⚙️ Flexible Settings**: Configurable starting life totals (0, 20, 40) to support different game formats
- **📱 Cross-Platform**: Runs on Android, iOS, and Web
- **🎮 Minimalistic Design**: Clean, distraction-free interface focused on gameplay

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
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

The app includes comprehensive unit tests with **68% code coverage**:

- **Core functionality**: Life tracking, bounds checking, haptic feedback
- **Persistence**: AsyncStorage integration and error handling
- **UI interactions**: Life change indicators and timeout behavior
- **Error resilience**: Graceful degradation when storage fails

Run tests with `npm test` or `npm run test:coverage` for detailed reports.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Roadmap

- [ ] Sound effects or haptics for life changes
- [ ] Game timer
- [ ] Multiple player support (3-4 players)

---

**Perfect for tournament play, casual games, and long EDH sessions!** 🎲
