import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<any>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
    password: Yup.string().required('Bắt buộc'),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
    } catch (error: any) {
      setErrorState(error.message);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={handleLogin}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

          <TextInput
            placeholder="Mật khẩu"
            secureTextEntry
            style={styles.input}
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
          />
          {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {errorState !== '' && <Text style={styles.error}>{errorState}</Text>}

          <Button title="Đăng nhập" onPress={() => handleSubmit()} />
          <Button title="Chưa có tài khoản? Đăng ký" onPress={() => navigation.navigate('Signup')} />
          <Button title="Quên mật khẩu?" onPress={() => navigation.navigate('ForgotPassword')} />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  error: { color: 'red', marginBottom: 10 },
});

export default LoginScreen;
