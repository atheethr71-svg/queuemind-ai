"use client"

import React from "react"
import Link from "next/link"
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  Activity,
  Users,
  Timer,
  CheckCircle,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-36 lg:pb-28">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/10 to-blue-500/15 blur-3xl pointer-events-none rounded-full" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
        {/* Hackathon Track Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 mb-6 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          <span>TRACK 2: BEYOND THE BROWSER – REIMAGINE HOW WE USE THE WEB</span>
        </div>

        {/* Master Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] max-w-4xl mx-auto">
          Smarter Queues. Shorter Waits.{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
            Better Experiences.
          </span>
        </h1>

        {/* Supporting Subtext */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          An autonomous AI-powered queue monitoring & predictive management agent.
          Combines computer vision crowd detection, dynamic queueing theory calculations,
          and intelligent browser-based counter allocation.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth/login">
            <Button size="lg" variant="gradient" className="gap-2 text-base px-8 h-12 rounded-xl shadow-lg shadow-indigo-600/25">
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="text-base px-8 h-12 rounded-xl">
              Explore Features
            </Button>
          </a>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur shadow-sm dark:border-slate-800 dark:bg-slate-900/60 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">68%</span>
            <span className="text-xs font-semibold text-slate-500">Wait Time Reduction</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">2.4x</span>
            <span className="text-xs font-semibold text-slate-500">Service Speedup</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">&lt;50ms</span>
            <span className="text-xs font-semibold text-slate-500">Prediction Engine</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">100%</span>
            <span className="text-xs font-semibold text-slate-500">Privacy-First (No Face ID)</span>
          </div>
        </div>

        {/* Interactive Dashboard Preview Mockup */}
        <div className="mt-12 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xl shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 pb-3 px-3 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400/80" />
              <div className="h-3 w-3 rounded-full bg-amber-400/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
            </div>
            <span className="font-mono text-slate-500">https://queuemind.ai/dashboard/overview</span>
            <div className="ml-auto flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Real-Time Simulation Active</span>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Queue Volume</span>
                <Users className="h-4 w-4 text-indigo-500" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">18 Waiting</div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                <span>-24% after Counter 3 opened</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Average Wait</span>
                <Timer className="h-4 w-4 text-violet-500" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">11.4 Minutes</div>
              <div className="mt-1 text-xs text-slate-500 font-medium">Confidence: 94%</div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20">
              <div className="flex items-center justify-between text-xs text-indigo-100">
                <span>AI Operations Agent</span>
                <Sparkles className="h-4 w-4 text-amber-300" />
              </div>
              <div className="mt-1 text-sm font-semibold">Recommended Action:</div>
              <p className="mt-1 text-xs text-indigo-100 leading-snug">
                Maintain 3 active counters for peak lunch rush (12:00 - 14:00).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
