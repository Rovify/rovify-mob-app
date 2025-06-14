import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useXMTP } from '../hooks/useXMTP';
import { ConversationsList } from './ConversationsList';
import { ChatScreen } from './ChatScreen';

export const ChatApp = ({ walletSigner, currentAddress }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatAddress, setNewChatAddress] = useState('');
  const { client, isLoading, error, initializeClient, createConversation } = useXMTP();

  // Initialize XMTP client when component mounts
  useEffect(() => {
    if (walletSigner && currentAddress && !client) {
      initializeClient(walletSigner, currentAddress);
    }
  }, [walletSigner, currentAddress, client, initializeClient]);

  const handleNewConversation = async () => {
    if (!newChatAddress.trim()) return;

    try {
      const conversation = await createConversation(newChatAddress.trim());
      setSelectedConversation(conversation);
      setShowNewChatModal(false);
      setNewChatAddress('');
    } catch (err) {
      Alert.alert('Error', 'Failed to create conversation');
    }
  };

  if (!client && isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Initializing XMTP...</Text>
      </View>
    );
  }

  if (error && !client) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to initialize XMTP: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {selectedConversation ? (
        <View style={styles.chatContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedConversation(null)}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <ChatScreen conversation={selectedConversation} currentAddress={currentAddress} />
        </View>
      ) : (
        <View style={styles.conversationsContainer}>
          <TouchableOpacity style={styles.newChatButton} onPress={() => setShowNewChatModal(true)}>
            <Text style={styles.newChatButtonText}>+ New Chat</Text>
          </TouchableOpacity>
          <ConversationsList
            onSelectConversation={setSelectedConversation}
            currentAddress={currentAddress}
          />
        </View>
      )}

      <Modal
        visible={showNewChatModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewChatModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Start New Conversation</Text>
            <TextInput
              style={styles.modalInput}
              value={newChatAddress}
              onChangeText={setNewChatAddress}
              placeholder="Enter wallet address (0x...)"
              autoCapitalize="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowNewChatModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleNewConversation}
              >
                <Text style={styles.primaryButtonText}>Start Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  conversationsContainer: {
    flex: 1,
  },
  backButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  newChatButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  newChatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 15,
  },
  conversationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  conversationInfo: {
    flex: 1,
  },
  peerAddress: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  messagesList: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e9ecef',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatApp;
