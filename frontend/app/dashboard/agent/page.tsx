"use client"

import React from "react"
import { Bot, Sparkles } from "lucide-react"
import { AgentChat } from "@/components/dashboard/AgentChat"
import { Badge } from "@/components/ui/badge"

export default function AgentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Browser Operations Agent
            </h2>
            <p className="text-xs text-slate-500">
              Track 2 Innovation: Natural language assistant with autonomous tool execution and decision support
            </p>
          </div>
        </div>

        <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/60 dark:bg-indigo-950/40">
          <Sparkles className="h-3.5 w-3.5 mr-1 text-indigo-600" />
          Autonomous Tool Calling Active
        </Badge>
      </div>

      <AgentChat />
    </div>
  )
}
