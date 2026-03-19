import { BlurView } from 'expo-blur';
import { Modal, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SelectModeModal({ visible, onClose, modeSections, onPlayMode }) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
        <View style={[styles.modalContent, { height: '60%' }]}>
          <Text style={styles.modalTitle}>CHỌN MÀN CHƠI</Text>

          <SectionList
            sections={modeSections}
            keyExtractor={(item, index) => item.text + index}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.modeBtn, item.size <= 7 ? styles.hardModeBtn : {}]} onPress={() => onPlayMode(item.size)}>
                <Text style={styles.modeBtnText}>{item.text}</Text>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            style={{ width: '100%', flex: 1 }}
          />

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
  modeBtn: { width: '100%', backgroundColor: '#334155', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  hardModeBtn: { backgroundColor: '#ef4444' },
  modeBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  closeBtn: { marginTop: 20, padding: 10 },
  closeBtnText: { color: '#94a3b8', fontSize: 16, textDecorationLine: 'underline' },
  sectionHeader: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5, paddingLeft: 5, borderLeftWidth: 3, borderLeftColor: '#3b82f6' }
});
