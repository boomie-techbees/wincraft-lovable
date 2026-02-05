import { NavLink } from 'react-router-dom';
import { PenLine, List, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: PenLine, label: 'Add Win' },
  { to: '/wins', icon: List, label: 'My Wins' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-bottom">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
