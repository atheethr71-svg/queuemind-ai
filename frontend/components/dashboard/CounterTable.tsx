"use client"

import React from "react"
import { Sliders, Power, UserCheck, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface CounterItem {
  id: number
  location_id: number
  name: string
  status: string
  avg_service_time: number
  served_today: number
  operator_id?: number | null
}

interface CounterTableProps {
  counters: CounterItem[]
  onToggleStatus: (counterId: number, currentStatus: string) => void
}

export function CounterTable({ counters, onToggleStatus }: CounterTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Counter Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Served Today</TableHead>
            <TableHead>Avg Service Time</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {counters.map((c) => {
            const isActive = c.status === "active"
            return (
              <TableRow key={c.id}>
                <TableCell className="font-bold text-sm text-slate-900 dark:text-white">
                  {c.name}
                </TableCell>
                <TableCell>
                  <Badge variant={isActive ? "success" : "secondary"}>
                    {isActive ? "Active / Serving" : "Inactive / Closed"}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {c.served_today} people
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {c.avg_service_time} mins/person
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant={isActive ? "outline" : "gradient"}
                    onClick={() => onToggleStatus(c.id, c.status)}
                    className="h-8 text-xs rounded-xl gap-1.5"
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span>{isActive ? "Deactivate" : "Activate"}</span>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
