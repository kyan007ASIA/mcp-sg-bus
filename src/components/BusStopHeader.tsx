import React, { useState } from 'react';
import { BusStop } from '../types/transit';
import { Star, MapPin, ArrowRight, ChevronDown, Check, Navigation2 } from 'lucide-react';

interface BusStopHeaderProps {
  currentStop: BusStop;
  allStops: BusStop[];
  onSelectStop: (stop: BusStop) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const BusStopHeader: React.FC<BusStopHeaderProps> = ({
  currentStop,
  allStops,
  onSelectStop,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative bg-[#6B1A77] text-white rounded-lg p-4 sm:p-5 shadow-md border border-[#4E1257] overflow-visible">
      {/* Top row: 5-digit stop identifier and actions */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[240px]">
          {/* Stop Code & Switcher Pill */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs uppercase tracking-wider font-bold bg-[#4E1257] text-[#ffd6fd] px-2 py-0.5 rounded border border-[#8e3c98]/40">
              STOP {currentStop.id}
            </span>
            <span className="text-xs text-purple-200 flex items-center gap-1 font-medium">
              <Navigation2 className="w-3.5 h-3.5 text-[#fbabff]" />
              {currentStop.distanceMeters}m away
            </span>
          </div>

          {/* Main Stop Name with Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-left flex items-center gap-2 group cursor-pointer focus:outline-none"
              aria-expanded={dropdownOpen}
            >
              <h1 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white group-hover:text-purple-100 transition-colors">
                {currentStop.name}
              </h1>
              <ChevronDown
                className={`w-5 h-5 text-purple-200 group-hover:text-white transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu for Quick Stop Switching */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white text-[#1b1b1e] rounded-lg shadow-xl border border-purple-200 z-30 py-2 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    Switch Bus Stop / Interchange
                  </div>
                  {allStops.map((stop) => (
                    <button
                      key={stop.id}
                      onClick={() => {
                        onSelectStop(stop);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm flex items-start justify-between hover:bg-purple-50 transition-colors ${
                        stop.id === currentStop.id ? 'bg-purple-50/80 font-semibold' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-purple-100 text-[#4e005a] px-1.5 py-0.5 rounded">
                            {stop.id}
                          </span>
                          <span className="text-gray-900 font-medium">{stop.name}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 ml-12">{stop.road}</div>
                      </div>
                      {stop.id === currentStop.id && (
                        <Check className="w-4 h-4 text-[#6B1A77] shrink-0 mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Road description */}
          <div className="flex items-center gap-1.5 text-sm text-purple-200 mt-1 font-medium">
            <MapPin className="w-4 h-4 text-purple-300 shrink-0" />
            <span>{currentStop.road}</span>
          </div>
        </div>

        {/* Right side: Bookmark star & MRT badges */}
        <div className="flex items-center gap-2 self-start">
          <button
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this bus stop'}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
              isBookmarked
                ? 'bg-[#E31837] border-[#E31837] text-white shadow-sm'
                : 'bg-[#4E1257]/80 border-purple-400/30 text-purple-200 hover:text-white hover:bg-[#4E1257]'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
          >
            <Star
              className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Bottom row: Direction wayfinding & MRT interchange tags */}
      <div className="mt-3 pt-3 border-t border-purple-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-purple-100 font-medium">
          <ArrowRight className="w-3.5 h-3.5 text-[#fbabff] shrink-0" />
          <span>{currentStop.directionTowards}</span>
        </div>

        {currentStop.mrtInterchange && currentStop.mrtInterchange.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-purple-200">MRT Link:</span>
            {currentStop.mrtInterchange.map((code) => {
              const isNSL = code.startsWith('NS');
              const isEWL = code.startsWith('EW');
              const isNEL = code.startsWith('NE');
              const isDTL = code.startsWith('DT');
              const isTEL = code.startsWith('TE');
              const isCCL = code.startsWith('CC');

              let badgeBg = 'bg-gray-700';
              if (isNSL) badgeBg = 'bg-[#D42E12]';
              else if (isEWL) badgeBg = 'bg-[#009645]';
              else if (isNEL) badgeBg = 'bg-[#8A1599]';
              else if (isDTL) badgeBg = 'bg-[#005EC4]';
              else if (isTEL) badgeBg = 'bg-[#9D5B25]';
              else if (isCCL) badgeBg = 'bg-[#FA9E0D] text-black';

              return (
                <span
                  key={code}
                  className={`${badgeBg} text-white font-mono font-bold text-[10px] px-1.5 py-0.5 rounded tracking-wide shadow-xs`}
                >
                  {code}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
