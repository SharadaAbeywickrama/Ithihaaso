import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="text-xl font-bold">
        <Link href="/">🏛️ Ithihaaso</Link>
      </div>
      <div className="space-x-6">
        <Link href="/" className="hover:text-blue-300">Dashboard</Link>
        <Link href="/upload" className="hover:text-blue-300">Upload</Link>
        <Link href="/graph" className="hover:text-blue-300">Knowledge Graph</Link>
        <Link href="/query" className="hover:text-blue-300">Query Agent</Link>
      </div>
    </nav>
  );
}
