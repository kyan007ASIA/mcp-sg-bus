import React from 'react';
import { Wifi, Battery, Signal, Bus, Train, Route, Star, MapPin } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: 'arrivals' | 'routes' | 'mrt' | 'journey' | 'bookmarks';
  setActiveTab: (tab: 'arrivals' | 'routes' | 'mrt' | 'journey' | 'bookmarks') => void;
  onExitMobile: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  setActiveTab,
  onExitMobile,
}) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 sm:p-6">
      {/* Top Helper Toolbar */}
      <div className="mb-3 flex items-center justify-between w-full max-w-[420px] text-xs text-slate-300 px-2">
        <span className="font-mono text-purple-300 font-medium">
          📱 Mobile Viewport (412×892px)
        </span>
        <button
          onClick={onExitMobile}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded border border-slate-700 transition-colors"
        >
          Expand to Desktop ↗
        </button>
      </div>

      {/* Smartphone Chassis */}
      <div className="w-full max-w-[412px] h-[860px] bg-[#fbf8fc] rounded-[44px] shadow-2xl border-[8px] border-slate-800 relative flex flex-col overflow-hidden ring-1 ring-slate-700/50">
        {/* Dynamic Island / Speaker notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full z-50 flex items-center justify-end pr-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
        </div>

        {/* Mobile OS Status Bar */}
        <div className="h-10 pt-1.5 px-6 flex items-center justify-between text-[11px] font-semibold text-gray-800 shrink-0 z-40 bg-[#4E1257] text-white">
          <span className="font-mono">9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto pb-18 bg-[#fbf8fc]">
          <div className="p-3.5 space-y-4">{children}</div>
        </div>

        {/* Fixed Ergonomic Bottom Thumb Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-purple-100 grid grid-cols-5 items-center px-2 z-40">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'arrivals'
                ? 'text-[#6B1A77] font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Bus className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Buses</span>
          </button>

          <button
            onClick={() => setActiveTab('routes')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'routes'
                ? 'text-[#6B1A77] font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Route className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Routes</span>
          </button>

          <button
            onClick={() => setActiveTab('mrt')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'mrt'
                ? 'text-[#6B1A77] font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Train className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">MRT/LRT</span>
          </button>

          <button
            onClick={() => setActiveTab('journey')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'journey'
                ? 'text-[#6B1A77] font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'bookmarks'
                ? 'text-[#6B1A77] font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Star className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Saved</span>
          </button>
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-400 rounded-full z-50 pointer-events-none" />
      </div>
    </div>
  );
};
