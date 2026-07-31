"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const [ctaEmail, setCtaEmail] = useState("");

  return (
    <section
      className="py-24 relative"
      style={{ background: "#000" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle dot grid for this section */}
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, black 30%, transparent 100%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl p-10 sm:p-16 text-center space-y-8 relative overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.035)",
            backdropFilter: "blur(28px) saturate(1.2)",
            WebkitBackdropFilter: "blur(28px) saturate(1.2)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderTop: "0.5px solid rgba(255,255,255,0.24)",
          }}
        >
          {/* Noise texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />

          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[10px] text-white/35 tracking-widest uppercase mb-2"
              style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.09)" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/60 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              Free · No Credit Card Required
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white leading-tight">
              Ready to monitor<br />
              <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.35)", color: "transparent" }}>
                without limits?
              </span>
            </h2>
            <p className="text-white/30 text-sm font-sans leading-relaxed">
              Deploy UpNode in 3 minutes and monitor real-time infrastructure telemetry with zero latency penalty.
            </p>
          </div>

          <div className="relative z-10 max-w-md mx-auto">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row items-stretch gap-2"
            >
              <input
                type="email"
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                placeholder="Enter your work email"
                className="flex-1 px-4 py-2.5 text-xs font-mono text-white/70 placeholder:text-white/22 focus:outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.10)",
                  borderTop: "0.5px solid rgba(255,255,255,0.18)",
                  borderRadius: "10px",
                }}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                type="submit"
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold font-mono tracking-wide whitespace-nowrap cursor-pointer transition-colors text-black"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  border: "0.5px solid rgba(255,255,255,0.3)",
                  borderRadius: "10px",
                }}
              >
                Get Started for Free
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </form>
          </div>

          {/* Bottom stats */}
          <div
            className="relative z-10 flex flex-wrap justify-center items-center gap-6 pt-4"
            style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)" }}
          >
            {["14-day free trial", "Zero config setup", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 font-mono text-[10px] text-white/22 tracking-widest uppercase">
                <span className="w-[3px] h-[3px] rounded-full bg-white/25" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
