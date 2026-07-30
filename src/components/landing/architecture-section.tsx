"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Cpu, Globe, Layers, Radio } from "lucide-react";

export function ArchitectureSection() {
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);

  const fadeInUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const steps = [
    {
      step: 1,
      title: "Ingestion Gateway",
      tech: "Go / Edge Proxy",
      latency: "< 0.8ms",
      desc: "High-concurrency edge webhooks accept telemetry spikes up to 500,000 req/sec.",
      icon: Globe,
      textColor: "text-primary",
    },
    {
      step: 2,
      title: "BullMQ / Redis Queue",
      tech: "In-Memory Buffer",
      latency: "< 0.2ms",
      desc: "Non-blocking RAM buffer queues incoming alerts into job channels instantly.",
      icon: Layers,
      textColor: "text-amber-500",
    },
    {
      step: 3,
      title: "Asynchronous Worker",
      tech: "Isolated Runners",
      latency: "< 3.5ms",
      desc: "Decoupled process pool handles deduplication, rules, and alert routing.",
      icon: Cpu,
      textColor: "text-sky-500",
    },
    {
      step: 4,
      title: "Sub-second SSE Broadcast",
      tech: "HTTP/2 Event Stream",
      latency: "< 12ms",
      desc: "Pushes real-time incident state directly to SRE dashboards with zero polling.",
      icon: Radio,
      textColor: "text-emerald-500",
    },
  ];

  return (
    <section id="architecture" className="py-20 border-b border-border space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-2xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-primary" />
          <span className="text-primary">High-Throughput Pipeline</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
          Zero Main-Thread DB Lockup
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Traditional monitoring platforms lock up relational databases during
          telemetry spikes. PulseScale completely decouples ingestion using an
          asynchronous queue architecture.
        </p>
      </motion.div>

      {/* Visual Pipeline Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        {steps.map((item) => {
          const isActive = activePipelineStep === item.step;
          return (
            <motion.div
              key={item.step}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              onClick={() => setActivePipelineStep(item.step)}
              className={`cursor-pointer p-6 rounded-2xl transition-all relative flex flex-col justify-between ${
                isActive
                  ? "bg-card border-2 border-primary"
                  : "bg-card border border-border hover:border-primary/50"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-muted border border-border text-foreground">
                    <item.icon className={`w-4 h-4 ${item.textColor}`} />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-muted border border-border ${item.textColor}`}>
                    {item.latency}
                  </span>
                </div>

                <div>
                  <div className="text-[9px] font-mono uppercase text-primary font-semibold">
                    STAGE 0{item.step} • {item.tech}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
