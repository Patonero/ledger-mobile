import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as KeepAwake from "expo-keep-awake";

const { width, height } = Dimensions.get("window");

export default function App() {
  const [player1Life, setPlayer1Life] = useState(20);
  const [player2Life, setPlayer2Life] = useState(20);
  const [startingLife, setStartingLife] = useState(20);
  const [menuVisible, setMenuVisible] = useState(false);
  const [lifeChanges, setLifeChanges] = useState({ player1: 0, player2: 0 });
  const timeoutRefs = useMemo(() => ({ player1: null, player2: null }), []);

  // Load saved starting life on app start
  useEffect(() => {
    const loadStartingLife = async () => {
      try {
        const savedStartingLife = await AsyncStorage.getItem("startingLife");
        if (savedStartingLife !== null) {
          const life = parseInt(savedStartingLife, 10);
          setStartingLife(life);
          setPlayer1Life(life);
          setPlayer2Life(life);
        }
      } catch (error) {
        console.log("Error loading starting life:", error);
      }
    };

    loadStartingLife();
  }, []);

  // Keep screen awake during gameplay (mobile only)
  useEffect(() => {
    if (Platform.OS !== "web") {
      try {
        KeepAwake.activateKeepAwakeAsync();
        return () => {
          try {
            KeepAwake.deactivateKeepAwake();
          } catch (error) {
            console.log("Error deactivating keep awake:", error);
          }
        };
      } catch (error) {
        console.log("Error activating keep awake:", error);
      }
    }
  }, []);

  const adjustLife = useCallback(
    (player, amount) => {
      const playerKey = `player${player}`;

      if (player === 1) {
        setPlayer1Life((prev) => Math.max(0, prev + amount));
      } else {
        setPlayer2Life((prev) => Math.max(0, prev + amount));
      }

      // Clear existing timeout
      if (timeoutRefs[playerKey]) {
        clearTimeout(timeoutRefs[playerKey]);
      }

      // Update cumulative change
      setLifeChanges((prev) => ({
        ...prev,
        [playerKey]: prev[playerKey] + amount,
      }));

      // Set new timeout to clear the change display
      timeoutRefs[playerKey] = setTimeout(() => {
        setLifeChanges((prev) => ({
          ...prev,
          [playerKey]: 0,
        }));
        timeoutRefs[playerKey] = null;
      }, 2000);
    },
    [timeoutRefs]
  );

  const resetGame = useCallback(() => {
    setPlayer1Life(startingLife);
    setPlayer2Life(startingLife);
    setLifeChanges({ player1: 0, player2: 0 });
    if (timeoutRefs.player1) clearTimeout(timeoutRefs.player1);
    if (timeoutRefs.player2) clearTimeout(timeoutRefs.player2);
    timeoutRefs.player1 = null;
    timeoutRefs.player2 = null;
    setMenuVisible(false);
  }, [startingLife, timeoutRefs]);

  const setStartingLifeTotal = useCallback(async (life) => {
    setStartingLife(life);
    setPlayer1Life(life);
    setPlayer2Life(life);
    setMenuVisible(false);

    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem("startingLife", life.toString());
    } catch (error) {
      console.log("Error saving starting life:", error);
    }
  }, []);

  const PlayerSection = memo(
    ({ playerNumber, life, lifeChange, isTop = false }) => {
      const onDecreasePress = useCallback(
        () => adjustLife(playerNumber, -1),
        [adjustLife, playerNumber]
      );
      const onIncreasePress = useCallback(
        () => adjustLife(playerNumber, 1),
        [adjustLife, playerNumber]
      );
      const containerStyle = useMemo(
        () => [styles.playerSection, isTop && styles.topPlayer],
        [isTop]
      );

      return (
        <View style={containerStyle}>
          <TouchableOpacity
            style={styles.decreaseZone}
            onPress={onDecreasePress}
            activeOpacity={0.3}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          <View style={styles.lifeZone}>
            {lifeChange !== 0 && (
              <Text style={styles.lifeChange}>
                {lifeChange > 0 ? `+${lifeChange}` : lifeChange}
              </Text>
            )}
            <Text style={styles.lifeTotal}>{life}</Text>
          </View>

          <TouchableOpacity
            style={styles.increaseZone}
            onPress={onIncreasePress}
            activeOpacity={0.3}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      );
    }
  );

  return (
    <View style={styles.container}>
      {Platform.OS !== "web" && <StatusBar hidden />}

      <PlayerSection
        playerNumber={2}
        life={player2Life}
        lifeChange={lifeChanges.player2}
        isTop={true}
      />

      <View style={styles.centerSection}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
        >
          <Text style={styles.menuButtonText}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
              <Text style={styles.modalButtonText}>Restart</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Starting Life</Text>

            <View style={styles.lifeOptionsContainer}>
              <TouchableOpacity
                style={[
                  styles.lifeOption,
                  startingLife === 0 && styles.selectedLifeOption,
                ]}
                onPress={() => setStartingLifeTotal(0)}
              >
                <Text
                  style={[
                    styles.lifeOptionText,
                    startingLife === 0 && styles.selectedLifeOptionText,
                  ]}
                >
                  0
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.lifeOption,
                  startingLife === 20 && styles.selectedLifeOption,
                ]}
                onPress={() => setStartingLifeTotal(20)}
              >
                <Text
                  style={[
                    styles.lifeOptionText,
                    startingLife === 20 && styles.selectedLifeOptionText,
                  ]}
                >
                  20
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.lifeOption,
                  startingLife === 40 && styles.selectedLifeOption,
                ]}
                onPress={() => setStartingLifeTotal(40)}
              >
                <Text
                  style={[
                    styles.lifeOptionText,
                    startingLife === 40 && styles.selectedLifeOptionText,
                  ]}
                >
                  40
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <PlayerSection
        playerNumber={1}
        life={player1Life}
        lifeChange={lifeChanges.player1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    ...(Platform.OS === "web" && {
      width: "100vw",
      height: "100vh",
      maxWidth: "none",
      maxHeight: "none",
      alignSelf: "stretch",
      margin: 0,
      borderRadius: 0,
      overflow: "hidden",
    }),
  },
  playerSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  topPlayer: {
    transform: [{ rotate: "180deg" }],
  },
  decreaseZone: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
  increaseZone: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 255, 0, 0.1)",
  },
  lifeZone: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lifeTotal: {
    color: "#fff",
    fontSize: 72,
    fontWeight: "bold",
    textAlign: "center",
  },
  lifeChange: {
    position: "absolute",
    top: -30,
    color: "#4CAF50",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    opacity: 0.7,
  },
  centerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#333",
  },
  menuButton: {
    backgroundColor: "#555",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    minWidth: 250,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#d73027",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  lifeOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  lifeOption: {
    backgroundColor: "#555",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedLifeOption: {
    backgroundColor: "#1a9850",
  },
  lifeOptionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedLifeOptionText: {
    color: "#fff",
  },
  closeButton: {
    backgroundColor: "#555",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
