import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import App from "../App";

describe("Ledger Mobile App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  describe("Initial State", () => {
    it("renders with default starting life of 20 for both players", () => {
      const { getAllByText } = render(<App />);
      const lifeTotals = getAllByText("20");
      expect(lifeTotals).toHaveLength(2);
    });

    it("displays player sections with correct buttons", () => {
      const { getAllByText } = render(<App />);
      expect(getAllByText("-")).toHaveLength(2);
      expect(getAllByText("+")).toHaveLength(2);
    });

    it("shows menu button in center section", () => {
      const { getByText } = render(<App />);
      expect(getByText("⚙️")).toBeTruthy();
    });
  });

  describe("Life Tracking", () => {
    it("increases player 1 life when + button is pressed", async () => {
      const { getAllByText } = render(<App />);
      const increaseButtons = getAllByText("+");

      await act(async () => {
        fireEvent.press(increaseButtons[1]); // Player 1 (bottom)
      });

      expect(getAllByText("21")[0]).toBeTruthy();
    });

    it("decreases player 1 life when - button is pressed", async () => {
      const { getAllByText } = render(<App />);
      const decreaseButtons = getAllByText("-");

      await act(async () => {
        fireEvent.press(decreaseButtons[1]); // Player 1 (bottom)
      });

      expect(getAllByText("19")[0]).toBeTruthy();
    });

    it("increases player 2 life when + button is pressed", async () => {
      const { getAllByText } = render(<App />);
      const increaseButtons = getAllByText("+");

      await act(async () => {
        fireEvent.press(increaseButtons[0]); // Player 2 (top)
      });

      expect(getAllByText("21")[0]).toBeTruthy();
    });

    it("decreases player 2 life when - button is pressed", async () => {
      const { getAllByText } = render(<App />);
      const decreaseButtons = getAllByText("-");

      await act(async () => {
        fireEvent.press(decreaseButtons[0]); // Player 2 (top)
      });

      expect(getAllByText("19")[0]).toBeTruthy();
    });

    it("prevents life from going below 0", async () => {
      const { getAllByText } = render(<App />);
      const decreaseButtons = getAllByText("-");

      // Press decrease button 25 times to try to go below 0
      await act(async () => {
        for (let i = 0; i < 25; i++) {
          fireEvent.press(decreaseButtons[1]);
        }
      });

      expect(getAllByText("0")[0]).toBeTruthy();
    });

    it("shows life change indicators", async () => {
      const { getAllByText, getByText } = render(<App />);
      const increaseButtons = getAllByText("+");

      await act(async () => {
        fireEvent.press(increaseButtons[1]);
      });

      expect(getByText("+1")).toBeTruthy();
    });

    it("shows cumulative life changes", async () => {
      const { getAllByText, getByText } = render(<App />);
      const increaseButtons = getAllByText("+");

      await act(async () => {
        fireEvent.press(increaseButtons[1]);
        fireEvent.press(increaseButtons[1]);
        fireEvent.press(increaseButtons[1]);
      });

      expect(getByText("+3")).toBeTruthy();
    });

    it("shows negative life changes", async () => {
      const { getAllByText, getByText } = render(<App />);
      const decreaseButtons = getAllByText("-");

      await act(async () => {
        fireEvent.press(decreaseButtons[1]);
        fireEvent.press(decreaseButtons[1]);
      });

      expect(getByText("-2")).toBeTruthy();
    });
  });

  describe("Haptic Feedback", () => {
    it("triggers light haptic feedback on life adjustment", async () => {
      const { getAllByText } = render(<App />);
      const increaseButtons = getAllByText("+");

      await act(async () => {
        fireEvent.press(increaseButtons[0]);
      });

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Light
      );
    });
  });

  describe("AsyncStorage Integration", () => {
    it("loads saved starting life on app start", async () => {
      AsyncStorage.getItem.mockResolvedValue("40");
      
      const { getAllByText } = render(<App />);
      
      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith("startingLife");
      });

      await waitFor(() => {
        const lifeTotals = getAllByText("40");
        expect(lifeTotals).toHaveLength(2);
      });
    });

    it("uses default starting life when no saved value exists", async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      
      const { getAllByText } = render(<App />);
      
      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith("startingLife");
      });

      const lifeTotals = getAllByText("20");
      expect(lifeTotals).toHaveLength(2);
    });

    it("handles AsyncStorage errors gracefully", async () => {
      AsyncStorage.getItem.mockRejectedValue(new Error("Storage error"));
      
      const { getAllByText } = render(<App />);
      
      await waitFor(() => {
        expect(AsyncStorage.getItem).toHaveBeenCalledWith("startingLife");
      });

      // Should still show default values
      const lifeTotals = getAllByText("20");
      expect(lifeTotals).toHaveLength(2);
    });
  });

  describe("Life Change Timeout", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("clears life change indicator after timeout", async () => {
      const { getAllByText, queryByText } = render(<App />);
      const increaseButtons = getAllByText("+");

      await act(async () => {
        fireEvent.press(increaseButtons[0]);
      });

      expect(queryByText("+1")).toBeTruthy();

      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      expect(queryByText("+1")).toBeNull();
    });
  });
});