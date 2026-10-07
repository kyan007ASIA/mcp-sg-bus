import React from 'react';
import { Bus, Bell, Smartphone, Monitor, Activity } from 'lucide-react';

interface HeaderProps {
  activeTab: 'arrivals' | 'routes' | 'mrt' | 'journey' | 'bookmarks';
  setActiveTab: (tab: 'arrivals' | 'routes' | 'mrt' | 'journey' | 'bookmarks') => void;
  fontScale: number;
  setFontScale: (scale: number) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  alertsCount: number;
  onOpenAlerts: () => void;
  onOpenApiMonitor?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  fontScale,
  setFontScale,
  isMobileFrame,
  setIsMobileFrame,
  alertsCount,
  onOpenAlerts,
  onOpenApiMonitor,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#4E1257] text-white border-b border-[#6B1A77] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#E31837] flex items-center justify-center text-white font-black text-lg shadow-inner">
            <Bus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <button
            onClick={() => setActiveTab('arrivals')}
            className="text-left cursor-pointer group"
          >
            <div className="text-lg sm:text-xl font-display font-extrabold tracking-tight text-white flex items-center gap-2">
              SBS Transit
              <span className="text-[10px] font-mono uppercase bg-[#6B1A77] text-purple-200 px-1.5 py-0.5 rounded tracking-wider">
                SG Express
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, clean text with underline hover) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('arrivals')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'arrivals'
                ? 'bg-[#6B1A77] text-white font-semibold'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Bus Arrivals
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'routes'
                ? 'bg-[#6B1A77] text-white font-semibold'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Route Explorer
          </button>
          <button
            onClick={() => setActiveTab('mrt')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'mrt'
                ? 'bg-[#6B1A77] text-white font-semibold'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            MRT & LRT
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'journey'
                ? 'bg-[#6B1A77] text-white font-semibold'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Journey & Fare
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'bookmarks'
                ? 'bg-[#6B1A77] text-white font-semibold'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            }`}
          >
            Saved Commutes
          </button>
        </nav>

        {/* Zone 3: Actions (Accessibility resizer, alert badge, mobile frame toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* A+ / A- Font Resizer Group */}
          <div className="flex items-center bg-[#36003E] rounded-md p-0.5 border border-purple-900/60" title="Text Resizer">
            <button
              onClick={() => setFontScale(Math.max(0.9, Number((fontScale - 0.1).toFixed(1))))}
              className={`px-2 py-1 text-xs font-bold rounded ${
                fontScale < 1 ? 'bg-[#6B1A77] text-white' : 'text-purple-200 hover:text-white'
              }`}
              title="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => setFontScale(1)}
              className={`px-2 py-1 text-xs font-bold rounded ${
                fontScale === 1 ? 'bg-[#6B1A77] text-white' : 'text-purple-200 hover:text-white'
              }`}
              title="Default font size"
            >
              A
            </button>
            <button
              onClick={() => setFontScale(Math.min(1.25, Number((fontScale + 0.1).toFixed(1))))}
              className={`px-2 py-1 text-xs font-bold rounded ${
                fontScale > 1 ? 'bg-[#6B1A77] text-white' : 'text-purple-200 hover:text-white'
              }`}
              title="Increase font size"
            >
              A+
            </button>
          </div>

          {/* API Health & Gateway Monitor */}
          {onOpenApiMonitor && (
            <button
              onClick={onOpenApiMonitor}
              className="flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-white/10 transition-colors text-purple-200 hover:text-white text-xs font-semibold"
              title="LTA API & Health Diagnostics"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="hidden xl:inline">API</span>
            </button>
          )}

          {/* Service Alerts trigger */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-md hover:bg-white/10 transition-colors text-purple-200 hover:text-white"
            title="Service Advisories"
          >
            <Bell className="w-5 h-5" />
            {alertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E31837] rounded-full ring-2 ring-[#4E1257] animate-pulse" />
            )}
          </button>

          {/* Device Frame Viewport Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#6B1A77] hover:bg-[#8e3c98] transition-colors text-xs font-semibold text-white shadow-sm"
            title={isMobileFrame ? 'Switch to Full Screen View' : 'Switch to Smartphone Screen View'}
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
