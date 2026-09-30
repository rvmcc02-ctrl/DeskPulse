import React, { useState } from 'react';
import { X, Sliders, Check, Copy, Code, ExternalLink, Globe } from 'lucide-react';
import { TrackingParams } from '../types';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingParams: TrackingParams;
  onUpdateParams: (params: TrackingParams) => void;
}

export const PopunderCustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  trackingParams,
  onUpdateParams,
}) => {
  const [localParams, setLocalParams] = useState<TrackingParams>(trackingParams);
  const [copiedCode, setCopiedCode] = useState(false);
  const [ctaText, setCtaText] = useState('Run Speed Audit & Get Tools');

  if (!isOpen) return null;

  const previewUrl = `${localParams.targetUrl || 'https://deskpulse.ai'}?zoneid=${localParams.zoneId || '{zoneid}'}&campaignid=${localParams.campaignId || '{campaignid}'}&subid=${localParams.subId || '{subid}'}`;

  const standaloneSnippet = `<!-- DeskPulse AI Website Integration -->
<script>
  (function() {
    var zoneId = "${localParams.zoneId || '{zoneid}'}";
    var campaignId = "${localParams.campaignId || '{campaignid}'}";
    console.log("DeskPulse initialized with Zone:", zoneId);
  })();
</script>
<iframe src="${previewUrl}" style="width:100%;height:100vh;border:none;"></iframe>`;

  const handleSave = () => {
    onUpdateParams(localParams);
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(standaloneSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5 text-white font-bold font-display text-lg">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Desktop Campaign Integration Setup</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">
                PropellerAds Zone ID ({`{zoneid}`})
              </label>
              <input
                type="text"
                value={localParams.zoneId}
                onChange={(e) => setLocalParams({ ...localParams, zoneId: e.target.value })}
                placeholder="7654321"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">
                Campaign ID ({`{campaignid}`})
              </label>
              <input
                type="text"
                value={localParams.campaignId}
                onChange={(e) => setLocalParams({ ...localParams, campaignId: e.target.value })}
                placeholder="98765"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">
                SubID / Placement Identifier
              </label>
              <input
                type="text"
                value={localParams.subId}
                onChange={(e) => setLocalParams({ ...localParams, subId: e.target.value })}
                placeholder="pop_desktop_us"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">
                Destination Offer URL
              </label>
              <input
                type="text"
                value={localParams.targetUrl}
                onChange={(e) => setLocalParams({ ...localParams, targetUrl: e.target.value })}
                placeholder="https://deskpulse.ai"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono"
              />
            </div>
          </div>

          {/* Dynamic Link Preview */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Generated Outbound Tracked URL Preview:
            </span>
            <div className="font-mono text-cyan-300 text-[11px] break-all">
              {previewUrl}
            </div>
          </div>

          {/* Standalone Snippet Exporter */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>Popunder Landing Embed Code:</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-cyan-400 hover:underline"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode ? 'Copied!' : 'Copy Snippet'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
              {standaloneSnippet}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-colors"
          >
            Save & Apply Tokens
          </button>
        </div>

      </div>
    </div>
  );
};
