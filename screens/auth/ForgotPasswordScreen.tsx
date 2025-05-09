import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const ForgotPasswordScreen: React.FC = () => {
  const [errorState, setErrorState] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
  });

  const handleForgotPassword = async (values: { email: string }) => {
    try {
      await sendPasswordResetEmail(auth, values.email);
      setSuccessMsg('Email đặt lại mật khẩu đã được gửi!');
      setErrorState('');
    } catch (error: any) {
      setErrorState(error.message);
      setSuccessMsg('');
    }
  };

  return (
    <Formik
      initialValues={{ email: '' }}
      validationSchema={ForgotPasswordSchema}
      onSubmit={handleForgotPassword}
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

          {errorState !== '' && <Text style={styles.error}>{errorState}</Text>}
          {successMsg !== '' && <Text style={styles.success}>{successMsg}</Text>}

          <Button title="Gửi email đặt lại mật khẩu" onPress={() => handleSubmit()} />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  error: { color: 'red', marginBottom: 10 },
  success: { color: 'green', marginBottom: 10 },
});

export default ForgotPasswordScreen;
