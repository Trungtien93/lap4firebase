import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ContactThumbnail from '../components/ContactThumbnail';
import { fetchUserContact } from '../utils/api';
import { Contact } from '../types';
import colors from '../utils/colors';

export default function User() {
  const [user, setUser] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserContact().then((data: any) => {
      setUser({
        name: `${data.name.first} ${data.name.last}`,
        phone: data.phone,
        email: data.email,
        avatar: data.picture.thumbnail,
        cell: data.cell,
        favorite: false,
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      {user && (
        <>
          <ContactThumbnail avatar={user.avatar} onPress={() => {}} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    color: '#fff',
    marginTop: 16,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
});
