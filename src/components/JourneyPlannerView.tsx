import React, { useState } from 'react';
import { SAMPLE_JOURNEY_OPTIONS } from '../data/singaporeTransitData';
import { ArrowUpDown, Footprints, Bus, Train, CreditCard, ChevronRight } from 'lucide-react';

export const JourneyPlannerView: React.FC = () => {
  const [origin, setOrigin] = useState('Opp Orchard Stn (09023)');
  const [destination, setDestination] = useState('HarbourFront Int / VivoCity (10018)');
  const [selectedJourneyId, setSelectedJourneyId] = useState('jrn-1');
  const [fareType, setFareType] = useState<'adult' | 'student' | 'senior'>('adult');

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const currentJourney =
    SAMPLE_JOURNEY_OPTIONS.find((j) => j.id === selectedJourneyId) ||
    SAMPLE_JOURNEY_OPTIONS[0];

  const getFare = (j: typeof currentJourney) => {
    if (fareType === 'student') return `$${j.fareStudent.toFixed(2)}`;
    if (fareType === 'senior') return `$${j.fareSenior.toFixed(2)}`;
    return `$${j.fareAdultCard.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Route Planner Inputs Card */}
      <div className="bg-[#4E1257] text-white p-5 rounded-lg border border-[#6B1A77] shadow-sm">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight mb-1">
          Singapore Journey & Fare Planner
        </h2>
        <p className="text-xs text-purple-200 mb-4">
          Calculate multi-modal transit itineraries and official LTA distance-based fares via SimplyGo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/20">
          <div>
            <label className="block text-[11px] font-mono text-purple-200 uppercase mb-1">
              Origin Location / Stop
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-white text-gray-900 text-sm px-3 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-[#ffd6fd]"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-[#6B1A77] hover:bg-[#8e3c98] text-white transition-transform active:rotate-180"
              title="Swap Origin and Destination"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-purple-200 uppercase mb-1">
              Destination Location / Station
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-white text-gray-900 text-sm px-3 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-[#ffd6fd]"
            />
          </div>
        </div>
      </div>

      {/* Fare Tier Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-gray-200 shadow-xs">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#6B1A77]" />
          <span className="text-xs font-bold text-gray-700">Fare Type (SimplyGo / Contactless):</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFareType('adult')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              fareType === 'adult'
                ? 'bg-[#6B1A77] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Adult Card
          </button>
          <button
            onClick={() => setFareType('student')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              fareType === 'student'
                ? 'bg-[#6B1A77] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Student Concession
          </button>
          <button
            onClick={() => setFareType('senior')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              fareType === 'senior'
                ? 'bg-[#6B1A77] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Senior Citizen
          </button>
        </div>
      </div>

      {/* Journey Options List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-mono">
          Recommended Itineraries
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAMPLE_JOURNEY_OPTIONS.map((journey) => {
            const isSelected = journey.id === selectedJourneyId;
            return (
              <div
                key={journey.id}
                onClick={() => setSelectedJourneyId(journey.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all bg-white relative ${
                  isSelected
                    ? 'border-[#6B1A77] ring-2 ring-[#6B1A77]/20 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-display font-bold text-base text-gray-900">
                    {journey.title}
                  </h4>
                  <div className="text-right">
                    <div className="font-display font-black text-lg text-[#6B1A77]">
                      {getFare(journey)}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">Distance Fare</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600 mt-2 font-medium">
                  <span>⏱ {journey.totalDurationMins} mins</span>
                  <span>🔄 {journey.transfersCount} transfers</span>
                  <span>🚶 {journey.walkingMins} mins walk</span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-mono">
                    Depart {journey.departureTime} ➔ Arrive {journey.arrivalTime}
                  </span>
                  <span className="text-[#6B1A77] font-semibold flex items-center gap-0.5">
                    Select <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Itinerary Step-by-Step Breakdown */}
      <div className="bg-white rounded-lg border border-purple-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <span className="text-xs font-mono uppercase text-gray-400">Step-by-Step Itinerary</span>
            <h3 className="text-base font-bold text-gray-900">{currentJourney.title}</h3>
          </div>
          <span className="text-xs font-bold bg-purple-100 text-[#4E1257] px-2.5 py-1 rounded">
            Total Fare: {getFare(currentJourney)}
          </span>
        </div>

        <div className="space-y-4 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
          {currentJourney.steps.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-3">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                  step.type === 'WALK'
                    ? 'bg-gray-500'
                    : step.type === 'BUS'
                    ? 'bg-[#6B1A77]'
                    : 'bg-[#D42E12]'
                }`}
              >
                {step.type === 'WALK' ? (
                  <Footprints className="w-3 h-3" />
                ) : step.type === 'BUS' ? (
                  <Bus className="w-3 h-3" />
                ) : (
                  <Train className="w-3 h-3" />
                )}
              </div>

              <div className="flex-1 bg-[#FAF9FB] p-3 rounded-md border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    {step.instruction}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    {step.durationMins} mins
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
                  <span>From: {step.fromLocation}</span>
                  <span>To: {step.toLocation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
