import React, { useRef, useEffect } from 'react';
import { SoundProfile, TypingMode } from '../../types';
import { playKeySound } from '../../utils/audio';
import { Volume2, VolumeX, RotateCcw, ShieldAlert, Sparkles, Volume1, AlertCircle } from 'lucide-react';

interface TypingAreaProps {
  targetText: string;
  userInput: string;
  status: 'idle' | 'running' | 'completed';
  timeLeft: number;
  isTimed: boolean;
  liveWpm: number;
  liveAccuracy: number;
  totalErrors: number;
  progressPercent: number;
  currentIndex: number;
  soundProfile: SoundProfile;
  onChangeSoundProfile: (profile: SoundProfile) => void;
  suddenDeath: boolean;
  onToggleSuddenDeath: () => void;
  noBackspace: boolean;
  backspaceLockedWarning?: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => void;
  onReset: () => void;
  mode: TypingMode;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  userInput,
  status,
  timeLeft,
  isTimed,
  liveWpm,
  liveAccuracy,
  totalErrors,
  progressPercent,
  currentIndex,
  soundProfile,
  onChangeSoundProfile,
  suddenDeath,
  onToggleSuddenDeath,
  noBackspace,
  backspaceLockedWarning = false,
  onKeyDown,
  onReset,
  mode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [targetText]);

  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const charTop = activeCharRef.current.offsetTop;
      const container = containerRef.current;
      if (charTop > container.scrollTop + 140) {
        container.scrollTo({
          top: charTop - 80,
          behavior: 'smooth',
        });
      } else if (charTop < container.scrollTop + 20) {
        container.scrollTo({
          top: Math.max(0, charTop - 40),
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  const soundOptions: { id: SoundProfile; label: string }[] = [
    { id: 'blue', label: 'Cherry MX Blue (Crisp Click)' },
    { id: 'brown', label: 'Mechanical (Deep Thock)' },
    { id: 'typewriter', label: 'Vintage Typewriter (Clack)' },
    { id: 'red', label: 'Red Linear (Smooth)' },
    { id: 'mute', label: 'Mute Sound' },
  ];

  const handleTestSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    playKeySound(soundProfile === 'mute' ? 'blue' : soundProfile, false, false);
    inputRef.current?.focus();
  };

  const formatTimeRemaining = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins > 0) {
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${secs}s`;
  };

  return (
    <div className="w-full space-y-4">
      {/* HUD Header - Google AdSense Clean Slate & Blue Theme */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
        {/* Primary Metrics */}
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Speed</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono tabular-nums">
                {liveWpm}
              </span>
              <span className="text-xs font-semibold text-slate-400">WPM</span>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200" />

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Accuracy</span>
              {noBackspace && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-medium">
                  Strict
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tabular-nums">
                {liveAccuracy}%
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-slate-200" />

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {isTimed ? 'Time Left' : 'Progress'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 font-mono tabular-nums">
                {isTimed ? formatTimeRemaining(timeLeft) : `${progressPercent}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Controls & Mechanical Audio Switch */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Switch Sound Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            {soundProfile === 'mute' ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-blue-600 animate-pulse" />
            )}
            <select
              value={soundProfile}
              onChange={(e) => {
                const nextProfile = e.target.value as SoundProfile;
                onChangeSoundProfile(nextProfile);
                playKeySound(nextProfile === 'mute' ? 'blue' : nextProfile, false, false);
              }}
              className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              {soundOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Test Sound Button */}
          <button
            type="button"
            onClick={handleTestSound}
            title="Click to test mechanical switch sound"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <Volume1 className="w-3.5 h-3.5 text-blue-600" />
            <span>Test Sound 🔊</span>
          </button>

          {/* Sudden Death toggle */}
          <button
            type="button"
            onClick={onToggleSuddenDeath}
            title={suddenDeath ? 'Sudden Death ON: 1 mistake ends test' : 'Standard Mode'}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
              suddenDeath
                ? 'bg-red-50 border-red-300 text-red-600 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sudden Death</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={onReset}
            title="Restart test (Tab)"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Warning toast if user presses Backspace in strict accuracy mode */}
      {backspaceLockedWarning && (
        <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium animate-bounce shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Mistake Locked: Errors cannot be changed in Strict Accuracy Mode. Keep typing forward!</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Typing Text Container */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`relative w-full rounded-2xl border transition-all cursor-text p-6 sm:p-8 bg-white shadow-sm min-h-[240px] max-h-[380px] overflow-y-auto ${
          status === 'running'
            ? 'border-blue-400 ring-4 ring-blue-500/10'
            : 'border-slate-200/90 hover:border-slate-300'
        }`}
        ref={containerRef}
      >
        {/* Hidden capturing input */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none -top-9999px"
          onKeyDown={onKeyDown}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Start typing prompt banner if idle */}
        {status === 'idle' && (
          <div className="absolute top-4 right-6 pointer-events-none flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            <Sparkles className="w-3 h-3" />
            <span>Click or press any key to type with sound</span>
          </div>
        )}

        {/* Text rendering */}
        <div className="font-mono text-lg sm:text-xl leading-relaxed tracking-wide select-none">
          {targetText.split('').map((char, index) => {
            let stateClass = 'text-slate-400';
            const isTyped = index < userInput.length;
            const isCurrent = index === currentIndex;

            if (isTyped) {
              const matches = userInput[index] === char;
              if (matches) {
                stateClass = 'text-slate-900 font-medium';
              } else {
                stateClass = 'text-red-600 bg-red-100 rounded px-0.5 underline decoration-red-500 font-bold';
              }
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className={`relative inline ${stateClass} ${
                  isCurrent
                    ? 'bg-blue-100 text-blue-900 border-b-2 border-blue-600 animate-caret'
                    : ''
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Tip & Error Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-mono">
        <span>
          {noBackspace ? (
            <span className="text-emerald-700 font-semibold">🔒 Strict Accuracy: Mistakes cannot be changed</span>
          ) : (
            <span>Backspace allowed</span>
          )}
        </span>
        <span>Errors: <strong className="text-red-500 font-mono font-bold">{totalErrors}</strong></span>
      </div>
    </div>
  );
};
