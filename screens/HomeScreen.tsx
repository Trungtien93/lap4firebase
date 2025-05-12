import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    age: '',
    gender: '',
    avatarUrl: '',
  });

  const { theme } = useTheme();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const fileName = uri.split('/').pop(); // Lấy tên tệp từ URI
        const localUri = FileSystem.documentDirectory + fileName;

        await FileSystem.copyAsync({ from: uri, to: localUri });
        setUserData((prev) => ({ ...prev, avatarUrl: localUri }));
        await AsyncStorage.setItem('avatarUri', localUri);
      }
    } catch (err) {
      console.error('Image picking failed:', err);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại!');
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Lỗi', 'Người dùng chưa đăng nhập!');
        return;
      }

      if (!userData.age || parseInt(userData.age, 10) < 1 || parseInt(userData.age, 10) > 150) {
        Alert.alert('Lỗi', 'Tuổi không hợp lệ! Vui lòng nhập tuổi từ 1 đến 150.');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        fullName: userData.fullName,
        age: userData.age,
        gender: userData.gender,
        avatarUrl: userData.avatarUrl,
      });

      Alert.alert('✅ Đã lưu thông tin thành công!');
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('❌ Lỗi khi lưu thông tin!');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('✅ Đăng xuất thành công!');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể đăng xuất!');
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data();
          setUserData({
            fullName: data.fullName || '',
            age: data.age || '',
            gender: data.gender || '',
            avatarUrl: data.avatarUrl || '',
          });
        }

        // Tải avatar từ AsyncStorage
        const localAvatar = await AsyncStorage.getItem('avatarUri');
        if (localAvatar) {
          setUserData((prev) => ({ ...prev, avatarUrl: localAvatar }));
        }
      } catch (error) {
        console.error('Load user data failed:', error);
      }
    };
    loadUserData();
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Thông tin cá nhân</Text>

      <Image
        source={
          userData.avatarUrl
            ? { uri: userData.avatarUrl }
            : require('../assets/avatar-placeholder.png')
        }
        style={styles.avatar}
      />
      <TouchableOpacity onPress={pickImage}>
        <Text style={[styles.pickText, { color: theme.text }]}>📸 Đổi ảnh đại diện</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Họ tên</Text>
        <TextInput
          placeholder="Nhập họ tên"
          placeholderTextColor={theme.placeholder}
          value={userData.fullName}
          onChangeText={(text) => setUserData({ ...userData, fullName: text })}
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText, borderColor: theme.border }]}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Tuổi</Text>
        <TextInput
          placeholder="Nhập tuổi"
          placeholderTextColor={theme.placeholder}
          keyboardType="numeric"
          value={userData.age}
          onChangeText={(text) => setUserData({ ...userData, age: text })}
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText, borderColor: theme.border }]}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>Giới tính</Text>
        <View style={styles.genderRow}>
          {['Nam', 'Nữ'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderButton, userData.gender === g && styles.genderSelected]}
              onPress={() => setUserData({ ...userData, gender: g })}
            >
              <Text style={[styles.genderText, userData.gender === g && styles.genderSelectedText]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: theme.button }]}>
        <Text style={[styles.buttonText, { color: theme.buttonText }]}>Lưu thông tin</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton]}>
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  pickText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 15,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    fontSize: 15,
  },
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  genderSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  genderText: {
    fontSize: 14,
    color: '#333',
  },
  genderSelectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;