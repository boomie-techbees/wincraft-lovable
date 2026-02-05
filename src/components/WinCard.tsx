import { format } from 'date-fns';
import { Trophy, Trash2 } from 'lucide-react';
import { Win } from '@/types/win';
import { Button } from '@/components/ui/button';

interface WinCardProps {
  win: Win;
  onDelete?: (id: string) => void;
}

export function WinCard({ win, onDelete }: WinCardProps) {
  const formattedDate = format(new Date(win.createdAt), 'MMM d, yyyy');
  const formattedTime = format(new Date(win.createdAt), 'h:mm a');

  return (
    <div className="card-elevated animate-fade-in group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Trophy className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-foreground leading-relaxed">{win.content}</p>
          
          {win.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {win.tags.map(tag => (
                <span key={tag} className="tag-badge text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-muted-foreground">
              {formattedDate} at {formattedTime}
            </p>
            
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(win.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
