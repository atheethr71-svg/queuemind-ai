"use client"

import React, { useState } from "react"
import { Settings, ShieldCheck, Bell, Cloud, Save, Check } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"

export default function SettingsPage() {
  const { user } = useAuth()
  const [maxQueueThreshold, setMaxQueueThreshold] = useState("20")
  const [maxWaitMinutes, setMaxWaitMinutes] = useState("15")
  const [demoMode, setDemoMode] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              System Settings & Operational Thresholds
            </h2>
            <p className="text-xs text-slate-500">
              Configure alert limits, AWS cloud integration credentials, and demo modes
            </p>
          </div>
        </div>

        <Button onClick={handleSave} variant="gradient" className="rounded-xl gap-2 text-xs">
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{saved ? "Settings Saved" : "Save Changes"}</span>
        </Button>
      </div>

      {/* User Profile */}
      <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Administrator Profile</CardTitle>
          <CardDescription className="text-xs">Active authenticated session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input disabled value={user?.full_name || "Facility Administrator"} className="mt-1 h-9 rounded-xl" />
            </div>
            <div>
              <Label>Email</Label>
              <Input disabled value={user?.email || "admin@queuemind.ai"} className="mt-1 h-9 rounded-xl" />
            </div>
          </div>
          <div>
            <Label>Permission Tier</Label>
            <div className="mt-1">
              <Badge variant="default" className="bg-indigo-600 capitalize">
                {user?.role || "Facility Admin (Full Operations)"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Congestion Trigger Thresholds</CardTitle>
          <CardDescription className="text-xs">
            Trigger automatic warning alerts and AWS SNS notifications when breached
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Critical Queue Length Limit (People)</Label>
              <Input
                value={maxQueueThreshold}
                onChange={(e) => setMaxQueueThreshold(e.target.value)}
                className="h-9 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Maximum Allowed Wait Time (Minutes)</Label>
              <Input
                value={maxWaitMinutes}
                onChange={(e) => setMaxWaitMinutes(e.target.value)}
                className="h-9 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">Demonstration Simulation Mode</div>
              <p className="text-slate-400 text-[11px]">Generate realistic simulated queue traffic and counter events automatically</p>
            </div>
            <Switch checked={demoMode} onCheckedChange={setDemoMode} />
          </div>
        </CardContent>
      </Card>

      {/* AWS Cloud Architecture Integration Status */}
      <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">AWS Cloud Service Integration</CardTitle>
              <CardDescription className="text-xs">Sponsor cloud infrastructure connectivity</CardDescription>
            </div>
            <Cloud className="h-5 w-5 text-indigo-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">AWS S3 (Storage)</span>
              <p className="text-slate-400 text-[11px]">Bucket: queuemind-uploads (Local mock fallback active)</p>
            </div>
            <Badge variant="success">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">AWS SNS (Notifications)</span>
              <p className="text-slate-400 text-[11px]">Topic: queuemind-congestion-alerts</p>
            </div>
            <Badge variant="success">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">AWS CloudWatch (Telemetry)</span>
              <p className="text-slate-400 text-[11px]">Log Group: /queuemind/api/access</p>
            </div>
            <Badge variant="success">Connected</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
