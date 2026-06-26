/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HydrogeologyResult } from '../types';
import { Compass, Info, Upload, Check, AlertCircle } from 'lucide-react';

interface HydrogeologyCardProps {
  hydrogeology: HydrogeologyResult;
  lithologyClass: 'hardrock' | 'sedimentary';
  setLithologyClass: (val: 'hardrock' | 'sedimentary') => void;
  depthToWaterTableM: number;
  setDepthToWaterTableM: (val: number) => void;
  setVesCSV: (val: string) => void;
  siteName?: string;
}

export default function HydrogeologyCard({
  hydrogeology,
  lithologyClass,
  setLithologyClass,
  depthToWaterTableM,
  setDepthToWaterTableM,
  setVesCSV,
  siteName
}: HydrogeologyCardProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const activeSiteName = siteName || 'Vijayanagar';

  // soundings CSV template
  const loadSoundingTemplate = () => {
    const template = `Array_Spacing_AB2_m,Apparent_Resistivity_Ohm_m\n1.5,150\n3.0,112\n6.0,85\n12.0,34\n24.0,22\n45.0,260\n70.0,850`;
    setVesCSV(template);
    setFileName(`${activeSiteName.toLowerCase().replace(/\s+/g, '_')}_profile_sounding_ves1.csv`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setVesCSV(evt.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setVesCSV(evt.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="hydrogeology-view">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
          Module 4: Hydrogeological Profile
        </span>
        <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Aquifer & Resistivity Analysis</h2>
        <p className="text-sm text-slate-500 mt-1">
          Deccan Crystalline Shield parameters for fracture zones, lithology limits, and Schlumberger VES resistivity layers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1: Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
            <Compass className="w-4.5 h-4.5 text-amber-500" />
            1. Subsurface Parameters
          </h3>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4">
            {/* Lithology */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 font-sans">Lithology Class</label>
              <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-lg border border-slate-100">
                <button
                  onClick={() => setLithologyClass('hardrock')}
                  className={`text-[11px] font-bold py-1.5 rounded transition-all ${lithologyClass === 'hardrock' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Hardrock (Peninsular)
                </button>
                <button
                  onClick={() => setLithologyClass('sedimentary')}
                  className={`text-[11px] font-bold py-1.5 rounded transition-all ${lithologyClass === 'sedimentary' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  Sedimentary (Alluvial)
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-1">
                {lithologyClass === 'hardrock' 
                  ? 'Granite-gneisses of Archaean Deccan Plateau. Storage lies only in narrow shear fractures.'
                  : 'Sand, silt, gravel river systems. Higher porosity and uniform regional hydrology.'
                }
              </p>
            </div>

            {/* Depth to Water Table */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs text-slate-600 font-sans">
                <span className="font-bold">Water Table Static depth</span>
                <span className="font-mono font-bold text-slate-800">{depthToWaterTableM} m</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={2}
                  max={60}
                  step={0.5}
                  className="w-full accent-amber-600"
                  value={depthToWaterTableM}
                  onChange={(e) => setDepthToWaterTableM(Number(e.target.value))}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                <span>Shallow (2m)</span>
                <span>Deep (60m)</span>
              </div>
            </div>

            {/* Qualitative indicators */}
            <div className="border-t border-slate-200/60 pt-3 space-y-2 text-xs font-sans">
              <div className="flex justify-between">
                <span className="text-slate-500">Fracture Likelihood:</span>
                <span className="font-semibold text-slate-800">{hydrogeology.fractureZoneLikelihood}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recharge Suitability:</span>
                <span className="font-semibold text-emerald-600">{hydrogeology.rechargePotentialRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Yield:</span>
                <span className="font-semibold text-teal-600">{hydrogeology.borewellYieldClass}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Schlumberger Sounding Profile (VES Upload) */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
            <Upload className="w-4 h-4 text-amber-500" />
            2. Vertical Electrical Sounding (VES)
          </h3>

          <div className="space-y-3">
            {/* Drag & Drop File Container */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col justify-center h-[142px] ${dragActive ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'}`}
            >
              <input 
                type="file" 
                id="ves-upload" 
                className="hidden" 
                accept=".csv"
                onChange={handleFileUpload}
              />
              <label htmlFor="ves-upload" className="cursor-pointer space-y-2 font-sans text-xs">
                {fileName ? (
                  <div className="text-slate-700 flex flex-col items-center gap-1">
                    <Check className="w-6 h-6 text-emerald-500" />
                    <span className="font-bold block text-[11px] max-w-xs truncate">{fileName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Parsed Sounding layers successfully</span>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-slate-500">
                    <Upload className="w-5 h-5 mx-auto text-slate-400" />
                    <span className="font-semibold text-slate-700 block text-[11px]">Upload Sounding VES CSV</span>
                    <span className="text-[10px] block text-slate-400">Drag & drop or Click to browse</span>
                  </div>
                )}
              </label>
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <button 
                onClick={loadSoundingTemplate}
                className="text-[10.5px] font-bold text-amber-700 bg-amber-50 border border-amber-100/60 rounded-lg px-2.5 py-1.5 hover:bg-amber-100 transition-all font-sans"
              >
                Load {activeSiteName} Sounding Template
              </button>
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-sans">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Format: AB/2, Apparent_Resistivity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Sounding Layers Geological Output */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 font-sans">
            <Info className="w-4 h-4 text-amber-500" />
            3. Interpreted Layer Hydro-Stratigraphy
          </h3>

          <div className="bg-slate-900 rounded-2xl p-4 text-white overflow-y-auto max-h-[216px] space-y-2 scrollbar-thin">
            <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase font-sans">Depth-Resistivity Stratigraphy</span>
            
            <div className="space-y-2">
              {hydrogeology.vesInterpretedLayers?.map((layer, idx) => (
                <div key={idx} className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/40 text-[10.5px]">
                  <div className="flex justify-between items-center mb-1 font-mono">
                    <span className="font-bold text-amber-400">Est. Depth: {layer.depthM} m</span>
                    <span className="text-[10px] text-slate-300">Res: {layer.resistivityOhmM} Ωm</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-normal font-sans">{layer.aquiferPotential}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Aquifer writeup */}
      <div className="mt-5 bg-amber-50/40 rounded-xl p-4 border border-amber-100/60 flex gap-3.5">
        <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 flex items-center">
          <Compass className="w-5 h-5 text-amber-700" />
        </div>
        <div className="text-xs text-amber-900 leading-relaxed font-sans">
          <strong>{activeSiteName} Hydrogeology Block:</strong> {hydrogeology.aquiferResponseDescription}
        </div>
      </div>

    </div>
  );
}
