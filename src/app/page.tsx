'use client';

import React, { useState } from 'react';
import { ViewMode, EmailDraft, EmailTemplate, EmailBlock, SentEmailRecord, TaskItem } from '@/types';
import { MOCK_DRAFTS, MOCK_TEMPLATES, MOCK_SENT_EMAILS, MOCK_TASKS, INITIAL_EMAIL_BLOCKS } from '@/data/mockData';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { HomeView } from '@/components/home/HomeView';
import { CanvasStudioView } from '@/components/canvas/CanvasStudioView';
import { TasksView } from '@/components/tasks/TasksView';
import { TemplateLibraryView } from '@/components/templates/TemplateLibraryView';
import { SentEmailsView } from '@/components/sent/SentEmailsView';
import { Menu, Plus } from 'lucide-react';
import { NamdaphaLogo } from '@/components/common/NamdaphaLogo';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Core Data States
  const [drafts, setDrafts] = useState<EmailDraft[]>(MOCK_DRAFTS);
  const [templates, setTemplates] = useState<EmailTemplate[]>(MOCK_TEMPLATES);
  const [sentRecords, setSentRecords] = useState<SentEmailRecord[]>(MOCK_SENT_EMAILS);
  const [tasks, setTasks] = useState<TaskItem[]>(MOCK_TASKS);

  // Active Draft being edited in Canvas Studio
  const [activeDraft, setActiveDraft] = useState<EmailDraft>(MOCK_DRAFTS[0]);

  // Toast / notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handler: Open draft in Canvas
  const handleOpenDraft = (draft: EmailDraft) => {
    setActiveDraft(draft);
    setCurrentView('canvas');
  };

  // Handler: Use template in Canvas
  const handleUseTemplate = (template: EmailTemplate) => {
    const newDraft: EmailDraft = {
      id: `draft-${Date.now()}`,
      title: `${template.title} (Draft)`,
      subject: template.subject,
      preheader: template.preheader,
      status: 'draft',
      updatedAt: 'Just now',
      blocks: JSON.parse(JSON.stringify(template.blocks)),
    };
    setDrafts((prev) => [newDraft, ...prev]);
    setActiveDraft(newDraft);
    setCurrentView('canvas');
    showToast(`Loaded "${template.title}" into Canvas Studio`);
  };

  // Handler: Create fresh blank email
  const handleNewEmail = () => {
    const newDraft: EmailDraft = {
      id: `draft-${Date.now()}`,
      title: 'Untitled House Announcement',
      subject: '[Namdapha House] Official Resident Notice',
      preheader: 'Important updates from the hostel council.',
      status: 'draft',
      updatedAt: 'Just now',
      blocks: JSON.parse(JSON.stringify(INITIAL_EMAIL_BLOCKS)),
    };
    setDrafts((prev) => [newDraft, ...prev]);
    setActiveDraft(newDraft);
    setCurrentView('canvas');
    showToast('Created new email draft');
  };

  // Handler: Duplicate template
  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const duplicated: EmailTemplate = {
      ...template,
      id: `tmpl-${Date.now()}`,
      title: `${template.title} (Copy)`,
      updatedAt: 'Just now',
    };
    setTemplates((prev) => [duplicated, ...prev]);
    showToast(`Duplicated "${template.title}"`);
  };

  // Handler: Create blank template
  const handleCreateBlankTemplate = (title: string, category: EmailTemplate['category']) => {
    const newTmpl: EmailTemplate = {
      id: `tmpl-${Date.now()}`,
      title,
      category,
      description: 'Custom community template created for Namdapha House.',
      author: 'Council Secretariat',
      updatedAt: 'Just now',
      subject: `[${category.toUpperCase()}] ${title}`,
      preheader: 'Important details inside this broadcast.',
      blocks: JSON.parse(JSON.stringify(INITIAL_EMAIL_BLOCKS)),
      thumbnailGradient: 'from-zinc-900 via-zinc-925 to-[#09090B]',
    };
    setTemplates((prev) => [newTmpl, ...prev]);
    showToast(`Created template "${title}"`);
  };

  // Handler: Save current canvas email as a new template
  const handleSaveAsTemplate = (
    title: string,
    category: EmailTemplate['category'],
    description: string,
    blocks: EmailBlock[]
  ) => {
    const newTmpl: EmailTemplate = {
      id: `tmpl-${Date.now()}`,
      title,
      category,
      description,
      author: 'Council Secretariat',
      updatedAt: 'Just now',
      subject: `[${category.toUpperCase()}] ${title}`,
      preheader: 'Important details inside this broadcast.',
      blocks: JSON.parse(JSON.stringify(blocks)),
      thumbnailGradient: 'from-zinc-900 via-zinc-925 to-[#09090B]',
    };
    setTemplates((prev) => [newTmpl, ...prev]);
    showToast(`Saved "${title}" to Template Library!`);
  };

  // Handler: When email is sent from Gmail compose modal
  const handleEmailSent = (record: SentEmailRecord) => {
    setSentRecords((prev) => [record, ...prev]);
    showToast(`Dispatched broadcast: "${record.subject}"`);
  };

  // Task Handlers
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Omit<TaskItem, 'id'>) => {
    const created: TaskItem = {
      ...newTask,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [created, ...prev]);
    showToast(`Scheduled task: "${created.title}"`);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090B] text-[#FAFAFA]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#141417] border border-zinc-800 text-zinc-100 text-xs px-3.5 py-2.5 rounded-lg shadow-2xl shadow-black flex items-center gap-2.5 animate-in slide-in-from-bottom-2 duration-150">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-medium tracking-tight">{toastMessage}</span>
        </div>
      )}

      {/* Desktop Sidebar (Left) with Curtain Smooth Open/Close Toggle */}
      <div className="hidden md:block h-full">
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          draftCount={drafts.length}
          templateCount={templates.length}
        />
      </div>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        currentView={currentView}
        onNavigate={setCurrentView}
      />

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Mobile-Only Minimal Header Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#111113] border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>
            <NamdaphaLogo size="sm" />
          </div>

          <button
            onClick={handleNewEmail}
            className="px-3 py-1.5 rounded-lg bg-white text-zinc-950 font-medium shadow-sm flex items-center gap-1.5 text-xs hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compose</span>
          </button>
        </div>

        {/* Dynamic View Container */}
        <main className={`flex-1 min-h-0 ${currentView === 'canvas' ? 'overflow-hidden h-full flex flex-col' : 'overflow-y-auto'}`}>
          {currentView === 'home' && (
            <div className="p-4 sm:p-8">
              <HomeView
                drafts={drafts}
                templates={templates}
                sentRecords={sentRecords}
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onNavigate={setCurrentView}
                onOpenDraft={handleOpenDraft}
                onUseTemplate={handleUseTemplate}
                onNewEmail={handleNewEmail}
              />
            </div>
          )}

          {currentView === 'canvas' && (
            <CanvasStudioView
              key={activeDraft.id}
              initialTitle={activeDraft.title}
              initialSubject={activeDraft.subject}
              initialPreheader={activeDraft.preheader}
              initialBlocks={activeDraft.blocks}
              onSaveTemplate={handleSaveAsTemplate}
              onSendEmail={handleEmailSent}
            />
          )}

          {currentView === 'tasks' && (
            <div className="p-4 sm:p-8">
              <TasksView
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          )}

          {currentView === 'templates' && (
            <div className="p-4 sm:p-8">
              <TemplateLibraryView
                templates={templates}
                onUseTemplate={handleUseTemplate}
                onDuplicateTemplate={handleDuplicateTemplate}
                onCreateBlankTemplate={handleCreateBlankTemplate}
              />
            </div>
          )}

          {currentView === 'sent' && (
            <div className="p-4 sm:p-8">
              <SentEmailsView sentRecords={sentRecords} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
