import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Audio } from "expo-av";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { auth } from "../../firebaseconfig";
import GamePlay from "../../screens/GamePlay";
import Menu from "../../screens/Menu";
import InterstitialAds from "../../components/BlockBlast/InterstitialAds";

export const AudioContext = createContext({
  soundEnabled: true,
  toggleSound: async () => { },
  adsRemoved: false,
  removeAds: async () => { },
  restoreAds: async () => { },
  isLoggedIn: false,
  userProfile: null,
  currencies: { gold: 0 },
  quests: { gamesPlayed: 0, pointsReached: 0, goldBlocksBroken: 0, lastUpdated: "" },
  updateQuestProgress: async () => { },
  addGold: async () => { },
  addExp: async () => { },
  setUserProfileState: () => { },
  setIsLoggedInState: () => { }
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [adsRemoved, setAdsRemoved] = useState(false);
  const soundRef = useRef(null);

  // New Global States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [currencies, setCurrencies] = useState({ gold: 0 });
  const [quests, setQuests] = useState({
    gamesPlayed: 0,
    pointsReached: 0,
    goldBlocksBroken: 0,
    lastUpdated: new Date().toDateString()
  });

  useEffect(() => {
    AsyncStorage.getItem("soundEnabled").then((val) => {
      setSoundEnabled(val !== "false");
    });
    AsyncStorage.getItem("adsRemoved").then((val) => {
      setAdsRemoved(val === "true");
    });


    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        loadProfileWithHighScore({ name: user.displayName || "PixelMaster", level: 5 });
      } else {
        setIsLoggedIn(false);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const saveAppState = async (newCur, newQuests, customProfile) => {
    const p = customProfile || userProfile;
    if (p && p.name) {
      await AsyncStorage.setItem(`appState_${p.name}`, JSON.stringify({
        currencies: newCur,
        quests: newQuests,
        level: p.level || 1,
        exp: p.exp || 0
      }));
    }
  };

  const addGold = async (amount) => {
    const newCur = { gold: currencies.gold + amount };
    setCurrencies(newCur);
    await saveAppState(newCur, quests, userProfile);
  };

  const addExp = async (amount) => {
    if (!userProfile) return;
    let newExp = (userProfile.exp || 0) + amount;
    let newLevel = userProfile.level || 1;
    let xpNeeded = newLevel * 200;
    while (newExp >= xpNeeded) {
      newExp -= xpNeeded;
      newLevel++;
      xpNeeded = newLevel * 200;
    }
    const newProfile = { ...userProfile, exp: newExp, level: newLevel };
    setUserProfile(newProfile);
    await saveAppState(currencies, quests, newProfile);
  };

  const updateQuestProgress = async (updates) => {
    const newQuests = { ...quests, ...updates };
    setQuests(newQuests);
    await saveAppState(currencies, newQuests, userProfile);
  };

  const loadProfileWithHighScore = async (baseProfile) => {
    let maxScore = 0;
    let level = 1;
    let exp = 0;
    try {
      const val = await AsyncStorage.getItem("localScores");
      if (val) {
        const scores = JSON.parse(val);
        if (scores.length > 0) {
          const uScores = scores.filter(s => s.name === baseProfile.name);
          if (uScores.length > 0) {
            maxScore = Math.max(...uScores.map(s => s.score));
          }
        }
      }
      const data = await AsyncStorage.getItem(`appState_${baseProfile.name}`);
      if (data) {
        const parsed = JSON.parse(data);
        level = parsed.level || 1;
        exp = parsed.exp || 0;
        if (parsed.currencies) setCurrencies(parsed.currencies);
        if (parsed.quests) {
          if (parsed.quests.lastUpdated !== new Date().toDateString()) {
            setQuests({ gamesPlayed: 0, pointsReached: 0, goldBlocksBroken: 0, lastUpdated: new Date().toDateString() });
          } else {
            setQuests(parsed.quests);
          }
        }
      } else {
        setCurrencies({ gold: 0 });
        setQuests({ gamesPlayed: 0, pointsReached: 0, goldBlocksBroken: 0, lastUpdated: new Date().toDateString() });
      }
    } catch (e) { }
    setUserProfile({ ...baseProfile, highScore: maxScore, level, exp });
  };

  const setUserProfileState = (profile) => {
    if (profile && (profile.highScore === undefined || profile.highScore === 0)) {
      loadProfileWithHighScore(profile);
    } else {
      setUserProfile(profile);
    }
  };
  const setIsLoggedInState = (status) => setIsLoggedIn(status);

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
    <AudioContext.Provider value={{
      soundEnabled, toggleSound, adsRemoved, removeAds, restoreAds,
      isLoggedIn, userProfile, currencies, quests, updateQuestProgress, addGold, addExp, setUserProfileState, setIsLoggedInState
    }}>
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
        <InterstitialAds />
      </GestureHandlerRootView>
    </AudioContext.Provider>
  );
}
