import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  MessagingState,
  Conversation,
  Message,
  ConversationFilter,
  ConversationType
} from '../types/messaging';

interface MessagingActions {
  // Connection
  setConnected: (connected: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Conversations
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  removeConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;

  // Messages
  addMessage: (conversationId: string, message: Message, currentUserAddress?: string) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  markAsRead: (conversationId: string) => void;
  clearMessages: (conversationId: string) => void;

  // UI state
  setSearchQuery: (query: string) => void;
  setFilterType: (filter: ConversationFilter) => void;
  setTypingUsers: (conversationId: string, users: string[]) => void;

  // Getters
  getConversation: (id: string) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  getUnreadCount: () => number;
  getFilteredConversations: () => Conversation[];
}

type MessagingStore = MessagingState & MessagingActions;

export const useMessagingStore = create<MessagingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      conversations: {},
      messages: {},
      activeConversationId: null,
      isConnected: false,
      isLoading: false,
      error: null,
      searchQuery: '',
      filterType: 'all',
      typingUsers: {},

      // Actions
      setConnected: (connected) => set({ isConnected: connected }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      addConversation: (conversation) =>
        set((state) => ({
          conversations: {
            ...state.conversations,
            [conversation.id]: conversation,
          },
        })),

      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: {
            ...state.conversations,
            [id]: state.conversations[id] ? {
              ...state.conversations[id],
              ...updates,
              updatedAt: new Date(),
            } : state.conversations[id],
          },
        })),

      removeConversation: (id) =>
        set((state) => {
          const { [id]: removed, ...conversations } = state.conversations;
          const { [id]: removedMessages, ...messages } = state.messages;
          return {
            conversations,
            messages,
            activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
          };
        }),

      setActiveConversation: (id) => set({ activeConversationId: id }),

      // Fixed addMessage function
      addMessage: (conversationId, message, currentUserAddress) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: [
              ...(state.messages[conversationId] || []),
              message,
            ],
          },
          conversations: {
            ...state.conversations,
            [conversationId]: state.conversations[conversationId] ? {
              ...state.conversations[conversationId],
              lastMessage: message,
              unreadCount: message.senderAddress !== currentUserAddress
                ? (state.conversations[conversationId].unreadCount || 0) + 1
                : state.conversations[conversationId].unreadCount || 0,
              updatedAt: new Date(),
            } : state.conversations[conversationId],
          },
        })),

      updateMessage: (messageId, updates) =>
        set((state) => {
          const newMessages = { ...state.messages };

          for (const conversationId in newMessages) {
            const messages = newMessages[conversationId];
            const messageIndex = messages.findIndex(m => m.id === messageId);

            if (messageIndex !== -1) {
              newMessages[conversationId] = [
                ...messages.slice(0, messageIndex),
                { ...messages[messageIndex], ...updates },
                ...messages.slice(messageIndex + 1),
              ];
              break;
            }
          }

          return { messages: newMessages };
        }),

      markAsRead: (conversationId) =>
        set((state) => {
          // Mark all messages as read
          const messages = state.messages[conversationId]?.map(m => ({ ...m, isRead: true })) || [];

          return {
            messages: {
              ...state.messages,
              [conversationId]: messages,
            },
            conversations: {
              ...state.conversations,
              [conversationId]: state.conversations[conversationId] ? {
                ...state.conversations[conversationId],
                unreadCount: 0,
              } : state.conversations[conversationId],
            },
          };
        }),

      clearMessages: (conversationId) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: [],
          },
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterType: (filter) => set({ filterType: filter }),

      setTypingUsers: (conversationId, users) =>
        set((state) => ({
          typingUsers: {
            ...state.typingUsers,
            [conversationId]: users,
          },
        })),

      // Getters
      getConversation: (id) => get().conversations[id],
      getMessages: (conversationId) => get().messages[conversationId] || [],

      getUnreadCount: () => {
        const conversations = Object.values(get().conversations);
        return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
      },

      getFilteredConversations: () => {
        const { conversations, filterType, searchQuery } = get();
        let filtered = Object.values(conversations);

        // Apply filter
        if (filterType !== 'all') {
          filtered = filtered.filter(conv => {
            switch (filterType) {
              case 'unread': return (conv.unreadCount || 0) > 0;
              case 'events': return conv.type === 'event-room';
              case 'agents': return conv.type === 'agent';
              case 'groups': return conv.type === 'group';
              case 'direct': return conv.type === 'direct';
              default: return true;
            }
          });
        }

        // Apply search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(conv =>
            conv.title?.toLowerCase().includes(query) ||
            conv.participants.some(p => p.toLowerCase().includes(query)) ||
            conv.lastMessage?.content.toLowerCase().includes(query)
          );
        }

        // Sort by update time
        return filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        });
      },
    }),
    {
      name: 'messaging-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        messages: state.messages,
      }),
    }
  )
);