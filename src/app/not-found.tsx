"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Terminal, ShieldAlert } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 font-sans flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden selection:bg-slate-800">
      {/* Background Noise Grid Overlay matching Dashboard */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] z-0 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Top Header Logo */}
      <header className="flex items-center justify-between relative z-10 w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-bold text-sm tracking-widest uppercase font-mono text-slate-900 dark:text-white">
            UPNODE
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-100 dark:bg-black text-slate-500 dark:text-neutral-400 border border-slate-200 dark:border-neutral-800">
            v2.6
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Content Area */}
      <main className="my-auto max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center justify-center relative z-10 py-10">
        
        {/* Left Column: Text Content */}
        <div className="md:col-span-6 space-y-6 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 font-mono text-[10px] text-rose-600 dark:text-rose-400 uppercase tracking-widest"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ERROR_CODE: 404 // NODE_NOT_FOUND</span>
          </motion.div>

          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-sans uppercase"
            >
              LOST IN THE GRID
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs sm:text-sm font-mono text-slate-500 dark:text-neutral-400 leading-relaxed max-w-md mx-auto md:mx-0"
            >
              The telemetry node you are trying to ping does not exist or has been decommissioned from our operational clusters.
            </motion.p>
          </div>

          {/* Quick Terminal Code Block Mock */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 bg-slate-950/90 dark:bg-black border border-slate-300 dark:border-neutral-800 text-[11px] font-mono text-emerald-400 max-w-sm mx-auto md:mx-0 text-left shadow-md relative overflow-hidden group"
          >
            <div className="flex items-center gap-1.5 border-b border-neutral-900 pb-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-500">$ curl -I http://upnode.dev/invalid-route</p>
              <p className="text-rose-500">HTTP/1.1 404 NOT FOUND</p>
              <p className="text-slate-500">Content-Type: text/plain</p>
              <p className="text-emerald-400">Response: Telemetry Node offline.</p>
            </div>
          </motion.div>

          {/* Navigation Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 pt-2"
          >
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 dark:border-neutral-800 bg-slate-100 dark:bg-black text-slate-700 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white uppercase font-mono text-xs rounded-none cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              [GO_BACK]
            </button>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-4 py-2 border border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase font-mono text-xs hover:opacity-90 rounded-none cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              [GO_TO_DASHBOARD]
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Illustration Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-6 flex items-center justify-center relative p-2"
        >
          <div className="w-full max-w-[400px] border border-slate-300 dark:border-neutral-800 bg-white dark:bg-black p-3 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none duration-500" />
            <Image
              src="/not-found-illustration.png"
              alt="404 Disconnected Node Illustration"
              width={400}
              height={400}
              priority
              className="object-cover w-full h-auto brightness-95 dark:brightness-100 border border-slate-200 dark:border-neutral-900"
            />
          </div>
        </motion.div>
      </main>

      {/* Footer Info */}
      <footer className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 flex items-center justify-between tracking-widest uppercase relative z-10 w-full pt-6 border-t border-slate-100 dark:border-neutral-950">
        <span>UPNODE INCIDENT PLATFORM</span>
        <span>v2.6 SYSTEM ERROR 404</span>
      </footer>
    </div>
  );
}
