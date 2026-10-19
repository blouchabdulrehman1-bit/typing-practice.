import React, { useState } from 'react';
import { useMonetization } from '../../context/MonetizationContext';
import { X, DollarSign, CheckCircle2, ShieldCheck, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

interface MonetizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonetizationModal: React.FC<MonetizationModalProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig } = useMonetization();
  const [activeTab, setActiveTab] = useState<'settings' | 'strategy' | 'adsense-guide'>('settings');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Monetization & Ad Networks Hub</h2>
              <p className="text-xs text-slate-400">Adsterra, Google AdSense & Monthly Revenue Optimizer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 p-1 bg-slate-950/70 border border-slate-800 rounded-xl mb-6 text-xs">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ad Codes & Slots
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className={`flex-1 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'strategy' ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Adsterra 59K/Month Strategy
          </button>
          <button
            onClick={() => setActiveTab('adsense-guide')}
            className={`flex-1 py-2 font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'adsense-guide' ? 'bg-amber-400 text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            AdSense Approval Checklist
          </button>
        </div>

        {/* Tab 1: Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6 text-sm">
            {/* Provider selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Active Ad Network
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => updateConfig({ provider: 'adsterra' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    config.provider === 'adsterra'
                      ? 'border-amber-400 bg-amber-400/10 text-white ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-amber-400 text-sm">Adsterra Network</div>
                  <div className="text-[11px] text-slate-400 mt-1">Instant approval, 100% fill-rate, fast weekly payouts.</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateConfig({ provider: 'adsense' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    config.provider === 'adsense'
                      ? 'border-amber-400 bg-amber-400/10 text-white ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-amber-400 text-sm">Google AdSense</div>
                  <div className="text-[11px] text-slate-400 mt-1">Premium brand CPMs, official Google publisher network.</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateConfig({ provider: 'demo' })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    config.provider === 'demo'
                      ? 'border-amber-400 bg-amber-400/10 text-white ring-1 ring-amber-400'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-amber-400 text-sm">Preview / Test Mode</div>
                  <div className="text-[11px] text-slate-400 mt-1">High-converting simulated tech banners (ready for preview).</div>
                </button>
              </div>
            </div>

            {/* Network configuration inputs */}
            {config.provider === 'adsterra' && (
              <div className="space-y-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Adsterra Script & Banner Integration</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Adsterra Script URL or Direct Link</label>
                  <input
                    type="text"
                    value={config.adsterraScriptUrl}
                    onChange={(e) => updateConfig({ adsterraScriptUrl: e.target.value })}
                    placeholder="e.g. //pl12345678.highperformancegate.com/..."
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Adsterra HTML / Banner Code (Leaderboard or 300x250)</label>
                  <textarea
                    rows={3}
                    value={config.adsterraBannerCode}
                    onChange={(e) => updateConfig({ adsterraBannerCode: e.target.value })}
                    placeholder='<script type="text/javascript"> atOptions = { key: "xxxx", format: "iframe", height: 90, width: 728 }; ...'
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {config.provider === 'adsense' && (
              <div className="space-y-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Google AdSense Publisher Client ID</span>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">AdSense Client ID (`ca-pub-XXXXXXXXXXXXX`)</label>
                  <input
                    type="text"
                    value={config.adsenseClientId}
                    onChange={(e) => updateConfig({ adsenseClientId: e.target.value })}
                    placeholder="ca-pub-1234567890123456"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Ad slot toggles */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Active Ad Placements
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <span className="text-xs text-slate-300 font-medium">Header Leaderboard (728x90)</span>
                  <input
                    type="checkbox"
                    checked={config.showHeaderLeaderboard}
                    onChange={(e) => updateConfig({ showHeaderLeaderboard: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <span className="text-xs text-slate-300 font-medium">Sidebar Rectangle (300x250)</span>
                  <input
                    type="checkbox"
                    checked={config.showSidebarAd}
                    onChange={(e) => updateConfig({ showSidebarAd: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <span className="text-xs text-slate-300 font-medium">Post-Test Reward Card (Result)</span>
                  <input
                    type="checkbox"
                    checked={config.showResultAd}
                    onChange={(e) => updateConfig({ showResultAd: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700">
                  <span className="text-xs text-slate-300 font-medium">Sticky Footer Anchor Banner</span>
                  <input
                    type="checkbox"
                    checked={config.showStickyFooterAd}
                    onChange={(e) => updateConfig({ showStickyFooterAd: e.target.checked })}
                    className="w-4 h-4 accent-amber-400 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 59K Adsterra Strategy */}
        {activeTab === 'strategy' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-300 text-sm">Monthly 59,000 Revenue Blueprint</h4>
                <p className="text-slate-300 mt-1">
                  Typing sites have exceptionally high user retention: users do 5 to 10 tests per session, staying 4–12 minutes. This creates massive ad viewability and recurring CPM impressions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-mono">Daily Traffic Target</span>
                <p className="text-lg font-bold text-white mt-1">800 - 1,200</p>
                <p className="text-[11px] text-slate-400">Daily active typists / students</p>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-mono">Monthly Impressions</span>
                <p className="text-lg font-bold text-emerald-400 mt-1">120,000+</p>
                <p className="text-[11px] text-slate-400">Via 4 ad slots with test reloads</p>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-mono">Est. Monthly Earnings</span>
                <p className="text-lg font-bold text-amber-400 mt-1">$220 - $350 USD</p>
                <p className="text-[11px] text-slate-400">≈ 60,000 - 95,000 PKR / INR</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="font-semibold text-white">4 Action Steps to Reach 59,000+ Fast:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>1. Activate Adsterra Social Bar + Native Banners:</strong> Adsterra has no minimum traffic requirement and approves instantly. Social bar ads have 10x higher CTR than static banners.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>2. Promote in Student & Typing Groups:</strong> Share your site link in typing practice Discord channels, Reddit (r/typing, r/learnprogramming), university computer science groups, and competitive exam preparation forums.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>3. Long-Form Typing Mode (Maximum Dwell Time):</strong> Long tests keep users active for 5+ minutes. Ad networks reward high time-on-page with higher CPM tier ratings.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>4. Certificate Generation:</strong> When users achieve high WPM scores and download or share their TypeVerse Certificate, their friends click back to your site for free organic viral traffic!
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: AdSense Approval Checklist */}
        {activeTab === 'adsense-guide' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Why Most Typing Sites Get Rejected & How TypeVerse Passes</span>
              </div>
              <p className="text-slate-400">
                Google AdSense rejects pure typing apps for <em>"Low Value Content"</em> if they only have a text input box. TypeVerse solves this by including high-value touch typing tutorials, speed charts, ergonomic guides, and complete policy compliance pages built right in.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white">AdSense Approval Prerequisites Included in TypeVerse:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full Privacy Policy (GDPR / CCPA / AdSense compliant)</span>
                </div>
                <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Terms of Service & Cookie Disclaimers</span>
                </div>
                <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive Contact & Feedback System</span>
                </div>
                <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Original Touch Typing & Ergonomic Guides</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
              <span className="font-semibold text-white">How to apply for AdSense with your custom domain:</span>
              <p className="text-slate-400 mt-1">
                Link your custom domain (e.g. `typeverse.com`), wait 7 days with genuine traffic, and submit through Google AdSense dashboard. Your structured articles and policy pages provide the editorial depth AdSense bot crawlers require.
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-slate-800 mt-6 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Save & Continue Typing
          </button>
        </div>
      </div>
    </div>
  );
};
