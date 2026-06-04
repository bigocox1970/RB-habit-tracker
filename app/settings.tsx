import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabits } from '@/hooks/useHabits';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const { habits, logs } = useHabits();

  const handleReset = () => {
    Alert.alert(
      'Reset all data',
      'This will delete all habits and logs. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('habit-data');
            Alert.alert('Done', 'All data cleared. Restart the app to see changes.');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Habits tracked</Text>
          <Text style={styles.statValue}>{habits.length}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total completions</Text>
          <Text style={styles.statValue}>{logs.length}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
        <Text style={styles.resetBtnText}>🗑 Reset all data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  statsTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statLabel: { fontSize: 15, color: Colors.textSecondary },
  statValue: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  resetBtn: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  resetBtnText: { color: Colors.error, fontWeight: '700', fontSize: 15 },
});
