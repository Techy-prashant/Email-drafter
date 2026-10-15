import React, { useState, useCallback } from 'react';
import { EmailBlock, BlockType, EmailTemplate, SentEmailRecord } from '@/types';
import { CanvasToolbar } from './CanvasToolbar';
import { ComponentPalette } from './ComponentPalette';
import { EmailCanvas } from './EmailCanvas';
import { CanvasInspector } from './CanvasInspector';
import { HtmlPreviewModal } from './HtmlPreviewModal';
import { SaveTemplateModal } from './SaveTemplateModal';
import { GmailComposeModal } from './GmailComposeModal';

interface CanvasStudioViewProps {
  initialTitle?: string;
  initialSubject?: string;
  initialPreheader?: string;
  initialBlocks: EmailBlock[];
  onSaveTemplate?: (title: string, category: EmailTemplate['category'], description: string, blocks: EmailBlock[]) => void;
  onSendEmail?: (record: SentEmailRecord) => void;
}

export const CanvasStudioView: React.FC<CanvasStudioViewProps> = ({
  initialTitle = 'Namdapha Monsoon GBM & Cultural Assembly',
  initialSubject = '[Namdapha] Notice: Monsoon Term GBM & Cultural Night',
  initialPreheader = 'Review hostel finances, voice your concerns, and enjoy high tea.',
  initialBlocks,
  onSaveTemplate,
  onSendEmail,
}) => {
  // State for Email Properties
  const [emailTitle, setEmailTitle] = useState(initialTitle);
  const [subject, setSubject] = useState(initialSubject);
  const [preheader, setPreheader] = useState(initialPreheader);
  const [cardColor, setCardColor] = useState('#141417');
  const [maxWidth, setMaxWidth] = useState(600);

  // Blocks & History for Undo/Redo
  const [blocks, setBlocks] = useState<EmailBlock[]>(initialBlocks);
  const [history, setHistory] = useState<EmailBlock[][]>([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Selected block for right inspector
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Device & View Settings
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState('just now');

  // Modals
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  // Helper to commit block state to history
  const updateBlocksWithHistory = (newBlocks: EmailBlock[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newBlocks);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setBlocks(newBlocks);

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved('just now');
    }, 500);
  };

  // Undo & Redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setBlocks(history[prevIndex]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setBlocks(history[nextIndex]);
    }
  }, [historyIndex, history]);

  // Add block from Left Palette
  const handleAddBlock = (type: BlockType) => {
    const newId = `block-${Date.now()}`;
    let newBlock: EmailBlock;

    switch (type) {
      case 'header':
        newBlock = {
          id: newId,
          type: 'header',
          content: {
            text: 'NAMDAPHA HOUSE',
            caption: 'Excellence • Unity • Heritage',
            logoUrl: 'https://raw.githubusercontent.com/Techy-prashant/images_workIITM/refs/heads/main/Namdapha%20logos/Namdapha_bg_colored_rect.png',
            logoRadius: 14,
          },
          styles: { align: 'center', paddingTop: 20, paddingBottom: 14, color: '#E4E4E7' },
        };
        break;
      case 'heading':
        newBlock = {
          id: newId,
          type: 'heading',
          content: { text: 'New Section Headline', level: 'h2' },
          styles: { align: 'center', color: '#F8FAFC', paddingTop: 8, paddingBottom: 8 },
        };
        break;
      case 'text':
        newBlock = {
          id: newId,
          type: 'text',
          content: { html: '<p>Write your detailed update here. You can use dynamic tags like {{name}} to personalize.</p>' },
          styles: { align: 'left', color: '#CBD5E1', fontSize: 15, paddingTop: 4, paddingBottom: 8 },
        };
        break;
      case 'quote':
        newBlock = {
          id: newId,
          type: 'quote',
          content: {
            quoteText: 'The strength of the wolf is the pack, and the strength of the pack is the wolf.',
            quoteAuthor: 'Namdapha House Charter',
          },
          styles: { paddingTop: 6, paddingBottom: 8 },
        };
        break;
      case 'image':
        newBlock = {
          id: newId,
          type: 'image',
          content: {
            src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
            alt: 'House Event Banner',
            caption: 'Namdapha Community Showcase',
            aspectRatio: 'banner',
          },
          styles: { paddingTop: 8, paddingBottom: 12 },
        };
        break;
      case 'button':
        newBlock = {
          id: newId,
          type: 'button',
          content: {
            buttonText: 'Confirm Attendance →',
            url: 'https://namdapha.iitm.ac.in',
            buttonColor: '#4F46E5',
            textColor: '#FFFFFF',
            borderRadius: 8,
          },
          styles: { align: 'center', paddingTop: 10, paddingBottom: 16 },
        };
        break;
      case 'badge':
        newBlock = {
          id: newId,
          type: 'badge',
          content: {
            badgeText: 'IMPORTANT ANNOUNCEMENT',
            badgeBg: '#1E1B4B',
            badgeColor: '#A5B4FC',
          },
          styles: { align: 'center', paddingTop: 4, paddingBottom: 6 },
        };
        break;
      case 'columns':
        newBlock = {
          id: newId,
          type: 'columns',
          content: {
            col1Title: 'Track A: Technical & Lit',
            col1Text: 'Hackathon discussions, quiz round, and debating tryouts.',
            col2Title: 'Track B: Sports & Cultural',
            col2Text: 'Inter-hostel sports league registration & musical night.',
          },
          styles: { paddingTop: 8, paddingBottom: 12 },
        };
        break;
      case 'columns3':
        newBlock = {
          id: newId,
          type: 'columns3',
          content: {
            col1Title: 'Phase 1: Nominations',
            col1Text: 'Submit council portfolio forms by Friday 5 PM.',
            col2Title: 'Phase 2: Scrutiny',
            col2Text: 'Warden office verification and eligibility checks.',
            col3Title: 'Phase 3: Elections',
            col3Text: 'Secret residential electronic voting window.',
          },
          styles: { paddingTop: 8, paddingBottom: 12 },
        };
        break;
      case 'callout':
        newBlock = {
          id: newId,
          type: 'callout',
          content: {
            calloutTitle: 'Advisory for Hostel Residents',
            calloutText: 'Hostel gate closes at 11:00 PM during mid-semester examination week.',
            calloutType: 'important',
          },
          styles: { paddingTop: 8, paddingBottom: 12 },
        };
        break;
      case 'social':
        newBlock = {
          id: newId,
          type: 'social',
          content: {},
          styles: { align: 'center', paddingTop: 8, paddingBottom: 10 },
        };
        break;
      case 'divider':
        newBlock = {
          id: newId,
          type: 'divider',
          content: { style: 'glow' },
          styles: { paddingTop: 8, paddingBottom: 8 },
        };
        break;
      case 'spacer':
        newBlock = {
          id: newId,
          type: 'spacer',
          content: { height: 24 },
        };
        break;
      case 'footer':
        newBlock = {
          id: newId,
          type: 'footer',
          content: {
            organization: 'Namdapha House Secretariat',
            address: 'Hostel Zone, IIT Madras, Chennai 600036',
            unsubscribeNotice: 'Official residential correspondence to enrolled hostel students.',
          },
          styles: { align: 'center', paddingTop: 16, paddingBottom: 24 },
        };
        break;
      default:
        newBlock = {
          id: newId,
          type: 'text',
          content: { html: '<p>Custom block content</p>' },
        };
    }

    let nextBlocks: EmailBlock[];
    if (selectedBlockId) {
      const idx = blocks.findIndex((b) => b.id === selectedBlockId);
      nextBlocks = [...blocks.slice(0, idx + 1), newBlock, ...blocks.slice(idx + 1)];
    } else {
      nextBlocks = [...blocks, newBlock];
    }

    updateBlocksWithHistory(nextBlocks);
    setSelectedBlockId(newId);
  };

  // Reorder / Duplicate / Delete
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    updateBlocksWithHistory(newBlocks);
  };

  const handleDuplicateBlock = (index: number) => {
    const blockToCopy = blocks[index];
    const duplicated: EmailBlock = {
      ...blockToCopy,
      id: `block-${Date.now()}`,
    };
    const newBlocks = [...blocks.slice(0, index + 1), duplicated, ...blocks.slice(index + 1)];
    updateBlocksWithHistory(newBlocks);
    setSelectedBlockId(duplicated.id);
  };

  const handleDeleteBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    updateBlocksWithHistory(newBlocks);
    setSelectedBlockId(null);
  };

  // Inspector updates selected block
  const handleUpdateBlock = (updated: EmailBlock) => {
    const newBlocks = blocks.map((b) => (b.id === updated.id ? updated : b));
    updateBlocksWithHistory(newBlocks);
  };

  const handleDeleteSelected = () => {
    if (!selectedBlockId) return;
    const newBlocks = blocks.filter((b) => b.id !== selectedBlockId);
    updateBlocksWithHistory(newBlocks);
    setSelectedBlockId(null);
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#09090B]">
      {/* Canvas Top Toolbar */}
      <CanvasToolbar
        emailTitle={emailTitle}
        onUpdateTitle={setEmailTitle}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        previewDevice={previewDevice}
        onChangeDevice={setPreviewDevice}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onOpenHtmlPreview={() => setIsHtmlModalOpen(true)}
        onOpenSaveTemplate={() => setIsSaveModalOpen(true)}
        onOpenSendModal={() => setIsSendModalOpen(true)}
      />

      {/* Main 3-Column Studio Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Component Palette */}
        <div className="hidden md:block">
          <ComponentPalette onAddBlock={handleAddBlock} />
        </div>

        {/* Central Canvas Workspace - Scrollable */}
        <EmailCanvas
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
          onMoveBlock={handleMoveBlock}
          onDuplicateBlock={handleDuplicateBlock}
          onDeleteBlock={handleDeleteBlock}
          onUpdateBlock={handleUpdateBlock}
          previewDevice={previewDevice}
          cardColor={cardColor}
          maxWidth={maxWidth}
        />

        {/* Right Contextual Inspector */}
        <div className="hidden lg:block">
          <CanvasInspector
            selectedBlock={selectedBlock}
            onUpdateBlock={handleUpdateBlock}
            onDeleteSelected={handleDeleteSelected}
            subject={subject}
            onUpdateSubject={setSubject}
            preheader={preheader}
            onUpdatePreheader={setPreheader}
            cardColor={cardColor}
            onUpdateCardColor={setCardColor}
            maxWidth={maxWidth}
            onUpdateMaxWidth={setMaxWidth}
          />
        </div>
      </div>

      {/* HTML Inspection Modal */}
      <HtmlPreviewModal
        isOpen={isHtmlModalOpen}
        onClose={() => setIsHtmlModalOpen(false)}
        emailTitle={emailTitle}
        subject={subject}
        preheader={preheader}
        blocks={blocks}
        cardColor={cardColor}
        maxWidth={maxWidth}
      />

      {/* Save Template Modal */}
      <SaveTemplateModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        defaultTitle={emailTitle}
        onSave={(title, category, description) => {
          if (onSaveTemplate) {
            onSaveTemplate(title, category, description, blocks);
          }
        }}
      />

      {/* Gmail Compose / Send Modal */}
      <GmailComposeModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        emailTitle={emailTitle}
        defaultSubject={subject}
        blocks={blocks}
        onSendSuccess={(record) => {
          if (onSendEmail) {
            onSendEmail(record);
          }
        }}
      />
    </div>
  );
};
