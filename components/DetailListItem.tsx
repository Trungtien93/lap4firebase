import React, { FC, ReactNode } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress?: () => void;
}

export default function DetailListItem({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
});