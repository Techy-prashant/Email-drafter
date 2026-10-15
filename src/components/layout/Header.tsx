import React from 'react';
import { Menu, Plus } from 'lucide-react';
import { ViewMode } from '@/types';
import { NamdaphaLogo } from '../common/NamdaphaLogo';

interface HeaderProps {
  currentView: ViewMode;
  onOpenMobileNav: () => void;
  onCreateEmail: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onOpenMobileNav,
  onCreateEmail,
}) => {
  const titles: Record<ViewMode, { title: string; subtitle: string }> = {
    home: {
      title: 'Namdapha Email Studio',
      subtitle: 'Official house broadcasts',
    },
    canvas: {
      title: 'Canvas Studio',
      subtitle: 'Visual HTML email editor',
    },
    tasks: {
      title: 'Tasks & Schedule',
      subtitle: 'Council deadlines & reminders',
    },
    templates: {
      title: 'Template Library',
      subtitle: 'Reusable layouts',
    },
    sent: {
      title: 'Mails Sent',
      subtitle: 'Dispatched broadcasts via Gmail',
    },
  };

  const { title, subtitle } = titles[currentView];

  return (
    <header className="h-14 px-4 sm:px-6 bg-[#161312] border-b border-[#2C221F] flex items-center justify-between sticky top-0 z-10 select-none">
      {/* Left Title and Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="md:hidden p-1.5 rounded-lg text-[#B6AD89] hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#F7F4EE] tracking-wide">
              {title}
            </span>
            <span className="text-[11px] text-[#7A7060] hidden md:inline">
              • {subtitle}
            </span>
          </div>
        </div>

        <div className="sm:hidden">
          <NamdaphaLogo size="sm" showText={false} />
        </div>
      </div>

      {/* Right Action Area */}
      <div className="flex items-center gap-3">
        {currentView !== 'canvas' && (
          <button
            onClick={onCreateEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C85A32] hover:bg-[#B34E2A] text-white text-xs font-medium tracking-wide shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Draft</span>
          </button>
        )}
      </div>
    </header>
  );
};
