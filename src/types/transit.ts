export type VehicleType = 'SD' | 'DD' | 'BD'; // Single Decker, Double Decker, Bendy
export type CrowdingLevel = 'SEATS_AVAILABLE' | 'STANDING_AVAILABLE' | 'LIMITED_STANDING';
export type ServiceCategory = 'Trunk' | 'Feeder' | 'Express' | 'Night Rider';

export interface NextBusArrival {
  estimatedArrivalMin: number; // 0 = "Arr", 1 = "1 min", etc.
  vehicleType: VehicleType;
  wheelchairAccessible: boolean; // WAB
  crowdLevel: CrowdingLevel;
  busPlate?: string;
}

export interface BusServiceArrival {
  serviceNo: string;
  operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  category: ServiceCategory;
  destinationName: string;
  destinationCode: string;
  nextBus: NextBusArrival;
  nextBus2?: NextBusArrival;
  nextBus3?: NextBusArrival;
  pinned?: boolean;
}

export interface BusStop {
  id: string; // e.g. "09023"
  name: string; // e.g. "Opp Orchard Stn"
  road: string; // e.g. "Orchard Boulevard"
  distanceMeters: number;
  directionTowards: string; // e.g. "Towards Somerset / Dhoby Ghaut"
  mrtInterchange?: string[]; // e.g. ["NS22", "TE14"]
  services: string[]; // e.g. ["65", "147", "190", "7", "14e", "166"]
}

export interface RouteStopProgression {
  stopCode: string;
  stopName: string;
  roadName: string;
  sequence: number;
  distanceKm: number;
  mrtInterchange?: string[];
  activeBusHere?: {
    plate: string;
    vehicleType: VehicleType;
    crowdLevel: CrowdingLevel;
    speedKmH: number;
  };
}

export interface BusRouteDetails {
  serviceNo: string;
  operator: string;
  origin: string;
  destination: string;
  firstBus: string;
  lastBus: string;
  frequencyPeak: string;
  frequencyOffPeak: string;
  loopRoute?: boolean;
  direction1: {
    origin: string;
    destination: string;
    stops: RouteStopProgression[];
  };
  direction2?: {
    origin: string;
    destination: string;
    stops: RouteStopProgression[];
  };
}

export interface MRTLineInfo {
  code: string;
  name: string;
  color: string;
  textColor: string;
  operator: 'SBS Transit' | 'SMRT';
  status: 'Normal Service' | 'Minor Delays' | 'Track Maintenance';
  currentIntervalMin: number;
  stationsCount: number;
  crowdLevel: CrowdingLevel;
  highlightStation: {
    stationCode: string;
    stationName: string;
    nextTrainTowards1: { destination: string; mins: number };
    nextTrainTowards2: { destination: string; mins: number };
  };
}

export interface JourneyStep {
  type: 'WALK' | 'BUS' | 'MRT';
  instruction: string;
  serviceOrLine?: string;
  stopsCount?: number;
  durationMins: number;
  fromLocation: string;
  toLocation: string;
}

export interface JourneyOption {
  id: string;
  title: string;
  totalDurationMins: number;
  fareAdultCard: number; // e.g. 1.54
  fareStudent: number;
  fareSenior: number;
  transfersCount: number;
  walkingMins: number;
  departureTime: string;
  arrivalTime: string;
  steps: JourneyStep[];
}

export interface ServiceAlert {
  id: string;
  title: string;
  type: 'DISRUPTION' | 'DIVERSION' | 'HOLIDAY_EXTENSION' | 'ADVISORY';
  affectedRoutes: string[];
  date: string;
  time: string;
  message: string;
}
