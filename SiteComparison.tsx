import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { MapPin, Droplet, ArrowRight, Gauge, Activity, Waves } from 'lucide-react';
import {
  generateHistoricRainfall,
  executeRainfallAnalysis,
  executeHRUAnalysis,
  executeWaterDemand,
  executeWaterBalance
} from '../utils/calculations';
import { HRUAreaInput } from '../types';

interface SavedLoc {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

interface SiteComparisonProps {
  locations: SavedLoc[];
  hruAreas: HRUAreaInput;
  slopeClass: any;
  soilClass: any;
  landUseClass: any;
  demandStandard: any;
  demandCategory: string;
  numberOfPlots: number;
  climateMode: string;
  customRainfallFile: string | null;
}

export default function SiteComparison({
  locations,
  hruAreas,
  slopeClass,
  soilClass,
  landUseClass,
  demandStandard,
  demandCategory,
  numberOfPlots,
  climateMode,
  customRainfallFile
}: SiteComparisonProps) {
  
  const comparisonData = useMemo(() => {
    return locations.map(loc => {
      let series = generateHistoricRainfall(loc.lat, loc.lng);
      
      if (customRainfallFile) {
          series = series.map((val, idx) => {
              const seed = (loc.lat * loc.lng * (idx + 1)) % 1;
              const factor = 0.85 + (seed * 0.3); // deterministic perturbation
              return Number((val * factor).toFixed(1));
          });
      }

      if (climateMode === 'Extremes-Dry') {
        series = series.map(r => parseFloat((r * 0.72).toFixed(1)));
      } else if (climateMode === 'Extremes-Wet') {
        series = series.map(r => parseFloat((r * 1.28).toFixed(1)));
      }
      
      const analysis = executeRainfallAnalysis(series);
      const avgRainfall = analysis.trends[0].avgRainfall;
      const currentYearRainfall = series[series.length - 1]; // Approximation
      
      const hruResult = executeHRUAnalysis(hruAreas, slopeClass, soilClass, landUseClass);
      const demandResult = executeWaterDemand(demandStandard, demandCategory, numberOfPlots);
      const balance = executeWaterBalance(hruResult, demandResult, avgRainfall); // Using avg instead of current year for generic comparison
      
      return {
        id: loc.id,
        name: loc.name,
        avgRainfall: avgRainfall,
        surplusDeficit: balance.annualBalanceM3,
        runoffPotential: balance.totalRunoffM3,
        rechargePotential: balance.totalRechargeM3,
        demand: balance.demandM3
      };
    });
  }, [locations, hruAreas, slopeClass, soilClass, landUseClass, demandStandard, demandCategory, numberOfPlots, climateMode, customRainfallFile]);

  if (locations.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
        <MapPin className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-800 font-sans mb-2">Not Enough Sites</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Add at least one more location using the <b className="text-slate-700">+</b> button in the top navigation bar to unlock site comparison features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-800 font-sans">Multi-Site Water Balance Overview</h3>
        </div>
        
        <div className="overflow-hidden border border-slate-200 rounded-xl">
          <table className="w-full text-left text-sm text-slate-600 font-sans">
            <thead className="bg-slate-50 text-slate-800 uppercase text-xs font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Site Name</th>
                <th className="px-4 py-3 text-right">Avg Rainfall (mm/yr)</th>
                <th className="px-4 py-3 text-right">Runoff Vol (m³)</th>
                <th className="px-4 py-3 text-right">Recharge Vol (m³)</th>
                <th className="px-4 py-3 text-right">Resource Balance (m³)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonData.map(data => (
                <tr key={data.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{data.name}</td>
                  <td className="px-4 py-3 text-right font-mono">{data.avgRainfall.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-cyan-600">{Math.round(data.runoffPotential).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-teal-600">{Math.round(data.rechargePotential).toLocaleString()}</td>
                  <td className={`px-4 py-3 text-right font-mono font-bold ${data.surplusDeficit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {data.surplusDeficit > 0 ? '+' : ''}{Math.round(data.surplusDeficit).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Waves className="w-5 h-5 text-cyan-600" />
            <h3 className="font-bold text-sm text-slate-800 font-sans">Hydrological Potential Output</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={45} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${Math.round(value).toLocaleString()} m³`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="runoffPotential" name="Surface Runoff" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rechargePotential" name="Groundwater Recharge" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-800 font-sans">Net Water Balance Status</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} width={45} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${Math.round(value).toLocaleString()} m³`, 'Balance']}
                />
                <Bar dataKey="surplusDeficit" name="Resource Balance" radius={[4, 4, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.surplusDeficit >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-slate-500 text-center mt-2 font-medium">Positive values indicate surplus, negative indicates deficit.</p>
        </div>
      </div>
    </div>
  );
}
