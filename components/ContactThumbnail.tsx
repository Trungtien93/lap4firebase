import React, { FC, ReactNode } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  avatar: string;
  name: string;
  onPress: () => void;
}

export default function ContactThumbnail({ avatar, name, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
