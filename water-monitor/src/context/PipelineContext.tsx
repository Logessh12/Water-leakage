'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Sensor, PipelineSegment, Alert } from '@/lib/types';
import { generateSensors, generateSegments } from '@/lib/mockData';

interface PipelineContextType {
    sensors: Sensor[];
    segments: PipelineSegment[];
    alerts: Alert[];

    isSimulating: boolean;
    toggleSimulation: () => void;
    triggerLeak: (segmentId: string, severity: 'minor' | 'major' | 'critical') => void;
    resolveLeak: (segmentId: string) => void;
    selectedSensorId: string | null;
    setSelectedSensorId: (id: string | null) => void;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

export const PipelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [segments, setSegments] = useState<PipelineSegment[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isSimulating, setIsSimulating] = useState(true);
    const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);

    // Initialize Data
    useEffect(() => {
        const initialSensors = generateSensors();
        const initialSegments = generateSegments(initialSensors);
        setSensors(initialSensors);
        setSegments(initialSegments);
    }, []);

    // Simulation Logic
    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(() => {
            setSensors(prevSensors => {
                const newSensors = prevSensors.map((sensor, index) => {
                    // Add random jitter to normal sensors
                    let flowChange = (Math.random() - 0.5) * 5; // +/- 2.5 L/min
                    let pressureChange = (Math.random() - 0.5) * 0.1; // +/- 0.05 bar

                    // Propagate flow reduction if upstream has leak
                    // This is a simplified simulation
                    // For now, leaks are handled by explicitly reducing downstream flow

                    return {
                        ...sensor,
                        metrics: {
                            ...sensor.metrics,
                            flowRate: Math.max(0, sensor.metrics.flowRate + flowChange),
                            pressure: Math.max(0, sensor.metrics.pressure + pressureChange),
                        },
                        lastUpdate: new Date(),
                    };
                });
                return newSensors;
            });

            // Check for leaks and update segments
            setSegments(prevSegments => {
                return prevSegments.map(segment => {
                    if (segment.status === 'normal') return segment;

                    // If segment has leak, update metrics
                    // In a real simulation, we would reduce downstream sensor values here
                    // But for visualization, we just mark the segment

                    return {
                        ...segment,
                        metrics: {
                            ...segment.metrics,
                            // Randomly fluctuate leak metrics
                            estimatedLeakRate: segment.metrics.estimatedLeakRate + (Math.random() - 0.5),
                        }
                    };
                });
            });

        }, 3000); // 3 seconds per tick

        return () => clearInterval(interval);
    }, [isSimulating]);

    // Leak Detection Logic (runs whenever sensors update)
    useEffect(() => {
        if (sensors.length === 0) return;

        setSegments(currentSegments => {
            return currentSegments.map((segment, index) => {
                const startSensor = sensors[index];
                const endSensor = sensors[index + 1];

                if (!startSensor || !endSensor) return segment;

                // Simple physics: Flow out should roughly equal Flow in
                // Leak = FlowIn - FlowOut
                // We need to account for the fact that we might have artificially modified the downstream sensor 
                // to simulate the leak effect.

                // Actually, let's keep it simple:
                // We trigger a leak -> We modify the downstream sensor's flow to be much lower.
                // Then this detection logic picks it up.

                // However, to make the "trigger" function work, we need to store the "leak state" in the segment
                // and let the simulation reduce the downstream flow.

                // Let's reverse: The trigger sets the segment status.
                // The simulation effect handles the data.

                return segment;
            });
        });
    }, [sensors]);

    const triggerLeak = (segmentId: string, severity: 'minor' | 'major' | 'critical') => {
        setSegments(prev => prev.map(seg => {
            if (seg.id === segmentId) {
                return {
                    ...seg,
                    status: severity === 'minor' ? 'minor_leak' : severity === 'major' ? 'major_leak' : 'critical',
                    metrics: {
                        ...seg.metrics,
                        estimatedLeakRate: severity === 'minor' ? 50 : severity === 'major' ? 200 : 500,
                        pressureDrop: severity === 'minor' ? 2 : severity === 'major' ? 5 : 10,
                    }
                };
            }
            return seg;
        }));

        // Also add an alert
        const newAlert: Alert = {
            id: Date.now().toString(),
            type: 'leak',
            severity: severity === 'minor' ? 'warning' : 'critical',
            message: `Leak detected in segment ${segmentId} - Severity: ${severity}`,
            timestamp: new Date(),
            isRead: false
        };
        setAlerts(prev => [newAlert, ...prev]);
    };

    const resolveLeak = (segmentId: string) => {
        setSegments(prev => prev.map(seg => {
            if (seg.id === segmentId) {
                return {
                    ...seg,
                    status: 'normal',
                    metrics: {
                        ...seg.metrics,
                        estimatedLeakRate: 0,
                        pressureDrop: 0,
                    }
                };
            }
            return seg;
        }));

        const newAlert: Alert = {
            id: Date.now().toString(),
            type: 'system',
            severity: 'info',
            message: `Leak resolved in segment ${segmentId}`,
            timestamp: new Date(),
            isRead: false
        };
        setAlerts(prev => [newAlert, ...prev]);
    };

    const toggleSimulation = () => setIsSimulating(!isSimulating);

    return (
        <PipelineContext.Provider value={{
            sensors,
            segments,
            alerts,
            isSimulating,
            toggleSimulation,
            triggerLeak,
            resolveLeak,
            selectedSensorId,
            setSelectedSensorId
        }}>
            {children}
        </PipelineContext.Provider>
    );
};

export const usePipeline = () => {
    const context = useContext(PipelineContext);
    if (context === undefined) {
        throw new Error('usePipeline must be used within a PipelineProvider');
    }
    return context;
};
