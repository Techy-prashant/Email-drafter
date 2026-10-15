import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Copy, 
  Trash2, 
  AlertCircle,
  Quote as QuoteIcon,
  Globe,
  Share2,
  ExternalLink,
  MessageSquare,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Plus,
  Minus,
  Type
} from 'lucide-react';
import { EmailBlock } from '@/types';
import { NamdaphaLogo } from '../common/NamdaphaLogo';

interface EmailCanvasProps {
  blocks: EmailBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onDuplicateBlock: (index: number) => void;
  onDeleteBlock: (index: number) => void;
  onUpdateBlock?: (block: EmailBlock) => void;
  previewDevice: 'desktop' | 'mobile';
  cardColor?: string;
  maxWidth?: number;
}

const QUICK_FONTS = [
  { label: 'Default', value: '' },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Plus Jakarta', value: "'Plus Jakarta Sans', sans-serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Cinzel Classical', value: "'Cinzel', serif" },
  { label: 'Syne Modern', value: "'Syne', sans-serif" },
  { label: 'Caveat Script', value: "'Caveat', cursive" },
  { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { label: 'Outfit', value: "'Outfit', sans-serif" },
];

export const EmailCanvas: React.FC<EmailCanvasProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onMoveBlock,
  onDuplicateBlock,
  onDeleteBlock,
  onUpdateBlock,
  previewDevice,
  cardColor = '#141417',
  maxWidth = 600,
}) => {
  const containerWidth = previewDevice === 'mobile' ? '375px' : `${maxWidth}px`;

  // Helper for applying typography & formatting styles to block containers
  const getBlockStyle = (styles?: EmailBlock['styles']): React.CSSProperties => {
    if (!styles) return {};
    const textDecoration: string[] = [];
    if (styles.underline) textDecoration.push('underline');
    if (styles.strikethrough) textDecoration.push('line-through');

    return {
      textAlign: styles.align || 'left',
      color: styles.color || undefined,
      fontFamily: styles.fontFamily || undefined,
      fontWeight: styles.fontWeight || (styles.bold ? '700' : undefined),
      fontStyle: styles.italic ? 'italic' : undefined,
      textDecoration: textDecoration.length > 0 ? textDecoration.join(' ') : undefined,
      letterSpacing: styles.letterSpacing || undefined,
      textTransform: styles.textTransform || undefined,
      lineHeight: styles.lineHeight || undefined,
      backgroundColor: styles.backgroundColor || undefined,
      borderRadius: styles.borderRadius !== undefined ? `${styles.borderRadius}px` : undefined,
      borderColor: styles.borderColor || undefined,
      borderWidth: styles.borderWidth !== undefined ? `${styles.borderWidth}px` : undefined,
      borderStyle: styles.borderWidth ? 'solid' : undefined,
      paddingTop: styles.paddingTop !== undefined ? `${styles.paddingTop}px` : undefined,
      paddingBottom: styles.paddingBottom !== undefined ? `${styles.paddingBottom}px` : undefined,
    };
  };

  // Quick helper to patch selected block styles
  const patchStyles = (block: EmailBlock, patch: Partial<NonNullable<EmailBlock['styles']>>) => {
    if (!onUpdateBlock) return;
    onUpdateBlock({
      ...block,
      styles: {
        ...(block.styles || {}),
        ...patch,
      },
    });
  };

  return (
    <div 
      className="flex-1 overflow-y-auto h-full max-h-full bg-[#09090B] p-4 sm:p-8 flex flex-col items-center select-none custom-scrollbar"
      onClick={() => onSelectBlock(null)}
    >
      {/* Device wrapper indicator */}
      <div className="mb-3 text-[10px] text-zinc-500 font-mono tracking-wider flex items-center gap-2 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
        <span>{previewDevice === 'mobile' ? 'MOBILE VIEW (375px)' : `DESKTOP VIEW (${maxWidth}px)`}</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-600">Canva Visual Studio Mode</span>
      </div>

      {/* Email Container Frame - Scrollable within Canvas with safe bottom margin */}
      <div
        style={{ width: containerWidth }}
        className="transition-all duration-150 relative shadow-2xl rounded-xl border border-zinc-800 my-4 mb-40 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Email Header Chrome */}
        <div className="bg-[#111113] px-3.5 py-2.5 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700 inline-block" />
            <span className="text-[11px] font-mono text-zinc-400 ml-1.5 font-medium">Namdapha Email Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 font-mono uppercase">
              IIT Madras
            </span>
          </div>
        </div>

        {/* Inner Email Body Container */}
        <div
          style={{ backgroundColor: cardColor }}
          className="p-5 sm:p-8 min-h-[500px] flex flex-col space-y-3 text-zinc-100"
        >
          {blocks.map((block, index) => {
            const isSelected = selectedBlockId === block.id;
            const currentFontSize = block.styles?.fontSize || (
              block.type === 'heading' 
                ? (block.content.level === 'h3' ? 18 : block.content.level === 'h2' ? 22 : 28)
                : 15
            );

            return (
              <div
                key={block.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectBlock(block.id);
                }}
                className={`relative group rounded-xl transition-all cursor-pointer p-2.5 ${
                  isSelected
                    ? 'ring-2 ring-zinc-400 bg-white/[0.04] shadow-lg shadow-black/40'
                    : 'hover:ring-1 hover:ring-zinc-700/80 hover:bg-white/[0.02]'
                }`}
              >
                {/* Canva-Style Floating Quick Toolbar on Selection */}
                {isSelected && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#18181B] border border-zinc-700 rounded-xl px-2 py-1 shadow-2xl flex items-center gap-1.5 z-40 animate-in fade-in zoom-in-95 duration-100"
                  >
                    {/* Quick Font Selector */}
                    {onUpdateBlock && (
                      <div className="flex items-center gap-1 pr-1 border-r border-zinc-750">
                        <Type className="w-3 h-3 text-zinc-400 ml-0.5" />
                        <select
                          value={block.styles?.fontFamily || ''}
                          onChange={(e) => patchStyles(block, { fontFamily: e.target.value })}
                          className="bg-[#27272A] text-zinc-200 text-[11px] rounded px-1.5 py-0.5 border border-zinc-700 focus:outline-none focus:border-zinc-400 cursor-pointer max-w-[105px]"
                          title="Font Family"
                        >
                          {QUICK_FONTS.map((f) => (
                            <option key={f.label} value={f.value} className="bg-zinc-900 text-zinc-200">
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Font Size Stepper */}
                    {onUpdateBlock && (
                      <div className="flex items-center gap-0.5 pr-1 border-r border-zinc-750">
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { fontSize: Math.max(10, currentFontSize - 2) })}
                          className="w-5 h-5 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700/60 text-xs"
                          title="Decrease Font Size"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-[11px] font-mono text-zinc-300 min-w-[24px] text-center font-medium">
                          {currentFontSize}
                        </span>
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { fontSize: Math.min(60, currentFontSize + 2) })}
                          className="w-5 h-5 rounded flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700/60 text-xs"
                          title="Increase Font Size"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}

                    {/* Bold, Italic, Underline, Strike */}
                    {onUpdateBlock && (
                      <div className="flex items-center gap-0.5 pr-1 border-r border-zinc-750">
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { bold: !block.styles?.bold })}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${
                            block.styles?.bold 
                              ? 'bg-zinc-200 text-zinc-950 font-bold' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                          }`}
                          title="Bold"
                        >
                          <Bold className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { italic: !block.styles?.italic })}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${
                            block.styles?.italic 
                              ? 'bg-zinc-200 text-zinc-950' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                          }`}
                          title="Italic"
                        >
                          <Italic className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { underline: !block.styles?.underline })}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${
                            block.styles?.underline 
                              ? 'bg-zinc-200 text-zinc-950' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                          }`}
                          title="Underline"
                        >
                          <Underline className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { strikethrough: !block.styles?.strikethrough })}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${
                            block.styles?.strikethrough 
                              ? 'bg-zinc-200 text-zinc-950' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                          }`}
                          title="Strikethrough"
                        >
                          <Strikethrough className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}

                    {/* Text Alignment */}
                    {onUpdateBlock && (
                      <div className="flex items-center gap-0.5 pr-1 border-r border-zinc-750">
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { align: 'left' })}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${
                            (!block.styles?.align || block.styles?.align === 'left') 
                              ? 'bg-zinc-300 text-zinc-950' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                          }`}
                          title="Align Left"
                        >
                          <AlignLeft className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { align: 'center' })}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${
                            block.styles?.align === 'center' 
                              ? 'bg-zinc-300 text-zinc-950' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                          }`}
                          title="Align Center"
                        >
                          <AlignCenter className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { align: 'right' })}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${
                            block.styles?.align === 'right' 
                              ? 'bg-zinc-300 text-zinc-950' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                          }`}
                          title="Align Right"
                        >
                          <AlignRight className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => patchStyles(block, { align: 'justify' })}
                          className={`w-5 h-5 rounded flex items-center justify-center text-xs transition-colors ${
                            block.styles?.align === 'justify' 
                              ? 'bg-zinc-300 text-zinc-950' 
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-700/60'
                          }`}
                          title="Justify"
                        >
                          <AlignJustify className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}

                    {/* Quick Color Picker */}
                    {onUpdateBlock && (
                      <div className="flex items-center gap-1 pr-1 border-r border-zinc-750">
                        <label 
                          className="relative flex items-center justify-center cursor-pointer"
                          title="Change Text Color"
                        >
                          <span 
                            className="w-4 h-4 rounded-full border border-zinc-500 shadow-sm inline-block"
                            style={{ backgroundColor: block.styles?.color || '#FAFAFA' }}
                          />
                          <input
                            type="color"
                            value={block.styles?.color || '#FAFAFA'}
                            onChange={(e) => patchStyles(block, { color: e.target.value })}
                            className="absolute inset-0 opacity-0 cursor-pointer w-4 h-4"
                          />
                        </label>
                      </div>
                    )}

                    {/* Reorder / Duplicate / Delete Actions */}
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => onMoveBlock(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-700/60 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveBlock(index, 'down')}
                        disabled={index === blocks.length - 1}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-700/60 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateBlock(index)}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-700/60"
                        title="Duplicate Block"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteBlock(index)}
                        className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                        title="Delete Block"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Header Block */}
                {block.type === 'header' && (
                  <div style={getBlockStyle(block.styles)}>
                    <div className="inline-flex flex-col items-center">
                      <div 
                        style={{
                          borderRadius: `${block.content.logoRadius ?? 14}px`,
                        }}
                        className="w-14 h-14 overflow-hidden bg-[#050507] border border-zinc-800/80 shadow-md flex items-center justify-center ring-1 ring-white/10 transition-transform hover:scale-105"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={block.content.logoUrl || "https://raw.githubusercontent.com/Techy-prashant/images_workIITM/refs/heads/main/Namdapha%20logos/Namdapha_bg_colored_rect.png"}
                          alt="Namdapha House Logo"
                          className="w-full h-full object-cover select-none"
                          onError={(e) => {
                            e.currentTarget.src = "/Namdapha_bg_colored_rect.png";
                          }}
                        />
                      </div>
                      <div 
                        style={{
                          fontFamily: block.styles?.fontFamily || undefined,
                          fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : undefined,
                          fontWeight: block.styles?.fontWeight || (block.styles?.bold ? '700' : '600'),
                          color: block.styles?.color || undefined,
                          letterSpacing: block.styles?.letterSpacing || '0.12em',
                          textTransform: block.styles?.textTransform || 'uppercase',
                        }}
                        className="text-xs tracking-widest text-zinc-300 mt-2.5"
                      >
                        {block.content.text || 'NAMDAPHA HOUSE'}
                      </div>
                      {block.content.caption && (
                        <div 
                          style={{
                            fontFamily: block.styles?.fontFamily || undefined,
                          }}
                          className="text-[10px] text-zinc-500 tracking-wider uppercase mt-0.5"
                        >
                          {block.content.caption}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Heading Block */}
                {block.type === 'heading' && (
                  <div style={getBlockStyle(block.styles)}>
                    {block.content.level === 'h3' ? (
                      <h3 
                        style={{
                          fontFamily: block.styles?.fontFamily || undefined,
                          fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : '18px',
                          fontWeight: block.styles?.fontWeight || (block.styles?.bold ? '700' : '600'),
                          color: block.styles?.color || undefined,
                          letterSpacing: block.styles?.letterSpacing || undefined,
                          textTransform: block.styles?.textTransform || undefined,
                        }}
                        className="tracking-tight text-zinc-100"
                      >
                        {block.content.text || 'Section Headline'}
                      </h3>
                    ) : block.content.level === 'h2' ? (
                      <h2 
                        style={{
                          fontFamily: block.styles?.fontFamily || undefined,
                          fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : '22px',
                          fontWeight: block.styles?.fontWeight || (block.styles?.bold ? '700' : '700'),
                          color: block.styles?.color || undefined,
                          letterSpacing: block.styles?.letterSpacing || undefined,
                          textTransform: block.styles?.textTransform || undefined,
                        }}
                        className="tracking-tight text-white"
                      >
                        {block.content.text || 'Sub-headline'}
                      </h2>
                    ) : (
                      <h1 
                        style={{
                          fontFamily: block.styles?.fontFamily || undefined,
                          fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : '28px',
                          fontWeight: block.styles?.fontWeight || (block.styles?.bold ? '800' : '700'),
                          color: block.styles?.color || undefined,
                          letterSpacing: block.styles?.letterSpacing || undefined,
                          textTransform: block.styles?.textTransform || undefined,
                        }}
                        className="tracking-tight text-white"
                      >
                        {block.content.text || 'Main Email Heading'}
                      </h1>
                    )}
                  </div>
                )}

                {/* Text Block */}
                {block.type === 'text' && (
                  <div
                    style={{
                      ...getBlockStyle(block.styles),
                      fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : '15px',
                      lineHeight: block.styles?.lineHeight || 1.65,
                    }}
                    className="text-zinc-300"
                    dangerouslySetInnerHTML={{
                      __html: block.content.html || '<p>Enter email text...</p>',
                    }}
                  />
                )}

                {/* Quote Block */}
                {block.type === 'quote' && (
                  <div style={getBlockStyle(block.styles)}>
                    <div 
                      style={{
                        backgroundColor: block.styles?.backgroundColor || 'rgba(24, 24, 27, 0.7)',
                        borderRadius: block.styles?.borderRadius !== undefined ? `${block.styles.borderRadius}px` : '8px',
                      }}
                      className="relative p-4 border-l-2 border-zinc-400 border-zinc-800 my-1"
                    >
                      <QuoteIcon className="w-4 h-4 text-zinc-500 mb-1.5 opacity-60" />
                      <p 
                        style={{
                          fontFamily: block.styles?.fontFamily || "'Playfair Display', Georgia, serif",
                          fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : '14px',
                          color: block.styles?.color || '#E4E4E7',
                        }}
                        className="italic leading-relaxed"
                      >
                        &ldquo;{block.content.quoteText || 'Excellence is not an act, but a habit for Namdapha residents.'}&rdquo;
                      </p>
                      {block.content.quoteAuthor && (
                        <div 
                          style={{
                            fontFamily: block.styles?.fontFamily || undefined,
                          }}
                          className="text-[11px] font-medium text-zinc-400 mt-2 font-sans"
                        >
                          — {block.content.quoteAuthor}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Image Banner Block */}
                {block.type === 'image' && (
                  <div
                    style={getBlockStyle(block.styles)}
                    className="flex flex-col items-center"
                  >
                    {block.content.src ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={block.content.src}
                        alt={block.content.alt || 'Banner'}
                        className="w-full rounded-xl object-cover max-h-64 border border-zinc-800"
                      />
                    ) : (
                      <div className="w-full h-36 rounded-xl bg-zinc-900/60 border border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500">
                        <span className="text-xs font-medium text-zinc-400">Image Banner Placeholder</span>
                        <span className="text-[10px] text-zinc-600 mt-0.5">Specify image URL in inspector</span>
                      </div>
                    )}
                    {block.content.caption && (
                      <p className="text-[11px] text-zinc-500 mt-1.5 italic text-center">
                        {block.content.caption}
                      </p>
                    )}
                  </div>
                )}

                {/* Badge Block */}
                {block.type === 'badge' && (
                  <div
                    style={getBlockStyle(block.styles)}
                    className="flex items-center justify-center my-1"
                  >
                    <span
                      style={{
                        backgroundColor: block.content.badgeBg || '#27272A',
                        color: block.content.badgeColor || '#FAFAFA',
                        fontFamily: block.styles?.fontFamily || undefined,
                        fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : '11px',
                        fontWeight: block.styles?.fontWeight || (block.styles?.bold ? '700' : '600'),
                        letterSpacing: block.styles?.letterSpacing || '0.08em',
                        textTransform: block.styles?.textTransform || 'uppercase',
                        borderRadius: block.styles?.borderRadius !== undefined ? `${block.styles.borderRadius}px` : '9999px',
                      }}
                      className="px-3 py-1 font-medium border border-zinc-700/60 inline-block shadow-sm"
                    >
                      {block.content.badgeText || 'OFFICIAL ANNOUNCEMENT'}
                    </span>
                  </div>
                )}

                {/* 2-Columns Block */}
                {block.type === 'columns' && (
                  <div
                    style={getBlockStyle(block.styles)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-1"
                  >
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                      <h4 
                        style={{
                          fontFamily: block.styles?.fontFamily || undefined,
                        }}
                        className="text-xs font-semibold text-zinc-200"
                      >
                        {block.content.col1Title || 'Left Column'}
                      </h4>
                      <p 
                        style={{
                          fontFamily: block.styles?.fontFamily || undefined,
                        }}
                        className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed"
                      >
                        {block.content.col1Text || 'Details for column one.'}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                      <h4 
                        style={{
                          fontFamily: block.styles?.fontFamily || undefined,
                        }}
                        className="text-xs font-semibold text-zinc-200"
                      >
                        {block.content.col2Title || 'Right Column'}
                      </h4>
                      <p 
                        style={{
                          fontFamily: block.styles?.fontFamily || undefined,
                        }}
                        className="text-xs text-zinc-400 whitespace-pre-line leading-relaxed"
                      >
                        {block.content.col2Text || 'Details for column two.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* 3-Columns Block */}
                {block.type === 'columns3' && (
                  <div
                    style={getBlockStyle(block.styles)}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-1"
                  >
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1 text-center">
                      <h4 
                        style={{ fontFamily: block.styles?.fontFamily || undefined }}
                        className="text-xs font-semibold text-zinc-200"
                      >
                        {block.content.col1Title || 'Milestone 1'}
                      </h4>
                      <p 
                        style={{ fontFamily: block.styles?.fontFamily || undefined }}
                        className="text-[11px] text-zinc-400 whitespace-pre-line leading-relaxed"
                      >
                        {block.content.col1Text || 'First phase update.'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1 text-center">
                      <h4 
                        style={{ fontFamily: block.styles?.fontFamily || undefined }}
                        className="text-xs font-semibold text-zinc-200"
                      >
                        {block.content.col2Title || 'Milestone 2'}
                      </h4>
                      <p 
                        style={{ fontFamily: block.styles?.fontFamily || undefined }}
                        className="text-[11px] text-zinc-400 whitespace-pre-line leading-relaxed"
                      >
                        {block.content.col2Text || 'Second phase update.'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1 text-center">
                      <h4 
                        style={{ fontFamily: block.styles?.fontFamily || undefined }}
                        className="text-xs font-semibold text-zinc-200"
                      >
                        {block.content.col3Title || 'Milestone 3'}
                      </h4>
                      <p 
                        style={{ fontFamily: block.styles?.fontFamily || undefined }}
                        className="text-[11px] text-zinc-400 whitespace-pre-line leading-relaxed"
                      >
                        {block.content.col3Text || 'Final event date.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Button Block */}
                {block.type === 'button' && (
                  <div
                    style={getBlockStyle(block.styles)}
                    className="my-2"
                  >
                    <a
                      href={block.content.url || '#'}
                      onClick={(e) => e.preventDefault()}
                      style={{
                        backgroundColor: block.content.buttonColor || '#FAFAFA',
                        color: block.content.textColor || '#09090B',
                        borderRadius: `${block.content.borderRadius || 8}px`,
                        fontFamily: block.styles?.fontFamily || undefined,
                        fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : '13px',
                        fontWeight: block.styles?.fontWeight || (block.styles?.bold ? '700' : '600'),
                        letterSpacing: block.styles?.letterSpacing || undefined,
                        textTransform: block.styles?.textTransform || undefined,
                      }}
                      className={`inline-flex items-center justify-center text-xs tracking-tight px-6 py-2.5 shadow-md transition-opacity hover:opacity-90 ${
                        block.content.fullWidth ? 'w-full' : ''
                      }`}
                    >
                      {block.content.buttonText || 'Sign Up Now →'}
                    </a>
                  </div>
                )}

                {/* Callout Block */}
                {block.type === 'callout' && (
                  <div style={getBlockStyle(block.styles)}>
                    <div 
                      style={{
                        backgroundColor: block.styles?.backgroundColor || 'rgba(24, 24, 27, 0.7)',
                        borderRadius: block.styles?.borderRadius !== undefined ? `${block.styles.borderRadius}px` : '10px',
                      }}
                      className="p-3.5 border border-zinc-700/80 flex items-start gap-2.5 my-1"
                    >
                      <AlertCircle className="w-4 h-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <h4 
                          style={{ fontFamily: block.styles?.fontFamily || undefined }}
                          className="text-xs font-semibold text-zinc-100"
                        >
                          {block.content.calloutTitle || 'Important Notice'}
                        </h4>
                        <p 
                          style={{
                            fontFamily: block.styles?.fontFamily || undefined,
                            fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : '12px',
                          }}
                          className="text-zinc-400 leading-relaxed whitespace-pre-line"
                        >
                          {block.content.calloutText || 'Notice details.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Links Block */}
                {block.type === 'social' && (
                  <div
                    style={getBlockStyle(block.styles)}
                    className="flex items-center justify-center gap-2 py-2"
                  >
                    <span className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors" title="Website">
                      <Globe className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors" title="Social">
                      <Share2 className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors" title="Portal">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                    <span className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors" title="Forum">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}

                {/* Divider Block */}
                {block.type === 'divider' && (
                  <div
                    style={getBlockStyle(block.styles)}
                    className="flex items-center justify-center my-2"
                  >
                    <div className="w-full h-[1px] bg-zinc-800" />
                  </div>
                )}

                {/* Spacer Block */}
                {block.type === 'spacer' && (
                  <div
                    style={{
                      height: `${block.content.height || 20}px`,
                    }}
                    className="flex items-center justify-center border border-dashed border-zinc-800/80 rounded my-0.5 text-[10px] text-zinc-500 font-mono"
                  >
                    Vertical Space ({block.content.height || 20}px)
                  </div>
                )}

                {/* Footer Block */}
                {block.type === 'footer' && (
                  <div
                    style={getBlockStyle(block.styles)}
                    className="border-t border-zinc-800/90 pt-4 space-y-1 text-center my-2"
                  >
                    <div 
                      style={{
                        fontFamily: block.styles?.fontFamily || undefined,
                        fontSize: block.styles?.fontSize ? `${block.styles.fontSize}px` : '12px',
                        color: block.styles?.color || '#D4D4D8',
                      }}
                      className="font-semibold text-zinc-300"
                    >
                      {block.content.organization || 'Namdapha House Secretariat'}
                    </div>
                    <div 
                      style={{ fontFamily: block.styles?.fontFamily || undefined }}
                      className="text-[11px] text-zinc-500"
                    >
                      {block.content.address || 'Hostel Zone, IIT Madras, Chennai 600036'}
                    </div>
                    <div 
                      style={{ fontFamily: block.styles?.fontFamily || undefined }}
                      className="text-[10px] text-zinc-600 italic pt-0.5"
                    >
                      {block.content.unsubscribeNotice || 'Official residential correspondence.'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

