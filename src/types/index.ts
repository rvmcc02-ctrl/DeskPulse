export interface SoftwareItem {
  id: string;
  name: string;
  category: 'Productivity' | 'Security & VPN' | 'Media & Tools' | 'System Utilities' | 'Dev Tools';
  license: 'Free' | 'Open Source' | 'Freemium' | 'Special Deal';
  description: string;
  rating: number;
  reviewsCount: number;
  os: string[];
  features: string[];
  officialUrl: string;
  verifiedStatus: boolean;
  fileSize: string;
  popularRank: number;
}

export interface PolicyCheckResult {
  complianceScore: number;
  overallStatus: 'PASSED' | 'WARNING' | 'REJECTED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  policyChecks: {
    ruleName: string;
    passed: boolean;
    finding: string;
    fixSuggestion: string;
  }[];
  requiredDisclaimersPresent: boolean;
  recommendations: string[];
}

export interface TrackingParams {
  zoneId: string;
  campaignId: string;
  subId: string;
  targetUrl: string;
}

export interface BenchmarkMetrics {
  pingMs: number;
  downloadMbps: number;
  uploadMbps: number;
  jitterMs: number;
  browserScore: number;
  status: 'idle' | 'testing' | 'completed';
}
