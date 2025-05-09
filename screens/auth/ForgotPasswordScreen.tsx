import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Switch
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

const translations = {
  vi: {
    email: 'Email',
    reset: 'Gửi email đặt lại mật khẩu',
    login: 'Quay lại đăng nhập',
    invalidEmail: 'Email không hợp lệ',
    required: 'Bắt buộc',
    success: 'Email đặt lại mật khẩu đã được gửi!',
    darkMode: 'Chế độ tối',
    language: 'Ngôn ngữ',
  },
  en: {
    email: 'Email',
    reset: 'Send password reset email',
    login: 'Back to Login',
    invalidEmail: 'Invalid email',
    required: 'Required',
    success: 'Password reset email sent!',
    darkMode: 'Dark Mode',
    language: 'Language',
  },
};

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorState, setErrorState] = useState('');

  const t = translations[language];
  const theme = isDarkMode ? darkTheme : lightTheme;

  const ForgotSchema = Yup.object().shape({
    email: Yup.string().email(t.invalidEmail).required(t.required),
  });

  const handleReset = async (values: { email: string }) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      setFeedback(t.success);
      setErrorState('');
    } catch (error: any) {
      setErrorState(error.message);
      setFeedback('');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: theme.text }]}>{t.language}</Text>
        <Switch value={language === 'en'} onValueChange={() => setLanguage(language === 'en' ? 'vi' : 'en')} />
      </View>
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: theme.text }]}>{t.darkMode}</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      <Text style={[styles.title, { color: theme.text }]}>{t.reset}</Text>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotSchema}
        onSubmit={handleReset}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              placeholder={t.email}
              placeholderTextColor={theme.placeholder}
              style={[styles.input, {
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.border,
              }]}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            {errorState !== '' && <Text style={styles.error}>{errorState}</Text>}
            {feedback !== '' && <Text style={styles.success}>{feedback}</Text>}

            <View style={styles.button}>
              <Button title={t.reset} onPress={() => handleSubmit()} color="#007bff" />
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
                {t.login}
              </Text>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const lightTheme = {
  background: '#f9f9f9',
  text: '#000',
  inputBg: '#fff',
  inputText: '#000',
  placeholder: '#888',
  border: '#ccc',
};

const darkTheme = {
  background: '#121212',
  text: '#fff',
  inputBg: '#1e1e1e',
  inputText: '#fff',
  placeholder: '#aaa',
  border: '#555',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggleLabel: {
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 4,
  },
  success: {
    color: 'green',
    marginBottom: 10,
    marginLeft: 4,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
  linkContainer: {
    alignItems: 'center',
  },
  link: {
    color: '#007bff',
    marginTop: 10,
    fontSize: 14,
  },
});

export default ForgotPasswordScreen;
