/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ToolTipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
}

export default function ToolTip({ content, children }: ToolTipProps) {
  return (
    <div className="group relative inline-flex items-center justify-center">
      {children || <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help hover:text-indigo-500 transition-colors" />}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible w-56 p-2.5 bg-slate-800 text-slate-100 text-[10.5px] leading-relaxed rounded-xl shadow-xl z-50 pointer-events-none text-center font-sans border border-slate-700">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </div>
    </div>
  );
}
