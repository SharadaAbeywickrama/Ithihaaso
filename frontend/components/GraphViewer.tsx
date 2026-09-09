"use client";
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getGraph } from '@/lib/api';

// Dynamic import for force-graph as it only runs in browser
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

export default function GraphViewer() {
  const [data, setData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGraph()
      .then(res => {
        // Format for react-force-graph
        setData({
          nodes: res.nodes.map((n: any) => ({ ...n, name: n.label, val: 1 })),
          links: res.edges.map((e: any) => ({ ...e, source: e.source, target: e.target }))
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Knowledge Graph...</div>;
  if (!data.nodes.length) return <div className="p-10 text-center">Graph is empty. Upload documents to populate.</div>;

  return (
    <div className="border border-slate-300 rounded overflow-hidden shadow-sm bg-white" style={{ height: '70vh' }}>
      {typeof window !== 'undefined' && (
        <ForceGraph2D
          graphData={data}
          nodeLabel="name"
          nodeAutoColorBy="type"
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0.25}
        />
      )}
    </div>
  );
}
