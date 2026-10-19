import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdConfiguration } from '../types';

const STORAGE_KEY = 'typeverse_monetization_config';

const DEFAULT_CONFIG: AdConfiguration = {
  enabled: true,
  provider: 'demo',
  adsenseClientId: '',
  adsterraScriptUrl: '',
  adsterraBannerCode: '',
  showStickyFooterAd: true,
  showSidebarAd: true,
  showHeaderLeaderboard: true,
  showResultAd: true,
};

interface MonetizationContextType {
  config: AdConfiguration;
  updateConfig: (newConfig: Partial<AdConfiguration>) => void;
  resetToDefaults: () => void;
}

const MonetizationContext = createContext<MonetizationContextType | undefined>(undefined);

export const MonetizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AdConfiguration>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  const updateConfig = (newConfig: Partial<AdConfiguration>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
  };

  return (
    <MonetizationContext.Provider value={{ config, updateConfig, resetToDefaults }}>
      {children}
    </MonetizationContext.Provider>
  );
};

export function useMonetization() {
  const ctx = useContext(MonetizationContext);
  if (!ctx) throw new Error('useMonetization must be used within a MonetizationProvider');
  return ctx;
}
