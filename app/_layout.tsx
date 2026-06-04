import '@/lib/crypto-polyfill';
import React from 'react';
import { Tabs } from 'expo-router';
import { CheckCircle, List, Flame, Settings } from 'lucide-react-native';
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
            tabBarIcon: ({ color, size }) => <CheckCircle size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Habits',
            tabBarIcon: ({ color, size }) => <List size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="streaks"
          options={{
            title: 'Streaks',
            tabBarIcon: ({ color, size }) => <Flame size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}
        />
      </Tabs>
    </HabitProvider>
  );
}
