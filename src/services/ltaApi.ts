import { BusServiceArrival, CrowdingLevel, VehicleType } from '../types/transit';

export interface LtaRawBusItem {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
}

export interface LtaRawService {
  ServiceNo: string;
  Operator: 'SBST' | 'SMRT' | 'TTS' | 'GAS';
  NextBus?: LtaRawBusItem;
  NextBus2?: LtaRawBusItem;
  NextBus3?: LtaRawBusItem;
}

export interface LtaApiResponse {
  odata_metadata?: string;
  BusStopCode: string;
  Services: LtaRawService[];
  source?: string;
  warning?: string;
}

export interface ApiHealthStatus {
  status: string;
  uptime: number;
  timestamp: string;
  service: string;
  ltaApiConfigured: boolean;
  endpoints: Array<{ path: string; method: string; description: string }>;
}

function parseMinutes(isoDateStr?: string): number {
  if (!isoDateStr) return 99;
  const target = new Date(isoDateStr).getTime();
  const now = Date.now();
  const diffMs = target - now;
  const mins = Math.round(diffMs / 60000);
  return Math.max(0, mins);
}

function parseLoad(load?: string): CrowdingLevel {
  if (load === 'LSD') return 'LIMITED_STANDING';
  if (load === 'SDA') return 'STANDING_AVAILABLE';
  return 'SEATS_AVAILABLE';
}

function parseVehicleType(type?: string): VehicleType {
  if (type === 'DD') return 'DD';
  if (type === 'BD') return 'BD';
  return 'SD';
}

export async function fetchLtaBusArrival(
  busStopCode: string,
  serviceNo?: string
): Promise<{
  services: BusServiceArrival[];
  raw?: LtaApiResponse;
  isRealData: boolean;
  warning?: string;
}> {
  let url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
  if (serviceNo) {
    url += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data: LtaApiResponse = await res.json();
  const isRealData = data.source !== 'simulated_fallback';

  const services: BusServiceArrival[] = (data.Services || []).map((srv) => {
    const next1 = srv.NextBus;
    const next2 = srv.NextBus2;
    const next3 = srv.NextBus3;

    return {
      serviceNo: srv.ServiceNo,
      operator: srv.Operator || 'SBST',
      category: ['14e', '502', '851e', '12e'].includes(srv.ServiceNo)
        ? 'Express'
        : 'Trunk',
      destinationName: `To Terminal ${next1?.DestinationCode || ''}`.trim(),
      destinationCode: next1?.DestinationCode || '',
      nextBus: {
        estimatedArrivalMin: parseMinutes(next1?.EstimatedArrival),
        vehicleType: parseVehicleType(next1?.Type),
        wheelchairAccessible: next1?.Feature === 'WAB',
        crowdLevel: parseLoad(next1?.Load),
      },
      nextBus2: next2?.EstimatedArrival
        ? {
            estimatedArrivalMin: parseMinutes(next2.EstimatedArrival),
            vehicleType: parseVehicleType(next2.Type),
            wheelchairAccessible: next2.Feature === 'WAB',
            crowdLevel: parseLoad(next2.Load),
          }
        : undefined,
      nextBus3: next3?.EstimatedArrival
        ? {
            estimatedArrivalMin: parseMinutes(next3.EstimatedArrival),
            vehicleType: parseVehicleType(next3.Type),
            wheelchairAccessible: next3.Feature === 'WAB',
            crowdLevel: parseLoad(next3.Load),
          }
        : undefined,
    };
  });

  return {
    services,
    raw: data,
    isRealData,
    warning: data.warning,
  };
}

export async function checkApiHealth(): Promise<ApiHealthStatus> {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error(`Health check failed with status ${res.status}`);
  }
  return res.json();
}
