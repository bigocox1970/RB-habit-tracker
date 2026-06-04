import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useHabits } from '@/hooks/useHabits';
import { Colors } from '@/constants/Colors';
import { Habit } from '@/types/habit';

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function motivationalMessage(done: number, total: number): string {
  if (total === 0) return 'Add your first habit below';
  if (done === 0) return "Let's go — start your day strong 💪";
  if (done === total) return 'Perfect day! All habits done 🎉';
  if (done / total >= 0.5) return 'More than halfway there, keep going!';
  return `${total - done} habit${total - done > 1 ? 's' : ''} left today`;
}

function CircleProgress({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : done / total;
  const size = 110;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background ring */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: Colors.primaryLight,
        }}
      />
      {/* We fake the progress arc with a clipping trick using a simple percentage text —
          react-native-svg isn't in the template, so we use a visual approximation */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: Colors.primary,
          opacity: pct,
          transform: [{ rotate: '-90deg' }],
        }}
      />
      <Text style={styles.ringPercent}>{Math.round(pct * 100)}%</Text>
      <Text style={styles.ringLabel}>done</Text>
    </View>
  );
}

export default function TodayScreen() {
  const { habits, isCompleted, toggleHabit } = useHabits();
  const today = todayStr();
  const completedCount = useMemo(
    () => habits.filter((h) => isCompleted(h.id, today)).length,
    [habits, isCompleted, today],
  );

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

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
        {done && <Text style={styles.doneBadge}>Done</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <Text style={styles.motivational}>{motivationalMessage(completedCount, habits.length)}</Text>
          {habits.length > 0 && (
            <Text style={styles.countLabel}>
              {completedCount} / {habits.length} habits
            </Text>
          )}
        </View>
        {habits.length > 0 && (
          <CircleProgress done={completedCount} total={habits.length} />
        )}
      </View>

      {habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptyHint}>Tap the Habits tab to add your first one</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerText: { flex: 1, paddingRight: 16 },
  dateLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 4 },
  motivational: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  countLabel: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  ringPercent: { fontSize: 22, fontWeight: '800', color: Colors.primaryDark },
  ringLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  list: { padding: 16 },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  habitRowDone: {
    backgroundColor: '#F0FDF4',
    borderColor: Colors.primary,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '800' },
  habitEmoji: { fontSize: 26, marginRight: 12 },
  habitName: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, flex: 1 },
  habitNameDone: { color: Colors.primaryDark },
  doneBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  separator: { height: 10 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  emptyHint: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
