import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Audio } from "expo-av";
import { createContext, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GamePlay from "../../screens/GamePlay";
import Menu from "../../screens/Menu";

export const AudioContext = createContext({
  soundEnabled: true,
  toggleSound: async () => {},
  adsRemoved: false,
  removeAds: async () => {},
  restoreAds: async () => {}
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem("soundEnabled").then((val) => {
      setSoundEnabled(val !== "false");
    });
    AsyncStorage.getItem("adsRemoved").then((val) => {
      setAdsRemoved(val === "true");
    });
  }, []);

  useEffect(() => {
    async function manageAudio() {
      if (soundEnabled) {
        if (!soundRef.current) {
          try {
            const { sound } = await Audio.Sound.createAsync(
              require("../../assets/bgm.mp3"),
            );
            soundRef.current = sound;
            await sound.setIsLoopingAsync(true);
            await sound.playAsync();
          } catch (e) {
            console.log("Global Audio init error", e);
          }
        } else {
          await soundRef.current.playAsync();
        }
      } else {
        if (soundRef.current) {
          await soundRef.current.pauseAsync();
        }
      }
    }
    manageAudio();
  }, [soundEnabled]);

  const toggleSound = async () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    await AsyncStorage.setItem("soundEnabled", newVal.toString());
  };

  const removeAds = async () => {
    setAdsRemoved(true);
    await AsyncStorage.setItem("adsRemoved", "true");
  };

  const restoreAds = async () => {
    setAdsRemoved(false);
    await AsyncStorage.setItem("adsRemoved", "false");
  };

  return (
    <AudioContext.Provider value={{ soundEnabled, toggleSound, adsRemoved, removeAds, restoreAds }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack.Navigator initialRouteName="Menu">
          <Stack.Screen
            name="Menu"
            component={Menu}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="GamePlay"
            component={GamePlay}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </GestureHandlerRootView>
    </AudioContext.Provider>
  );
}
