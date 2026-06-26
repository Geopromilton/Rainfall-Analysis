/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrainCircuit, Send, Sparkles, HelpCircle, AlertTriangle, ListChecks } from 'lucide-react';

interface GeminiAdvisorSectionProps {
  contextData: {
    location: any;
    totalAreaM2: number;
    totalAreaHa: number;
    hruSummary: string[];
    weightedC: number;
    annualRunoffMl: number;
    annualRechargeMl: number;
    demandCategory: string;
    demandLpcd: number;
    communityDemandLpd: number;
    waterSecurityDays: number;
    riskFlags: any[];
    predictedGwlDepthM: number;
    borewellYield: string;
  };
  siteName?: string;
}

export default function GeminiAdvisorSection({
  contextData,
  siteName
}: GeminiAdvisorSectionProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const activeSiteName = siteName || 'the assigned coordinates';

  // Preset prompt suggestions for the consultant
  const quickPresets = [
    {
      label: 'Draft Executive Summary',
      prompt: `Provide a concise, 3-paragraph investor-ready water security executive summary for ${activeSiteName}.`,
      icon: <ListChecks className="w-4 h-4 text-emerald-500" />
    },
    {
      label: 'Assess Dry Season Risks',
      prompt: 'Identify top risks faced during our 142 continuous dry days spell and state how to maximize self-reliance.',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />
    },
    {
      label: 'Evaluate Structure Sizing',
      prompt: 'Audit the proposed counts of percolation pits, contour structures, and aquifer recharge shafts. Suggest locations.',
      icon: <BrainCircuit className="w-4 h-4 text-purple-500" />
    }
  ];

  const handleConsult = async (customPrompt?: string) => {
    const promptToSend = customPrompt || query;
    if (!promptToSend.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    // If typing custom query, empty the box
    if (!customPrompt) {
      setQuery('');
    }

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          contextData: contextData
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server returned an error calling Gemini API');
      }

      setResponse(data.text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unable to consult the AI Advisor. Please verify that your API key is correctly configured inside AI Studio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="gemini-advisory-view">
      
      {/* Title */}
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
          Module 10: Server-Side Gemini Hydrological Expert
        </span>
        <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Closed-Loop Expert Advisory System</h2>
        <p className="text-sm text-slate-500 mt-1">
          Ask specific geological layout questions. Powered by Google Gemini reasoning over customized site conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left pane: Preset quick queries */}
        <div className="space-y-3.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block font-sans">Quick Consult Primers</span>
          <div className="space-y-2.5">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => handleConsult(preset.prompt)}
                className="w-full bg-slate-50 border border-slate-100/60 rounded-xl p-3.5 text-left text-xs font-sans hover:bg-purple-50 hover:border-purple-200 transition-all cursor-pointer flex gap-3 text-slate-700 font-semibold leading-relaxed group"
              >
                <div className="shrink-0 p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm group-hover:bg-purple-100 transition-all flex items-center justify-center">
                  {preset.icon}
                </div>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right pane: Active chat bubble and prompt input */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Output Display or static helpful instruction */}
          <div className="bg-slate-950 text-slate-100 rounded-2xl p-5 min-h-[195px] relative shadow-inner overflow-y-auto max-h-[380px] border border-slate-900 scrollbar-thin">
            {loading ? (
              <div className="absolute inset-0 flex flex-col justify-center items-center gap-3 bg-slate-950/80 z-10">
                <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
                <span className="text-xs text-purple-300 font-sans tracking-wide font-medium animate-pulse">Running diagnostic models on {siteName || 'site'} matrices...</span>
              </div>
            ) : null}

            {error && (
              <div className="bg-rose-950/50 border border-rose-900/60 rounded-xl p-4 text-xs font-sans text-rose-300 mb-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                <div className="space-y-1">
                  <strong className="font-bold">Consultation Error</strong>
                  <p className="leading-relaxed opacity-95">{error}</p>
                </div>
              </div>
            )}

            {response ? (
              <div className="prose prose-invert prose-xs font-sans text-slate-300 text-[12px] leading-relaxed space-y-4">
                <div className="flex items-center gap-1.5 text-purple-400 font-bold border-b border-slate-800 pb-2 mb-2">
                  <BrainCircuit className="w-5 h-5" />
                  <span>Gemini Water Engineering Consultant report</span>
                </div>
                
                {/* Simplified markdown formatter for neat reports */}
                {response.split('\n\n').map((para, pIdx) => {
                  let formatted = para.trim();
                  if (formatted.startsWith('###')) {
                    return <h3 key={pIdx} className="text-sm font-extrabold text-white pt-2">{formatted.replace('###', '')}</h3>;
                  }
                  if (formatted.startsWith('##')) {
                    return <h2 key={pIdx} className="text-base font-extrabold text-indigo-400 pt-3 border-b border-slate-900 pb-1">{formatted.replace('##', '')}</h2>;
                  }
                  if (formatted.startsWith('*') || formatted.startsWith('-')) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1">
                        {formatted.split('\n').map((li, lIdx) => (
                          <li key={lIdx} className="text-slate-300">{li.replace(/^[\s*-]+/, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={pIdx} className="text-slate-300 leading-normal">{formatted}</p>;
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center text-slate-500 py-10 font-sans space-y-3">
                <Sparkles className="w-9 h-9 text-purple-700/60" />
                <div className="max-w-sm space-y-1">
                  <span className="font-extrabold text-slate-350 block text-[11.5px]">Awaiting water planning query</span>
                  <span className="text-[10.5px] text-slate-400 leading-normal">Select a primer to the left or type your customized geological / engineering layout inquiries below.</span>
                </div>
              </div>
            )}
          </div>

          {/* Prompt typing box */}
          <div className="flex gap-2">
            <input
              type="text"
              disabled={loading}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-purple-500 font-sans text-slate-700"
              placeholder="Ask about borewell spacing, pond depths, runoff retention techniques, etc..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConsult()}
            />
            <button
              disabled={loading}
              onClick={() => handleConsult()}
              className="bg-purple-900 border border-purple-950 rounded-xl px-4 text-white hover:bg-purple-950 transition-all font-sans font-bold flex items-center justify-center cursor-pointer hover:shadow"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
