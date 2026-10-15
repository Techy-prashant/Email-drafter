import React from 'react';
import { 
  X, 
  Home, 
  PenTool, 
  LayoutTemplate, 
  CheckSquare, 
  MailCheck,
  Plus
} from 'lucide-react';
import { ViewMode } from '@/types';
import { NamdaphaLogo } from '../common/NamdaphaLogo';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const navItems = [
    { id: 'home' as ViewMode, label: 'Home Dashboard', icon: Home },
    { id: 'canvas' as ViewMode, label: 'Canvas Studio', icon: PenTool },
    { id: 'tasks' as ViewMode, label: 'Tasks & Schedule', icon: CheckSquare },
    { id: 'templates' as ViewMode, label: 'Template Library', icon: LayoutTemplate },
    { id: 'sent' as ViewMode, label: 'Mails Sent', icon: MailCheck },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-[#111113] border-r border-zinc-800 p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <NamdaphaLogo size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white border border-zinc-700/60 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Compose Button */}
        <div className="pt-4 border-t border-zinc-800">
          <button
            onClick={() => {
              onNavigate('canvas');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white text-zinc-950 font-semibold text-xs shadow-sm hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Broadcast Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
