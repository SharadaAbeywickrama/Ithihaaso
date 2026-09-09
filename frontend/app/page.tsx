export default function Dashboard() {
  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-4xl font-extrabold mb-6">Welcome to Ithihaaso</h1>
      <p className="text-lg text-slate-700 mb-8">
        The autonomous multi-agent knowledge base for historiographical synthesis and source criticism.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
          <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
          <p className="mb-4 text-slate-600">Upload primary and secondary sources to let our agents extract entities and critique the source.</p>
          <a href="/upload" className="text-blue-600 font-semibold hover:underline">Go to Upload &rarr;</a>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
          <h2 className="text-2xl font-bold mb-4">Explore Knowledge Graph</h2>
          <p className="mb-4 text-slate-600">Visualize the self-organizing knowledge graph of historical entities and relationships.</p>
          <a href="/graph" className="text-blue-600 font-semibold hover:underline">View Graph &rarr;</a>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
          <h2 className="text-2xl font-bold mb-4">Query the Agents</h2>
          <p className="mb-4 text-slate-600">Ask questions and get answers with SHAP-attributed citations to historical sources.</p>
          <a href="/query" className="text-blue-600 font-semibold hover:underline">Ask a Question &rarr;</a>
        </div>
      </div>
    </div>
  );
}
