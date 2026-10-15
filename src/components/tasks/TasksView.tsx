import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Tag
} from 'lucide-react';
import { TaskItem } from '@/types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [selectedDay, setSelectedDay] = useState(14);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-10-14');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('medium');
  const [newCategory, setNewCategory] = useState('Secretariat');
  const [newDescription, setNewDescription] = useState('');

  // Calendar dates for October 2026 (Oct 1 is Thursday)
  const daysInMonth = [
    null, null, null, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31
  ];

  const selectedDateStr = `2026-10-${String(selectedDay).padStart(2, '0')}`;

  const filteredTasks = tasks.filter((task) => {
    const matchesDate = task.date === selectedDateStr;
    if (!matchesDate) return false;
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      date: newDate,
      time: newTime.trim() || undefined,
      priority: newPriority,
      category: newCategory.trim() || undefined,
      description: newDescription.trim() || undefined,
      completed: false,
    });

    setNewTitle('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  const priorityStyles: Record<TaskItem['priority'], string> = {
    high: 'text-red-400 border-red-900/40 bg-red-950/30',
    medium: 'text-amber-400 border-amber-900/40 bg-amber-950/30',
    low: 'text-zinc-400 border-zinc-800 bg-zinc-900/60',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-7 pb-16 select-none">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
            Schedule & Tasks
          </h1>
          <p className="text-sm text-zinc-400 mt-1.5">
            Organize daily broadcasts, council meetings, and residential deadlines.
          </p>
        </div>

        <button
          onClick={() => {
            setNewDate(selectedDateStr);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Main Grid: Calendar Left & Tasks List Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Month Calendar (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#121215] border border-zinc-800 p-6 space-y-5 shadow-sm self-start">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-800">
            <span className="text-sm font-semibold text-zinc-200 flex items-center gap-2 font-mono">
              <CalendarIcon className="w-4 h-4 text-zinc-400" />
              <span>October 2026</span>
            </span>
            <div className="flex items-center gap-1 text-zinc-400">
              <button className="p-1.5 rounded-lg hover:text-white hover:bg-zinc-800 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg hover:text-white hover:bg-zinc-800 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-xs font-mono text-zinc-400">
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span>Su</span>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-y-1.5 text-center text-sm">
            {daysInMonth.map((day, i) => {
              if (day === null) {
                return <div key={`cal-pad-${i}`} className="h-9" />;
              }

              const isSelected = day === selectedDay;
              const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
              const countForDay = tasks.filter((t) => t.date === dateStr).length;

              return (
                <button
                  key={`cal-day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className="h-9 w-9 mx-auto flex items-center justify-center rounded-lg relative transition-colors"
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-white text-zinc-950 font-bold shadow-sm'
                        : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                    }`}
                  >
                    {day}
                  </span>
                  {countForDay > 0 && !isSelected && (
                    <span className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-zinc-400" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3.5 border-t border-zinc-800 flex items-center justify-between text-sm text-zinc-400">
            <span>Scheduled Tasks</span>
            <span className="font-mono text-sm font-semibold text-zinc-200">{tasks.length}</span>
          </div>
        </div>

        {/* Right Column: Task List for Selected Day (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#121215] border border-zinc-800 p-6 space-y-5 shadow-sm">
          {/* Day Title & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-zinc-100">
                October {selectedDay}, 2026
              </h2>
              <p className="text-sm text-zinc-400 mt-0.5">
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} scheduled
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl">
              {(['all', 'pending', 'completed'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilter(mode)}
                  className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors ${
                    filter === mode
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center rounded-xl bg-zinc-900/30 border border-dashed border-zinc-800 space-y-2.5">
              <CheckSquare className="w-8 h-8 text-zinc-500 mx-auto" />
              <h3 className="text-sm font-medium text-zinc-300">No tasks for this day</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                No items match your date or status filter.
              </p>
              <button
                onClick={() => {
                  setNewDate(selectedDateStr);
                  setIsAddModalOpen(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-sm font-medium border border-zinc-800"
              >
                + Add Task
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-3 group ${
                    task.completed
                      ? 'bg-zinc-900/40 border-zinc-800/60 opacity-60'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-zinc-400 hover:text-white transition-colors flex-shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-500" />
                      )}
                    </button>

                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span
                          className={`text-sm sm:text-base font-semibold ${
                            task.completed ? 'line-through text-zinc-500' : 'text-zinc-100'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-xs font-mono px-2 py-0.5 rounded-md border uppercase font-medium ${
                            priorityStyles[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                        {task.category && (
                          <Badge variant="default" size="sm">
                            {task.category}
                          </Badge>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {task.time && (
                        <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 pt-0.5">
                          <Tag className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{task.time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Task"
        subtitle="Add a calendar action item for council preparations"
        maxWidth="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Task Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Verify hostel sound system"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Date (YYYY-MM-DD)</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Time</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as TaskItem['priority'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Category</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Secretariat"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Description (Optional)</label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Details or notes..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-zinc-600 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-zinc-200 shadow-sm text-sm"
            >
              Add Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
