import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SpeedBenchmark } from './components/SpeedBenchmark';
import { AIPromptSuite } from './components/AIPromptSuite';
import { SoftwareDirectory } from './components/SoftwareDirectory';
import { PolicyValidator } from './components/PolicyValidator';
import { PopunderCustomizerModal } from './components/PopunderCustomizerModal';
import { ComplianceFooter } from './components/ComplianceFooter';
import { TrackingParams } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('benchmark');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  const [trackingParams, setTrackingParams] = useState<TrackingParams>({
    zoneId: '7891234',
    campaignId: '456789',
    subId: 'pop_desktop_us',
    targetUrl: 'https://deskpulse.ai',
  });

  const handleStartBenchmark = () => {
    setActiveTab('benchmark');
    const benchmarkEl = document.getElementById('benchmark');
    if (benchmarkEl) {
      benchmarkEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreSoftware = () => {
    setActiveTab('software');
    const softwareEl = document.getElementById('software');
    if (softwareEl) {
      softwareEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPolicyChecker = () => {
    setActiveTab('policy-validator');
    const policyEl = document.getElementById('policy-validator');
    if (policyEl) {
      policyEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAISuite = () => {
    setActiveTab('ai-suite');
    const aiEl = document.getElementById('ai-suite');
    if (aiEl) {
      aiEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        trackingParams={trackingParams}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* High Converting Above-The-Fold Popunder Hero */}
        <HeroSection
          onStartBenchmark={handleStartBenchmark}
          onExploreSoftware={handleExploreSoftware}
          onOpenPolicyChecker={handleOpenPolicyChecker}
          onOpenAISuite={handleOpenAISuite}
        />

        {/* Real-time Latency & Ping Speedometer */}
        <SpeedBenchmark />

        {/* Server-side Gemini AI Productivity Suite */}
        <AIPromptSuite />

        {/* Verified Free Desktop Software & Deals Catalog */}
        <SoftwareDirectory
          trackingParams={trackingParams}
          onOpenPolicyChecker={handleOpenPolicyChecker}
        />

        {/* PropellerAds Policy & Moderation Validator */}
        <PolicyValidator
          onOpenCustomizer={() => setIsCustomizerOpen(true)}
        />
      </main>

      {/* PropellerAds Policy Compliance Footer */}
      <ComplianceFooter />

      {/* Campaign & Tracking Parameter Customizer Modal */}
      <PopunderCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        trackingParams={trackingParams}
        onUpdateParams={setTrackingParams}
      />
    </div>
  );
}
