import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Signup: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [errorState, setErrorState] = useState('');

  const SignupSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
    password: Yup.string().min(6, 'Tối thiểu 6 ký tự').required('Bắt buộc'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Mật khẩu không khớp')
      .required('Bắt buộc'),
  });

  const handleSignup = async (values: FormValues) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      navigation.navigate('Login');
    } catch (error: any) {
      setErrorState(error.message);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{ email: '', password: '', confirmPassword: '' }}
      validationSchema={SignupSchema}
      onSubmit={handleSignup}
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

          <TextInput
            placeholder="Xác nhận mật khẩu"
            secureTextEntry
            style={styles.input}
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            value={values.confirmPassword}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}

          {errorState !== '' && <Text style={styles.error}>{errorState}</Text>}

          <Button title="Đăng ký" onPress={() => handleSubmit()} />
          <Button title="Quay lại đăng nhập" onPress={() => navigation.navigate('Login')} />
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

export default SignupScreen;
