import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';

export default function ScoreModal({ visible, onClose, highScores, clearScores, renderScoreItem }) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContentScore}>
          <Text style={styles.modalTitle}>BẢNG ĐIỂM</Text>
          {/* Nút xoá lịch sử */}
          <TouchableOpacity style={styles.clearBtn} onPress={clearScores}>
            <Text style={styles.clearBtnText}>Xóa Lịch Sử</Text>
          </TouchableOpacity>

          {highScores.length === 0 ? (
            <Text style={{ color: '#aaa', marginVertical: 20 }}>Chưa có điểm nào được lưu.</Text>
          ) : (
            <FlatList
              data={highScores}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderScoreItem}
              style={styles.scoreList}
            />
          )}

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
  modalContentScore: { width: '90%', height: '70%', backgroundColor: '#1e293b', borderRadius: 20, padding: 20, alignItems: 'center' },
  modalTitle: { color: '#0ea5e9', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  closeBtn: { marginTop: 20, padding: 10 },
  closeBtnText: { color: '#94a3b8', fontSize: 16, textDecorationLine: 'underline' },
  scoreList: { width: '100%' },
  clearBtn: { backgroundColor: '#ef4444', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-end', marginBottom: 10 },
  clearBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
