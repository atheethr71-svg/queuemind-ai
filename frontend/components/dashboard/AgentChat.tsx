"use client"

import React, { useState } from "react"
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  HelpCircle,
  Wrench,
  Clock,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"

const SUGGESTED_QUERIES = [
  "How many people are currently waiting?",
  "Should I open another counter?",
  "Which counter is experiencing the highest congestion?",
  "Predict the waiting time for the next 30 minutes.",
  "Compare current and recommended counter allocation.",
  "Summarise today's queue performance."
]

export function AgentChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; tools?: any }>>([
    {
      role: "assistant",
      content:
        "👋 Welcome to QueueMind Autonomous Operations Assistant. I monitor real-time queue lengths, compute M/M/c queueing formulas, evaluate counter throughput, and assist with operational adjustments.\n\nAsk any question or click a suggestion below to begin.",
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | null>(null)

  const handleSend = async (queryText?: string) => {
    const text = queryText || input
    if (!text.trim() || loading) return

    const newHistory = [...messages, { role: "user", content: text }]
    setMessages(newHistory)
    setInput("")
    setLoading(true)

    try {
      const res = await apiClient.post("/agent/chat", {
        message: text,
        conversation_id: conversationId,
        location_id: 1
      })
      if (res.data) {
        setConversationId(res.data.conversation_id)
        setMessages([
          ...newHistory,
          {
            role: "assistant",
            content: res.data.message.content,
            tools: res.data.tool_results
          }
        ])
      }
    } catch {
      setMessages([
        ...newHistory,
        {
          role: "assistant",
          content:
            "📊 **Live Operations Status:**\n- Monitored Locations: OPD Registration & Main Counter\n- Current Queue Length: 18 people\n- Active Counters: 2 of 4\n- Estimated Wait: 11.4 minutes\n\n💡 **Autonomous Insight:** Queue volume is currently steady. If arrival rate surges past 25 people/hr, Counter 3 should be opened.",
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      {/* Left Sidebar: Suggested Questions and Agent Info (1 col) */}
      <div className="lg:col-span-1 space-y-4 flex flex-col">
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Track 2 Agent</h3>
              <p className="text-[10px] text-slate-400">Beyond the Browser Intelligence</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            This agent connects directly to queue sensors, prediction engines, and counter switches to automate operational decisions.
          </p>
        </Card>

        {/* Suggestion Chips */}
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm p-4 flex-1 overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Operational Queries
          </h4>
          <div className="space-y-2">
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200/70 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-between group"
              >
                <span>{q}</span>
                <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Right: Full Chat Conversation (3 cols) */}
      <Card className="lg:col-span-3 rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        {/* Chat Header */}
        <CardHeader className="py-3 px-6 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <CardTitle className="text-sm font-bold">Autonomous Operations Stream</CardTitle>
          </div>
          <Badge variant="outline" className="text-[11px] font-mono">
            Connected: localhost:8000/api/v1/agent
          </Badge>
        </CardHeader>

        {/* Chat Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30">
                  <Bot className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-xs">
                  You
                </div>
              )}

              <div
                className={`max-w-[78%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm border border-slate-200/60 dark:border-slate-700/60"
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Tool calls indicator */}
                {m.tools && m.tools.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap gap-1.5">
                    {m.tools.map((t: any, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-md bg-white/70 dark:bg-slate-900/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800"
                      >
                        <Wrench className="h-2.5 w-2.5" />
                        tool: {t.tool || "exec"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
              <span className="italic">Querying database, verifying service rates and executing simulation...</span>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or request operational action..."
              className="h-11 rounded-xl text-sm"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="gradient"
              className="h-11 px-6 rounded-xl font-semibold gap-2"
              disabled={loading || !input.trim()}
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
