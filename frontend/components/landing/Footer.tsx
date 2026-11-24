"use client"

import React from "react"
import Link from "next/link"
import { Sparkles, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950 text-xs text-slate-500">
      <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">
            QueueMind AI
          </span>
          <span>— Smart Queue Monitoring & Predictive Management</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <span>Track 2: Beyond The Browser</span>
          <span>AWS Cloud Sponsored</span>
          <span>OpenCV + YOLOv8</span>
        </div>

        <div className="text-right">
          <span>© {new Date().getFullYear()} QueueMind AI. Hackathon Edition.</span>
        </div>
      </div>
    </footer>
  )
}
