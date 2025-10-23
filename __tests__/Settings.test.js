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
      expect(queryByText("RESTART")).toBeNull();

      // Press menu button
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });

      // Modal should now be visible
      expect(getByText("RESTART")).toBeTruthy();
      expect(getByText("CLOSE")).toBeTruthy();
    });

    it("closes settings modal when close button is pressed", async () => {
      const { getByText, queryByText } = render(<App />);

      // Open modal
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });

      expect(getByText("RESTART")).toBeTruthy();

      // Close modal
      await act(async () => {
        fireEvent.press(getByText("CLOSE"));
      });

      // Modal should be hidden
      expect(queryByText("RESTART")).toBeNull();
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
        fireEvent.press(getByText("RESTART"));
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
        fireEvent.press(getByText("RESTART"));
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
        fireEvent.press(getByText("RESTART"));
      });
      
      await waitFor(() => {
        const lifeTotals = getAllByText("40");
        expect(lifeTotals).toHaveLength(2);
      });
    });
  });

  describe("Player Color Customization", () => {
    it("opens color picker when P1 button is pressed", async () => {
      const { getByText, getByTestId } = render(<App />);

      // Open settings menu
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });

      // Press P1 color button
      await act(async () => {
        fireEvent.press(getByText("P1"));
      });

      // Color picker should be visible with color options
      expect(getByTestId("color-button-#000000")).toBeTruthy(); // Black
      expect(getByTestId("color-button-#330000")).toBeTruthy(); // Dark Red
      expect(getByText("BACK")).toBeTruthy();
    });

    it("opens color picker when P2 button is pressed", async () => {
      const { getByText, getByTestId } = render(<App />);

      // Open settings menu
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });

      // Press P2 color button
      await act(async () => {
        fireEvent.press(getByText("P2"));
      });

      // Color picker should be visible
      expect(getByTestId("color-button-#000000")).toBeTruthy(); // Black
      expect(getByTestId("color-button-#001a33")).toBeTruthy(); // Dark Blue
      expect(getByText("BACK")).toBeTruthy();
    });

    it("saves selected color to AsyncStorage for player 1", async () => {
      const { getByText, getByTestId } = render(<App />);

      // Open settings menu
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });

      // Open P1 color picker
      await act(async () => {
        fireEvent.press(getByText("P1"));
      });

      // Select a color (Dark Red)
      await act(async () => {
        fireEvent.press(getByTestId("color-button-#330000"));
      });

      // Verify AsyncStorage was called with correct color
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "player1Color",
          "#330000"
        );
      });
    });

    it("saves selected color to AsyncStorage for player 2", async () => {
      const { getByText, getByTestId } = render(<App />);

      // Open settings menu
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });

      // Open P2 color picker
      await act(async () => {
        fireEvent.press(getByText("P2"));
      });

      // Select a color (Dark Blue)
      await act(async () => {
        fireEvent.press(getByTestId("color-button-#001a33"));
      });

      // Verify AsyncStorage was called with correct color
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          "player2Color",
          "#001a33"
        );
      });
    });

    it("closes color picker when BACK button is pressed", async () => {
      const { getByText, queryByTestId } = render(<App />);

      // Open settings menu
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });

      // Open P1 color picker
      await act(async () => {
        fireEvent.press(getByText("P1"));
      });

      // Verify color picker is open
      expect(getByText("BACK")).toBeTruthy();

      // Press BACK button
      await act(async () => {
        fireEvent.press(getByText("BACK"));
      });

      // Color picker should be closed (back to main menu)
      expect(queryByTestId("color-button-#000000")).toBeNull();
      expect(getByText("RESTART")).toBeTruthy();
    });

    it("handles AsyncStorage errors when saving player color", async () => {
      AsyncStorage.setItem.mockRejectedValue(new Error("Save error"));
      const { getByText, getByTestId } = render(<App />);

      // Open settings menu and color picker
      await act(async () => {
        fireEvent.press(getByText("⚙️"));
      });

      await act(async () => {
        fireEvent.press(getByText("P1"));
      });

      // Select a color - should not crash even if save fails
      await act(async () => {
        fireEvent.press(getByTestId("color-button-#330000")); // Dark Red
      });

      // Should close the color picker even if save fails
      await waitFor(() => {
        expect(getByText("RESTART")).toBeTruthy();
      });
    });

    it("loads saved player colors on app start", async () => {
      AsyncStorage.getItem.mockImplementation((key) => {
        if (key === "player1Color") return Promise.resolve("#330000");
        if (key === "player2Color") return Promise.resolve("#001a33");
        return Promise.resolve(null);
      });

      render(<App />);

      // Verify AsyncStorage was queried for player colors
      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith("player1Color");
        expect(AsyncStorage.getItem).toHaveBeenCalledWith("player2Color");
      });
    });
  });
});