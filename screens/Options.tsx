import React, { FC, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import DetailListItem from '../components/DetailListItem'; // Đảm bảo đường dẫn đúng
import colors from '../utils/colors'; // Đảm bảo file colors tồn tại

export default function Options() {
  return (
    <View style={styles.container}>
      <DetailListItem title="Update Profile" />
      <DetailListItem title="Change Language" />
      <DetailListItem title="Sign Out" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white, // Sử dụng màu từ file colors
  },
});
