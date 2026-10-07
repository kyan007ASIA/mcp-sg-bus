import React, { useState } from 'react';
import { SAMPLE_BUS_ROUTES } from '../data/singaporeTransitData';
import { Bus, Clock, Calendar, ArrowRight, Search, MapPin, CheckCircle2 } from 'lucide-react';

interface RouteExplorerViewProps {
  initialServiceNo?: string;
  onSelectStopCode?: (stopCode: string) => void;
}

export const RouteExplorerView: React.FC<RouteExplorerViewProps> = ({
  initialServiceNo = '65',
  onSelectStopCode,
}) => {
  const [selectedService, setSelectedService] = useState(initialServiceNo);
  const [direction, setDirection] = useState<1 | 2>(1);
  const [stopFilter, setStopFilter] = useState('');

  const availableServices = Object.keys(SAMPLE_BUS_ROUTES);
  const route = SAMPLE_BUS_ROUTES[selectedService] || SAMPLE_BUS_ROUTES['65'];
  const activeDirection = direction === 1 ? route.direction1 : route.direction2 || route.direction1;

  const filteredStops = activeDirection.stops.filter(
    (s) =>
      s.stopName.toLowerCase().includes(stopFilter.toLowerCase()) ||
      s.stopCode.includes(stopFilter) ||
      s.roadName.toLowerCase().includes(stopFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Route Selector & Operator Header */}
      <div className="bg-[#4E1257] text-white p-5 rounded-lg border border-[#6B1A77] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ffd6fd] uppercase tracking-wider mb-1">
            <Bus className="w-4 h-4 text-[#fbabff]" />
            Singapore Public Bus Line Telemetry
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight">
            Bus Line Route Explorer
          </h2>
          <p className="text-xs text-purple-200 mt-1">
            Inspect stop progressions, transfers, and live bus positions across Singapore's municipal bus network.
          </p>
        </div>

        {/* Route Quick Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {availableServices.map((srv) => (
            <button
              key={srv}
              onClick={() => setSelectedService(srv)}
              className={`px-3 py-1.5 rounded-md font-display font-black text-sm transition-all cursor-pointer ${
                selectedService === srv
                  ? 'bg-[#E31837] text-white shadow-xs'
                  : 'bg-white/10 text-purple-100 hover:bg-white/20'
              }`}
            >
              Bus {srv}
            </button>
          ))}
        </div>
      </div>

      {/* Route Metadata Card */}
      <div className="bg-white rounded-lg border border-purple-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-12 rounded-lg bg-[#6B1A77] text-white flex flex-col items-center justify-center font-display font-black text-2xl shadow-xs">
              {route.serviceNo}
              <span className="text-[8px] font-mono text-[#ffd6fd]">ROUTE</span>
            </div>
            <div>
              <div className="text-xs text-gray-500 font-mono uppercase tracking-wide">
                {route.operator}
              </div>
              <h3 className="font-display font-black text-lg text-gray-900 flex items-center gap-2">
                <span>{activeDirection.origin.split('(')[0]}</span>
                <ArrowRight className="w-4 h-4 text-[#6B1A77]" />
                <span>{activeDirection.destination.split('(')[0]}</span>
              </h3>
            </div>
          </div>

          {/* Direction toggle */}
          {route.direction2 && (
            <div className="flex items-center bg-gray-100 rounded-md p-1 self-start sm:self-auto">
              <button
                onClick={() => setDirection(1)}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  direction === 1
                    ? 'bg-[#6B1A77] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dir 1 (To {route.direction1.destination.split('(')[0]})
              </button>
              <button
                onClick={() => setDirection(2)}
                className={`px-3 py-1 text-xs font-bold rounded ${
                  direction === 2
                    ? 'bg-[#6B1A77] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dir 2 (To {route.direction2.destination.split('(')[0]})
              </button>
            </div>
          )}
        </div>

        {/* Operating hours & headway telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#FAF9FB] p-3 rounded-md">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-[#6B1A77]" />
            <div>
              <span className="text-gray-400 block text-[10px] font-mono">FIRST BUS</span>
              <span className="font-bold text-gray-900">{route.firstBus}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-[#6B1A77]" />
            <div>
              <span className="text-gray-400 block text-[10px] font-mono">LAST BUS</span>
              <span className="font-bold text-gray-900">{route.lastBus}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-[#6B1A77]" />
            <div>
              <span className="text-gray-400 block text-[10px] font-mono">PEAK HEADWAY</span>
              <span className="font-bold text-gray-900">{route.frequencyPeak}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4 text-[#6B1A77]" />
            <div>
              <span className="text-gray-400 block text-[10px] font-mono">OFF-PEAK</span>
              <span className="font-bold text-gray-900">{route.frequencyOffPeak}</span>
            </div>
          </div>
        </div>

        {/* Search stops along this line */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={stopFilter}
            onChange={(e) => setStopFilter(e.target.value)}
            placeholder={`Filter ${activeDirection.stops.length} stops along Bus ${route.serviceNo}...`}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#6B1A77]"
          />
        </div>
      </div>

      {/* Schematic Route Ladder with Stop Nodes */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-xs">
        <h4 className="font-mono text-xs uppercase font-bold text-gray-500 mb-4">
          Route Progression & MRT Interchanges ({filteredStops.length} stops)
        </h4>

        <div className="relative pl-6 sm:pl-8 space-y-4">
          <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-4 w-1 bg-purple-200 rounded-full" />

          {filteredStops.map((stop) => {
            const hasActiveBus = Boolean(stop.activeBusHere);
            const isOrchardStop = stop.stopCode === '09023';

            return (
              <div key={stop.stopCode} className="relative flex items-start gap-3">
                {/* Node dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-transform ${
                    isOrchardStop
                      ? 'bg-[#E31837] border-white ring-4 ring-[#E31837]/30 scale-110 z-10'
                      : hasActiveBus
                      ? 'bg-[#6B1A77] border-white ring-2 ring-purple-300'
                      : 'bg-white border-purple-400'
                  }`}
                >
                  {isOrchardStop ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                  )}
                </div>

                {/* Node Card */}
                <div
                  className={`flex-1 p-3 rounded-lg border transition-all ${
                    isOrchardStop
                      ? 'bg-purple-50/90 border-[#6B1A77] shadow-sm'
                      : 'bg-white border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                        {stop.stopCode}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {stop.stopName}
                      </span>
                      {isOrchardStop && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                          Current Focus
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs text-gray-400">
                      {stop.distanceKm.toFixed(1)} km
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {stop.roadName}
                    </span>

                    {stop.mrtInterchange && stop.mrtInterchange.length > 0 && (
                      <div className="flex items-center gap-1">
                        {stop.mrtInterchange.map((code) => (
                          <span
                            key={code}
                            className="font-mono text-[10px] font-bold bg-[#4E1257] text-white px-1.5 py-0.2 rounded"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Active Bus marker */}
                  {stop.activeBusHere && (
                    <div className="mt-2 p-2 bg-[#F5EBF7] rounded border border-purple-200 flex items-center justify-between text-xs text-[#4E1257]">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-[#6B1A77] animate-pulse" />
                        <span className="font-mono font-bold">
                          {stop.activeBusHere.plate}
                        </span>
                        <span className="text-[10px] bg-purple-200 text-purple-900 font-bold px-1 rounded">
                          {stop.activeBusHere.vehicleType}
                        </span>
                      </div>
                      <span className="text-emerald-700 font-semibold text-[11px]">
                        Travelling at {stop.activeBusHere.speedKmH} km/h
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
