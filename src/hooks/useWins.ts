import { useState, useEffect } from 'react';
import { Win } from '@/types/win';

const WINS_STORAGE_KEY = 'wins-journal-wins';

export function useWins() {
  const [wins, setWins] = useState<Win[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(WINS_STORAGE_KEY);
    if (stored) {
      setWins(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const saveWin = (content: string, tags: string[]): boolean => {
    try {
      const newWin: Win = {
        id: crypto.randomUUID(),
        content,
        tags,
        createdAt: new Date().toISOString(),
      };
      const updatedWins = [newWin, ...wins];
      localStorage.setItem(WINS_STORAGE_KEY, JSON.stringify(updatedWins));
      setWins(updatedWins);
      return true;
    } catch {
      return false;
    }
  };

  const deleteWin = (id: string): boolean => {
    try {
      const updatedWins = wins.filter(win => win.id !== id);
      localStorage.setItem(WINS_STORAGE_KEY, JSON.stringify(updatedWins));
      setWins(updatedWins);
      return true;
    } catch {
      return false;
    }
  };

  return { wins, isLoading, saveWin, deleteWin };
}
