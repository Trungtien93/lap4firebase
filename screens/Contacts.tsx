import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import { fetchContacts } from '../utils/api';
import { Contact } from '../types';

export default function Contacts({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchContacts().then((data) => {
      setContacts(data);
      setFilteredContacts(data);
      setLoading(false);
    });
  }, []);

  // Cập nhật danh sách khi gõ tìm kiếm
  useEffect(() => {
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchText, contacts]);

  const toggleFavorite = (phone: string) => {
    const updated = contacts.map((contact) =>
      contact.phone === phone
        ? { ...contact, favorite: !contact.favorite }
        : contact
    );
    setContacts(updated);
  };

  if (loading) return <ActivityIndicator size="large" style={styles.loading} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contacts</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.phone}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Profile', { contact: item })}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>{item.phone}</Text>
              <TouchableOpacity
                onPress={() => toggleFavorite(item.phone)}
                style={styles.favoriteButton}
              >
                <Text style={styles.favoriteText}>
                  {item.favorite ? '★ Favorite' : '☆ Add to Favorite'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No contacts found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    fontSize: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list: {
    paddingHorizontal: 16,
  },
  loading: {
    marginTop: 30,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  favoriteButton: {
    marginTop: 8,
  },
  favoriteText: {
    fontSize: 14,
    color: '#007BFF',
  },
});
