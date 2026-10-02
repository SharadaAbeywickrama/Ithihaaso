"use client";

import { useState } from 'react';
import { askQuestion } from '@/lib/api';
import ShapExplanationPanel from '@/components/ShapExplanationPanel';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  citations?: string[];
  explanationId?: string | number;
  timestamp: string;
}

export default function QueryPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [openExplanationId, setOpenExplanationId] = useState<string | number | null>(null);

  const starterQuestions = [
    "Compare the Roman Senator vs. Visigoth accounts of the Sack of Rome.",
    "What historiographical biases exist in the primary sources?",
    "Summarize the key historical figures and their recorded actions.",
  ];

  const handleAsk = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await askQuestion(queryText);
      const agentMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: res.answer,
        citations: res.citations || [],
        explanationId: res.explanation_id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMsg]);
      if (res.explanation_id) {
        setOpenExplanationId(res.explanation_id);
      }
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: "⚠️ An error occurred while consulting the historiographical agent pipeline. Please ensure the backend server is active.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAsk(question);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Page Title Header */}
      <div className="space-y-2 text-center sm:text-left shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-400">
          <span>🧠 Source Critic & SHAP Attribution Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-100">
          AI Historiographical <span className="gold-gradient-text">Query Agent</span>
        </h1>
        <p className="text-xs text-gray-400">
          Ask complex historical questions. The multi-agent system synthesizes citations with transparent SHAP attributions.
        </p>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col relative">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center p-6 my-auto">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(139,92,246,0.2)]">
                🏛️
              </div>
              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold text-gray-200">Start your historiographical investigation</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Select a starter query below or ask your own question about primary accounts, bias stances, or entity relationships.
                </p>
              </div>

              {/* Starter Questions Grid */}
              <div className="grid grid-cols-1 gap-3 w-full max-w-xl text-left">
                {starterQuestions.map((sq, i) => (
                  <button
                    key={i}
                    onClick={() => handleAsk(sq)}
                    className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-amber-500/10 border border-white/5 hover:border-amber-500/30 text-xs font-medium text-gray-300 hover:text-amber-300 transition-all text-left flex items-center justify-between group"
                  >
                    <span>"{sq}"</span>
                    <span className="text-amber-500 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold border ${
                  msg.sender === 'user'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                }`}>
                  {msg.sender === 'user' ? '👤' : '🏛️'}
                </div>

                {/* Bubble Container */}
                <div className="space-y-3 flex-1">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                    msg.sender === 'user'
                      ? 'bg-amber-500/10 border-amber-500/25 text-gray-100 rounded-tr-none'
                      : 'glass-card border-white/10 text-gray-200 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="text-[10px] font-mono text-gray-500 mt-2 text-right">
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Agent Citations & SHAP Toggle */}
                  {msg.sender === 'agent' && (
                    <div className="space-y-3">
                      {/* Citations Badges */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                          <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider flex items-center gap-1.5">
                            <span>📜 Primary Sources Cited</span>
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((c, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-mono"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SHAP Explanation Toggle Button */}
                      {msg.explanationId && (
                        <div>
                          <button
                            onClick={() =>
                              setOpenExplanationId(
                                openExplanationId === msg.explanationId ? null : msg.explanationId!
                              )
                            }
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300 hover:text-purple-200 hover:bg-purple-500/20 transition-all"
                          >
                            <span>🧠 {openExplanationId === msg.explanationId ? 'Hide SHAP Attributions' : 'Inspect SHAP Feature Attributions'}</span>
                            <span className="text-[10px]">{openExplanationId === msg.explanationId ? '▲' : '▼'}</span>
                          </button>

                          {openExplanationId === msg.explanationId && (
                            <div className="mt-3">
                              <ShapExplanationPanel
                                targetType="query"
                                targetId={msg.explanationId.toString()}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Thinking indicator */}
          {loading && (
            <div className="flex gap-3 max-w-xl mr-auto items-center">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center text-sm">
                🏛️
              </div>
              <div className="glass-card p-4 rounded-2xl border border-white/10 text-xs font-mono text-amber-400 flex items-center gap-3">
                <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></span>
                <span>Agents consulting Knowledge Graph & evaluating source bias...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0B0F19]/90 backdrop-blur-md shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a historiographical question (e.g. 'Compare source perspectives on the 410 AD Sack...')"
              className="flex-1 glass-input rounded-xl px-4 py-3 text-sm placeholder:text-gray-500"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="gold-button px-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Ask</span>
              <span>→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

