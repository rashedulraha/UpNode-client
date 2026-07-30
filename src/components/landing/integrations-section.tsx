"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Database, Globe, Layers, Server } from "lucide-react";

export function IntegrationsSection() {
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

  const techStack = [
    { name: "PostgreSQL", icon: Database, tag: "Primary Store", color: "group-hover:text-sky-500" },
    { name: "Redis", icon: Database, tag: "BullMQ Queue", color: "group-hover:text-rose-500" },
    { name: "Next.js", icon: Globe, tag: "App Router", color: "group-hover:text-primary" },
    { name: "Docker", icon: Server, tag: "Containers", color: "group-hover:text-blue-500" },
    { name: "Kubernetes", icon: Cpu, tag: "Orchestration", color: "group-hover:text-primary" },
    { name: "Kafka", icon: Layers, tag: "Event Streaming", color: "group-hover:text-amber-500" },
  ];

  return (
    <section className="py-12 border-b border-border">
      <div className="text-center space-y-6">
        <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
          Relied on by top-tier engineering teams
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3"
        >
          {techStack.map((tech, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -2 }}
              className="p-4 rounded-2xl bg-card border border-border hover:bg-accent transition-all flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
            >
              <tech.icon className={`w-4 h-4 text-muted-foreground transition-colors ${tech.color}`} />
              <span className="text-xs font-medium text-foreground group-hover:text-foreground">
                {tech.name}
              </span>
              <span className="text-[9px] font-mono text-muted-foreground">
                {tech.tag}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
