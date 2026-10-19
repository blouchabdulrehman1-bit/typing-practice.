import React, { useState } from 'react';
import { TypingMode, ShortDuration, ShortWordCount } from '../../types';
import { LONG_PASSAGES, LongPassage } from '../../data/typingTexts';
import { Clock, FileText, PenTool, ShieldCheck, Timer } from 'lucide-react';

interface ModeSelectorProps {
  mode: TypingMode;
  onSelectMode: (mode: TypingMode) => void;
  // Short test options
  shortType: 'time' | 'words' | 'quote';
  onSelectShortType: (type: 'time' | 'words' | 'quote') => void;
  shortDuration: ShortDuration;
  onSelectDuration: (duration: ShortDuration) => void;
  shortWordCount: ShortWordCount;
  onSelectWordCount: (count: ShortWordCount) => void;
  includePunctuation: boolean;
  onTogglePunctuation: () => void;
  includeNumbers: boolean;
  onToggleNumbers: () => void;
  noBackspace: boolean;
  onToggleNoBackspace: () => void;
  // Long test options
  selectedPassageId: string;
  onSelectPassage: (passage: LongPassage) => void;
  // Custom text option
  customText: string;
  onUpdateCustomText: (text: string) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  mode,
  onSelectMode,
  shortType,
  onSelectShortType,
  shortDuration,
  onSelectDuration,
  shortWordCount,
  onSelectWordCount,
  includePunctuation,
  onTogglePunctuation,
  includeNumbers,
  onToggleNumbers,
  noBackspace,
  onToggleNoBackspace,
  selectedPassageId,
  onSelectPassage,
  customText,
  onUpdateCustomText,
}) => {
  const [customInputDraft, setCustomInputDraft] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [customMinutesInput, setCustomMinutesInput] = useState('3');

  const timePresets = [
    { label: '30s', seconds: 30 },
    { label: '1 min', seconds: 60 },
    { label: '2 min', seconds: 120 },
    { label: '3 min', seconds: 180 },
    { label: '5 min', seconds: 300 },
    { label: '10 min', seconds: 600 },
  ];

  const handleApplyCustomMinutes = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(customMinutesInput);
    if (!isNaN(parsed) && parsed > 0) {
      const totalSec = Math.round(parsed * 60);
      onSelectDuration(totalSec);
      setShowCustomTimeModal(false);
    }
  };

  const isCustomTimeActive = !timePresets.some((p) => p.seconds === shortDuration);

  return (
    <div className="w-full space-y-3">
      {/* Primary Category Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
        {/* Left: Mode Tabs (Timed/Sprint, Long Passages, Custom Text) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => onSelectMode('short')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'short'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timed & Sprint Tests</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('long')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'long'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Long Passages</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('custom')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'custom'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Custom Text</span>
          </button>
        </div>

        {/* Right: Sub-controls based on mode */}
        {mode === 'short' && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Sub-mode: Time / Words / Quote */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => onSelectShortType('time')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  shortType === 'time' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Time / Minutes
              </button>
              <button
                type="button"
                onClick={() => onSelectShortType('words')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  shortType === 'words' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Words
              </button>
              <button
                type="button"
                onClick={() => onSelectShortType('quote')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  shortType === 'quote' ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quote
              </button>
            </div>

            {/* Time / Minutes presets and Custom Time button */}
            {shortType === 'time' && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl font-mono">
                {timePresets.map((preset) => (
                  <button
                    key={preset.seconds}
                    type="button"
                    onClick={() => onSelectDuration(preset.seconds)}
                    className={`px-2 py-1 rounded-lg font-medium transition-colors ${
                      shortDuration === preset.seconds
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}

                {/* Custom Minutes button */}
                <button
                  type="button"
                  onClick={() => setShowCustomTimeModal(true)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    isCustomTimeActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-blue-600 hover:bg-white'
                  }`}
                  title="Choose exact minutes"
                >
                  <Timer className="w-3 h-3" />
                  <span>{isCustomTimeActive ? `${Math.round(shortDuration / 60 * 10) / 10}m` : 'Custom min'}</span>
                </button>
              </div>
            )}

            {/* Word counts if words sub-mode */}
            {shortType === 'words' && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl font-mono">
                {([25, 50, 100] as ShortWordCount[]).map((wCount) => (
                  <button
                    key={wCount}
                    type="button"
                    onClick={() => onSelectWordCount(wCount)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      shortWordCount === wCount
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {wCount}
                  </button>
                ))}
              </div>
            )}

            {/* Toggles for punctuation & numbers */}
            {shortType !== 'quote' && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onTogglePunctuation}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                    includePunctuation
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Punctuation
                </button>
                <button
                  type="button"
                  onClick={onToggleNumbers}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
                    includeNumbers
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Numbers
                </button>
              </div>
            )}

            {/* Strict Accuracy Mode Toggle */}
            <button
              type="button"
              onClick={onToggleNoBackspace}
              title={
                noBackspace
                  ? 'Strict Accuracy: Mistakes cannot be changed (Backspace locked)'
                  : 'Relaxed Mode: Backspace allowed'
              }
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                noBackspace
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{noBackspace ? 'Strict Accuracy (No Backspace)' : 'Backspace Allowed'}</span>
            </button>
          </div>
        )}

        {/* Sub-controls for Long Passages */}
        {mode === 'long' && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 hidden sm:inline font-medium">Select Story / Article:</span>
            <select
              value={selectedPassageId}
              onChange={(e) => {
                const found = LONG_PASSAGES.find((p) => p.id === e.target.value);
                if (found) onSelectPassage(found);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500"
            >
              {LONG_PASSAGES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.approxWordCount} words · {p.difficulty})
                </option>
              ))}
            </select>

            {/* Strict Accuracy Mode Toggle */}
            <button
              type="button"
              onClick={onToggleNoBackspace}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                noBackspace
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{noBackspace ? 'Strict Accuracy' : 'Allow Backspace'}</span>
            </button>
          </div>
        )}

        {/* Sub-controls for Custom Mode */}
        {mode === 'custom' && (
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowCustomModal(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              Paste / Edit Custom Text
            </button>

            <button
              type="button"
              onClick={onToggleNoBackspace}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                noBackspace
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{noBackspace ? 'Strict Accuracy' : 'Allow Backspace'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Custom Minutes Selection Modal */}
      {showCustomTimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <form
            onSubmit={handleApplyCustomMinutes}
            className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full text-slate-900 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">Choose Custom Minutes</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomTimeModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Enter how many minutes you want the typing test to last (e.g. 1, 2, 3, 5, 7, 10, or 15 minutes):
            </p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0.5"
                max="60"
                step="0.5"
                required
                value={customMinutesInput}
                onChange={(e) => setCustomMinutesInput(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-center text-blue-600 focus:outline-none focus:border-blue-500"
              />
              <span className="text-sm font-semibold text-slate-600">Minutes</span>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomTimeModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                Set Time & Start
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom Text Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl w-full text-slate-900 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Paste Custom Long Text</h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Paste your own long article, book excerpt, or practice document. TypeVerse will format it for typing practice.
            </p>
            <textarea
              rows={8}
              value={customInputDraft || customText}
              onChange={(e) => setCustomInputDraft(e.target.value)}
              placeholder="Paste your custom text here..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (customInputDraft.trim()) {
                    onUpdateCustomText(customInputDraft.trim());
                  }
                  setShowCustomModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                Apply & Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
