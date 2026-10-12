import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Building,
  MapPin,
  Calendar,
  Clock,
  CheckSquare,
  ArrowLeft,
  Smile,
  Meh,
  Frown,
  Plus,
  Send,
  AlertCircle
} from 'lucide-react';
import { TimelineEvent, Sentiment, CallRecord, Task, FollowUp } from '../types';

export const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    customers,
    timelineEvents,
    addTimelineEvent,
    startCallWithCustomer,
    calls,
    tasks,
    followUps,
    updateCustomer,
    setQuickModal,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'calls' | 'tasks' | 'notes'>('timeline');
  const [newNoteInput, setNewNoteInput] = useState('');
  const [customEventSummary, setCustomEventSummary] = useState('');
  const [customEventDetails, setCustomEventDetails] = useState('');
  const [customEventType, setCustomEventType] = useState<'System Note' | 'Email' | 'Chat'>('System Note');
  const [showAddEvent, setShowAddEvent] = useState(false);

  const customer = customers.find(c => c.id === id) || customers[0];

  if (!customer) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Customer profile not found.</p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-3 px-4 py-2 bg-command-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  const events: TimelineEvent[] = timelineEvents[customer.id] || [
    {
      id: `TL-def-1`,
      customerId: customer.id,
      timestamp: 'Today, 09:30 AM',
      relativeDate: 'Today',
      type: 'Phone Call',
      summary: 'Inbound consultation: Account verification and SLA review',
      details: 'Customer verified phone credentials. Provided overview of active entitlements.',
      staffMember: 'Alex Mercer',
      sentiment: 'Positive',
      duration: '04:12'
    },
    {
      id: `TL-def-2`,
      customerId: customer.id,
      timestamp: 'Yesterday, 02:40 PM',
      relativeDate: 'Yesterday',
      type: 'Email',
      summary: 'Automated receipt and tax invoice sent',
      details: 'System dispatched monthly statement for active subscriptions.',
      staffMember: 'Billing Bot',
      sentiment: 'Neutral'
    }
  ];

  const customerCalls = calls.filter((c: CallRecord) => c.customerId === customer.id);
  const customerTasks = tasks.filter((t: Task) => t.customerId === customer.id);
  const customerFollowUps = followUps.filter((f: FollowUp) => f.customerId === customer.id);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;

    const updatedNotes = [newNoteInput.trim(), ...(customer.notes || [])];
    updateCustomer(customer.id, { notes: updatedNotes });

    addTimelineEvent({
      customerId: customer.id,
      timestamp: 'Just now',
      relativeDate: 'Today',
      type: 'System Note',
      summary: 'Staff added account note',
      details: newNoteInput.trim(),
      staffMember: 'Alex Mercer',
      sentiment: 'Neutral'
    });

    setNewNoteInput('');
    addToast({
      type: 'success',
      title: 'Note Recorded',
      message: 'Note saved to customer dossier and timeline.'
    });
  };

  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEventSummary.trim()) return;

    addTimelineEvent({
      customerId: customer.id,
      timestamp: 'Just now',
      relativeDate: 'Today',
      type: customEventType,
      summary: customEventSummary,
      details: customEventDetails || customEventSummary,
      staffMember: 'Alex Mercer',
      sentiment: 'Neutral'
    });

    setCustomEventSummary('');
    setCustomEventDetails('');
    setShowAddEvent(false);
    addToast({
      type: 'success',
      title: 'Timeline Event Logged',
      message: 'Event added to vertical timeline.'
    });
  };

  const getSentimentIcon = (sentiment: Sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return <Smile className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Frustrated':
        return <Frown className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Meh className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/customers')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers Directory</span>
        </button>
      </div>

      {/* CUSTOMER 360 HEADER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Avatar & primary info */}
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-command-500/20 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {customer.name}
                </h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                  {customer.id}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                  {customer.tier} Tier
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  {customer.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
                {customer.company && (
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {customer.company}
                  </span>
                )}
                {customer.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {customer.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Client since {customer.customerSince}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => startCallWithCustomer(customer, 'Outbound 360 Direct')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Call Customer</span>
            </button>
            <button
              onClick={() => setQuickModal('createTask')}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckSquare className="w-4 h-4 text-command-500" />
              <span>Assign Task</span>
            </button>
            <button
              onClick={() => setQuickModal('scheduleFollowUp')}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Follow-Up</span>
            </button>
          </div>
        </div>

        {/* RECENT CUSTOMER MEMORY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Recent Customer Memory: Last Interaction
            </span>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-command-500" />
              <span>{customer.lastInteraction}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
              Open Commitments & SLA Deadlines
            </span>
            <div className="text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{customer.openCommitments || 'No pending contractual commitments.'}</span>
            </div>
          </div>
        </div>

        {/* Stated Issue banner if any */}
        {customer.currentIssue && (
          <div className="mt-3 p-3.5 rounded-xl bg-command-50/50 dark:bg-command-950/20 border border-command-500/20 text-xs">
            <span className="text-command-700 dark:text-command-300 font-bold block mb-0.5">
              Current Open Case / Stated Issue:
            </span>
            <p className="text-slate-700 dark:text-slate-300">{customer.currentIssue}</p>
          </div>
        )}
      </div>

      {/* Tabs Layout: Timeline, Calls, Tasks, Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Tabs & Vertical Timeline */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Tabs Header */}
            <div className="flex items-center justify-between px-6 pt-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
              <div className="flex items-center gap-6">
                {[
                  { id: 'timeline', label: 'Customer Timeline', count: events.length },
                  { id: 'calls', label: 'Call Records', count: customerCalls.length },
                  { id: 'tasks', label: 'Open Tasks', count: customerTasks.length },
                  { id: 'notes', label: 'Dossier Notes', count: customer.notes?.length || 0 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                      activeTab === tab.id
                        ? 'border-command-500 text-command-600 dark:text-command-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {activeTab === 'timeline' && (
                <button
                  onClick={() => setShowAddEvent(prev => !prev)}
                  className="text-xs font-bold text-command-600 dark:text-command-400 pb-3 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Event
                </button>
              )}
            </div>

            {/* Quick manual event logger form */}
            {showAddEvent && activeTab === 'timeline' && (
              <form onSubmit={handleAddCustomEvent} className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Log New Interaction on Timeline
                  </span>
                  <button type="button" onClick={() => setShowAddEvent(false)} className="text-slate-400">
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={customEventType}
                    onChange={e => setCustomEventType(e.target.value as any)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="System Note">System Note</option>
                    <option value="Email">Email</option>
                    <option value="Chat">Live Chat</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Event Summary..."
                    value={customEventSummary}
                    onChange={e => setCustomEventSummary(e.target.value)}
                    className="col-span-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Detailed notes (optional)..."
                  value={customEventDetails}
                  onChange={e => setCustomEventDetails(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
                <button type="submit" className="px-3.5 py-1.5 bg-command-600 text-white font-bold rounded-lg">
                  Append to Timeline
                </button>
              </form>
            )}

            {/* Tab: VERTICAL INTERACTION TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="p-6">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {events.map((evt) => (
                    <div key={evt.id} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-command-500 ring-4 ring-white dark:ring-slate-900 group-hover:scale-125 transition-transform" />

                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:bg-white dark:hover:bg-slate-850 hover:shadow-sm transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-command-100 dark:bg-command-950 text-command-700 dark:text-command-300">
                              {evt.type}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {evt.summary}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                            <span>{evt.timestamp}</span>
                            {evt.duration && <span>({evt.duration})</span>}
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                          {evt.details}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                          <span>Handled by: <strong className="text-slate-700 dark:text-slate-300">{evt.staffMember}</strong></span>
                          <div className="flex items-center gap-1 font-medium">
                            {getSentimentIcon(evt.sentiment)}
                            <span>{evt.sentiment}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: CALL RECORDS */}
            {activeTab === 'calls' && (
              <div className="p-6">
                {customerCalls.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">
                    No historical calls recorded for this customer yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {customerCalls.map((c: CallRecord) => (
                      <div key={c.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{c.category} Call</span>
                          <span className="font-mono text-slate-400">{c.timestamp} • {c.duration}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">{c.notes}</p>
                        <div className="mt-2 text-[11px] font-semibold text-command-600 dark:text-command-400">
                          Outcome: {c.outcome}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: OPEN TASKS */}
            {activeTab === 'tasks' && (
              <div className="p-6">
                {customerTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">
                    No open tasks linked to this customer account.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customerTasks.map((t: Task) => (
                      <div key={t.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">{t.title}</div>
                          <span className="text-[11px] text-slate-400">Due: {t.dueDate}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                          {t.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: NOTES */}
            {activeTab === 'notes' && (
              <div className="p-6 space-y-4">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder="Add an internal note or context to this customer dossier..."
                    value={newNoteInput}
                    onChange={e => setNewNoteInput(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-command-500"
                  />
                  <button type="submit" className="px-4 py-2 bg-command-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" /> Save Note
                  </button>
                </form>

                <div className="space-y-2 pt-2">
                  {customer.notes?.map((n: string, i: number) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs text-slate-700 dark:text-slate-300">
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Quick Metadata & Open Commitments */}
        <div className="lg:col-span-4 space-y-4">
          {/* Contact Details Card */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[11px]">
              Direct Contact Channels
            </h3>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Phone Line</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{customer.phone}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Email Address</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{customer.email}</span>
              </div>
            </div>
          </div>

          {/* Account Tags */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] mb-2.5">
              Account Segmentation Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {customer.tags?.map((t: string) => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-command-50 dark:bg-command-950/40 text-command-700 dark:text-command-300 text-[11px] font-semibold border border-command-500/20">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Scheduled Follow-ups for this customer */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-400 text-[11px] mb-2.5 flex items-center justify-between">
              <span>Scheduled Follow-ups</span>
              <button
                onClick={() => setQuickModal('scheduleFollowUp')}
                className="text-command-600 dark:text-command-400 hover:underline"
              >
                + Schedule
              </button>
            </h3>
            {customerFollowUps.length === 0 ? (
              <p className="text-[11px] text-slate-400">No callbacks scheduled for this account.</p>
            ) : (
              <div className="space-y-2">
                {customerFollowUps.map((fu: FollowUp) => (
                  <div key={fu.id} className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-500/20">
                    <span className="font-bold text-amber-900 dark:text-amber-200 block">{fu.reason}</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400">{fu.date} at {fu.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
