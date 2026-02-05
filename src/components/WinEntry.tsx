import { useState, useCallback } from 'react';
import { Check, Sparkles, X, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface SpellingSuggestion {
  original: string;
  suggestion: string;
  index: number;
}

interface WinEntryProps {
  onSave: (content: string, tags: string[]) => boolean;
}

// Simple spell-check suggestions (in production, use a proper API)
const commonMisspellings: Record<string, string> = {
  'teh': 'the',
  'recieve': 'receive',
  'occured': 'occurred',
  'seperate': 'separate',
  'definately': 'definitely',
  'accomodate': 'accommodate',
  'untill': 'until',
  'occassion': 'occasion',
  'sucessful': 'successful',
  'acheive': 'achieve',
  'beleive': 'believe',
  'neccessary': 'necessary',
  'occurence': 'occurrence',
  'recomend': 'recommend',
};

function checkSpelling(text: string): SpellingSuggestion[] {
  const suggestions: SpellingSuggestion[] = [];
  const words = text.toLowerCase().split(/\s+/);
  
  words.forEach((word, idx) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (commonMisspellings[cleanWord]) {
      suggestions.push({
        original: cleanWord,
        suggestion: commonMisspellings[cleanWord],
        index: idx,
      });
    }
  });
  
  return suggestions;
}

export function WinEntry({ onSave }: WinEntryProps) {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState<SpellingSuggestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Check for spelling suggestions
    if (newContent.length > 3) {
      const newSuggestions = checkSpelling(newContent);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, []);

  const addTag = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed) && tags.length < 5) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  }, [tags]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  const handleSave = useCallback(() => {
    if (!content.trim()) {
      toast.error('Please enter your win first!');
      return;
    }

    setIsSaving(true);
    
    // Simulate a slight delay for feedback
    setTimeout(() => {
      const success = onSave(content.trim(), tags);
      setIsSaving(false);
      
      if (success) {
        setShowSuccess(true);
        setContent('');
        setTags([]);
        setSuggestions([]);
        
        setTimeout(() => setShowSuccess(false), 2000);
        toast.success('Win saved! 🎉');
      } else {
        toast.error('Failed to save. Please try again.');
      }
    }, 300);
  }, [content, tags, onSave]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main textarea */}
      <div className="relative">
        <Textarea
          value={content}
          onChange={handleContentChange}
          placeholder="What's your win today? Remember, no win is too small..."
          className="input-field min-h-[160px] text-lg resize-none"
          disabled={isSaving}
        />
        
        {showSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/90 rounded-lg animate-scale-in">
            <div className="flex items-center gap-2 text-success font-semibold">
              <Check className="w-6 h-6" />
              <span>Saved!</span>
            </div>
          </div>
        )}
      </div>

      {/* Spelling suggestions */}
      {suggestions.length > 0 && (
        <div className="card-elevated bg-secondary/50 animate-fade-in">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Spelling suggestions:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {suggestions.map((s, i) => (
                  <li key={i}>
                    "{s.original}" → "{s.suggestion}"
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Your original text will be saved as-is.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tags section */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground">
          Tags (optional)
        </label>
        
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="tag-badge animate-scale-in">
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-1.5 hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {tags.length < 5 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag..."
              className="input-field flex-1 text-sm"
              maxLength={20}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addTag}
              disabled={!tagInput.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Save button */}
      <Button
        onClick={handleSave}
        disabled={!content.trim() || isSaving}
        className="btn-primary w-full text-lg"
      >
        {isSaving ? (
          'Saving...'
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Save My Win
          </>
        )}
      </Button>
    </div>
  );
}
