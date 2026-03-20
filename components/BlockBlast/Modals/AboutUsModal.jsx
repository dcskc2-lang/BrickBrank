import { BlurView } from 'expo-blur';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutUsModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>VỀ CHÚNG TÔI 🚀</Text>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.paragraph}>
              <Text style={styles.highlight}>BRICK BRACK</Text> không chỉ là một tựa game xếp hình khô khan. Nó là kết tinh chân thật của hàng trăm giờ code gõ phím rát tay thâu đêm, những ly cà phê đậm đặc cạn trơ lòng cốc và vô số cuộc cãi vã sinh tử nảy lửa của đội ngũ phát triển để tìm ra phương án tối ưu nhất.
            </Text>

            <Text style={styles.paragraph}>
              Chúng tôi đã đập đi xây lại mảng hệ thống ma trận 2D không biết bao nhiêu lần chỉ để đổi lấy một lời hứa: Đảm bảo cảm giác lúc bạn ghép được 1 khối gạch trên màn hình nó phải &quot;Đã&quot; và &quot;Mượt&quot; nhất có thể. Từ việc thiết kế đồ họa Kính mờ (Glassmorphism) bóng bẩy đương đại, cho đến việc tinh chỉnh bằng tay Hiệu ứng (VFX)  màn hình — tất cả đều được nhào nặn bằng chính sự công tâm, tình yêu và nhiệt huyết với Game.
            </Text>

            <Text style={styles.paragraph}>
              Cảm ơn các bạn đã chơi và trải nghiệm. Mỗi Kỷ lục Xếp Hạng của cá nhân các bạn trong game chính là phần thưởng và là động lực sống cực lớn để chúng tôi tiếp tục duy trì hoài bão, tạo ra những siêu phẩm vĩ đại hơn thế nữa!
            </Text>

            <Text style={styles.signature}>- Đội ngũ Thiết kế Brick Brack -</Text>
          </ScrollView>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Đóng Lại</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', maxHeight: '75%', backgroundColor: '#1e293b', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { color: '#0ea5e9', fontSize: 24, fontWeight: '900', marginBottom: 20, letterSpacing: 1 },
  scrollView: { width: '100%', marginBottom: 10 },
  paragraph: { color: '#e2e8f0', fontSize: 16, lineHeight: 26, marginBottom: 15, textAlign: 'justify' },
  highlight: { color: '#f59e0b', fontWeight: 'bold' },
  signature: { color: '#94a3b8', fontSize: 16, fontStyle: 'italic', textAlign: 'right', marginTop: 10, fontWeight: 'bold' },
  closeBtn: { marginTop: 10, backgroundColor: '#ef4444', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, elevation: 5 },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
