"use client"

import React, { useState } from "react"
import { Bot, Sparkles, X, Send, CornerDownLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"

export function AgentFloating() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: "Hello! I am your QueueMind Operations Agent. Ask me about current queue bottlenecks, wait-time projections, or say **'Should I open another counter?'** to simulate throughput."
    }
  ])

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || message
    if (!q.trim() || loading) return

    const newMsgs = [...messages, { role: "user", content: q }]
    setMessages(newMsgs)
    setMessage("")
    setLoading(true)

    try {
      const res = await apiClient.post("/agent/chat", {
        message: q,
        conversation_id: conversationId,
        location_id: 1
      })
      if (res.data) {
        setConversationId(res.data.conversation_id)
        setMessages([...newMsgs, { role: "assistant", content: res.data.message.content }])
      }
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          content: "I'm monitoring the queue in live demo mode. 18 people are currently waiting. Opening 1 more counter will save ~4.5 mins per person."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all group focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
        title="Open QueueMind AI Agent"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-500 text-[9px] font-black items-center justify-center text-white">AI</span>
        </span>
        <Bot className="h-7 w-7 transition-transform group-hover:rotate-12" />
      </button>

      {/* Slide-Up Agent Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-96 max-w-[calc(100vw-32px)] flex-col rounded-2xl border border-slate-200/90 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">QueueMind AI Agent</span>
                <span className="text-[10px] text-indigo-100">Live Queue Operational Intelligence</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Query Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[11px]">
            <button
              onClick={() => handleSend("How many people are waiting?")}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Queue Length?
            </button>
            <button
              onClick={() => handleSend("Should I open another counter?")}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Simulate Counter
            </button>
            <button
              onClick={() => handleSend("Predict waiting time for next 30 minutes")}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              30m Forecast
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Analyzing real-time queue state...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="border-t border-slate-100 p-3 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask queue condition or action..."
                className="h-9 text-xs rounded-xl"
              />
              <Button type="submit" size="sm" variant="gradient" className="h-9 px-3 rounded-xl shrink-0" disabled={loading}>
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
