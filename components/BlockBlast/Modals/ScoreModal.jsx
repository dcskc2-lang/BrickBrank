import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, FlatList } from 'react-native';
import { BlurView } from 'expo-blur';

export default function ScoreModal({ visible, onClose, localScores = [], worldScores = [], renderScoreItem }) {
  const [activeTab, setActiveTab] = useState('local');

  const currentData = (activeTab === 'local' ? localScores : worldScores) || [];

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContentScore}>
          <Text style={styles.modalTitle}>BẢNG ĐIỂM</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'local' && styles.activeTabBtn]} 
              onPress={() => setActiveTab('local')}
            >
              <Text style={[styles.tabText, activeTab === 'local' && styles.activeTabText]}>LOCAL</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tabBtn, activeTab === 'world' && styles.activeTabBtn]} 
              onPress={() => setActiveTab('world')}
            >
              <Text style={[styles.tabText, activeTab === 'world' && styles.activeTabText]}>WORLD</Text>
            </TouchableOpacity>
          </View>

          {currentData.length === 0 ? (
            <Text style={{ color: '#aaa', marginVertical: 20 }}>Chưa có điểm nào được lưu.</Text>
          ) : (
            <FlatList
              data={currentData}
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
  modalTitle: { color: '#0ea5e9', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  tabContainer: { flexDirection: 'row', width: '100%', marginBottom: 15, borderRadius: 10, backgroundColor: '#334155', overflow: 'hidden' },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  activeTabBtn: { backgroundColor: '#0ea5e9' },
  tabText: { color: '#94a3b8', fontWeight: 'bold' },
  activeTabText: { color: '#fff' },
  closeBtn: { marginTop: 20, padding: 10 },
  closeBtnText: { color: '#94a3b8', fontSize: 16, textDecorationLine: 'underline' },
  scoreList: { width: '100%' }
});
