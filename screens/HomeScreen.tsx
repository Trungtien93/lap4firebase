import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { AuthContext } from '../context/AuthContext';

const HomeScreen: React.FC = () => {
  const { user } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Lỗi đăng xuất:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Xin chào, {user?.email}</Text>
      <Button title="Đăng xuất" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 20 },
});

export default HomeScreen;
