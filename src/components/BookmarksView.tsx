import React from 'react';
import { BusStop, BusServiceArrival } from '../types/transit';
import { Star, Bus, MapPin, ArrowRight, Trash2 } from 'lucide-react';

interface BookmarksViewProps {
  bookmarkedStops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  onRemoveBookmark: (stopId: string) => void;
  pinnedServices: BusServiceArrival[];
  onSelectServiceRoute: (serviceNo: string) => void;
  onSelectTab: (tab: 'arrivals' | 'routes') => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedStops,
  onSelectStop,
  onRemoveBookmark,
  pinnedServices,
  onSelectServiceRoute,
  onSelectTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#4E1257] text-white p-5 rounded-lg border border-[#6B1A77] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono text-[#ffd6fd] uppercase tracking-wider mb-1">
          <Star className="w-4 h-4 text-[#fbabff] fill-current" />
          Personalized Commuter Hub
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight">
          Saved Stops & Pinned Services
        </h2>
        <p className="text-xs text-purple-200 mt-1">
          Quickly glance at morning & evening transit connections without re-entering station codes.
        </p>
      </div>

      {/* Bookmarked Bus Stops Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-gray-500">
            Bookmarked Bus Stops ({bookmarkedStops.length})
          </h3>
          <button
            onClick={() => onSelectTab('arrivals')}
            className="text-xs text-[#6B1A77] hover:underline font-semibold"
          >
            + Add more stops
          </button>
        </div>

        {bookmarkedStops.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg border border-dashed border-gray-300">
            <Star className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">No bookmarked stops yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Tap the star icon on any bus stop banner to save it here for instant access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {bookmarkedStops.map((stop) => (
              <div
                key={stop.id}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-[#6B1A77] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold bg-[#F5EBF7] text-[#4E1257] px-2 py-0.5 rounded">
                      STOP {stop.id}
                    </span>
                    <button
                      onClick={() => onRemoveBookmark(stop.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-display font-bold text-base text-gray-900 mt-2">
                    {stop.name}
                  </h4>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{stop.road}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">
                    {stop.services.length} bus services
                  </span>
                  <button
                    onClick={() => {
                      onSelectStop(stop);
                      onSelectTab('arrivals');
                    }}
                    className="text-xs font-bold text-[#6B1A77] group-hover:text-[#4E1257] flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Arrivals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pinned Services Section */}
      <div className="space-y-3 pt-2">
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-gray-500">
          Pinned Commute Services ({pinnedServices.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pinnedServices.map((service) => (
            <div
              key={service.serviceNo}
              onClick={() => onSelectServiceRoute(service.serviceNo)}
              className="p-3.5 rounded-lg border border-purple-100 bg-white hover:border-[#6B1A77] transition-all cursor-pointer shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-10 rounded-md bg-[#6B1A77] text-white flex flex-col items-center justify-center font-display font-extrabold text-lg">
                  {service.serviceNo}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 truncate max-w-[140px]">
                    {service.destinationName}
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                    ● Next: {service.nextBus.estimatedArrivalMin === 0 ? 'Arr' : `${service.nextBus.estimatedArrivalMin} min`}
                  </div>
                </div>
              </div>

              <Bus className="w-4 h-4 text-purple-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
