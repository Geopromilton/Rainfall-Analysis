/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { WaterDemandResult } from '../types';
import { Home, Users, CheckSquare, BarChart, Settings } from 'lucide-react';

interface WaterDemandCardProps {
  demandResult: WaterDemandResult;
  standard: 'BIS' | 'WHO';
  setStandard: (val: 'BIS' | 'WHO') => void;
  category: string;
  setCategory: (val: string) => void;
  numberOfPlots: number;
  setNumberOfPlots: (val: number) => void;
}

export default function WaterDemandCard({
  demandResult,
  standard,
  setStandard,
  category,
  setCategory,
  numberOfPlots,
  setNumberOfPlots
}: WaterDemandCardProps) {

  // Auto-switch categories when standard changes to avoid crash
  const handleStandardChange = (stdName: 'BIS' | 'WHO') => {
    setStandard(stdName);
    if (stdName === 'BIS') {
      setCategory('Urban General');
    } else {
      setCategory('Optimal');
    }
  };

  const categoriesForStandard = standard === 'BIS' 
    ? ['Urban General', 'EWS/LIG'] 
    : ['No Access', 'Basic', 'Optimal'];

  const categoryDescriptions: Record<string, string> = {
    'Urban General': 'Recommended Indian municipal baseline including piped flush systems.',
    'EWS/LIG': 'Economically Weaker Section minimal piped standard per BIS requirements.',
    'No Access': 'Extreme rural scarcity. Restricted strictly to minimum drinking and survival.',
    'Basic': 'Handpump or single shared standpost access. Minimal bathing and hygiene capacity.',
    'Optimal': 'Direct full domestic connection with safe water-security safeguards.'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="water-demand-view">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
          Module 3: Demand Estimation
        </span>
        <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Aquifer Water Draft Standards</h2>
        <p className="text-sm text-slate-500 mt-1">
          Simulate domestic and community-scale stress based on national (BIS) and international (WHO) limits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left column: Setup controls */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
            <Settings className="w-4 h-4 text-indigo-500" />
            1. Standards Framework
          </h3>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
            {/* Standard Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 font-sans">Water Code Regulatory Source</label>
              <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-lg border border-slate-100">
                <button
                  onClick={() => handleStandardChange('BIS')}
                  className={`text-[11px] font-bold py-1.5 rounded transition-all ${standard === 'BIS' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  BIS (Indian Urban Code)
                </button>
                <button
                  onClick={() => handleStandardChange('WHO')}
                  className={`text-[11px] font-bold py-1.5 rounded transition-all ${standard === 'WHO' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  WHO (Global Health Code)
                </button>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 font-sans">Socioeconomic Category</label>
              <select
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoriesForStandard.map(cat => (
                  <option key={cat} value={cat}>{cat} ({cat === 'EWS/LIG' || cat === 'Basic' ? '135/40 lpcd' : cat === 'Urban General' ? '150 lpcd' : cat === 'No Access' ? '5 lpcd' : '120 lpcd'})</option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 leading-normal font-sans pt-1 italic">
                * {categoryDescriptions[category]}
              </p>
            </div>

            {/* Community Size Plots */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 font-sans">Village Community plots count</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={1}
                  className="w-full accent-indigo-600"
                  value={numberOfPlots}
                  onChange={(e) => setNumberOfPlots(Number(e.target.value))}
                />
                <span className="text-xs font-mono font-bold text-slate-700 w-8">{numberOfPlots}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-sans mt-0.5 block">Estimated average occupancy: 8 persons per plot</span>
            </div>
          </div>
        </div>

        {/* Center column: Single Plot Scenario Comparison visualizer */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
            <BarChart className="w-4 h-4 text-indigo-500" />
            2. Single-Plot Daily Consumption (Lpd)
          </h3>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between h-[216px]">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-600 font-medium font-sans flex items-center gap-1"><Home className="w-3.5 h-3.5 text-indigo-400" /> High-Occupancy (10 Persons)</span>
                <span className="text-xs font-mono font-bold text-slate-800">{demandResult.scenario10PersonsLpd.toLocaleString()} L</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (demandResult.scenario10PersonsLpd / 2000) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-600 font-medium font-sans flex items-center gap-1"><Home className="w-3.5 h-3.5 text-slate-400" /> Standard plot (6 Persons)</span>
                <span className="text-xs font-mono font-bold text-slate-800">{demandResult.scenario6PersonsLpd.toLocaleString()} L</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-indigo-400 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (demandResult.scenario6PersonsLpd / 2000) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-indigo-800 text-[10.5px] leading-relaxed">
              <strong>Sustainability threshold:</strong> To ensure deep aquifer protection, a single-plot harvesting system must capture at least <strong>{Math.round(demandResult.scenario6PersonsLpd * 365).toLocaleString()} Litres</strong> annually to achieve zero net-draft.
            </div>
          </div>
        </div>

        {/* Right column: LPCD Allocation Breakdown & Totals */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
            <Users className="w-4 h-4 text-indigo-500" />
            3. Daily Allocation & Totals
          </h3>

          <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-4">
            <div>
              <span className="text-[10px] text-slate-400 font-sans uppercase font-bold tracking-wider">Liters/Person/Day Allocation</span>
              <div className="text-3xl font-extrabold text-indigo-400 font-mono mt-0.5">{demandResult.perPersonLpcd} <span className="text-xs font-sans font-bold text-slate-400">lpcd</span></div>
            </div>

            {/* Allocation breakdown bar */}
            <div>
              <div className="flex h-3 rounded-full overflow-hidden mb-2">
                <div style={{ width: `${(demandResult.breakdown.drinking / demandResult.perPersonLpcd)*100}%` }} className="bg-rose-400" title="Drinking" />
                <div style={{ width: `${(demandResult.breakdown.cooking / demandResult.perPersonLpcd)*100}%` }} className="bg-amber-400" title="Cooking" />
                <div style={{ width: `${(demandResult.breakdown.bathing / demandResult.perPersonLpcd)*100}%` }} className="bg-sky-400" title="Bathing" />
                <div style={{ width: `${(demandResult.breakdown.washing / demandResult.perPersonLpcd)*100}%` }} className="bg-teal-400" title="Washing" />
                <div style={{ width: `${(demandResult.breakdown.flushing / demandResult.perPersonLpcd)*100}%` }} className="bg-indigo-400" title="Flushing" />
              </div>
              <div className="grid grid-cols-5 text-[9px] text-slate-400 font-sans text-center gap-0.5 font-mono">
                <div className="truncate"><span className="inline-block w-1.5 h-1.5 bg-rose-400 rounded-full mr-1"></span>Drk ({demandResult.breakdown.drinking}L)</div>
                <div className="truncate"><span className="inline-block w-1.5 h-1.5 bg-amber-400 rounded-full mr-1"></span>Cok ({demandResult.breakdown.cooking}L)</div>
                <div className="truncate"><span className="inline-block w-1.5 h-1.5 bg-sky-400 rounded-full mr-1"></span>Bth ({demandResult.breakdown.bathing}L)</div>
                <div className="truncate"><span className="inline-block w-1.5 h-1.5 bg-teal-400 rounded-full mr-1"></span>Wsh ({demandResult.breakdown.washing}L)</div>
                <div className="truncate"><span className="inline-block w-1.5 h-1.5 bg-indigo-400 rounded-full mr-1"></span>Flsh ({demandResult.breakdown.flushing}L)</div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Community scale (8p/p):</span>
                <span className="font-bold text-white text-sm">{demandResult.communityTotalDemandLpd.toLocaleString()} L/day</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Draft (+15% open irr.):</span>
                <span className="font-bold text-indigo-400 text-sm">{demandResult.infrastructureTotalDemandLpd.toLocaleString()} L/day</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
