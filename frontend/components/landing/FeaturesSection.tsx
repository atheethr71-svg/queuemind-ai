"use client"

import React from "react"
import {
  Camera,
  Timer,
  Cpu,
  Bot,
  BellRing,
  Building2,
  CheckCircle2
} from "lucide-react"

const FEATURES = [
  {
    icon: Camera,
    title: "Computer Vision Crowd Detection",
    description: "Real-time person detection via YOLOv8 with bounding boxes, automated density estimation (Low/Moderate/High/Critical), and privacy-first local processing.",
    badge: "Vision AI"
  },
  {
    icon: Timer,
    title: "Intelligent Wait-Time Prediction",
    description: "Calculates dynamic wait times and expected completion windows using M/M/c queueing theory integrated with time-of-day rush multipliers.",
    badge: "M/M/c Engine"
  },
  {
    icon: Cpu,
    title: "Smart Counter Allocation Simulator",
    description: "Real-time interactive mathematical simulator. Enter queue lengths, test opening/closing counters, and evaluate wait-time reduction before changing operations.",
    badge: "Flagship"
  },
  {
    icon: Bot,
    title: "Autonomous Browser AI Agent",
    description: "Understands natural language questions, runs real backend tool calls, predicts surges, and performs counter activations only upon administrator approval.",
    badge: "Track 2 Winner"
  },
  {
    icon: BellRing,
    title: "Congestion Alerts & AWS SNS",
    description: "Three-tiered alert engine (Info, Warning, Critical) evaluating queue length and density thresholds with real-time WebSocket push and AWS SNS dispatch.",
    badge: "AWS Cloud"
  },
  {
    icon: Building2,
    title: "Multi-Facility Management",
    description: "Hierarchical infrastructure supporting hospitals, canteens, clinics, and banks with independent counters, queues, and role-based access permissions.",
    badge: "Enterprise"
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-slate-100/50 dark:bg-slate-900/50 border-y border-slate-200/60 dark:border-slate-800">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Intelligent Core Capabilities
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered to Solve Queue Frustrations
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            QueueMind AI moves far beyond static dashboards by coupling live sensors, predictive mathematical modeling, and autonomous decision intelligence.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
