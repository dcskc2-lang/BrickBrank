import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { showInterstitial } from '../InterstitialAds';
export default function GameOverModal({
  visible, playerName, setPlayerName, onSave, onSkip, isLoggedIn
}) {

  useEffect(() => {
    if (visible) {
      showInterstitial().then(success => {
        if (success) {
          console.log("Quảng cáo đã hiển thị thành công");
        } else {
          console.log("Không có quảng cáo để hiển thị");
        }
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <BlurView intensity={80} tint="dark" style={styles.gameOverOverlay}>
      <Animated.Text entering={FadeInDown.springify().damping(12)} style={styles.gameOverText}>
        Game Over!
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(200).springify().damping(12)} style={{ width: '100%', alignItems: 'center' }}>
        {!isLoggedIn ? (
          <TextInput
            style={styles.nameInput}
            placeholder="Nhập tên của bạn..."
            placeholderTextColor="#ccc"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={15}
          />
        ) : (
          <Text style={styles.loggedInNameText}>Lưu điểm với tên: {playerName}</Text>
        )}

        <View style={styles.goButtonsRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
            <Text style={styles.saveBtnText}>Lưu Điểm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
            <Text style={styles.skipBtnText}>Bỏ Qua</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Xóa dòng <showInterstitial /> ở đây */}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  gameOverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 100, borderRadius: 8 },
  gameOverText: { fontSize: 40, fontWeight: 'bold', color: '#E91E63', marginBottom: 20 },
  loggedInNameText: { color: '#00BCD4', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  nameInput: { backgroundColor: '#34495e', color: '#fff', width: '80%', padding: 12, borderRadius: 8, fontSize: 18, marginBottom: 20, textAlign: 'center' },
  goButtonsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '80%' },
  saveBtn: { backgroundColor: '#00BCD4', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, elevation: 3 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  skipBtn: { backgroundColor: '#7f8c8d', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, elevation: 3 },
  skipBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
