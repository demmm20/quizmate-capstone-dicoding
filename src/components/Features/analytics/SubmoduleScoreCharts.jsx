import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CHART_HEIGHT = 320;

const MAX_LABEL_LEN = 15;
const LABEL_ANGLE = -20;

const truncateLabel = (value, maxLen = MAX_LABEL_LEN) => {
  if (!value) return "";
  const s = String(value);
  return s.length > maxLen ? `${s.slice(0, maxLen - 3)}...` : s;
};

const CustomTick = ({ x, y, payload }) => {
  const full = payload?.value ?? "";
  const text = truncateLabel(full);
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={20}
        textAnchor="end"
        fill="#4b5563"
        fontSize={11}
        transform={`rotate(${LABEL_ANGLE})`}
        title={full} 
      >
        {text}
      </text>
    </g>
  );
};

const SubmoduleScoreChart = ({ data = [] }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (entry) => {
      const rect = entry?.contentRect || el.getBoundingClientRect();
      const w = rect?.width ?? 0;
      if (w > 8) setWidth(w);
    };

    const observer = new ResizeObserver((entries) => entries.forEach(update));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ready = width > 8;

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ minWidth: 0, height: CHART_HEIGHT, minHeight: CHART_HEIGHT }}
    >
      {ready ? (
        <ResponsiveContainer width={width} height={CHART_HEIGHT}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 36,
              bottom: 36,
              left: 12,
            }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e7bff" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#1e7bff" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              interval={0} 
              tick={<CustomTick />}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#1e7bff"
              strokeWidth={2}
              fill="url(#colorScore)"
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full w-full bg-gray-50 rounded-2xl animate-pulse" />
      )}
    </div>
  );
};

export default SubmoduleScoreChart;