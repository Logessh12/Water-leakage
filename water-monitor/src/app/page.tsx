'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Dashboard/Sidebar';
import Header from '@/components/Dashboard/Header';
import StatsPanel from '@/components/Dashboard/StatsPanel';
import AlertsPanel from '@/components/Dashboard/AlertsPanel';
import Flow3DVisualizer from '@/components/Visualization/Flow3DVisualizer';
import { motion } from 'framer-motion';

// Dynamic import for Map to avoid SSR issues
const PipelineMap = dynamic(() => import('@/components/Map/PipelineMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-slate-400 bg-slate-900">Initializing Geospatial Engine...</div>
});

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col ml-64 mr-80 relative transition-all duration-300">
        <Header />

        <main className="flex-1 mt-16 p-6 overflow-hidden flex flex-col relative z-0">
          <StatsPanel />

          <div className="flex-1 flex gap-6 min-h-0 relative">
            {/* Map Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex-1 bg-slate-900 rounded-xl border border-slate-800 relative shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur px-3 py-1 rounded border border-slate-700 text-xs font-mono text-slate-400 shadow-lg">
                LIVE SENSOR FEED • SYSTEM ACTIVE
              </div>
              <div className="flex-1 relative z-0">
                <PipelineMap />
                <Flow3DVisualizer />
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      <AlertsPanel />
    </div>
  );
}
