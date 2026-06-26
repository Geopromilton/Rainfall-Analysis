/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MLGroundwaterPrediction } from '../types';
import { BrainCircuit, Sliders, Info, Zap } from 'lucide-react';

interface MLPredictionCardProps {
  prediction: MLGroundwaterPrediction;
}

export default function MLPredictionCard({
  prediction
}: MLPredictionCardProps) {
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="ml-prediction-view">
      
      {/* Title */}
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
          Module 8: ML-Based Predictive Analytics
        </span>
        <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Machine Learning Aquifer Forecast (v1)</h2>
        <p className="text-sm text-slate-500 mt-1">
          Surrogate Random Forest regression model estimating static column depth, calibrated on local CGWB monitoring well logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Core ML Output Card */}
        <div className="bg-gradient-to-tr from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
          {/* Accent glow */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
          
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-purple-300 font-bold tracking-wider uppercase font-sans">Predicted Static Level</span>
              <div className="text-5xl font-extrabold font-mono text-white mt-1 relative flex items-baseline">
                {prediction.predictedWaterTableDepthM}
                <span className="text-lg font-sans font-semibold text-purple-300 ml-1">meters</span>
              </div>
              <span className="text-[10px] text-slate-300 font-sans block mt-1">Below Ground Level (mbgl)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-purple-800/60 pt-4 font-sans">
              <div>
                <span className="text-purple-300 text-[10px] block uppercase font-bold tracking-wider">Potential Rating</span>
                <span className="font-extrabold text-white text-[12.5px] mt-0.5 block">{prediction.groundwaterPotentialClass}</span>
              </div>
              <div>
                <span className="text-purple-300 text-[10px] block uppercase font-bold tracking-wider">Est. Max Yield</span>
                <span className="font-extrabold text-cyan-400 text-[12.5px] mt-0.5 block">{prediction.borewellBestYieldEstLps} lps</span>
              </div>
            </div>
          </div>

          <div className="border-t border-purple-800/40 pt-3.5 mt-6 flex items-center justify-between">
            <span className="text-[9.5px] text-slate-400 font-sans">Confidence variance: ±12.4%</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-300 font-sans">
              <BrainCircuit className="w-4 h-4 text-purple-300" />
              <span>RF Model v1.2</span>
            </div>
          </div>
        </div>

        {/* Column 2 & 3: SHAP Interpretability Bar chart list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
            <Sliders className="w-4.5 h-4.5 text-purple-500" />
            Model Feature Attribution (SHAP Values Interpretability)
          </h3>

          <div className="space-y-3.5 bg-slate-50 border border-slate-100 rounded-2xl p-4.5">
            <span className="text-[9.5px] text-slate-400 uppercase tracking-wider font-bold block font-sans">Quantifying variable impact on predicted water table depth:</span>
            
            <div className="space-y-3 font-sans">
              {prediction.shapContributions.map((shap, idx) => {
                const maxAttribution = 15; // normalize sizing
                const pct = Math.min(100, Math.round((Math.abs(shap.impactMeters) / maxAttribution) * 100));
                
                // impactMeters is negative (draws level UP, shallow, positive effect) vs positive (makes deeper, negative effect)
                const isBeneficial = shap.impactMeters <= 0; // Negative depth = closer to surface (+)
                
                return (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-700">{shap.featureName}</span>
                      <span className={`font-mono font-bold ${isBeneficial ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {shap.impactMeters > 0 ? '+' : ''}{shap.impactMeters} mbgl
                      </span>
                    </div>

                    {/* Bar visualization */}
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                      {isBeneficial ? (
                        <div className="w-1/2 flex justify-end">
                          <div 
                            style={{ width: `${pct}%` }} 
                            className="bg-emerald-500 h-2.5 rounded-l-full transition-all duration-300"
                            title="Brings table shallower"
                          />
                        </div>
                      ) : (
                        <div className="w-full flex">
                          <div className="w-1/2" /> {/* alignment spacer */}
                          <div 
                            style={{ width: `${pct}%` }} 
                            className="bg-rose-500 h-2.5 rounded-r-full transition-all duration-200"
                            title="Pulls table deeper"
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-[9.5px] text-slate-400 block leading-normal">{shap.description}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-[10px] text-purple-900 flex items-start gap-2 leading-relaxed">
              <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>SHAP Reading Note:</strong> Green bars pointing left denote favorable factors pulling the aquifers level up (bringing static level closer to bottom turf surface boundaries). Red bars indicate negative drainage factors.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
