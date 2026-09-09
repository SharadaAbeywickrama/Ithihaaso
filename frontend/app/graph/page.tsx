import GraphViewer from '@/components/GraphViewer';

export default function GraphPage() {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Knowledge Graph</h1>
          <p className="text-slate-600 mt-2">
            Explore the entities, concepts, and relationships automatically extracted from your historical sources.
          </p>
        </div>
      </div>
      
      <GraphViewer />
    </div>
  );
}
