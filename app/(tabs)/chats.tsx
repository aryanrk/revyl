import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DUMMY_CHATS = [
  {
    id: '1',
    name: 'Sarah',
    lastMessage: 'Would love to grab coffee sometime!',
    timestamp: '2 min ago',
    unread: 2,
    avatar: 'http://images.unsplash.com/photo-1494790108377-be9c29b29330',
  },
  {
    id: '2',
    name: 'Michael',
    lastMessage: 'That sounds great! When are you free?',
    timestamp: '1 hour ago',
    unread: 0,
    avatar: 'http://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  },
  {
    id: '3',
    name: 'Emma',
    lastMessage: 'Thanks for the lovely evening!',
    timestamp: 'Yesterday',
    unread: 1,
    avatar: 'http://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  },
];

export default function ChatsScreen() {
  const renderChat = ({ item }) => (
    <Pressable style={styles.chatItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Pressable style={styles.newMessageButton}>
          <Ionicons name="create-outline" size={24} color="#FF6B6B" />
        </Pressable>
      </View>
      <FlatList
        data={DUMMY_CHATS}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  chatList: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});