export interface Sensor {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    km: number; // kilometre marker
  };
  metrics: {
    flowRate: number; // L/min or m3/h
    pressure: number; // bar
    temperature: number; // celsius
    battery: number; // %
    signalStrength: number; // dBm
  };
  status: 'normal' | 'minor_error' | 'offline';
  lastUpdate: Date;
}

export interface PipelineSegment {
  id: string;
  startSensorId: string;
  endSensorId: string;
  distance: number; // meters
  status: 'normal' | 'minor_leak' | 'major_leak' | 'critical';
  metrics: {
    flowDiff: number; // Difference in flow rate
    estimatedLeakRate: number; // L/min
    pressureDrop: number; // bar
  };
}

export interface LeakEvent {
  id: string;
  segmentId: string;
  severity: 'minor' | 'major' | 'critical';
  timestamp: Date;
  location: {
    lat: number;
    lng: number;
    description: string;
  };
  status: 'new' | 'assigned' | 'in_progress' | 'resolved';
  technicianId?: string;
  notes?: string;
}

export interface Technician {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  currentLocation?: {
    lat: number;
    lng: number;
  };
}

export type AlertType = 'leak' | 'sensor_failure' | 'battery_low' | 'system';

export interface Alert {
  id: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  isRead: boolean;
}
