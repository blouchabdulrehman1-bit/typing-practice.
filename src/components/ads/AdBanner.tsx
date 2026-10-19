import React, { useState } from 'react';
import { useMonetization } from '../../context/MonetizationContext';
import { X, ExternalLink, Sparkles } from 'lucide-react';

export type AdSlotType = 'header-leaderboard' | 'sidebar-rectangle' | 'result-banner' | 'sticky-footer';

interface AdBannerProps {
  slot: AdSlotType;
  className?: string;
  onOpenSettings?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className = '', onOpenSettings }) => {
  const { config } = useMonetization();
  const [closed, setClosed] = useState(false);

  if (!config.enabled || closed) return null;

  if (slot === 'header-leaderboard' && !config.showHeaderLeaderboard) return null;
  if (slot === 'sidebar-rectangle' && !config.showSidebarAd) return null;
  if (slot === 'result-banner' && !config.showResultAd) return null;
  if (slot === 'sticky-footer' && !config.showStickyFooterAd) return null;

  const isLiveAdsterra = config.provider === 'adsterra' && (config.adsterraScriptUrl || config.adsterraBannerCode);
  const isLiveAdsense = config.provider === 'adsense' && config.adsenseClientId;

  // Render live provider if configured
  if (isLiveAdsterra || isLiveAdsense) {
    return (
      <div className={`relative overflow-hidden border border-slate-800 bg-slate-900/60 rounded-lg p-2 text-center ${className}`}>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 px-1">
          <span>{isLiveAdsense ? 'AdSense Partner Ad' : 'Adsterra Network'}</span>
          {onOpenSettings && (
            <button onClick={onOpenSettings} className="hover:text-amber-400 transition-colors">
              Configure Ads
            </button>
          )}
        </div>
        {isLiveAdsense ? (
          <div className="min-h-[90px] flex items-center justify-center text-xs text-slate-400 bg-slate-950/40 rounded border border-dashed border-slate-800">
            <span>[Google AdSense Slot: {config.adsenseClientId}]</span>
          </div>
        ) : (
          <div
            className="min-h-[90px] flex items-center justify-center text-xs text-slate-300"
            dangerouslySetInnerHTML={{ __html: config.adsterraBannerCode || `<p>Adsterra Script: ${config.adsterraScriptUrl}</p>` }}
          />
        )}
      </div>
    );
  }

  // High-converting clean simulated ads (Demo Mode)
  if (slot === 'sticky-footer') {
    return (
      <aside aria-label="Advertisement" className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase shrink-0">
              AD · SPONSORED
            </span>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300">
              <span className="font-semibold text-amber-400">Hostinger Cloud VPS:</span>
              <span>Ultra-fast NVMe Hosting with 99.9% uptime for high-traffic typing apps.</span>
            </div>
            <div className="sm:hidden text-xs text-slate-200 truncate">
              <span className="font-semibold text-amber-400">Hostinger:</span> High-speed VPS 75% off.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://www.hostinger.com"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap"
            >
              <span>Claim Deal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                title="Manage Ads / Enter Adsterra Keys"
                className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setClosed(true)}
              aria-label="Close advertisement"
              className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  if (slot === 'header-leaderboard') {
    return (
      <aside aria-label="Advertisement" className={`w-full max-w-4xl mx-auto my-3 ${className}`}>
        <div className="relative border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 rounded-lg p-2.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
              KB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">SPONSORED ADVERTISEMENT</span>
                <span className="text-slate-600 text-xs">·</span>
                <span className="text-[11px] text-amber-400/90 font-medium">Mechanical Switch Kit</span>
              </div>
              <p className="text-xs text-slate-200 font-medium">
                Gateron Yellow & Cherry MX Silent Switches – 40% Off Precision Keycaps
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://keychron.com"
              target="_blank"
              rel="noreferrer noopener"
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors whitespace-nowrap"
            >
              Shop Keyboards
            </a>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline whitespace-nowrap"
              >
                Ad Settings
              </button>
            )}
          </div>
        </div>
      </aside>
    );
  }

  if (slot === 'result-banner') {
    return (
      <aside aria-label="Advertisement" className={`w-full my-4 ${className}`}>
        <div className="border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] font-mono text-slate-400 uppercase">
              <span>POST-TEST REWARD OFFER</span>
              <span>·</span>
              <span className="text-emerald-400">HIGH CPM AD UNIT</span>
            </div>
            <h4 className="text-sm font-semibold text-white">NordVPN Security Bundle: 74% Off + 3 Extra Months</h4>
            <p className="text-xs text-slate-400">
              Protect your online activity with ultra-low latency servers in 111 countries.
            </p>
          </div>
          <a
            href="https://nordvpn.com"
            target="_blank"
            rel="noreferrer noopener"
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Get Special Deal
          </a>
        </div>
      </aside>
    );
  }

  // Sidebar Rectangle 300x250 or 300x600
  return (
    <aside aria-label="Advertisement" className={`w-full border border-slate-800 bg-slate-900/60 rounded-xl p-4 text-center ${className}`}>
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3">
        <span>ADVERTISEMENT (300x250)</span>
        {onOpenSettings && (
          <button onClick={onOpenSettings} className="hover:text-amber-400 transition-colors">
            Ad Setup
          </button>
        )}
      </div>
      <div className="py-6 px-2 space-y-3 bg-slate-950/50 rounded-lg border border-slate-800/80">
        <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
          ⚡
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-100">Full-Stack Cloud Developer Career</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Master high-speed coding, Next.js, and TypeScript in 12 intensive weeks.
          </p>
        </div>
        <a
          href="https://coursera.org"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-block w-full py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded transition-colors"
        >
          Explore Courses
        </a>
      </div>
    </aside>
  );
};
