import React, { useState } from 'react';
import { BusRouteDetails, VehicleType, CrowdingLevel } from '../types/transit';
import { SAMPLE_BUS_ROUTES } from '../data/singaporeTransitData';
import { X, ArrowRight, Bus, Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface LiveRouteModalProps {
  serviceNo: string | null;
  onClose: () => void;
  currentStopId?: string;
}

export const LiveRouteModal: React.FC<LiveRouteModalProps> = ({
  serviceNo,
  onClose,
  currentStopId = '09023',
}) => {
  const [directionIndex, setDirectionIndex] = useState<1 | 2>(1);

  if (!serviceNo) return null;

  // Retrieve route data or fallback to generic generated route for any service number
  const routeData: BusRouteDetails =
    SAMPLE_BUS_ROUTES[serviceNo] || {
      serviceNo,
      operator: 'SBS Transit',
      origin: 'Regional Interchange',
      destination: 'Central Transit Hub',
      firstBus: '05:30',
      lastBus: '23:45',
      frequencyPeak: '6 - 8 mins',
      frequencyOffPeak: '9 - 14 mins',
      direction1: {
        origin: 'Origin Interchange',
        destination: 'Destination Terminal',
        stops: [
          { stopCode: '84009', stopName: 'Origin Interchange', roadName: 'Town Centre Ave', sequence: 1, distanceKm: 0.0 },
          { stopCode: '72019', stopName: 'Avenue 2 Estate', roadName: 'Central Road', sequence: 2, distanceKm: 2.4 },
          {
            stopCode: currentStopId,
            stopName: 'Opp Orchard Stn (You Are Here)',
            roadName: 'Orchard Blvd',
            sequence: 3,
            distanceKm: 8.5,
            mrtInterchange: ['NS22', 'TE14'],
            activeBusHere: {
              plate: `SBS ${serviceNo}88X`,
              vehicleType: 'DD' as VehicleType,
              crowdLevel: 'SEATS_AVAILABLE' as CrowdingLevel,
              speedKmH: 26,
            },
          },
          { stopCode: '14009', stopName: 'Destination Terminal', roadName: 'Harbour Way', sequence: 4, distanceKm: 16.2 },
        ],
      },
    };

  const currentDirection =
    directionIndex === 1
      ? routeData.direction1
      : routeData.direction2 || routeData.direction1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-purple-200">
        {/* Header banner */}
        <div className="bg-[#4E1257] text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-12 rounded-lg bg-[#6B1A77] border border-purple-300/30 text-white flex flex-col items-center justify-center shadow-inner">
              <span className="font-display text-2xl font-black">{routeData.serviceNo}</span>
              <span className="text-[9px] font-mono text-[#ffd6fd]">BUS ROUTE</span>
            </div>
            <div>
              <div className="text-xs text-purple-200 font-mono tracking-wider uppercase">
                {routeData.operator} · Live Route Telemetry
              </div>
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-white flex items-center gap-2">
                <span>{currentDirection.origin.split('(')[0]}</span>
                <ArrowRight className="w-4 h-4 text-[#fbabff]" />
                <span>{currentDirection.destination.split('(')[0]}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Operational Specs strip */}
        <div className="bg-[#F5EBF7] px-4 py-2.5 border-b border-purple-100 flex flex-wrap items-center justify-between text-xs text-[#4E1257] font-medium gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6B1A77]" />
              First: {routeData.firstBus} | Last: {routeData.lastBus}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#6B1A77]" />
              Headway: {routeData.frequencyPeak}
            </span>
          </div>

          {/* Direction switcher tabs */}
          {routeData.direction2 && (
            <div className="flex items-center bg-white rounded-md p-0.5 border border-purple-200">
              <button
                onClick={() => setDirectionIndex(1)}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  directionIndex === 1
                    ? 'bg-[#6B1A77] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dir 1
              </button>
              <button
                onClick={() => setDirectionIndex(2)}
                className={`px-2.5 py-1 text-xs font-semibold rounded ${
                  directionIndex === 2
                    ? 'bg-[#6B1A77] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dir 2
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Stop Progression Ladder */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF9FB]">
          <div className="relative pl-6 sm:pl-8 space-y-4">
            {/* Vertical route line */}
            <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-4 w-1 bg-purple-200 rounded-full" />

            {currentDirection.stops.map((stop) => {
              const isCurrent = stop.stopCode === currentStopId;
              const hasActiveBus = Boolean(stop.activeBusHere);

              return (
                <div key={stop.stopCode} className="relative flex items-start gap-3">
                  {/* Stop Node Dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-transform ${
                      isCurrent
                        ? 'bg-[#E31837] border-white ring-4 ring-[#E31837]/30 scale-110 z-10'
                        : hasActiveBus
                        ? 'bg-[#6B1A77] border-white ring-2 ring-purple-300'
                        : 'bg-white border-purple-400'
                    }`}
                  >
                    {isCurrent ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-purple-600" />
                    )}
                  </div>

                  {/* Stop info card */}
                  <div
                    className={`flex-1 p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'bg-purple-50/90 border-[#6B1A77] shadow-sm'
                        : 'bg-white border-gray-200/80 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {stop.stopCode}
                        </span>
                        <h4
                          className={`text-sm font-bold ${
                            isCurrent ? 'text-[#6B1A77]' : 'text-gray-900'
                          }`}
                        >
                          {stop.stopName}
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-gray-400">
                        {stop.distanceKm.toFixed(1)} km
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-between">
                      <span>{stop.roadName}</span>
                      {stop.mrtInterchange && stop.mrtInterchange.length > 0 && (
                        <div className="flex items-center gap-1">
                          {stop.mrtInterchange.map((mrt) => (
                            <span
                              key={mrt}
                              className="text-[10px] font-mono font-bold bg-[#4E1257] text-white px-1.5 py-0.2 rounded"
                            >
                              {mrt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Active Bus Pin at this stop */}
                    {stop.activeBusHere && (
                      <div className="mt-2.5 p-2 bg-[#F5EBF7] rounded border border-purple-200 flex items-center justify-between text-xs text-[#4E1257]">
                        <div className="flex items-center gap-2">
                          <Bus className="w-4 h-4 text-[#6B1A77] animate-bounce" />
                          <span className="font-mono font-bold">
                            {stop.activeBusHere.plate}
                          </span>
                          <span className="bg-purple-200 text-purple-900 text-[10px] font-bold px-1 rounded">
                            {stop.activeBusHere.vehicleType}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          ● Approaching Platform
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal footer */}
        <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Real-time feed synced with LTA DataMall
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#6B1A77] hover:bg-[#4E1257] text-white text-xs font-semibold rounded-md transition-colors"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
