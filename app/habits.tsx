import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        <Text style={styles.addTitle}>New habit</Text>
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
          <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.addBtnText}>Add Habit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>MY HABITS {habits.length > 0 && `(${habits.length})`}</Text>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitRow}>
            <View style={styles.emojiCircle}>
              <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
            </View>
            <Text style={styles.habitName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDelete(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="trash-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="list-outline" size={48} color={Colors.primaryLight} />
            <Text style={styles.emptyText}>No habits yet — add one above</Text>
          </View>
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  addCard: {
    backgroundColor: Colors.surface, margin: 16, borderRadius: 16,
    padding: 16, borderWidth: 1, borderColor: Colors.border,
  },
  addTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 12,
    paddingHorizontal: 12, backgroundColor: Colors.background, marginBottom: 12,
  },
  selectedEmoji: { fontSize: 22, marginRight: 8 },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: Colors.textPrimary },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  emojiBtn: {
    width: 42, height: 42, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.background, borderWidth: 1.5, borderColor: 'transparent',
  },
  emojiBtnSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  emojiText: { fontSize: 22 },
  addBtn: {
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 13,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  addBtnDisabled: { backgroundColor: Colors.inactive },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionHeader: {
    fontSize: 11, fontWeight: '700', color: Colors.textSecondary,
    letterSpacing: 1, paddingHorizontal: 16, paddingBottom: 8,
  },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  habitRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: 14,
    padding: 14, borderWidth: 1, borderColor: Colors.border,
  },
  emojiCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  habitName: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  empty: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },
});
