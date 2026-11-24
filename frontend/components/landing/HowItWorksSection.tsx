"use client"

import React from "react"
import { Eye, Calculator, SlidersHorizontal, CheckCheck } from "lucide-react"

const STEPS = [
  {
    num: "01",
    icon: Eye,
    title: "Detect & Sense",
    desc: "CCTV camera streams or uploaded images are processed by our lightweight YOLO model to count individuals waiting and classify crowd density without tracking identities."
  },
  {
    num: "02",
    icon: Calculator,
    title: "Model & Predict",
    desc: "Queue length and active counter service rates feed our dynamic M/M/c queueing engine to calculate current and 30-minute forward wait times with high confidence."
  },
  {
    num: "03",
    icon: SlidersHorizontal,
    title: "Simulate & Optimize",
    desc: "Administrators and the AI agent test operational scenarios: 'What happens if we open Counter 4?' Instant mathematical calculations reveal time saved and utilisation."
  },
  {
    num: "04",
    icon: CheckCheck,
    title: "Act & Orchestrate",
    desc: "The AI Browser Agent notifies operators via AWS SNS, highlights bottleneck counters, and enables 1-click counter adjustments directly within the browser."
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            End-to-End Workflow
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How QueueMind AI Transforms Queues
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            From raw visual sensing to intelligent automated decision execution in seconds.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s) => {
            const Icon = s.icon
            return (
              <div key={s.num} className="relative flex flex-col p-6 rounded-2xl border border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-indigo-600/30 dark:text-indigo-400/30">
                    {s.num}
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
