import { Trophy } from 'lucide-react';
import { WinEntry } from '@/components/WinEntry';
import { useWins } from '@/hooks/useWins';
import { useSettings } from '@/hooks/useSettings';

const Index = () => {
  const { saveWin } = useWins();
  const { settings } = useSettings();

  const greeting = settings.name 
    ? `Hey ${settings.name}! 👋` 
    : 'Welcome! 👋';

  return (
    <div className="page-container">
      <header className="text-center mb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          {greeting}
        </h1>
        <p className="text-muted-foreground text-lg">
          What win do you want to celebrate today?
        </p>
        <p className="text-sm text-muted-foreground mt-2 italic">
          Remember: no win is too small ✨
        </p>
      </header>

      <main>
        <WinEntry onSave={saveWin} />
      </main>
    </div>
  );
};

export default Index;
