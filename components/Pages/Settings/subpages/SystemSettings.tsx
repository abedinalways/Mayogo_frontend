"use client";

import React, { useState } from "react";

export function SystemSettings() {
  const [apiKey, setApiKey] = useState("myg_live_9f8a37b12c5e4d11a8b9");
  const [enableDebugLogs, setEnableDebugLogs] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 font-['Manrope']">
      {/* Left Column */}
      <div className="lg:col-span-5 space-y-2">
        <h2 className="text-xl font-bold text-[#103D5C]">
          System Integration & API Keys
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
          Manage system webhook secret keys, environment logs, and system cache flushes.
        </p>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-7 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#103D5C]">
            Live API Secret Key
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="w-full h-10 px-3.5 text-xs rounded-xl border border-[#E4EBF1] bg-slate-50 text-[#103D5C] font-mono outline-none"
            />
            <button
              type="button"
              onClick={() => alert("API key copied")}
              className="h-10 px-4 text-xs font-semibold text-[#103D5C] bg-[#F1F5F9] rounded-xl hover:bg-slate-200 transition-colors shrink-0"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#103D5C]">
              Verbose Audit & Debug Logging
            </h4>
            <p className="text-xs text-slate-500">
              Log detailed API transactions and system tracebacks for troubleshooting.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enableDebugLogs}
            onClick={() => setEnableDebugLogs((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              enableDebugLogs ? "bg-[#F59E0B]" : "bg-slate-200"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                enableDebugLogs ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#103D5C]">
              Flush Redis & Server Cache
            </h4>
            <p className="text-xs text-slate-500">
              Clear transient cache keys to force fresh database queries across all services.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert("Cache cleared successfully!")}
            className="h-9 px-4 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            Purge Cache
          </button>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;
