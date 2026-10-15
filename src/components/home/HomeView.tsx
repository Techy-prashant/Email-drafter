import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  MailCheck,
  LayoutTemplate
} from 'lucide-react';
import { EmailTemplate, SentEmailRecord, TaskItem, ViewMode } from '@/types';
import { Badge } from '../common/Badge';

interface HomeViewProps {
  templates: EmailTemplate[];
  sentRecords: SentEmailRecord[];
  tasks: TaskItem[];
  onNavigate: (view: ViewMode) => void;
  onUseTemplate: (template: EmailTemplate) => void;
  onToggleTask: (taskId: string) => void;
  onOpenSentEmail?: (email: SentEmailRecord) => void;
  drafts?: any[];
  onOpenDraft?: (draft: any) => void;
  onNewEmail?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  templates,
  sentRecords,
  tasks,
  onNavigate,
  onUseTemplate,
  onToggleTask,
  onOpenSentEmail,
}) => {
  // Current calendar month view state (October 2026)
  const [selectedDay, setSelectedDay] = useState(14);

  // Calendar dates for October 2026 (Oct 1 is Thursday)
  const daysInMonth = [
    null, null, null, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31
  ];

  // Filter tasks for the selected date
  const selectedDateStr = `2026-10-${String(selectedDay).padStart(2, '0')}`;
  const dayTasks = tasks.filter((t) => t.date === selectedDateStr);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 select-none">
      {/* Top Welcome Header - Clean & Minimalist */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-b border-zinc-800/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
            Good evening, Prashant
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5 font-normal">
            Namdapha House Studio & Official Resident Communications
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('canvas')}
            className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-sm"
          >
            + New Email
          </button>
          <button
            onClick={() => onNavigate('tasks')}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-sm font-medium transition-colors"
          >
            View Schedule
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid: Latest Templates (Left) & Sent Emails + Daily Schedule (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Latest Templates (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#121215] border border-zinc-800 p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <LayoutTemplate className="w-5 h-5 text-zinc-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                  Latest Templates
                </h2>
              </div>
              <button
                onClick={() => onNavigate('templates')}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1.5 font-medium group"
              >
                <span>View library</span>
                <span className="group-hover:translate-x-0.5 transition-transform text-zinc-500">→</span>
              </button>
            </div>

            {/* List of Latest Templates */}
            <div className="divide-y divide-zinc-800/80">
              {templates.slice(0, 4).map((template, idx) => {
                const num = String(idx + 1).padStart(2, '0');
                return (
                  <div key={template.id} className="py-4 space-y-2 first:pt-3 group transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-baseline gap-3.5">
                        <span className="text-sm font-mono font-medium text-zinc-500">
                          {num}
                        </span>
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
                              {template.title}
                            </h3>
                            <Badge variant="default" size="sm">
                              {template.category.toUpperCase()}
                            </Badge>
                          </div>
                          <span className="text-xs text-zinc-400 font-mono block mt-1">
                            {template.updatedAt} • {template.blocks.length} blocks
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onUseTemplate(template)}
                        className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold transition-colors flex-shrink-0 flex items-center gap-1.5"
                      >
                        <span>Use</span>
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    </div>

                    <p className="text-sm text-zinc-400 font-normal leading-relaxed pl-8 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Latest Sent Emails + Schedule/Tasks (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Card: Latest Sent Emails (Website Only) */}
          <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <MailCheck className="w-5 h-5 text-zinc-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                  Latest Sent Emails
                </h2>
              </div>
              <button
                onClick={() => onNavigate('sent')}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
              >
                All Sent →
              </button>
            </div>

            {/* Sent Email Items */}
            <div className="space-y-2.5">
              {sentRecords.slice(0, 3).map((sent) => (
                <div
                  key={sent.id}
                  onClick={() => onOpenSentEmail ? onOpenSentEmail(sent) : onNavigate('sent')}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40 cursor-pointer transition-colors space-y-1.5 group"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-zinc-200 group-hover:text-white truncate max-w-[220px]">
                      {sent.subject}
                    </span>
                    <span className="font-mono text-xs text-zinc-400 whitespace-nowrap ml-2">
                      {sent.sentAt}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="truncate max-w-[200px]">To: {sent.to}</span>
                    <span className="text-emerald-400 font-mono text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Delivered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Card: Schedule & Daily Tasks with Interactive Calendar */}
          <div className="rounded-2xl bg-[#121215] border border-zinc-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-zinc-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
                  Schedule & Tasks
                </h2>
              </div>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors font-medium"
              >
                Tasks Tab →
              </button>
            </div>

            {/* Month Header */}
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-zinc-200 font-mono">
                October 2026
              </span>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <button className="hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="hover:text-white p-1.5 rounded-md hover:bg-zinc-800 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-1.5">
              {/* Weekday Labels */}
              <div className="grid grid-cols-7 text-center text-xs font-mono text-zinc-500 pb-1">
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
                <span>Su</span>
              </div>

              {/* Days Numbers */}
              <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
                {daysInMonth.map((day, i) => {
                  if (day === null) {
                    return <div key={`empty-${i}`} className="h-9" />;
                  }

                  const isSelected = day === selectedDay;
                  const dateKey = `2026-10-${String(day).padStart(2, '0')}`;
                  const hasTasks = tasks.some((t) => t.date === dateKey);

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => setSelectedDay(day)}
                      className="h-9 w-9 mx-auto flex items-center justify-center rounded-lg text-sm transition-colors relative"
                    >
                      <span
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-white text-zinc-950 font-bold shadow-sm'
                            : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                        }`}
                      >
                        {day}
                      </span>
                      {hasTasks && !isSelected && (
                        <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tasks for Selected Day */}
            <div className="pt-3.5 border-t border-zinc-800 space-y-2.5">
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span className="font-semibold text-zinc-200">
                  Oct {selectedDay}, 2026
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>

              {dayTasks.length === 0 ? (
                <div className="py-4 text-center text-xs text-zinc-500 bg-zinc-900/40 rounded-xl border border-dashed border-zinc-800">
                  No tasks scheduled
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onToggleTask(task.id)}
                      className="flex items-center justify-between p-2.5 px-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-500 hover:text-zinc-300 flex-shrink-0" />
                        )}
                        <span
                          className={`text-sm truncate ${
                            task.completed ? 'line-through text-zinc-500' : 'text-zinc-200 font-medium'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      {task.time && (
                        <span className="text-xs font-mono text-zinc-400 flex-shrink-0 ml-2">
                          {task.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
