import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInRight, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { AudioContext } from '../app/(tabs)/index';
import { db } from '../firebaseconfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import BannerAds from '../components/BlockBlast/BannerAds';
import AboutUsModal from '../components/BlockBlast/Modals/AboutUsModal';
import ScoreModal from '../components/BlockBlast/Modals/ScoreModal';
import SelectModeModal from '../components/BlockBlast/Modals/SelectModeModal';
import SettingsModal from '../components/BlockBlast/Modals/SettingsModal';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Menu({ navigation }) {
  const [isSelectModalVisible, setSelectModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isScoreModalVisible, setScoreModalVisible] = useState(false);
  const [isAboutModalVisible, setAboutModalVisible] = useState(false);

  const { soundEnabled, toggleSound, adsRemoved, removeAds, restoreAds } = useContext(AudioContext);
  const [highScores, setHighScores] = useState([]);

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
      const q = query(
        collection(db, 'highScores'),
        orderBy('score', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const scores = [];
      querySnapshot.forEach((doc) => {
        scores.push(doc.data());
      });
      setHighScores(scores);
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
      source={{ uri: 'https://media.discordapp.net/attachments/1478592050587893942/1484265800356466769/AOI_d_955wRCJmah7aZjIO_uTuhYswIWK6npfQqOFTRx3JNVLKp4bZzwQiFt9aOVmcNrQrdmvt6ipzphEbakUSoIAEhfsCj_dy_Pa6fsjTVvVhOmN2lYn8ZOLRR4ENNNDTRDho8Z0b8JtxqG8vUlTVD2lNtCB6uqRX_3Jh6SSHfX8KZlbof0jws1600-rj.png?ex=69bd99bf&is=69bc483f&hm=f551c84acbb4f7a8d3a22e5e73ed737b765a453abe8d9439060979a34117b6a8&=&format=webp&quality=lossless&width=1466&height=800' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay}>
        {/* Nút Giỏ Hàng góc trái trên cùng */}
        <TouchableOpacity style={styles.topLeftBtn} onPress={handleBuyAds}>
          <Text style={styles.iconFallbackText}>🛒</Text>
        </TouchableOpacity>

        {/* Nút Bảng Xếp Hạng góc phải trên cùng */}
        <TouchableOpacity style={styles.topRightBtn} onPress={openScoreBoard}>
          {/* Để trống source ảnh theo yêu cầu */}
          <Image
            source={{ uri: '' }}
            style={styles.leaderboardIcon}
          />
          <Text style={styles.iconFallbackText}>🏆</Text>
        </TouchableOpacity>

        {/* Nút About Us góc dưới phải */}
        <TouchableOpacity style={styles.bottomRightBtn} onPress={() => setAboutModalVisible(true)}>
          <Text style={styles.iconFallbackText}>ℹ️</Text>
        </TouchableOpacity>

        <Text style={styles.title}>BRICK BRACK</Text>

        <View style={styles.centerContainer}>

          {/* Thanh Select */}
          <AnimatedTouchableOpacity
            style={[styles.mainBtn, { transform: [{ scale: pulseScale }] }]}
            onPress={() => setSelectModalVisible(true)}
          >
            <Text style={styles.mainBtnText}>Chọn Màn Chơi</Text>
          </AnimatedTouchableOpacity>

          {/* Thanh Cài đặt */}
          <TouchableOpacity style={styles.mainBtn} onPress={() => setSettingsModalVisible(true)}>
            <Text style={styles.mainBtnText}>Cài Đặt</Text>
          </TouchableOpacity>

        </View>

        <BannerAds />

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
          highScores={highScores}
          renderScoreItem={renderScoreItem}
        />

        <AboutUsModal
          visible={isAboutModalVisible}
          onClose={() => setAboutModalVisible(false)}
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
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  title: {
    fontSize: 48,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 100,
    fontWeight: '900',
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  topLeftBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  topRightBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  bottomRightBtn: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  leaderboardIcon: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  iconFallbackText: {
    fontSize: 24
  },
  mainBtn: {
    width: '70%',
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  mainBtnText: {
    color: '#ffffff',
    fontSize: 20,
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
  }
});