'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { usePipeline } from '@/context/PipelineContext';
import { Sensor, PipelineSegment } from '@/lib/types';
import clsx from 'clsx';

// Type fix for Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: '/marker-icon-2x.png',
//   iconUrl: '/marker-icon.png',
//   shadowUrl: '/marker-shadow.png',
// });

const CenterMap = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13);
    }, [center, map]);
    return null;
};

const PipelineMap = () => {
    const { sensors, segments, selectedSensorId, setSelectedSensorId } = usePipeline();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-full w-full bg-slate-900 animate-pulse">Loading Map...</div>;

    if (sensors.length === 0) return <div>No sensors data</div>;

    const center: [number, number] = [sensors[0].location.lat, sensors[0].location.lng];

    // Helper to create custom icons


    // Custom Icon Helper
    const createSensorIcon = (sensor: Sensor, selectedSensorId: string | null) => {
        const isLeak = sensor.status !== 'normal';
        const statusClass = sensor.status === 'normal' ? 'status-normal' :
            sensor.status === 'minor_error' ? 'status-warning' : 'status-danger';

        // Highlight if selected
        const isSelected = selectedSensorId === sensor.id;
        // const selectedClass = isSelected ? 'scale-125 z-50 ring-2 ring-white/50' : '';

        return L.divIcon({
            className: 'leaflet-div-icon', // Override default
            html: `
        <div class="pin-3d-container ${isSelected ? 'selected' : ''}">
          <div class="pin-wrapper">
             <div class="pin-head ${statusClass}"></div>
          </div>
          <div class="pin-shadow-ground"></div>
          
          <div class="pin-info-card">
             <div class="text-xs font-bold font-mono">${sensor.metrics.flowRate.toFixed(0)} L/m</div>
             <div class="text-[0.6rem] uppercase opacity-70">Pressure: ${sensor.metrics.pressure.toFixed(1)}</div>
          </div>
        </div>
      `,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
        });
    };

    const getSegmentColor = (status: PipelineSegment['status']) => {
        switch (status) {
            case 'normal': return '#10b981'; // Green
            case 'minor_leak': return '#f59e0b'; // Yellow
            case 'major_leak': return '#ef4444'; // Red
            case 'critical': return '#b91c1c'; // Dark Red
            default: return '#3b82f6';
        }
    };

    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-slate-700 shadow-lg relative z-0">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {/* Draw Segments */}
                {segments.map((segment) => {
                    const start = sensors.find(s => s.id === segment.startSensorId);
                    const end = sensors.find(s => s.id === segment.endSensorId);

                    if (!start || !end) return null;

                    return (
                        <Polyline
                            key={segment.id}
                            positions={[
                                [start.location.lat, start.location.lng],
                                [end.location.lat, end.location.lng]
                            ]}
                            pathOptions={{
                                color: getSegmentColor(segment.status),
                                weight: 6,
                                opacity: 0.8,
                                dashArray: segment.status !== 'normal' ? '10, 10' : undefined
                            }}
                        >
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold text-slate-900">Segment {segment.id}</h3>
                                    <p className="text-slate-600">Status: <span className={clsx('font-bold', {
                                        'text-green-600': segment.status === 'normal',
                                        'text-yellow-600': segment.status === 'minor_leak',
                                        'text-red-600': segment.status === 'major_leak' || segment.status === 'critical',
                                    })}>{segment.status}</span></p>
                                    <p className="text-slate-600">Distance: {segment.distance}m</p>
                                    {segment.status !== 'normal' && (
                                        <div className="mt-2 bg-red-50 p-2 rounded">
                                            <p className="text-red-700 font-semibold">Leak Detected!</p>
                                            <p className="text-red-600 text-sm">Est. Rate: {segment.metrics.estimatedLeakRate.toFixed(1)} L/min</p>
                                        </div>
                                    )}
                                </div>
                            </Popup>
                        </Polyline>
                    );
                })}

                {/* Draw Sensors */}
                {sensors.map((sensor) => (
                    <Marker
                        key={sensor.id}
                        position={[sensor.location.lat, sensor.location.lng]}
                        icon={createSensorIcon(sensor, selectedSensorId)}
                        eventHandlers={{
                            click: () => setSelectedSensorId(sensor.id),
                        }}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-slate-800 border-b pb-1 mb-2">{sensor.name}</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-slate-500">Flow Rate:</div>
                                    <div className="font-mono text-slate-900 font-bold">{sensor.metrics.flowRate.toFixed(1)} L/m</div>

                                    <div className="text-slate-500">Pressure:</div>
                                    <div className="font-mono text-slate-900 font-bold">{sensor.metrics.pressure.toFixed(2)} bar</div>

                                    <div className="text-slate-500">Battery:</div>
                                    <div className={clsx("font-bold", {
                                        'text-green-600': sensor.metrics.battery > 50,
                                        'text-yellow-600': sensor.metrics.battery <= 50 && sensor.metrics.battery > 20,
                                        'text-red-600': sensor.metrics.battery <= 20
                                    })}>{sensor.metrics.battery.toFixed(0)}%</div>
                                </div>
                                <div className="mt-2 text-xs text-slate-400 text-right">
                                    Updated: {new Date(sensor.lastUpdate).toLocaleTimeString()}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {/* <CenterMap center={center} /> Only center initially */}
            </MapContainer>
        </div>
    );
};

export default PipelineMap;
