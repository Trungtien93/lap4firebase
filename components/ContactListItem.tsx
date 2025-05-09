import React, { FC, ReactNode } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  name: string;
  phone: string;
  avatar: string;
  favorite?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

export default function ContactListItem({
  name,
  phone,
  avatar,
  favorite = false,
  onPress,
  onToggleFavorite,
}: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.item}>
      <Image source={{ uri: avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text>{name}</Text>
        <Text>{phone}</Text>
      </View>
      {onToggleFavorite && (
        <TouchableOpacity onPress={onToggleFavorite}>
          <MaterialIcons
            name={favorite ? 'note-add' : 'star-border'}
            size={24}
            color={favorite ? 'red' : 'black'}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
});
