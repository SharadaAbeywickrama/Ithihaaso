"use client";
import { useState } from 'react';
import { uploadDocument } from '@/lib/api';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage('Uploading and analyzing document...');
    
    try {
      const doc = await uploadDocument(file);
      setMessage(`Success! Document ID ${doc.id} uploaded. The agents are now processing it in the background.`);
      setFile(null);
    } catch (err) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Upload Historical Document</h1>
      
      <form onSubmit={handleUpload} className="bg-white p-8 rounded-xl shadow border border-slate-200">
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select File (PDF, DOCX, TXT)</label>
          <input 
            type="file" 
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={!file || uploading}
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload & Process'}
        </button>

        {message && (
          <div className={`mt-4 p-4 rounded ${message.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
