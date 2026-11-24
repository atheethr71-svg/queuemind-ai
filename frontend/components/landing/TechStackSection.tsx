"use client"

import React from "react"
import { Layers, Cloud, ShieldCheck, Database, Cpu, Globe } from "lucide-react"

const STACK_ITEMS = [
  { category: "Frontend", tech: "Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Recharts" },
  { category: "Backend Engine", tech: "FastAPI (Python 3.11), SQLAlchemy ORM, WebSockets, Pydantic v2" },
  { category: "AI & Computer Vision", tech: "YOLOv8 Person Detection, OpenCV, Queueing Theory (M/M/c), LLM Tool-Calling" },
  { category: "AWS Cloud Sponsor", tech: "AWS S3 (Media), AWS SNS (Alerts), AWS CloudWatch, RDS PostgreSQL" },
  { category: "Database & Cache", tech: "PostgreSQL with Alembic migrations, Redis pub/sub with local SQLite demo fallback" },
  { category: "Architecture", tech: "Modular Microservices, Docker Compose, JWT authentication, Zero-Face ID privacy" },
]

export function TechStackSection() {
  return (
    <section id="tech" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Enterprise Architecture
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Production-Ready Technology Stack
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base">
            Modern, responsive, secure and architected for seamless cloud scale with AWS.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STACK_ITEMS.map((item) => (
            <div
              key={item.category}
              className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {item.category}
              </span>
              <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {item.tech}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
