/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { WaterBalanceResult } from '../types';
import { ShieldCheck, ShieldAlert, AlertTriangle, ToggleLeft, ToggleRight, Info, Droplets } from 'lucide-react';
import ToolTip from './ToolTip';

interface WaterBalanceCardProps {
  waterBalance: WaterBalanceResult;
  greywaterRecovery: boolean;
  setGreywaterRecovery: (val: boolean) => void;
  annualRainfallMm: number;
}

export default function WaterBalanceCard({
  waterBalance,
  greywaterRecovery,
  setGreywaterRecovery,
  annualRainfallMm
}: WaterBalanceCardProps) {
  const [showStressDetails, setShowStressDetails] = useState(false);

  // Map severity styles
  const severityStyles = {
    'High': 'bg-rose-50 border-rose-200 text-rose-800 icon-rose-500',
    'Medium': 'bg-amber-50 border-amber-200 text-amber-800 icon-amber-500',
    'Low': 'bg-blue-50 border-blue-200 text-blue-800 icon-blue-500'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="water-balance-view">
      
      {/* Header section with toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Module 5: Water Balance Simulator
          </span>
          <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Catchment Security & Stress Map</h2>
          <p className="text-sm text-slate-500 mt-1">
            Reconciles annual rainfall supply against domestic abstractions, detailing storage depletion rates.
          </p>
        </div>

        {/* Greywater closed loop toggle */}
        <div className="flex items-center gap-3 bg-indigo-50/60 border border-indigo-100 rounded-xl px-4 py-2 shrink-0">
          <div className="text-xs">
            <span className="font-bold text-indigo-900 block font-sans">Closed-Loop Recovery</span>
            <span className="text-[10px] text-indigo-600 font-sans block">Recycles 70% Bathing/Wash greywater</span>
          </div>
          <button 
            onClick={() => setGreywaterRecovery(!greywaterRecovery)}
            className="text-indigo-600 transition-all focus:outline-none"
          >
            {greywaterRecovery ? (
              <ToggleRight className="w-10 h-10 text-indigo-600" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Self sufficiency scorecard */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
          {/* Ambient background glow */}
          <div className="absolute right-0 bottom-0 w-28 h-28 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
          
          <div>
            <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase font-sans">Calculated Water Autonomy</span>
            <div className="text-[64px] font-extrabold text-white leading-none font-mono my-3 flex items-baseline">
              {waterBalance.waterSecurityDays}
              <span className="text-lg font-sans font-semibold text-indigo-300 ml-1">Days</span>
            </div>
            <p className="text-xs text-indigo-100 font-sans leading-relaxed">
              Based on surface pond volumes and safe localized groundwater draft recharge fractions.
            </p>
          </div>

          <div className="border-t border-indigo-800/80 pt-4 mt-6">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${waterBalance.waterSecurityDays >= 120 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {waterBalance.waterSecurityDays >= 120 ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              </div>
              <span className="text-[11px] text-slate-200 font-sans">
                {waterBalance.waterSecurityDays >= 180 ? 'Optimal Self-sufficiency' : 'Sub-optimal dry season exposure'}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Inflow/Outflow table */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
            <Droplets className="w-4.5 h-4.5 text-indigo-500" />
            Annual Partitioning (ML)
          </h3>

          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 font-sans font-medium flex items-center gap-1">Inflow Rainfall: <ToolTip content="Total precipitation volume hitting the catchment area over an active wet year." /></span>
              <span className="font-bold text-slate-800 text-sm">{(annualRainfallMm).toFixed(0)} mm ({waterBalance.annualRainfallMl} ML)</span>
            </div>
            <div className="flex justify-between items-center text-amber-600 border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-500 font-sans font-medium flex items-center gap-1">Surface Storm Runoff: <ToolTip content="Water lost to surface pathways, governed by the rational runoff coefficient (C)." /></span>
              <span className="font-bold">-{waterBalance.runoffMl} ML</span>
            </div>
            <div className="flex justify-between items-center text-teal-600 border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-500 font-sans font-medium flex items-center gap-1">Recharged to Deep Aquifer: <ToolTip content="Amount safely reaching the saturated zone, buffered by structures and soil infiltration rates." /></span>
              <span className="font-bold">+{waterBalance.rechargeMl} ML</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 border-b border-slate-200/60 pb-1.5">
              <span className="text-slate-400 font-sans font-medium flex items-center gap-1">Evapotranspiration Net loss: <ToolTip content="Combined process of evaporation from soil/ponds and plant transpiration." /></span>
              <span className="font-bold">-{waterBalance.evapotranspirationMl} ML</span>
            </div>
            <div className="flex justify-between items-center text-indigo-600 pt-0.5">
              <span className="text-slate-500 font-sans font-medium font-bold flex items-center gap-1">Planned Annual Draft: <ToolTip content="Expected human and structural extraction from the closed groundwater system." /></span>
              <span className="font-bold">{waterBalance.annualDemandMl} ML</span>
            </div>
          </div>
        </div>

        {/* Column 3: Drought stress / Dry season metrics */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
              <AlertTriangle className="w-4.5 h-4.5 text-indigo-500" />
              Dry Period Stress Detail
            </h3>
            <button 
              onClick={() => setShowStressDetails(!showStressDetails)}
              className="text-[10.5px] font-bold text-indigo-600 hover:underline hover:text-indigo-800 focus:outline-none font-sans"
            >
              {showStressDetails ? 'Hide' : 'Expand'}
            </button>
          </div>

          <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 text-xs font-sans h-[164px] flex flex-col justify-between">
            {showStressDetails ? (
              <div className="space-y-2 font-mono text-[11px] leading-normal text-slate-600">
                <div className="flex justify-between">
                  <span>Dry season duration:</span>
                  <span className="font-bold text-slate-700">{waterBalance.dryPeriodStress.durationDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span>Available local supply:</span>
                  <span className="font-bold text-indigo-600">{waterBalance.dryPeriodStress.waterAvailableMl} ML</span>
                </div>
                <div className="flex justify-between">
                  <span>Sump Storage depletion:</span>
                  <span className="font-bold text-rose-500">{waterBalance.dryPeriodStress.depletionRatePct}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Unmet Deficit Gap:</span>
                  <span className={`font-bold ${waterBalance.dryPeriodStress.rechargeGapMl > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{waterBalance.dryPeriodStress.rechargeGapMl} ML</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 leading-relaxed text-[11.5px] pt-1.5">
                The dry season (average 142 days) initiates severe stress as open pond storage suffers evapotranspiration losses. Closed-loop greywater purification acts as the premier structural buffer.
              </p>
            )}

            <div className="bg-indigo-50 border border-indigo-100/60 rounded-xl p-2 px-3 text-[10.5px] text-indigo-800 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Greywater reduces domestic borewell draft by up to 35%!</span>
            </div>
          </div>
        </div>

      </div>

      {/* Active warnings and safeguards banners */}
      {waterBalance.riskFlags.length > 0 && (
        <div className="mt-5 space-y-2">
          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Active Risk Flags & Security Advisories</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {waterBalance.riskFlags.map((risk, idx) => (
              <div 
                key={idx} 
                className={`border rounded-xl p-3 px-4 flex items-start gap-3 text-xs leading-relaxed font-sans ${severityStyles[risk.severity]}`}
              >
                <div className="shrink-0 p-1 bg-white/60 text-inherit rounded-md border border-slate-100 shadow-sm flex items-center justify-center mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div>
                  <strong className="font-bold block text-[11px] mb-0.5">{risk.type} Alert ({risk.severity} Severity)</strong>
                  <p className="text-[10.5px] opacity-90 leading-normal">{risk.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
