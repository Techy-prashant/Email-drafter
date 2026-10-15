import React from 'react';
import { 
  Heading1, 
  AlignLeft, 
  Image as ImageIcon, 
  MousePointerClick, 
  Minus, 
  MoveVertical, 
  Columns, 
  Grid3X3,
  Quote,
  Share2,
  Tag,
  AlertCircle, 
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { BlockType } from '@/types';

interface ComponentPaletteProps {
  onAddBlock: (type: BlockType) => void;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddBlock }) => {
  const components: {
    type: BlockType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      type: 'heading',
      label: 'Heading',
      description: 'H1 / H2 / H3 headline',
      icon: Heading1,
    },
    {
      type: 'text',
      label: 'Text Paragraph',
      description: 'Rich body copy & tags',
      icon: AlignLeft,
    },
    {
      type: 'quote',
      label: 'Quote Block',
      description: 'Highlighted callout quote',
      icon: Quote,
    },
    {
      type: 'image',
      label: 'Image Banner',
      description: 'Flyer or hero photo',
      icon: ImageIcon,
    },
    {
      type: 'button',
      label: 'CTA Button',
      description: 'Action link or RSVP button',
      icon: MousePointerClick,
    },
    {
      type: 'badge',
      label: 'Badge Pill',
      description: 'Urgent, New or Category tag',
      icon: Tag,
    },
    {
      type: 'columns',
      label: '2-Columns Grid',
      description: 'Side-by-side details',
      icon: Columns,
    },
    {
      type: 'columns3',
      label: '3-Columns Grid',
      description: '3-card stats or feature row',
      icon: Grid3X3,
    },
    {
      type: 'callout',
      label: 'Alert Callout',
      description: 'Important notice or warning',
      icon: AlertCircle,
    },
    {
      type: 'social',
      label: 'Social & Links',
      description: 'Website, social channels row',
      icon: Share2,
    },
    {
      type: 'divider',
      label: 'Divider Line',
      description: 'Clean separator rule',
      icon: Minus,
    },
    {
      type: 'spacer',
      label: 'Spacer Block',
      description: 'Custom vertical whitespace',
      icon: MoveVertical,
    },
    {
      type: 'footer',
      label: 'Hostel Footer',
      description: 'IITM address & council signoff',
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="w-68 bg-[#111113] border-r border-zinc-800 flex flex-col h-full select-none flex-shrink-0">
      {/* Palette Header */}
      <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4 text-zinc-400" />
          <span className="text-sm font-semibold text-zinc-200 tracking-tight">
            Component Library
          </span>
        </div>
        <span className="text-xs text-zinc-400 font-mono bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          13 blocks
        </span>
      </div>

      {/* Component List */}
      <div className="p-2.5 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
        <div className="text-xs uppercase font-mono font-medium text-zinc-400 px-2 pt-1 pb-1">
          Layout Blocks
        </div>

        {components.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.type}
              onClick={() => onAddBlock(item.type)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-800/80 hover:border-zinc-700 text-left transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors truncate">
                  {item.label}
                </div>
                <div className="text-xs text-zinc-400 truncate font-normal">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}

        {/* Dynamic Tokens Guide */}
        <div className="mt-4 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Personalization Tokens</span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            Insert <code className="text-zinc-200 bg-zinc-950 px-1.5 py-0.5 rounded font-mono text-xs border border-zinc-800">{'{{name}}'}</code>, <code className="text-zinc-200 bg-zinc-950 px-1.5 py-0.5 rounded font-mono text-xs border border-zinc-800">{'{{room}}'}</code>, or <code className="text-zinc-200 bg-zinc-950 px-1.5 py-0.5 rounded font-mono text-xs border border-zinc-800">{'{{wing}}'}</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
