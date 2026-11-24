"use client"

import React from "react"
import { Stethoscope, Utensils, Building, Landmark, Headphones } from "lucide-react"

const ENVIRONMENTS = [
  {
    icon: Stethoscope,
    title: "Hospitals & OPDs",
    detail: "Triage patient registration, diagnostic labs, and emergency pharmacy queues to prevent patient exhaustion and overcrowding."
  },
  {
    icon: Utensils,
    title: "College Canteens",
    detail: "Manage meal surges between lecture intervals with dynamic express counters and automated crowd alerts."
  },
  {
    icon: Landmark,
    title: "Banks & Financial Centers",
    detail: "Balance teller loads, separate high-volume deposits from long-tail advisory queues, and maintain VIP SLAs."
  },
  {
    icon: Headphones,
    title: "Government & Service Desks",
    detail: "Provide citizens with predictable token estimations, eliminating uncertain waiting hall crowding."
  }
]

export function EnvironmentsSection() {
  return (
    <section id="environments" className="py-24 bg-slate-100/50 dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Versatile Deployment
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Built for High-Crowd Public Spaces
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            Every environment has unique peak dynamics. QueueMind AI customizes queue algorithms per facility.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ENVIRONMENTS.map((env) => {
            const Icon = env.icon
            return (
              <div
                key={env.title}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col items-start"
              >
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {env.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {env.detail}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
