import React, { useMemo } from 'react';
import { SeasonalSummary } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Sun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';

interface SeasonalRainfallCardProps {
  seasonalSplit: SeasonalSummary;
  siteName: string;
}

export default function SeasonalRainfallCard({ seasonalSplit, siteName }: SeasonalRainfallCardProps) {
  const seasonalChartData = useMemo(() => [
    { name: 'Summer (Mar-May)', mm: seasonalSplit.summerMm, color: '#f59e0b', icon: Sun },
    { name: 'SW Monsoon (Jun-Sep)', mm: seasonalSplit.monsoonMm, color: '#0ea5e9', icon: CloudRain },
    { name: 'NE Monsoon (Oct-Dec)', mm: seasonalSplit.postMonsoonMm, color: '#6366f1', icon: CloudLightning },
    { name: 'Winter (Jan-Feb)', mm: seasonalSplit.winterMm, color: '#94a3b8', icon: Snowflake }
  ], [seasonalSplit]);

  const total = seasonalSplit.summerMm + seasonalSplit.monsoonMm + seasonalSplit.postMonsoonMm + seasonalSplit.winterMm;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          Module 1b: Seasonal Distribution
        </span>
        <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Rainfall Seasonality (Monsoons)</h2>
        <p className="text-sm text-slate-500 mt-1">
          Average precipitation split across distinct climate periods for {siteName || 'the site'}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Graph */}
        <div className="h-[260px] bg-slate-50 rounded-xl p-4 border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seasonalChartData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" fontSize={10} style={{ fill: '#64748b' }} tickFormatter={(val) => `${val} mm`} />
              <YAxis dataKey="name" type="category" fontSize={10} width={120} tickLine={false} style={{ fill: '#64748b' }} fontWeight={500} />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ fontSize: '11px', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                formatter={(value: number) => [`${value} mm`, 'Rainfall']}
              />
              <Bar dataKey="mm" radius={[0, 4, 4, 0]} barSize={20}>
                {seasonalChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {seasonalChartData.map((season, i) => {
            const Icon = season.icon;
            const pct = total > 0 ? Math.round((season.mm / total) * 100) : 0;
            return (
              <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col justify-between hover:bg-white transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100">
                    <Icon className="w-4 h-4" style={{ color: season.color }} />
                  </div>
                  <span className="text-xl font-bold font-mono text-slate-800">{season.mm} <span className="text-[10px] text-slate-400 font-sans uppercase">mm</span></span>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">{season.name}</h4>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: season.color }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 font-mono w-6 text-right">{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
