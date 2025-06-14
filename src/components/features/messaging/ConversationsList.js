import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useXMTP } from '../hooks/useXMTP';

export const ConversationsList = ({ onSelectConversation, currentAddress }) => {
  const { conversations, isLoading, loadConversations, error } = useXMTP();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const renderConversation = ({ item }) => {
    const peerAddress = item.peerAddress || 'Unknown';
    const shortAddress = `${peerAddress.slice(0, 6)}...${peerAddress.slice(-4)}`;

    return (
      <TouchableOpacity style={styles.conversationItem} onPress={() => onSelectConversation(item)}>
        <View style={styles.conversationInfo}>
          <Text style={styles.peerAddress}>{shortAddress}</Text>
          <Text style={styles.lastMessage}>Tap to open chat</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Conversations</Text>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item, index) => item.id || index.toString()}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadConversations} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isLoading ? 'Loading conversations...' : 'No conversations yet'}
          </Text>
        }
      />
    </View>
  );
};
