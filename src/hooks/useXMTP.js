import { useState, useEffect, useCallback } from 'react';
import { Client } from '@xmtp/react-native-sdk';
import { Signer } from '@xmtp/react-native-sdk/lib/Signer';

export const useXMTP = () => {
  const [client, setClient] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize XMTP client with wallet signer
  const initializeClient = useCallback(async (walletSigner, address) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create XMTP client with V3 MLS
      const xmtpClient = await Client.create(walletSigner, {
        env: 'production', // or 'dev' for testing
        dbEncryptionKey: new Uint8Array(32), // Generate secure key
        enableV3: true, // Enable V3 MLS
      });

      setClient(xmtpClient);
      console.log(`✅ XMTP Client initialized for ${address}`);

      // Load existing conversations
      await loadConversations(xmtpClient);

      return xmtpClient;
    } catch (err) {
      console.error('❌ Error initializing XMTP client:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load all conversations
  const loadConversations = useCallback(
    async (xmtpClient = client) => {
      if (!xmtpClient) return;

      try {
        const convos = await xmtpClient.conversations.list();
        setConversations(convos);
        console.log(`📱 Loaded ${convos.length} conversations`);
      } catch (err) {
        console.error('❌ Error loading conversations:', err);
        setError(err.message);
      }
    },
    [client]
  );

  // Create new conversation
  const createConversation = useCallback(
    async (peerAddress) => {
      if (!client) throw new Error('XMTP client not initialized');

      try {
        setIsLoading(true);

        // Check if conversation already exists
        const existingConvo = conversations.find(
          (convo) => convo.peerAddress.toLowerCase() === peerAddress.toLowerCase()
        );

        if (existingConvo) {
          return existingConvo;
        }

        // Create new conversation (V3 group conversation)
        const conversation = await client.conversations.newGroup([peerAddress]);

        // Refresh conversations list
        await loadConversations();

        console.log(`✅ Created conversation with ${peerAddress}`);
        return conversation;
      } catch (err) {
        console.error('❌ Error creating conversation:', err);
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client, conversations, loadConversations]
  );

  // Send message
  const sendMessage = useCallback(async (conversation, messageText) => {
    try {
      await conversation.send(messageText);
      console.log(`✅ Message sent: ${messageText}`);
    } catch (err) {
      console.error('❌ Error sending message:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  // Get messages for a conversation
  const getMessages = useCallback(async (conversation, limit = 25) => {
    try {
      const messages = await conversation.messages({ limit });
      return messages.reverse(); // Show oldest first
    } catch (err) {
      console.error('❌ Error getting messages:', err);
      setError(err.message);
      return [];
    }
  }, []);

  // Stream new messages
  const streamMessages = useCallback(async (conversation, onMessage) => {
    try {
      const stream = await conversation.streamMessages();

      for await (const message of stream) {
        onMessage(message);
      }
    } catch (err) {
      console.error('❌ Error streaming messages:', err);
      setError(err.message);
    }
  }, []);

  return {
    client,
    conversations,
    isLoading,
    error,
    initializeClient,
    loadConversations,
    createConversation,
    sendMessage,
    getMessages,
    streamMessages,
  };
};

// Chat Screen Component - components/ChatScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useXMTP } from './useXMTP';

export const ChatScreen = ({ conversation, currentAddress }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendMessage, getMessages, streamMessages } = useXMTP();

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversation) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const msgs = await getMessages(conversation);
        setMessages(msgs);
      } catch (err) {
        Alert.alert('Error', 'Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Stream new messages
    const startStreaming = async () => {
      streamMessages(conversation, (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      });
    };

    startStreaming();
  }, [conversation, getMessages, streamMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !conversation) return;

    try {
      await sendMessage(conversation, newMessage.trim());
      setNewMessage('');

      // Add message to local state for immediate UI update
      const localMessage = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        senderAddress: currentAddress,
        sentAt: new Date(),
      };
      setMessages((prev) => [...prev, localMessage]);
    } catch (err) {
      Alert.alert('Error', 'Failed to send message');
    }
  }, [newMessage, conversation, sendMessage, currentAddress]);

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.senderAddress?.toLowerCase() === currentAddress?.toLowerCase();

    return (
      <View
        style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}
      >
        <Text style={styles.messageText}> {item.content} </Text>
        <Text style={styles.timestamp}>{new Date(item.sentAt).toLocaleTimeString()}</Text>
      </View>
    );
  };

  if (!conversation) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholderText}> Select a conversation to start chatting </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id || item.sentAt?.toString()}
        style={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Text style={styles.sendButtonText}> Send </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
