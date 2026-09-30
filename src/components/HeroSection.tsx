import React from 'react';
import { Gauge, ShieldCheck, Download, Sparkles, ArrowRight, Activity, Laptop, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onStartBenchmark: () => void;
  onExploreSoftware: () => void;
  onOpenPolicyChecker: () => void;
  onOpenAISuite: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBenchmark,
  onExploreSoftware,
  onOpenPolicyChecker,
  onOpenAISuite,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 lg:py-16 bg-slate-950 border-b border-slate-800/80">
      {/* Background Hero Image with Scrim */}
      <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity pointer-events-none">
        <img
          src="/src/assets/images/hero_desktop_speed_1790780852268.jpg"
          alt="Desktop Speed Benchmark Dashboard"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Policy Verification Kicker */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Laptop className="w-3.5 h-3.5" />
            <span>Desktop Traffic Optimized</span>
          </span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Web Safety & Security Verified</span>
          </span>
        </div>

        {/* Main Title & Lead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white text-balance leading-tight">
              High-Speed Desktop Utilities & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">Verified Software Hub</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Instantly test browser latency, discover verified free desktop tools, and run AI productivity summaries without intrusive downloads or deceptive system alerts.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              <button
                onClick={onStartBenchmark}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all"
              >
                <Gauge className="w-5 h-5 stroke-[2.5]" />
                <span>Run Instant Ping Test</span>
                <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
              </button>

              <button
                onClick={onExploreSoftware}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Verified Software Directory</span>
              </button>

              <button
                onClick={onOpenPolicyChecker}
                className="flex items-center gap-2 px-4 py-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 font-semibold text-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Run Web Safety Audit</span>
              </button>
            </div>

            {/* Real-time Proof Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-slate-400 border-t border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-white font-bold">14,820</span>
                <span>Desktop Tests Today</span>
              </div>
              <span className="hidden sm:inline text-slate-700">•</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Zero Malware Guarantee</span>
              </div>
              <span className="hidden sm:inline text-slate-700">•</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="font-mono font-medium">99.9% Uptime</span>
              </div>
            </div>
          </div>

          {/* Interactive Feature Cards Showcase */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {/* Quick Benchmark Card */}
            <div
              onClick={onStartBenchmark}
              className="glass-panel-interactive p-5 rounded-2xl cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Gauge className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono font-medium">
                  Instant Test
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Desktop Ping & Latency Audit
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Simulate real-time network response, browser rendering FPS, and ISP route stability.
              </p>
            </div>

            {/* AI Assistant Card */}
            <div
              onClick={onOpenAISuite}
              className="glass-panel-interactive p-5 rounded-2xl cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-mono font-medium">
                  Gemini 3.8 AI
                </span>
              </div>
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                AI Text & Prompt Suite
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Instant web page summarizer, prompt polish, and AI tool matcher built for desktop workflows.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
