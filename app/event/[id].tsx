import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = Dimensions.get('window');

  // Mock event data
  const event = {
    id,
    title: 'The Man Esclusivе 2025 | Nairobi',
    date: 'Saturday, January 1, 2025',
    time: '8:00 PM - 2:00 AM',
    location: 'Jonah Jang Crescent, Nairobi',
    price: 'Free',
    description: 'Join us for the most exclusive event of the year! Experience amazing music, great food, and unforgettable moments with friends.',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
    attendees: 247,
    host: 'Event Masters Kenya'
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        {/* Header Image */}
        <View style={{ height: width * 0.6 }} className="relative">
          <Image
            source={{ uri: event.image }}
            style={{ width, height: width * 0.6 }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
            }}
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 w-10 h-10 bg-black bg-opacity-50 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 rounded-full items-center justify-center">
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Event Details */}
        <View className="p-6">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            {event.title}
          </Text>

          {/* Date & Time */}
          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar" size={20} color="#F97316" />
            <Text className="ml-3 text-gray-700 font-medium">{event.date}</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="time" size={20} color="#F97316" />
            <Text className="ml-3 text-gray-700 font-medium">{event.time}</Text>
          </View>

          {/* Location */}
          <View className="flex-row items-center mb-3">
            <Ionicons name="location" size={20} color="#F97316" />
            <Text className="ml-3 text-gray-700 font-medium">{event.location}</Text>
          </View>

          {/* Price */}
          <View className="flex-row items-center mb-6">
            <Ionicons name="pricetag" size={20} color="#F97316" />
            <Text className="ml-3 text-orange-600 font-bold text-lg">{event.price}</Text>
          </View>

          {/* Attendees */}
          <View className="flex-row items-center mb-6">
            <Ionicons name="people" size={20} color="#6B7280" />
            <Text className="ml-3 text-gray-700">{event.attendees} people interested</Text>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">About</Text>
            <Text className="text-gray-700 leading-6">{event.description}</Text>
          </View>

          {/* Host */}
          <View className="mb-8">
            <Text className="text-lg font-bold text-gray-900 mb-3">Hosted by</Text>
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="person" size={24} color="#F97316" />
              </View>
              <Text className="text-gray-900 font-medium">{event.host}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="p-6 border-t border-gray-100 bg-white">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 bg-orange-500 py-4 rounded-xl items-center"
            onPress={() => {
              // Navigate to event room
              router.push(`/chat/room-${id}`);
            }}
          >
            <Text className="text-white font-bold text-lg">Join Event Room</Text>
          </TouchableOpacity>

          <TouchableOpacity className="w-14 h-14 bg-gray-100 rounded-xl items-center justify-center">
            <Ionicons name="heart-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}