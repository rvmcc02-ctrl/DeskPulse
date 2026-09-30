import React, { useState } from 'react';
import { Sparkles, FileText, Wand2, Compass, Loader2, CheckCircle2, Copy, AlertCircle } from 'lucide-react';

export const AIPromptSuite: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'summarizer' | 'optimizer' | 'matcher'>('summarizer');

  // Summarizer state
  const [summarizerInput, setSummarizerInput] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [summarizerLoading, setSummarizerLoading] = useState(false);
  const [summarizerError, setSummarizerError] = useState('');

  // Optimizer state
  const [optimizerInput, setOptimizerInput] = useState('');
  const [optimizerResult, setOptimizerResult] = useState<any>(null);
  const [optimizerLoading, setOptimizerLoading] = useState(false);

  // Software Matcher state
  const [matcherOs, setMatcherOs] = useState('Windows 11/10');
  const [matcherCategory, setMatcherCategory] = useState('Productivity & Notes');
  const [matcherPriorities, setMatcherPriorities] = useState('Privacy, Fast Load, Zero Ads');
  const [matcherResult, setMatcherResult] = useState<any>(null);
  const [matcherLoading, setMatcherLoading] = useState(false);

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSummarize = async () => {
    if (!summarizerInput.trim()) return;
    setSummarizerLoading(true);
    setSummarizerError('');
    setSummaryResult('');

    try {
      const res = await fetch('/api/gemini/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: summarizerInput, format: 'concise' }),
      });
      const data = await res.json();
      if (res.ok) {
        setSummaryResult(data.summary);
      } else {
        setSummarizerError(data.error || 'Failed to generate summary.');
      }
    } catch (e: any) {
      setSummarizerError(e.message || 'Server network error.');
    } finally {
      setSummarizerLoading(false);
    }
  };

  const handleOptimizePrompt = async () => {
    if (!optimizerInput.trim()) return;
    setOptimizerLoading(true);
    setOptimizerResult(null);

    try {
      const res = await fetch('/api/gemini/prompt-optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: optimizerInput, targetPlatform: 'Desktop AI Assistant' }),
      });
      const data = await res.json();
      if (res.ok) {
        setOptimizerResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOptimizerLoading(false);
    }
  };

  const handleSoftwareMatch = async () => {
    setMatcherLoading(true);
    setMatcherResult(null);

    try {
      const res = await fetch('/api/gemini/software-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ os: matcherOs, category: matcherCategory, priorities: matcherPriorities }),
      });
      const data = await res.json();
      if (res.ok) {
        setMatcherResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMatcherLoading(false);
    }
  };

  return (
    <section id="ai-suite" className="py-12 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Server-Side Gemini 3.8 AI Suite</span>
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
            AI Desktop Utility & Prompt Tools
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Zero-friction AI productivity tools designed for instant desktop summaries, prompt engineering, and smart software recommendations.
          </p>
        </div>

        {/* Segmented Control Tool Switcher */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTool('summarizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'summarizer'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AI Summarizer</span>
          </button>

          <button
            onClick={() => setActiveTool('optimizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'optimizer'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>Prompt Enhancer</span>
          </button>

          <button
            onClick={() => setActiveTool('matcher')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTool === 'matcher'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Software Matcher AI</span>
          </button>
        </div>

        {/* Tool 1: Summarizer */}
        {activeTool === 'summarizer' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-4xl mx-auto space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Paste Web Article, Tech Doc, or Long Text
              </label>
              <textarea
                value={summarizerInput}
                onChange={(e) => setSummarizerInput(e.target.value)}
                rows={5}
                placeholder="Paste text or article contents here to generate an instant bulleted summary..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Powered by Gemini 3.8 Flash
              </span>
              <button
                onClick={handleSummarize}
                disabled={summarizerLoading || !summarizerInput.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all"
              >
                {summarizerLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Summarizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Summary</span>
                  </>
                )}
              </button>
            </div>

            {summarizerError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{summarizerError}</span>
              </div>
            )}

            {summaryResult && (
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    AI Summary Result
                  </span>
                  <button
                    onClick={() => copyText(summaryResult, 'summary')}
                    className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedIndex === 'summary' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {summaryResult}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tool 2: Prompt Enhancer */}
        {activeTool === 'optimizer' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-4xl mx-auto space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Original Prompt / Text Snippet
              </label>
              <input
                type="text"
                value={optimizerInput}
                onChange={(e) => setOptimizerInput(e.target.value)}
                placeholder="e.g., Write a speed optimization guide for Windows 11"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500">
                Enhances structure, context, and output format
              </span>
              <button
                onClick={handleOptimizePrompt}
                disabled={optimizerLoading || !optimizerInput.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all"
              >
                {optimizerLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enhancing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Optimize Prompt</span>
                  </>
                )}
              </button>
            </div>

            {optimizerResult && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                    <span>Enhanced Structured Prompt:</span>
                    <button
                      onClick={() => copyText(optimizerResult.enhancedPrompt, 'enhanced')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedIndex === 'enhanced' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs font-mono text-slate-200">{optimizerResult.enhancedPrompt}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>System Directive:</span>
                    <button
                      onClick={() => copyText(optimizerResult.systemDirective, 'directive')}
                      className="text-slate-400 hover:text-white"
                    >
                      {copiedIndex === 'directive' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-xs font-mono text-slate-300">{optimizerResult.systemDirective}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tool 3: Software Matcher */}
        {activeTool === 'matcher' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Operating System</label>
                <select
                  value={matcherOs}
                  onChange={(e) => setMatcherOs(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  <option value="Windows 11/10">Windows 11/10</option>
                  <option value="macOS Sequoia/Sonoma">macOS</option>
                  <option value="Linux Ubuntu/Debian">Linux</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category</label>
                <select
                  value={matcherCategory}
                  onChange={(e) => setMatcherCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                >
                  <option value="Productivity & Notes">Productivity & Notes</option>
                  <option value="Security, VPN & Privacy">Security & Privacy</option>
                  <option value="Media Player & Codecs">Media & Codecs</option>
                  <option value="System Utilities & Archivers">System Utilities</option>
                  <option value="Developer Tools">Developer Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Priorities</label>
                <input
                  type="text"
                  value={matcherPriorities}
                  onChange={(e) => setMatcherPriorities(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={handleSoftwareMatch}
                disabled={matcherLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all ml-auto"
              >
                {matcherLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
                <span>Match Desktop Tools</span>
              </button>
            </div>

            {matcherResult && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <p className="text-xs text-purple-300 font-semibold">{matcherResult.summaryTip}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {matcherResult.recommendations?.map((rec: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{rec.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                          {rec.license}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{rec.description}</p>
                      <div className="pt-2 text-[11px] text-slate-500 font-mono">
                        Official: {rec.officialSiteName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
