// components/PerformanceMetrics.jsx
"use client"; // Ensure this is a client component

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PerformanceMetrics = ({ data, label, isPositive, percentage, days }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // D3.js code to draw the chart
    if (data && chartRef.current) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    // Clear any existing SVG
    d3.select(chartRef.current).selectAll('*').remove();

    // Set up the SVG canvas dimensions
    const width = 400;
    const height = 200;

    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height);

    // Your D3.js chart code goes here
    // For example, we can create a simple line chart

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([50, width - 20]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height - 50, 20]);

    const line = d3.line()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));

    svg.append('path')
      .datum(data)
      .attr('d', line)
      .attr('stroke', '#4F46E5')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  };

  return (
    <div className="flex flex-col p-6 text-base rounded-xl border border-neutral-200 min-w-[288px] w-[432px]">
      <div className="font-medium text-neutral-900">{label}</div>
      <div className="mt-2 text-3xl font-bold text-neutral-900">{data[data.length - 1]}</div>
      <div className="flex items-start mt-2">
        <div className="text-neutral-500 w-[50px]">{days}</div>
        <div className={`font-medium w-[42px] ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
          {percentage}
        </div>
      </div>
      <svg ref={chartRef} className="mt-4"></svg>
    </div>
  );
};

export default PerformanceMetrics;
