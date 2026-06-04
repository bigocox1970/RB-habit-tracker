import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const sorted = useMemo(
    () => [...habits].sort((a, b) => getStreak(b.id) - getStreak(a.id)),
    [habits, getStreak],
  );

  const renderItem = ({ item }: { item: Habit }) => {
    const streak = getStreak(item.id);
    const longest = getLongestStreak(item.id);
    const isActive = streak > 0;

    return (
      <View style={[styles.card, isActive && styles.cardActive]}>
        <View style={styles.cardHeader}>
          <View style={styles.emojiCircle}>
            <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.longestText}>Best: {longest} day{longest !== 1 ? 's' : ''}</Text>
          </View>
          <View style={[styles.streakBadge, isActive && styles.streakBadgeActive]}>
            <Ionicons name="flame" size={18} color={isActive ? Colors.primary : Colors.inactive} />
            <Text style={[styles.streakCount, isActive && styles.streakCountActive]}>{streak}</Text>
          </View>
        </View>

        <View style={styles.weekRow}>
          {days.map((d, i) => {
            const done = isCompleted(item.id, d);
            const isToday = i === 6;
            return (
              <View key={d} style={styles.dayCell}>
                <View style={[styles.dot, done ? styles.dotDone : styles.dotEmpty, isToday && !done && styles.dotToday]}>
                  {done && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{dayLabel(d)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="flame-outline" size={64} color={Colors.primaryLight} />
          <Text style={styles.emptyTitle}>No streaks yet</Text>
          <Text style={styles.emptyHint}>Check off habits daily to build streaks</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16 },
  card: {
    backgroundColor: Colors.surface, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  cardActive: { borderColor: Colors.primary },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  emojiCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  nameBlock: { flex: 1 },
  habitName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  longestText: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  streakBadge: {
    alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  streakBadgeActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  streakCount: { fontSize: 20, fontWeight: '800', color: Colors.textSecondary, marginTop: 2 },
  streakCountActive: { color: Colors.primaryDark },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCell: { alignItems: 'center', flex: 1 },
  dot: {
    width: 32, height: 32, borderRadius: 16, marginBottom: 4,
    alignItems: 'center', justifyContent: 'center',
  },
  dotDone: { backgroundColor: Colors.primary },
  dotEmpty: { backgroundColor: Colors.inactive },
  dotToday: { backgroundColor: Colors.primaryLight, borderWidth: 2, borderColor: Colors.primary },
  dayLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  dayLabelToday: { color: Colors.primary, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  emptyHint: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
});
