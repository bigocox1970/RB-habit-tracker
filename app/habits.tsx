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

const EMOJI_OPTIONS = ['💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '🎯', '✍️', '🎵', '🌿', '🧹', '💊', '🚴', '🧠'];

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
    Alert.alert('Delete habit', `Remove "${habit.name}"? All logs will be deleted.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(habit.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addCard}>
        <Text style={styles.addTitle}>New Habit</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Go for a walk"
          placeholderTextColor={Colors.textSecondary}
          value={name}
          onChangeText={setName}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <View style={styles.emojiRow}>
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
          <Text style={styles.addBtnText}>➕ Add Habit</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.habitRow}>
            <Text style={styles.habitEmoji}>{item.emoji}</Text>
            <Text style={styles.habitName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
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
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    backgroundColor: Colors.background,
    marginBottom: 12,
  },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 },
  emojiBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emojiBtnSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  emojiText: { fontSize: 20 },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addBtnDisabled: { backgroundColor: Colors.inactive },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  habitEmoji: { fontSize: 24, marginRight: 12 },
  habitName: { flex: 1, fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  deleteBtn: { padding: 6 },
  deleteBtnText: { fontSize: 18 },
  separator: { height: 10 },
  empty: { alignItems: 'center', paddingVertical: 24 },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },
});
