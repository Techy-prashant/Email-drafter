import React, { useState } from 'react';
import { BookmarkCheck, X, FolderPlus } from 'lucide-react';
import { EmailTemplate } from '@/types';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle: string;
  onSave: (title: string, category: EmailTemplate['category'], description: string) => void;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  defaultTitle,
  onSave,
}) => {
  const [templateTitle, setTemplateTitle] = useState(defaultTitle);
  const [category, setCategory] = useState<EmailTemplate['category']>('announcement');
  const [description, setDescription] = useState('Reusable hostel council template.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateTitle.trim()) return;
    onSave(templateTitle.trim(), category, description.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <FolderPlus className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Save as Template</h3>
              <p className="text-xs text-zinc-400">Save current layout into the Template Library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 text-sm">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Template Title</label>
            <input
              type="text"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              placeholder="e.g. Monthly Council Report"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(['announcement', 'event', 'newsletter', 'emergency', 'formal'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3.5 rounded-xl border text-xs sm:text-sm font-medium capitalize text-left transition-all ${
                    category === cat
                      ? 'bg-zinc-800 border-zinc-500 text-white font-semibold'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief summary of when to use this template..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold shadow-sm transition-all flex items-center gap-2 active:scale-95"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Save Template</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
