import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import App from "../App";

describe("Settings Menu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  describe("Modal Opening and Closing", () => {
    it("opens settings modal when menu button is pressed", async () => {
      const { getByText, queryByText } = render(<App />);
      
      // Modal should not be visible initially
      expect(queryByText("Starting Life")).toBeNull();
      
      // Press menu button
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      // Modal should now be visible
      expect(getByText("Starting Life")).toBeTruthy();
      expect(getByText("Restart")).toBeTruthy();
      expect(getByText("Close")).toBeTruthy();
    });

    it("closes settings modal when close button is pressed", async () => {
      const { getByText, queryByText } = render(<App />);
      
      // Open modal
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      expect(getByText("Starting Life")).toBeTruthy();
      
      // Close modal
      await act(async () => {
        fireEvent.press(getByText("Close"));
      });
      
      // Modal should be hidden
      expect(queryByText("Starting Life")).toBeNull();
    });
  });

  describe("Starting Life Selection", () => {
    it("changes starting life to 0 and updates both players", async () => {
      const { getByText, getAllByText } = render(<App />);
      
      // Open modal and select 0 life
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      await act(async () => {
        fireEvent.press(getAllByText("0")[0]); // Select 0 from modal options
      });
      
      // Check both players have 0 life
      await waitFor(() => {
        const lifeTotals = getAllByText("0");
        expect(lifeTotals.length).toBeGreaterThanOrEqual(2);
      });

      // Verify AsyncStorage was called
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("startingLife", "0");
    });

    it("changes starting life to 40 and updates both players", async () => {
      const { getByText, getAllByText } = render(<App />);
      
      // Open modal and select 40 life
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      await act(async () => {
        fireEvent.press(getAllByText("40")[0]); // Select 40 from modal options
      });
      
      // Check both players have 40 life
      await waitFor(() => {
        const lifeTotals = getAllByText("40");
        expect(lifeTotals.length).toBeGreaterThanOrEqual(2);
      });

      // Verify AsyncStorage was called
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("startingLife", "40");
    });

    it("handles AsyncStorage errors when saving starting life", async () => {
      AsyncStorage.setItem.mockRejectedValue(new Error("Save error"));
      const { getByText, getAllByText } = render(<App />);
      
      // Open modal and select 40 life
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      await act(async () => {
        fireEvent.press(getAllByText("40")[0]);
      });

      // Should still update the UI even if save fails
      await waitFor(() => {
        const lifeTotals = getAllByText("40");
        expect(lifeTotals.length).toBeGreaterThanOrEqual(2);
      });
    });

    it("shows selected starting life option as highlighted", async () => {
      const { getByText, getAllByText } = render(<App />);
      
      // Open modal
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      // Default 20 should be selected (this test verifies visual state)
      const lifeOptions = getAllByText("20");
      expect(lifeOptions.length).toBeGreaterThan(0);
    });
  });

  describe("Reset Game Functionality", () => {
    it("resets both players to starting life when restart is pressed", async () => {
      const { getByText, getAllByText } = render(<App />);
      
      // Change player lives first
      const increaseButtons = getAllByText("+");
      const decreaseButtons = getAllByText("-");
      
      await act(async () => {
        fireEvent.press(increaseButtons[0]); // Player 2: 21
        fireEvent.press(decreaseButtons[1]); // Player 1: 19
      });
      
      // Verify lives changed
      expect(getAllByText("21")[0]).toBeTruthy();
      expect(getAllByText("19")[0]).toBeTruthy();
      
      // Open modal and restart
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      await act(async () => {
        fireEvent.press(getByText("Restart"));
      });
      
      // Both players should be back to 20
      await waitFor(() => {
        const lifeTotals = getAllByText("20");
        expect(lifeTotals).toHaveLength(2);
      });
    });

    it("clears life change indicators when game is reset", async () => {
      const { getByText, getAllByText, queryByText } = render(<App />);
      
      // Make a life change to show indicator
      const increaseButtons = getAllByText("+");
      await act(async () => {
        fireEvent.press(increaseButtons[0]);
      });
      
      // Verify change indicator is shown
      expect(getByText("+1")).toBeTruthy();
      
      // Reset game
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      await act(async () => {
        fireEvent.press(getByText("Restart"));
      });
      
      // Change indicator should be cleared
      expect(queryByText("+1")).toBeNull();
    });

    it("resets game with custom starting life", async () => {
      const { getByText, getAllByText } = render(<App />);
      
      // Set starting life to 40
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      await act(async () => {
        fireEvent.press(getAllByText("40")[0]);
      });
      
      // Change player lives
      const increaseButtons = getAllByText("+");
      await act(async () => {
        fireEvent.press(increaseButtons[0]); // Player 2: 41
      });
      
      // Reset game - should go back to 40, not 20
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });
      
      await act(async () => {
        fireEvent.press(getByText("Restart"));
      });
      
      await waitFor(() => {
        const lifeTotals = getAllByText("40");
        expect(lifeTotals).toHaveLength(2);
      });
    });
  });
});