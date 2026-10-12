import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CallRecord } from '../types';
import {
  TrendingUp,
  CheckCircle2,
  Star,
  ShieldCheck
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { calls } = useApp();
  const [period, setPeriod] = useState<'today' | 'weekly'>('today');

  // Metrics based on actual state and realistic baselines
  const callsHandled = calls.length + (period === 'today' ? 14 : 68);
  const resolvedCalls = calls.filter((c: CallRecord) => c.outcome === 'Resolved').length + (period === 'today' ? 12 : 62);
  const resolutionRate = Math.round((resolvedCalls / callsHandled) * 100);
  const avgHandlingTime = period === 'today' ? '04:32' : '04:18';
  const csatScore = '94%';
  const fcrScore = '89%'; // First-call resolution

  // Hourly volume simulation
  const hourlyData = [
    { time: '08:00', calls: 3, height: '35%' },
    { time: '09:00', calls: 8, height: '80%' },
    { time: '10:00', calls: 10, height: '100%' },
    { time: '11:00', calls: 7, height: '70%' },
    { time: '12:00', calls: 4, height: '40%' },
    { time: '13:00', calls: 6, height: '60%' },
    { time: '14:00', calls: 9, height: '90%' },
    { time: '15:00', calls: 5, height: '50%' }
  ];

  // Outcome breakdown data
  const outcomeStats = [
    { label: 'Resolved', count: 78, color: 'bg-emerald-500', pct: '78%' },
    { label: 'Follow-up Scheduled', count: 12, color: 'bg-amber-500', pct: '12%' },
    { label: 'Tier 3 Escalated', count: 6, color: 'bg-rose-500', pct: '6%' },
    { label: 'Left Voicemail', count: 4, color: 'bg-slate-400', pct: '4%' }
  ];

  const recentReviews = [
    {
      customer: 'Marcus Vance',
      rating: 5,
      comment: 'Alex solved our Black Friday API rate burst in 8 minutes flat. Outstanding clarity.',
      time: 'Today, 08:45 AM'
    },
    {
      customer: 'Sarah Wilson',
      rating: 5,
      comment: 'Reversed our duplicate credit card invoice immediately and followed up with confirmation.',
      time: 'Today, 09:20 AM'
    },
    {
      customer: 'Javier Morales',
      rating: 4,
      comment: 'Helped our restaurant reset POS terminal connectivity before lunch rush.',
      time: 'Yesterday'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Period Switcher */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-command-100 dark:bg-command-950 text-command-700 dark:text-command-300 font-semibold">
              AGENT TELEMETRY
            </span>
            <span className="text-xs text-slate-400">• Station #04-WEST</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Performance & Quality Scorecard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review your resolution velocity, First-Call Resolution (FCR), and caller CSAT trends.
          </p>
        </div>

        {/* Today vs Weekly toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setPeriod('today')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'today'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Today's Performance
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              period === 'weekly'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Weekly Overview
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-400 block mb-1">Calls Handled</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {callsHandled}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 100% SLA target met
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-400 block mb-1">Resolution Rate</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {resolutionRate}%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {resolvedCalls} cases resolved
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-400 block mb-1">Average Handle Time</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
            {avgHandlingTime}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Goal: &lt; 05:00 min
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-medium text-slate-400 block mb-1">First-Call Resolution</span>
          <div className="text-2xl font-bold text-command-600 dark:text-command-400 font-mono">
            {fcrScore}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> +4% above team avg
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1">
          <span className="text-xs font-medium text-slate-400 block mb-1">CSAT Satisfaction</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            {csatScore}
          </div>
          <span className="text-[11px] text-amber-500 font-medium mt-1 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-500" /> Tier 1 Operator Rank
          </span>
        </div>
      </div>

      {/* Clean SVG Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly distribution bar chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Call Volume Distribution by Hour
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Peak call density recorded between 09:00 - 11:00 AM
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                Peak: 10 calls/hr
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
              {hourlyData.map(d => (
                <div key={d.time} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.calls}
                  </div>
                  <div
                    style={{ height: d.height }}
                    className="w-full max-w-[28px] rounded-t-lg bg-command-500 group-hover:bg-command-600 transition-all duration-300 relative"
                  />
                  <span className="text-[10px] font-mono text-slate-400">
                    {d.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Shift duration: 08:00 - 16:00</span>
            <span className="font-semibold text-command-600 dark:text-command-400">
              Avg queue wait time: 1m 24s
            </span>
          </div>
        </div>

        {/* Resolution Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
              Case Resolution Breakdown
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Categorization of completed customer encounters
            </p>

            {/* Stacked Progress Bar */}
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex mb-4">
              <div style={{ width: '78%' }} className="bg-emerald-500" title="Resolved (78%)" />
              <div style={{ width: '12%' }} className="bg-amber-500" title="Follow-up (12%)" />
              <div style={{ width: '6%' }} className="bg-rose-500" title="Escalated (6%)" />
              <div style={{ width: '4%' }} className="bg-slate-400" title="Unavailable (4%)" />
            </div>

            {/* Legend list */}
            <div className="space-y-2.5">
              {outcomeStats.map(stat => (
                <div key={stat.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stat.color}`} />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {stat.label}
                    </span>
                  </div>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {stat.pct}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Exceeds Q4 quality compliance threshold (90%)</span>
          </div>
        </div>
      </div>

      {/* Customer Survey Feedback Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
          Recent Caller Quality Reviews & CSAT Quotes
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Real customer feedback collected directly via automated post-call SMS & email surveys.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentReviews.map((rev, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{rev.customer}</span>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-3 block">{rev.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
