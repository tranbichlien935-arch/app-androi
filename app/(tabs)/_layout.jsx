import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.purple[600],
        tabBarInactiveTintColor: Colors.slate[400],
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.slate[200],
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.slate[900],
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Hoạt động',
          tabBarIcon: ({ color }) => <Ionicons name="fitness" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="water"
        options={{
          title: 'Nước',
          tabBarIcon: ({ color }) => <Ionicons name="water" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sleep"
        options={{
          title: 'Giấc ngủ',
          tabBarIcon: ({ color }) => <Ionicons name="moon" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="weight"
        options={{
          title: 'Cân nặng',
          tabBarIcon: ({ color }) => <Ionicons name="scale" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Hồ sơ',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
