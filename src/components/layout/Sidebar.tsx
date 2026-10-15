import React, { useState } from 'react';
import { 
  Home, 
  PenTool, 
  CheckSquare, 
  LayoutTemplate, 
  MailCheck, 
  PanelLeftClose,
  PanelLeftOpen,
  Circle
} from 'lucide-react';
import { ViewMode } from '@/types';
import { NamdaphaLogo } from '../common/NamdaphaLogo';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  draftCount?: number;
  templateCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  draftCount,
  templateCount,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      id: 'home' as ViewMode,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'canvas' as ViewMode,
      label: 'Canvas Studio',
      icon: PenTool,
    },
    {
      id: 'tasks' as ViewMode,
      label: 'Tasks',
      icon: CheckSquare,
    },
    {
      id: 'templates' as ViewMode,
      label: 'Templates',
      icon: LayoutTemplate,
      count: templateCount,
    },
    {
      id: 'sent' as ViewMode,
      label: 'Mails Sent',
      icon: MailCheck,
    },
  ];

  return (
    <aside
      className={`h-screen bg-[#111113] border-r border-zinc-800/80 flex flex-col justify-between select-none relative z-20 flex-shrink-0 transition-[width] duration-200 ease-out overflow-hidden ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Top Branding & Curtain Collapse Toggle */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-800/80">
          {!isCollapsed && <NamdaphaLogo size="md" />}
          {isCollapsed && (
            <div className="mx-auto">
              <NamdaphaLogo size="md" showText={false} />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-auto focus:outline-none"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle navigation"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4.5 h-4.5 text-zinc-400 hover:text-white" />
            ) : (
              <PanelLeftClose className="w-4.5 h-4.5 text-zinc-400 hover:text-white" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2.5'
                } rounded-lg text-sm transition-colors group relative ${
                  isActive
                    ? 'bg-zinc-800 text-white font-medium border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon
                    className={`w-4.5 h-4.5 transition-colors ${
                      isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="tracking-tight text-sm font-medium">{item.label}</span>
                  )}
                </div>

                {!isCollapsed && item.count !== undefined && item.count > 0 && (
                  <span className="text-xs font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User / Hostel Indicator */}
      <div className="p-3.5 border-t border-zinc-800/80">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 px-2.5 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-sm">
            <div className="w-7 h-7 rounded-md bg-zinc-800 flex items-center justify-center font-semibold text-zinc-200 text-xs font-mono">
              N
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-zinc-200 truncate">Namdapha House</div>
              <div className="text-xs text-zinc-400 font-mono truncate">Council Studio</div>
            </div>
            <Circle className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400 flex-shrink-0" />
          </div>
        ) : (
          <div className="flex justify-center">
            <Circle className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
