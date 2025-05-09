import React, { FC, ReactNode } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Contact } from '../screens/types';

interface Props {
  route: RouteProp<{ params: { contact: Contact } }, 'params'>;
}

export default function Profile({ route }: Props) {
  const { contact } = route.params;

  const handlePhonePress = () => {
    Linking.openURL(`tel:${contact.phone}`).catch(() =>
      Alert.alert('Error', 'Unable to make a call.')
    );
  };

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${contact.email}`).catch(() =>
      Alert.alert('Error', 'Unable to send an email.')
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: contact.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{contact.name}</Text>
        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={[styles.info, styles.link]}>{contact.phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={[styles.info, styles.link]}>{contact.email}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    marginTop: 12,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  link: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
