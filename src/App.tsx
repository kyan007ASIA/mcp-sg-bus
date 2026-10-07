import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BusStopHeader } from './components/BusStopHeader';
import { BusArrivalCard } from './components/BusArrivalCard';
import { RouteFilterBar } from './components/RouteFilterBar';
import { LiveRouteModal } from './components/LiveRouteModal';
import { MRTNetworkView } from './components/MRTNetworkView';
import { JourneyPlannerView } from './components/JourneyPlannerView';
import { BookmarksView } from './components/BookmarksView';
import { ServiceAlertsBanner } from './components/ServiceAlertsBanner';
import { RouteExplorerView } from './components/RouteExplorerView';
import { MobileFrame } from './components/MobileFrame';
import {
  SINGAPORE_BUS_STOPS,
  INITIAL_SERVICES_BY_STOP,
  SERVICE_ALERTS,
} from './data/singaporeTransitData';
import { BusStop, BusServiceArrival } from './types/transit';

export default function App() {
  const [activeTab, setActiveTab] = useState<'arrivals' | 'routes' | 'mrt' | 'journey' | 'bookmarks'>('arrivals');
  const [fontScale, setFontScale] = useState<number>(1);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Transit Data state
  const [currentStop, setCurrentStop] = useState<BusStop>(SINGAPORE_BUS_STOPS[0]);
  const [bookmarkedStopIds, setBookmarkedStopIds] = useState<string[]>(['09023', '03211']);
  const [servicesData, setServicesData] = useState<Record<string, BusServiceArrival[]>>(INITIAL_SERVICES_BY_STOP);

  // Audio & Pin states
  const [pinnedServices, setPinnedServices] = useState<string[]>(['65', '147']);
  const [audioAlerts, setAudioAlerts] = useState<string[]>(['65']);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Live Auto-Refresh Countdown
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [selectedRouteModal, setSelectedRouteModal] = useState<string | null>(null);
  const [showAlertsModal, setShowAlertsModal] = useState(false);

  // Play subtle synthetic audio chime
  const playArrivalChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context may be restricted before user gesture
    }
  };

  // Live timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          triggerRefreshCycle();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStop.id, audioAlerts]);

  // Simulate arrival updates
  const triggerRefreshCycle = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setServicesData((prev) => {
        const currentServices = prev[currentStop.id] || [];
        const updated = currentServices.map((srv) => {
          let nextMins = srv.nextBus.estimatedArrivalMin - 1;
          if (nextMins < 0) {
            nextMins = srv.nextBus2 ? srv.nextBus2.estimatedArrivalMin : Math.floor(Math.random() * 8) + 4;
          }

          // Check audio chime alert
          if (audioAlerts.includes(srv.serviceNo) && nextMins === 0) {
            playArrivalChime();
          }

          return {
            ...srv,
            nextBus: {
              ...srv.nextBus,
              estimatedArrivalMin: nextMins,
            },
          };
        });
        return {
          ...prev,
          [currentStop.id]: updated,
        };
      });
      setIsRefreshing(false);
    }, 500);
  };

  const handleManualRefresh = () => {
    setSecondsUntilRefresh(30);
    triggerRefreshCycle();
  };

  const toggleBookmarkStop = (stopId: string) => {
    setBookmarkedStopIds((prev) =>
      prev.includes(stopId) ? prev.filter((id) => id !== stopId) : [...prev, stopId]
    );
  };

  const togglePinService = (serviceNo: string) => {
    setPinnedServices((prev) =>
      prev.includes(serviceNo)
        ? prev.filter((s) => s !== serviceNo)
        : [...prev, serviceNo]
    );
  };

  const toggleAudioAlert = (serviceNo: string) => {
    setAudioAlerts((prev) => {
      const willEnable = !prev.includes(serviceNo);
      if (willEnable) {
        playArrivalChime();
      }
      return willEnable ? [...prev, serviceNo] : prev.filter((s) => s !== serviceNo);
    });
  };

  // Get current stop's services
  const rawServices = servicesData[currentStop.id] || INITIAL_SERVICES_BY_STOP['09023'] || [];

  // Filter & Search services
  const filteredServices = useMemo(() => {
    return rawServices
      .map((srv) => ({
        ...srv,
        pinned: pinnedServices.includes(srv.serviceNo),
      }))
      .filter((srv) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchNo = srv.serviceNo.toLowerCase().includes(q);
          const matchDest = srv.destinationName.toLowerCase().includes(q);
          if (!matchNo && !matchDest) return false;
        }

        // Category / Filter chip
        if (activeFilter === 'PINNED') return srv.pinned;
        if (activeFilter === 'TRUNK') return srv.category === 'Trunk';
        if (activeFilter === 'EXPRESS') return srv.category === 'Express';
        if (activeFilter === 'DD') return srv.nextBus.vehicleType === 'DD';

        return true;
      })
      .sort((a, b) => {
        // Pinned services always float to top
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return a.nextBus.estimatedArrivalMin - b.nextBus.estimatedArrivalMin;
      });
  }, [rawServices, searchQuery, activeFilter, pinnedServices]);

  // Content renderer according to active tab
  const renderTabContent = () => {
    if (activeTab === 'routes') {
      return (
        <RouteExplorerView
          initialServiceNo="65"
          onSelectStopCode={(code) => {
            const found = SINGAPORE_BUS_STOPS.find((s) => s.id === code);
            if (found) {
              setCurrentStop(found);
              setActiveTab('arrivals');
            }
          }}
        />
      );
    }

    if (activeTab === 'mrt') {
      return <MRTNetworkView />;
    }

    if (activeTab === 'journey') {
      return <JourneyPlannerView />;
    }

    if (activeTab === 'bookmarks') {
      const bookmarkedStops = SINGAPORE_BUS_STOPS.filter((s) =>
        bookmarkedStopIds.includes(s.id)
      );
      const pinnedList = rawServices.filter((s) => pinnedServices.includes(s.serviceNo));

      return (
        <BookmarksView
          bookmarkedStops={bookmarkedStops}
          onSelectStop={(stop) => {
            setCurrentStop(stop);
            setActiveTab('arrivals');
          }}
          onRemoveBookmark={(id) => toggleBookmarkStop(id)}
          pinnedServices={pinnedList}
          onSelectServiceRoute={(srvNo) => setSelectedRouteModal(srvNo)}
          onSelectTab={setActiveTab}
        />
      );
    }

    // Default: 'arrivals' screen
    return (
      <div className="space-y-4">
        {/* Service Alerts Banner */}
        <ServiceAlertsBanner alerts={SERVICE_ALERTS} />

        {/* Distinctive Purple Wayfinding Stop Header Banner */}
        <BusStopHeader
          currentStop={currentStop}
          allStops={SINGAPORE_BUS_STOPS}
          onSelectStop={(stop) => setCurrentStop(stop)}
          isBookmarked={bookmarkedStopIds.includes(currentStop.id)}
          onToggleBookmark={() => toggleBookmarkStop(currentStop.id)}
        />

        {/* Input & Station Search Bar and Route Filter Chips */}
        <RouteFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          totalCount={rawServices.length}
          filteredCount={filteredServices.length}
          secondsUntilRefresh={secondsUntilRefresh}
          isRefreshing={isRefreshing}
          onManualRefresh={handleManualRefresh}
        />

        {/* Arrival Card List Stacking (space-sm 8px-12px) */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-lg p-10 text-center border border-dashed border-gray-300">
            <p className="text-sm font-semibold text-gray-700">No matching bus services found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your filter or search query.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('ALL');
              }}
              className="mt-3 px-3 py-1.5 bg-[#6B1A77] text-white text-xs font-semibold rounded-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {filteredServices.map((service) => (
              <BusArrivalCard
                key={service.serviceNo}
                service={service}
                onSelectRoute={(srvNo) => setSelectedRouteModal(srvNo)}
                onTogglePin={(srvNo) => togglePinService(srvNo)}
                hasAudioAlert={audioAlerts.includes(service.serviceNo)}
                onToggleAudioAlert={(srvNo) => toggleAudioAlert(srvNo)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#fbf8fc] text-[#1b1b1e] flex flex-col transition-all"
      style={{ fontSize: `${fontScale * 100}%` }}
    >
      {/* Official Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fontScale={fontScale}
        setFontScale={setFontScale}
        isMobileFrame={isMobileFrame}
        setIsMobileFrame={setIsMobileFrame}
        alertsCount={SERVICE_ALERTS.length}
        onOpenAlerts={() => setShowAlertsModal(true)}
      />

      {/* Main Content Area */}
      {isMobileFrame ? (
        <MobileFrame
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onExitMobile={() => setIsMobileFrame(false)}
        >
          {renderTabContent()}
        </MobileFrame>
      ) : (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 pb-16">
          {renderTabContent()}
        </main>
      )}

      {/* Interactive Bus Route Progression Modal */}
      {selectedRouteModal && (
        <LiveRouteModal
          serviceNo={selectedRouteModal}
          currentStopId={currentStop.id}
          onClose={() => setSelectedRouteModal(null)}
        />
      )}

      {/* Service Advisories Dialog */}
      {showAlertsModal && (
        <ServiceAlertsBanner
          alerts={SERVICE_ALERTS}
          isOpenModal={true}
          onCloseModal={() => setShowAlertsModal(false)}
        />
      )}

      {/* Civic Municipal Footer */}
      {!isMobileFrame && (
        <footer className="border-t border-[#d3c1d0]/50 bg-[#f0edf1] text-xs text-[#4f434e] py-6 px-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-[#4E1257]">SBS Transit</span>
              <span>· Municipal Public Transport Expressive System</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-gray-500">
              <span>LTA DataMall v2 Feed</span>
              <span>SimplyGo Fare Engine</span>
              <span>Singapore Municipal Transport</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
