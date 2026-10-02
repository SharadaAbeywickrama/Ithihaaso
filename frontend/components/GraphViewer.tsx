"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getGraph } from '@/lib/api';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

// Entity type color map
const typeColors: Record<string, string> = {
  Person: '#F59E0B',      // Amber
  Event: '#06B6D4',       // Cyan
  Location: '#10B981',    // Emerald
  Theme: '#8B5CF6',       // Violet
  Concept: '#EC4899',     // Pink
  Organization: '#3B82F6',// Blue
  Default: '#9CA3AF',     // Gray
};

export default function GraphViewer() {
  const [data, setData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const graphRef = useRef<any>(null);

  useEffect(() => {
    getGraph()
      .then(res => {
        setData({
          nodes: (res.nodes || []).map((n: any) => ({
            ...n,
            name: n.label,
            val: 2,
            color: typeColors[n.type] || typeColors.Default,
          })),
          links: (res.edges || []).map((e: any) => ({
            ...e,
            source: e.source,
            target: e.target,
            label: e.type || 'relates_to',
          })),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node);
    if (graphRef.current) {
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2.5, 1000);
    }
  }, []);

  // Custom Node Canvas Renderer
  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name || '';
    const fontSize = 12 / globalScale;
    const radius = 6;

    // Glowing halo
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius + 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color + '33'; // transparent glow
    ctx.fill();

    // Core circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color;
    ctx.fill();
    ctx.strokeStyle = selectedNode?.id === node.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = (selectedNode?.id === node.id ? 2 : 1) / globalScale;
    ctx.stroke();

    // Text Label below node
    if (globalScale > 1.2 || selectedNode?.id === node.id) {
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#F3F4F6';
      ctx.fillText(label, node.x, node.y + radius + fontSize + 2);
    }
  }, [selectedNode]);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl h-[550px] flex flex-col items-center justify-center space-y-4 border border-white/10">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-mono text-amber-400">Loading Historiographical Knowledge Graph...</p>
      </div>
    );
  }

  if (!data.nodes.length) {
    return (
      <div className="glass-card rounded-2xl h-[450px] flex flex-col items-center justify-center p-8 border border-white/10 space-y-4 text-center">
        <div className="text-4xl">🕸️</div>
        <h3 className="text-lg font-bold text-gray-200">Knowledge Graph is Empty</h3>
        <p className="text-xs text-gray-400 max-w-sm">
          No historical entities or relationships found yet. Upload source documents to let the Graph Builder agent construct nodes.
        </p>
      </div>
    );
  }

  return (
    <div className="relative glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Legend & Controls Header */}
      <div className="absolute top-4 left-4 z-10 glass-card p-3 rounded-xl border border-white/10 flex flex-wrap items-center gap-3 text-xs">
        <span className="font-semibold text-gray-300 mr-1">Entity Types:</span>
        {Object.entries(typeColors).filter(([k]) => k !== 'Default').map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5 font-mono text-[11px] text-gray-300">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span>{type}</span>
          </div>
        ))}
      </div>

      {/* Force Graph Canvas */}
      <div className="h-[600px] w-full bg-[#0B0F19]">
        {typeof window !== 'undefined' && (
          <ForceGraph2D
            ref={graphRef}
            graphData={data}
            nodeCanvasObject={drawNode}
            onNodeClick={handleNodeClick}
            nodePointerAreaPaint={(node: any, color, ctx) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
              ctx.fill();
            }}
            linkCanvasObjectMode={() => 'after'}
            linkColor={() => 'rgba(245, 158, 11, 0.2)'}
            linkWidth={1.5}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleSpeed={0.004}
            linkDirectionalParticleColor={() => '#F59E0B'}
            backgroundColor="#0B0F19"
          />
        )}
      </div>

      {/* Selected Node Details Sidebar Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 z-10 w-80 glass-card p-5 rounded-2xl border border-amber-500/30 space-y-4 animate-in slide-in-from-right-5">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-white/10 text-amber-400 bg-amber-500/10">
                {selectedNode.type || 'Entity'}
              </span>
              <h3 className="text-lg font-bold text-gray-100">{selectedNode.name}</h3>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-400 hover:text-white text-xs p-1 rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs text-gray-300">
            <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 space-y-1">
              <div className="text-[10px] text-gray-400 font-mono">NODE ID</div>
              <div className="font-mono text-amber-300">{selectedNode.id}</div>
            </div>

            {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5 space-y-1.5">
                <div className="text-[10px] text-gray-400 font-mono">PROPERTIES</div>
                <pre className="text-[11px] font-mono text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(selectedNode.properties, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

