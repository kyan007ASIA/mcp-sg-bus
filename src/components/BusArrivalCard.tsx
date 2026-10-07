import React from 'react';
import { BusServiceArrival, CrowdingLevel, VehicleType } from '../types/transit';
import { Accessibility, Star, ChevronRight, Volume2, VolumeX } from 'lucide-react';

interface BusArrivalCardProps {
  service: BusServiceArrival;
  onSelectRoute: (serviceNo: string) => void;
  onTogglePin?: (serviceNo: string) => void;
  hasAudioAlert?: boolean;
  onToggleAudioAlert?: (serviceNo: string) => void;
}

export const BusArrivalCard: React.FC<BusArrivalCardProps> = ({
  service,
  onSelectRoute,
  onTogglePin,
  hasAudioAlert,
  onToggleAudioAlert,
}) => {
  const formatArrival = (mins: number) => {
    if (mins <= 0) return 'Arr';
    if (mins === 1) return '1 min';
    return `${mins} min`;
  };

  const getCrowdBadge = (crowd: CrowdingLevel) => {
    switch (crowd) {
      case 'SEATS_AVAILABLE':
        return {
          label: 'Seats Avail',
          dotColor: 'bg-[#00875A]',
          textColor: 'text-[#00875A]',
          bgColor: 'bg-[#E6F4EA]',
          border: 'border-emerald-200',
        };
      case 'STANDING_AVAILABLE':
        return {
          label: 'Standing',
          dotColor: 'bg-[#D97706]',
          textColor: 'text-[#D97706]',
          bgColor: 'bg-[#FEF3C7]',
          border: 'border-amber-200',
        };
      case 'LIMITED_STANDING':
        return {
          label: 'Limited',
          dotColor: 'bg-[#DC2626]',
          textColor: 'text-[#DC2626]',
          bgColor: 'bg-[#FEE2E2]',
          border: 'border-rose-200',
        };
    }
  };

  const nextBus = service.nextBus;
  const isImminent = nextBus.estimatedArrivalMin <= 1;
  const crowd1 = getCrowdBadge(nextBus.crowdLevel);

  return (
    <div className="group relative bg-[#FFFFFF] rounded-lg border border-black/8 hover:border-[#6B1A77]/40 shadow-[0_2px_4px_rgba(33,33,36,0.04)] hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top micro line for express or special routes */}
      {service.category === 'Express' && (
        <div className="h-1 w-full bg-[#E31837]" />
      )}

      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* ZONE 1 (Left): Service Identity */}
        <div className="flex items-start gap-3 sm:w-[32%] shrink-0">
          {/* Rectangular bus route number badge */}
          <div
            onClick={() => onSelectRoute(service.serviceNo)}
            className="w-16 h-12 rounded-md bg-[#6B1A77] hover:bg-[#4E1257] text-white flex flex-col items-center justify-center cursor-pointer transition-colors shrink-0 shadow-xs group-hover:ring-2 group-hover:ring-[#6B1A77]/30"
            title={`View route details for Bus ${service.serviceNo}`}
          >
            <span className="font-display text-2xl font-extrabold tracking-tight leading-none tabular-nums">
              {service.serviceNo}
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#ffd6fd] uppercase mt-0.5">
              {service.operator}
            </span>
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-semibold text-gray-900 truncate block">
                {service.destinationName}
              </span>
            </div>
            <div className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
              <span className="font-medium text-[#4E1257]">{service.category}</span>
              {service.nextBus.busPlate && (
                <span className="font-mono text-gray-400 text-[10px]">
                  {service.nextBus.busPlate}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ZONE 2 (Center): Next Bus & Telemetry */}
        <div className="flex-1 flex items-center justify-between sm:justify-start gap-3 bg-[#F8F9FA] sm:bg-transparent p-2.5 sm:p-0 rounded-md">
          <div className="flex items-center gap-3">
            {/* Primary Countdown Timer */}
            <div
              className={`flex items-center justify-center min-w-[76px] px-3 py-1.5 rounded-md font-display font-black text-lg tracking-tight tabular-nums transition-transform ${
                isImminent
                  ? 'bg-[#E31837] text-white shadow-xs animate-[pulse_2s_infinite]'
                  : 'bg-[#6B1A77] text-white shadow-xs'
              }`}
            >
              {formatArrival(nextBus.estimatedArrivalMin)}
            </div>

            {/* Micro Telemetry Tags: WAB, Vehicle Type (DD/SD), Occupancy */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5">
                {/* Vehicle Type pill */}
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-gray-200 text-gray-800 border border-gray-300">
                  {nextBus.vehicleType === 'DD' ? 'Double Deck' : 'Single Deck'}
                </span>

                {/* WAB Accessibility badge */}
                {nextBus.wheelchairAccessible && (
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-50 text-blue-700 border border-blue-200"
                    title="Wheelchair Accessible Bus (WAB)"
                  >
                    <Accessibility className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Occupancy Status Chip */}
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${crowd1.bgColor} ${crowd1.textColor} border ${crowd1.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${crowd1.dotColor}`} />
                <span>{crowd1.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ZONE 3 (Right): Subsequent Arrivals & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          {/* Tabular subsequent arrivals */}
          <div className="flex items-center gap-3">
            {/* 2nd Bus */}
            {service.nextBus2 ? (
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-gray-400">Next</div>
                <div className="font-display font-bold text-sm text-gray-900 tabular-nums">
                  {formatArrival(service.nextBus2.estimatedArrivalMin)}
                </div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      getCrowdBadge(service.nextBus2.crowdLevel).dotColor
                    }`}
                  />
                  <span className="text-[9px] font-mono text-gray-500 font-bold">
                    {service.nextBus2.vehicleType}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-300 tabular-nums">—</div>
            )}

            {/* 3rd Bus */}
            {service.nextBus3 ? (
              <div className="text-right pl-2 border-l border-gray-200">
                <div className="text-[10px] uppercase font-bold text-gray-400">Then</div>
                <div className="font-display font-bold text-sm text-gray-700 tabular-nums">
                  {formatArrival(service.nextBus3.estimatedArrivalMin)}
                </div>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      getCrowdBadge(service.nextBus3.crowdLevel).dotColor
                    }`}
                  />
                  <span className="text-[9px] font-mono text-gray-500 font-bold">
                    {service.nextBus3.vehicleType}
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Action triggers: Pin, Audio Chime alert, Route Explorer link */}
          <div className="flex items-center gap-1 pl-2">
            {onToggleAudioAlert && (
              <button
                onClick={() => onToggleAudioAlert(service.serviceNo)}
                className={`p-1.5 rounded-md transition-colors ${
                  hasAudioAlert
                    ? 'text-[#E31837] bg-rose-50'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                }`}
                title={hasAudioAlert ? 'Arrival chime alert on' : 'Alert me when bus arrives'}
              >
                {hasAudioAlert ? (
                  <Volume2 className="w-4 h-4 fill-current" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>
            )}

            {onTogglePin && (
              <button
                onClick={() => onTogglePin(service.serviceNo)}
                className={`p-1.5 rounded-md transition-colors ${
                  service.pinned
                    ? 'text-[#E31837] hover:text-[#bb0027]'
                    : 'text-gray-300 hover:text-gray-600'
                }`}
                title={service.pinned ? 'Unpin service' : 'Pin to top of list'}
              >
                <Star
                  className={`w-4 h-4 ${service.pinned ? 'fill-current' : ''}`}
                />
              </button>
            )}

            <button
              onClick={() => onSelectRoute(service.serviceNo)}
              className="p-1.5 text-gray-400 hover:text-[#6B1A77] hover:bg-purple-50 rounded-md transition-colors"
              title="View bus line route & stops"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
