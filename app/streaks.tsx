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
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(undefined, {
    weekday: 'narrow',
  });
}

function streakEmoji(streak: number): string {
  if (streak === 0) return '💤';
  if (streak < 3) return '🌱';
  if (streak < 7) return '🔥';
  if (streak < 14) return '⚡';
  return '🏆';
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
            <Text style={styles.habitEmoji}>{item.emoji}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.habitName}>{item.name}</Text>
            <Text style={styles.longestText}>Best: {longest} day{longest !== 1 ? 's' : ''}</Text>
          </View>
          <View style={[styles.streakBadge, isActive && styles.streakBadgeActive]}>
            <Text style={styles.streakEmoji}>{streakEmoji(streak)}</Text>
            <Text style={[styles.streakCount, isActive && styles.streakCountActive]}>
              {streak}
            </Text>
            <Text style={[styles.streakUnit, isActive && styles.streakUnitActive]}>
              {streak === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>

        <View style={styles.weekRow}>
          {days.map((d, i) => {
            const done = isCompleted(item.id, d);
            const isToday = i === 6;
            return (
              <View key={d} style={styles.dayCell}>
                <View
                  style={[
                    styles.dot,
                    done ? styles.dotDone : styles.dotEmpty,
                    isToday && !done && styles.dotToday,
                  ]}
                >
                  {done && <Text style={styles.dotCheck}>✓</Text>}
                </View>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                  {dayLabel(d)}
                </Text>
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
          <Text style={styles.emptyEmoji}>🔥</Text>
          <Text style={styles.emptyTitle}>No streaks yet</Text>
          <Text style={styles.emptyHint}>Add habits and check them off daily to build streaks</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <Text style={styles.sectionHeader}>Sorted by current streak</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  list: { padding: 16, paddingTop: 8 },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emojiCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitEmoji: { fontSize: 24 },
  nameBlock: { flex: 1 },
  habitName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  longestText: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakBadgeActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  streakEmoji: { fontSize: 18, marginBottom: 1 },
  streakCount: { fontSize: 20, fontWeight: '800', color: Colors.textSecondary },
  streakCountActive: { color: Colors.primaryDark },
  streakUnit: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500' },
  streakUnitActive: { color: Colors.primary },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCell: { alignItems: 'center', flex: 1 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: { backgroundColor: Colors.primary },
  dotEmpty: { backgroundColor: Colors.inactive },
  dotToday: { backgroundColor: Colors.primaryLight, borderWidth: 2, borderColor: Colors.primary },
  dotCheck: { color: '#fff', fontSize: 14, fontWeight: '800' },
  dayLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  dayLabelToday: { color: Colors.primary, fontWeight: '700' },
  separator: { height: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  emptyHint: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
