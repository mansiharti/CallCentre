import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CallOutcome, Priority } from '../../types';
import {
  PhoneOff,
  Sparkles,
  Calendar,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  X,
  Save,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const CallSummaryModal: React.FC = () => {
  const {
    activeCall,
    pendingEndCallModal,
    setPendingEndCallModal,
    finalizeCallSummary
  } = useApp();

  const [outcome, setOutcome] = useState<CallOutcome>('Resolved');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('Tomorrow');
  const [followUpTime, setFollowUpTime] = useState('11:00 AM');
  const [followUpReason, setFollowUpReason] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  useEffect(() => {
    if (activeCall) {
      setNotes(activeCall.liveNotes || '');
      setFollowUpReason(`Follow-up with ${activeCall.customerName} regarding ${activeCall.category}`);
      if (activeCall.sentiment === 'Frustrated') {
        setOutcome('Follow-up required');
        setPriority('High');
      } else {
        setOutcome('Resolved');
        setPriority('Medium');
      }
    }
  }, [activeCall, pendingEndCallModal]);

  if (!pendingEndCallModal || !activeCall) return null;

  // Rule-based Smart Next Action recommendation
  const getSmartNextAction = (out: CallOutcome) => {
    switch (out) {
      case 'Resolved':
        return {
          title: 'Mark Case Closed & Dispatch Survey',
          desc: 'Recommended next action: Case meets resolution criteria. Trigger automated CSAT feedback survey and issue updated receipt.',
          color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
        };
      case 'Follow-up required':
        return {
          title: 'Schedule Callback Within 24 Hours',
          desc: 'Recommended next action: Customer issue requires verification. Auto-populated follow-up slot in your calendar below.',
          color: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300'
        };
      case 'Escalated':
        return {
          title: 'Dispatch Escalation Ticket to Tier 3 Team',
          desc: 'Recommended next action: Issue exceeds frontline scope. Notify on-call lead on Slack and link recording transcript.',
          color: 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300'
        };
      case 'Customer unavailable':
        return {
          title: 'Log Voicemail & Send Callback Link',
          desc: 'Recommended next action: Automated SMS notification with calendar booking link dispatched to customer mobile.',
          color: 'border-blue-500/30 bg-blue-500/10 text-blue-800 dark:text-blue-300'
        };
    }
  };

  const smartAction = getSmartNextAction(outcome);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    finalizeCallSummary({
      outcome,
      notes,
      priority,
      ...(outcome === 'Follow-up required' || followUpDate
        ? {
            followUpDate,
            followUpTime,
            followUpReason
          }
        : {})
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <PhoneOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Call Wrap-Up & Summary
              </h3>
              <p className="text-xs text-slate-400">
                Customer: <span className="text-slate-200 font-semibold">{activeCall.customerName}</span> ({activeCall.phone})
              </p>
            </div>
          </div>
          <button
            onClick={() => setPendingEndCallModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Outcome Radio Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Call Outcome <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Resolved', 'Follow-up required', 'Escalated', 'Customer unavailable'] as CallOutcome[]).map(
                opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setOutcome(opt)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      outcome === opt
                        ? 'border-command-500 bg-command-50 dark:bg-command-950/40 text-command-700 dark:text-command-300 ring-2 ring-command-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{opt}</span>
                    {outcome === opt && <CheckCircle2 className="w-4 h-4 text-command-500 shrink-0" />}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Smart Next Action (Rule-based recommendation!) */}
          <div className={`p-3.5 rounded-xl border ${smartAction.color} transition-all`}>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Smart Next Action Engine</span>
            </div>
            <div className="text-xs font-bold">{smartAction.title}</div>
            <p className="text-xs opacity-90 mt-0.5 leading-relaxed">{smartAction.desc}</p>
          </div>

          {/* Call Notes Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Call Notes & Key Takeaways <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Summary of customer conversation, issues diagnosed, voucher IDs, and agreed actions..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-command-500 focus:ring-2 focus:ring-command-500/20 resize-none font-sans"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Record Priority
            </label>
            <div className="flex items-center gap-2">
              {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    priority === p
                      ? p === 'Critical'
                        ? 'bg-rose-500 text-white border-rose-600'
                        : p === 'High'
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-command-600 text-white border-command-700'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up Section (conditional or always editable) */}
          {outcome === 'Follow-up required' && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-command-500" />
                <span>Schedule Automatic Follow-Up</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Date</label>
                  <input
                    type="text"
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                    placeholder="e.g. Tomorrow or Oct 15"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Target Time</label>
                  <input
                    type="text"
                    value={followUpTime}
                    onChange={e => setFollowUpTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Follow-up Reason</label>
                <input
                  type="text"
                  value={followUpReason}
                  onChange={e => setFollowUpReason(e.target.value)}
                  placeholder="Reason for callback"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setPendingEndCallModal(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Resume Call
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-command-600 hover:bg-command-700 rounded-xl shadow-lg shadow-command-600/30 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              Save Record & Free Line
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
