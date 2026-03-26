import React, { useState } from 'react';
import { Modal, StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../../firebaseconfig';
import { useContext } from 'react';
import { AudioContext } from '../../../app/(tabs)/index';

export default function LoginModal({ visible, onClose, onLoginSuccess }) {
  const { setUserProfileState, setIsLoggedInState } = useContext(AudioContext);
  const [activeTab, setActiveTab] = useState('LOGIN'); // 'LOGIN' or 'REGISTER'
  const [socialStep, setSocialStep] = useState(false); // If true, showing display name input for social login
  
  // Form states
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    // Reset states on close
    setActiveTab('LOGIN');
    setSocialStep(false);
    setAccount('');
    setPassword('');
    setDisplayName('');
    onClose();
  };

  const handleNormalLogin = async () => {
    if (!account || !password) return alert('Vui lòng nhập Email và Mật khẩu!');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, account, password);
      handleClose();
    } catch (e) {
      if (e.message.includes('configuration-not-found') || e.code === 'auth/configuration-not-found') {
        alert("Firebase chưa cấu hình. Kích hoạt Đăng Nhập Tạm Thời (Mock Login) để test game!");
        setUserProfileState({ name: "PlayerLocal", level: 1, highScore: 0 });
        setIsLoggedInState(true);
        handleClose();
      } else {
        alert("Đăng nhập thất bại: Kiểm tra lại email/mật khẩu.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!displayName || !account || !password) return alert('Vui lòng nhập đủ thông tin!');
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, account, password);
      await updateProfile(userCredential.user, { displayName });
      handleClose();
    } catch (e) {
      if (e.message.includes('configuration-not-found') || e.code === 'auth/configuration-not-found') {
        alert("Firebase chưa cấu hình. Kích hoạt Đăng Nhập Tạm Thời (Mock Login) để test game!");
        setUserProfileState({ name: displayName, level: 1, highScore: 0 });
        setIsLoggedInState(true);
        handleClose();
      } else {
        alert("Đăng ký thất bại: " + e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.centeredView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalView}>
          {/* Header Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeBtnText}>X</Text>
          </TouchableOpacity>

          {/* Main Login/Register View */}
          <View style={styles.contentContainer}>
              {/* Tabs */}
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tabBtn, activeTab === 'LOGIN' && styles.tabBtnActive]} 
                  onPress={() => setActiveTab('LOGIN')}
                >
                  <Text style={[styles.tabText, activeTab === 'LOGIN' && styles.tabTextActive]}>ĐĂNG NHẬP</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabBtn, activeTab === 'REGISTER' && styles.tabBtnActive]} 
                  onPress={() => setActiveTab('REGISTER')}
                >
                  <Text style={[styles.tabText, activeTab === 'REGISTER' && styles.tabTextActive]}>ĐĂNG KÝ</Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'REGISTER' && (
                <TextInput
                  style={styles.input}
                  placeholder="Tên hiển thị (Ví dụ: Dungelt)"
                  placeholderTextColor="#94a3b8"
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Email của bạn"
                placeholderTextColor="#94a3b8"
                value={account}
                onChangeText={setAccount}
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              {isLoading ? (
                <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
              ) : activeTab === 'LOGIN' ? (
                <TouchableOpacity onPress={handleNormalLogin}>
                  <LinearGradient
                    colors={['#4facfe', '#a18cd1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionBtnText}>ĐĂNG NHẬP</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleRegister}>
                  <LinearGradient
                    colors={['#10b981', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.actionBtn}
                  >
                    <Text style={styles.actionBtnText}>ĐĂNG KÝ</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 10, 25, 0.85)',
  },
  modalView: {
    width: '85%',
    maxWidth: 450,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 25,
    borderWidth: 2,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    width: '100%',
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 5,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  tabText: {
    color: '#94a3b8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabTextActive: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#475569',
    marginBottom: 15,
  },
  actionBtn: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
    shadowColor: '#a18cd1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#334155',
  },
  dividerText: {
    color: '#94a3b8',
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  socialBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
