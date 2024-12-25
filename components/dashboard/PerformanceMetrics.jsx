"use client"; // Ensure this is a client component

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const PerformanceMetrics = ({ data, label, isPositive, percentage, days }) => {
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(400); // Initial width for chart
  const [chartHeight, setChartHeight] = useState(200); // Initial height for chart

  useEffect(() => {
    // Dynamically adjust chart size based on the parent container's width
    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.clientWidth);
        setChartHeight(chartRef.current.clientHeight);
      }
    });

    resizeObserver.observe(chartRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    // D3.js code to draw the chart
    if (data && chartRef.current) {
      drawChart();
    }
  }, [data, chartWidth, chartHeight]); // Re-run drawing logic when size or data changes

  const drawChart = () => {
    // Clear any existing SVG
    d3.select(chartRef.current).selectAll('*').remove();

    // Set up the SVG canvas dimensions dynamically based on the container size
    const width = chartWidth;
    const height = chartHeight;

    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`) // Ensure the chart scales properly

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
    <div className="flex flex-col p-6 text-base rounded-xl border border-neutral-200 min-w-[288px] w-full max-w-[432px]">
      <div className="font-medium text-neutral-900">{label}</div>
      <div className="mt-2 text-3xl font-bold text-neutral-900">{data[data.length - 1]}</div>
      <div className="flex items-start mt-2">
        <div className="text-neutral-500 w-[50px]">{days}</div>
        <div className={`font-medium w-[42px] ${isPositive ? 'text-green-700' : 'text-red-600'}`}>
          {percentage}
        </div>
      </div>
      <div ref={chartRef} className="w-full mt-4" style={{ height: '200px' }}></div> {/* Responsive container for chart */}
    </div>
  );
};

export default PerformanceMetrics;
