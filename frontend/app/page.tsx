import Link from 'next/link';

export default function Dashboard() {
  const features = [
    {
      title: "Document Ingestion & Analysis",
      description: "Upload primary texts, biased accounts, or historian essays. Agents auto-extract entities, themes, and historical context.",
      icon: "📜",
      link: "/upload",
      actionText: "Upload Documents",
      badge: "Document Analyzer Agent",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    },
    {
      title: "Interactive Knowledge Graph",
      description: "Explore self-organizing historical entity nodes, Visigoth vs. Roman primary perspectives, and conceptual edge weights.",
      icon: "🕸️",
      link: "/graph",
      actionText: "Explore Graph",
      badge: "Graph Builder Agent",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      title: "SHAP-Attributed AI Query",
      description: "Ask complex historiographical questions and inspect transparent SHAP attributions explaining why each source was cited.",
      icon: "🧠",
      link: "/query",
      actionText: "Query Platform",
      badge: "Source Critic & SHAP Engine",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    },
  ];

  const steps = [
    { step: "01", title: "Document Ingestion", desc: "Raw text parsing & multi-agent semantic entity extraction." },
    { step: "02", title: "Source Criticism", desc: "Reliability score calculation & bias stance analysis." },
    { step: "03", title: "Graph Synthesis", desc: "PostgreSQL pgvector storage & dynamic graph link merging." },
    { step: "04", title: "Attributed Reasoning", desc: "LLM synthesis with SHAP feature attributions for truth transparency." },
  ];

  return (
    <div className="space-y-16 py-6 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="relative text-center space-y-6 pt-8 pb-4">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-amber-500/30 text-xs font-mono text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          Multi-Agent Historiographical Intelligence Engine v1.0
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Uncover Truth in <br />
          <span className="gold-gradient-text">Historical Complexity</span>
        </h1>

        <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Ithihaaso deploys autonomous specialized AI agents to analyze primary historical sources, detect bias, resolve conflicting accounts, and explain findings via SHAP feature attribution.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/query"
            className="gold-button px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold tracking-wide"
          >
            <span>Ask the AI Agents</span>
            <span>→</span>
          </Link>
          <Link
            href="/upload"
            className="glass-card glass-card-hover px-6 py-3 rounded-xl text-sm font-medium text-gray-200 border border-white/10 hover:text-white flex items-center gap-2"
          >
            <span>Upload Sources</span>
            <span className="text-xs text-amber-400">TXT, PDF</span>
          </Link>
        </div>
      </section>

      {/* Statistics / Highlights Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Knowledge Nodes", value: "Entities & Themes", icon: "🏛️" },
          { label: "Source Criticism", value: "Bias & Reliability", icon: "⚖️" },
          { label: "Attribution Engine", value: "SHAP Explainability", icon: "🧠" },
          { label: "Graph Storage", value: "PostgreSQL pgvector", icon: "⚡" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-4 rounded-xl border border-white/5 flex items-center gap-3">
            <div className="text-2xl p-2 rounded-lg bg-white/5">{stat.icon}</div>
            <div>
              <div className="text-xs text-gray-400 font-mono uppercase">{stat.label}</div>
              <div className="text-sm font-semibold text-gray-200">{stat.value}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Primary Feature Modules */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-100">Engine Capabilities</h2>
            <p className="text-xs text-gray-400 mt-1">Autonomous multi-agent workflows designed for deep historiography.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="glass-card glass-card-hover p-6 rounded-2xl flex flex-col justify-between border border-white/10 relative overflow-hidden group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-100 group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-white/5">
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>{item.actionText}</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Agent Architecture Process Flow */}
      <section className="glass-card p-8 rounded-2xl border border-white/10 space-y-6 relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500">Autonomous Workflow</span>
          <h2 className="text-2xl font-bold text-gray-100">How the Historiographical Agent Pipeline Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 relative">
              <span className="text-2xl font-extrabold font-mono text-amber-500/40">{s.step}</span>
              <h4 className="text-sm font-bold text-gray-200">{s.title}</h4>
              <p className="text-xs text-gray-400 leading-normal">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

