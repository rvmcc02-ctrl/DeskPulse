import React, { useState } from 'react';
import { ShieldCheck, Mail, FileText, CheckCircle2, Lock, X } from 'lucide-react';

export const ComplianceFooter: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'dmca' | 'contact' | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail) return;
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setActiveModal(null);
      setContactEmail('');
      setContactMsg('');
    }, 2000);
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Policy Badges Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold">100% Verified Safe</h4>
              <p className="text-[11px] text-slate-400">Strictly adheres to web safety & security standards.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold">SSL 256-Bit Encrypted</h4>
              <p className="text-[11px] text-slate-400">Secure connection, zero client-side tracking cookies.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold">No Auto Downloads</h4>
              <p className="text-[11px] text-slate-400">No unexpected software or .exe downloads on page visit.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold">DMCA Protected</h4>
              <p className="text-[11px] text-slate-400">Registered independent software utility directory.</p>
            </div>
          </div>
        </div>

        {/* Links & Disclaimer */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-slate-800/80">
          <div className="space-y-1 max-w-2xl">
            <p className="text-slate-300 font-semibold">
              DeskPulse AI Desktop Utilities & Software Hub
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Disclaimer: DeskPulse AI is an independent software review and utility indexing service. We do not host executable installers or request system administrative credentials. All software trademarks and brand names belong to their respective copyright holders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setActiveModal('privacy')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveModal('terms')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Terms of Service
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveModal('dmca')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              DMCA Notice
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveModal('contact')}
              className="text-cyan-400 hover:underline transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-600 pt-4 border-t border-slate-800/60 font-mono">
          © {new Date().getFullYear()} DeskPulse AI. All rights reserved. High-Speed Desktop Tools & Security.
        </div>

      </div>

      {/* Policy Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl rounded-3xl border border-slate-800 p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-display">
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'dmca' && 'DMCA & Copyright Policy'}
                {activeModal === 'contact' && 'Contact Support'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed max-h-80 overflow-y-auto pr-2">
              {activeModal === 'privacy' && (
                <>
                  <p>DeskPulse AI respects visitor privacy. We do not store personal data or tracking cookies without explicit user intent.</p>
                  <p>Our website utilizes standard server logs (IP address, user agent, referrer) solely for security, network diagnostics, and PropellerAds policy verification.</p>
                  <p>No personal information is sold or transferred to third parties.</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p>By accessing DeskPulse AI, you agree to these Terms of Service. This platform provides desktop network benchmark utilities and informational software listings.</p>
                  <p>Users must not use this site for unlawful activities, automated scraping, or false ad click generation.</p>
                </>
              )}

              {activeModal === 'dmca' && (
                <>
                  <p>DeskPulse AI complies with the Digital Millennium Copyright Act (DMCA). If you believe material hosted or linked on this site infringes your copyright, please submit a notice to copyright@deskpulse.ai.</p>
                  <p>All software names and trademarks belong to their respective vendor owners.</p>
                </>
              )}

              {activeModal === 'contact' && (
                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Enter your inquiry or moderation request..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    {contactSent && (
                      <span className="text-emerald-400 font-bold">Message sent successfully!</span>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 ml-auto"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
