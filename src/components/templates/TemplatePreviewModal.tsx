import React, { useState } from 'react';
import { Monitor, Smartphone, PenTool, Copy } from 'lucide-react';
import { EmailTemplate } from '@/types';
import { Modal } from '../common/Modal';
import { EmailCanvas } from '../canvas/EmailCanvas';

interface TemplatePreviewModalProps {
  template: EmailTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: EmailTemplate) => void;
  onDuplicateTemplate: (template: EmailTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate,
  onDuplicateTemplate,
}) => {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  if (!template) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template.title}
      subtitle={`Category: ${template.category.toUpperCase()} • Created by ${template.author}`}
      maxWidth="4xl"
    >
      <div className="space-y-5">
        {/* Toolbar in Modal */}
        <div className="flex flex-wrap items-center justify-between gap-3.5 pb-3.5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-zinc-400">Preview Device:</span>
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  previewDevice === 'desktop'
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>Desktop (600px)</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  previewDevice === 'mobile'
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile (375px)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onDuplicateTemplate(template);
                onClose();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium border border-zinc-800 transition-colors"
            >
              <Copy className="w-4 h-4 text-zinc-400" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={() => {
                onUseTemplate(template);
                onClose();
              }}
              className="flex items-center gap-2 px-4.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              <PenTool className="w-4 h-4" />
              <span>Open in Canvas Studio</span>
            </button>
          </div>
        </div>

        {/* Canvas Render in Modal */}
        <div className="max-h-[580px] overflow-y-auto rounded-2xl bg-[#09090B] border border-zinc-800 p-6 flex justify-center custom-scrollbar">
          <EmailCanvas
            blocks={template.blocks}
            selectedBlockId={null}
            onSelectBlock={() => {}}
            onMoveBlock={() => {}}
            onDuplicateBlock={() => {}}
            onDeleteBlock={() => {}}
            previewDevice={previewDevice}
          />
        </div>
      </div>
    </Modal>
  );
};
