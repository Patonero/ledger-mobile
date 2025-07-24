// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock expo-keep-awake
jest.mock('expo-keep-awake', () => ({
  activateKeepAwakeAsync: jest.fn(),
  deactivateKeepAwake: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Silence console warnings during tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};