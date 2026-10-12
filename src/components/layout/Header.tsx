import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { StaffStatus } from '../../types';
import {
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Coffee,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  User,
  ShieldCheck,
  Activity,
  LogOut,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebarMobile }) => {
  const {
    staffStatus,
    setStaffStatus,
    staffName,
    queuePulse,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    settings,
    updateSettings,
    setIsCommandPaletteOpen
  } = useApp();

  const navigate = useNavigate();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getStatusBadge = (status: StaffStatus) => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          icon: CheckCircle2
        };
      case 'Busy':
        return {
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
          icon: AlertCircle
        };
      case 'On Break':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
          icon: Coffee
        };
      case 'Offline':
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
          dot: 'bg-slate-400',
          icon: ShieldCheck
        };
    }
  };

  const currentBadge = getStatusBadge(staffStatus);

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebarMobile}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar - opens command palette */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full max-w-md flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-command-500/50 dark:hover:border-command-500/50 text-left transition-all group"
        >
          <div className="flex items-center gap-2.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-command-500 transition-colors" />
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
              Search customers, calls, tickets...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Queue Pulse Pill */}
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850"
          title={`Queue Demand: ${queuePulse}`}
        >
          <Activity className="w-3.5 h-3.5 text-command-500" />
          <span className="text-slate-500 dark:text-slate-400">Queue Pulse:</span>
          <span
            className={`font-semibold ${
              queuePulse === 'High'
                ? 'text-rose-600 dark:text-rose-400'
                : queuePulse === 'Moderate'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {queuePulse}
          </span>
        </div>

        {/* Staff Availability Selector */}
        <div className="relative" ref={statusRef}>
          <button
            onClick={() => setShowStatusMenu(prev => !prev)}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${currentBadge.bg}`}
            aria-label="Staff availability status"
          >
            <span className={`w-2 h-2 rounded-full ${currentBadge.dot} animate-pulse`} />
            <span className="font-semibold hidden sm:inline">{staffStatus}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showStatusMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 animate-in fade-in duration-100">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Change Status
              </div>
              {(['Available', 'Busy', 'On Break', 'Offline'] as StaffStatus[]).map(st => {
                const badge = getStatusBadge(st);
                return (
                  <button
                    key={st}
                    onClick={() => {
                      setStaffStatus(st);
                      setShowStatusMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      staffStatus === st ? 'text-command-600 dark:text-command-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                    <span>{st}</span>
                    {staffStatus === st && <span className="ml-auto text-[10px] text-command-500 font-bold">ACTIVE</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifMenu(prev => !prev)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-850 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-40 animate-in fade-in duration-100">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-command-500 text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-command-600 dark:text-command-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.slice(0, 6).map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.actionLink) {
                          navigate(notif.actionLink);
                          setShowNotifMenu(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-command-50/40 dark:bg-command-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => {
                    navigate('/reports');
                    setShowNotifMenu(false);
                  }}
                  className="text-xs font-medium text-command-600 dark:text-command-400 hover:underline inline-flex items-center gap-1"
                >
                  View Activity & Reports <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="User profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-command-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-command-500/30">
              AM
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                {staffName}
              </div>
              <div className="text-[10px] text-slate-400">Tier 2 Specialist</div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-850 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-40 animate-in fade-in duration-100">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{staffName}</div>
                <div className="text-[11px] text-slate-400 font-mono">alex.mercer@callflow.ops</div>
              </div>
              <button
                onClick={() => {
                  navigate('/settings');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Operator Settings</span>
              </button>
              <button
                onClick={() => {
                  navigate('/reports');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-slate-400" />
                <span>My Performance</span>
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
              <button
                onClick={() => {
                  setStaffStatus('Offline');
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Go Offline & End Shift</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
