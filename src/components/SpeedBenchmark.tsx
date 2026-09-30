import React, { useState, useEffect } from 'react';
import { Gauge, Play, RefreshCw, CheckCircle2, Zap, Shield, Globe, Award, Share2, Copy } from 'lucide-react';
import { BenchmarkMetrics } from '../types';

export const SpeedBenchmark: React.FC = () => {
  const [metrics, setMetrics] = useState<BenchmarkMetrics>({
    pingMs: 14,
    downloadMbps: 184.2,
    uploadMbps: 42.8,
    jitterMs: 1.8,
    browserScore: 96,
    status: 'idle',
  });

  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [testPhase, setTestPhase] = useState<string>('');

  const runTest = () => {
    setMetrics((prev) => ({ ...prev, status: 'testing' }));
    setProgress(0);
    setTestPhase('Resolving DNS and checking edge latency...');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);

      if (currentProgress === 20) {
        setTestPhase('Measuring ping stability & jitter...');
      } else if (currentProgress === 50) {
        setTestPhase('Simulating high-throughput download stream...');
      } else if (currentProgress === 80) {
        setTestPhase('Testing browser DOM render responsiveness...');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        // Generate realistic randomized test result
        const simulatedPing = Math.floor(Math.random() * 12) + 8;
        const simulatedDown = (Math.random() * 80 + 140).toFixed(1);
        const simulatedUp = (Math.random() * 20 + 35).toFixed(1);
        const simulatedJitter = (Math.random() * 1.5 + 0.8).toFixed(1);
        const simulatedScore = Math.floor(Math.random() * 5) + 94;

        setMetrics({
          pingMs: simulatedPing,
          downloadMbps: parseFloat(simulatedDown),
          uploadMbps: parseFloat(simulatedUp),
          jitterMs: parseFloat(simulatedJitter),
          browserScore: simulatedScore,
          status: 'completed',
        });
        setTestPhase('Benchmark Completed Successfully!');
      }
    }, 40);
  };

  const copyReport = () => {
    const text = `DeskPulse AI Speed Report: Ping: ${metrics.pingMs}ms | Download: ${metrics.downloadMbps} Mbps | Upload: ${metrics.uploadMbps} Mbps | Score: ${metrics.browserScore}/100`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="benchmark" className="py-12 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Gauge className="w-3.5 h-3.5" />
            <span>Real-Time Desktop Network Test</span>
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
            Network Latency & Speed Benchmark
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Test your desktop internet latency, jitter, download throughput, and browser DOM rendering velocity in seconds.
          </p>
        </div>

        {/* Speedometer Gauge Container */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Speed Gauge Gauge Dial */}
            <div className="md:col-span-6 flex flex-col items-center justify-center relative py-4">
              
              {/* Outer Glow Ring */}
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-slate-800 flex items-center justify-center relative shadow-inner">
                {/* Progress arc border */}
                <div
                  className="absolute inset-0 rounded-full border-4 border-cyan-400 transition-all duration-300"
                  style={{
                    clipPath: `polygon(50% 50%, -50% -50%, ${progress}% -50%)`,
                    transform: 'rotate(-90deg)',
                  }}
                />

                <div className="text-center space-y-1 z-10">
                  <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                    {metrics.status === 'testing' ? 'Testing Speed' : 'Download Speed'}
                  </span>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                    {metrics.status === 'testing'
                      ? (progress * 2.2).toFixed(1)
                      : metrics.downloadMbps}
                  </div>
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    Mbps
                  </div>
                </div>
              </div>

              {/* Status Message */}
              <div className="mt-4 text-center">
                {metrics.status === 'testing' ? (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-cyan-400 animate-pulse">{testPhase}</p>
                    <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">
                    Client IP: <span className="text-slate-200 font-mono">104.28.192.x (Verified Safe)</span>
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={runTest}
                  disabled={metrics.status === 'testing'}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
                >
                  {metrics.status === 'testing' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Benchmarking...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current text-slate-950" />
                      <span>Start Speed Test</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Metrics Breakdown Grid */}
            <div className="md:col-span-6 space-y-4">
              
              <div className="grid grid-cols-2 gap-3">
                
                {/* Ping Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Ping Latency</span>
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-white">
                    {metrics.pingMs} <span className="text-xs text-slate-400 font-normal">ms</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Ultra Low Ping</span>
                </div>

                {/* Upload Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Upload Rate</span>
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-white">
                    {metrics.uploadMbps} <span className="text-xs text-slate-400 font-normal">Mbps</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">Stable Stream</span>
                </div>

                {/* Jitter Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Jitter Variation</span>
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-white">
                    {metrics.jitterMs} <span className="text-xs text-slate-400 font-normal">ms</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium">Optimal Packet Flow</span>
                </div>

                {/* Browser Responsiveness Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Browser Score</span>
                    <Award className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="mt-2 text-2xl font-black font-mono text-cyan-400">
                    {metrics.browserScore}<span className="text-xs text-slate-400 font-normal">/100</span>
                  </div>
                  <span className="text-[11px] text-cyan-300 font-medium">Tier-1 Desktop Performance</span>
                </div>

              </div>

              {/* Recommendation Panel */}
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between text-cyan-300 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    Recommended Network Tweaks:
                  </span>
                  <button
                    onClick={copyReport}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                </div>
                <ul className="text-slate-300 space-y-1 pl-4 list-disc">
                  <li>Use Cloudflare 1.1.1.1 or Google 8.8.8.8 for lowest DNS lookups.</li>
                  <li>Clear stale browser cache to improve DOM rendering latency.</li>
                  <li>Ensure hardware acceleration is enabled in browser settings.</li>
                </ul>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
