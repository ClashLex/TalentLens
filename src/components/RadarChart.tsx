"use client";

import { useEffect, useState } from "react";

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
  showLabels?: boolean;
}

export function RadarChart({
  data,
  size = 200,
  showLabels = true,
}: RadarChartProps) {
  const [animatedData, setAnimatedData] = useState(data.map(() => 0));
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) - (showLabels ? 40 : 16);
  const n = data.length;
  const angleSlice = (Math.PI * 2) / n;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedData(data.map(d => d.value));
    }, 150);
    return () => clearTimeout(timeout);
  }, [data]);

  const getPoint = (index: number, value: number) => {
    const angle = angleSlice * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const polygonPoints = animatedData
    .map((v, i) => {
      const p = getPoint(i, v);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const axes = data.map((_, i) => {
    const p = getPoint(i, 100);
    return { x2: p.x, y2: p.y };
  });

  const rings = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background rings */}
      {rings.map((level) => {
        const ringPoints = data
          .map((_, i) => {
            const p = getPoint(i, level);
            return `${p.x},${p.y}`;
          })
          .join(" ");
        return (
          <polygon
            key={level}
            points={ringPoints}
            fill="none"
            stroke="#e7e5e4" /* stone-200 */
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {axes.map((axis, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={axis.x2}
          y2={axis.y2}
          stroke="#e7e5e4"
          strokeWidth={1}
        />
      ))}

      {/* Data polygon */}
      <polygon
        points={polygonPoints}
        fill="rgba(41, 37, 36, 0.05)" /* stone-900 with low opacity */
        stroke="#292524" /* stone-900 */
        strokeWidth={1.5}
        strokeLinejoin="round"
        style={{ transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
      />

      {/* Data points */}
      {animatedData.map((v, i) => {
        const p = getPoint(i, v);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill="#fafaf9" /* stone-50 */
            stroke="#292524"
            strokeWidth={1.5}
            style={{ transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        );
      })}

      {/* Labels */}
      {showLabels &&
        data.map((d, i) => {
          const angle = angleSlice * i - Math.PI / 2;
          const labelR = radius + 22;
          const x = cx + labelR * Math.cos(angle);
          const y = cy + labelR * Math.sin(angle);
          const isLeft = x < cx - 10;
          const isRight = x > cx + 10;

          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor={isLeft ? "end" : isRight ? "start" : "middle"}
              dominantBaseline="middle"
              fill="#78716c" /* stone-500 */
              fontSize={11}
              fontWeight={500}
              fontFamily="Inter, sans-serif"
              className="tracking-wide"
            >
              {d.label}
            </text>
          );
        })}
    </svg>
  );
}
