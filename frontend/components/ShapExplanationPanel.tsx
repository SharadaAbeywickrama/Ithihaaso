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

  if (loading) return <div className="text-sm text-slate-500 animate-pulse">Loading explanation...</div>;
  if (!data) return <div className="text-sm text-red-500">Explanation not available.</div>;

  const features = Object.entries(data.shap_values).sort((a: any, b: any) => Math.abs(b[1]) - Math.abs(a[1]));

  return (
    <div className="bg-slate-50 p-4 rounded border border-slate-200">
      <div className="flex justify-between text-sm mb-4">
        <span>Base Value: <strong>{data.base_value.toFixed(3)}</strong></span>
        <span>Final Prediction: <strong>{(data.base_value + features.reduce((acc, curr: any) => acc + curr[1], 0)).toFixed(3)}</strong></span>
      </div>
      
      <div className="space-y-3">
        {features.map(([feature, shapValue]: any) => {
          const isPositive = shapValue > 0;
          const width = Math.min(Math.abs(shapValue) * 100, 100); // Simple scaling for viz
          
          return (
            <div key={feature} className="flex items-center text-sm">
              <div className="w-1/3 truncate pr-2 text-right text-slate-600 font-medium">
                {feature}
              </div>
              <div className="w-2/3 flex items-center">
                <div className="w-1/2 flex justify-end pr-1">
                  {!isPositive && (
                    <div className="bg-red-400 h-4 rounded-l" style={{ width: `${width}%` }} title={shapValue.toFixed(4)}></div>
                  )}
                </div>
                <div className="w-[2px] h-5 bg-slate-400 relative z-10"></div>
                <div className="w-1/2 flex justify-start pl-1">
                  {isPositive && (
                    <div className="bg-blue-400 h-4 rounded-r" style={{ width: `${width}%` }} title={shapValue.toFixed(4)}></div>
                  )}
                </div>
                <span className="ml-2 text-xs text-slate-500 w-16">
                  {shapValue > 0 ? '+' : ''}{shapValue.toFixed(3)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-slate-400 mt-4 text-center">
        Bars indicate how much each feature contributed to pushing the score away from the base value.
      </p>
    </div>
  );
}
