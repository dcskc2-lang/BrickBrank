import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';
import { BlurView } from 'expo-blur';

export default function SettingsModal({ visible, onClose, soundEnabled, toggleSound }) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>CÀI ĐẶT</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingText}>Âm thanh</Text>
            <TouchableOpacity style={soundEnabled ? styles.toggleOn : styles.toggleOff} onPress={toggleSound}>
              <Text style={styles.toggleText}>{soundEnabled ? 'BẬT' : 'TẮT'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#1e293b', borderRadius: 20, padding: 20, alignItems: 'center' },
  modalTitle: { color: '#0ea5e9', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  closeBtn: { marginTop: 20, padding: 10 },
  closeBtnText: { color: '#94a3b8', fontSize: 16, textDecorationLine: 'underline' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#334155', borderRadius: 10 },
  settingText: { color: '#fff', fontSize: 18 },
  toggleOn: { backgroundColor: '#10b981', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  toggleOff: { backgroundColor: '#ef4444', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  toggleText: { color: '#fff', fontWeight: 'bold' }
});
