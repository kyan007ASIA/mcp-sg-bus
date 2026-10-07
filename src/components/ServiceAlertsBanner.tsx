import React, { useState } from 'react';
import { ServiceAlert } from '../types/transit';
import { AlertTriangle, ChevronDown, ChevronUp, BellRing, Info, X } from 'lucide-react';

interface ServiceAlertsBannerProps {
  alerts: ServiceAlert[];
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const ServiceAlertsBanner: React.FC<ServiceAlertsBannerProps> = ({
  alerts,
  isOpenModal,
  onCloseModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (alerts.length === 0) return null;

  // Modal version
  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-purple-200 overflow-hidden">
          <div className="bg-[#4E1257] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-5 h-5 text-[#fbabff]" />
              <h3 className="font-display font-extrabold text-base">
                SBS Transit & LTA Advisories
              </h3>
            </div>
            {onCloseModal && (
              <button
                onClick={onCloseModal}
                className="p-1 rounded text-purple-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
            {alerts.map((alt) => (
              <div
                key={alt.id}
                className="p-3.5 rounded-lg border border-gray-200 bg-[#FAF9FB] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-[#E31837] text-white px-1.5 py-0.5 rounded">
                    {alt.type}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    {alt.date} {alt.time}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900">{alt.title}</h4>
                <p className="text-xs text-gray-600">{alt.message}</p>
                <div className="flex items-center gap-1 mt-1 text-[11px] text-[#6B1A77] font-semibold">
                  Affected: {alt.affectedRoutes.join(', ')}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 border-t border-gray-100 text-right">
            <button
              onClick={onCloseModal}
              className="px-4 py-1.5 bg-[#6B1A77] text-white text-xs font-semibold rounded-md hover:bg-[#4E1257]"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Inline collapsible banner version for the Arrivals page
  const latestAlert = alerts[0];

  return (
    <div className="bg-[#FFF4F5] border border-[#E31837]/30 rounded-lg overflow-hidden shadow-xs">
      <div className="p-3 sm:p-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#E31837] text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold font-mono uppercase bg-[#E31837] text-white px-1.5 py-0.2 rounded">
                Live Notice
              </span>
              <span className="text-xs font-bold text-gray-900 truncate">
                {latestAlert.title}
              </span>
            </div>
            <p className="text-xs text-gray-600 truncate mt-0.5 hidden sm:block">
              {latestAlert.message}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-[#E31837] hover:underline flex items-center gap-1 shrink-0 px-2 py-1"
        >
          <span>{isExpanded ? 'Hide Details' : 'Details'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="px-4 pb-3 pt-1 border-t border-[#E31837]/15 space-y-2 text-xs text-gray-700 bg-white">
          <p className="leading-relaxed">{latestAlert.message}</p>
          <div className="flex items-center gap-3 text-[11px] text-gray-500 font-mono">
            <span>Posted: {latestAlert.time}</span>
            <span>Routes: {latestAlert.affectedRoutes.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );
};
