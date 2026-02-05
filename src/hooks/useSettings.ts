import { useState, useEffect } from 'react';
import { UserSettings } from '@/types/win';

const SETTINGS_STORAGE_KEY = 'wins-journal-settings';

const defaultSettings: UserSettings = {
  name: '',
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      setSettings(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>): boolean => {
    try {
      const updated = { ...settings, ...newSettings };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      setSettings(updated);
      return true;
    } catch {
      return false;
    }
  };

  return { settings, isLoading, updateSettings };
}
