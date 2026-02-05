import { useState } from 'react';
import { List, Sparkles, FileText, Trophy, Loader2, Copy, Check } from 'lucide-react';
import { useWins } from '@/hooks/useWins';
import { WinCard } from '@/components/WinCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

type ViewMode = 'list' | 'ai-summary' | 'resume';

const Wins = () => {
  const { wins, isLoading, deleteWin } = useWins();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [aiContent, setAiContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = (id: string) => {
    const success = deleteWin(id);
    if (success) {
      toast.success('Win deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  const generateAIContent = async (type: 'summary' | 'resume') => {
    if (wins.length === 0) {
      toast.error('Add some wins first!');
      return;
    }

    setIsGenerating(true);
    setAiContent('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ai-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ wins, type }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 429) {
          toast.error('Rate limit reached. Please try again later.');
        } else if (response.status === 402) {
          toast.error('Usage limit reached. Please add credits.');
        } else {
          toast.error(error.error || 'Failed to generate content');
        }
        return;
      }

      const data = await response.json();
      setAiContent(data.content);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to connect to AI service');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'ai-summary') {
      generateAIContent('summary');
    } else if (mode === 'resume') {
      generateAIContent('resume');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(aiContent);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
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
          onClick={() => handleViewModeChange('list')}
          className="flex-shrink-0"
        >
          <List className="w-4 h-4 mr-1.5" />
          List
        </Button>
        <Button
          variant={viewMode === 'ai-summary' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewModeChange('ai-summary')}
          className="flex-shrink-0"
          disabled={wins.length === 0}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          AI Summary
        </Button>
        <Button
          variant={viewMode === 'resume' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewModeChange('resume')}
          className="flex-shrink-0"
          disabled={wins.length === 0}
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
        <div className="card-elevated animate-fade-in">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Analyzing your wins...</p>
            </div>
          ) : aiContent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI Summary
                </h3>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ReactMarkdown>{aiContent}</ReactMarkdown>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAIContent('summary')}
                className="mt-4"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Regenerate
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Click the button above to generate a summary</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'resume' && (
        <div className="card-elevated animate-fade-in">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Crafting resume bullets...</p>
            </div>
          ) : aiContent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Resume Bullets
                </h3>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                <ReactMarkdown>{aiContent}</ReactMarkdown>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAIContent('resume')}
                className="mt-4"
              >
                <FileText className="w-4 h-4 mr-1.5" />
                Regenerate
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Click the button above to generate resume bullets</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Wins;
