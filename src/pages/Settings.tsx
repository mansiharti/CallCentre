import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Moon,
  Sun,
  Bell,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Monitor
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const handleResetData = () => {
    if (window.confirm('Reset all mock data, customers, tasks, and follow-ups to default state?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Operator & Terminal Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize interface theme, alert chimes, notification thresholds, and layout density.
        </p>
      </div>

      {/* APPEARANCE SECTION */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Monitor className="w-4 h-4 text-command-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Appearance & Theme
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => updateSettings({ theme: 'light' })}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              settings.theme === 'light'
                ? 'border-command-500 bg-command-50/50 dark:bg-command-950/20 ring-2 ring-command-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                  Light Interface
                </span>
                <span className="text-[11px] text-slate-400">
                  Clean daytime clarity
                </span>
              </div>
            </div>
            {settings.theme === 'light' && <CheckCircle2 className="w-5 h-5 text-command-500" />}
          </button>

          <button
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              settings.theme === 'dark'
                ? 'border-command-500 bg-command-50/50 dark:bg-command-950/20 ring-2 ring-command-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                  Dark Command Hub
                </span>
                <span className="text-[11px] text-slate-400">
                  High-contrast mission control
                </span>
              </div>
            </div>
            {settings.theme === 'dark' && <CheckCircle2 className="w-5 h-5 text-command-500" />}
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS SECTION */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Bell className="w-4 h-4 text-command-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Telephony & Alerts
          </h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                Desktop Notifications
              </span>
              <span className="text-[11px] text-slate-400">
                Display system toasts when queue items exceed 2 minutes wait time
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.desktopNotifications}
              onChange={e => updateSettings({ desktopNotifications: e.target.checked })}
              className="w-4 h-4 accent-command-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                Acoustic Chime Alerts
              </span>
              <span className="text-[11px] text-slate-400">
                Play subtle WebAudio tone upon incoming call or queue urgency
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundAlerts}
              onChange={e => updateSettings({ soundAlerts: e.target.checked })}
              className="w-4 h-4 accent-command-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                Priority Alerts Only Mode
              </span>
              <span className="text-[11px] text-slate-400">
                Suppress non-essential alerts when your status is marked Busy
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.priorityAlertsOnly}
              onChange={e => updateSettings({ priorityAlertsOnly: e.target.checked })}
              className="w-4 h-4 accent-command-600 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* WORKSPACE PREFERENCES */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Sliders className="w-4 h-4 text-command-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Workspace Preferences
          </h2>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                Compact Information Density
              </span>
              <span className="text-[11px] text-slate-400">
                Reduce table row spacing for high-density 1080p/1440p displays
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={e => updateSettings({ compactMode: e.target.checked })}
              className="w-4 h-4 accent-command-600 rounded cursor-pointer"
            />
          </label>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                Default Active Call View
              </span>
              <span className="text-[11px] text-slate-400">
                Choose default view presentation when connecting with caller
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {(['expanded', 'minimal'] as const).map(view => (
                <button
                  key={view}
                  onClick={() => updateSettings({ defaultCallView: view })}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    settings.defaultCallView === view
                      ? 'bg-command-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DATA MANAGEMENT */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div>
          <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
            Reset Demo Dataset
          </span>
          <span className="text-[11px] text-slate-400">
            Clear locally saved edits and restore factory sample mock records.
          </span>
        </div>

        <button
          onClick={handleResetData}
          className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-bold text-xs flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Local State</span>
        </button>
      </div>
    </div>
  );
};
