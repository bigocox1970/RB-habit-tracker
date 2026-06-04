import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitLog, HabitContextValue } from '@/types/habit';

const STORAGE_KEY = 'habit-data';

export const HabitContext = createContext<HabitContextValue | undefined>(undefined);

function toDateString(ts: number): string {
  return new Date(ts).toISOString().split('T')[0];
}

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          if (Array.isArray(data.habits)) setHabits(data.habits);
          if (Array.isArray(data.logs)) setLogs(data.logs);
        }
      } catch (e) {
        console.error('Failed to load habit data', e);
      } finally {
        isInitialLoad.current = false;
      }
    })();
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, logs })).catch(
      (e) => console.error('Failed to save habit data', e),
    );
  }, [habits, logs]);

  const addHabit = useCallback((name: string, emoji: string) => {
    const newHabit: Habit = { id: crypto.randomUUID(), name, emoji, createdAt: Date.now() };
    setHabits((prev) => [...prev, newHabit]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setLogs((prev) => prev.filter((l) => l.habitId !== id));
  }, []);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setLogs((prev) => {
      const exists = prev.find((l) => l.habitId === habitId && l.date === date);
      if (exists) return prev.filter((l) => !(l.habitId === habitId && l.date === date));
      return [...prev, { id: crypto.randomUUID(), habitId, date }];
    });
  }, []);

  const isCompleted = useCallback(
    (habitId: string, date: string) => logs.some((l) => l.habitId === habitId && l.date === date),
    [logs],
  );

  const getStreak = useCallback(
    (habitId: string): number => {
      const today = toDateString(Date.now());
      let streak = 0;
      let current = new Date();
      while (true) {
        const dateStr = toDateString(current.getTime());
        if (!logs.some((l) => l.habitId === habitId && l.date === dateStr)) {
          if (dateStr === today) {
            // today not yet done — don't break streak, just don't count it
            current.setDate(current.getDate() - 1);
            continue;
          }
          break;
        }
        streak++;
        current.setDate(current.getDate() - 1);
        if (streak > 3650) break; // safety cap
      }
      return streak;
    },
    [logs],
  );

  const getLongestStreak = useCallback(
    (habitId: string): number => {
      const dates = logs
        .filter((l) => l.habitId === habitId)
        .map((l) => l.date)
        .sort();
      if (!dates.length) return 0;
      let longest = 1;
      let current = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (curr.getTime() - prev.getTime()) / 86400000;
        if (diff === 1) {
          current++;
          if (current > longest) longest = current;
        } else if (diff > 1) {
          current = 1;
        }
      }
      return longest;
    },
    [logs],
  );

  const value: HabitContextValue = { habits, logs, addHabit, deleteHabit, toggleHabit, isCompleted, getStreak, getLongestStreak };

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};
