import React, { useContext } from 'react';
import { BlurView } from 'expo-blur';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { AudioContext } from '../../../app/(tabs)/index';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuestModal({ visible, onClose }) {
  const { quests, addGold, addExp, updateQuestProgress } = useContext(AudioContext);

  const questList = [
    {
      id: 'gamesPlayed',
      title: 'Chơi 2 Màn',
      current: quests?.gamesPlayed || 0,
      target: 2,
      gold: 50,
      xp: 50,
      claimed: quests?.gamesPlayedClaimed || false,
      iconUrl: 'https://cdn3d.iconscout.com/3d/premium/thumb/gamepad-4996225-4159518.png',
      fallbackEmoji: '🎮'
    },
    {
      id: 'pointsReached',
      title: 'Đạt 200 Điểm',
      current: quests?.pointsReached || 0,
      target: 200,
      gold: 100,
      xp: 100,
      claimed: quests?.pointsReachedClaimed || false,
      iconUrl: 'https://cdn3d.iconscout.com/3d/premium/thumb/winner-podium-4996231-4159524.png',
      fallbackEmoji: '🏆'
    },
    {
      id: 'goldBlocksBroken',
      title: 'Phá 10 Khối Vàng',
      current: quests?.goldBlocksBroken || 0,
      target: 10,
      gold: 150,
      xp: 150,
      claimed: quests?.goldBlocksBrokenClaimed || false,
      iconUrl: 'https://cdn3d.iconscout.com/3d/premium/thumb/gold-bar-5178659-4322971.png',
      fallbackEmoji: '🟨'
    }
  ];

  const handleClaim = (quest) => {
    if (quest.current >= quest.target && !quest.claimed) {
      if (addGold) addGold(quest.gold);
      if (addExp) addExp(quest.xp);
      if (updateQuestProgress) {
        updateQuestProgress({ [`${quest.id}Claimed`]: true });
      }
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Nút Đóng */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✖</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>NHIỆM VỤ HÀNG NGÀY</Text>

          {questList.map((quest) => {
            const isCompleted = quest.current >= quest.target;
            const progressRatio = Math.min(quest.current / quest.target, 1);
            
            return (
              <View key={quest.id} style={styles.questCard}>
                {/* Icon bên trái */}
                <View style={styles.iconContainer}>
                  <Text style={styles.emojiText}>{quest.fallbackEmoji}</Text>
                </View>

                {/* Phần giữa: Thông tin tiến trình */}
                <View style={styles.infoContainer}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  
                  {/* Thanh Tiến Trình */}
                  <View style={styles.progressBarBg}>
                    <LinearGradient
                      colors={isCompleted && !quest.claimed ? ['#10b981', '#34d399'] : ['#3b82f6', '#60a5fa']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={[styles.progressBarFill, { width: `${progressRatio * 100}%` }]}
                    />
                    <Text style={styles.progressText}>
                      {Math.min(quest.current, quest.target)}/{quest.target}
                    </Text>
                  </View>

                  {/* Phần thưởng */}
                  <Text style={styles.rewardText}>
                    🪙 {quest.gold} Vàng - ⭐ {quest.xp} XP
                  </Text>
                </View>

                {/* Nút Nhận bên phải */}
                <View style={styles.actionContainer}>
                  {quest.claimed ? (
                    <View style={[styles.claimBtn, styles.btnClaimed]}>
                      <Text style={styles.btnClaimedText}>ĐÃ NHẬN</Text>
                    </View>
                  ) : isCompleted ? (
                    <TouchableOpacity onPress={() => handleClaim(quest)} activeOpacity={0.7}>
                      <LinearGradient
                        colors={['#10b981', '#059669']}
                        style={[styles.claimBtn, styles.btnReady]}
                      >
                        <Text style={styles.btnReadyText}>NHẬN</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.claimBtn, styles.btnDisabled]}>
                      <Text style={styles.btnDisabledText}>NHẬN</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 5,
    right: 15,
    zIndex: 10,
    padding: 10,
  },
  closeBtnText: {
    color: '#94a3b8',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle: {
    color: '#e0f2fe',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    textShadowColor: '#38bdf8',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  questCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#475569',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  emojiText: {
    fontSize: 40,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 18,
    backgroundColor: '#0f172a',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 9,
  },
  progressText: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  rewardText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  claimBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  btnDisabled: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
  },
  btnDisabledText: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnReady: {
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  btnReadyText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 14,
  },
  btnClaimed: {
    backgroundColor: '#334155',
    borderWidth: 1,
    borderColor: '#475569',
  },
  btnClaimedText: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 12,
  }
});
