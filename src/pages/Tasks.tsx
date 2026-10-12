import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Task, Priority } from '../types';
import {
  Search,
  Plus,
  Clock,
  User,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export const Tasks: React.FC = () => {
  const { tasks, toggleTask, deleteTask, setQuickModal } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((t: Task) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    let matchesTab = true;
    if (activeTab === 'today') {
      matchesTab = t.status === 'Pending' && t.dueDate.toLowerCase().includes('today');
    } else if (activeTab === 'upcoming') {
      matchesTab = t.status === 'Pending' && !t.dueDate.toLowerCase().includes('today');
    } else if (activeTab === 'completed') {
      matchesTab = t.status === 'Completed';
    }

    return matchesSearch && matchesPriority && matchesTab;
  });

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-command-500/10 text-command-600 dark:text-command-400 border-command-500/30';
      case 'Low':
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30';
    }
  };

  const todayCount = tasks.filter((t: Task) => t.status === 'Pending' && t.dueDate.toLowerCase().includes('today')).length;
  const upcomingCount = tasks.filter((t: Task) => t.status === 'Pending' && !t.dueDate.toLowerCase().includes('today')).length;
  const completedCount = tasks.filter((t: Task) => t.status === 'Completed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Task Queue & Account Actions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track operational follow-throughs, ticket escalations, and compliance deliverables.
          </p>
        </div>

        <button
          onClick={() => setQuickModal('createTask')}
          className="px-4 py-2.5 rounded-xl bg-command-600 hover:bg-command-700 text-white font-bold text-xs shadow-md shadow-command-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Task</span>
        </button>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Sections Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'My Tasks', count: tasks.filter((t: Task) => t.status === 'Pending').length },
            { id: 'today', label: 'Due Today', count: todayCount },
            { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
            { id: 'completed', label: 'Completed', count: completedCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-command-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Priority */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No tasks found in this section.
          </div>
        ) : (
          filteredTasks.map((task: Task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex items-start sm:items-center justify-between gap-4 transition-all ${
                  isCompleted
                    ? 'border-slate-200 dark:border-slate-800 opacity-60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-command-500/40 hover:shadow-md'
                }`}
              >
                {/* Left: Checkbox & info */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-700 hover:border-command-500 bg-slate-50 dark:bg-slate-850'
                    }`}
                    title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-sm font-bold tracking-tight truncate ${
                          isCompleted
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {task.category}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <button
                        onClick={() => navigate(`/customers/${task.customerId}`)}
                        className="hover:text-command-600 dark:hover:text-command-400 font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <User className="w-3.5 h-3.5" />
                        {task.customerName}
                      </button>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right action */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
