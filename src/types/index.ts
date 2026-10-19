export type TypingMode = 'short' | 'long' | 'custom';

export type ShortDuration = number; // in seconds (e.g. 60 = 1 min, 120 = 2 min, 300 = 5 min, or custom chosen by user)
export type ShortWordCount = 25 | 50 | 100;
export type ShortSubMode = 'time' | 'words' | 'quote';

export type LongCategory = 'story' | 'article' | 'literature' | 'history' | 'science' | 'technology';

export type CodeLanguage = 'javascript' | 'python' | 'typescript' | 'html';

export type SoundProfile = 'blue' | 'brown' | 'red' | 'typewriter' | 'mute';

export type ThemeId = 'dark' | 'midnight' | 'cyber' | 'emerald' | 'sepia' | 'light';

export interface WpmPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TypingResult {
  id: string;
  date: string;
  mode: TypingMode;
  categoryOrDuration: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  cpm: number;
  timeElapsed: number;
  totalChars: number;
  correctChars: number;
  errorChars: number;
  consistency: number;
  missedKeys: Record<string, number>;
  wpmHistory: WpmPoint[];
}

export interface AdConfiguration {
  enabled: boolean;
  provider: 'adsense' | 'adsterra' | 'demo';
  adsenseClientId: string;
  adsterraScriptUrl: string;
  adsterraBannerCode: string;
  showStickyFooterAd: boolean;
  showSidebarAd: boolean;
  showHeaderLeaderboard: boolean;
  showResultAd: boolean;
}
