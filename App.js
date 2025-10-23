import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as KeepAwake from "expo-keep-awake";
import * as Haptics from "expo-haptics";
import * as NavigationBar from "expo-navigation-bar";

const { width, height } = Dimensions.get("window");

// Responsive sizing for small screens
const isSmallScreen = width < 360;
const buttonPadding = isSmallScreen ? 12 : 24;
const buttonFontSize = isSmallScreen ? 16 : 24;
const labelFontSize = isSmallScreen ? 12 : 16;

// Battery-optimized dark color palette
const COLOR_PALETTE = [
  { name: "Black", value: "#000000" },
  { name: "Dark Red", value: "#330000" },
  { name: "Dark Blue", value: "#001a33" },
  { name: "Dark Green", value: "#001a00" },
  { name: "Dark Purple", value: "#1a0033" },
  { name: "Dark Orange", value: "#331a00" },
  { name: "Dark Teal", value: "#001a1a" },
  { name: "Dark Magenta", value: "#33001a" },
];

export default function App() {
  const [player1Life, setPlayer1Life] = useState(20);
  const [player2Life, setPlayer2Life] = useState(20);
  const [startingLife, setStartingLife] = useState(20);
  const [menuVisible, setMenuVisible] = useState(false);
  const [lifeChanges, setLifeChanges] = useState({ player1: 0, player2: 0 });
  const [player1Color, setPlayer1Color] = useState("#000000");
  const [player2Color, setPlayer2Color] = useState("#000000");
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [colorPickerPlayer, setColorPickerPlayer] = useState(null);
  const timeoutRefs = useMemo(() => ({ player1: null, player2: null }), []);

  // Load saved preferences on app start
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedStartingLife = await AsyncStorage.getItem("startingLife");
        if (savedStartingLife !== null) {
          const life = parseInt(savedStartingLife, 10);
          setStartingLife(life);
          setPlayer1Life(life);
          setPlayer2Life(life);
        }

        const savedPlayer1Color = await AsyncStorage.getItem("player1Color");
        if (savedPlayer1Color !== null) {
          setPlayer1Color(savedPlayer1Color);
        }

        const savedPlayer2Color = await AsyncStorage.getItem("player2Color");
        if (savedPlayer2Color !== null) {
          setPlayer2Color(savedPlayer2Color);
        }
      } catch (error) {
        console.log("Error loading preferences:", error);
      }
    };

    loadPreferences();
  }, []);

  // Keep screen awake and hide navigation bar during gameplay (mobile only)
  useEffect(() => {
    if (Platform.OS !== "web") {
      try {
        KeepAwake.activateKeepAwakeAsync();

        // Hide Android navigation bar for immersive experience
        if (Platform.OS === "android") {
          NavigationBar.setVisibilityAsync("hidden");
        }

        return () => {
          try {
            KeepAwake.deactivateKeepAwake();

            // Restore navigation bar when app closes
            if (Platform.OS === "android") {
              NavigationBar.setVisibilityAsync("visible");
            }
          } catch (error) {
            console.log(
              "Error deactivating keep awake or restoring nav bar:",
              error
            );
          }
        };
      } catch (error) {
        console.log("Error activating keep awake or hiding nav bar:", error);
      }
    }
  }, []);

  // Ensure navigation bar stays hidden when modal opens
  useEffect(() => {
    if (Platform.OS === "android" && menuVisible) {
      try {
        NavigationBar.setVisibilityAsync("hidden");
      } catch (error) {
        console.log("Error hiding nav bar on modal open:", error);
      }
    }
  }, [menuVisible]);

  const adjustLife = useCallback(
    (player, amount) => {
      const playerKey = `player${player}`;

      // Haptic feedback - different patterns for different amounts
      if (Platform.OS !== "web") {
        if (Math.abs(amount) === 1) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      }

      if (player === 1) {
        setPlayer1Life((prev) => prev + amount);
      } else {
        setPlayer2Life((prev) => prev + amount);
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

  const openColorPicker = useCallback((playerNumber) => {
    setColorPickerPlayer(playerNumber);
    setColorPickerVisible(true);
  }, []);

  const selectPlayerColor = useCallback(
    async (color) => {
      if (colorPickerPlayer === 1) {
        setPlayer1Color(color);
        try {
          await AsyncStorage.setItem("player1Color", color);
        } catch (error) {
          console.log("Error saving player 1 color:", error);
        }
      } else if (colorPickerPlayer === 2) {
        setPlayer2Color(color);
        try {
          await AsyncStorage.setItem("player2Color", color);
        } catch (error) {
          console.log("Error saving player 2 color:", error);
        }
      }
      setColorPickerVisible(false);
      setColorPickerPlayer(null);
    },
    [colorPickerPlayer]
  );

  const ColorPicker = memo(({ visible, player, onSelectColor, onClose }) => {
    const currentPlayerColor = player === 1 ? player1Color : player2Color;

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View
          style={[
            styles.modalOverlay,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <View style={styles.colorPickerContent}>
            <Text style={styles.colorPickerTitle}>Player {player} Color</Text>

            <View style={styles.colorSwatchContainer}>
              {COLOR_PALETTE.map((color) => (
                <TouchableOpacity
                  key={color.value}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color.value },
                    currentPlayerColor === color.value &&
                      styles.selectedColorSwatch,
                  ]}
                  onPress={() => onSelectColor(color.value)}
                  activeOpacity={0.7}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.colorPickerCloseButton}
              onPress={onClose}
            >
              <Text style={styles.colorPickerCloseButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  });

  const PlayerSection = memo(
    ({ playerNumber, life, lifeChange, isTop = false, backgroundColor }) => {
      const onDecreasePress = useCallback(
        () => adjustLife(playerNumber, -1),
        [adjustLife, playerNumber]
      );
      const onIncreasePress = useCallback(
        () => adjustLife(playerNumber, 1),
        [adjustLife, playerNumber]
      );
      const containerStyle = useMemo(
        () => [
          styles.playerSection,
          isTop && styles.topPlayer,
          { backgroundColor: backgroundColor },
        ],
        [isTop, backgroundColor]
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
            <View style={styles.lifeTotalContainer}>
              <Text style={styles.lifeTotal}>{life}</Text>
              <View style={styles.orientationDot} />
            </View>
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
      <StatusBar style="light" hidden={Platform.OS !== "web"} translucent />

      <PlayerSection
        playerNumber={2}
        life={player2Life}
        lifeChange={lifeChanges.player2}
        isTop={true}
        backgroundColor={player2Color}
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
          {/* Row 1: RESTART */}
          <View style={styles.menuRow}>
            <TouchableOpacity style={styles.largeButton} onPress={resetGame}>
              <Text style={styles.largeButtonText}>RESTART</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2: STARTING LIFE */}
          <View style={styles.menuRowWithLabel}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.largeButton,
                  startingLife === 0 && styles.selectedButton,
                ]}
                onPress={() => setStartingLifeTotal(0)}
              >
                <Text style={styles.largeButtonText}>0</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.largeButton,
                  startingLife === 20 && styles.selectedButton,
                ]}
                onPress={() => setStartingLifeTotal(20)}
              >
                <Text style={styles.largeButtonText}>20</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.largeButton,
                  startingLife === 40 && styles.selectedButton,
                ]}
                onPress={() => setStartingLifeTotal(40)}
              >
                <Text style={styles.largeButtonText}>40</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 3: PLAYER COLORS */}
          <View style={styles.menuRow}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.largeButton, { backgroundColor: player1Color }]}
                onPress={() => openColorPicker(1)}
              >
                <Text style={styles.largeButtonText}>P1</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.largeButton, { backgroundColor: player2Color }]}
                onPress={() => openColorPicker(2)}
              >
                <Text style={styles.largeButtonText}>P2</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Row 4: CLOSE */}
          <View style={styles.menuRow}>
            <TouchableOpacity
              style={styles.largeButton}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.largeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ColorPicker
        visible={colorPickerVisible}
        player={colorPickerPlayer}
        onSelectColor={selectPlayerColor}
        onClose={() => setColorPickerVisible(false)}
      />

      <PlayerSection
        playerNumber={1}
        life={player1Life}
        lifeChange={lifeChanges.player1}
        backgroundColor={player1Color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? 0 : 0,
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
    flex: 0.7,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  increaseZone: {
    flex: 0.7,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  lifeZone: {
    flex: 1.6,
    justifyContent: "center",
    alignItems: "center",
  },
  lifeTotalContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  lifeTotal: {
    color: "#fff",
    fontSize: 84,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textAlign: "center",
    letterSpacing: -1,
  },
  orientationDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    marginTop: -8,
  },
  lifeChange: {
    position: "absolute",
    top: -32,
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textAlign: "center",
    alignSelf: "center",
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "500",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    opacity: 0.6,
  },
  centerSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    backgroundColor: "#000",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  menuButton: {
    backgroundColor: "transparent",
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    //borderRadius: 22,
    //borderWidth: 2,
    //borderColor: "rgba(255, 255, 255, 0.2)",
  },
  menuButtonText: {
    fontSize: 28,
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000",
    flexDirection: "column",
  },
  menuRow: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
  },
  menuRowWithLabel: {
    flex: 1,
    padding: 8,
    flexDirection: "column",
  },
  menuLabel: {
    color: "#fff",
    fontSize: labelFontSize,
    fontWeight: "500",
    opacity: 0.7,
    textAlign: "center",
    paddingVertical: 8,
  },
  buttonRow: {
    flexDirection: "row",
    flex: 1,
    gap: 8,
  },
  largeButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: buttonPadding,
  },
  selectedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  largeButtonText: {
    color: "#fff",
    fontSize: buttonFontSize,
    fontWeight: "600",
    textAlign: "center",
  },
  // Color picker modal styles
  colorPickerContent: {
    backgroundColor: "#000",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    padding: 24,
    alignItems: "center",
    minWidth: 240,
  },
  colorPickerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
    opacity: 0.9,
  },
  colorPickerCloseButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginTop: 8,
  },
  colorPickerCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
    opacity: 0.8,
    textAlign: "center",
  },
  colorSwatchContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginVertical: 16,
    maxWidth: 240,
  },
  colorSwatch: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  selectedColorSwatch: {
    borderColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 3,
  },
});
