"use client";

import React, { useState } from "react";
import { Play, RotateCcw, Check, Copy, Zap, ArrowRight, Loader2 } from "lucide-react";

interface EndpointConfig {
  id: string;
  name: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  description: string;
  defaultParams: Record<string, string>;
  generateResponse: (params: Record<string, string>) => {
    status: number;
    statusText: string;
    body: Record<string, any>;
  };
}

const ENDPOINTS: EndpointConfig[] = [
  {
    id: "ping",
    name: "Heartbeat / Ping",
    method: "POST",
    path: "/v1/monitors/mon_prod_db/ping",
    description: "Send an automated heartbeat to keep your monitor status healthy.",
    defaultParams: {
      status: "ok",
      latency_ms: "42",
      message: "Database ping operational",
    },
    generateResponse: (params) => ({
      status: 200,
      statusText: "OK",
      body: {
        success: true,
        monitor_id: "mon_prod_db",
        received_at: new Date().toISOString(),
        next_expected: new Date(Date.now() + 60000).toISOString(),
        reported_status: params.status || "ok",
        latency_ms: Number(params.latency_ms) || 42,
        message: params.message || "Database ping operational",
      },
    }),
  },
  {
    id: "status",
    name: "Report Component Status",
    method: "PATCH",
    path: "/v1/monitors/mon_api_gateway/status",
    description: "Push status state updates (ok, degraded, down, maintenance).",
    defaultParams: {
      status: "degraded",
      message: "High latency on us-east-1 replica",
    },
    generateResponse: (params) => ({
      status: 200,
      statusText: "OK",
      body: {
        success: true,
        monitor_id: "mon_api_gateway",
        previous_status: "ok",
        current_status: params.status || "degraded",
        message: params.message || "Status updated",
        updated_at: new Date().toISOString(),
      },
    }),
  },
  {
    id: "incident",
    name: "Create Incident",
    method: "POST",
    path: "/v1/projects/proj_live/incidents",
    description: "Trigger an incident and fire pages to your alert channels.",
    defaultParams: {
      title: "Payment Gateway Timeout Spike",
      severity: "critical",
    },
    generateResponse: (params) => ({
      status: 201,
      statusText: "Created",
      body: {
        id: `inc_${Math.floor(1000 + Math.random() * 9000)}`,
        title: params.title || "Payment Gateway Timeout Spike",
        severity: params.severity || "critical",
        status: "investigating",
        created_at: new Date().toISOString(),
        alert_sent: true,
        channels_notified: ["slack-#incidents", "pagerduty-oncall", "email-devops"],
      },
    }),
  },
];

export function DocsPlayground() {
  const [selectedEndpointId, setSelectedEndpointId] = useState("ping");
  const selectedEndpoint =
    ENDPOINTS.find((e) => e.id === selectedEndpointId) || ENDPOINTS[0];

  const [params, setParams] = useState<Record<string, string>>(
    selectedEndpoint.defaultParams
  );
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number;
    statusText: string;
    latency: number;
    body: Record<string, any>;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEndpointSelect = (id: string) => {
    setSelectedEndpointId(id);
    const ep = ENDPOINTS.find((e) => e.id === id) || ENDPOINTS[0];
    setParams(ep.defaultParams);
    setResponse(null);
  };

  const handleRunRequest = () => {
    setLoading(true);
    setResponse(null);
    const startTime = performance.now();

    setTimeout(() => {
      const endTime = performance.now();
      const res = selectedEndpoint.generateResponse(params);
      setResponse({
        ...res,
        latency: Math.round(endTime - startTime + 25),
      });
      setLoading(false);
    }, 450);
  };

  const handleCopyResponse = () => {
    if (!response) return;
    navigator.clipboard
      .writeText(JSON.stringify(response.body, null, 2))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const methodBadgeColors = {
    GET: "border-blue-900/60 text-blue-400 bg-blue-950/20 rounded-none border",
    POST: "border-emerald-900/60 text-emerald-400 bg-emerald-950/20 rounded-none border",
    PATCH: "border-amber-900/60 text-amber-400 bg-amber-950/20 rounded-none border",
    DELETE: "border-rose-900/60 text-rose-400 bg-rose-950/20 rounded-none border",
  };

  return (
    <div className="my-8 rounded-none border border-neutral-800 bg-black p-5 shadow-sm font-mono">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-850">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-none bg-neutral-900 border border-neutral-800 text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-white uppercase tracking-wider">
              Interactive REST API Playground
            </h3>
            <p className="text-[10px] text-neutral-500">
              Test UpNode API endpoints in real-time with sample payloads
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-none font-mono text-[9px] uppercase font-bold border border-emerald-900/60 bg-emerald-950/20 text-emerald-400">
          Live Sandbox
        </span>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ENDPOINTS.map((ep) => (
          <button
            key={ep.id}
            onClick={() => handleEndpointSelect(ep.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-none font-mono text-xs transition-all cursor-pointer border ${
              selectedEndpointId === ep.id
                ? "bg-neutral-900 text-white border-neutral-750 font-bold"
                : "bg-black text-neutral-450 border-neutral-850 hover:border-neutral-800 hover:text-neutral-300"
            }`}
          >
            <span
              className={`px-1.5 py-0.5 text-[9px] font-bold uppercase border ${
                methodBadgeColors[ep.method]
              }`}
            >
              {ep.method}
            </span>
            <span>{ep.name}</span>
          </button>
        ))}
      </div>

      {/* Endpoint Details Header */}
      <div className="p-3.5 rounded-none bg-neutral-950 border border-neutral-850 mb-4">
        <div className="flex flex-wrap items-center gap-2.5 mb-1.5 font-mono text-xs">
          <span
            className={`px-2 py-0.5 rounded-none font-bold text-[9px] border ${
              methodBadgeColors[selectedEndpoint.method]
            }`}
          >
            {selectedEndpoint.method}
          </span>
          <span className="font-semibold text-white">
            https://api.upnode.io{selectedEndpoint.path}
          </span>
        </div>
        <p className="text-[11px] text-neutral-400">
          {selectedEndpoint.description}
        </p>
      </div>

      {/* Request Form & Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[11px] font-bold text-neutral-300 uppercase">
              Request Body Parameters
            </label>
            <button
              onClick={() => setParams(selectedEndpoint.defaultParams)}
              className="flex items-center gap-1 font-mono text-[9px] text-neutral-500 hover:text-neutral-300 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> [Reset]
            </button>
          </div>

          <div className="space-y-2.5 p-3.5 rounded-none bg-neutral-950 border border-neutral-850">
            {Object.entries(params).map(([key, val]) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="font-mono text-[10px] text-neutral-500 uppercase">
                  {key}
                </label>
                <input
                  type="text"
                  value={val}
                  onChange={(e) =>
                    setParams({ ...params, [key]: e.target.value })
                  }
                  className="w-full px-3 py-1.5 font-mono text-xs rounded-none border border-neutral-850 bg-black text-white outline-none focus:border-neutral-700 transition-colors"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleRunRequest}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-none bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Executing API Call...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Send Test Request</span>
              </>
            )}
          </button>
        </div>

        {/* Response Viewer */}
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[11px] font-bold text-neutral-300 uppercase">
              Response Preview
            </span>

            {response && (
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span
                  className={`px-2 py-0.5 rounded-none font-bold ${
                    response.status < 300
                      ? "border border-emerald-900/60 bg-emerald-950/20 text-emerald-400"
                      : "border border-rose-900/60 bg-rose-950/20 text-rose-450"
                  }`}
                >
                  {response.status} {response.statusText}
                </span>
                <span className="text-neutral-500">{response.latency}ms</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[220px] rounded-none bg-neutral-950 text-emerald-400 p-3.5 font-mono text-[11px] overflow-x-auto relative border border-neutral-850 flex flex-col justify-between">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-550 gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-450" />
                <span className="text-[10px]">Dispatching HTTP Request...</span>
              </div>
            ) : response ? (
              <>
                <pre className="overflow-x-auto text-emerald-400 leading-relaxed">
                  {JSON.stringify(response.body, null, 2)}
                </pre>
                <div className="pt-3 flex items-center justify-between border-t border-neutral-900 text-[9px] text-neutral-500 font-bold uppercase tracking-wider">
                  <span>content-type: application/json</span>
                  <button
                    onClick={handleCopyResponse}
                    className="flex items-center gap-1 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copied ? "[Copied]" : "[Copy JSON]"}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 gap-2 text-center">
                <ArrowRight className="w-4 h-4 text-neutral-700" />
                <span>Click &quot;Send Test Request&quot; to preview response</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocsPlayground;
