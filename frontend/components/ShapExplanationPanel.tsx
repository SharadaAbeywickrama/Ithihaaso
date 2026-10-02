"use client";

import { useEffect, useState } from 'react';
import { getExplanation } from '@/lib/api';

interface ShapProps {
  targetType: string;
  targetId: string;
}

export default function ShapExplanationPanel({ targetType, targetId }: ShapProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExplanation(targetType, targetId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [targetType, targetId]);

  if (loading) {
    return (
      <div className="p-4 text-xs font-mono text-amber-400/80 animate-pulse flex items-center gap-2">
        <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
        <span>Computing SHAP feature attributions...</span>
      </div>
    );
  }

  if (!data || !data.shap_values) {
    return (
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-400">
        Explanation not available for this response.
      </div>
    );
  }

  const features = Object.entries(data.shap_values).sort((a: any, b: any) => Math.abs(b[1]) - Math.abs(a[1]));
  const finalPrediction = data.base_value + features.reduce((acc, curr: any) => acc + curr[1], 0);

  return (
    <div className="glass-card p-5 rounded-xl border border-amber-500/20 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">🧠 SHAP Attribution Values</span>
          <span className="text-gray-400 text-[10px]">(Tree/Kernel Explainer)</span>
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <span>Base: <strong className="text-gray-100">{data.base_value.toFixed(3)}</strong></span>
          <span className="text-gray-600">|</span>
          <span>Final Score: <strong className="text-amber-400">{finalPrediction.toFixed(3)}</strong></span>
        </div>
      </div>
      
      <div className="space-y-2.5 pt-1">
        {features.map(([feature, shapValue]: any) => {
          const val = Number(shapValue);
          const isPositive = val > 0;
          const widthPercent = Math.min(Math.abs(val) * 100, 100);
          
          return (
            <div key={feature} className="flex items-center text-xs font-mono group">
              {/* Feature Label */}
              <div className="w-1/3 truncate pr-3 text-right text-gray-300 font-medium group-hover:text-amber-300 transition-colors">
                {feature}
              </div>

              {/* Bar Container */}
              <div className="w-2/3 flex items-center">
                {/* Negative (Left side) */}
                <div className="w-1/2 flex justify-end pr-1">
                  {!isPositive && (
                    <div 
                      className="bg-rose-500/80 h-3.5 rounded-l transition-all duration-500 hover:brightness-125" 
                      style={{ width: `${widthPercent}%` }} 
                      title={`Negative impact: ${val.toFixed(4)}`}
                    />
                  )}
                </div>

                {/* Zero Center Line */}
                <div className="w-[2px] h-5 bg-gray-500/60 relative z-10"></div>

                {/* Positive (Right side) */}
                <div className="w-1/2 flex justify-start pl-1">
                  {isPositive && (
                    <div 
                      className="bg-emerald-400/80 h-3.5 rounded-r transition-all duration-500 hover:brightness-125" 
                      style={{ width: `${widthPercent}%` }} 
                      title={`Positive impact: +${val.toFixed(4)}`}
                    />
                  )}
                </div>

                {/* Value display */}
                <span className={`ml-3 text-[11px] w-14 font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? '+' : ''}{val.toFixed(3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex justify-between items-center text-[10px] text-gray-500 font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Positive weight towards citation
        </span>
        <span className="flex items-center gap-1.5 text-rose-400">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span> Negative weight / penalty
        </span>
      </div>
    </div>
  );
}

