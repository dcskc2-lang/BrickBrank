import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from '../../../firebaseconfig';

export default function EditProfileModal({ visible, onClose, userProfile, setUserProfileState }) {
  const [newName, setNewName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (visible && userProfile) setNewName(userProfile.name);
  }, [visible, userProfile]);

  const handleSave = async () => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === userProfile.name) {
      onClose();
      return;
    }
    if (trimmed.length > 20) {
      Alert.alert("Lỗi", "Tên hiển thị tối đa 20 ký tự!");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Firebase Ident Update
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      }

      // 2. Local State Transfer (Moving keys to match new Profile Name)
      const oldKey = `appState_${userProfile.name}`;
      const newKey = `appState_${trimmed}`;
      const oldData = await AsyncStorage.getItem(oldKey);
      if (oldData) {
        await AsyncStorage.setItem(newKey, oldData);
        await AsyncStorage.removeItem(oldKey);
      }

      // 3. Leaderboard Score Index updates backwards
      const localData = await AsyncStorage.getItem('localScores');
      if (localData) {
        let scores = JSON.parse(localData);
        let changed = false;
        scores = scores.map(s => {
          if (s.name === userProfile.name) {
            changed = true;
            return { ...s, name: trimmed };
          }
          return s;
        });
        if (changed) {
          await AsyncStorage.setItem('localScores', JSON.stringify(scores));
        }
      }

      // 4. Update the World Leaderboard Firebase Doc if relevant
      if (auth.currentUser) {
        try {
          const docRef = doc(db, 'worldLeaderboard', auth.currentUser.uid);
          await updateDoc(docRef, { name: trimmed });
        } catch(e) { console.log(e); }
      }

      // 5. Instantly Sync Global Display variables
      setUserProfileState({ ...userProfile, name: trimmed });
      onClose();
      Alert.alert("Thành công", "Tên hiển thị đã được đổi thành " + trimmed + " và đồng bộ toàn hệ thống!");
    } catch (e) {
      Alert.alert("Lỗi", "Đổi tên thất bại: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView intensity={90} tint="dark" style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>ĐỔI TÊN ĐĂNG NHẬP</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            maxLength={20}
            placeholder="Nhập tên mới..."
            placeholderTextColor="#9ca3af"
          />
          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={isLoading}>
              <Text style={styles.btnText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isLoading}>
              <Text style={styles.btnText}>{isLoading ? "Đang xử lý..." : "Lưu"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  container: { width: 300, backgroundColor: '#1e293b', borderRadius: 15, padding: 25, borderWidth: 2, borderColor: '#3b82f6', alignItems: 'center', shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },
  title: { color: '#60a5fa', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#0f172a', color: '#fff', width: '100%', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 25, textAlign: 'center', borderWidth: 1, borderColor: '#334155' },
  row: { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  cancelBtn: { flex: 1, backgroundColor: '#64748b', padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 10 },
  saveBtn: { flex: 1, backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
