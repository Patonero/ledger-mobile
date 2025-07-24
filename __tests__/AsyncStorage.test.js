import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';

describe('AsyncStorage Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading Saved Starting Life', () => {
    it('loads saved starting life of 40 on app start', async () => {
      AsyncStorage.getItem.mockResolvedValue('40');
      
      const { getAllByText } = render(<App />);
      
      // Wait for both AsyncStorage call and UI update in single waitFor
      await waitFor(
        () => {
          expect(AsyncStorage.getItem).toHaveBeenCalledWith('startingLife');
          const lifeTotals = getAllByText('40');
          expect(lifeTotals).toHaveLength(2);
        },
        { timeout: 10000 } // Increased timeout for CI
      );
    }, 15000); // Test timeout increased

    it('loads saved starting life of 0 on app start', async () => {
      AsyncStorage.getItem.mockResolvedValue('0');
      
      const { getAllByText } = render(<App />);
      
      await waitFor(
        () => {
          expect(AsyncStorage.getItem).toHaveBeenCalledWith('startingLife');
          const lifeTotals = getAllByText('0');
          expect(lifeTotals).toHaveLength(2);
        },
        { timeout: 10000 }
      );
    }, 15000);

    it('uses default starting life when no saved value exists', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      const { getAllByText } = render(<App />);
      
      await waitFor(
        () => {
          expect(AsyncStorage.getItem).toHaveBeenCalledWith('startingLife');
          const lifeTotals = getAllByText('20');
          expect(lifeTotals).toHaveLength(2);
        },
        { timeout: 10000 }
      );
    }, 15000);

    it('handles AsyncStorage errors gracefully', async () => {
      AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
      
      const { getAllByText } = render(<App />);
      
      await waitFor(
        () => {
          expect(AsyncStorage.getItem).toHaveBeenCalledWith('startingLife');
          // Should still show default values
          const lifeTotals = getAllByText('20');
          expect(lifeTotals).toHaveLength(2);
        },
        { timeout: 10000 }
      );
    }, 15000);
  });

  describe('AsyncStorage Error Handling', () => {
    it('continues to function when AsyncStorage is unavailable', async () => {
      AsyncStorage.getItem.mockRejectedValue(new Error('Storage unavailable'));
      AsyncStorage.setItem.mockRejectedValue(new Error('Storage unavailable'));
      
      const { getAllByText } = render(<App />);
      
      // App should still render and function with default values
      await waitFor(
        () => {
          const lifeTotals = getAllByText('20');
          expect(lifeTotals).toHaveLength(2);
        },
        { timeout: 10000 }
      );
    }, 15000);
  });
});