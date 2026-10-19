import React, { useState } from 'react';
import { X, Calculator, TrendingUp, DollarSign, Target } from 'lucide-react';

interface EarningsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EarningsCalculatorModal: React.FC<EarningsCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [dailyVisitors, setDailyVisitors] = useState<number>(1000);
  const [testsPerVisitor, setTestsPerVisitor] = useState<number>(5);
  const [cpmRate, setCpmRate] = useState<number>(2.2); // $2.20 CPM
  const [currency, setCurrency] = useState<'USD' | 'PKR' | 'INR'>('PKR');

  if (!isOpen) return null;

  // Typing test calculation:
  // Each test has 3 banner views (Header, Sidebar, Result/Footer)
  const adsPerTest = 3;
  const dailyTests = dailyVisitors * testsPerVisitor;
  const dailyImpressions = dailyTests * adsPerTest;
  const monthlyImpressions = dailyImpressions * 30;

  // Monthly revenue in USD
  const monthlyUsd = (monthlyImpressions / 1000) * cpmRate;

  // Currency conversions (approx standard rates: 1 USD = 278 PKR, 1 USD = 83 INR)
  const convertedMonthly =
    currency === 'USD'
      ? Math.round(monthlyUsd)
      : currency === 'PKR'
      ? Math.round(monthlyUsd * 278)
      : Math.round(monthlyUsd * 83);

  const targetAmount = currency === 'USD' ? 250 : currency === 'PKR' ? 59000 : 20000;
  const progressPercent = Math.min(100, Math.round((convertedMonthly / targetAmount) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-100 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Adsterra & AdSense Earning Calculator</h2>
              <p className="text-xs text-slate-400">Forecast your monthly revenue to achieve your 59,000+ target</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close calculator"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-300 font-medium">Display Currency:</span>
          <div className="flex items-center gap-1">
            {(['PKR', 'INR', 'USD'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  currency === curr ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Daily Active Visitors:</span>
              <span className="font-mono font-bold text-amber-400">{dailyVisitors.toLocaleString()} typists</span>
            </div>
            <input
              type="range"
              min="200"
              max="10000"
              step="100"
              value={dailyVisitors}
              onChange={(e) => setDailyVisitors(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Typing Tests Completed per Visitor:</span>
              <span className="font-mono font-bold text-emerald-400">{testsPerVisitor} tests (high dwell time)</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={testsPerVisitor}
              onChange={(e) => setTestsPerVisitor(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1.5">
              <span>Average Adsterra CPM Rate:</span>
              <span className="font-mono font-bold text-blue-400">${cpmRate.toFixed(2)} USD per 1k impressions</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={cpmRate}
              onChange={(e) => setCpmRate(Number(e.target.value))}
              className="w-full accent-blue-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Projected Monthly Revenue Card */}
        <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Projected Monthly Revenue
            </span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{monthlyImpressions.toLocaleString()} Monthly Impressions</span>
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums">
              {currency} {convertedMonthly.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">
              (≈ ${Math.round(monthlyUsd)} USD)
            </span>
          </div>

          {/* Goal tracker towards 59,000 */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-amber-300">
                <Target className="w-3.5 h-3.5" />
                <span>Target: {currency} {targetAmount.toLocaleString()}</span>
              </span>
              <span className="font-bold text-slate-200">{progressPercent}% of target</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs text-slate-400 space-y-1 leading-relaxed">
          <strong className="text-slate-200">Why Typing Apps Make Easy High Revenue:</strong>
          <p>
            Unlike regular blogs where users bounce in 20 seconds, a typist completing 5 speed tests refreshes your header, sidebar, and result ad units 15+ times. With just <strong>800 daily visitors</strong> doing standard tests, you generate <strong>120,000 monthly ad impressions</strong>, easily hitting your 59,000 PKR / INR monthly payout threshold!
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};
