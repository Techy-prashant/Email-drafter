import React, { useState } from 'react';
import { 
  LayoutTemplate, 
  Search, 
  Plus, 
  PenTool, 
  Copy, 
  Eye
} from 'lucide-react';
import { EmailTemplate } from '@/types';
import { Badge } from '../common/Badge';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { Modal } from '../common/Modal';

interface TemplateLibraryViewProps {
  templates: EmailTemplate[];
  onUseTemplate: (template: EmailTemplate) => void;
  onDuplicateTemplate: (template: EmailTemplate) => void;
  onCreateBlankTemplate: (title: string, category: EmailTemplate['category']) => void;
}

export const TemplateLibraryView: React.FC<TemplateLibraryViewProps> = ({
  templates,
  onUseTemplate,
  onDuplicateTemplate,
  onCreateBlankTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EmailTemplate['category']>('event');

  const categories = [
    { id: 'all', label: 'All Templates', count: templates.length },
    { id: 'event', label: 'Event Announcements', count: templates.filter(t => t.category === 'event').length },
    { id: 'recruitment', label: 'Recruitment', count: templates.filter(t => t.category === 'recruitment').length },
    { id: 'interview', label: 'Interview Schedules', count: templates.filter(t => t.category === 'interview').length },
    { id: 'meetup', label: 'Meetup Invitations', count: templates.filter(t => t.category === 'meetup').length },
    { id: 'results', label: 'Winners & Results', count: templates.filter(t => t.category === 'results').length },
    { id: 'general', label: 'General Announcements', count: templates.filter(t => t.category === 'general').length },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateBlankTemplate(newTitle.trim(), newCategory);
    setNewTitle('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-16">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Hostel Template Library
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Pre-designed, branded layouts ready for instant editing and IIT Madras student broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4.5 h-4.5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#121215] border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          {/* Create Blank Template CTA */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold shadow-sm transition-all flex-shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 border-b border-zinc-800 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm font-semibold'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                selectedCategory === cat.id
                  ? 'bg-zinc-950 text-zinc-200'
                  : 'bg-zinc-800/80 text-zinc-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#121215] border border-zinc-800 space-y-3">
          <LayoutTemplate className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Templates Found</h3>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            No layouts match your current category or query filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-sm text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl bg-[#121215] border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between group shadow-xl shadow-black/30"
            >
              {/* Template Card Thumbnail Header */}
              <div
                onClick={() => setPreviewTemplate(template)}
                className={`relative h-48 cursor-pointer bg-gradient-to-br ${template.thumbnailGradient || 'from-zinc-900 via-zinc-925 to-[#09090B]'} p-4.5 flex flex-col justify-between overflow-hidden border-b border-zinc-800`}
              >
                {/* Overlay hover effect */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <span className="px-3.5 py-2 rounded-xl bg-white/20 text-white text-sm font-medium flex items-center gap-2 shadow-lg">
                    <Eye className="w-4 h-4" />
                    <span>Quick Preview</span>
                  </span>
                </div>

                {/* Top Badge in Card */}
                <div className="relative z-10 flex items-center justify-between">
                  <Badge variant="zinc" size="sm">
                    {template.category.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-zinc-400 font-mono bg-[#121215]/90 px-2.5 py-0.5 rounded-md backdrop-blur-sm border border-zinc-800">
                    {template.blocks.length} Blocks
                  </span>
                </div>

                {/* Miniature Title Silhouette */}
                <div className="relative z-10 space-y-1">
                  <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">
                    Subject Line:
                  </span>
                  <p className="text-sm text-zinc-100 font-medium truncate drop-shadow-sm">
                    {template.subject}
                  </p>
                </div>
              </div>

              {/* Template Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>By {template.author}</span>
                  <span>{template.updatedAt}</span>
                </div>
              </div>

              {/* Action Buttons in Card */}
              <div className="px-5 pb-5 pt-1 flex items-center gap-2.5">
                <button
                  onClick={() => onDuplicateTemplate(template)}
                  className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                  title="Duplicate template"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium border border-zinc-800 transition-colors"
                >
                  <Eye className="w-4 h-4 text-zinc-400" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => onUseTemplate(template)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-sm font-semibold shadow-sm transition-all active:scale-95"
                >
                  <PenTool className="w-4 h-4" />
                  <span>Edit in Canvas</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Full Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={onUseTemplate}
        onDuplicateTemplate={onDuplicateTemplate}
      />

      {/* Blank Template Creator Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Blank Layout"
        subtitle="Establish a reusable template for your portfolio or hostel secretariat"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">
              Template Name
            </label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Sports Week Cricket Fixtures"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as EmailTemplate['category'])}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
            >
              <option value="event">Event Announcements</option>
              <option value="recruitment">Recruitment</option>
              <option value="interview">Interview Schedules</option>
              <option value="meetup">Meetup Invitations</option>
              <option value="results">Winners & Results</option>
              <option value="general">General Announcements</option>
              <option value="announcement">Official Announcement</option>
              <option value="newsletter">Hostel Newsletter</option>
              <option value="emergency">Emergency Alert</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold shadow-sm transition-colors text-sm"
            >
              Initialize Template
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
