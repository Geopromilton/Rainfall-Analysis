/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { HRUAreaInput } from '../types';
import { Compass, RotateCw, Layers } from 'lucide-react';

interface TerrainViewer3DProps {
  hruAreas: HRUAreaInput;
  slopeClass: string;
  waterTableDepthM: number;
}

export default function TerrainViewer3D({
  hruAreas,
  slopeClass,
  waterTableDepthM
}: TerrainViewer3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotationAngle, setRotationAngle] = useState(45); // rotation in degrees
  const [elevationScale, setElevationScale] = useState(1.2);
  const [showAquifer, setShowAquifer] = useState(true);
  const [showStructures, setShowStructures] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and size canvas
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Grid details
    const gridSize = 16; // 16x16 wireframe grid
    const cellSpacing = 15; // horizontal spacing factor
    
    // Rotation calculations
    const rad = (rotationAngle * Math.PI) / 360; // scale rotation speed
    const cosR = Math.cos(rad);
    const sinR = Math.sin(rad);

    // Seeding height values (with realistic slope profiles)
    const baseSlope = slopeClass === 'steep' ? 8.5 : slopeClass === 'moderate' ? 4.0 : 1.2;
    const heights: number[][] = [];
    
    for (let x = 0; x < gridSize; x++) {
      heights[x] = [];
      for (let y = 0; y < gridSize; y++) {
        // Create an interesting local undulating valley-hill profile of Vijayanagar
        const elevation = (Math.sin(x * 0.4) * Math.cos(y * 0.45) * 8) + 
                          ((x + y) * baseSlope * 0.45) + 
                          12; // Base offset
        heights[x][y] = elevation;
      }
    }

    // Isometric projection mapping
    // Transforms 3D coordinates (x, y, z) to 2D screen positions
    const project = (x3d: number, y3d: number, z3d: number) => {
      // Center coordinates around (0,0,0) before rotating
      const xC = x3d - gridSize / 2;
      const yC = y3d - gridSize / 2;

      // Apply rotation on XY plane
      const xRot = xC * cosR - yC * sinR;
      const yRot = xC * sinR + yC * cosR;

      // Isometric display projection formula
      const screenX = (xRot - yRot) * cellSpacing + width / 2;
      const screenY = (xRot + yRot) * (cellSpacing * 0.5) - (z3d * elevationScale) + height / 2 + 30;

      return { x: screenX, y: screenY };
    };

    // 1. Draw Bedrock Basement Foundation (Fresh solid granite)
    ctx.strokeStyle = '#334155'; // Dark slate
    ctx.lineWidth = 1;
    
    // We draw columns down to bedrock from the grid borders to create a dense 3D bento-block aquifer block
    const maxZ = 50; // basement depth limit reference
    
    // Draw grid wires bottom basement
    const drawBaseEdgePrism = () => {
      // Corners
      const c0 = project(0, 0, heights[0][0]);
      const c0_base = project(0, 0, heights[0][0] - maxZ);
      const c1 = project(gridSize - 1, 0, heights[gridSize - 1][0]);
      const c1_base = project(gridSize - 1, 0, heights[gridSize - 1][0] - maxZ);
      const c2 = project(gridSize - 1, gridSize - 1, heights[gridSize - 1][gridSize - 1]);
      const c2_base = project(gridSize - 1, gridSize - 1, heights[gridSize - 1][gridSize - 1] - maxZ);
      const c3 = project(0, gridSize - 1, heights[0][gridSize - 1]);
      const c3_base = project(0, gridSize - 1, heights[0][gridSize - 1] - maxZ);

      // Shadow Block faces
      ctx.fillStyle = '#0f172a'; // Deep abyss slate
      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c1_base.x, c1_base.y);
      ctx.lineTo(c2_base.x, c2_base.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#1e293b'; // slightly lighter slate
      ctx.beginPath();
      ctx.moveTo(c2.x, c2.y);
      ctx.lineTo(c2_base.x, c2_base.y);
      ctx.lineTo(c3_base.x, c3_base.y);
      ctx.lineTo(c3.x, c3.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    drawBaseEdgePrism();

    // 2. Render Aquifer layer plane (Suspended blue sheet)
    if (showAquifer) {
      // Calculated depth mapping (reaches down, represented relative to local topography heights)
      ctx.fillStyle = 'rgba(14, 165, 233, 0.25)'; // Aqua fluid alpha
      ctx.strokeStyle = '#0284c7'; // dark blue wire
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          // Aquifer surface is suspended at waterTableDepthM lower than top ground level
          const tableHeight = Math.max(heights[x][y] - waterTableDepthM, -3); // Floor clamp
          const pt = project(x, y, tableHeight);
          
          if (x === 0 && y === 0) ctx.moveTo(pt.x, pt.y);
          else if (y === 0) {
            const prevPt = project(x - 1, 0, Math.max(heights[x-1][0] - waterTableDepthM, -3));
            ctx.lineTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      }
      ctx.closePath();
      ctx.fill();
    }

    // 3. Render Topography Wireframe Mesh grids
    ctx.lineWidth = 1.5;
    for (let x = 0; x < gridSize - 1; x++) {
      for (let y = 0; y < gridSize - 1; y++) {
        const p1 = project(x, y, heights[x][y]);
        const p2 = project(x + 1, y, heights[x + 1][y]);
        const p3 = project(x, y + 1, heights[x][y + 1]);

        // Draw structural tiles depending on local HRU proportions
        // Color coding: permacultures get green grids, roads get grey, buildings are red blocks
        ctx.strokeStyle = '#10b981'; // Green grass
        if ((x + y) % 5 === 0 && showStructures) {
          ctx.strokeStyle = '#f43f5e'; // Red structures
        } else if ((x - y) % 6 === 0 && showStructures) {
          ctx.strokeStyle = '#64748b'; // Grey roads
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.stroke();
      }
    }

  }, [rotationAngle, elevationScale, showAquifer, showStructures, slopeClass, waterTableDepthM]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6" id="terrain-3d-view">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
            Module 9: Interactive 3D Hydro-Terrain Model
          </span>
          <h2 className="text-2xl font-bold font-sans text-slate-800 mt-2">Aquifer Strata Visualization</h2>
          <p className="text-sm text-slate-500 mt-1">
            Simulate water table thickness and surface layouts. Drag sliders to adjust perspectives.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
        
        {/* Render Canvas block */}
        <div className="lg:col-span-3 bg-slate-950 rounded-2xl p-4 flex justify-center items-center relative select-none shadow-inner border border-slate-900">
          <canvas 
            ref={canvasRef} 
            width={580} 
            height={320} 
            className="w-full max-w-[580px] h-[320px] block pointer-events-none"
          />

          {/* Compass banner */}
          <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-800 text-slate-300 text-[10px] font-mono p-2 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
            <Compass className="w-3.5 h-3.5 text-teal-400 rotate-45 animate-pulse" />
            <span>Azimuth Rotation: {rotationAngle}°</span>
          </div>

          {/* Core Legend Overlay */}
          <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-[9.5px] font-sans text-slate-300 space-y-1.5 leading-normal shadow-md">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm inline-block" />
              <span>Forest / Orchard (Permaculture)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-sm inline-block" />
              <span>Building Concrete footprint</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-sky-500 rounded-sm inline-block" />
              <span>Water Aquifer plane (depth: {waterTableDepthM}m)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-800 rounded-sm border border-slate-700 inline-block" />
              <span>Crystalline Bedrock (Impervious Complex)</span>
            </div>
          </div>
        </div>

        {/* 3D control Panel */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">Perspective Adjustment</h3>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-4 font-sans text-xs">
            {/* Rotation slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span className="flex items-center gap-1"><RotateCw className="w-3.5 h-3.5 text-slate-400" /> Rotate Orbit</span>
                <span className="font-mono font-bold">{rotationAngle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                className="w-full h-1.5 bg-slate-200 accent-teal-600 rounded-lg outline-none"
                value={rotationAngle}
                onChange={(e) => setRotationAngle(Number(e.target.value))}
              />
            </div>

            {/* Elevation vertical slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5 text-slate-400" /> Z-Axis Exaggeration</span>
                <span className="font-mono font-bold">{elevationScale.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.2}
                max={2.5}
                step={0.1}
                className="w-full h-1.5 bg-slate-200 accent-teal-600 rounded-lg outline-none"
                value={elevationScale}
                onChange={(e) => setElevationScale(Number(e.target.value))}
              />
            </div>

            {/* Layer Visibility toggles */}
            <div className="border-t border-slate-200/60 pt-4 space-y-3 font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Aquifer Blue Plane</span>
                <button
                  onClick={() => setShowAquifer(!showAquifer)}
                  className={`px-2.5 py-1 text-[10px] rounded-md border font-bold transition-all ${showAquifer ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-white border-slate-200 text-slate-400'}`}
                >
                  {showAquifer ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Built-up Features</span>
                <button
                  onClick={() => setShowStructures(!showStructures)}
                  className={`px-2.5 py-1 text-[10px] rounded-md border font-bold transition-all ${showStructures ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-400'}`}
                >
                  {showStructures ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
