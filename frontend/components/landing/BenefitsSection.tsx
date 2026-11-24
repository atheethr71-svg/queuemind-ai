"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BenefitsSection() {
  return (
    <section className="py-20 bg-gradient-to-tr from-indigo-900 via-indigo-800 to-slate-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl text-center relative z-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to eliminate chaotic waiting lines?
        </h2>
        <p className="mt-4 text-indigo-200 text-base max-w-2xl mx-auto">
          Experience how QueueMind AI automatically detects crowding, forecasts peak surges, and coordinates counters without human guesswork.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth/login">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-8 h-12 rounded-xl">
              Launch Live Application
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
