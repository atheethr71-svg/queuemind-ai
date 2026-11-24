"use client"

import React from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export function LandingNav() {
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between border-b border-slate-200/60 bg-white/80 px-6 lg:px-16 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <Link href="/landing" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            QueueMind <span className="text-indigo-600">AI</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Intelligent Queue Operations
          </span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
        <a href="#simulator" className="hover:text-indigo-600 transition-colors">Simulator</a>
        <a href="#environments" className="hover:text-indigo-600 transition-colors">Environments</a>
        <a href="#tech" className="hover:text-indigo-600 transition-colors">Architecture</a>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <Link href="/dashboard/overview">
            <Button variant="gradient" className="gap-2 rounded-xl">
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="ghost" className="font-semibold text-slate-700 dark:text-slate-200">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="gradient" className="gap-2 rounded-xl">
                Launch Live Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
