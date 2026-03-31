import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AudioContext } from '../app/(tabs)/index';
import AboutUsModal from '../components/BlockBlast/Modals/AboutUsModal';
import EditProfileModal from '../components/BlockBlast/Modals/EditProfileModal';
import LoginModal from '../components/BlockBlast/Modals/LoginModal';
import ScoreModal from '../components/BlockBlast/Modals/ScoreModal';
import SelectModeModal from '../components/BlockBlast/Modals/SelectModeModal';
import SettingsModal from '../components/BlockBlast/Modals/SettingsModal';
import QuestModal from '../components/BlockBlast/Modals/QuestModal';
import { auth, db } from '../firebaseconfig';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Menu({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isSelectModalVisible, setSelectModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isScoreModalVisible, setScoreModalVisible] = useState(false);
  const [isAboutModalVisible, setAboutModalVisible] = useState(false);
  const [isEditProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [isQuestModalVisible, setQuestModalVisible] = useState(false);

  const { adsRemoved, removeAds, restoreAds, soundEnabled, toggleSound, setIsLoggedInState, setUserProfileState } = useContext(AudioContext);
  const authContext = useContext(AudioContext);
  const [localScores, setLocalScores] = useState([]);
  const [worldScores, setWorldScores] = useState([]);
  const isLoggedIn = authContext.isLoggedIn || false;
  const userProfile = authContext.userProfile || { name: 'PixelMaster', level: 1, highScore: 0 };
  const currencies = authContext.currencies || { gold: 0 };
  const quests = authContext.quests || { gamesPlayed: 0, pointsReached: 0, goldBlocksBroken: 0 };

  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const handleLogin = () => {
    setLoginModalVisible(true);
  };

  const handleLoginSuccess = (profileName) => {
    // Left empty since onAuthStateChanged handles real state now
    setLoginModalVisible(false);
  };

  const handleLogout = async () => {
    if (auth.currentUser) {
      await signOut(auth);
    } else {
      setIsLoggedInState(false);
      setUserProfileState(null);
    }
    setIsProfileExpanded(false);
  };

  const toggleProfile = () => setIsProfileExpanded(!isProfileExpanded);

  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true
    );
  }, [pulseScale]);

  const openScoreBoard = async () => {
    try {
      const localData = await AsyncStorage.getItem('localScores');
      if (localData) {
        setLocalScores(JSON.parse(localData));
      } else {
        setLocalScores([]);
      }

      const q = query(
        collection(db, 'worldLeaderboard'),
        orderBy('score', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const wScores = [];
      querySnapshot.forEach((doc) => {
        wScores.push(doc.data());
      });
      setWorldScores(wScores);
    } catch (e) { console.log(e); }
    setScoreModalVisible(true);
  };

  const handleBuyAds = () => {
    if (adsRemoved) {
      Alert.alert(
        "Chế độ Thử nghiệm",
        "Bạn đã tắt Quảng Cáo vĩnh viễn.",
        [
          { text: "Đóng", style: "cancel" },
          { text: "Bật Lại Quảng Cáo", onPress: () => restoreAds() }
        ]
      );
    } else {
      Alert.alert(
        "Cửa hàng",
        "Gói Tắt Quảng Cáo trọn đời.\n\n 0 VNĐ ",
        [
          { text: "Bỏ qua", style: "cancel" },
          { text: "Mua (0đ)", onPress: () => removeAds() }
        ]
      );
    }
  };

  const playMode = (size) => {
    setSelectModalVisible(false);
    navigation.navigate('GamePlay', { size });
  };

  const renderScoreItem = ({ item, index }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).springify()} style={styles.scoreRow}>
      <Text style={styles.scoreRank}>#{index + 1}</Text>
      <View style={styles.scoreInfo}>
        <Text style={styles.scoreName}>{item.name}</Text>
        <Text style={styles.scoreMode}>Mode: {item.mode}</Text>
      </View>
      <Text style={styles.scoreVal}>{item.score}</Text>
    </Animated.View>
  );

  const modeSections = [
    {
      title: 'CỔ ĐIỂN',
      data: [{ text: 'Màn mặc định (8x8)', size: 8 }]
    },
    {
      title: 'MỞ RỘNG',
      data: [
        { text: 'Màn 9x9', size: 9 },
        { text: 'Màn 10x10', size: 10 }
      ]
    },
    {
      title: 'THỬ THÁCH NHỎ',
      data: [
        { text: 'Màn khó (7x7)', size: 7 },
        { text: 'Màn siêu khó (6x6)', size: 6 }
      ]
    }
  ];

  return (
    <ImageBackground
      source={require('../assets/BG.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay}>

        {/* TOP BAR */}
        <View style={[styles.topBar, { marginTop: insets.top ? insets.top + 10 : 40 }]}>
          {/* Default Profile Toggle (Left) */}
          {isLoggedIn ? (
            <TouchableOpacity style={styles.profileContainer} onPress={toggleProfile} activeOpacity={0.8}>
              <View style={styles.avatarPlaceholder}>
                <Image source={{ uri: 'https://api.dicebear.com/7.x/pixel-art/png?seed=PixelMaster' }} style={styles.avatarImage} />
              </View>
              <Text style={styles.profileText}>
                <Text style={styles.profileName}>{userProfile.name}</Text> | Cấp {userProfile.level} | High Score: {userProfile.highScore.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Đăng Nhập</Text>
            </TouchableOpacity>
          )}

          {/* Action Buttons Right */}
          <View style={styles.topRightActions}>
            {/* Gold */}
            <View style={styles.currencyBtnGold}>
              <Text style={styles.iconFallbackText}>🪙</Text>
              <Text style={styles.currencyTextGold} adjustsFontSizeToFit numberOfLines={1}>{currencies.gold}</Text>
            </View>

            <TouchableOpacity style={styles.cartBtn} onPress={handleBuyAds}>
              <Text style={styles.iconFallbackText}>🛒</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rankBtn} onPress={openScoreBoard}>
              <Text style={styles.iconFallbackText}>🏆</Text>
              <Text style={styles.rankText} adjustsFontSizeToFit numberOfLines={1}>RANK</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.questBtn} onPress={() => setQuestModalVisible(true)}>
              <Text style={styles.iconFallbackText}>🎁</Text>
              <Text style={styles.questText} adjustsFontSizeToFit numberOfLines={1}>NHIỆM VỤ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* EXPANDED PROFILE PANEL */}
        {isLoggedIn && isProfileExpanded && (
          <View style={styles.expandedProfilePanel}>
            <View style={styles.epTopRow}>
              <View style={styles.epAvatarContainer}>
                <Image source={{ uri: 'https://api.dicebear.com/7.x/pixel-art/png?seed=PixelMaster' }} style={styles.epAvatarImage} />
              </View>
              <View style={styles.epInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={[styles.epName, { marginBottom: 0 }]}>{userProfile.name}</Text>
                  <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setEditProfileModalVisible(true)}>
                    <Text style={{ fontSize: 16 }}>✏️</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.epProgressContainer}>
                  <LinearGradient
                    colors={['#34d399', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.epProgressBar, { width: `${Math.min(100, ((userProfile.exp || 0) / ((userProfile.level || 1) * 200)) * 100)}%` }]}
                  />
                </View>
                <Text style={styles.epProgressText}>TIẾN TRÌNH CẤP {(userProfile.level || 1) + 1} ({userProfile.exp || 0}/{(userProfile.level || 1) * 200} XP)</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={{ marginTop: 15, backgroundColor: '#ef4444', padding: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#fca5a5' }}
              onPress={handleLogout}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>ĐĂNG XUẤT</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          <View style={styles.centerContainer}>
            <Text style={styles.title}>BRICK BRACK</Text>

            {/* CHƠI NGAY */}
            <View style={styles.playBtnContainer}>
              <TouchableOpacity
                onPress={() => {
                  const sizes = [6, 7, 8, 9, 10];
                  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
                  playMode(randomSize);
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#4facfe', '#a18cd1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.playNowBtn}
                >
                  <Text style={styles.playNowText}>CHƠI NGAY</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* CHỌN MÀN CHƠI */}
            <AnimatedTouchableOpacity
              style={[styles.secondaryBtn, { transform: [{ scale: pulseScale }] }]}
              onPress={() => setSelectModalVisible(true)}
            >
              <Text style={styles.secondaryBtnText}>CHỌN MÀN CHƠI</Text>
            </AnimatedTouchableOpacity>

            {/* CÀI ĐẶT */}
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setSettingsModalVisible(true)}>
              <Text style={styles.secondaryBtnText}>CÀI ĐẶT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Nút About Us góc dưới phải */}
        <TouchableOpacity style={styles.bottomRightBtn} onPress={() => setAboutModalVisible(true)}>
          <Text style={styles.iconFallbackText}>ℹ️</Text>
        </TouchableOpacity>

        <LoginModal
          visible={isLoginModalVisible}
          onClose={() => setLoginModalVisible(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <SelectModeModal
          visible={isSelectModalVisible}
          onClose={() => setSelectModalVisible(false)}
          modeSections={modeSections}
          onPlayMode={playMode}
        />

        <SettingsModal
          visible={isSettingsModalVisible}
          onClose={() => setSettingsModalVisible(false)}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
        />

        <ScoreModal
          visible={isScoreModalVisible}
          onClose={() => setScoreModalVisible(false)}
          localScores={localScores}
          worldScores={worldScores}
          renderScoreItem={renderScoreItem}
        />

        <AboutUsModal
          visible={isAboutModalVisible}
          onClose={() => setAboutModalVisible(false)}
        />

        <QuestModal 
          visible={isQuestModalVisible}
          onClose={() => setQuestModalVisible(false)}
        />

        <EditProfileModal
          visible={isEditProfileModalVisible}
          onClose={() => setEditProfileModalVisible(false)}
          userProfile={userProfile}
          setUserProfileState={setUserProfileState}
        />

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },
  topBar: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 15,
    zIndex: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingRight: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4b5563',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    backgroundColor: '#3b82f6',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  profileName: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loginBtn: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  loginBtnText: {
    color: '#60a5fa',
    fontWeight: 'bold',
    fontSize: 14,
  },
  topRightActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderWidth: 2,
    borderColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  rankBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderWidth: 2,
    borderColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginRight: 6,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  rankText: {
    color: '#fcd34d',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  questBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderWidth: 2,
    borderColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  questText: {
    color: '#93c5fd',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 12,
  },
  bottomRightBtn: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  iconFallbackText: {
    fontSize: 20
  },
  title: {
    fontSize: 52,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 50,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#4ea8de',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  playBtnContainer: {
    shadowColor: '#b5179e',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 30,
    width: '60%',
    maxWidth: 350,
    borderRadius: 15,
  },
  playNowBtn: {
    paddingVertical: 18,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  playNowText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryBtn: {
    width: '60%',
    maxWidth: 350,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#93c5fd',
    shadowColor: '#60a5fa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  secondaryBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  scoreRank: {
    color: '#f59e0b',
    fontSize: 20,
    fontWeight: 'bold',
    width: 40
  },
  scoreInfo: {
    flex: 1,
  },
  scoreName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  scoreMode: {
    color: '#94a3b8',
    fontSize: 14
  },
  scoreVal: {
    color: '#10b981',
    fontSize: 24,
    fontWeight: '900'
  },
  currencyBtnGold: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderWidth: 2,
    borderColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginRight: 6,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  currencyBtnDiamond: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30,30,30,0.8)',
    borderWidth: 2,
    borderColor: '#38bdf8',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginRight: 15,
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  currencyTextGold: {
    color: '#fcd34d',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  currencyTextDiamond: {
    color: '#7dd3fc',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expandedProfilePanel: {
    position: 'absolute',
    top: 110,
    left: 20,
    backgroundColor: 'rgba(30,30,30,0.85)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#a855f7',
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 20,
    width: 320,
  },
  epTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  epAvatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#334155'
  },
  epAvatarImage: {
    width: '100%',
    height: '100%',
  },
  epInfo: {
    flex: 1,
  },
  epName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  epProgressContainer: {
    height: 12,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  epProgressBar: {
    height: '100%',
    borderRadius: 5,
  },
  epProgressText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: 'bold',
  },
  leftPanel: {
    position: 'absolute',
    top: 250,
    left: 20,
    backgroundColor: 'rgba(15,23,42,0.8)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    zIndex: 5,
    width: 320,
  },
  panelTitleHot: {
    color: '#fbbf24',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  shopItemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shopItem: {
    width: 135,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    borderColor: '#3b82f6',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  shopItemName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  shopItemPrice: {
    color: '#94a3b8',
    fontSize: 12,
  },
  questsPanel: {
    marginTop: 30,
    backgroundColor: 'rgba(15,23,42,0.8)',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  panelTitleDaily: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxEmpty: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#64748b',
    borderRadius: 4,
    marginRight: 15,
  },
  checkboxChecked: {
    width: 20,
    height: 20,
    backgroundColor: '#10b981',
    borderRadius: 4,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  questText: {
    color: '#cbd5e1',
    fontSize: 16,
  },
  rewardText: {
    color: '#fbbf24',
    fontSize: 13,
    marginTop: 2,
    fontWeight: 'bold'
  }
});