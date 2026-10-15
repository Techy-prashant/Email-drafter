import React, { useState } from 'react';
import { 
  X, 
  Minus, 
  Maximize2, 
  Send, 
  Paperclip, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Users,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { EmailBlock, SentEmailRecord } from '@/types';

interface GmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailTitle: string;
  defaultSubject: string;
  blocks: EmailBlock[];
  onSendSuccess: (record: SentEmailRecord) => void;
}

export const GmailComposeModal: React.FC<GmailComposeModalProps> = ({
  isOpen,
  onClose,
  emailTitle,
  defaultSubject,
  blocks,
  onSendSuccess,
}) => {
  const [toInput, setToInput] = useState('all-residents@namdapha.iitm.ac.in');
  const [recipientsList, setRecipientsList] = useState<string[]>([
    'all-residents@namdapha.iitm.ac.in'
  ]);
  const [subject, setSubject] = useState(defaultSubject);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkListText, setBulkListText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'recipients'>('preview');

  if (!isOpen) return null;

  const quickGroups = [
    { name: 'All Residents', email: 'all-residents@namdapha.iitm.ac.in', count: 640 },
    { name: 'Council Execs', email: 'council@namdapha.iitm.ac.in', count: 14 },
    { name: 'Wing A', email: 'wing-a@namdapha.iitm.ac.in', count: 108 },
    { name: 'Wing B-C', email: 'wings-bc@namdapha.iitm.ac.in', count: 215 },
    { name: 'Wardens', email: 'warden@namdapha.iitm.ac.in', count: 4 },
  ];

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = toInput.trim().replace(',', '');
      if (trimmed && !recipientsList.includes(trimmed)) {
        setRecipientsList((prev) => [...prev, trimmed]);
        setToInput('');
      }
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setRecipientsList((prev) => prev.filter((r) => r !== email));
  };

  const handleApplyBulkText = () => {
    const parsed = bulkListText
      .split(/[\n,;]+/)
      .map((e) => e.trim())
      .filter((e) => e.includes('@'));
    if (parsed.length > 0) {
      setRecipientsList((prev) => Array.from(new Set([...prev, ...parsed])));
      setBulkListText('');
      setIsBulkMode(false);
    }
  };

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);

      const recipientCount = recipientsList.includes('all-residents@namdapha.iitm.ac.in')
        ? 640
        : Math.max(recipientsList.length, 1);

      const newRecord: SentEmailRecord = {
        id: `sent-${Date.now()}`,
        title: emailTitle,
        subject: subject,
        from: 'Namdapha Secretariat <namdapha@iitm.ac.in>',
        to: recipientsList.join(', '),
        sentAt: 'Just now',
        timestamp: '5:05 PM',
        dateStr: 'Oct 15',
        status: 'delivered',
        recipientsCount: recipientCount,
        openRate: 0,
        clickRate: 0,
        blocks: JSON.parse(JSON.stringify(blocks)),
        category: 'primary',
        isStarred: false,
        snippet: blocks[1]?.content?.html?.replace(/<[^>]*>?/gm, '').slice(0, 80) || 'Official notification from council...',
      };

      setTimeout(() => {
        onSendSuccess(newRecord);
        onClose();
        setSendSuccess(false);
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gmail-Style Header */}
        <div className="px-6 py-4 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
              <Send className="w-4 h-4" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-white">
              New Message &bull; Dispatch Mailer
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-zinc-400">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Sender Info */}
        <div className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between text-sm text-zinc-400 bg-[#121215]">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-400">From:</span>
            <span className="text-zinc-200 font-medium">Namdapha Secretariat &lt;namdapha@iitm.ac.in&gt;</span>
          </div>
          <span className="text-xs font-mono bg-zinc-900 text-zinc-300 px-2.5 py-0.5 rounded border border-zinc-800">
            Gmail SMTP Active
          </span>
        </div>

        {/* Recipients / 'To' Field */}
        <div className="px-6 py-3 border-b border-zinc-800 flex flex-wrap items-center gap-2.5 text-sm bg-[#121215]">
          <span className="font-medium text-zinc-400 mr-1">To:</span>

          {/* Pill tags for recipients */}
          {recipientsList.map((email) => (
            <span
              key={email}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/90 border border-zinc-700 text-zinc-200 text-xs sm:text-sm font-mono"
            >
              <span>{email}</span>
              <button
                type="button"
                onClick={() => handleRemoveRecipient(email)}
                className="hover:text-red-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {/* Input for more */}
          <input
            type="text"
            value={toInput}
            onChange={(e) => setToInput(e.target.value)}
            onKeyDown={handleAddRecipient}
            placeholder={recipientsList.length === 0 ? "Type email address and press Enter..." : "Add more..."}
            className="flex-1 min-w-[180px] bg-transparent text-sm text-white focus:outline-none placeholder-zinc-500"
          />

          <button
            type="button"
            onClick={() => setIsBulkMode(!isBulkMode)}
            className="text-xs sm:text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 ml-auto bg-zinc-800/80 hover:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
            <span>Bulk Import (CSV / Excel)</span>
          </button>
        </div>

        {/* Quick Group Presets */}
        <div className="px-6 py-2.5 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs bg-zinc-900/30">
          <span className="text-zinc-500 text-xs uppercase font-semibold mr-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Quick:</span>
          </span>
          {quickGroups.map((g) => (
            <button
              key={g.email}
              type="button"
              onClick={() => {
                if (!recipientsList.includes(g.email)) {
                  setRecipientsList((prev) => [...prev, g.email]);
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              <span>{g.name}</span>
              <span className="text-xs text-zinc-400 font-mono">({g.count})</span>
            </button>
          ))}
        </div>

        {/* Bulk Mode Drawer */}
        {isBulkMode && (
          <div className="p-5 bg-zinc-900/80 border-b border-zinc-800 space-y-3 animate-in slide-in-from-top-2 duration-150 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-200">Paste bulk email addresses (comma or newline separated):</span>
              <span className="text-xs text-zinc-400 font-mono">Excel / CSV Supported</span>
            </div>
            <textarea
              value={bulkListText}
              onChange={(e) => setBulkListText(e.target.value)}
              placeholder="roll1@ds.study.iitm.ac.in&#10;roll2@ds.study.iitm.ac.in&#10;roll3@ds.study.iitm.ac.in..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-mono resize-none"
            />
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkMode(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyBulkText}
                className="px-4.5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold shadow-sm transition-colors"
              >
                Import Addresses
              </button>
            </div>
          </div>
        )}

        {/* Subject Line Field */}
        <div className="px-6 py-3 border-b border-zinc-800 flex items-center gap-2.5 text-sm bg-[#121215]">
          <span className="font-medium text-zinc-400 min-w-16">Subject:</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject line of broadcast..."
            className="flex-1 bg-transparent text-sm text-white font-medium focus:outline-none placeholder-zinc-500"
          />
        </div>

        {/* Body Preview Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#09090B] custom-scrollbar min-h-[260px]">
          <div className="max-w-xl mx-auto rounded-2xl bg-[#121215] border border-zinc-800 p-6 shadow-lg space-y-4">
            <div className="text-center pb-3 border-b border-zinc-800">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold">
                Namdapha House IIT Madras
              </span>
              <h2 className="text-lg font-semibold text-white mt-1.5">{emailTitle}</h2>
              <p className="text-sm text-zinc-400 mt-0.5">{subject}</p>
            </div>

            <div className="space-y-2.5 text-sm text-zinc-300">
              {blocks.slice(0, 4).map((b, i) => (
                <div key={b.id || i} className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-xs font-mono uppercase text-zinc-400 font-semibold block mb-1">
                    {b.type}
                  </span>
                  <p className="text-sm text-zinc-200 line-clamp-2">
                    {b.content.text || b.content.quoteText || b.content.calloutTitle || b.content.buttonText || 'Content block rendered...'}
                  </p>
                </div>
              ))}
              {blocks.length > 4 && (
                <div className="text-center text-xs text-zinc-500 italic pt-1">
                  + {blocks.length - 4} more formatted blocks ready for sending
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gmail Bottom Control Bar */}
        <div className="px-6 py-4 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Big Send Button */}
            <button
              onClick={handleSend}
              disabled={isSending || recipientsList.length === 0}
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 disabled:opacity-40 text-zinc-950 font-semibold text-sm shadow-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'Dispatching...' : sendSuccess ? 'Dispatched!' : 'Send Now'}</span>
            </button>

            {/* Simulated Test Send to Personal Inbox */}
            <button
              onClick={() => {
                alert('Test copy dispatched to your logged-in Google inbox.');
              }}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-sm font-medium transition-colors"
              title="Send a sample preview to your own email"
            >
              <Eye className="w-4 h-4 text-zinc-400" />
              <span>Test Preview</span>
            </button>
          </div>

          <div className="flex items-center gap-3.5 text-zinc-400 text-sm">
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
              {recipientsList.length} recipient{recipientsList.length === 1 ? '' : 's'}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:text-red-400 hover:bg-zinc-800 transition-colors"
              title="Discard draft"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
