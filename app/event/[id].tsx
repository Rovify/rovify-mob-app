import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { useMessaging } from '../../src/hooks/useMessaging';
import { useAuth } from '../../src/hooks/useAuth';
import { getDeviceInfo, getDesignTokens } from '../../src/utils/responsive';
import { CustomHeader } from '@/components/layout/Header';

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const device = getDeviceInfo();
  const tokens = getDesignTokens();
  const { createEventRoom, conversations } = useMessaging();
  const { address, isAuthenticated } = useAuth();

  // Mock event data - in real app, fetch from API
  const eventData = {
    '1': {
      title: 'The Man Esclusivе 2025 | Nairobi',
      date: 'Saturday, January 1, 2025',
      time: '8:00 PM - 2:00 AM',
      location: 'Jonah Jang Crescent, Nairobi',
      price: 'Free',
      description: 'Join us for the most exclusive event of the year! Experience amazing music, great food, and unforgettable moments with friends. This is where connections are made and memories are created.',
      image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
      attendees: 247,
      host: 'Event Masters Kenya',
      tags: ['Music', 'Networking', 'Food & Drinks'],
      roomTopic: 'event_room_1'
    },
    '2': {
      title: 'Panydoesart x DNJ Studios Sip & Paint',
      date: 'Thursday, February 7, 2025',
      time: '6:00 PM - 9:00 PM',
      location: 'Don & Divas Lounge',
      price: 'Starts from $25',
      description: 'Unleash your creativity in this fun sip & paint experience! All materials provided.',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
      attendees: 45,
      host: 'Panydoesart',
      tags: ['Art', 'Creative', 'Social'],
      roomTopic: 'event_room_2'
    },
    '3': {
      title: 'Tidal Rave - the 8th wonder | Mombasa',
      date: 'Friday, February 8, 2025',
      time: '10:00 PM - 6:00 AM',
      location: 'Mombasa Beach Resort',
      price: 'From $40',
      description: 'Beach rave like no other! International DJs, amazing vibes, and sunrise dancing.',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      attendees: 890,
      host: 'Tidal Events',
      tags: ['Electronic', 'Beach', 'International'],
      roomTopic: 'event_room_3'
    }
  };

  const event = eventData[id as keyof typeof eventData];

  if (!event) {
    return (
      <ScreenWrapper mode="safe">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: tokens.typography.lg, color: '#6B7280' }}>
            Event not found
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  // Check if user already joined the event room
  const existingRoom = conversations.find(conv =>
    conv.metadata?.eventId === id && conv.metadata?.type === 'event-room'
  );

  const handleJoinEventRoom = async () => {
    if (!isAuthenticated) {
      Alert.alert('Connect Wallet', 'Please connect your wallet to join the event room.');
      return;
    }

    if (existingRoom) {
      router.push(`/chat/${existingRoom.topic}`);
      return;
    }

    setIsJoining(true);

    try {
      console.log('🎉 Creating event room for:', event.title);

      // Create XMTP event room
      const eventRoom = await createEventRoom(id!, event.title);

      // Send welcome message to the room
      setTimeout(() => {
        // This would be sent via XMTP in real implementation
        console.log('Welcome message sent to room');
      }, 1000);

      setHasJoined(true);

      Alert.alert(
        'Joined Event Room! 🎉',
        `You've joined the ${event.title} chat room. Connect with other attendees now!`,
        [
          {
            text: 'Open Chat',
            onPress: () => router.push(`/chat/${eventRoom.topic}`)
          },
          { text: 'Later', style: 'cancel' }
        ]
      );

    } catch (error) {
      console.error('Failed to join event room:', error);
      Alert.alert('Error', 'Failed to join event room. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleSaveEvent = () => {
    Alert.alert('Event Saved! ❤️', 'Event added to your saved events.');
  };

  return (
    <ScreenWrapper mode="edge-to-edge" backgroundColor="white">
      {/* Hero Section */}
      <View style={{ height: device.height * 0.5, position: 'relative' }}>
        <ImageBackground
          source={{ uri: event.image }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.8)']}
            locations={[0, 0.5, 1]}
            style={{ flex: 1 }}
          >
            {/* Header */}
            <CustomHeader
              variant="transparent"
              extend={true}
              showBackButton={true}
              onBackPress={() => router.back()}
              rightActions={[
                {
                  icon: 'share-outline',
                  onPress: () => Alert.alert('Share', 'Share event with friends!')
                },
                {
                  icon: 'heart-outline',
                  onPress: handleSaveEvent
                }
              ]}
            />

            {/* Event Info Overlay */}
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: tokens.spacing.lg
            }}>
              <Text style={{
                color: 'white',
                fontSize: tokens.typography['3xl'],
                fontWeight: 'bold',
                marginBottom: tokens.spacing.sm
              }}>
                {event.title}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: tokens.spacing.xs }}>
                <Ionicons name="calendar" size={16} color="white" />
                <Text style={{
                  color: 'white',
                  marginLeft: tokens.spacing.xs,
                  fontSize: tokens.typography.base,
                  fontWeight: '500'
                }}>
                  {event.date} • {event.time}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location" size={16} color="white" />
                <Text style={{
                  color: 'white',
                  marginLeft: tokens.spacing.xs,
                  fontSize: tokens.typography.base
                }}>
                  {event.location}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ padding: tokens.spacing.lg }}>
          {/* Quick Stats */}
          <View style={{
            flexDirection: 'row',
            marginBottom: tokens.spacing.lg,
            gap: tokens.spacing.md
          }}>
            <View style={{
              flex: 1,
              backgroundColor: '#F3F4F6',
              borderRadius: tokens.borderRadius.lg,
              padding: tokens.spacing.md,
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: tokens.typography['2xl'],
                fontWeight: 'bold',
                color: '#F97316'
              }}>
                {event.attendees}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: tokens.typography.sm }}>
                Attendees
              </Text>
            </View>

            <View style={{
              flex: 1,
              backgroundColor: '#FEF3C7',
              borderRadius: tokens.borderRadius.lg,
              padding: tokens.spacing.md,
              alignItems: 'center'
            }}>
              <Text style={{
                fontSize: tokens.typography['2xl'],
                fontWeight: 'bold',
                color: '#D97706'
              }}>
                {event.price}
              </Text>
              <Text style={{ color: '#92400E', fontSize: tokens.typography.sm }}>
                Entry
              </Text>
            </View>
          </View>

          {/* Event Room Status */}
          {(existingRoom || hasJoined) && (
            <View style={{
              backgroundColor: '#DCFCE7',
              borderRadius: tokens.borderRadius.lg,
              padding: tokens.spacing.md,
              marginBottom: tokens.spacing.lg,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
              <View style={{ flex: 1, marginLeft: tokens.spacing.sm }}>
                <Text style={{
                  fontSize: tokens.typography.base,
                  fontWeight: '600',
                  color: '#16A34A'
                }}>
                  You're in the event chat!
                </Text>
                <Text style={{ fontSize: tokens.typography.sm, color: '#15803D' }}>
                  Connect with other attendees
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push(`/chat/${existingRoom?.topic}`)}
                style={{
                  backgroundColor: '#16A34A',
                  paddingHorizontal: tokens.spacing.sm,
                  paddingVertical: tokens.spacing.xs,
                  borderRadius: tokens.borderRadius.md
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600', fontSize: tokens.typography.sm }}>
                  Open Chat
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Tags */}
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: tokens.spacing.xs,
            marginBottom: tokens.spacing.lg
          }}>
            {event.tags.map((tag, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#FED7AA',
                  paddingHorizontal: tokens.spacing.sm,
                  paddingVertical: tokens.spacing.xs,
                  borderRadius: tokens.borderRadius.full
                }}
              >
                <Text style={{
                  color: '#EA580C',
                  fontSize: tokens.typography.sm,
                  fontWeight: '500'
                }}>
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <View style={{ marginBottom: tokens.spacing.lg }}>
            <Text style={{
              fontSize: tokens.typography.xl,
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: tokens.spacing.sm
            }}>
              About This Event
            </Text>
            <Text style={{
              color: '#6B7280',
              fontSize: tokens.typography.base,
              lineHeight: 24
            }}>
              {event.description}
            </Text>
          </View>

          {/* Host */}
          <View style={{ marginBottom: tokens.spacing.lg }}>
            <Text style={{
              fontSize: tokens.typography.xl,
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: tokens.spacing.sm
            }}>
              Hosted by
            </Text>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F9FAFB',
              padding: tokens.spacing.md,
              borderRadius: tokens.borderRadius.lg
            }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: tokens.borderRadius.lg,
                backgroundColor: '#FED7AA',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: tokens.spacing.sm
              }}>
                <Ionicons name="person" size={24} color="#F97316" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontWeight: '600',
                  color: '#1F2937',
                  fontSize: tokens.typography.base
                }}>
                  {event.host}
                </Text>
                <Text style={{ color: '#6B7280', fontSize: tokens.typography.sm }}>
                  Event Organizer
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <BlurView
        intensity={80}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: tokens.spacing.lg,
          paddingTop: tokens.spacing.md,
          paddingBottom: device.isIOS ? tokens.spacing.lg + 34 : tokens.spacing.lg
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: tokens.spacing.md,
              borderRadius: tokens.borderRadius.lg,
              alignItems: 'center',
              opacity: isJoining ? 0.7 : 1,
              marginRight: tokens.spacing.sm,
              ...tokens.shadows.md
            }}
            onPress={handleJoinEventRoom}
            disabled={isJoining}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#F97316', '#EA580C']}
              style={{
                width: '100%',
                paddingVertical: tokens.spacing.md,
                borderRadius: tokens.borderRadius.lg,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row'
              }}
            >
              {isJoining && (
                <Ionicons name="hourglass" size={20} color="white" style={{ marginRight: 8 }} />
              )}
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: tokens.typography.lg
                }}
              >
                {isJoining ? 'Joining...' :
                  existingRoom ? 'Open Event Chat' :
                    'Join Event Room'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 56,
              height: 56,
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: tokens.borderRadius.lg,
              alignItems: 'center',
              justifyContent: 'center',
              ...tokens.shadows.sm
            }}
            onPress={handleSaveEvent}
          >
            <Ionicons name="heart-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </ScreenWrapper>
  );
}