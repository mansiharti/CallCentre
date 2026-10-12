import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sentiment } from '../../types';
import {
  Mic,
  MicOff,
  Pause,
  Play,
  PhoneOff,
  UserPlus,
  ArrowRightLeft,
  Grid,
  Shield,
  Wifi,
  Smile,
  Meh,
  Frown,
  Sparkles,
  FileText,
  Clock,
  Phone,
  Building,
  Check
} from 'lucide-react';

export const ActiveCallWorkspace: React.FC = () => {
  const {
    activeCall,
    updateActiveCall,
    endActiveCall,
    customers,
    addToast
  } = useApp();

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [transferTarget, setTransferTarget] = useState('Tier 3 Infrastructure Ops');
  const [participantInput, setParticipantInput] = useState('');

  // Call timer: increments elapsed seconds accurately based on activeCall.startedAt
  useEffect(() => {
    if (!activeCall) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - activeCall.startedAt) / 1000));
      setElapsedSeconds(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeCall]);

  if (!activeCall) return null;

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const customerObj = customers.find(c => c.id === activeCall.customerId);

  const toggleMute = () => {
    const next = !activeCall.isMuted;
    updateActiveCall({ isMuted: next });
    addToast({
      type: 'info',
      title: next ? 'Microphone Muted' : 'Microphone Active',
      message: next ? 'Customer cannot hear your audio.' : 'Your audio line is live.'
    });
  };

  const toggleHold = () => {
    const next = !activeCall.isOnHold;
    updateActiveCall({ isOnHold: next });
    addToast({
      type: 'warning',
      title: next ? 'Call Placed on Hold' : 'Call Resumed',
      message: next ? 'Hold music playing for customer.' : 'Customer reconnected.'
    });
  };

  const setSentiment = (sentiment: Sentiment) => {
    updateActiveCall({ sentiment });
    addToast({
      type: 'info',
      title: 'Sentiment Tagged',
      message: `Updated to ${sentiment}.`
    });
  };

  const handleTransfer = () => {
    setShowTransferModal(false);
    addToast({
      type: 'info',
      title: 'Transfer Initiated',
      message: `Warm transfer initiated to ${transferTarget}. Waiting for pickup.`
    });
  };

  const handleAddParticipant = () => {
    if (!participantInput) return;
    updateActiveCall({
      participants: [...activeCall.participants, participantInput]
    });
    setParticipantInput('');
    setShowAddParticipant(false);
    addToast({
      type: 'success',
      title: 'Participant Joined',
      message: `${participantInput} joined the bridge conference.`
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      {/* Top mission-control bar */}
      <div className="bg-gradient-to-r from-slate-900 via-command-950 to-slate-900 text-white px-4 lg:px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-command-900/50">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-command-600/30 border border-command-500/40 flex items-center justify-center text-command-400">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-ping-slow" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-command-300 font-semibold px-2 py-0.5 rounded bg-command-900/60 border border-command-700/50">
                ACTIVE CALL IN PROGRESS
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Channel: Direct WebRTC
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mt-0.5 flex items-center gap-2">
              {activeCall.customerName}
              <span className="text-xs font-normal text-slate-400 font-mono">
                ({activeCall.customerId})
              </span>
            </h2>
          </div>
        </div>

        {/* Live Running Timer & Waveform */}
        <div className="flex items-center gap-6">
          {/* Audio wave bars */}
          <div className="hidden sm:flex items-center gap-1 h-6">
            <span className={`w-1 rounded-full bg-emerald-400 ${activeCall.isOnHold || activeCall.isMuted ? 'h-1.5' : 'animate-wave-1'}`} />
            <span className={`w-1 rounded-full bg-emerald-400 ${activeCall.isOnHold || activeCall.isMuted ? 'h-1.5' : 'animate-wave-2'}`} />
            <span className={`w-1 rounded-full bg-emerald-400 ${activeCall.isOnHold || activeCall.isMuted ? 'h-1.5' : 'animate-wave-3'}`} />
            <span className={`w-1 rounded-full bg-emerald-400 ${activeCall.isOnHold || activeCall.isMuted ? 'h-1.5' : 'animate-wave-4'}`} />
            <span className={`w-1 rounded-full bg-emerald-400 ${activeCall.isOnHold || activeCall.isMuted ? 'h-1.5' : 'animate-wave-5'}`} />
          </div>

          <div className="text-right">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              {activeCall.isOnHold ? 'HOLD DURATION' : 'CALL DURATION'}
            </div>
            <div className={`font-mono text-2xl font-bold tracking-wider ${activeCall.isOnHold ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
              {formatTimer(elapsedSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* On-Hold notification ribbon */}
      {activeCall.isOnHold && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between text-amber-700 dark:text-amber-300 text-xs font-medium">
          <div className="flex items-center gap-2">
            <Pause className="w-4 h-4 animate-pulse text-amber-500" />
            <span>Customer is currently on hold. Background audio line muted.</span>
          </div>
          <button
            onClick={toggleHold}
            className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
          >
            Resume Call
          </button>
        </div>
      )}

      {/* Main split grid: Customer details & Call Health on Left, Live Notes & Controls on Right */}
      <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Customer metadata & Call Health */}
        <div className="lg:col-span-5 space-y-4">
          {/* Metadata Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Customer Dossier</span>
              <span className="text-[11px] font-semibold text-command-600 dark:text-command-400">
                {activeCall.tier} Plan
              </span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Phone Line</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {activeCall.phone}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Customer Since</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeCall.customerSince}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Category</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {activeCall.category}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Account Company</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                  {customerObj?.company || 'Nexus Enterprise'}
                </span>
              </div>
            </div>

            {customerObj?.currentIssue && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Queue Stated Issue:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5 leading-relaxed">
                  {customerObj.currentIssue}
                </p>
              </div>
            )}
          </div>

          {/* Call Health Metrics Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/60">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Live Call Health & Telemetry
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-center">
                <Wifi className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block">Connection</span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {activeCall.connectionQuality}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-center">
                <div className="flex justify-center mb-1">
                  {activeCall.sentiment === 'Positive' ? (
                    <Smile className="w-4 h-4 text-emerald-500" />
                  ) : activeCall.sentiment === 'Frustrated' ? (
                    <Frown className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Meh className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <span className="text-[10px] text-slate-400 block">Sentiment</span>
                <span
                  className={`text-xs font-bold ${
                    activeCall.sentiment === 'Positive'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : activeCall.sentiment === 'Frustrated'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {activeCall.sentiment}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-center">
                <Clock className="w-4 h-4 text-command-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block">Jitter / RTT</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                  18ms
                </span>
              </div>
            </div>

            {/* Quick Sentiment Selector */}
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">Caller Sentiment:</span>
              <div className="flex items-center gap-1.5">
                {(['Positive', 'Neutral', 'Frustrated'] as Sentiment[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setSentiment(s)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                      activeCall.sentiment === s
                        ? s === 'Positive'
                          ? 'bg-emerald-500 text-white'
                          : s === 'Frustrated'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:opacity-80'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Participants */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Participants ({activeCall.participants.length}): {activeCall.participants.join(', ')}</span>
            <button
              onClick={() => setShowAddParticipant(true)}
              className="text-command-600 dark:text-command-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <UserPlus className="w-3.5 h-3.5" /> + Add Lead
            </button>
          </div>
        </div>

        {/* Right Col: Live Notes & Large Intuitive Call Controls */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Live Notes Input */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-command-500" />
                Live In-Call Notes & Scratchpad
              </label>
              <span className="text-[11px] text-slate-400">
                Will attach automatically to Call Record
              </span>
            </div>
            <textarea
              value={activeCall.liveNotes}
              onChange={e => updateActiveCall({ liveNotes: e.target.value })}
              placeholder="Record details during call: customer verification code, steps performed, refund amount, agreement details..."
              rows={4}
              className="w-full flex-1 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-command-500/20 focus:border-command-500 resize-none font-sans"
            />
          </div>

          {/* Large Intuitive Call Controls */}
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {/* Mute */}
              <button
                onClick={toggleMute}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                  activeCall.isMuted
                    ? 'bg-rose-500 text-white border-rose-600 shadow-glow-rose'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Mute microphone"
              >
                {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
                <span>{activeCall.isMuted ? 'Muted' : 'Mute'}</span>
              </button>

              {/* Hold */}
              <button
                onClick={toggleHold}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                  activeCall.isOnHold
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Put customer on hold"
              >
                {activeCall.isOnHold ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
                <span>{activeCall.isOnHold ? 'Resume' : 'Hold'}</span>
              </button>

              {/* Transfer */}
              <button
                onClick={() => setShowTransferModal(true)}
                className="p-3 rounded-xl border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all"
                title="Transfer call to another queue or supervisor"
              >
                <ArrowRightLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <span>Transfer</span>
              </button>

              {/* Add Participant */}
              <button
                onClick={() => setShowAddParticipant(true)}
                className="p-3 rounded-xl border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all"
                title="Conference 3-way call"
              >
                <UserPlus className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <span>Add Participant</span>
              </button>

              {/* Keypad */}
              <button
                onClick={() => setShowKeypad(prev => !prev)}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                  showKeypad
                    ? 'bg-command-600 text-white border-command-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Toggle numeric DTMF keypad"
              >
                <Grid className="w-5 h-5" />
                <span>Keypad</span>
              </button>

              {/* End Call (prominent) */}
              <button
                onClick={endActiveCall}
                className="p-3 rounded-xl bg-gradient-to-br from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-lg shadow-rose-600/30 flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all transform active:scale-95"
                title="End active call and proceed to wrap-up summary"
              >
                <PhoneOff className="w-5 h-5" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DTMF Keypad Overlay */}
      {showKeypad && (
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-850 flex justify-center animate-in fade-in">
          <div className="w-full max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">Numeric DTMF Tones</span>
              <button
                onClick={() => setShowKeypad(false)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Close Keypad
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
                <button
                  key={key}
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: `DTMF Tone "${key}" sent`,
                      message: 'Transmitted in-band tone.'
                    });
                  }}
                  className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-base font-bold text-slate-800 dark:text-slate-200 hover:bg-command-500 hover:text-white dark:hover:bg-command-600 transition-colors"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transfer Dialog Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <ArrowRightLeft className="w-5 h-5 text-command-500" />
              Transfer Active Call
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select department or specialist queue for transfer.
            </p>

            <div className="space-y-2 mb-4">
              {[
                'Tier 3 Infrastructure Ops',
                'Senior Billing & Refunds Desk',
                'Identity & SAML Engineering',
                'Executive Relations / Escalations'
              ].map(opt => (
                <label
                  key={opt}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs font-medium transition-all ${
                    transferTarget === opt
                      ? 'border-command-500 bg-command-50 dark:bg-command-950/40 text-command-700 dark:text-command-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{opt}</span>
                  <input
                    type="radio"
                    name="transferOpt"
                    checked={transferTarget === opt}
                    onChange={() => setTransferTarget(opt)}
                    className="accent-command-600"
                  />
                </label>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowTransferModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleTransfer}
                className="px-4 py-2 text-xs font-bold text-white bg-command-600 hover:bg-command-700 rounded-xl shadow-md shadow-command-600/20"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
              <UserPlus className="w-5 h-5 text-command-500" />
              Add Participant to Call Bridge
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Enter name or extension of specialist to join conference.
            </p>

            <input
              type="text"
              placeholder="e.g. Jordan Hayes (Tier 2 Lead)"
              value={participantInput}
              onChange={e => setParticipantInput(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs sm:text-sm text-slate-900 dark:text-slate-100 mb-4 focus:outline-none focus:border-command-500"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddParticipant(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAddParticipant}
                className="px-4 py-2 text-xs font-bold text-white bg-command-600 hover:bg-command-700 rounded-xl shadow-md shadow-command-600/20"
              >
                Bridge Participant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
