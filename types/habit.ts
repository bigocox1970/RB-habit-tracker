export interface Habit {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
}

export interface HabitContextValue {
  habits: Habit[];
  logs: HabitLog[];
  addHabit: (name: string, emoji: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (habitId: string, date: string) => void;
  isCompleted: (habitId: string, date: string) => boolean;
  getStreak: (habitId: string) => number;
  getLongestStreak: (habitId: string) => number;
}
