"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("admin@queuemind.ai")
  const [password, setPassword] = useState("Admin@123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      router.push("/dashboard/overview")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Authentication failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail)
    setPassword(rolePass)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <Link href="/landing" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              QueueMind <span className="text-indigo-600">AI</span>
            </span>
          </Link>
          <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            Sign In to Operations Console
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Real-time queue analytics and autonomous counter orchestration
          </p>
        </div>

        {/* Demo Quick-Fill Pill Banner */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs dark:border-indigo-900/50 dark:bg-indigo-950/40">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-200 mb-2">
            <KeyRound className="h-4 w-4 text-indigo-600" />
            <span>Preloaded Demonstration Accounts (1-Click Fill)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleQuickFill("admin@queuemind.ai", "Admin@123")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/60 dark:border-indigo-800 text-left hover:border-indigo-400 transition-colors"
            >
              <div className="font-bold text-indigo-700 dark:text-indigo-300">Facility Admin</div>
              <div className="text-[10px] text-slate-500 truncate">admin@queuemind.ai</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill("operator@queuemind.ai", "Op@123")}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/60 dark:border-indigo-800 text-left hover:border-indigo-400 transition-colors"
            >
              <div className="font-bold text-indigo-700 dark:text-indigo-300">Counter Operator</div>
              <div className="text-[10px] text-slate-500 truncate">operator@queuemind.ai</div>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <Card className="rounded-2xl border-slate-200/90 shadow-xl dark:border-slate-800">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@queuemind.ai"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-11 text-sm font-semibold rounded-xl mt-2"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign In to Dashboard"}
              </Button>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 py-4 text-xs text-slate-500">
              Don't have an enterprise account?{" "}
              <Link href="/auth/register" className="ml-1 font-semibold text-indigo-600 hover:underline">
                Register Facility
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
