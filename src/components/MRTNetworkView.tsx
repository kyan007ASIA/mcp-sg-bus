import React, { useState } from 'react';
import { MRT_LINES } from '../data/singaporeTransitData';
import { Train, Clock, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

export const MRTNetworkView: React.FC = () => {
  const [selectedLineCode, setSelectedLineCode] = useState<string>('NEL');
  const [operatorFilter, setOperatorFilter] = useState<'ALL' | 'SBST' | 'SMRT'>('ALL');

  const filteredLines = MRT_LINES.filter((line) => {
    if (operatorFilter === 'SBST') return line.operator === 'SBS Transit';
    if (operatorFilter === 'SMRT') return line.operator === 'SMRT';
    return true;
  });

  const activeLine = MRT_LINES.find((l) => l.code === selectedLineCode) || MRT_LINES[0];

  return (
    <div className="space-y-6">
      {/* Network Header Banner */}
      <div className="bg-[#4E1257] text-white p-5 rounded-lg border border-[#6B1A77] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#ffd6fd] uppercase tracking-wider mb-1">
            <Train className="w-4 h-4 text-[#fbabff]" />
            Singapore Rapid Transit Rail Telemetry
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight">
            MRT & LRT Network Status
          </h2>
          <p className="text-xs text-purple-200 mt-1 max-w-xl">
            Live operational headways and platform crowding for SBS Transit operated lines (NEL, DTL, SPLRT) and the wider Singapore rail network.
          </p>
        </div>

        {/* Global status badge */}
        <div className="bg-white/10 backdrop-blur-xs px-4 py-3 rounded-lg border border-white/20 self-start sm:self-auto flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              All Lines Operational
            </div>
            <div className="text-[11px] text-purple-200">
              Peak Headway: 2.0 - 3.5 mins
            </div>
          </div>
        </div>
      </div>

      {/* Operator Filter Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setOperatorFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              operatorFilter === 'ALL'
                ? 'bg-[#6B1A77] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Rail Lines ({MRT_LINES.length})
          </button>
          <button
            onClick={() => setOperatorFilter('SBST')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              operatorFilter === 'SBST'
                ? 'bg-[#6B1A77] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            SBS Transit Lines (3)
          </button>
          <button
            onClick={() => setOperatorFilter('SMRT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              operatorFilter === 'SMRT'
                ? 'bg-[#6B1A77] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            SMRT Lines (4)
          </button>
        </div>

        <div className="text-xs text-gray-500 font-medium hidden sm:block">
          Select a line to inspect live platform arrivals
        </div>
      </div>

      {/* Line Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredLines.map((line) => {
          const isSelected = line.code === selectedLineCode;
          return (
            <div
              key={line.code}
              onClick={() => setSelectedLineCode(line.code)}
              className={`p-4 rounded-lg border transition-all cursor-pointer bg-white relative overflow-hidden ${
                isSelected
                  ? 'border-[#6B1A77] ring-2 ring-[#6B1A77]/20 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 shadow-xs'
              }`}
            >
              {/* Colored line accent header */}
              <div
                className="h-1.5 absolute top-0 left-0 right-0"
                style={{ backgroundColor: line.color }}
              />

              <div className="flex items-start justify-between mt-1">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-11 h-9 rounded font-mono font-black text-sm flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: line.color, color: line.textColor }}
                  >
                    {line.code}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-gray-900">
                      {line.name}
                    </h3>
                    <div className="text-xs text-gray-500 font-medium">
                      {line.operator} · {line.stationsCount} Stations
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Normal
                </span>
              </div>

              {/* Station snapshot preview */}
              <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Headway:</span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    ~{line.currentIntervalMin} mins
                  </span>
                </div>
                <div className="text-[#6B1A77] font-semibold flex items-center gap-0.5">
                  <span>View Arrivals</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Line Live Station Platform Arrival Board */}
      <div className="bg-white rounded-lg border border-purple-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-10 rounded font-mono font-black text-base flex items-center justify-center shadow-xs"
              style={{ backgroundColor: activeLine.color, color: activeLine.textColor }}
            >
              {activeLine.code}
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-gray-400 tracking-wider">
                Live Platform Departure Board
              </div>
              <h3 className="text-lg font-display font-black text-gray-900">
                {activeLine.highlightStation.stationName} Station ({activeLine.highlightStation.stationCode})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Platform Density:</span>
            <span className="text-xs font-bold text-[#00875A] bg-[#E6F4EA] px-2.5 py-1 rounded-full border border-emerald-200">
              ● Moderate / Normal
            </span>
          </div>
        </div>

        {/* Dual Platform Tracks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Platform A */}
          <div className="bg-[#FAF9FB] p-4 rounded-lg border border-purple-100/80">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-bold uppercase tracking-wider text-purple-900">
                Platform A
              </span>
              <span className="font-mono text-gray-400">Direction 1</span>
            </div>
            <div className="text-base font-bold text-gray-900">
              Towards {activeLine.highlightStation.nextTrainTowards1.destination}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Next Train:</span>
              <div className="font-display font-black text-xl text-[#6B1A77] tabular-nums">
                {activeLine.highlightStation.nextTrainTowards1.mins === 0
                  ? 'Arriving'
                  : `${activeLine.highlightStation.nextTrainTowards1.mins} min`}
              </div>
            </div>
            <div className="mt-1 text-right text-xs text-gray-400 font-mono">
              Next train: {activeLine.highlightStation.nextTrainTowards1.mins + 3} min
            </div>
          </div>

          {/* Platform B */}
          <div className="bg-[#FAF9FB] p-4 rounded-lg border border-purple-100/80">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-bold uppercase tracking-wider text-purple-900">
                Platform B
              </span>
              <span className="font-mono text-gray-400">Direction 2</span>
            </div>
            <div className="text-base font-bold text-gray-900">
              Towards {activeLine.highlightStation.nextTrainTowards2.destination}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">Next Train:</span>
              <div className="font-display font-black text-xl text-[#6B1A77] tabular-nums">
                {activeLine.highlightStation.nextTrainTowards2.mins === 0
                  ? 'Arriving'
                  : `${activeLine.highlightStation.nextTrainTowards2.mins} min`}
              </div>
            </div>
            <div className="mt-1 text-right text-xs text-gray-400 font-mono">
              Next train: {activeLine.highlightStation.nextTrainTowards2.mins + 4} min
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
