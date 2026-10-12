import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KBArticle } from '../types';
import {
  Search,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';

export const KnowledgeBase: React.FC = () => {
  const { kbArticles, voteArticle, activeCall, updateActiveCall, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<KBArticle | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'All',
    'Billing',
    'Account',
    'Technical Support',
    'Refunds',
    'Products',
    'Policies'
  ];

  const filteredArticles = kbArticles.filter((a: KBArticle) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t: string) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopySnippet = (art: KBArticle) => {
    navigator.clipboard.writeText(art.content);
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2500);

    // If active call is running, offer to append to notes
    if (activeCall) {
      updateActiveCall({
        liveNotes: (activeCall.liveNotes ? activeCall.liveNotes + '\n' : '') + `[Ref ${art.id}] ${art.title}`
      });
      addToast({
        type: 'success',
        title: 'Copied & Appended to Call Notes',
        message: `Reference to ${art.id} attached to active call scratchpad.`
      });
    } else {
      addToast({
        type: 'info',
        title: 'Copied to Clipboard',
        message: 'Article instructions ready to paste.'
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Standard Support Knowledge Base
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access certified company runbooks, compliance protocols, and technical troubleshooting steps.
          </p>
        </div>

        {activeCall && (
          <div className="px-3 py-1.5 rounded-xl bg-command-500/10 border border-command-500/30 text-command-600 dark:text-command-400 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Call Live Helper Enabled</span>
          </div>
        )}
      </div>

      {/* Search & Category Pills */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search runbooks by keyword, error code, or policy (e.g. SAML, refund, quota, HIPAA)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-command-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-command-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No knowledge base runbooks matched your query.
          </div>
        ) : (
          filteredArticles.map((art: KBArticle) => (
            <div
              key={art.id}
              onClick={() => setActiveArticle(art)}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-command-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-command-100 dark:bg-command-950 text-command-700 dark:text-command-300">
                    {art.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {art.readTime} • Updated {art.updatedAt}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-command-600 transition-colors leading-snug mb-2">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {art.summary}
                </p>
              </div>

              {/* Tags & Action */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {art.tags.slice(0, 3).map((tag: string) => (
                    <span key={tag} className="text-[10px] text-slate-400 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>

                <span className="text-command-600 dark:text-command-400 font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Guide <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ARTICLE READER MODAL */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-850/50">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-command-100 dark:bg-command-950 text-command-700 dark:text-command-300">
                    {activeArticle.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {activeArticle.id} • {activeArticle.readTime}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {activeArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveArticle(null)}
                className="p-1 text-slate-400 hover:text-slate-600 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 rounded-xl bg-command-50/50 dark:bg-command-950/20 border border-command-500/20 text-command-900 dark:text-command-200 font-medium leading-relaxed">
                {activeArticle.summary}
              </div>

              <div className="whitespace-pre-line text-slate-800 dark:text-slate-200 font-sans leading-relaxed space-y-2">
                {activeArticle.content}
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 text-[11px] font-semibold">Indexed Keywords:</span>
                {activeArticle.tags.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500">
                    #{t}
                  </span>
                ))}
              </div>

              {/* WAS THIS ARTICLE HELPFUL? Feedback section */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                    Was this article helpful?
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {activeArticle.helpfulCount} people found this helpful
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => voteArticle(activeArticle.id, 'yes')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeArticle.userVote === 'yes'
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Yes ({activeArticle.helpfulCount})</span>
                  </button>

                  <button
                    onClick={() => voteArticle(activeArticle.id, 'no')}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      activeArticle.userVote === 'no'
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
              <button
                onClick={() => handleCopySnippet(activeArticle)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {copiedId === activeArticle.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === activeArticle.id ? 'Copied!' : 'Copy to Call Notes'}</span>
              </button>

              <button
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 rounded-xl bg-command-600 hover:bg-command-700 text-white font-bold text-xs"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
