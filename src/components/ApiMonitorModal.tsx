import React, { useState, useEffect } from 'react';
import { checkApiHealth, ApiHealthStatus } from '../services/ltaApi';
import { X, Activity, Server, Play, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';

interface ApiMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStopCode?: string;
}

export const ApiMonitorModal: React.FC<ApiMonitorModalProps> = ({
  isOpen,
  onClose,
  defaultStopCode = '04121',
}) => {
  const [healthStatus, setHealthStatus] = useState<ApiHealthStatus | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [testStopCode, setTestStopCode] = useState(defaultStopCode);
  const [testServiceNo, setTestServiceNo] = useState('7');
  const [apiResponseJson, setApiResponseJson] = useState<string | null>(null);
  const [loadingApiTest, setLoadingApiTest] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadHealth();
      runTestQuery(testStopCode, testServiceNo);
    }
  }, [isOpen]);

  const loadHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await checkApiHealth();
      setHealthStatus(data);
    } catch {
      setHealthStatus(null);
    } finally {
      setLoadingHealth(false);
    }
  };

  const runTestQuery = async (stopCode: string, serviceNo: string) => {
    setLoadingApiTest(true);
    try {
      let url = `/api/bus-arrival?BusStopCode=${encodeURIComponent(stopCode)}`;
      if (serviceNo.trim()) {
        url += `&ServiceNo=${encodeURIComponent(serviceNo.trim())}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      setApiResponseJson(JSON.stringify(json, null, 2));
    } catch (err: any) {
      setApiResponseJson(
        JSON.stringify({ error: 'Network request failed', message: err?.message }, null, 2)
      );
    } finally {
      setLoadingApiTest(false);
    }
  };

  const copyJson = () => {
    if (apiResponseJson) {
      navigator.clipboard.writeText(apiResponseJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-purple-200">
        {/* Header */}
        <div className="bg-[#4E1257] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#6B1A77] flex items-center justify-center text-[#ffd6fd]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-purple-200">
                Serverless Backend Monitor
              </div>
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-white">
                API Diagnostics & LTA Gateway
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-purple-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#FAF9FB]">
          {/* Health Check Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#6B1A77]" />
                <h3 className="font-display font-bold text-sm text-gray-900">
                  /api/health Monitor
                </h3>
              </div>
              <button
                onClick={loadHealth}
                disabled={loadingHealth}
                className="text-xs text-[#6B1A77] hover:underline font-semibold"
              >
                {loadingHealth ? 'Pinging...' : 'Re-check status'}
              </button>
            </div>

            {healthStatus ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-[#F5EBF7] p-2.5 rounded">
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Status</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {healthStatus.status.toUpperCase()}
                  </span>
                </div>
                <div className="bg-[#F5EBF7] p-2.5 rounded">
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Uptime</span>
                  <span className="font-bold text-gray-900 font-mono">
                    {healthStatus.uptime}s
                  </span>
                </div>
                <div className="bg-[#F5EBF7] p-2.5 rounded sm:col-span-2">
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">LTA AccountKey</span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      healthStatus.ltaApiConfigured ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {healthStatus.ltaApiConfigured ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Configured in Environment
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Awaiting LTA_ACCOUNT_KEY
                      </>
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Unable to contact /api/health endpoint.
              </div>
            )}
          </div>

          {/* Live Test Query Box */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs space-y-3">
            <h3 className="font-display font-bold text-sm text-gray-900 flex items-center justify-between">
              <span>Interactive LTA Bus Arrival Query</span>
              <span className="text-xs font-mono font-normal text-gray-500">
                GET /api/bus-arrival
              </span>
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                  BusStopCode
                </label>
                <input
                  type="text"
                  value={testStopCode}
                  onChange={(e) => setTestStopCode(e.target.value)}
                  placeholder="e.g. 04121"
                  className="w-full text-xs font-mono px-3 py-2 border border-gray-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-[#6B1A77]"
                />
              </div>

              <div className="w-28">
                <label className="block text-[10px] font-mono text-gray-400 uppercase mb-0.5">
                  ServiceNo (Opt)
                </label>
                <input
                  type="text"
                  value={testServiceNo}
                  onChange={(e) => setTestServiceNo(e.target.value)}
                  placeholder="e.g. 7"
                  className="w-full text-xs font-mono px-3 py-2 border border-gray-300 rounded font-semibold focus:outline-none focus:ring-1 focus:ring-[#6B1A77]"
                />
              </div>

              <button
                onClick={() => runTestQuery(testStopCode, testServiceNo)}
                disabled={loadingApiTest}
                className="self-end px-4 py-2 bg-[#6B1A77] hover:bg-[#4E1257] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{loadingApiTest ? 'Fetching...' : 'Send Request'}</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
              <span>Presets:</span>
              <button
                onClick={() => {
                  setTestStopCode('04121');
                  setTestServiceNo('7');
                  runTestQuery('04121', '7');
                }}
                className="font-mono text-[11px] bg-purple-50 hover:bg-purple-100 text-[#4E1257] px-2 py-0.5 rounded border border-purple-200"
              >
                04121 & Service 7
              </button>
              <button
                onClick={() => {
                  setTestStopCode('04121');
                  setTestServiceNo('');
                  runTestQuery('04121', '');
                }}
                className="font-mono text-[11px] bg-purple-50 hover:bg-purple-100 text-[#4E1257] px-2 py-0.5 rounded border border-purple-200"
              >
                04121 All Services
              </button>
              <button
                onClick={() => {
                  setTestStopCode('09023');
                  setTestServiceNo('65');
                  runTestQuery('09023', '65');
                }}
                className="font-mono text-[11px] bg-purple-50 hover:bg-purple-100 text-[#4E1257] px-2 py-0.5 rounded border border-purple-200"
              >
                09023 & Service 65
              </button>
            </div>

            {/* Response JSON Viewer */}
            <div className="relative mt-2">
              <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-3 py-1.5 rounded-t text-xs font-mono">
                <span>Response Payload (JSON)</span>
                <button
                  onClick={copyJson}
                  className="flex items-center gap-1 text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 text-emerald-400 p-3 rounded-b text-xs font-mono max-h-64 overflow-y-auto leading-relaxed border border-slate-800">
                {loadingApiTest ? '// Requesting live LTA DataMall proxy...' : apiResponseJson || '// No response yet'}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Vercel serverless functions in /api/health.js and /api/bus-arrival.js</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
