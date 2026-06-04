import '@/lib/crypto-polyfill';
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HabitProvider } from '@/context/HabitContext';

export default function RootLayout() {
  return (
    <HabitProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#F3F4F6' },
          headerStyle: { backgroundColor: '#10B981' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Habits',
            tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="streaks"
          options={{
            title: 'Streaks',
            tabBarIcon: ({ color, size }) => <Ionicons name="flame-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
          }}
        />
      </Tabs>
    </HabitProvider>
  );
}
