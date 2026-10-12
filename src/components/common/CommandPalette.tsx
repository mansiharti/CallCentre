import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  User,
  Phone,
  CheckSquare,
  Compass,
  Zap,
  ArrowRight,
  Clock,
  BookOpen,
  BarChart3,
  Settings,
  X
} from 'lucide-react';

interface CommandItem {
  title: string;
  subtitle?: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  type?: string;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    customers,
    calls,
    tasks,
    setStaffStatus,
    setQuickModal
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Filter items
  const q = query.toLowerCase().trim();

  // Pages
  const pages: CommandItem[] = [
    { title: 'Command Centre', subtitle: '/', path: '/', icon: Compass, category: 'Navigation', action: () => navigate('/') },
    { title: 'Call History & Logs', subtitle: '/calls', path: '/calls', icon: Phone, category: 'Navigation', action: () => navigate('/calls') },
    { title: 'Customers Directory', subtitle: '/customers', path: '/customers', icon: User, category: 'Navigation', action: () => navigate('/customers') },
    { title: 'Task Queue', subtitle: '/tasks', path: '/tasks', icon: CheckSquare, category: 'Navigation', action: () => navigate('/tasks') },
    { title: 'Follow-ups Calendar', subtitle: '/follow-ups', path: '/follow-ups', icon: Clock, category: 'Navigation', action: () => navigate('/follow-ups') },
    { title: 'Knowledge Base', subtitle: '/knowledge-base', path: '/knowledge-base', icon: BookOpen, category: 'Navigation', action: () => navigate('/knowledge-base') },
    { title: 'Performance Reports', subtitle: '/reports', path: '/reports', icon: BarChart3, category: 'Navigation', action: () => navigate('/reports') },
    { title: 'Workspace Settings', subtitle: '/settings', path: '/settings', icon: Settings, category: 'Navigation', action: () => navigate('/settings') },
  ].filter(p => !q || p.title.toLowerCase().includes(q));

  // Quick actions
  const actions: CommandItem[] = [
    {
      title: 'Set Status: Available',
      subtitle: 'Mark terminal available for incoming calls',
      category: 'Actions',
      icon: Zap,
      action: () => setStaffStatus('Available')
    },
    {
      title: 'Set Status: Busy',
      subtitle: 'Pause incoming queue assignment',
      category: 'Actions',
      icon: Zap,
      action: () => setStaffStatus('Busy')
    },
    {
      title: 'Set Status: On Break',
      subtitle: 'Pause queue for rest break',
      category: 'Actions',
      icon: Zap,
      action: () => setStaffStatus('On Break')
    },
    {
      title: 'Start Outbound Call (Dialer)',
      subtitle: 'Open direct outbound numeric keypad',
      category: 'Actions',
      icon: Phone,
      action: () => setQuickModal('dialer')
    },
    {
      title: '+ New Customer Profile',
      subtitle: 'Register customer dossier',
      category: 'Actions',
      icon: User,
      action: () => setQuickModal('newCustomer')
    },
    {
      title: 'Create New Task',
      subtitle: 'Add operational action item',
      category: 'Actions',
      icon: CheckSquare,
      action: () => setQuickModal('createTask')
    },
    {
      title: 'Schedule Follow-up',
      subtitle: 'Book callback slot on calendar',
      category: 'Actions',
      icon: Clock,
      action: () => setQuickModal('scheduleFollowUp')
    }
  ].filter(a => !q || a.title.toLowerCase().includes(q));

  // Matching Customers
  const matchedCustomers: CommandItem[] = customers
    .filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    )
    .slice(0, 4)
    .map(c => ({
      title: `${c.name} (${c.id})`,
      subtitle: `${c.phone} • ${c.company || c.tier + ' Tier'}`,
      category: 'Customers',
      icon: User,
      action: () => navigate(`/customers/${c.id}`)
    }));

  // Matching Tasks
  const matchedTasks: CommandItem[] = tasks
    .filter(t => t.title.toLowerCase().includes(q) || t.customerName.toLowerCase().includes(q))
    .slice(0, 3)
    .map(t => ({
      title: t.title,
      subtitle: `${t.customerName} • Due ${t.dueDate}`,
      category: 'Tasks',
      icon: CheckSquare,
      action: () => navigate('/tasks')
    }));

  // Matching Calls
  const matchedCalls: CommandItem[] = calls
    .filter(c => c.customerName.toLowerCase().includes(q) || c.category.toLowerCase().includes(q))
    .slice(0, 3)
    .map(c => ({
      title: `Call with ${c.customerName}`,
      subtitle: `${c.category} • ${c.duration} • ${c.outcome}`,
      category: 'Calls',
      icon: Phone,
      action: () => navigate('/calls')
    }));

  // Combine items for keyboard navigation
  const allResults: CommandItem[] = [
    ...matchedCustomers,
    ...actions,
    ...pages,
    ...matchedTasks,
    ...matchedCalls
  ];

  const handleSelect = (index: number) => {
    const item = allResults[index];
    if (item) {
      setIsCommandPaletteOpen(false);
      item.action();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : allResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Input box */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, search customer name, phone, task, or page..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50">
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No matching commands or records found for "{query}".
            </div>
          ) : (
            <div className="py-1">
              {allResults.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={`${item.category}-${item.title}-${idx}`}
                    onClick={() => handleSelect(idx)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors ${
                      isSelected
                        ? 'bg-command-500/10 text-command-600 dark:text-command-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-command-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-medium leading-tight truncate">
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pl-3 shrink-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {item.category}
                      </span>
                      {isSelected && <ArrowRight className="w-4 h-4 text-command-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-[10px]">Ctrl+K</kbd> Toggle
            </span>
          </div>
          <span className="font-mono text-[11px] text-command-600 dark:text-command-400 font-medium">
            CallFlow Command Hub
          </span>
        </div>
      </div>
    </div>
  );
};
