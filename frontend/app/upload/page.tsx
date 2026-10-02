"use client";

import { useState, useEffect } from 'react';
import { uploadDocument, getDocuments, DocumentItem } from '@/lib/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatusMessage({ text: '⚡ Launching Agent Pipeline (Analyzer → Source Critic → Graph Builder)...', isError: false });
    
    try {
      const doc = await uploadDocument(file);
      setStatusMessage({ 
        text: `✅ Document ID ${doc.id} successfully processed! Entities extracted, source criticized, and graph updated.`, 
        isError: false 
      });
      setFile(null);
      await fetchDocuments();
    } catch (err) {
      setStatusMessage({ text: '❌ Document upload failed. Please verify backend connection.', isError: true });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
          <span>📜 Document Ingestion Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100">
          Upload <span className="gold-gradient-text">Historical Sources</span>
        </h1>
        <p className="text-sm text-gray-400 max-w-2xl">
          Upload primary eyewitness accounts, secondary historiographies, or archival texts to populate the Knowledge Graph and trigger automated source criticism.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Dropzone & Upload Form (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleUpload} className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 relative">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 relative ${
                isDragging 
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]' 
                  : file 
                  ? 'border-amber-500/50 bg-white/[0.02]' 
                  : 'border-white/15 hover:border-white/30 bg-white/[0.01]'
              }`}
            >
              <input 
                type="file" 
                accept=".pdf,.docx,.txt"
                id="file-input"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="hidden"
              />

              <label htmlFor="file-input" className="cursor-pointer space-y-3 flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                  {file ? '📄' : '📥'}
                </div>

                {file ? (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-amber-400">{file.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{(file.size / 1024).toFixed(1)} KB • {file.type || 'Plain Text'}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-200">
                      Drag & drop your historical document here, or <span className="text-amber-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-gray-400">Supports TXT, PDF, DOCX</p>
                  </div>
                )}
              </label>

              {file && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 underline pt-2"
                >
                  Remove selected file
                </button>
              )}
            </div>

            {/* Action Button */}
            <button 
              type="submit" 
              disabled={!file || uploading}
              className="w-full gold-button py-3.5 px-6 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                  <span>Agent Pipeline Processing...</span>
                </>
              ) : (
                <>
                  <span>Upload & Synthesize Document</span>
                  <span>→</span>
                </>
              )}
            </button>

            {/* Status Alert */}
            {statusMessage && (
              <div className={`p-4 rounded-xl text-xs sm:text-sm font-medium border flex items-start gap-3 ${
                statusMessage.isError 
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}>
                <span>{statusMessage.text}</span>
              </div>
            )}
          </form>

          {/* Tips Card */}
          <div className="glass-card p-5 rounded-xl border border-white/5 space-y-2 text-xs text-gray-400">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <span>💡 Historiography Tip</span>
            </div>
            <p>
              Upload documents representing contrasting perspectives on the same event (e.g., Visigoth vs. Roman Senator accounts of the 410 AD Sack of Rome). The <strong>Source Critic Agent</strong> will automatically extract sentiment, detect ideological bias, and adjust graph edge confidence.
            </p>
          </div>
        </div>

        {/* Existing Ingested Documents Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-200">Ingested Sources</h3>
            <span className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
              {documents.length} docs
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 max-h-[480px] overflow-y-auto">
            {loadingDocs ? (
              <div className="text-center py-8 text-xs text-gray-500 animate-pulse">Loading sources...</div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-500">No documents uploaded yet.</div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📜</span>
                    <span className="text-xs font-semibold text-gray-200 truncate flex-1">{doc.filename}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                    <span>ID #{doc.id}</span>
                    <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

