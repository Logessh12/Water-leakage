'use client';

import React from 'react';
import { usePipeline } from '@/context/PipelineContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

const Flow3DVisualizer = () => {
    const { sensors, selectedSensorId, setSelectedSensorId } = usePipeline();
    const sensor = sensors.find(s => s.id === selectedSensorId);

    if (!selectedSensorId || !sensor) return null;

    // Determine pipe status colors
    const isLeak = sensor.status !== 'normal';
    const flowColor = isLeak ? '#ef4444' : '#3b82f6';
    const flowSpeed = Math.max(0.5, 5 - (sensor.metrics.flowRate / 200)); // Lower is faster animation duration

    return (
        <AnimatePresence>
            {selectedSensorId && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    className="absolute bottom-6 left-6 z-30 w-[400px] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-slate-800 to-slate-900">
                        <div>
                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                <span className={clsx("w-2 h-2 rounded-full", isLeak ? "bg-red-500 animate-pulse" : "bg-green-500")} />
                                Digital Twin View
                            </h3>
                            <p className="text-xs text-slate-400 font-mono tracking-wider">{sensor.name.toUpperCase()}</p>
                        </div>
                        <button
                            onClick={() => setSelectedSensorId(null)}
                            className="text-slate-400 hover:text-white transition-colors bg-white/5 rounded-full p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* 3D Pipe Visualization */}
                    <div className="relative h-48 w-full bg-slate-950 flex items-center justify-center overflow-hidden perspective-container">

                        {/* Grid Background */}
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                                transform: 'perspective(500px) rotateX(60deg) translateY(-50px) scale(2)'
                            }}
                        />

                        {/* Pipe Container */}
                        <div className="relative w-64 h-24 preserve-3d pipe-assembly">

                            {/* Pipe Body (Cylinder effect using gradient) */}
                            <div className="absolute inset-0 rounded-lg overflow-hidden border-y border-slate-600/30 bg-slate-800/20 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)_inset]">

                                {/* Liquid Stream */}
                                <div
                                    className="absolute top-[20%] bottom-[20%] left-0 right-0 opacity-80"
                                    style={{
                                        background: `linear-gradient(90deg, 
                                            transparent 0%, 
                                            ${flowColor}20 20%, 
                                            ${flowColor}60 50%, 
                                            ${flowColor}20 80%, 
                                            transparent 100%)`,
                                    }}
                                >
                                    {/* Flow Particles */}
                                    <div className="absolute inset-0 flex items-center overflow-hidden">
                                        {[...Array(8)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute w-12 h-1 rounded-full bg-white/40 blur-[1px]"
                                                style={{
                                                    left: '-20%',
                                                    top: `${Math.random() * 100}%`,
                                                    animation: `flow-particle ${flowSpeed * (0.5 + Math.random())}s linear infinite`,
                                                    animationDelay: `${Math.random() * 2}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Pipe Gloss/Reflection */}
                                <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-black/40 to-transparent" />

                            </div>

                            {/* End Caps (To give depth illusion) */}
                            <div className="absolute left-0 top-0 bottom-0 w-4 bg-slate-700 rounded-l-md border-r border-black/50" />
                            <div className="absolute right-0 top-0 bottom-0 w-4 bg-slate-700 rounded-r-md border-l border-black/50" />

                            {/* Flow Direction Arrows */}
                            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                                <span className="animate-bounce delay-100 text-slate-500">›</span>
                                <span className="animate-bounce delay-200 text-slate-500">›</span>
                                <span className="animate-bounce delay-300 text-slate-500">›</span>
                            </div>
                        </div>

                    </div>

                    {/* Sensor Metrics Overlay */}
                    <div className="grid grid-cols-2 divide-x divide-slate-800 border-t border-slate-800 bg-slate-900/50">
                        <div className="p-4 text-center group hover:bg-white/5 transition-colors cursor-default">
                            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Live Flow</p>
                            <div className="text-2xl font-bold font-mono text-cyan-400">
                                {sensor.metrics.flowRate.toFixed(1)} <span className="text-sm text-cyan-500/50">L/m</span>
                            </div>
                        </div>
                        <div className="p-4 text-center group hover:bg-white/5 transition-colors cursor-default">
                            <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Pressure</p>
                            <div className="text-2xl font-bold font-mono text-blue-400">
                                {sensor.metrics.pressure.toFixed(2)} <span className="text-sm text-blue-500/50">bar</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500 px-4">
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Connection Stable
                        </span>
                        <button className="flex items-center gap-1 hover:text-white transition-colors">
                            Full Analysis <ExternalLink className="w-3 h-3" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Flow3DVisualizer;
