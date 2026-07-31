"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const GLASS: React.CSSProperties = {
  background: "rgba(255,255,255,0.025)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid rgba(255,255,255,0.09)",
  borderTop: "0.5px solid rgba(255,255,255,0.17)",
};

const GLASS_ACTIVE: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "0.5px solid rgba(255,255,255,0.22)",
  borderTop: "0.5px solid rgba(255,255,255,0.35)",
};

const steps = [
  {
    step: 1,
    title: "Ingestion Gateway",
    tech: "Go / Edge Proxy",
    latency: "< 0.8ms",
    desc: "High-concurrency edge webhooks accept telemetry spikes up to 500,000 req/sec.",
  },
  {
    step: 2,
    title: "BullMQ / Redis Queue",
    tech: "In-Memory Buffer",
    latency: "< 0.2ms",
    desc: "Non-blocking RAM buffer queues incoming alerts into job channels instantly.",
  },
  {
    step: 3,
    title: "Async Worker Pool",
    tech: "Isolated Runners",
    latency: "< 3.5ms",
    desc: "Decoupled process pool handles deduplication, rules, and alert routing.",
  },
  {
    step: 4,
    title: "SSE Broadcast",
    tech: "HTTP/2 Event Stream",
    latency: "< 12ms",
    desc: "Pushes real-time incident state directly to SRE dashboards — zero polling.",
  },
];

export function ArchitectureSection() {
  const [active, setActive] = useState(1);

  return (
    <section
      id="architecture"
      className="py-24 relative"
      style={{ background: "#000", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] text-white/35 tracking-widest uppercase"
            style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.09)" }}
          >
            <span className="w-1 h-1 rounded-full bg-white/30" />
            High-Throughput Pipeline
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white leading-tight">
            Zero main-thread<br />
            <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)", color: "transparent" }}>
              DB lockup.
            </span>
          </h2>
          <p className="text-white/30 text-sm max-w-lg mx-auto font-sans leading-relaxed">
            Traditional platforms lock databases under telemetry spikes. UpNode completely decouples
            ingestion with an async queue architecture.
          </p>
        </motion.div>

        {/* Pipeline Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          {steps.map((item) => {
            const isActive = active === item.step;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: item.step * 0.08 }}
                whileHover={{ y: -3 }}
                onClick={() => setActive(item.step)}
                className="cursor-pointer p-5 rounded-2xl transition-all space-y-4"
                style={isActive ? GLASS_ACTIVE : GLASS}
              >
                {/* Step number + latency */}
                <div className="flex items-center justify-between">
                  <span
                    className="font-mono text-[10px] text-white/30 tracking-widest"
                    style={{
                      border: "0.5px solid rgba(255,255,255,0.10)",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    STAGE 0{item.step}
                  </span>
                  <span
                    className="font-mono text-[10px] tracking-widest"
                    style={{ color: isActive ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.28)" }}
                  >
                    {item.latency}
                  </span>
                </div>

                {/* Title / Tech / Desc */}
                <div className="space-y-1.5">
                  <div className="font-mono text-[9px] text-white/25 tracking-widest uppercase">
                    {item.tech}
                  </div>
                  <h3
                    className="text-sm font-semibold transition-colors"
                    style={{ color: isActive ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.60)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-white/30 leading-relaxed font-sans">{item.desc}</p>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-70" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white/80" />
                    </span>
                    <span className="font-mono text-[9px] text-white/35 tracking-widest uppercase">
                      Selected
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Connector Flow Line */}
        <div className="hidden md:flex items-center justify-center gap-0">
          {steps.map((s, i) => (
            <React.Fragment key={s.step}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] transition-all cursor-pointer"
                style={{
                  background: active === s.step ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                  border: active === s.step ? "0.5px solid rgba(255,255,255,0.40)" : "0.5px solid rgba(255,255,255,0.10)",
                  color: active === s.step ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)",
                }}
                onClick={() => setActive(s.step)}
              >
                {s.step}
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-[0.5px] mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
