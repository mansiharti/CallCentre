import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ActiveCallWorkspace } from '../components/active-call/ActiveCallWorkspace';
import {
  PhoneCall,
  Clock,
  CheckCircle2,
  TrendingUp,
  Activity,
  Radio,
  UserPlus,
  Calendar,
  Search,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Headphones,
  CheckSquare
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    staffName,
    activeCall,
    queue,
    queuePulse,
    acceptQueueCall,
    tasks,
    followUps,
    calls,
    setQuickModal,
    setIsCommandPaletteOpen
  } = useApp();

  const navigate = useNavigate();

  // Dynamic calculations
  const activeCallsCount = activeCall ? 1 : 0;
  const waitingCount = queue.length;
  const resolvedTodayCount = calls.filter(c => c.outcome === 'Resolved' && c.timestamp.includes('Today')).length + 38;
  const pendingTasksCount = tasks.filter(t => t.status === 'Pending').length;
  const todayFollowUpsCount = followUps.filter(f => f.date === 'Today' && f.status === 'Scheduled').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Active Call Workspace (Pinned when in progress) */}
      {activeCall && (
        <section aria-label="Active Call Workspace">
          <ActiveCallWorkspace />
        </section>
      )}

      {/* Dashboard Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System operational
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              STATION #04-WEST
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Good morning, {staffName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's your support command centre for today. Telephony SIP channels are routed.
          </p>
        </div>

        {/* Live Demand / Queue Pulse card */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                queuePulse === 'High'
                  ? 'bg-rose-500/10 text-rose-600'
                  : queuePulse === 'Moderate'
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'bg-emerald-500/10 text-emerald-600'
              }`}
            >
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Queue Pulse:
              </span>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  queuePulse === 'High'
                    ? 'bg-rose-500 text-white'
                    : queuePulse === 'Moderate'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-500 text-white'
                }`}
              >
                {queuePulse}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {queuePulse === 'High'
                ? 'High inbound volume detected'
                : queuePulse === 'Moderate'
                ? 'Steady flow of tier interactions'
                : 'Optimal staffing coverage'}
            </p>
          </div>
        </div>
      </div>

      {/* TODAY'S SNAPSHOT: Compact KPI Cards */}
      <section aria-label="Today's Snapshot">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Today's Snapshot
          </h2>
          <span className="text-[11px] font-mono text-slate-400">Refreshed real-time</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Active Calls */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-command-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Active Calls</span>
              <div className="w-7 h-7 rounded-lg bg-command-500/10 text-command-600 dark:text-command-400 flex items-center justify-center">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {activeCallsCount + 12}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Across your team pod
            </div>
          </div>

          {/* Waiting */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-command-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Waiting Queue</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {waitingCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
              <span>Shortest wait: 00:48</span>
            </div>
          </div>

          {/* Resolved Today */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-command-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Resolved Today</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {resolvedTodayCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              <TrendingUp className="w-3 h-3" />
              +14% vs yesterday
            </div>
          </div>

          {/* Avg Call Time */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-command-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Avg. Call Time</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              04:32
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-1">
              Target SLA: &lt; 06:00
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-command-500/40 transition-colors col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">CSAT Rating</span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              94%
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-1">
              Based on 48 surveys
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions & Personal Workload Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Personal Workload (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                My Shift Workload
              </h3>
              <span className="text-[11px] font-semibold text-command-600 dark:text-command-400">
                Alex Mercer
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                onClick={() => navigate('/tasks')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-command-500/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Tasks Remaining</span>
                  <CheckSquare className="w-3.5 h-3.5 text-command-500" />
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {pendingTasksCount}
                </div>
              </div>

              <div
                onClick={() => navigate('/follow-ups')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-command-500/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Follow-ups Today</span>
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {todayFollowUpsCount}
                </div>
              </div>

              <div
                onClick={() => navigate('/calls')}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 hover:border-command-500/40 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Calls Handled</span>
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {calls.length}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-medium">Queue Slot</span>
                  <Radio className="w-3.5 h-3.5 text-command-500" />
                </div>
                <div className="text-xl font-bold text-command-600 dark:text-command-400 font-mono">
                  #1 (Next Inbound)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Shift progress: 6 hrs remaining</span>
            <button
              onClick={() => navigate('/reports')}
              className="text-command-600 dark:text-command-400 hover:underline font-semibold flex items-center gap-1"
            >
              View detailed metrics <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Quick Actions (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Fast Support Actions
              </h3>
              <span className="text-[11px] text-slate-400">Keyboard: Ctrl + K</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => setQuickModal('newCustomer')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-command-50 dark:hover:bg-command-950/30 hover:border-command-400 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-command-500/10 text-command-600 dark:text-command-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  + New Customer
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Create client dossier</p>
              </button>

              <button
                onClick={() => setQuickModal('dialer')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-400 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Start Direct Call
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Open keypad dialer</p>
              </button>

              <button
                onClick={() => setQuickModal('createTask')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-400 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Create Task
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Assign ticket item</p>
              </button>

              <button
                onClick={() => setQuickModal('scheduleFollowUp')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-400 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Schedule Follow-up
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Set calendar slot</p>
              </button>

              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-400 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Search className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Search Customer
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Find 360 profile</p>
              </button>

              <button
                onClick={() => navigate('/knowledge-base')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-teal-50 dark:hover:bg-teal-950/30 hover:border-teal-400 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Search KB Guides
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Standard protocols</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE CUSTOMER QUEUE (Primary mission control section) */}
      <section aria-label="Live Customer Queue" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-850/50">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Live Customer Queue
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-command-500 text-white font-mono">
                {queue.length} waiting
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live inbound SIP calls, callbacks, and prioritized enterprise inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              Priority sorting active
            </span>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Queue is currently clear!
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              All inbound customer interactions have been serviced.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Issue & Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Wait Time</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {queue.map(item => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors group"
                  >
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.customerName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                        />
                        <div>
                          <button
                            onClick={() => navigate(`/customers/${item.customerId}`)}
                            className="font-bold text-slate-900 dark:text-slate-100 hover:text-command-600 dark:hover:text-command-400 text-xs block text-left transition-colors"
                          >
                            {item.customerName}
                          </button>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.customerId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Issue & Category */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                        {item.issue}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Category: {item.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          item.priority === 'Critical'
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : item.priority === 'High'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-command-500/10 text-command-600 dark:text-command-400 border border-command-500/20'
                        }`}
                      >
                        {item.priority === 'Critical' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        )}
                        {item.priority}
                      </span>
                    </td>

                    {/* Wait Time */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        Waiting {item.waitTime}
                      </span>
                    </td>

                    {/* Channel */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium">
                        {item.channel}
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => acceptQueueCall(item)}
                        className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all inline-flex items-center gap-1.5 transform active:scale-95"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        Accept
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
