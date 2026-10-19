import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TypingResult } from '../../types';
import { RotateCcw, Award, Share2, Check, ArrowRight, Printer } from 'lucide-react';
import certificateBadge from '../../assets/images/typing_certificate_badge_1792388235875.jpg';

interface ResultsCardProps {
  result: TypingResult;
  onRestart: () => void;
  onNextTest: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ result, onRestart, onNextTest }) => {
  const [userName, setUserName] = useState('Typing Champion');
  const [copied, setCopied] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (result.accuracy >= 92 && result.wpm >= 35) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#F59E0B', '#6366F1'],
      });
    }
  }, [result.accuracy, result.wpm]);

  const getTier = (wpm: number) => {
    if (wpm >= 100) return { label: 'Legendary (100+ WPM)', color: 'text-amber-600' };
    if (wpm >= 80) return { label: 'Master Typist (80+ WPM)', color: 'text-emerald-600' };
    if (wpm >= 60) return { label: 'Pro Speed (60+ WPM)', color: 'text-blue-600' };
    if (wpm >= 40) return { label: 'Intermediate (40+ WPM)', color: 'text-indigo-600' };
    return { label: 'Novice Typist', color: 'text-slate-600' };
  };

  const tier = getTier(result.wpm);

  // SVG mini graph
  const maxWpm = Math.max(...result.wpmHistory.map((p) => p.wpm), result.wpm, 10);
  const graphWidth = 560;
  const graphHeight = 90;
  const points = result.wpmHistory
    .map((p, index) => {
      const x = (index / Math.max(result.wpmHistory.length - 1, 1)) * graphWidth;
      const y = graphHeight - (p.wpm / maxWpm) * (graphHeight - 12);
      return `${x},${y}`;
    })
    .join(' ');

  const handleShare = () => {
    const shareText = `🚀 I just hit ${result.wpm} WPM with ${result.accuracy}% accuracy on TypeVerse! Can you beat my typing velocity?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const missedEntries = Object.entries(result.missedKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main result block - Clean Google Light Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <span>TEST COMPLETED</span>
              <span>·</span>
              <span className={tier.color}>{tier.label}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Performance Report</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCertificate(!showCertificate)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>{showCertificate ? 'Hide Certificate' : 'View Certificate'}</span>
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Copied Link!' : 'Share Score'}</span>
            </button>
          </div>
        </div>

        {/* Primary metric stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Speed (Net WPM)</span>
            <div className="text-4xl font-extrabold text-blue-600 font-mono tabular-nums">
              {result.wpm}
            </div>
            <div className="text-[11px] text-slate-400">Raw: {result.rawWpm} WPM</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Accuracy</span>
            <div className="text-4xl font-extrabold text-emerald-600 font-mono tabular-nums">
              {result.accuracy}%
            </div>
            <div className="text-[11px] text-slate-400">Errors: {result.errorChars}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Characters / Min</span>
            <div className="text-4xl font-extrabold text-slate-800 font-mono tabular-nums">
              {result.cpm}
            </div>
            <div className="text-[11px] text-slate-400">Total keys: {result.totalChars}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Consistency</span>
            <div className="text-4xl font-extrabold text-indigo-600 font-mono tabular-nums">
              {result.consistency}%
            </div>
            <div className="text-[11px] text-slate-400">Duration: {result.timeElapsed}s</div>
          </div>
        </div>

        {/* Speed Chart over time */}
        {result.wpmHistory.length > 1 && (
          <div className="pt-6 pb-2">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold uppercase tracking-wider text-[11px]">Velocity Pace Graph (WPM Over Time)</span>
              <span className="font-mono text-[11px] text-blue-600 font-bold">Peak: {maxWpm} WPM</span>
            </div>
            <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 overflow-hidden">
              <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-24 stroke-blue-600 fill-none">
                <defs>
                  <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {points && (
                  <>
                    <polygon
                      points={`0,${graphHeight} ${points} ${graphWidth},${graphHeight}`}
                      fill="url(#wpmGradient)"
                      stroke="none"
                    />
                    <polyline
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                  </>
                )}
              </svg>
            </div>
          </div>
        )}

        {/* Missed keys breakdown */}
        {missedEntries.length > 0 && (
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Keys to practice:</span>
            {missedEntries.map(([key, count]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg text-xs font-mono text-red-700"
              >
                <span>'{key === ' ' ? 'Space' : key}'</span>
                <span className="text-[10px] text-red-500 font-bold">({count}x)</span>
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again (Tab)</span>
          </button>
          <button
            onClick={onNextTest}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            <span>Next Passage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Certificate Display */}
      {showCertificate && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
          <div className="border border-slate-300 rounded-xl p-6 sm:p-8 text-center relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={handlePrintCertificate}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>

            <img
              src={certificateBadge}
              alt="Achievement Seal"
              className="w-24 h-24 mx-auto rounded-full shadow-md border-2 border-amber-400/50 object-cover mb-4"
            />

            <span className="text-[11px] font-mono tracking-widest text-blue-600 font-bold uppercase">
              TYPEVERSE SPEED PROFICIENCY CERTIFICATE
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              Certificate of Keyboard Mastery
            </h3>

            <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
              This certifies that the typist below demonstrated verified speed and accuracy under standardized timed test conditions.
            </p>

            <div className="my-6 max-w-xs mx-auto">
              <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1 font-semibold">
                Typist Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-center text-lg font-bold text-blue-600 bg-slate-50 border border-slate-200 rounded-lg py-1 px-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-center gap-8 py-3 my-4 border-y border-slate-200 text-center">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Speed</span>
                <p className="text-2xl font-extrabold text-blue-600 font-mono">{result.wpm} WPM</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Accuracy</span>
                <p className="text-2xl font-extrabold text-emerald-600 font-mono">{result.accuracy}%</p>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Rank Tier</span>
                <p className="text-sm font-bold text-slate-800 mt-1">{tier.label.split(' ')[0]}</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between max-w-md mx-auto pt-2">
              <span>Date: {new Date(result.date).toLocaleDateString()}</span>
              <span>ID: {result.id.slice(0, 16)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
