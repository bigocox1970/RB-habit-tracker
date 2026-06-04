import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabits } from '@/hooks/useHabits';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const { habits, logs, getStreak } = useHabits();

  const totalCompletions = logs.length;
  const activeStreaks = habits.filter((h) => getStreak(h.id) > 0).length;
  const longestCurrentStreak = habits.reduce(
    (max, h) => Math.max(max, getStreak(h.id)),
    0,
  );

  const handleReset = () => {
    Alert.alert(
      'Reset all data',
      'This will permanently delete all habits and logs. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset everything',
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
        <Text style={styles.cardTitle}>Your progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxMiddle]}>
            <Text style={styles.statValue}>{totalCompletions}</Text>
            <Text style={styles.statLabel}>Completions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{longestCurrentStreak}</Text>
            <Text style={styles.statLabel}>Best streak</Text>
          </View>
        </View>
        {activeStreaks > 0 && (
          <View style={styles.activeBanner}>
            <Text style={styles.activeBannerText}>
              🔥 {activeStreaks} active streak{activeStreaks > 1 ? 's' : ''} — keep going!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Data</Text>
        <TouchableOpacity style={styles.dangerRow} onPress={handleReset}>
          <Text style={styles.dangerRowText}>Reset all data</Text>
          <Text style={styles.dangerRowHint}>Deletes habits & logs permanently</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBoxMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  activeBanner: {
    marginTop: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  activeBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  section: { marginBottom: 16 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  dangerRow: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerRowText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.error,
  },
  dangerRowHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },
});
