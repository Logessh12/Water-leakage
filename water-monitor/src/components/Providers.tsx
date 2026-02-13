'use client';

import { PipelineProvider } from '@/context/PipelineContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PipelineProvider>
            {children}
        </PipelineProvider>
    );
}
