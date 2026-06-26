import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { LayoutGrid } from 'lucide-react';
import { ClimatologySummary } from '../types';

interface RainfallHeatmapProps {
  climatology: ClimatologySummary[];
}

export default function RainfallHeatmap({ climatology }: RainfallHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    });
    
    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  useEffect(() => {
    if (!containerRef.current || dimensions.width === 0 || climatology.length === 0) return;

    const width = dimensions.width;
    const height = 220; // Fixed height container
    
    // Clear any existing svg
    d3.select(containerRef.current).select("svg").remove();

    // Remove any existing tooltips globally created to prevent stale elements
    d3.select("body").selectAll(".heatmap-tooltip").remove();

    const svg = d3.select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Let's decide columns based on 125 years. 25 columns * 5 rows works perfectly for 125.
    const columns = 25;
    const padding = 2;
    
    const maxBoxWidth = Math.max(1, (chartWidth / columns) - padding);
    // Force a 5 row limit to make it match heights nicely
    const rows = Math.ceil(climatology.length / columns);
    const maxBoxHeight = Math.max(1, (chartHeight / rows) - padding);
    
    const boxSize = Math.floor(Math.min(maxBoxWidth, maxBoxHeight));

    // Centering offsets
    const gridWidth = columns * (boxSize + padding);
    const gridHeight = rows * (boxSize + padding);
    const offsetX = (chartWidth - gridWidth) / 2;
    const offsetY = (chartHeight - gridHeight) / 2;

    const tooltip = d3.select("body").append("div")
      .attr("class", "heatmap-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "#0f172a")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("font-family", "monospace")
      .style("z-index", "1000")
      .style("pointer-events", "none")
      .style("box-shadow", "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)");

    const maxRain = d3.max(climatology, d => d.rainfallMm) || 0;
    
    // Creating a color scale: dry years to wet years (yellow -> teal -> blue)
    // d3 interpolators don't quite match Tailwind colors natively, so we use a custom domain or standard scale
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateGnBu) // Green-Blue mapping suitable for rainfall
      .domain([0, maxRain]);

    g.selectAll("rect")
      .data(climatology)
      .enter()
      .append("rect")
      .attr("x", (d, i) => offsetX + (i % columns) * (boxSize + padding))
      .attr("y", (d, i) => offsetY + Math.floor(i / columns) * (boxSize + padding))
      .attr("width", boxSize)
      .attr("height", boxSize)
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("fill", d => colorScale(d.rainfallMm))
      .attr("stroke", "#e2e8f0")
      .attr("stroke-width", 0.5)
      .style("cursor", "crosshair")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke", "#0f172a")
          .attr("stroke-width", 2);
          
        tooltip.style("visibility", "visible")
               .html(`<strong>Year: ${d.year}</strong><br/>${d.rainfallMm.toLocaleString()} mm <br/>${d.isWetYear ? '(Wet/Heavy)' : '(Dry/Deficit)'}`);
      })
      .on("mousemove", function(event) {
        tooltip.style("top", (event.pageY - 60) + "px")
               .style("left", (event.pageX + 15) + "px");
      })
      .on("mouseout", function() {
        d3.select(this)
          .attr("stroke", "#e2e8f0")
          .attr("stroke-width", 0.5);
        tooltip.style("visibility", "hidden");
      });

    // Clean up tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, [climatology, dimensions.width]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl shrink-0 mt-0.5">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-800 font-sans">125-Year Climatology Heatmap</h3>
            <p className="text-xs text-slate-500 font-sans mt-1">Intensity mapping layout over sequential years ({climatology[0]?.year} - {climatology[climatology.length - 1]?.year})</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 mt-2">
          <span className="w-2 h-2 bg-[#e0f3db] rounded-sm inline-block border border-slate-200"></span> Dry
          <span className="w-2 h-2 bg-[#4eb3d3] rounded-sm inline-block ml-1 border border-slate-200"></span> Mod
          <span className="w-2 h-2 bg-[#08589e] rounded-sm inline-block ml-1 border border-transparent"></span> Wet
        </div>
      </div>
      
      <div ref={containerRef} className="w-full mt-4" style={{ height: '220px' }} />
    </div>
  );
}
