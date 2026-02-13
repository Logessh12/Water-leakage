'use client';

import React, { useEffect, useState } from 'react';
import { usePipeline } from '@/context/PipelineContext';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Activity, Droplet, Zap, AlertCircle } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';

const NumberTicker = ({ value }: { value: number }) => {
    const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => current.toFixed(value % 1 === 0 ? 0 : 2));

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
};

const StatsPanel = () => {
    const { sensors, segments } = usePipeline();
    const [history, setHistory] = useState<{ time: string; pressure: number; flow: number }[]>([]);

    // Calculate Aggregates
    const avgPressure = sensors.length > 0
        ? sensors.reduce((acc, s) => acc + s.metrics.pressure, 0) / sensors.length
        : 0;

    const totalFlow = sensors.length > 0 ? sensors[0].metrics.flowRate : 0; // Input flow

    const activeLeaks = segments.filter(s => s.status !== 'normal').length;

    const systemHealth = activeLeaks === 0 ? 100 : Math.max(0, 100 - (activeLeaks * 20));

    useEffect(() => {
        if (sensors.length === 0) return;

        // Update history whenever sensors change (which happens every 3s from context)
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setHistory(prev => {
            const newPoint = {
                time: timeStr,
                pressure: parseFloat(avgPressure.toFixed(2)),
                flow: parseFloat(totalFlow.toFixed(0))
            };
            const newHistory = [...prev, newPoint];
            if (newHistory.length > 20) newHistory.shift();
            return newHistory;
        });
    }, [sensors, avgPressure, totalFlow]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-blue-500/10 hover:shadow-lg">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="h-16 w-16 text-blue-500" />
                </div>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Avg Pressure</h3>
                <div className="text-2xl font-bold text-white mb-2 flex items-center gap-1">
                    <NumberTicker value={avgPressure} />
                    <span className="text-sm font-normal text-slate-500">bar</span>
                </div>
                <div className="h-10 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <Area type="monotone" dataKey="pressure" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group hover:border-cyan-500/30 transition-all hover:-translate-y-1 hover:shadow-cyan-500/10 hover:shadow-lg">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Droplet className="h-16 w-16 text-cyan-500" />
                </div>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Input Flow</h3>
                <div className="text-2xl font-bold text-white mb-2 flex items-center gap-1">
                    <NumberTicker value={totalFlow} />
                    <span className="text-sm font-normal text-slate-500">L/min</span>
                </div>
                <div className="h-10 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history}>
                            <Area type="monotone" dataKey="flow" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group hover:border-red-500/30 transition-all hover:-translate-y-1 hover:shadow-red-500/10 hover:shadow-lg">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <AlertCircle className="h-16 w-16 text-red-500" />
                </div>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Active Leaks</h3>
                <div className="text-2xl font-bold text-white mb-2">
                    <NumberTicker value={activeLeaks} />
                    <span className="text-sm font-normal text-slate-500 ml-1">Segments</span>
                </div>
                <div className="text-xs text-red-400 mt-2 font-medium flex items-center gap-1">
                    {activeLeaks > 0 && <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                    {activeLeaks > 0 ? "Critical attention required" : "System stable"}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all hover:-translate-y-1 hover:shadow-emerald-500/10 hover:shadow-lg">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="h-16 w-16 text-emerald-500" />
                </div>
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">System Health</h3>
                <div className="text-2xl font-bold text-white mb-2">
                    <NumberTicker value={systemHealth} />
                    <span>%</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${systemHealth}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default StatsPanel;
