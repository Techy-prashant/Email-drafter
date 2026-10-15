import React, { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  Monitor, 
  Smartphone, 
  Code, 
  Send, 
  Check, 
  BookmarkCheck,
  Edit2
} from 'lucide-react';

interface CanvasToolbarProps {
  emailTitle: string;
  onUpdateTitle: (title: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  previewDevice: 'desktop' | 'mobile';
  onChangeDevice: (device: 'desktop' | 'mobile') => void;
  isSaving: boolean;
  lastSaved: string;
  onOpenHtmlPreview: () => void;
  onOpenSaveTemplate: () => void;
  onOpenSendModal: () => void;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  emailTitle,
  onUpdateTitle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  previewDevice,
  onChangeDevice,
  isSaving,
  lastSaved,
  onOpenHtmlPreview,
  onOpenSaveTemplate,
  onOpenSendModal,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(emailTitle);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim()) {
      onUpdateTitle(tempTitle.trim());
    } else {
      setTempTitle(emailTitle);
    }
  };

  return (
    <div className="h-16 px-4 sm:px-6 bg-[#111113] border-b border-zinc-800 flex items-center justify-between gap-4 select-none flex-shrink-0">
      {/* Left: Email Title & Save Indicator */}
      <div className="flex items-center gap-3.5 min-w-0">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-600 text-sm font-semibold text-zinc-100 focus:outline-none w-64 sm:w-80"
            />
            <button
              onClick={handleTitleSubmit}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-200 hover:text-white"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setTempTitle(emailTitle);
              setIsEditingTitle(true);
            }}
            className="flex items-center gap-2.5 px-2.5 py-1.5 -ml-2 rounded-lg hover:bg-zinc-800/50 transition-colors group text-left max-w-xs sm:max-w-md truncate"
            title="Click to rename email"
          >
            <span className="text-sm sm:text-base font-semibold text-zinc-100 group-hover:text-white transition-colors truncate">
              {emailTitle}
            </span>
            <Edit2 className="w-3.5 h-3.5 text-zinc-500 opacity-60 group-hover:opacity-100 transition-opacity" />
          </button>
        )}

        {/* Save Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{isSaving ? 'Saving...' : `Saved ${lastSaved}`}</span>
        </div>
      </div>

      {/* Center: Device Switcher & History Undo/Redo */}
      <div className="flex items-center gap-2.5">
        {/* Undo / Redo */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg transition-colors ${
              canUndo
                ? 'text-zinc-200 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg transition-colors ${
              canRedo
                ? 'text-zinc-200 hover:text-white hover:bg-zinc-800'
                : 'text-zinc-600 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
          <button
            onClick={() => onChangeDevice('desktop')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              previewDevice === 'desktop'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Desktop Canvas"
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => onChangeDevice('mobile')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              previewDevice === 'mobile'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Mobile Viewport"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Right: Inspect HTML, Save [Green], Send [Theme Color] */}
      <div className="flex items-center gap-2.5">
        {/* Inspect HTML Code */}
        <button
          onClick={onOpenHtmlPreview}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-800 transition-colors"
          title="Inspect HTML code & inline CSS"
        >
          <Code className="w-4 h-4 text-zinc-400" />
          <span className="hidden md:inline">Inspect HTML</span>
        </button>

        {/* Save [Green button] - saves into template by asking template name */}
        <button
          onClick={onOpenSaveTemplate}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 text-emerald-300 text-xs font-semibold border border-emerald-800/50 shadow-sm transition-colors"
          title="Save as reusable HTML template"
        >
          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
          <span>Save</span>
        </button>

        {/* Send [White primary button] - opens Gmail-style Draft/Compose box */}
        <button
          onClick={onOpenSendModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-zinc-200 text-xs shadow-sm transition-colors"
          title="Send email (single, bulk, test) via Gmail"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
