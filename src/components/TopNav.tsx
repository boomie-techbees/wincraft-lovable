import { NavLink } from 'react-router-dom';
import { PenLine, List, Settings, Trophy } from 'lucide-react';

const navItems = [
  { to: '/', icon: PenLine, label: 'Add Win' },
  { to: '/wins', icon: List, label: 'My Wins' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function TopNav() {
  return (
    <nav className="hidden md:block bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <span className="font-display font-bold text-lg text-foreground">Wins Journal</span>
        </div>
        <div className="flex items-center gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
