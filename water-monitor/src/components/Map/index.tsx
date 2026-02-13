'use client';

import dynamic from 'next/dynamic';

const PipelineMap = dynamic(() => import('./PipelineMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-800 flex items-center justify-center text-slate-400">Loading Map Engine...</div>
});

export default PipelineMap;
