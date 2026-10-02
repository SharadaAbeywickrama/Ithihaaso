import GraphViewer from '@/components/GraphViewer';

export default function GraphPage() {
  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400">
            <span>🕸️ Graph Builder Agent Synthesis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100">
            Historiographical <span className="cyan-violet-text">Knowledge Graph</span>
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl">
            Interactive network map of historical figures, events, locations, and ideological stances extracted from your ingested document repository.
          </p>
        </div>
      </div>

      {/* Main Interactive Graph View */}
      <GraphViewer />
    </div>
  );
}

