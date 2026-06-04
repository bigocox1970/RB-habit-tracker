import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useHabits } from '@/hooks/useHabits';
import { Colors } from '@/constants/Colors';
import { Habit } from '@/types/habit';

function last7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function dayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(undefined, { weekday: 'narrow' });
}

export default function StreaksScreen() {
  const { habits, isCompleted, getStreak, getLongestStreak } = useHabits();
  const days = useMemo(() => last7Days(), []);

  const renderItem = ({ item }: { item: Habit }) => {
    const streak = getStreak(item.id);
    const longest = getLongestStreak(item.id);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.habitEmoji}>{item.emoji}</Text>
          <Text style={styles.habitName}>{item.name}</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakCount}>{streak}</Text>
          </View>
        </View>
        <View style={styles.weekRow}>
          {days.map((d) => {
            const done = isCompleted(item.id, d);
            return (
              <View key={d} style={styles.dayCell}>
                <View style={[styles.dot, done ? styles.dotDone : styles.dotEmpty]} />
                <Text style={styles.dayLabel}>{dayLabel(d)}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.longestText}>Longest streak: {longest} day{longest !== 1 ? 's' : ''}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔥</Text>
          <Text style={styles.emptyText}>No habits yet</Text>
          <Text style={styles.emptyHint}>Add habits to start building streaks</Text>
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
  list: { padding: 16 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  habitEmoji: { fontSize: 24, marginRight: 10 },
  habitName: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakFire: { fontSize: 16, marginRight: 4 },
  streakCount: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dayCell: { alignItems: 'center', flex: 1 },
  dot: { width: 28, height: 28, borderRadius: 14, marginBottom: 4 },
  dotDone: { backgroundColor: Colors.primary },
  dotEmpty: { backgroundColor: Colors.inactive },
  dayLabel: { fontSize: 11, color: Colors.textSecondary },
  longestText: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },
  separator: { height: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  emptyHint: { fontSize: 14, color: Colors.textSecondary, marginTop: 6, textAlign: 'center' },
});
