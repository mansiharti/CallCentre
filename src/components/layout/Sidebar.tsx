import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  PhoneCall,
  Users,
  CheckSquare,
  Clock,
  BookOpen,
  BarChart3,
  Settings,
  Headphones,
  PhoneForwarded,
  ChevronLeft,
  ChevronRight,
  X,
  Radio
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const { activeCall, tasks, followUps, setQuickModal } = useApp();
  const location = useLocation();

  const pendingTasksCount = tasks.filter(t => t.status === 'Pending').length;
  const todayFollowUpsCount = followUps.filter(f => f.date === 'Today' && f.status === 'Scheduled').length;

  const navItems = [
    {
      name: 'Command Centre',
      path: '/',
      icon: Compass,
      exact: true
    },
    {
      name: 'Calls & Logs',
      path: '/calls',
      icon: PhoneCall,
      badge: activeCall ? 'LIVE' : undefined,
      badgeColor: 'bg-emerald-500 text-white animate-pulse'
    },
    {
      name: 'Customers 360',
      path: '/customers',
      icon: Users
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
      badgeColor: 'bg-command-500/10 text-command-600 dark:text-command-400 font-semibold'
    },
    {
      name: 'Follow-ups',
      path: '/follow-ups',
      icon: Clock,
      badge: todayFollowUpsCount > 0 ? `${todayFollowUpsCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold'
    },
    {
      name: 'Knowledge Base',
      path: '/knowledge-base',
      icon: BookOpen
    },
    {
      name: 'Reports & Stats',
      path: '/reports',
      icon: BarChart3
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header & Brand */}
      <div>
        <div className={`flex items-center justify-between px-4 py-4.5 border-b border-slate-200 dark:border-slate-800 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-command-600 to-command-400 text-white flex items-center justify-center shrink-0 shadow-glow-primary">
              <Headphones className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">
                    CallFlow
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-command-100 dark:bg-command-950 text-command-700 dark:text-command-300 font-semibold">
                    v2.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  Support Command Centre
                </p>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live system operational pill */}
        {!isCollapsed && (
          <div className="px-4 pt-3 pb-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <Radio className="w-3.5 h-3.5 shrink-0 animate-pulse text-emerald-500" />
              <span className="truncate">SIP Trunks: System Operational</span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-command-600 text-white shadow-md shadow-command-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-command-500'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.name}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isCollapsed && item.badge && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {/* Quick dial button */}
        <button
          onClick={() => {
            setQuickModal('dialer');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-600/20 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Open Outbound Dialer"
        >
          <PhoneForwarded className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Quick Dialer</span>}
        </button>

        {/* Settings link */}
        <NavLink
          to="/settings"
          onClick={onCloseMobile}
          title={isCollapsed ? 'Settings' : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isActive
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            } ${isCollapsed ? 'justify-center' : ''}`
          }
        >
          <Settings className="w-4 h-4 shrink-0 text-slate-400" />
          {!isCollapsed && <span>Operator Settings</span>}
        </NavLink>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex items-center justify-end pt-1">
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 z-50 shadow-2xl border-r border-slate-200 dark:border-slate-800 lg:hidden transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
