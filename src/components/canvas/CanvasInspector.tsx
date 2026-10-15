import React, { useState } from 'react';
import { 
  Sliders, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Trash2, 
  Settings2,
  Tag, 
  Bold, 
  Italic, 
  Strikethrough, 
  Underline, 
  Type,
  Minus,
  Plus,
  Palette,
  Layers,
  Sparkles,
  Link,
  ImageIcon,
  CaseUpper,
  CaseLower,
  Check,
  ChevronDown
} from 'lucide-react';
import { EmailBlock } from '@/types';

interface CanvasInspectorProps {
  selectedBlock: EmailBlock | null;
  onUpdateBlock: (updated: EmailBlock) => void;
  onDeleteSelected: () => void;
  subject: string;
  onUpdateSubject: (subject: string) => void;
  preheader: string;
  onUpdatePreheader: (preheader: string) => void;
  cardColor: string;
  onUpdateCardColor: (color: string) => void;
  maxWidth: number;
  onUpdateMaxWidth: (width: number) => void;
}

export interface FontOption {
  label: string;
  category: 'Sans-Serif' | 'Serif' | 'Display' | 'Handwriting' | 'Monospace';
  value: string;
}

export const FONTS_LIST: FontOption[] = [
  // Sans-Serif
  { label: 'Plus Jakarta Sans', category: 'Sans-Serif', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Inter', category: 'Sans-Serif', value: "'Inter', sans-serif" },
  { label: 'Outfit', category: 'Sans-Serif', value: "'Outfit', sans-serif" },
  { label: 'Montserrat', category: 'Sans-Serif', value: "'Montserrat', sans-serif" },
  { label: 'Space Grotesk', category: 'Sans-Serif', value: "'Space Grotesk', sans-serif" },
  { label: 'Bricolage Grotesque', category: 'Sans-Serif', value: "'Bricolage Grotesque', sans-serif" },
  { label: 'Oswald', category: 'Sans-Serif', value: "'Oswald', sans-serif" },
  { label: 'Arial', category: 'Sans-Serif', value: 'Arial, Helvetica, sans-serif' },
  
  // Serif
  { label: 'Playfair Display', category: 'Serif', value: "'Playfair Display', serif" },
  { label: 'Cinzel (Classical)', category: 'Serif', value: "'Cinzel', serif" },
  { label: 'Cormorant Garamond', category: 'Serif', value: "'Cormorant Garamond', serif" },
  { label: 'Georgia', category: 'Serif', value: 'Georgia, serif' },
  { label: 'Times New Roman', category: 'Serif', value: "'Times New Roman', Times, serif" },

  // Display & Creative
  { label: 'Syne', category: 'Display', value: "'Syne', sans-serif" },
  { label: 'Orbitron', category: 'Display', value: "'Orbitron', sans-serif" },

  // Handwriting & Script
  { label: 'Caveat', category: 'Handwriting', value: "'Caveat', cursive" },
  { label: 'Dancing Script', category: 'Handwriting', value: "'Dancing Script', cursive" },

  // Monospace & Code
  { label: 'JetBrains Mono', category: 'Monospace', value: "'JetBrains Mono', monospace" },
  { label: 'Fira Code', category: 'Monospace', value: "'Fira Code', monospace" },
  { label: 'Courier New', category: 'Monospace', value: "'Courier New', Courier, monospace" },
];

const PRESET_COLORS = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Zinc Light', hex: '#E4E4E7' },
  { name: 'Zinc Muted', hex: '#A1A1AA' },
  { name: 'Zinc Dark', hex: '#52525B' },
  { name: 'Purple Accent', hex: '#A855F7' },
  { name: 'Indigo Accent', hex: '#6366F1' },
  { name: 'Sky Blue', hex: '#38BDF8' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Amber Gold', hex: '#F59E0B' },
  { name: 'Rose Red', hex: '#F43F5E' },
  { name: 'Hostel Night', hex: '#18181B' },
];

const IMAGE_PRESETS = [
  {
    name: 'Hostel GBM & Cultural Night',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Campus Showcase & Tech Fest',
    url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cricket & Sports Meet',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Library & Academic Forum',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
  },
];

export const CanvasInspector: React.FC<CanvasInspectorProps> = ({
  selectedBlock,
  onUpdateBlock,
  onDeleteSelected,
  subject,
  onUpdateSubject,
  preheader,
  onUpdatePreheader,
  cardColor,
  onUpdateCardColor,
  maxWidth,
  onUpdateMaxWidth,
}) => {
  const [customFontInput, setCustomFontInput] = useState('');
  const [isCustomFontActive, setIsCustomFontActive] = useState(false);

  // If no block selected, display Canva-style Global Canvas Settings
  if (!selectedBlock) {
    return (
      <div className="w-80 bg-[#111113] border-l border-zinc-800 flex flex-col h-full select-none flex-shrink-0 text-zinc-100">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-2.5">
          <Settings2 className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
            Canvas Settings
          </h3>
        </div>

        <div className="p-4 space-y-5 overflow-y-auto flex-1 custom-scrollbar text-sm">
          {/* Hint Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-300 leading-relaxed">
              <span className="font-semibold text-white block mb-0.5">Canva-Style Editor</span>
              Click any element on the email to customize fonts, colors, text, sizes, and padding without touching code.
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Email Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => onUpdateSubject(e.target.value)}
              placeholder="e.g. [Namdapha House] GBM Announcement"
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Preheader */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Preheader Snippet
            </label>
            <textarea
              value={preheader}
              onChange={(e) => onUpdatePreheader(e.target.value)}
              placeholder="Preview snippet shown next to subject line in Gmail..."
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"
            />
          </div>

          {/* Container Max Width */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-300">Email Canvas Width</span>
              <span className="font-mono text-zinc-200">{maxWidth}px</span>
            </div>
            <input
              type="range"
              min="480"
              max="760"
              step="20"
              value={maxWidth}
              onChange={(e) => onUpdateMaxWidth(Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[480, 600, 680, 720].map((w) => (
                <button
                  key={w}
                  onClick={() => onUpdateMaxWidth(w)}
                  className={`py-1 rounded-lg text-xs font-mono transition-colors border ${
                    maxWidth === w
                      ? 'bg-zinc-800 border-zinc-600 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>

          {/* Container Background Color */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-300">
              Container Background Color
            </label>
            <div className="flex items-center gap-2.5">
              <input
                type="color"
                value={cardColor}
                onChange={(e) => onUpdateCardColor(e.target.value)}
                className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-zinc-800"
              />
              <input
                type="text"
                value={cardColor}
                onChange={(e) => onUpdateCardColor(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none focus:border-zinc-500 uppercase"
              />
            </div>
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              {['#141417', '#09090B', '#18181B', '#1E1B4B', '#0F172A', '#1C1917'].map((hex) => (
                <button
                  key={hex}
                  onClick={() => onUpdateCardColor(hex)}
                  style={{ backgroundColor: hex }}
                  className={`w-6 h-6 rounded-md border transition-transform ${
                    cardColor.toLowerCase() === hex.toLowerCase()
                      ? 'border-white scale-110'
                      : 'border-zinc-700 hover:scale-105'
                  }`}
                  title={hex}
                />
              ))}
            </div>
          </div>

          {/* Personalization Info Card */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-zinc-300 font-medium text-xs">
              <Tag className="w-3.5 h-3.5 text-zinc-400" />
              <span>Personalization Variables</span>
            </div>
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex justify-between items-center"><code className="text-zinc-200 font-mono">{'{{name}}'}</code> <span>Resident name</span></div>
              <div className="flex justify-between items-center"><code className="text-zinc-200 font-mono">{'{{room}}'}</code> <span>Room number</span></div>
              <div className="flex justify-between items-center"><code className="text-zinc-200 font-mono">{'{{wing}}'}</code> <span>Wing letter</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Component-Specific Properties Inspector
  const updateContent = (partialContent: Partial<EmailBlock['content']>) => {
    onUpdateBlock({
      ...selectedBlock,
      content: { ...selectedBlock.content, ...partialContent },
    });
  };

  const updateStyles = (partialStyles: Partial<NonNullable<EmailBlock['styles']>>) => {
    onUpdateBlock({
      ...selectedBlock,
      styles: { ...(selectedBlock.styles || {}), ...partialStyles },
    });
  };

  const blockStyles = selectedBlock.styles || {};
  const currentFontSize = blockStyles.fontSize || (selectedBlock.type === 'heading' ? 24 : 15);

  const handleFontSelect = (value: string) => {
    if (value === 'custom') {
      setIsCustomFontActive(true);
    } else {
      setIsCustomFontActive(false);
      updateStyles({ fontFamily: value });
    }
  };

  const applyCustomFont = () => {
    if (customFontInput.trim()) {
      updateStyles({ fontFamily: customFontInput.trim() });
    }
  };

  const changeFontSize = (delta: number) => {
    const next = Math.max(10, Math.min(60, currentFontSize + delta));
    updateStyles({ fontSize: next });
  };

  return (
    <div className="w-80 bg-[#111113] border-l border-zinc-800 flex flex-col h-full select-none flex-shrink-0 text-zinc-100">
      {/* Header with Block Info and Delete */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-purple-400" />
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            {selectedBlock.type}
          </div>
        </div>

        <button
          onClick={onDeleteSelected}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
          title="Delete Block"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Inspector Scroll Body */}
      <div className="p-4 space-y-5 overflow-y-auto flex-1 text-sm custom-scrollbar">

        {/* 1. CANVA-STYLE TYPOGRAPHY SECTION */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <Type className="w-4 h-4 text-purple-400" />
              <span>Typography & Font</span>
            </span>
          </div>

          {/* Font Family Selector with live preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">
              Font Family
            </label>
            <select
              value={isCustomFontActive ? 'custom' : (blockStyles.fontFamily || '')}
              onChange={(e) => handleFontSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 font-sans"
            >
              <option value="">Default System Font</option>
              {['Sans-Serif', 'Serif', 'Display', 'Handwriting', 'Monospace'].map((cat) => (
                <optgroup key={cat} label={`── ${cat} ──`}>
                  {FONTS_LIST.filter((f) => f.category === cat).map((font) => (
                    <option key={font.label} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="custom">+ Custom Font / Local Font...</option>
            </select>

            {isCustomFontActive && (
              <div className="flex items-center gap-1.5 mt-2">
                <input
                  type="text"
                  value={customFontInput}
                  onChange={(e) => setCustomFontInput(e.target.value)}
                  placeholder="e.g. Georgia, Arial, Segoe UI..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-white focus:outline-none"
                />
                <button
                  onClick={applyCustomFont}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Font Size: Stepper + Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Font Size</span>
              <span className="font-mono text-zinc-200">{currentFontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeFontSize(-1)}
                className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center"
                title="Decrease font size"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min="10"
                max="48"
                value={currentFontSize}
                onChange={(e) => updateStyles({ fontSize: Number(e.target.value) })}
                className="flex-1 accent-white cursor-pointer"
              />
              <button
                type="button"
                onClick={() => changeFontSize(1)}
                className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center"
                title="Increase font size"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Formatting Toggles: Bold, Italic, Underline, Strikethrough */}
          <div className="space-y-1.5">
            <span className="text-xs text-zinc-400 font-medium">Style</span>
            <div className="flex items-center gap-1.5 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
              <button
                onClick={() => updateStyles({ bold: !blockStyles.bold })}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-colors text-xs font-bold ${
                  blockStyles.bold
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Bold (B)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateStyles({ italic: !blockStyles.italic })}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-colors ${
                  blockStyles.italic
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Italic (I)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateStyles({ underline: !blockStyles.underline })}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-colors ${
                  blockStyles.underline
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Underline (U)"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateStyles({ strikethrough: !blockStyles.strikethrough })}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition-colors ${
                  blockStyles.strikethrough
                    ? 'bg-zinc-700 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Strikethrough (S)"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Alignment & Text Case */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium">Alignment</span>
              <div className="grid grid-cols-4 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => updateStyles({ align: 'left' })}
                  className={`py-1.5 rounded-md flex items-center justify-center transition-colors ${
                    blockStyles.align === 'left' || !blockStyles.align
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateStyles({ align: 'center' })}
                  className={`py-1.5 rounded-md flex items-center justify-center transition-colors ${
                    blockStyles.align === 'center'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateStyles({ align: 'right' })}
                  className={`py-1.5 rounded-md flex items-center justify-center transition-colors ${
                    blockStyles.align === 'right'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateStyles({ align: 'justify' })}
                  className={`py-1.5 rounded-md flex items-center justify-center transition-colors ${
                    blockStyles.align === 'justify'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Justify"
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs text-zinc-400 font-medium">Text Case</span>
              <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => updateStyles({ textTransform: 'none' })}
                  className={`py-1.5 rounded-md text-xs font-medium transition-colors ${
                    !blockStyles.textTransform || blockStyles.textTransform === 'none'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Normal"
                >
                  Aa
                </button>
                <button
                  onClick={() => updateStyles({ textTransform: 'uppercase' })}
                  className={`py-1.5 rounded-md text-xs font-bold transition-colors ${
                    blockStyles.textTransform === 'uppercase'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="UPPERCASE"
                >
                  AA
                </button>
                <button
                  onClick={() => updateStyles({ textTransform: 'capitalize' })}
                  className={`py-1.5 rounded-md text-xs font-medium transition-colors ${
                    blockStyles.textTransform === 'capitalize'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Capitalize"
                >
                  A.
                </button>
              </div>
            </div>
          </div>

          {/* Color Picker & Presets */}
          <div className="space-y-2">
            <span className="text-xs text-zinc-400 font-medium">Text Color</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={blockStyles.color || '#FAFAFA'}
                onChange={(e) => updateStyles({ color: e.target.value })}
                className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border border-zinc-800"
              />
              <input
                type="text"
                value={blockStyles.color || '#FAFAFA'}
                onChange={(e) => updateStyles({ color: e.target.value })}
                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 uppercase focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* Quick Swatch Dots */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => updateStyles({ color: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    (blockStyles.color || '#FAFAFA').toLowerCase() === c.hex.toLowerCase()
                      ? 'border-white scale-125'
                      : 'border-zinc-700 hover:scale-110'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. SPECIFIC BLOCK CONTENT EDITORS */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3.5 shadow-sm">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Content & Text</span>
          </span>

          {/* Heading Block */}
          {selectedBlock.type === 'heading' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Heading Level</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['h1', 'h2', 'h3'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => updateContent({ level: lvl })}
                      className={`py-1.5 rounded-lg border text-xs font-mono uppercase transition-colors ${
                        (selectedBlock.content.level || 'h1') === lvl
                          ? 'bg-zinc-800 border-zinc-600 text-white font-bold'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {lvl.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Headline Text</label>
                <textarea
                  value={selectedBlock.content.text || ''}
                  onChange={(e) => updateContent({ text: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Text Block */}
          {selectedBlock.type === 'text' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-400">Paragraph Content</label>
                  <span className="text-[11px] text-zinc-500">Supports HTML / Tags</span>
                </div>
                <textarea
                  value={selectedBlock.content.html || ''}
                  onChange={(e) => updateContent({ html: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 resize-none font-sans"
                />
              </div>

              {/* Quick Token Inserters */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-zinc-400 block font-medium">Insert Personalization:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['{{name}}', '{{room}}', '{{wing}}'].map((token) => (
                    <button
                      key={token}
                      onClick={() => {
                        const current = selectedBlock.content.html || '';
                        updateContent({ html: `${current} ${token}` });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
                    >
                      + {token}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Button Block */}
          {selectedBlock.type === 'button' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Button Text</label>
                <input
                  type="text"
                  value={selectedBlock.content.buttonText || ''}
                  onChange={(e) => updateContent({ buttonText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Destination URL</label>
                <div className="relative">
                  <Link className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={selectedBlock.content.url || ''}
                    onChange={(e) => updateContent({ url: e.target.value })}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Button Color</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={selectedBlock.content.buttonColor || '#4F46E5'}
                      onChange={(e) => updateContent({ buttonColor: e.target.value })}
                      className="w-7 h-7 rounded-md bg-transparent cursor-pointer border border-zinc-800"
                    />
                    <input
                      type="text"
                      value={selectedBlock.content.buttonColor || '#4F46E5'}
                      onChange={(e) => updateContent({ buttonColor: e.target.value })}
                      className="w-full px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Text Color</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={selectedBlock.content.textColor || '#FFFFFF'}
                      onChange={(e) => updateContent({ textColor: e.target.value })}
                      className="w-7 h-7 rounded-md bg-transparent cursor-pointer border border-zinc-800"
                    />
                    <input
                      type="text"
                      value={selectedBlock.content.textColor || '#FFFFFF'}
                      onChange={(e) => updateContent({ textColor: e.target.value })}
                      className="w-full px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Corner Radius & Full Width */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">Border Radius</span>
                  <span className="font-mono text-zinc-200">{selectedBlock.content.borderRadius || 8}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={selectedBlock.content.borderRadius || 8}
                  onChange={(e) => updateContent({ borderRadius: Number(e.target.value) })}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-zinc-300">Full Width Button</span>
                <input
                  type="checkbox"
                  checked={!!selectedBlock.content.fullWidth}
                  onChange={(e) => updateContent({ fullWidth: e.target.checked })}
                  className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Image Block */}
          {selectedBlock.type === 'image' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Image URL</label>
                <input
                  type="text"
                  value={selectedBlock.content.src || ''}
                  onChange={(e) => updateContent({ src: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>

              {/* Quick Image Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-zinc-400 block font-medium">Hostel Banner Presets:</span>
                <div className="space-y-1.5">
                  {IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => updateContent({ src: preset.url, caption: preset.name })}
                      className="w-full text-left p-2 rounded-lg bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-xs text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Caption / Subtitle</label>
                <input
                  type="text"
                  value={selectedBlock.content.caption || ''}
                  onChange={(e) => updateContent({ caption: e.target.value })}
                  placeholder="e.g. Namdapha Community Gathering"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          )}

          {/* Quote Block */}
          {selectedBlock.type === 'quote' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Quote Text</label>
                <textarea
                  value={selectedBlock.content.quoteText || ''}
                  onChange={(e) => updateContent({ quoteText: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 resize-none italic"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Quote Author / Citation</label>
                <input
                  type="text"
                  value={selectedBlock.content.quoteAuthor || ''}
                  onChange={(e) => updateContent({ quoteAuthor: e.target.value })}
                  placeholder="e.g. General Secretary"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          )}

          {/* Badge Block */}
          {selectedBlock.type === 'badge' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Badge Text</label>
                <input
                  type="text"
                  value={selectedBlock.content.badgeText || ''}
                  onChange={(e) => updateContent({ badgeText: e.target.value })}
                  placeholder="OFFICIAL NOTICE"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white uppercase focus:outline-none focus:border-zinc-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Badge Background</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={selectedBlock.content.badgeBg || '#27272A'}
                      onChange={(e) => updateContent({ badgeBg: e.target.value })}
                      className="w-7 h-7 rounded-md bg-transparent cursor-pointer border border-zinc-800"
                    />
                    <input
                      type="text"
                      value={selectedBlock.content.badgeBg || '#27272A'}
                      onChange={(e) => updateContent({ badgeBg: e.target.value })}
                      className="w-full px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400">Text Color</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={selectedBlock.content.badgeColor || '#FAFAFA'}
                      onChange={(e) => updateContent({ badgeColor: e.target.value })}
                      className="w-7 h-7 rounded-md bg-transparent cursor-pointer border border-zinc-800"
                    />
                    <input
                      type="text"
                      value={selectedBlock.content.badgeColor || '#FAFAFA'}
                      onChange={(e) => updateContent({ badgeColor: e.target.value })}
                      className="w-full px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Callout Block */}
          {selectedBlock.type === 'callout' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Callout Title</label>
                <input
                  type="text"
                  value={selectedBlock.content.calloutTitle || ''}
                  onChange={(e) => updateContent({ calloutTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Message</label>
                <textarea
                  value={selectedBlock.content.calloutText || ''}
                  onChange={(e) => updateContent({ calloutText: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* 2-Columns Block */}
          {selectedBlock.type === 'columns' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-medium text-purple-400">Column 1 (Left)</span>
                <input
                  type="text"
                  value={selectedBlock.content.col1Title || ''}
                  onChange={(e) => updateContent({ col1Title: e.target.value })}
                  placeholder="Left Title"
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white font-semibold"
                />
                <textarea
                  value={selectedBlock.content.col1Text || ''}
                  onChange={(e) => updateContent({ col1Text: e.target.value })}
                  rows={2}
                  placeholder="Left details..."
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-medium text-purple-400">Column 2 (Right)</span>
                <input
                  type="text"
                  value={selectedBlock.content.col2Title || ''}
                  onChange={(e) => updateContent({ col2Title: e.target.value })}
                  placeholder="Right Title"
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white font-semibold"
                />
                <textarea
                  value={selectedBlock.content.col2Text || ''}
                  onChange={(e) => updateContent({ col2Text: e.target.value })}
                  rows={2}
                  placeholder="Right details..."
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white resize-none"
                />
              </div>
            </div>
          )}

          {/* Spacer Block */}
          {selectedBlock.type === 'spacer' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-400">Spacer Height</span>
                <span className="font-mono text-zinc-200">{selectedBlock.content.height || 20}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="80"
                value={selectedBlock.content.height || 20}
                onChange={(e) => updateContent({ height: Number(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
            </div>
          )}

          {/* Header Block */}
          {selectedBlock.type === 'header' && (
            <div className="space-y-4">
              {/* Logo Emblem Preview & Configuration */}
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">Namdapha Emblem</label>
                  <button
                    type="button"
                    onClick={() => updateContent({
                      logoUrl: 'https://raw.githubusercontent.com/Techy-prashant/images_workIITM/refs/heads/main/Namdapha%20logos/Namdapha_bg_colored_rect.png',
                      logoRadius: 14,
                    })}
                    className="text-[10px] text-zinc-400 hover:text-white underline"
                  >
                    Reset Official Logo
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div 
                    style={{ borderRadius: `${selectedBlock.content.logoRadius ?? 14}px` }}
                    className="w-12 h-12 overflow-hidden bg-black border border-zinc-800 shadow-md flex items-center justify-center flex-shrink-0 ring-1 ring-white/10"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedBlock.content.logoUrl || "https://raw.githubusercontent.com/Techy-prashant/images_workIITM/refs/heads/main/Namdapha%20logos/Namdapha_bg_colored_rect.png"}
                      alt="Logo Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/Namdapha_bg_colored_rect.png";
                      }}
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-[11px] text-zinc-400 font-medium">Logo Image Link</label>
                    <input
                      type="text"
                      value={selectedBlock.content.logoUrl || ''}
                      onChange={(e) => updateContent({ logoUrl: e.target.value })}
                      placeholder="https://raw.githubusercontent.com/.../Namdapha_bg_colored_rect.png"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-200 focus:outline-none focus:border-zinc-500 font-mono"
                    />
                  </div>
                </div>

                {/* Logo Corner Radius Slider */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Curved Corners Radius</span>
                    <span className="font-mono text-zinc-300">{selectedBlock.content.logoRadius ?? 14}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="28"
                    step="2"
                    value={selectedBlock.content.logoRadius ?? 14}
                    onChange={(e) => updateContent({ logoRadius: Number(e.target.value) })}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Header Organization</label>
                <input
                  type="text"
                  value={selectedBlock.content.text || ''}
                  onChange={(e) => updateContent({ text: e.target.value })}
                  placeholder="NAMDAPHA HOUSE"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white uppercase font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Header Subtitle</label>
                <input
                  type="text"
                  value={selectedBlock.content.caption || ''}
                  onChange={(e) => updateContent({ caption: e.target.value })}
                  placeholder="IIT MADRAS • EXECUTIVE COUNCIL"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                />
              </div>
            </div>
          )}

          {/* Footer Block */}
          {selectedBlock.type === 'footer' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Organization / Council</label>
                <input
                  type="text"
                  value={selectedBlock.content.organization || ''}
                  onChange={(e) => updateContent({ organization: e.target.value })}
                  placeholder="Namdapha House Secretariat"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Address / Location</label>
                <input
                  type="text"
                  value={selectedBlock.content.address || ''}
                  onChange={(e) => updateContent({ address: e.target.value })}
                  placeholder="Hostel Zone, IIT Madras, Chennai 600036"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Notice / Unsubscribe Text</label>
                <textarea
                  value={selectedBlock.content.unsubscribeNotice || ''}
                  onChange={(e) => updateContent({ unsubscribeNotice: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. SPACING & BLOCK BACKGROUND SECTION */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3.5 shadow-sm">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Spacing & Background</span>
          </span>

          {/* Vertical Padding Sliders */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Top Pad</span>
                <span className="font-mono text-zinc-200">{blockStyles.paddingTop ?? 8}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={blockStyles.paddingTop ?? 8}
                onChange={(e) => updateStyles({ paddingTop: Number(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Bottom Pad</span>
                <span className="font-mono text-zinc-200">{blockStyles.paddingBottom ?? 8}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={blockStyles.paddingBottom ?? 8}
                onChange={(e) => updateStyles({ paddingBottom: Number(e.target.value) })}
                className="w-full accent-white cursor-pointer"
              />
            </div>
          </div>

          {/* Block Background (optional card styling) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">Block Card Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={blockStyles.backgroundColor || '#111113'}
                onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                className="w-7 h-7 rounded-md bg-transparent cursor-pointer border border-zinc-800"
              />
              <button
                type="button"
                onClick={() => updateStyles({ backgroundColor: undefined })}
                className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 hover:text-white"
              >
                Clear Background
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
