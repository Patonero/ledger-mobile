# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ledger is a minimalistic cross-platform mobile app for tracking life totals in Trading Card Games like MTG and Lorcana. Built with React Native/Expo for optimal battery efficiency during long gaming sessions.

## Development Setup

This is a React Native Expo project. Ensure you have Node.js and npm installed.

## Common Commands

- `npm start` - Start the development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser (optimized for desktop/tablet use)

## Architecture Notes

- **App.js**: Main application component with life tracking logic
- **Battery Optimization**: Uses expo-keep-awake to prevent screen dimming (mobile only)
- **Cross-platform UI**: Designed for tabletop use with player sections that can be read from opposite sides
- **Web Support**: Responsive design with mobile-first approach, desktop optimization
- **Minimal Dependencies**: Only essential packages to reduce app size and improve performance

## Key Features

- Dual player life tracking with +/-1 and +/-5 buttons
- Player 2 section rotated 180° for across-table visibility  
- Game mode switching (MTG/Lorcana)
- Reset functionality
- Black theme to minimize battery drain
- Screen stays awake during gameplay

## Battery Optimization Strategies

- Dark theme reduces OLED screen power consumption
- Minimal animations and transitions
- Screen wake lock only when app is active
- Efficient React Native rendering with minimal re-renders

## Tabletop Design Considerations

- Large, easily readable life totals (72px font)
- High contrast colors for visibility in various lighting
- Touch-friendly button sizes (60px diameter)
- Symmetric layout for multi-player use
- Web version optimized for tablets and desktop browsers
- Mobile-first responsive design ensures usability across all screen sizes