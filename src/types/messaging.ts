import { AgentMessageData, AgentType } from "./agents";
import { MiniAppMessageData } from "./miniApps";

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  senderAddress: string;
  timestamp: Date;
  type: MessageType;
  metadata?: MessageMetadata;
  deliveryStatus: DeliveryStatus;
  isRead: boolean;
}

export type MessageType = 'text' | 'mini-app' | 'agent-command' | 'system' | 'image' | 'file';
export type DeliveryStatus = 'sending' | 'sent' | 'delivered' | 'failed';

export interface MessageMetadata {
  replyTo?: string;
  editedAt?: Date;
  reactions?: MessageReaction[];
  miniApp?: MiniAppMessageData;
  agent?: AgentMessageData;
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface Conversation {
  id: string;
  topic: string;
  participants: string[];
  type: ConversationType;
  title?: string;
  description?: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Context-specific data
  eventMetadata?: EventConversationMetadata;
  agentMetadata?: AgentConversationMetadata;
  groupMetadata?: GroupConversationMetadata;
}

export type ConversationType = 'direct' | 'event-room' | 'group' | 'agent';

export interface EventConversationMetadata {
  eventId: string;
  eventTitle: string;
  eventPhase: EventPhase;
  eventStartTime: Date;
  eventEndTime: Date;
  maxParticipants?: number;
}

export type EventPhase = 'before' | 'during' | 'after';

export interface AgentConversationMetadata {
  agentId: string;
  agentName: string;
  agentType: AgentType;
  capabilities: string[];
  isOnline: boolean;
}

export interface GroupConversationMetadata {
  name: string;
  description?: string;
  isPublic: boolean;
  adminAddresses: string[];
  memberCount: number;
}

export interface MessagingState {
  conversations: Record<string, Conversation>;
  messages: Record<string, Message[]>; // conversationId -> messages
  activeConversationId: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  // UI state
  searchQuery: string;
  filterType: ConversationFilter;
  typingUsers: Record<string, string[]>; // conversationId -> userAddresses
}

export type ConversationFilter = 'all' | 'unread' | 'events' | 'agents' | 'groups' | 'direct';