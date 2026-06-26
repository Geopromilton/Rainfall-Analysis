/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HRUAreaInput } from '../types';
import { Sliders, HelpCircle, Layers, Compass, Trees } from 'lucide-react';

interface HRUConfigCardProps {
  areas: HRUAreaInput;
  setAreas: React.Dispatch<React.SetStateAction<HRUAreaInput>>;
  slopeClass: 'flat' | 'moderate' | 'steep';
  setSlopeClass: (val: 'flat' | 'moderate' | 'steep') => void;
  soilClass: 'clayey' | 'loamy' | 'sandy';
  setSoilClass: (val: 'clayey' | 'loamy' | 'sandy') => void;
  landUseClass: 'forest_shrub' | 'cropland_permaculture' | 'built_up';
  setLandUseClass: (val: 'forest_shrub' | 'cropland_permaculture' | 'built_up') => void;
  hruBreakdown: {
    type: string;
    label: string;
    areaM2: number;
    areaHa: number;
    areaPct: number;
    cValue: number;
    infiltrationRateMmHr: number;
    rechargeFractionPct: number;
    annualRunoffMl: number;
    annualRechargeMl: number;
  }[];
  weightedC: number;
  weightedInf: number;
  totalAreaM2: number;
  totalAreaHa: number;
}

export default function HRUConfigCard({
  areas,
  setAreas,
  slopeClass,
  setSlopeClass,
  soilClass,
  setSoilClass,
  landUseClass,
  setLandUseClass,
  hruBreakdown,
  weightedC,
  weightedInf,
  totalAreaM2,
  totalAreaHa
}: HRUConfigCardProps) {

  // Update a single HRU area value
  const handleAreaChange = (key: keyof HRUAreaInput, value: number) => {
    setAreas(prev => ({
      ...prev,
      [key]: Math.max(0, value)
    }));
  };

  const hruHelps: Record<string, string> = {
    residentialPlot: 'Aggregate area of domestic blocks and residential garden borders.',
    buildingFootprint: 'Total impermeable concrete rooftop area (primary rainwater harvesting capture).',
    roadPaved: 'Impervious paved lanes. Generates fast surface runoff requiring swale capture.',
    permacultureZone: 'Pervious organic orchard/nursery area. Acts as an excellent infiltration zone.',
    openGreenSpace: 'Grassy common play plots. Absorbs direct rainfall, moderate infiltration.',
    waterBodyPond: 'Dugout pond or buffer pond. Direct rain catchment, slow natural bottom percolation.',
    rechargeStructure: 'Dedicated aggregate bioswales, contour bund areas, or recharge pit filter basins.'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="hru-analysis-view">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
          Module 2: Hydrologic Response Units (HRU)
        </span>
        <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Catchment Characteristics</h2>
        <p className="text-sm text-slate-500 mt-1">
          Tune the size of each hydrologic response unit and environmental factors to simulate catchment response.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Inputs: Sliders/Inputs for m2 */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2 font-sans">
            <Sliders className="w-4.5 h-4.5 text-emerald-500" />
            1. Sector Footprints (m²)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hruBreakdown.map((item) => (
              <div key={item.type} className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 relative group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-bold text-slate-700 font-sans">{item.label}</label>
                    <div className="relative group/tooltip">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-300 cursor-help" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/tooltip:block w-48 bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg z-20 font-sans leading-normal">
                        {hruHelps[item.type]}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100/60 text-emerald-800 font-mono font-bold px-1.5 py-0.5 rounded">
                    {item.areaPct}% of total
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={areas[item.type as keyof HRUAreaInput]}
                    onChange={(e) => handleAreaChange(item.type as keyof HRUAreaInput, Number(e.target.value))}
                    min={0}
                  />
                  <span className="text-xs text-slate-400 font-medium">m²</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-100/60 flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 font-sans uppercase tracking-wider block">Total Project Footprint Area</span>
              <span className="text-lg font-extrabold text-slate-800 font-mono mt-0.5 block">{totalAreaM2.toLocaleString()} m² ({totalAreaHa} ha)</span>
            </div>
            <div className="text-[10px] text-emerald-700 max-w-sm font-sans leading-relaxed">
              *Adjusting these structures changes the core runoff coefficients, enabling dynamic simulation of conservation design impacts.
            </div>
          </div>
        </div>

        {/* Right side: Slope, Soil and Land Use select boxes */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 font-sans">
            <Compass className="w-4.5 h-4.5 text-teal-500" />
            2. Catchment Conditions
          </h3>

          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 space-y-4">
            {/* Slope */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 font-sans flex items-center gap-1">
                Slope Class (NASA DEM)
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                {(['flat', 'moderate', 'steep'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSlopeClass(s)}
                    className={`text-[10px] font-bold capitalize py-1.5 rounded-md transition-all ${slopeClass === s ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Soil */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 font-sans flex items-center gap-1">
                Soil Profile (SoilGrids)
              </label>
              <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-lg border border-slate-200">
                {(['clayey', 'loamy', 'sandy'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSoilClass(s)}
                    className={`text-[10px] font-bold capitalize py-1.5 rounded-md transition-all ${soilClass === s ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Land Use */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 font-sans">
                ESA WorldCover Land Use
              </label>
              <select
                className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                value={landUseClass}
                onChange={(e) => setLandUseClass(e.target.value as any)}
              >
                <option value="forest_shrub">ESA Native Forest & Shrub cover</option>
                <option value="cropland_permaculture">Active Cropland / Permaculture system</option>
                <option value="built_up">High density built-up footprint</option>
              </select>
            </div>
          </div>

          {/* HRU Aggregation Table */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 font-sans">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Calculated Runoff Properties
            </h4>
            
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Weighted Coeff C:</span>
                <span className="font-bold text-emerald-400 text-sm">{weightedC}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="text-slate-400">Mean Infiltration:</span>
                <span className="font-bold text-emerald-400 text-sm">{weightedInf} mm/hr</span>
              </div>
              <div className="flex justify-between pb-0.5">
                <span className="text-slate-400">Runoff Yield Rate:</span>
                <span className={`font-bold text-sm ${weightedC > 0.45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {weightedC > 0.45 ? 'High (Flashy)' : 'Low (Slow percolation)'}
                </span>
              </div>
            </div>

            <p className="text-[9.5px] text-slate-400 leading-normal font-sans pt-1">
              *Steeper slopes and clayey profiles automatically swell the calculated runoff coefficient (C), necessitating immediate swale design modifications.
            </p>
          </div>
        </div>

      </div>

      {/* Breakdown metrics list */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-[10px] uppercase tracking-wider">
              <th className="px-4 py-2.5">Sector Type</th>
              <th className="px-4 py-2.5 text-right">Coefficient (C)</th>
              <th className="px-4 py-2.5 text-right font-sans">Infilt. Rate (mm/hr)</th>
              <th className="px-4 py-2.5 text-right font-sans">Recharge Share (%)</th>
              <th className="px-4 py-2.5 text-right font-sans">Annual Est. Runoff (ML)</th>
              <th className="px-4 py-2.5 text-right font-sans">Annual Recharge Draft (ML)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 font-mono">
            {hruBreakdown.map((row) => (
              <tr key={row.type} className="hover:bg-slate-50/50">
                <td className="px-4 py-2.5 font-sans font-medium text-slate-800">{row.label}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-slate-700">{row.cValue}</td>
                <td className="px-4 py-2.5 text-right">{row.infiltrationRateMmHr}</td>
                <td className="px-4 py-2.5 text-right">{row.rechargeFractionPct}%</td>
                <td className="px-4 py-2.5 text-right text-amber-600 font-semibold">{row.annualRunoffMl} ML</td>
                <td className="px-4 py-2.5 text-right text-emerald-600 font-semibold">{row.annualRechargeMl} ML</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
