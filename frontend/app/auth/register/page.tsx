"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("admin")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await register(email, password, fullName, role)
      router.push("/dashboard/overview")
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Registration failed. Please check requirements.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
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
            Register New Administrator
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Set up an enterprise facility management profile
          </p>
        </div>

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
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Dr. Rajesh Kumar"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Work Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh@hospital.org"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role">Role Permission Level</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="admin">Facility Administrator (Full Permissions)</option>
                  <option value="operator">Counter Operator (Service Control)</option>
                  <option value="viewer">Executive Viewer (Analytics Only)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password (Min 8 chars, 1 uppercase, 1 digit)</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="SecretPass@123"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-11 text-sm font-semibold rounded-xl mt-2"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account & Launch"}
              </Button>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 py-4 text-xs text-slate-500">
              Already have credentials?{" "}
              <Link href="/auth/login" className="ml-1 font-semibold text-indigo-600 hover:underline">
                Sign In
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
