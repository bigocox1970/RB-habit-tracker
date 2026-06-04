import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabits } from '@/hooks/useHabits';
import { Colors } from '@/constants/Colors';
import { Habit } from '@/types/habit';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function motivationalMessage(done: number, total: number): string {
  if (total === 0) return 'Add your first habit below';
  if (done === 0) return "Let's go — start your day strong";
  if (done === total) return 'Perfect day! All habits complete';
  if (done / total >= 0.5) return 'More than halfway there!';
  return `${total - done} habit${total - done > 1 ? 's' : ''} left today`;
}

export default function TodayScreen() {
  const { habits, isCompleted, toggleHabit } = useHabits();
  const today = todayStr();

  const completedCount = useMemo(
    () => habits.filter((h) => isCompleted(h.id, today)).length,
    [habits, isCompleted, today],
  );

  const pct = habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);

  const renderItem = ({ item }: { item: Habit }) => {
    const done = isCompleted(item.id, today);
    return (
      <TouchableOpacity
        style={[styles.habitRow, done && styles.habitRowDone]}
        onPress={() => toggleHabit(item.id, today)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={done ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={done ? Colors.primary : Colors.inactive}
          style={{ marginRight: 14 }}
        />
        <Text style={styles.habitEmoji}>{item.emoji}</Text>
        <Text style={[styles.habitName, done && styles.habitNameDone]}>{item.name}</Text>
        {done && (
          <Text style={styles.doneBadge}>Done</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.dateLabel}>
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </Text>
          <Text style={styles.motivational}>{motivationalMessage(completedCount, habits.length)}</Text>
        </View>
        {habits.length > 0 && (
          <View style={styles.pctBadge}>
            <Text style={styles.pctText}>{pct}%</Text>
          </View>
        )}
      </View>

      {habits.length > 0 && (
        <View style={styles.progressBarWrap}>
          <View style={[styles.progressBarFill, { width: `${pct}%` as any }]} />
        </View>
      )}

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="add-circle-outline" size={64} color={Colors.primaryLight} />
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptyHint}>Tap the Habits tab to add your first one</Text>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flex: 1, paddingRight: 16 },
  dateLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 4 },
  motivational: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  pctBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  pctText: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark },
  progressBarWrap: {
    height: 4,
    backgroundColor: Colors.primaryLight,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Colors.primary,
  },
  list: { padding: 16 },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  habitRowDone: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  habitEmoji: { fontSize: 24, marginRight: 12 },
  habitName: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  habitNameDone: { color: Colors.primaryDark },
  doneBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginTop: 16, marginBottom: 8 },
  emptyHint: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
