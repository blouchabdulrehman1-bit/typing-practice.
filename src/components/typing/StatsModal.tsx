import React from 'react';
import { TypingResult } from '../../types';
import { X, Trophy, History, Trash2 } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: TypingResult[];
  onClearHistory: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, results, onClearHistory }) => {
  if (!isOpen) return null;

  const totalTests = results.length;
  const bestWpm = totalTests > 0 ? Math.max(...results.map((r) => r.wpm)) : 0;
  const avgWpm = totalTests > 0 ? Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / totalTests) : 0;
  const avgAccuracy = totalTests > 0 ? Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / totalTests) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 my-8 text-slate-800 max-h-[85vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Typing Statistics</h2>
              <p className="text-xs text-slate-500">Track your speed progress and personal records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Best Speed</span>
            <div className="text-2xl font-extrabold text-blue-600 font-mono tabular-nums mt-0.5">
              {bestWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Average Speed</span>
            <div className="text-2xl font-extrabold text-slate-800 font-mono tabular-nums mt-0.5">
              {avgWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Average Accuracy</span>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums mt-0.5">
              {avgAccuracy}%
            </div>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] font-semibold text-slate-500 uppercase">Tests Taken</span>
            <div className="text-2xl font-extrabold text-indigo-600 font-mono tabular-nums mt-0.5">
              {totalTests}
            </div>
          </div>
        </div>

        {/* Past Sessions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-400" />
              <span>Recent Test History</span>
            </span>
            {totalTests > 0 && (
              <button
                onClick={onClearHistory}
                className="text-red-600 hover:text-red-700 flex items-center gap-1 text-[11px] font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {totalTests === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
              No typing tests completed yet. Take a test to record your typing stats!
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {results.slice(0, 10).map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-blue-600 font-mono text-sm">{r.wpm} WPM</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-emerald-600 font-mono font-medium">{r.accuracy}% acc</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-600">{r.mode.toUpperCase()} ({r.categoryOrDuration})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {new Date(r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
