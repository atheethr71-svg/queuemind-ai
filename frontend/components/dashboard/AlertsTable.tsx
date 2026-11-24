"use client"

import React from "react"
import { AlertCircle, CheckCircle2, Clock, MapPin } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AlertItem {
  id: number
  location_id: number
  type: string
  level: string
  message: string
  actual_value?: number
  threshold_value?: number
  is_acknowledged: boolean
  created_at: string
}

interface AlertsTableProps {
  alerts: AlertItem[]
  onAcknowledge: (id: number) => void
}

export function AlertsTable({ alerts, onAcknowledge }: AlertsTableProps) {
  const getLevelBadge = (level: string) => {
    const l = level.toLowerCase()
    if (l === "critical") return <Badge variant="destructive">Critical</Badge>
    if (l === "warning") return <Badge variant="warning">Warning</Badge>
    return <Badge variant="secondary">Info</Badge>
  }

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Severity</TableHead>
            <TableHead>Condition / Incident</TableHead>
            <TableHead className="w-[120px]">Actual vs Limit</TableHead>
            <TableHead className="w-[140px]">Timestamp</TableHead>
            <TableHead className="w-[120px] text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-xs text-slate-400">
                No active alerts recorded. All queues operating within standard parameters.
              </TableCell>
            </TableRow>
          ) : (
            alerts.map((a) => (
              <TableRow key={a.id} className={a.is_acknowledged ? "opacity-60 bg-slate-50/40" : ""}>
                <TableCell>
                  {getLevelBadge(a.level)}
                </TableCell>
                <TableCell className="font-medium text-xs text-slate-800 dark:text-slate-200">
                  {a.message}
                </TableCell>
                <TableCell className="text-xs font-mono">
                  {a.actual_value !== null && a.threshold_value !== null ? (
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {a.actual_value} / {a.threshold_value}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </TableCell>
                <TableCell className="text-right">
                  {a.is_acknowledged ? (
                    <span className="text-xs font-semibold text-slate-400 flex items-center justify-end gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resolved
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAcknowledge(a.id)}
                      className="h-8 text-xs rounded-xl"
                    >
                      Acknowledge
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
