import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Loader2, Code, Copy, Info } from 'lucide-react';
import { PolicyCheckResult } from '../types';

interface PolicyValidatorProps {
  onOpenCustomizer: () => void;
}

export const PolicyValidator: React.FC<PolicyValidatorProps> = ({ onOpenCustomizer }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [offerType, setOfferType] = useState('Desktop Popunder Utility');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PolicyCheckResult | null>(null);
  const [copiedSeal, setCopiedSeal] = useState(false);

  const sampleTemplates = [
    {
      title: 'Clean Compliant Utility Page',
      url: 'https://deskpulse.ai/landing',
      content: `<title>DeskPulse Desktop Speed Test</title><h1>Instant Network Latency Test</h1><p>Test your download speed and ping. No registration required.</p><footer class="disclaimer">Independent utility provider. Terms of Service, Privacy Policy, DMCA notice apply. Contact: support@deskpulse.ai</footer>`,
    },
    {
      title: 'Compliant VPN & Software Promo',
      url: 'https://protonvpn.com/desktop-offer',
      content: `<h1>Proton VPN Official Desktop Client</h1><p>Download free VPN for Windows. Privacy guaranteed.</p><footer>Independent tech review directory. Privacy Policy | Terms of Service</footer>`,
    },
    {
      title: 'Violation Test Case (Fake Virus Scam Alert)',
      url: 'http://scam-warning-test.com',
      content: `<title>CRITICAL SYSTEM WARNING</title><h1>YOUR WINDOWS 11 PC IS INFECTED WITH 5 VIRUSES!</h1><p>Call Microsoft Support Immediately at 1-800-555-0199 or your hard drive will be erased!</p><script>window.onload=function(){ location.href="malware.exe"; }</script>`,
    },
  ];

  const handleRunCheck = async (contentToCheck?: string) => {
    const targetContent = contentToCheck || htmlContent || inputUrl;
    if (!targetContent.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/policy-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageUrl: inputUrl,
          pageContent: targetContent,
          offerType: offerType,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample: typeof sampleTemplates[0]) => {
    setInputUrl(sample.url);
    setHtmlContent(sample.content);
    handleRunCheck(sample.content);
  };

  const copySealCode = () => {
    const sealHtml = `<!-- DeskPulse Security Verification Badge -->
<div style="font-family:sans-serif;font-size:11px;color:#10b981;display:inline-flex;align-items:center;gap:4px;padding:4px 8px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:12px;">
  ✓ Verified Safe & Secure · No Malware · Zero Scam Alerts
</div>`;
    navigator.clipboard.writeText(sealHtml);
    setCopiedSeal(true);
    setTimeout(() => setCopiedSeal(false), 2000);
  };

  return (
    <section id="policy-validator" className="py-12 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Web Security Guard</span>
          </div>
          <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
            Website Safety & Compliance Auditor
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Instantly audit websites and desktop portals for security risks, malware traps, fake alert scams, and disclaimer compliance.
          </p>
        </div>

        {/* Input & Audit Form */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-4xl mx-auto space-y-6">
          
          {/* Sample Loader */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Try Preset Samples:
            </label>
            <div className="flex flex-wrap gap-2">
              {sampleTemplates.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => loadSample(sample)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Landing Page URL or HTML Content
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://your-landing-page.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Offer Category
              </label>
              <select
                value={offerType}
                onChange={(e) => setOfferType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
              >
                <option value="Desktop Popunder Utility">Desktop Popunder Utility</option>
                <option value="Software Download Offer">Software Download Offer</option>
                <option value="VPN & Security Promo">VPN & Security Promo</option>
                <option value="E-commerce Deal Portal">E-commerce Deal Portal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Raw HTML / Head / Body Snippet (Optional)
            </label>
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              rows={4}
              placeholder="Paste page source code here for deep script and disclaimer inspection..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Evaluates against Global Web Safety & Security Standards
            </span>
            <button
              onClick={() => handleRunCheck()}
              disabled={loading || (!inputUrl.trim() && !htmlContent.trim())}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing Safety...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Run Web Safety Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Audit Results */}
          {result && (
            <div className="pt-6 border-t border-slate-800 space-y-6">
              
              {/* Score Header Card */}
              <div
                className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  result.overallStatus === 'PASSED'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : result.overallStatus === 'WARNING'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {result.overallStatus === 'PASSED' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    )}
                    <span className="text-lg font-bold font-display uppercase tracking-wider">
                      Safety Audit Status: {result.overallStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Compliance Risk Level: <span className="font-mono font-bold uppercase">{result.riskLevel}</span>
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black font-mono">
                    {result.complianceScore}%
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">
                    Policy Score
                  </span>
                </div>
              </div>

              {/* Rule Checks List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Detailed Moderation Checklist:
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {result.policyChecks?.map((check, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 font-bold text-white">
                          {check.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                          <span>{check.ruleName}</span>
                        </div>
                        <p className="text-slate-400">{check.finding}</p>
                        {!check.passed && (
                          <p className="text-cyan-400 font-medium">Fix suggestion: {check.fixSuggestion}</p>
                        )}
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          check.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {check.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Seal Exporter */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white">Embed Security Verification Badge</span>
                  <p className="text-slate-400 text-[11px]">Copy lightweight badge code to display on your web pages.</p>
                </div>
                <button
                  onClick={copySealCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold border border-emerald-500/30 transition-all"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{copiedSeal ? 'Badge HTML Copied!' : 'Copy Badge HTML'}</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};
