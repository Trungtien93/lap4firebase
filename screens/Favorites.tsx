import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { fetchContacts } from '../utils/api';
import ContactThumbnail from '../components/ContactThumbnail';
import { Contact } from '../types'; // ✅ đường dẫn đúng đến file type


export default function Favorites({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const favoriteContacts = contacts.filter((c) => c.favorite);

  useEffect(() => {
    fetchContacts().then(data => {
      const favoritesOnly = data.filter((c: Contact) => c.favorite);
      setContacts(favoritesOnly);
      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.phone}
        numColumns={3}
        contentContainerStyle={styles.list}
        renderItem={({ item }: { item: Contact }) => (
          <ContactThumbnail
            avatar={item.avatar}
            name={item.name} // Thêm tên
            onPress={() => navigation.navigate('Profile', { contact: item })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  list: { alignItems: 'center' },
});
