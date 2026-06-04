import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { useHabits } from '@/hooks/useHabits';
import { Colors } from '@/constants/Colors';
import { Habit } from '@/types/habit';

const EMOJI_OPTIONS = [
  '💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '🎯',
  '✍️', '🎵', '🌿', '🧹', '💊', '🚴', '🧠', '🧗',
];

export default function HabitsScreen() {
  const { habits, addHabit, deleteHabit } = useHabits();
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💪');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addHabit(trimmed, selectedEmoji);
    setName('');
  };

  const handleDelete = (habit: Habit) => {
    Alert.alert('Delete habit', `Remove "${habit.name}"?\nAll logs will be deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addCard}>
        <Text style={styles.addTitle}>Add a habit</Text>
        <View style={styles.inputRow}>
          <Text style={styles.selectedEmoji}>{selectedEmoji}</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Go for a walk"
            placeholderTextColor={Colors.textSecondary}
            value={name}
            onChangeText={setName}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
          />
        </View>
        <View style={styles.emojiGrid}>
          {EMOJI_OPTIONS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              style={[styles.emojiBtn, selectedEmoji === emoji && styles.emojiBtnSelected]}
              onPress={() => setSelectedEmoji(emoji)}
            >
              <Text style={styles.emojiText}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.addBtn, !name.trim() && styles.addBtnDisabled]}
          onPress={handleAdd}
          disabled={!name.trim()}
        >
          <Text style={styles.addBtnText}>Add Habit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>
        Your habits {habits.length > 0 && <Text style={styles.count}>({habits.length})</Text>}
      </Text>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitRow}>
            <View style={styles.emojiCircle}>
              <Text style={styles.habitEmoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.habitName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.deleteBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>No habits yet — add one above</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  addCard: {
    backgroundColor: Colors.surface,
    margin: 16,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  addTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 14 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.background,
    marginBottom: 14,
  },
  selectedEmoji: { fontSize: 22, marginRight: 8 },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  emojiBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  emojiBtnSelected: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  emojiText: { fontSize: 22 },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnDisabled: {
    backgroundColor: Colors.inactive,
    shadowOpacity: 0,
    elevation: 0,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  count: { fontWeight: '400' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitEmoji: { fontSize: 22 },
  habitName: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  deleteBtn: { padding: 4 },
  deleteBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  separator: { height: 10 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },
});
