import React, { useState } from 'react';
import { Layers, Search, Star, ShieldCheck, Download, ExternalLink, Check, Info } from 'lucide-react';
import { SOFTWARE_DIRECTORY } from '../data/mockSoftware';
import { SoftwareItem, TrackingParams } from '../types';

interface SoftwareDirectoryProps {
  trackingParams: TrackingParams;
  onOpenPolicyChecker: () => void;
}

export const SoftwareDirectory: React.FC<SoftwareDirectoryProps> = ({
  trackingParams,
  onOpenPolicyChecker,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [clickedSoftwareId, setClickedSoftwareId] = useState<string | null>(null);

  const categories = ['All', 'Security & VPN', 'System Utilities', 'Media & Tools', 'Productivity', 'Dev Tools'];

  const filteredSoftware = SOFTWARE_DIRECTORY.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadClick = (item: SoftwareItem) => {
    setClickedSoftwareId(item.id);
    
    // Construct compliant outbound URL with affiliate tracking parameters
    const query = new URLSearchParams({
      zoneid: trackingParams.zoneId || '1234567',
      campaignid: trackingParams.campaignId || '8910',
      subid: trackingParams.subId || 'deskpulse_pop',
    });

    const finalUrl = `${item.officialUrl}?${query.toString()}`;
    
    setTimeout(() => {
      window.open(finalUrl, '_blank', 'noopener,noreferrer');
      setClickedSoftwareId(null);
    }, 600);
  };

  return (
    <section id="software" className="py-12 bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Verified Desktop Software Catalog</span>
            </div>
            <h2 className="text-3xl font-extrabold font-display text-white tracking-tight">
              Essential Free Desktop Utilities
            </h2>
            <p className="mt-1 text-slate-400 text-sm">
              All tools are checked for malware, bundled adware, and strict web safety standards.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search software..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Software Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSoftware.map((item) => (
            <div
              key={item.id}
              className="glass-panel-interactive p-6 rounded-2xl flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{item.category}</span>
                      <span>·</span>
                      <span className="font-mono">{item.fileSize}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-mono text-cyan-400 font-medium whitespace-nowrap">
                    {item.license}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {/* Features */}
                <div className="space-y-1 pt-1">
                  {item.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold font-mono">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{item.rating}</span>
                  <span className="text-[10px] text-slate-500 font-normal font-sans">
                    ({item.reviewsCount.toLocaleString()})
                  </span>
                </div>

                <button
                  onClick={() => handleDownloadClick(item)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/10 active:scale-95 transition-all"
                >
                  {clickedSoftwareId === item.id ? (
                    <span>Opening...</span>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Official Site</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
