import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Square, 
  CheckSquare, 
  RotateCw, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Inbox, 
  Tag, 
  Users, 
  Info, 
  ArrowLeft, 
  Archive, 
  Trash2, 
  Mail, 
  Clock, 
  CornerUpLeft, 
  CornerUpRight, 
  Printer, 
  CheckCircle2,
  Paperclip
} from 'lucide-react';
import { SentEmailRecord } from '@/types';
import { NamdaphaLogo } from '../common/NamdaphaLogo';

interface SentEmailsViewProps {
  sentRecords: SentEmailRecord[];
}

export const SentEmailsView: React.FC<SentEmailsViewProps> = ({ sentRecords }) => {
  const [activeTab, setActiveTab] = useState<'primary' | 'promotions' | 'social' | 'updates'>('primary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<SentEmailRecord | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>(['sent-1', 'sent-3', 'sent-7']);

  const filteredRecords = sentRecords.filter((rec) => {
    const matchesSearch = 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (rec.snippet && rec.snippet.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTab = activeTab === 'primary' 
      ? (!rec.category || rec.category === 'primary')
      : rec.category === activeTab;

    return matchesSearch && matchesTab;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStarredIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // If viewing an individual email
  if (selectedEmail) {
    const isStarred = starredIds.includes(selectedEmail.id);

    return (
      <div className="max-w-5xl mx-auto space-y-5 pb-16 animate-in fade-in duration-150">
        {/* Gmail Navigation & Action Header */}
        <div className="flex items-center justify-between py-2.5 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedEmail(null)}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
              title="Back to Mails Sent"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Mails Sent</span>
            </button>
            <div className="w-[1px] h-6 bg-zinc-800" />
            <button
              onClick={() => setSelectedEmail(null)}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Archive"
            >
              <Archive className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setSelectedEmail(null)}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setSelectedEmail(null)}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Mark as unread"
            >
              <Mail className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <button
              onClick={(e) => toggleStar(selectedEmail.id, e)}
              className={`p-2.5 rounded-xl transition-colors ${
                isStarred ? 'text-amber-400' : 'text-zinc-500 hover:text-amber-400'
              }`}
            >
              <Star className={`w-4.5 h-4.5 ${isStarred ? 'fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Print email"
            >
              <Printer className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Email Header Info */}
        <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-7 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-zinc-800">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {selectedEmail.subject}
                </h1>
                <span className="text-xs font-mono uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 px-2.5 py-0.5 rounded-md font-semibold">
                  Mails Sent
                </span>
              </div>
              <p className="text-sm text-zinc-400 font-mono">Template: {selectedEmail.title}</p>
            </div>
            <div className="text-sm text-zinc-400 font-mono whitespace-nowrap">
              {selectedEmail.dateStr || selectedEmail.sentAt} ({selectedEmail.timestamp || '5:05 PM'})
            </div>
          </div>

          {/* Sender & Recipient Metadata */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 font-bold text-base">
                {selectedEmail.from.slice(0, 1).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="text-base font-semibold text-white flex items-center gap-2">
                  <span>{selectedEmail.from}</span>
                </div>
                <div className="text-sm text-zinc-400 flex items-center gap-1.5">
                  <span className="text-zinc-500">to:</span>
                  <span className="text-zinc-300 font-mono">{selectedEmail.to || 'all-residents@namdapha.iitm.ac.in'}</span>
                </div>
                <div className="text-xs text-zinc-500">
                  Total Recipients: <span className="text-zinc-300 font-medium">{selectedEmail.recipientsCount} addresses</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-300 bg-zinc-800/80 border border-zinc-700 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Delivered via Council Gmail</span>
            </div>
          </div>

          {/* Visual Email Body */}
          <div className="pt-5 border-t border-zinc-800">
            <div className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-3.5">
              Rendered Email Content
            </div>

            <div className="max-w-2xl mx-auto rounded-2xl bg-[#09090B] border border-zinc-800 p-7 shadow-inner space-y-4 text-zinc-200">
              {/* If email has custom blocks, render preview cards */}
              {selectedEmail.blocks && selectedEmail.blocks.length > 0 ? (
                selectedEmail.blocks.map((block) => (
                  <div key={block.id} className="py-1.5">
                    {block.type === 'header' && (
                      <div className="flex flex-col items-center justify-center py-2.5">
                        <NamdaphaLogo size="md" showText={false} />
                        <div className="text-xs font-semibold tracking-widest text-zinc-400 uppercase mt-2">
                          {block.content.text || 'NAMDAPHA HOUSE'}
                        </div>
                      </div>
                    )}
                    {block.type === 'heading' && (
                      <h2 className="text-2xl font-bold text-white text-center">
                        {block.content.text || selectedEmail.subject}
                      </h2>
                    )}
                    {block.type === 'text' && (
                      <div
                        className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{
                          __html: block.content.html || `<p>${selectedEmail.snippet}</p>`,
                        }}
                      />
                    )}
                    {block.type === 'button' && (
                      <div className="text-center py-3.5">
                        <span className="inline-block px-6 py-2.5 rounded-xl bg-white text-zinc-950 text-sm font-semibold shadow-sm">
                          {block.content.buttonText || 'Take Action →'}
                        </span>
                      </div>
                    )}
                    {block.type === 'footer' && (
                      <div className="text-center text-xs text-zinc-500 border-t border-zinc-800 pt-3.5 mt-5">
                        <div>{block.content.organization || 'Namdapha House Secretariat'}</div>
                        <div>{block.content.address || 'IIT Madras, Chennai 600036'}</div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="space-y-3.5 py-2">
                  <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                    {selectedEmail.snippet || 'Dear Residents, this is an official broadcast notification from the Namdapha House Secretariat regarding the upcoming events and facilities schedule.'}
                  </p>
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                    Please make sure to review the deadlines outlined above and reach out to your wing representative for any questions.
                  </p>
                  <div className="pt-4 border-t border-zinc-800 text-sm text-zinc-500">
                    <span className="font-semibold text-zinc-400">Namdapha House Council</span> &bull; IIT Madras
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reply / Forward Actions */}
          <div className="pt-5 flex items-center gap-3 border-t border-zinc-800">
            <button
              onClick={() => alert('Reply window opened')}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
            >
              <CornerUpLeft className="w-4 h-4" />
              <span>Reply</span>
            </button>
            <button
              onClick={() => alert('Forward window opened')}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-sm font-medium text-zinc-300 hover:text-white flex items-center gap-2 transition-colors"
            >
              <CornerUpRight className="w-4 h-4" />
              <span>Forward</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Gmail Inbox / Sent Table View
  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-16">
      {/* Gmail Top Search Bar */}
      <div className="flex items-center gap-3.5">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-zinc-500 absolute left-4.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in mail..."
            className="w-full pl-12 pr-12 py-3 rounded-2xl bg-[#121215] border border-zinc-800 text-base text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors shadow-lg shadow-black/20"
          />
          <button 
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Search options"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Gmail Status Pill */}
        <div className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#121215] border border-zinc-800 text-sm font-medium text-zinc-300 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Active</span>
        </div>
      </div>

      {/* Gmail Main Window Frame */}
      <div className="rounded-2xl bg-[#121215] border border-zinc-800 overflow-hidden shadow-2xl">
        {/* Action Toolbar */}
        <div className="px-5 py-2.5 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-2 sm:gap-3 text-zinc-400">
            <button
              onClick={toggleSelectAll}
              className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
              title="Select all"
            >
              {selectedIds.length > 0 && selectedIds.length === filteredRecords.length ? (
                <CheckSquare className="w-4.5 h-4.5 text-white" />
              ) : (
                <Square className="w-4.5 h-4.5" />
              )}
            </button>
            <button
              onClick={() => {}}
              className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
              title="Refresh"
            >
              <RotateCw className="w-4.5 h-4.5" />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-zinc-800 hover:text-white transition-colors"
              title="More"
            >
              <MoreVertical className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-400 font-mono">
            <span>
              1–{filteredRecords.length} of {filteredRecords.length}
            </span>
            <div className="flex items-center gap-1 ml-1">
              <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 disabled:opacity-30" disabled>
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 disabled:opacity-30" disabled>
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Gmail Category Tabs */}
        <div className="grid grid-cols-4 border-b border-zinc-800 bg-[#121215] text-sm font-medium">
          {/* Primary Tab */}
          <button
            onClick={() => setActiveTab('primary')}
            className={`flex items-center justify-center sm:justify-start gap-2.5 px-4 sm:px-6 py-3.5 transition-colors relative ${
              activeTab === 'primary'
                ? 'text-white font-semibold bg-zinc-850/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'
            }`}
          >
            <Inbox className="w-4.5 h-4.5" />
            <span className="hidden sm:inline">Primary</span>
            {activeTab === 'primary' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>

          {/* Promotions Tab */}
          <button
            onClick={() => setActiveTab('promotions')}
            className={`flex items-center justify-center sm:justify-start gap-2.5 px-4 sm:px-6 py-3.5 transition-colors relative ${
              activeTab === 'promotions'
                ? 'text-white font-semibold bg-zinc-850/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'
            }`}
          >
            <Tag className="w-4.5 h-4.5" />
            <span className="hidden sm:inline">Promotions</span>
            <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-medium border border-zinc-700">
              50 new
            </span>
            {activeTab === 'promotions' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>

          {/* Social Tab */}
          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center justify-center sm:justify-start gap-2.5 px-4 sm:px-6 py-3.5 transition-colors relative ${
              activeTab === 'social'
                ? 'text-white font-semibold bg-zinc-850/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span className="hidden sm:inline">Social</span>
            {activeTab === 'social' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>

          {/* Updates Tab */}
          <button
            onClick={() => setActiveTab('updates')}
            className={`flex items-center justify-center sm:justify-start gap-2.5 px-4 sm:px-6 py-3.5 transition-colors relative ${
              activeTab === 'updates'
                ? 'text-white font-semibold bg-zinc-850/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/20'
            }`}
          >
            <Info className="w-4.5 h-4.5" />
            <span className="hidden sm:inline">Updates</span>
            <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-medium border border-zinc-700">
              50 new
            </span>
            {activeTab === 'updates' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
            )}
          </button>
        </div>

        {/* Gmail Email List Rows */}
        <div className="divide-y divide-zinc-800/70">
          {filteredRecords.length === 0 ? (
            <div className="p-16 text-center text-zinc-400 space-y-2.5">
              <Mail className="w-10 h-10 mx-auto text-zinc-600 opacity-60" />
              <p className="text-sm">No sent mails found in this category.</p>
            </div>
          ) : (
            filteredRecords.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isStarred = starredIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedEmail(item)}
                  className={`flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-colors group select-none ${
                    isSelected
                      ? 'bg-zinc-800/70'
                      : 'hover:bg-zinc-800/30 bg-[#121215]'
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => toggleSelectOne(item.id, e)}
                    className="text-zinc-600 hover:text-zinc-300 flex-shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4.5 h-4.5 text-white" />
                    ) : (
                      <Square className="w-4.5 h-4.5" />
                    )}
                  </button>

                  {/* Star */}
                  <button
                    onClick={(e) => toggleStar(item.id, e)}
                    className={`flex-shrink-0 transition-colors ${
                      isStarred ? 'text-amber-400' : 'text-zinc-600 hover:text-amber-400'
                    }`}
                  >
                    <Star className={`w-4.5 h-4.5 ${isStarred ? 'fill-amber-400' : ''}`} />
                  </button>

                  {/* Sender Name */}
                  <div className="w-40 sm:w-52 flex-shrink-0 truncate text-sm font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    {item.from.replace(/<[^>]*>?/gm, '').trim()}
                  </div>

                  {/* Subject and Snippet */}
                  <div className="flex-1 min-w-0 text-sm truncate flex items-center gap-2">
                    <span className="font-semibold text-zinc-100 truncate">
                      {item.subject}
                    </span>
                    <span className="text-zinc-400 font-normal truncate hidden sm:inline">
                      - {item.snippet || 'Official residential update from council...'}
                    </span>
                  </div>

                  {/* Date / Time */}
                  <div className="flex-shrink-0 text-xs font-mono text-zinc-400 group-hover:text-zinc-300 transition-colors text-right whitespace-nowrap pl-2">
                    {item.dateStr || item.timestamp || item.sentAt}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
