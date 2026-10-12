import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FollowUp, Priority, Customer } from '../types';
import {
  Phone,
  CheckCircle2,
  Plus,
  RefreshCw,
  User
} from 'lucide-react';

export const FollowUps: React.FC = () => {
  const {
    followUps,
    rescheduleFollowUp,
    completeFollowUp,
    startCallWithCustomer,
    customers,
    setQuickModal
  } = useApp();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all'>('today');
  const [rescheduleModalItem, setRescheduleModalItem] = useState<FollowUp | null>(null);
  const [newDate, setNewDate] = useState('Tomorrow');
  const [newTime, setNewTime] = useState('02:00 PM');

  const filteredFollowUps = followUps.filter((f: FollowUp) => {
    if (activeTab === 'today') return f.date === 'Today' && f.status !== 'Completed';
    if (activeTab === 'upcoming') return f.date !== 'Today' && f.status !== 'Completed';
    return true;
  });

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleModalItem) return;
    rescheduleFollowUp(rescheduleModalItem.id, newDate, newTime);
    setRescheduleModalItem(null);
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      default:
        return 'bg-command-500/10 text-command-600 dark:text-command-400 border-command-500/30';
    }
  };

  const todayCount = followUps.filter((f: FollowUp) => f.date === 'Today' && f.status !== 'Completed').length;
  const upcomingCount = followUps.filter((f: FollowUp) => f.date !== 'Today' && f.status !== 'Completed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Follow-Up Appointments & Callbacks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage scheduled commitments, SLA check-ins, and customer review calls.
          </p>
        </div>

        <button
          onClick={() => setQuickModal('scheduleFollowUp')}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Schedule Follow-up</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'today'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span>Today's Follow-ups</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'today' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {todayCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'bg-command-600 text-white shadow-md shadow-command-600/20'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <span>Upcoming Schedule</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'upcoming' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
            {upcomingCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-slate-800 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All ({followUps.length})
        </button>
      </div>

      {/* Follow-up Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFollowUps.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No follow-ups scheduled in this view.
          </div>
        ) : (
          filteredFollowUps.map((fu: FollowUp) => {
            const isCompleted = fu.status === 'Completed';

            return (
              <div
                key={fu.id}
                className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'border-slate-200 dark:border-slate-800 opacity-60'
                    : 'border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getPriorityBadge(fu.priority)}`}>
                        {fu.priority} Priority
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-2">
                        {fu.reason}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono block">
                        {fu.date}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {fu.time}
                      </span>
                    </div>
                  </div>

                  {/* Customer line */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 my-3 text-xs">
                    <button
                      onClick={() => navigate(`/customers/${fu.customerId}`)}
                      className="font-bold text-slate-800 dark:text-slate-200 hover:text-command-600 transition-colors flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5 text-command-500" />
                      {fu.customerName}
                    </button>
                    <span className="font-mono text-slate-400 text-[11px]">{fu.phone}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const target = customers.find((c: Customer) => c.id === fu.customerId);
                        if (target) startCallWithCustomer(target, 'Follow-up Callback');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </button>

                    <button
                      onClick={() => {
                        setRescheduleModalItem(fu);
                        setNewDate(fu.date === 'Today' ? 'Tomorrow' : 'Oct 16');
                        setNewTime(fu.time);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reschedule</span>
                    </button>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => completeFollowUp(fu.id)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reschedule Modal */}
      {rescheduleModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
              Reschedule Follow-Up Appointment
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {rescheduleModalItem.customerName} - {rescheduleModalItem.reason}
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">New Date</label>
                <input
                  type="text"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-semibold mb-1">New Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalItem(null)}
                  className="px-3.5 py-2 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-md"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
