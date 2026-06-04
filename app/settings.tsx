import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabits } from '@/hooks/useHabits';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const { habits, logs, getStreak } = useHabits();
  const activeStreaks = habits.filter((h) => getStreak(h.id) > 0).length;
  const best = habits.reduce((max, h) => Math.max(max, getStreak(h.id)), 0);

  const handleReset = () => {
    Alert.alert('Reset all data', 'Permanently deletes all habits and logs. Cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset everything', style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('habit-data');
          Alert.alert('Done', 'All data cleared. Restart the app to see changes.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Your progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="list" size={22} color={Colors.primary} />
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxBorder]}>
            <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
            <Text style={styles.statValue}>{logs.length}</Text>
            <Text style={styles.statLabel}>Completions</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="flame" size={22} color={Colors.primary} />
            <Text style={styles.statValue}>{best}</Text>
            <Text style={styles.statLabel}>Best streak</Text>
          </View>
        </View>
        {activeStreaks > 0 && (
          <View style={styles.activeBanner}>
            <Ionicons name="flame" size={16} color={Colors.primaryDark} />
            <Text style={styles.activeBannerText}>
              {activeStreaks} active streak{activeStreaks > 1 ? 's' : ''} — keep going!
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionLabel}>DATA</Text>
      <TouchableOpacity style={styles.dangerRow} onPress={handleReset}>
        <Ionicons name="trash-outline" size={20} color={Colors.error} style={{ marginRight: 12 }} />
        <View>
          <Text style={styles.dangerRowText}>Reset all data</Text>
          <Text style={styles.dangerRowHint}>Deletes habits & logs permanently</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  statsCard: {
    backgroundColor: Colors.surface, borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 24,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  statsGrid: { flexDirection: 'row' },
  statBox: { flex: 1, alignItems: 'center', gap: 4 },
  statBoxBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: 26, fontWeight: '800', color: Colors.primaryDark },
  statLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  activeBanner: {
    marginTop: 16, backgroundColor: Colors.primaryLight, borderRadius: 10,
    padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  activeBannerText: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    letterSpacing: 1, marginBottom: 8, paddingLeft: 4,
  },
  dangerRow: {
    backgroundColor: Colors.surface, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: '#FECACA',
    flexDirection: 'row', alignItems: 'center',
  },
  dangerRowText: { fontSize: 15, fontWeight: '600', color: Colors.error },
  dangerRowHint: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});
