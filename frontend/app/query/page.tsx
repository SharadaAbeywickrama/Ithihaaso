"use client";
import { useState } from 'react';
import { askQuestion } from '@/lib/api';
import ShapExplanationPanel from '@/components/ShapExplanationPanel';

export default function QueryPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question) return;

    setLoading(true);
    setResponse(null);
    
    try {
      const res = await askQuestion(question);
      setResponse(res);
    } catch (err) {
      alert("Error performing query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Ask the Agents</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="E.g., What were the primary causes of the event according to the sources?"
            className="flex-1 border border-slate-300 rounded p-3 text-lg"
          />
          <button 
            type="submit" 
            disabled={loading || !question}
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded disabled:bg-blue-300"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </form>

      {response && (
        <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Answer</h2>
          <div className="prose max-w-none mb-6">
            {response.answer}
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold text-slate-700 mb-2">Sources Cited:</h3>
            <ul className="list-disc pl-5">
              {response.citations.map((c: string, i: number) => (
                <li key={i} className="text-sm text-slate-600">{c}</li>
              ))}
            </ul>
          </div>

          {response.explanation_id && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-bold mb-4">SHAP Attribution Explanation</h3>
              <ShapExplanationPanel targetType="query" targetId={response.explanation_id.toString()} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
