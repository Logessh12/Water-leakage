import { PipelineSegment, Sensor, Technician } from './types';

// Constants
const START_LAT = 12.9716; // Example: Bangalore
const START_LNG = 77.5946;
const PIPELINE_LENGTH_KM = 20;
const SENSOR_INTERVAL_KM = 1;

// Generate Sensors
export const generateSensors = (): Sensor[] => {
    const sensors: Sensor[] = [];
    for (let i = 0; i <= PIPELINE_LENGTH_KM; i += SENSOR_INTERVAL_KM) {
        // Simulate a slightly curved path
        const lat = START_LAT + (i * 0.01) + (Math.sin(i * 0.5) * 0.002);
        const lng = START_LNG + (i * 0.01) + (Math.cos(i * 0.5) * 0.002);

        sensors.push({
            id: `sensor-${i}`,
            name: `Sensor KM-${i}`,
            location: {
                lat,
                lng,
                km: i,
            },
            metrics: {
                flowRate: 1000 - (i * 2), // Base flow decreases slightly
                pressure: 50 - (i * 0.5), // Base pressure drops slightly
                temperature: 25 + Math.random(),
                battery: 90 + (Math.random() * 10),
                signalStrength: -60 - (Math.random() * 20),
            },
            status: 'normal',
            lastUpdate: new Date(),
        });
    }
    return sensors;
};

// Generate Segments based on sensors
export const generateSegments = (sensors: Sensor[]): PipelineSegment[] => {
    const segments: PipelineSegment[] = [];
    for (let i = 0; i < sensors.length - 1; i++) {
        segments.push({
            id: `segment-${i}`,
            startSensorId: sensors[i].id,
            endSensorId: sensors[i + 1].id,
            distance: 1000,
            status: 'normal',
            metrics: {
                flowDiff: 0,
                estimatedLeakRate: 0,
                pressureDrop: 0,
            },
        });
    }
    return segments;
};

export const MOCK_TECHNICIANS: Technician[] = [
    { id: 'tech-1', name: 'John Doe', status: 'available', currentLocation: { lat: START_LAT, lng: START_LNG } },
    { id: 'tech-2', name: 'Jane Smith', status: 'busy', currentLocation: { lat: START_LAT + 0.05, lng: START_LNG + 0.05 } },
    { id: 'tech-3', name: 'Mike Johnson', status: 'offline' },
];
