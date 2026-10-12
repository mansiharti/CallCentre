import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CallRecord, CallOutcome, Sentiment } from '../types';
import {
  Phone,
  PhoneCall,
  Search,
  Filter,
  Play,
  Pause,
  Clock,
  Sparkles,
  Smile,
  Meh,
  Frown,
  ArrowRight,
  Volume2
} from 'lucide-react';

export const Calls: React.FC = () => {
  const { calls, startCallWithCustomer, customers, activeCall } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<string>('all');
  const [sentimentFilter, setSentimentFilter] = useState<string>('all');
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  const filteredCalls = calls.filter((call: CallRecord) => {
    const matchesSearch =
      call.customerName.toLowerCase().includes(search.toLowerCase()) ||
      call.category.toLowerCase().includes(search.toLowerCase()) ||
      call.phone.includes(search) ||
      call.notes.toLowerCase().includes(search.toLowerCase());

    const matchesOutcome = outcomeFilter === 'all' || call.outcome === outcomeFilter;
    const matchesSentiment = sentimentFilter === 'all' || call.sentiment === sentimentFilter;

    return matchesSearch && matchesOutcome && matchesSentiment;
  });

  const togglePlayback = (id: string) => {
    setPlayingCallId(prev => (prev === id ? null : id));
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

  const getOutcomeBadge = (outcome: CallOutcome) => {
    switch (outcome) {
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'Follow-up required':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'Escalated':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      case 'Customer unavailable':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Call Logs & Session Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse call records, listen to simulated playback waveforms, and review Smart Action notes.
          </p>
        </div>

        {activeCall && (
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 animate-pulse"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Return to Active Call ({activeCall.customerName})</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer, category, notes, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-command-500"
          />
        </div>

        {/* Outcome Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Outcome:</span>
          </div>
          <select
            value={outcomeFilter}
            onChange={e => setOutcomeFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Outcomes</option>
            <option value="Resolved">Resolved</option>
            <option value="Follow-up required">Follow-up required</option>
            <option value="Escalated">Escalated</option>
            <option value="Customer unavailable">Customer unavailable</option>
          </select>

          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={e => setSentimentFilter(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="all">All Sentiments</option>
            <option value="Positive">Positive</option>
            <option value="Neutral">Neutral</option>
            <option value="Frustrated">Frustrated</option>
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Sentiment</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Audio Tape</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No call records matched your search filters.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call: CallRecord) => {
                  const isPlaying = playingCallId === call.id;

                  return (
                    <tr
                      key={call.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedCall(call)}
                    >
                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 hover:text-command-600 transition-colors">
                          {call.customerName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{call.phone}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {call.category}
                      </td>

                      {/* Duration */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {call.duration}
                      </td>

                      {/* Outcome */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getOutcomeBadge(call.outcome)}`}>
                          {call.outcome}
                        </span>
                      </td>

                      {/* Sentiment */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                          {getSentimentIcon(call.sentiment)}
                          <span>{call.sentiment}</span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {call.timestamp}
                      </td>

                      {/* Audio playback simulator */}
                      <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg w-fit">
                          <button
                            onClick={() => togglePlayback(call.id)}
                            className="p-1 rounded bg-command-600 text-white hover:bg-command-700 transition-colors"
                            title={isPlaying ? 'Pause audio' : 'Play call audio'}
                          >
                            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </button>
                          <div className="flex items-center gap-0.5 h-3">
                            <span className={`w-0.5 bg-command-500 rounded-full ${isPlaying ? 'animate-wave-1 h-3' : 'h-1.5'}`} />
                            <span className={`w-0.5 bg-command-500 rounded-full ${isPlaying ? 'animate-wave-2 h-3' : 'h-2'}`} />
                            <span className={`w-0.5 bg-command-500 rounded-full ${isPlaying ? 'animate-wave-3 h-3' : 'h-1'}`} />
                            <span className={`w-0.5 bg-command-500 rounded-full ${isPlaying ? 'animate-wave-4 h-3' : 'h-2.5'}`} />
                            <span className={`w-0.5 bg-command-500 rounded-full ${isPlaying ? 'animate-wave-5 h-3' : 'h-1.5'}`} />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            {isPlaying ? '01:14' : call.duration}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedCall(call);
                          }}
                          className="text-xs text-command-600 dark:text-command-400 font-bold hover:underline"
                        >
                          View Log
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Detail Inspection Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {selectedCall.id} • AGENT: {selectedCall.agent}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Call Record: {selectedCall.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs">
              {/* Audio Player Widget */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-command-500 text-white flex items-center justify-center">
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      SIP Audio Track (Encrypted Opus)
                    </div>
                    <div className="text-[10px] text-slate-400">Duration: {selectedCall.duration}</div>
                  </div>
                </div>
                <button
                  onClick={() => togglePlayback(selectedCall.id)}
                  className="px-3 py-1.5 rounded-lg bg-command-600 text-white font-bold text-xs hover:bg-command-700 transition-colors flex items-center gap-1.5"
                >
                  {playingCallId === selectedCall.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{playingCallId === selectedCall.id ? 'Pause' : 'Play Audio'}</span>
                </button>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div>
                  <span className="text-slate-400 block text-[10px]">Outcome</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold mt-0.5 ${getOutcomeBadge(selectedCall.outcome)}`}>
                    {selectedCall.outcome}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sentiment</span>
                  <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {getSentimentIcon(selectedCall.sentiment)}
                    <span>{selectedCall.sentiment}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone Line</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {selectedCall.phone}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Timestamp</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {selectedCall.timestamp}
                  </span>
                </div>
              </div>

              {/* Agent Notes */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Agent Call Notes
                </span>
                <p className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {selectedCall.notes}
                </p>
              </div>

              {/* Smart Next Action Box */}
              {selectedCall.smartActionTaken && (
                <div className="p-3 rounded-xl border border-command-500/30 bg-command-50/50 dark:bg-command-950/30 text-command-900 dark:text-command-300">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Smart Action Executed</span>
                  </div>
                  <p className="text-[11px] opacity-90">{selectedCall.smartActionTaken}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
              <button
                onClick={() => {
                  const targetCust = customers.find((c: any) => c.id === selectedCall.customerId);
                  if (targetCust) {
                    startCallWithCustomer(targetCust, selectedCall.category);
                    setSelectedCall(null);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Redial Customer
              </button>

              <button
                onClick={() => {
                  navigate(`/customers/${selectedCall.customerId}`);
                  setSelectedCall(null);
                }}
                className="px-3.5 py-2 rounded-xl bg-command-600 hover:bg-command-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Customer 360 View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
