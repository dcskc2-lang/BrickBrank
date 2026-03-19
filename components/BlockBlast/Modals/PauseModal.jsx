import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function PauseModal({ 
  visible, onClose, onExit, soundEnabled, toggleSound 
}) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <BlurView intensity={80} tint="dark" style={styles.gameOverOverlay}>
        <Animated.View entering={FadeInUp.springify().damping(12)} style={styles.pauseContent}>
          <Text style={styles.pauseTitle}>TẠM DỪNG</Text>

          <TouchableOpacity style={styles.pauseBtn} onPress={onClose}>
            <Text style={styles.pauseBtnText}>Tiếp tục</Text>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Âm thanh</Text>
            <TouchableOpacity style={soundEnabled ? styles.toggleOn : styles.toggleOff} onPress={toggleSound}>
              <Text style={styles.toggleText}>{soundEnabled ? 'BẬT' : 'TẮT'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.pauseBtn, {backgroundColor: '#ef4444'}]} onPress={onExit}>
            <Text style={styles.pauseBtnText}>Về Màn Hình Chính</Text>
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  gameOverOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  pauseContent: { width: '80%', backgroundColor: '#1e293b', borderRadius: 20, padding: 20, alignItems: 'center' },
  pauseTitle: { color: '#0ea5e9', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  pauseBtn: { width: '100%', backgroundColor: '#3b82f6', padding: 15, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  pauseBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#334155', borderRadius: 10, marginBottom: 15 },
  settingText: { color: '#fff', fontSize: 18 },
  toggleOn: { backgroundColor: '#10b981', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  toggleOff: { backgroundColor: '#ef4444', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  toggleText: { color: '#fff', fontWeight: 'bold' }
});
