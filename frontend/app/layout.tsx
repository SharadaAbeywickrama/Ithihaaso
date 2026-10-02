import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ithihaaso — Autonomous Historiographical AI Platform",
  description: "Synthesize historical sources, detect historiographical bias, and explore interactive knowledge graphs with multi-agent intelligence.",
  keywords: ["history", "knowledge graph", "AI historiography", "source criticism", "SHAP explanations", "multi-agent AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#0B0F19] text-gray-100 min-h-screen flex flex-col selection:bg-amber-500/30 selection:text-amber-300`}>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-white/5 bg-[#0B0F19]/80 backdrop-blur-md py-6 text-center text-xs text-gray-500">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-semibold text-gray-400">Ithihaaso</span>
              <span>— Multi-Agent Historiographical Intelligence Platform</span>
            </div>
            <p>© {new Date().getFullYear()} Ithihaaso Engine. Powered by Multi-Agent LLMs & SHAP Explanations.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

