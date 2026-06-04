import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useHabits } from '@/hooks/useHabits';
import { Colors } from '@/constants/Colors';
import { Habit } from '@/types/habit';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export default function TodayScreen() {
  const { habits, isCompleted, toggleHabit } = useHabits();
  const today = todayStr();

  const completedCount = useMemo(
    () => habits.filter((h) => isCompleted(h.id, today)).length,
    [habits, isCompleted, today],
  );

  const renderItem = ({ item }: { item: Habit }) => {
    const done = isCompleted(item.id, today);
    return (
      <TouchableOpacity
        style={[styles.habitRow, done && styles.habitRowDone]}
        onPress={() => toggleHabit(item.id, today)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, done && styles.checkboxDone]}>
          {done && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.habitEmoji}>{item.emoji}</Text>
        <Text style={[styles.habitName, done && styles.habitNameDone]}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
        <Text style={styles.headerSub}>
          {completedCount} / {habits.length} done
        </Text>
        {habits.length > 0 && (
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${habits.length ? (completedCount / habits.length) * 100 : 0}%` },
              ]}
            />
          </View>
        )}
      </View>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📋</Text>
          <Text style={styles.emptyText}>No habits yet</Text>
          <Text style={styles.emptyHint}>Go to Habits to add your first one</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  progressBar: {
    height: 6,
    backgroundColor: Colors.primaryLight,
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3 },
  list: { padding: 16 },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  habitRowDone: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  habitEmoji: { fontSize: 24, marginRight: 12 },
  habitName: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  habitNameDone: { color: Colors.primaryDark },
  separator: { height: 10 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyHint: { fontSize: 14, color: Colors.textSecondary, marginTop: 6, textAlign: 'center' },
});
