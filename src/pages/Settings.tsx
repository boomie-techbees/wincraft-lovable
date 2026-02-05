import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Check } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Settings = () => {
  const { settings, isLoading, updateSettings } = useSettings();
  const [name, setName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setName(settings.name);
    }
  }, [settings.name, isLoading]);

  useEffect(() => {
    setHasChanges(name !== settings.name);
  }, [name, settings.name]);

  const handleSave = () => {
    const success = updateSettings({ name: name.trim() });
    if (success) {
      toast.success('Settings saved!');
      setHasChanges(false);
    } else {
      toast.error('Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Settings
          </h1>
        </div>
        <p className="text-muted-foreground">
          Personalize your Wins Journal
        </p>
      </header>

      <main className="space-y-6 animate-fade-in">
        <div className="card-elevated">
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="input-field"
            maxLength={50}
          />
          <p className="text-xs text-muted-foreground mt-2">
            We'll use this to greet you on the entry page.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className="btn-primary w-full"
        >
          <Check className="w-4 h-4 mr-2" />
          Save Settings
        </Button>

        {/* Info section */}
        <div className="card-elevated bg-secondary/30 mt-8">
          <h3 className="font-semibold text-foreground mb-2">About Wins Journal</h3>
          <p className="text-sm text-muted-foreground">
            Keep track of your daily wins, big or small. Your data is stored locally on this device.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
