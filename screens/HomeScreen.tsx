import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useTheme } from '../context/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeScreen = () => {
  const [noteData, setNoteData] = useState({
    title: '',
    content: '',
    priority: 'Bình thường', // Mức độ ưu tiên
    status: 'Chưa làm', // Trạng thái
    deadline: new Date(), // Ngày deadline
  });
  const [savedNote, setSavedNote] = useState(null); // Lưu ghi chú đã lưu
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [language, setLanguage] = useState('vi');

  const toggleLanguage = () => setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));

  const translations = {
    vi: {
      title: 'Tiêu đề',
      content: 'Nội dung',
      priority: 'Mức độ ưu tiên',
      status: 'Trạng thái',
      save: 'Lưu ghi chú',
      logout: 'Đăng xuất',
      deadline: 'Ngày deadline',
      successMessage: 'Đã lưu ghi chú thành công!',
      failureMessage: 'Lỗi khi lưu ghi chú!',
      titleRequired: 'Tiêu đề không được để trống!',
      contentRequired: 'Nội dung không được để trống!',
    },
    en: {
      title: 'Title',
      content: 'Content',
      priority: 'Priority',
      status: 'Status',
      save: 'Save Note',
      logout: 'Logout',
      deadline: 'Deadline Date',
      successMessage: 'Note saved successfully!',
      failureMessage: 'Failed to save note!',
      titleRequired: 'Title cannot be empty!',
      contentRequired: 'Content cannot be empty!',
    },
  };

  const t = translations[language];

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể đăng xuất!');
    }
  };

  const handleSave = async () => {
    // Kiểm tra nếu Tiêu đề hoặc Nội dung trống
    if (!noteData.title) {
      Alert.alert('❌', t.titleRequired);
      return;
    }

    if (!noteData.content) {
      Alert.alert('❌', t.contentRequired);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        noteTitle: noteData.title,
        noteContent: noteData.content,
        notePriority: noteData.priority,
        noteStatus: noteData.status,
        noteDeadline: noteData.deadline,
      });

      setSavedNote(noteData); // Lưu ghi chú vào state để hiển thị
      Alert.alert('✅', t.successMessage); // Hiển thị thông báo thành công
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('❌', t.failureMessage); // Hiển thị thông báo lỗi
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || noteData.deadline;
    setNoteData({ ...noteData, deadline: currentDate });
  };

  // Kiểm tra nếu có thể lưu ghi chú
  const canSave = noteData.title.trim() !== '' && noteData.content.trim() !== '';

  function setShowDatePicker(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>{t.title}</Text>
        <TextInput
          placeholder={t.title}
          placeholderTextColor={theme.placeholder}
          value={noteData.title}
          onChangeText={(text) => setNoteData({ ...noteData, title: text })}
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText, borderColor: theme.border }]}
        />
        {!noteData.title && <Text style={styles.errorText}>{t.titleRequired}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>{t.content}</Text>
        <TextInput
          placeholder={t.content}
          placeholderTextColor={theme.placeholder}
          value={noteData.content}
          onChangeText={(text) => setNoteData({ ...noteData, content: text })}
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText, borderColor: theme.border }]}
        />
        {!noteData.content && <Text style={styles.errorText}>{t.contentRequired}</Text>}
      </View>

      {/* Mức độ ưu tiên */}
      <TouchableOpacity
        onPress={() => setShowPriorityModal(true)}
        style={[styles.inputContainer, { borderColor: theme.border }]}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>{t.priority}</Text>
        <Text style={[styles.input, { color: theme.inputText }]}>{noteData.priority}</Text>
      </TouchableOpacity>

      {/* Trạng thái */}
      <TouchableOpacity
        onPress={() => setShowStatusModal(true)}
        style={[styles.inputContainer, { borderColor: theme.border }]}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>{t.status}</Text>
        <Text style={[styles.input, { color: theme.inputText }]}>{noteData.status}</Text>
      </TouchableOpacity>

      {/* Chọn ngày deadline */}
      <View style={styles.inputContainer}>
        <Text style={[styles.inputLabel, { color: theme.text }]}>{t.deadline}</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.input, { color: theme.inputText, borderColor: theme.border }]}>
            {noteData.deadline.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal chọn mức độ ưu tiên */}
      <Modal visible={showPriorityModal} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setNoteData({ ...noteData, priority: 'Bình thường' })}>
              <Text style={styles.modalText}>Bình thường</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNoteData({ ...noteData, priority: 'Gấp' })}>
              <Text style={styles.modalText}>Gấp</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNoteData({ ...noteData, priority: 'Nguy hiểm' })}>
              <Text style={styles.modalText}>Nguy hiểm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPriorityModal(false)}>
              <Text style={styles.closeModal}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal chọn trạng thái */}
      <Modal visible={showStatusModal} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setNoteData({ ...noteData, status: 'Đã làm' })}>
              <Text style={styles.modalText}>Đã làm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNoteData({ ...noteData, status: 'Đang làm' })}>
              <Text style={styles.modalText}>Đang làm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNoteData({ ...noteData, status: 'Chưa làm' })}>
              <Text style={styles.modalText}>Chưa làm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowStatusModal(false)}>
              <Text style={styles.closeModal}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lưu ghi chú */}
      {canSave && (
        <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: theme.button }]}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>{t.save}</Text>
        </TouchableOpacity>
      )}

      {/* Hiển thị thông tin ghi chú đã lưu */}
      {savedNote && (
        <View style={styles.savedNoteContainer}>
          <Text style={[styles.savedNoteText, { color: theme.text }]}>
            Tiêu đề: {savedNote.title}
          </Text>
          <Text style={[styles.savedNoteText, { color: theme.text }]}>
            Nội dung: {savedNote.content}
          </Text>
          <Text style={[styles.savedNoteText, { color: theme.text }]}>
            Mức độ ưu tiên: {savedNote.priority}
          </Text>
          <Text style={[styles.savedNoteText, { color: theme.text }]}>
            Trạng thái: {savedNote.status}
          </Text>
          <Text style={[styles.savedNoteText, { color: theme.text }]}>
            Deadline: {savedNote.deadline.toLocaleDateString()}
          </Text>
        </View>
      )}

      {/* Đăng xuất */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>{t.logout}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  savedNoteContainer: {
    marginTop: 20,
  },
  savedNoteText: {
    fontSize: 16,
    marginVertical: 4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginVertical: 5,
  },
  closeModal: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HomeScreen;
