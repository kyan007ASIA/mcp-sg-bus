import React from 'react';
import { Search, RotateCw, X, Filter } from 'lucide-react';

interface RouteFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  totalCount: number;
  filteredCount: number;
  secondsUntilRefresh: number;
  isRefreshing: boolean;
  onManualRefresh: () => void;
}

export const RouteFilterBar: React.FC<RouteFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  totalCount,
  filteredCount,
  secondsUntilRefresh,
  isRefreshing,
  onManualRefresh,
}) => {
  const filters = [
    { id: 'ALL', label: 'All Services' },
    { id: 'PINNED', label: '⭐ Pinned' },
    { id: 'TRUNK', label: 'Trunk' },
    { id: 'EXPRESS', label: 'Express' },
    { id: 'DD', label: 'Double Decker' },
  ];

  return (
    <div className="space-y-3">
      {/* Search Header Row */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4 text-[#6B1A77]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bus service (e.g. 65), stop name, or 5-digit code..."
            className="w-full h-11 pl-10 pr-10 bg-white text-sm text-gray-900 placeholder:text-gray-400 rounded-md border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#6B1A77] focus:border-transparent transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Live Refresh Trigger with Countdown Ring */}
        <button
          onClick={onManualRefresh}
          disabled={isRefreshing}
          className="h-11 px-3 sm:px-4 bg-[#6B1A77] hover:bg-[#4E1257] active:scale-[0.98] text-white rounded-md text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-70 whitespace-nowrap"
          title="Refresh live bus arrivals now"
        >
          <RotateCw
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span className="hidden sm:inline">Refresh</span>
          <span className="font-mono text-[11px] bg-white/20 px-1.5 py-0.5 rounded">
            {secondsUntilRefresh}s
          </span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 pt-0.5">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-gray-400 hidden lg:inline mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-gray-400" /> Filter:
          </span>
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#6B1A77] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-black/10 hover:border-[#6B1A77]/40 hover:bg-purple-50/50'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-gray-500 font-medium whitespace-nowrap pl-2">
          {filteredCount} of {totalCount} services
        </div>
      </div>
    </div>
  );
};
