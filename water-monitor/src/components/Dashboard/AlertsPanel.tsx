'use client';

import React from 'react';
import { usePipeline } from '@/context/PipelineContext';
import { AlertTriangle, UserCheck, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const AlertsPanel = () => {
    const { alerts, resolveLeak, triggerLeak } = usePipeline();

    const handleResolve = (id: string) => {
        const match = alerts.find(a => a.id === id)?.message.match(/segment ([\w-]+)/);
        if (match) {
            resolveLeak(match[1]);
        }
    };

    return (
        <div className="w-80 h-full fixed right-0 top-0 pt-16 bg-slate-900 border-l border-slate-800 flex flex-col z-30 shadow-xl scrollbar-hide">
            <div className="p-4 border-b border-slate-700 bg-slate-900/95 backdrop-blur z-10 sticky top-0">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Active Alerts</h3>
                <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{alerts.length} Warnings/Events</span>
                    <button
                        onClick={() => triggerLeak('segment-2', 'minor')}
                        className="text-blue-500 hover:text-blue-400 text-xs px-2 py-1 rounded hover:bg-blue-500/10 transition-colors"
                    >
                        Simulate Leak
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence mode='popLayout'>
                    {alerts.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="text-center py-10 text-slate-500 text-sm"
                        >
                            <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            No active alerts.<br />System running normally.
                        </motion.div>
                    ) : (
                        alerts.map((alert) => (
                            <motion.div
                                layout
                                key={alert.id}
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 50, opacity: 0 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className={clsx(
                                    "p-4 rounded-lg border flex gap-3 relative overflow-hidden",
                                    {
                                        "bg-red-500/10 border-red-500/30 text-red-200": alert.severity === 'critical',
                                        "bg-orange-500/10 border-orange-500/30 text-orange-200": alert.severity === 'warning',
                                        "bg-blue-500/10 border-blue-500/30 text-blue-200": alert.severity === 'info',
                                    }
                                )}
                            >
                                <div className={clsx(
                                    "w-1 h-full absolute left-0 top-0",
                                    {
                                        "bg-red-500": alert.severity === 'critical',
                                        "bg-orange-500": alert.severity === 'warning',
                                        "bg-blue-500": alert.severity === 'info',
                                    }
                                )} />

                                <div className="shrink-0 mt-1 z-10">
                                    {alert.severity === 'critical' || alert.severity === 'warning' ? (
                                        <AlertTriangle className={clsx("h-5 w-5", { "animate-pulse": alert.severity === 'critical' })} />
                                    ) : (
                                        <UserCheck className="h-5 w-5" />
                                    )}
                                </div>

                                <div className="flex-1 z-10">
                                    <p className="text-xs font-bold uppercase mb-1 opacity-80">{alert.type}</p>
                                    <div className="text-sm font-medium leading-tight mb-2">{alert.message}</div>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                                        <span className="text-xs opacity-60">{alert.timestamp.toLocaleTimeString()}</span>
                                        {(alert.severity === 'critical' || alert.severity === 'warning') && (
                                            <button
                                                onClick={() => handleResolve(alert.id)}
                                                className="text-xs font-semibold px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Background abstract shape */}
                                <div className={clsx("absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 blur-xl", {
                                    "bg-red-500": alert.severity === 'critical',
                                    "bg-orange-500": alert.severity === 'warning',
                                    "bg-blue-500": alert.severity === 'info',
                                })} />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AlertsPanel;
