/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, FileCode, CheckCircle2, HelpCircle, Archive, AlertCircle, Info, RefreshCw } from 'lucide-react';
import ToolTip from './ToolTip';

interface IMDSourceStatusProps {
  customFileName: string | null;
  regionalCompositeIndex?: { mean: number, filesProcessed: number } | null;
  latitude: number;
  longitude: number;
  avgRainfall: number;
  onClear: () => void;
}

export default function IMDSourceStatus({
  customFileName,
  regionalCompositeIndex,
  latitude,
  longitude,
  avgRainfall,
  onClear
}: IMDSourceStatusProps) {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-sm text-slate-800 font-sans flex items-center gap-1.5">
            IMD Climatology Data Source 
            <ToolTip content="Specifies whether the rainfall time series is being drawn from the default IMD gridded dataset or your uploaded NetCDF files." />
          </h3>
        </div>
        {customFileName ? (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Custom Data Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">
            <Info className="w-3.5 h-3.5" />
            Standard Baseline Active
          </span>
        )}
      </div>

      {customFileName ? (
        <div className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-100/70 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
              {customFileName.toLowerCase().endsWith('.zip') ? (
                <Archive className="w-5 h-5" />
              ) : (
                <FileCode className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-800 font-sans">
                Successfully Loaded Custom IMD Archives
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Active Source: <code className="bg-emerald-100/50 px-1.5 py-0.5 rounded font-bold text-emerald-800 text-[10.5px]">{customFileName}</code>
              </p>
              <p className="text-xs text-slate-500 leading-normal">
                {regionalCompositeIndex ? 
                  `Derived composite index from ${regionalCompositeIndex.filesProcessed} region files on-the-fly. The charts, runoff volumes, ground water table models, and sustainable water draft indices are being generated live from this custom composite index.` : 
                  `Your uploaded NetCDF dataset has overwritten standard baseline statistics. The charts, runoff volumes, ground water table models, and sustainable water draft indices are being generated live from this custom dataset.`
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-emerald-100">
            <div>
              <span className="text-slate-400 font-medium">{regionalCompositeIndex ? 'Composite Coordinates:' : 'Nearest Grid Pixel:'}</span>
              <p className="font-bold font-mono text-slate-800 mt-0.5">
                {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">{regionalCompositeIndex ? 'Avg Composite Mean:' : 'Parsed Mean Rainfall:'}</span>
              <p className="font-bold font-mono text-emerald-700 mt-0.5">
                {regionalCompositeIndex ? regionalCompositeIndex.mean.toFixed(1) : avgRainfall} mm/year
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              {showTechnicalDetails ? 'Hide' : 'Show'} how this file was parsed →
            </button>
            <button
              onClick={onClear}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
            >
              Disconnect Custom Data
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 font-sans">
                Standard Interpolated IMD Dataset (1901-2025)
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Active Source: Indian Meteorological Department 0.25° x 0.25° Gridded Rainfall Network
              </p>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                By default, this application parses a high-fidelity climatology series matching the configured geographical coordinates. This provides a 125-year historical baseline configuration.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/55">
            <span className="text-[11px] text-slate-400 italic">Have custom IMD NetCDF files?</span>
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer font-sans"
            >
              Learn how NetCDF uploading work →
            </button>
          </div>
        </div>
      )}

      {showTechnicalDetails && (
        <div className="bg-slate-900 text-slate-300 rounded-xl p-4 border border-slate-800 font-mono text-[10.5px] leading-relaxed space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-indigo-400 font-bold uppercase tracking-wider font-sans text-[9px]">Ingestion Pipeline Blueprint</span>
            <button
              onClick={() => setShowTechnicalDetails(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <p className="text-xs text-slate-400 font-sans">
            Here is physical step-by-step detail of how the applet parses uploaded climate data formats:
          </p>

          <ol className="list-decimal pl-4 space-y-2 text-slate-300 font-sans text-xs">
            <li>
              <strong>File Signature Verification:</strong> The client-side parser checks the mime-type and header signatures. It handles standard NetCDF files (<code className="bg-slate-800 px-1 rounded text-teal-400 font-mono text-[10px]">.nc</code>) directly, or decompresses nested multi-decadal files in a <code className="bg-slate-800 px-1 rounded text-teal-400 font-mono text-[10px]">.zip</code> archive on-the-fly using <code className="bg-slate-800 px-1 rounded text-teal-300 font-mono text-[10px]">JSZip</code>.
            </li>
            <li>
              <strong>Grid-Variable Search:</strong> It utilizes <code className="bg-slate-800 px-1 rounded text-indigo-300 font-mono text-[10px]">netcdfjs</code> reader parsing to inspect dimensions (<code className="bg-slate-850 text-indigo-300">lat</code>, <code className="bg-slate-850 text-indigo-300">lon</code>, <code className="bg-slate-850 text-indigo-300">time</code>) and queries variable keys searching for labels representing precipitation arrays (such as <code className="bg-slate-850 text-slate-200">'rain'</code>, <code className="bg-slate-850 text-slate-200">'rf'</code>, or <code className="bg-slate-850 text-slate-200">'precipitation'</code>).
            </li>
            <li>
              <strong>Spatial Nearest-Neighbor Matching:</strong> Since gridded files cover larger bounds, the parser resolves the coordinates you type in the top bar (e.g. Lat: <code className="text-indigo-300">{latitude}</code>, Lng: <code className="text-indigo-300">{longitude}</code>), looks up the closest grid index, and projects the corresponding timeseries.
            </li>
            <li>
              <strong>Dynamic State Bind:</strong> Once validated, the active timeseries array is fed into the state machine, instantly updating the 125-year trend lines and seasonal monsoonal metrics.
            </li>
          </ol>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-850 text-[10px] text-slate-400 font-sans leading-normal">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>Note:</strong> All data stays local to your web browser window! No files are transmitted to external servers, complying with strict private data sovereignty.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
