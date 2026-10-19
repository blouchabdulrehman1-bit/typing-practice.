/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  TypingMode,
  ShortDuration,
  ShortWordCount,
  SoundProfile,
  TypingResult,
} from './types';
import {
  SHORT_QUOTES,
  LONG_PASSAGES,
  generateRandomWords,
  LongPassage,
} from './data/typingTexts';
import { useTypingEngine } from './hooks/useTypingEngine';
import { ModeSelector } from './components/typing/ModeSelector';
import { TypingArea } from './components/typing/TypingArea';
import { VirtualKeyboard } from './components/typing/VirtualKeyboard';
import { ResultsCard } from './components/typing/ResultsCard';
import { StatsModal } from './components/typing/StatsModal';
import {
  AboutUsModal,
  PrivacyPolicyModal,
  TermsOfServiceModal,
  ContactUsModal,
  TypingGuideModal,
} from './components/pages/PolicyModals';
import {
  Keyboard,
  RotateCcw,
  BookOpen,
  Trophy,
  Sliders,
  Volume2,
} from 'lucide-react';

const STATS_STORAGE_KEY = 'typeverse_user_results';

export default function App() {
  // Navigation & modal states
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Sound & Mode states (Default Cherry MX Blue for loud, satisfying mechanical click)
  const [soundProfile, setSoundProfile] = useState<SoundProfile>('blue');
  const [suddenDeath, setSuddenDeath] = useState<boolean>(false);
  const [noBackspace, setNoBackspace] = useState<boolean>(true); // Strict accuracy: mistakes permanent
  const [mode, setMode] = useState<TypingMode>('short');
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);
  const [showFingerGuide, setShowFingerGuide] = useState<boolean>(true);

  // Short mode settings
  const [shortType, setShortType] = useState<'time' | 'words' | 'quote'>('time');
  const [shortDuration, setShortDuration] = useState<ShortDuration>(60); // in seconds (1 min default, user can pick custom minutes)
  const [shortWordCount, setShortWordCount] = useState<ShortWordCount>(50);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);

  // Long passage & custom selections
  const [selectedPassage, setSelectedPassage] = useState<LongPassage>(LONG_PASSAGES[0]);
  const [customText, setCustomText] = useState<string>(
    'Typing speed is not just about moving your fingers quickly. It is about establishing effortless synchronization between your eyes, mind, and hands.'
  );

  // Test seed to trigger fresh random text
  const [testSeed, setTestSeed] = useState<number>(1);
  const [lastResult, setLastResult] = useState<TypingResult | null>(null);

  // User persistent history
  const [historyResults, setHistoryResults] = useState<TypingResult[]>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(historyResults));
    } catch {
      // ignore
    }
  }, [historyResults]);

  // Determine current active target text
  const targetText = useMemo(() => {
    if (mode === 'long') {
      return selectedPassage.text;
    }
    if (mode === 'custom') {
      return customText;
    }
    // Short test
    if (shortType === 'quote') {
      const quote = SHORT_QUOTES[testSeed % SHORT_QUOTES.length];
      return quote.text;
    }
    if (shortType === 'words') {
      return generateRandomWords(shortWordCount, includePunctuation, includeNumbers);
    }
    // Time mode: dynamically generate ample words for the chosen minutes
    const wordsNeeded = Math.max(120, Math.ceil((shortDuration / 60) * 130));
    return generateRandomWords(wordsNeeded, includePunctuation, includeNumbers);
  }, [mode, selectedPassage, customText, shortType, testSeed, shortWordCount, shortDuration, includePunctuation, includeNumbers]);

  const isTimed = mode === 'short' && shortType === 'time';
  const timeLimit = isTimed ? shortDuration : 60;

  // Handle completion callback
  const handleTestComplete = useCallback((result: TypingResult) => {
    setLastResult(result);
    setHistoryResults((prev) => [result, ...prev]);
  }, []);

  // Initialize typing engine
  const engine = useTypingEngine({
    targetText,
    mode,
    timeLimit,
    isTimed,
    soundProfile,
    suddenDeath,
    noBackspace,
    onComplete: handleTestComplete,
  });

  // Action to restart same test
  const handleRestart = () => {
    setLastResult(null);
    engine.resetEngine();
  };

  // Action to cycle to next passage or new word batch
  const handleNextTest = () => {
    setLastResult(null);
    setTestSeed((prev) => prev + 1);
    if (mode === 'long') {
      const currentIndex = LONG_PASSAGES.findIndex((p) => p.id === selectedPassage.id);
      const nextIndex = (currentIndex + 1) % LONG_PASSAGES.length;
      setSelectedPassage(LONG_PASSAGES[nextIndex]);
    }
    engine.resetEngine();
  };

  const clearHistory = () => {
    setHistoryResults([]);
    try {
      localStorage.removeItem(STATS_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 
        TOP BAR CONTRACT:
        Zone 1: [Brand Title, one line]
        Zone 2: [4-5 clean nav links, single-line]
        Zone 3: [1 primary action]
      */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-200/90 bg-white sticky top-0 z-30 shadow-xs">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
            <Keyboard className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            TypeVerse
          </span>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => {
              setMode('short');
              handleRestart();
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              mode === 'short' ? 'text-blue-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Short Tests
          </button>
          <button
            onClick={() => {
              setMode('long');
              handleRestart();
            }}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              mode === 'long' ? 'text-blue-600 font-bold' : 'hover:text-slate-900'
            }`}
          >
            Long Passages
          </button>
          <button
            onClick={() => setShowGuideModal(true)}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
          >
            Typing Guide
          </button>
          <button
            onClick={() => setShowStatsModal(true)}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
          >
            <Trophy className="w-3.5 h-3.5 text-blue-600" />
            <span>My Records</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Test</span>
          </button>
        </div>
      </header>

      {/* Main App Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* If test completed, show Results Card */}
        {engine.status === 'completed' && lastResult ? (
          <ResultsCard
            result={lastResult}
            onRestart={handleRestart}
            onNextTest={handleNextTest}
          />
        ) : (
          <div className="space-y-6">
            {/* Mode & Configuration Selector */}
            <ModeSelector
              mode={mode}
              onSelectMode={(m) => {
                setMode(m);
                handleRestart();
              }}
              shortType={shortType}
              onSelectShortType={(st) => {
                setShortType(st);
                handleRestart();
              }}
              shortDuration={shortDuration}
              onSelectDuration={(d) => {
                setShortDuration(d);
                handleRestart();
              }}
              shortWordCount={shortWordCount}
              onSelectWordCount={(w) => {
                setShortWordCount(w);
                handleRestart();
              }}
              includePunctuation={includePunctuation}
              onTogglePunctuation={() => {
                setIncludePunctuation(!includePunctuation);
                handleRestart();
              }}
              includeNumbers={includeNumbers}
              onToggleNumbers={() => {
                setIncludeNumbers(!includeNumbers);
                handleRestart();
              }}
              noBackspace={noBackspace}
              onToggleNoBackspace={() => {
                setNoBackspace(!noBackspace);
                handleRestart();
              }}
              selectedPassageId={selectedPassage.id}
              onSelectPassage={(p) => {
                setSelectedPassage(p);
                handleRestart();
              }}
              customText={customText}
              onUpdateCustomText={(txt) => {
                setCustomText(txt);
                handleRestart();
              }}
            />

            {/* Interactive Typing Arena */}
            <div className="space-y-5">
              <TypingArea
                targetText={targetText}
                userInput={engine.userInput}
                status={engine.status}
                timeLeft={engine.timeLeft}
                isTimed={isTimed}
                liveWpm={engine.liveWpm}
                liveAccuracy={engine.liveAccuracy}
                totalErrors={engine.totalErrors}
                progressPercent={engine.progressPercent}
                currentIndex={engine.currentIndex}
                soundProfile={soundProfile}
                onChangeSoundProfile={setSoundProfile}
                suddenDeath={suddenDeath}
                onToggleSuddenDeath={() => setSuddenDeath(!suddenDeath)}
                noBackspace={noBackspace}
                backspaceLockedWarning={engine.backspaceLockedWarning}
                onKeyDown={engine.handleKeyDown}
                onReset={handleRestart}
                mode={mode}
              />

              {/* Info Card for Long Passage mode */}
              {mode === 'long' && (
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-500 shadow-xs">
                  <div>
                    <span className="font-semibold text-slate-800">{selectedPassage.title}</span>
                    <span className="mx-2">·</span>
                    <span>{selectedPassage.sourceOrAuthor}</span>
                  </div>
                  <span className="font-mono text-blue-600 font-semibold">{selectedPassage.difficulty} Level</span>
                </div>
              )}

              {/* Interactive Virtual Mechanical Keyboard Bar Controls */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-xs"
                  >
                    <Keyboard className="w-3.5 h-3.5 text-blue-600" />
                    <span>{showKeyboard ? 'Hide Virtual Keyboard' : 'Show Virtual Keyboard'}</span>
                  </button>

                  {showKeyboard && (
                    <button
                      type="button"
                      onClick={() => setShowFingerGuide(!showFingerGuide)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors shadow-xs ${
                        showFingerGuide
                          ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Finger Placement Zones</span>
                    </button>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Click any key or type for mechanical click sound</span>
                </div>
              </div>

              {/* Interactive Virtual Keyboard */}
              {showKeyboard && (
                <VirtualKeyboard
                  activeKey={engine.lastPressedKey}
                  nextExpectedKey={targetText[engine.currentIndex] || ''}
                  soundProfile={soundProfile}
                  onVirtualKeyPress={engine.handleVirtualKey}
                  showFingerGuide={showFingerGuide}
                />
              )}
            </div>
          </div>
        )}

        {/* Clean Touch Typing Principles & Guidelines (AdSense High Editorial Value) */}
        <section className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Touch Typing Technique & Speed Benchmarks</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured finger placement and rhythm exercises for short velocity sprints and long-form endurance.
              </p>
            </div>
            <button
              onClick={() => setShowGuideModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
              <span className="text-[11px] font-mono text-blue-600 font-bold uppercase tracking-wider">
                01. Home Row Placement
              </span>
              <h4 className="text-sm font-semibold text-slate-900">Tactile F & J Finger Anchors</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Always anchor your index fingers on the home row bumps. Do not look down; train muscle memory to feel distance automatically.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
              <span className="text-[11px] font-mono text-emerald-600 font-bold uppercase tracking-wider">
                02. Short vs. Long Training
              </span>
              <h4 className="text-sm font-semibold text-slate-900">Sprint Speed & Stamina</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Short 15s–60s bursts build peak finger velocity. Long multi-paragraph passages build consistency, endurance, and 98%+ accuracy.
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
              <span className="text-[11px] font-mono text-indigo-600 font-bold uppercase tracking-wider">
                03. Lookahead Cadence
              </span>
              <h4 className="text-sm font-semibold text-slate-900">Eye-to-Hand Anticipation</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan 2 to 3 words ahead in the sentence while typing. Continuous visual buffering prevents micro-stutters and sustains fluid velocity.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer with AdSense Compliance Links */}
      <footer className="border-t border-slate-200 bg-white py-6 px-6 mt-12 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">
              TV
            </div>
            <span className="font-bold text-slate-800">TypeVerse</span>
            <span className="text-slate-300">·</span>
            <span>Speed Typing & Touch Mastery Platform</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <button onClick={() => setShowAboutModal(true)} className="hover:text-blue-600 transition-colors">
              About
            </button>
            <button onClick={() => setShowPrivacyModal(true)} className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => setShowTermsModal(true)} className="hover:text-blue-600 transition-colors">
              Terms
            </button>
            <button onClick={() => setShowContactModal(true)} className="hover:text-blue-600 transition-colors">
              Contact
            </button>
            <button onClick={() => setShowGuideModal(true)} className="hover:text-blue-600 transition-colors">
              Typing Guide
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-4 pt-3 border-t border-slate-100 text-center text-slate-400 text-[11px]">
          © {new Date().getFullYear()} TypeVerse. All rights reserved.
        </div>
      </footer>

      {/* Modals */}
      <StatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        results={historyResults}
        onClearHistory={clearHistory}
      />
      <AboutUsModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
      <ContactUsModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
      <TypingGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
}
