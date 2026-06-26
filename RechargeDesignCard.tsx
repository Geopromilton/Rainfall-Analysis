/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RechargeStructureDesign } from '../types';
import { Layers, HelpCircle, HardHat, ShieldAlert, Zap } from 'lucide-react';

interface RechargeDesignCardProps {
  designs: RechargeStructureDesign[];
  weightedC: number;
}

export default function RechargeDesignCard({
  designs,
  weightedC
}: RechargeDesignCardProps) {
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="recharge-infrastructure-view">
      
      {/* Module Title */}
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full">
          Module 6 & 7: Infrastructure & Runoff Analysis
        </span>
        <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Rainwater Harvesting Recharge Structures</h2>
        <p className="text-sm text-slate-500 mt-1">
          Custom mechanical dimension guidelines to capture surface runoff, boosting localized groundwater pressure.
        </p>
      </div>

      {/* Grid of structure proposal cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {designs.map((design, idx) => (
          <div key={idx} className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex flex-col justify-between hover:border-teal-200 transition-all">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-[13px] font-bold text-slate-800 font-sans">{design.structureType}</h3>
                <span className="text-[10px] bg-teal-100/60 text-teal-800 font-bold font-sans px-2 py-0.5 rounded-full whitespace-nowrap">
                  Qty: {design.countNeeded} units
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 font-mono leading-normal">{design.dimensionsDescription}</p>
              <p className="text-[11px] text-slate-500 font-sans leading-relaxed">{design.designSuitabilityNotes}</p>
            </div>

            <div className="border-t border-slate-200/60 pt-3.5 mt-4 flex justify-between items-center text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Water diverted</span>
                <span className="text-[11.5px] font-bold text-slate-700">{(design.totalInflowLitresPerYear).toLocaleString()} L/yr</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-sans">Est. Net Recharge</span>
                <span className="text-sm font-extrabold text-teal-600 block">{design.totalRechargedKlPerYear} KL/year</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Runoff Coefficient warning & design guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        <div className="bg-teal-50 border border-teal-100 text-teal-800 rounded-xl p-4 flex gap-3">
          <Zap className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs font-sans">
            <strong className="font-bold text-[11px] block">Wet Period Optimization</strong>
            <p className="text-[10.5px] leading-normal opacity-90">
              Structures are calibrated to intercept rainfall during intensive consecutive wet spells (up to 12 days continuous precipitation events), preventing farm pond silt overflowing.
            </p>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 rounded-xl p-4 flex gap-3">
          <HardHat className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs font-sans">
            <strong className="font-bold text-[11px] block">Borewell Rejuvenation Link</strong>
            <p className="text-[10.5px] leading-normal opacity-90">
              Integrating gravity siphon filters into deep dry exploration wells allows water to bypass tight dry saprolite columns, returning aquifer pressures to equilibrium.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-between">
          <div className="text-xs font-sans space-y-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-teal-400" /> Runoff Coefficients Summary
            </span>
            <p className="text-[10px] text-slate-300 leading-normal pt-1.5 font-sans">
              Rational formula peak storm runoffs are highly influenced by layout imperviousness. Your village C-factor:
            </p>
          </div>
          <div className="flex justify-between items-center mt-3 font-mono border-t border-slate-800 pt-2 text-xs">
            <span className="text-slate-400">Weighted Factor [C]:</span>
            <span className="text-[13px] font-extrabold text-teal-400">{weightedC}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
