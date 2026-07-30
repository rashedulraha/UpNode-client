"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export function CtaSection() {
  const [ctaEmail, setCtaEmail] = useState("");

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-card/75 backdrop-blur-2xl border border-border/80 p-8 sm:p-14 text-center space-y-6 shadow-xl shadow-primary/5 relative overflow-hidden"
      >
        <div className="max-w-xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            Ready to scale without database lockups?
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Deploy PulseScale in 3 minutes and monitor real-time infrastructure
            telemetry with zero latency penalty.
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-3">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row items-stretch gap-2"
          >
            <input
              type="email"
              value={ctaEmail}
              onChange={(e) => setCtaEmail(e.target.value)}
              placeholder="Your work e-mail"
              className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground text-xs whitespace-nowrap cursor-pointer"
            >
              Get Started for Free
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
