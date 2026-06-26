/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DryWetSpellMetrics, HistoricTrendSummary } from '../types';
import { FileText, Save, Check, MapPin, Award, Download, TrendingUp } from 'lucide-react';
import ToolTip from './ToolTip';

interface ReportSummaryModuleProps {
  dryWetSpells: DryWetSpellMetrics;
  trends: HistoricTrendSummary; // overall historical record
  trendsList: HistoricTrendSummary[];
  totalAreaM2: number;
  weightedC: number;
  waterSecurityDays: number;
  siteName?: string;
}

export default function ReportSummaryModule({
  dryWetSpells,
  trends,
  trendsList,
  totalAreaM2,
  weightedC,
  waterSecurityDays,
  siteName
}: ReportSummaryModuleProps) {
  const [saved, setSaved] = React.useState(false);
  const activeSiteName = siteName || 'Vijayanagar Eco-Village';

  const handleSaveState = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportData = () => {
    const reportData = [
      "--- Site Hydrological & Water Demand Report ---",
      `Site Name,${activeSiteName}`,
      `Total Area (m2),${totalAreaM2.toFixed(2)}`,
      `Weighted Runoff Coefficient (C),${weightedC.toFixed(3)}`,
      `Estimated Buffer Security (Days),${waterSecurityDays}`,
      "",
      "--- Dry & Wet Cycles ---",
      `Longest Dry Spell (Days),${dryWetSpells.longestDrySpellDays}`,
      `Longest Wet Spell (Days),${dryWetSpells.longestWetSpellDays}`,
      `Total Dry Days/Year,${dryWetSpells.totalDryDaysPerYear}`,
      `Total Wet Days/Year,${dryWetSpells.totalWetDaysPerYear}`,
      `Avg Dry Spell Length (Days),${dryWetSpells.avgDrySpellLength}`,
      `Avg Wet Spell Length (Days),${dryWetSpells.avgWetSpellLength}`,
      `Dry Events/Year,${dryWetSpells.dryEventsCount}`,
      `Wet Events/Year,${dryWetSpells.wetEventsCount}`,
      "",
      "--- Trend Analysis & Climatology ---",
      "Period,Avg Rainfall (mm),Trend Slope (mm/yr),CV (%)",
      ...trendsList.map(t => `${t.period},${t.avgRainfall},${t.sensSlopeMmYear},${t.coefficientOfVariationPct}`)
    ].join("\n");

    const blob = new Blob([reportData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeSiteName.toLowerCase().replace(/\s+/g, '_')}_hydrological_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6" id="reporting-view">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
            Module 11: Export & Project Reporting
          </span>
          <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Executive Hydrology Briefing</h2>
          <p className="text-sm text-slate-500 mt-1">
            Slide-ready summaries and consolidated data sheets for {activeSiteName} water authority records.
          </p>
        </div>

        {/* Save and print button groups */}
        <div className="flex gap-2 shrink-0">
          <button 
            onClick={handleExportData}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer font-sans"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Download Report CSV</span>
          </button>

          <button 
            onClick={handleSaveState}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer font-sans"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>State Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-500" />
                <span>Save State</span>
              </>
            )}
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition-all font-sans cursor-pointer shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Print brief</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Table 1: Dry / Wet periods metrics */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/80 space-y-3.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1 font-sans">
            <Award className="w-4 h-4 text-slate-400" /> 1. Climatological Dry & Wet Cycles
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono text-slate-600">
              <tbody>
                <tr className="border-b border-slate-200/50">
                  <td className="py-2 text-slate-500 font-sans font-medium">Longest Dry Spell Duration:</td>
                  <td className="py-2 text-right font-extrabold text-slate-800">{dryWetSpells.longestDrySpellDays} Days</td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="py-2 text-slate-500 font-sans font-medium">Longest Wet Spell Duration:</td>
                  <td className="py-2 text-right font-extrabold text-slate-800">{dryWetSpells.longestWetSpellDays} Days</td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="py-2 text-slate-500 font-sans font-medium">Total Dry Days per Year:</td>
                  <td className="py-2 text-right text-slate-800">{dryWetSpells.totalDryDaysPerYear} Days</td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="py-2 text-slate-500 font-sans font-medium">Total Wet Days per Year:</td>
                  <td className="py-2 text-right text-slate-800">{dryWetSpells.totalWetDaysPerYear} Days</td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="py-2 text-slate-500 font-sans font-medium">Average Dry Spell Span:</td>
                  <td className="py-2 text-right text-slate-800">{dryWetSpells.avgDrySpellLength} Days</td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="py-2 text-slate-500 font-sans font-medium">Average Wet Spell Span:</td>
                  <td className="py-2 text-right text-slate-800">{dryWetSpells.avgWetSpellLength} Days</td>
                </tr>
                <tr className="border-b border-slate-200/50">
                  <td className="py-2 text-slate-500 font-sans font-medium">Annual Dry Speels Events:</td>
                  <td className="py-2 text-right text-slate-800">{dryWetSpells.dryEventsCount} dry seasons/yr</td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500 font-sans font-medium">Annual Wet Speels Events:</td>
                  <td className="py-2 text-right text-slate-800">{dryWetSpells.wetEventsCount} heavy storms/yr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Chronological Climatology block summaries */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/80 space-y-3.5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1 font-sans">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> 2. Trend Analysis & Climatology
            <ToolTip content="Shows statistical Sen's Slope of rainfall variation across distinct chronological buckets. Positive values denote increasing wetness over that period." />
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] font-mono text-slate-600">
              <thead>
                <tr className="border-b border-slate-200 text-[9px] uppercase text-slate-400">
                  <th className="pb-1.5 font-sans font-bold">Epoch Band</th>
                  <th className="pb-1.5 text-right font-sans font-bold">Avg Rain</th>
                  <th className="pb-1.5 text-right font-sans font-bold">Trend Slope (mm/y)</th>
                  <th className="pb-1.5 text-right font-sans font-bold">Coeff Vol (CV)</th>
                </tr>
              </thead>
              <tbody>
                {trendsList.map((t, idx) => {
                  const isPositive = t.sensSlopeMmYear > 0;
                  const intensity = Math.min(100, Math.abs(t.sensSlopeMmYear) * 10);
                  return (
                    <tr key={idx} className="border-b border-slate-200/50 last:border-0 hover:bg-white/40">
                      <td className="py-2.5 font-sans font-medium text-slate-700">{t.period}</td>
                      <td className="py-2.5 text-right text-slate-800 font-bold">{t.avgRainfall} mm</td>
                      <td className="py-2.5 flex items-center justify-end gap-2">
                        <span className={`font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isPositive ? '+' : ''}{t.sensSlopeMmYear}
                        </span>
                        <div className="w-12 h-2 bg-slate-200 rounded-full flex overflow-hidden">
                          {isPositive ? (
                            <div className="w-1/2 flex justify-end">
                                <div style={{width: `${intensity}%`}} className="bg-emerald-500 h-full rounded-r-full" />
                            </div>
                          ) : (
                            <div className="w-full flex">
                                <div className="w-1/2" />
                                <div style={{width: `${intensity}%`}} className="bg-rose-500 h-full rounded-l-full" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 text-right">{t.coefficientOfVariationPct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Slide summaries card */}
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 font-sans space-y-4">
        <span className="text-[9.5px] text-slate-400 font-bold tracking-wider uppercase flex items-center gap-1">
          <MapPin className="w-4 h-4 text-rose-400" /> Executive Slide-Ready Briefing Metrics
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 text-center sm:text-left text-xs font-mono">
          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block mb-1">Catchment Area</span>
            <span className="text-lg font-bold text-white block">{totalAreaM2.toLocaleString()} m²</span>
            <span className="text-[9.5px] text-slate-500 font-sans mt-0.5 block">Full bento layout footprint</span>
          </div>
          
          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block mb-1">Watershed Coeff [C]</span>
            <span className="text-lg font-bold text-indigo-300 block">{weightedC} C</span>
            <span className="text-[9.5px] text-slate-500 font-sans mt-0.5 block">Precipitation runoff speed</span>
          </div>

          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-sans block mb-1">Sustainable Autonomy</span>
            <span className="text-lg font-bold text-emerald-400 block">{waterSecurityDays} Days</span>
            <span className="text-[9.5px] text-slate-500 font-sans mt-0.5 block">Zero third-party grid dependence</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 leading-normal font-sans text-center sm:text-left pt-1.5 italic">
          * This summary compiles the calculations requested by the {activeSiteName} water directive. Press the "Print brief" button above to output a physical copy for regional stakeholders.
        </p>
      </div>

    </div>
  );
}
