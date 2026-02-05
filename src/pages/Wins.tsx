import { useState } from 'react';
import { List, Sparkles, FileText, Trophy } from 'lucide-react';
import { useWins } from '@/hooks/useWins';
import { WinCard } from '@/components/WinCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type ViewMode = 'list' | 'ai-summary' | 'resume';

const Wins = () => {
  const { wins, isLoading, deleteWin } = useWins();
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const handleDelete = (id: string) => {
    const success = deleteWin(id);
    if (success) {
      toast.success('Win deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-muted-foreground">Loading your wins...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-display font-bold text-foreground mb-1">
          My Wins
        </h1>
        <p className="text-muted-foreground">
          {wins.length} {wins.length === 1 ? 'win' : 'wins'} recorded
        </p>
      </header>

      {/* View mode tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('list')}
          className="flex-shrink-0"
        >
          <List className="w-4 h-4 mr-1.5" />
          List
        </Button>
        <Button
          variant={viewMode === 'ai-summary' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('ai-summary')}
          className="flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          AI Summary
        </Button>
        <Button
          variant={viewMode === 'resume' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('resume')}
          className="flex-shrink-0"
        >
          <FileText className="w-4 h-4 mr-1.5" />
          Resume Bullets
        </Button>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {wins.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Trophy className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No wins yet!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Go celebrate something amazing ✨
              </p>
            </div>
          ) : (
            wins.map(win => (
              <WinCard key={win.id} win={win} onDelete={handleDelete} />
            ))
          )}
        </div>
      )}

      {viewMode === 'ai-summary' && (
        <div className="card-elevated text-center py-8 animate-fade-in">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">AI Summary</h3>
          <p className="text-muted-foreground text-sm">
            Coming soon! This feature will generate an AI-powered summary of your wins.
          </p>
        </div>
      )}

      {viewMode === 'resume' && (
        <div className="card-elevated text-center py-8 animate-fade-in">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Resume Bullets</h3>
          <p className="text-muted-foreground text-sm">
            Coming soon! This feature will convert your wins into professional resume bullet points.
          </p>
        </div>
      )}
    </div>
  );
};

export default Wins;
