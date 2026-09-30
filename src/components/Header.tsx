import React, { useState } from 'react';
import { ShieldCheck, Gauge, Layers, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { TrackingParams } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCustomizer: () => void;
  trackingParams: TrackingParams;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenCustomizer,
  trackingParams,
}) => {
  const navItems = [
    { id: 'benchmark', label: 'Speed & Ping', icon: Gauge },
    { id: 'software', label: 'Software Directory', icon: Layers },
    { id: 'ai-suite', label: 'AI Productivity', icon: Sparkles },
    { id: 'policy-validator', label: 'Policy Checker', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('benchmark');
            }}
            className="text-xl font-bold font-display tracking-tight text-white hover:text-cyan-400 transition-colors flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Gauge className="w-5 h-5 stroke-[2.5]" />
            </span>
            <span>DeskPulse<span className="text-cyan-400">AI</span></span>
          </a>
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Verified & Malware-Free</span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label === 'Policy Checker' ? 'Safety Auditor' : item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('policy-validator')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all whitespace-nowrap"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Audit Site Safety</span>
          </button>
        </div>

      </div>

      {/* Mobile Nav Tabs Bar */}
      <div className="md:hidden flex items-center justify-around bg-slate-900/90 border-t border-slate-800/80 px-2 py-1.5 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                isActive ? 'text-cyan-400 bg-slate-800/80' : 'text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
