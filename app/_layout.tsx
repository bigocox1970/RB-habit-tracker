import '@/lib/crypto-polyfill';
import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { HabitProvider } from '@/context/HabitContext';

export default function RootLayout() {
  return (
    <HabitProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#10B981',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#E5E7EB' },
          headerStyle: { backgroundColor: '#10B981' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Today',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✅</Text>,
          }}
        />
        <Tabs.Screen
          name="habits"
          options={{
            title: 'Habits',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
          }}
        />
        <Tabs.Screen
          name="streaks"
          options={{
            title: 'Streaks',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🔥</Text>,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text>,
          }}
        />
      </Tabs>
    </HabitProvider>
  );
}
