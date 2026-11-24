"use client"

import React, { useState, useEffect } from "react"
import { MapPin, Building, Plus, Users, Sliders, ArrowUpRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"

export default function LocationsPage() {
  const [facilities, setFacilities] = useState<any[]>([])

  useEffect(() => {
    apiClient.get("/locations/facilities").then((res) => {
      if (res.data && res.data.length > 0) {
        setFacilities(res.data)
      } else {
        setFacilities([
          {
            id: 1,
            name: "Central College Canteen",
            type: "College Campus",
            address: "Building B, Food Court",
            locations: [
              { id: 1, name: "Main Meal Counter", type: "Food Service", max_capacity: 120 },
              { id: 2, name: "Quick Snacks & Beverages", type: "Express", max_capacity: 60 },
            ]
          },
          {
            id: 2,
            name: "City General Hospital",
            type: "Healthcare",
            address: "North Wing, Level 1",
            locations: [
              { id: 3, name: "OPD Patient Registration", type: "Registration", max_capacity: 150 },
              { id: 4, name: "Central Outpatient Pharmacy", type: "Pharmacy", max_capacity: 80 },
            ]
          },
          {
            id: 3,
            name: "Metro Commercial Bank",
            type: "Banking & Finance",
            address: "Downtown Financial Plaza",
            locations: [
              { id: 5, name: "Cash Deposit & Withdrawal", type: "Teller", max_capacity: 90 },
            ]
          }
        ])
      }
    }).catch(() => {
      setFacilities([
        {
          id: 1,
          name: "Central College Canteen",
          type: "College Campus",
          address: "Building B, Food Court",
          locations: [
            { id: 1, name: "Main Meal Counter", type: "Food Service", max_capacity: 120 },
            { id: 2, name: "Quick Snacks & Beverages", type: "Express", max_capacity: 60 },
          ]
        },
        {
          id: 2,
          name: "City General Hospital",
          type: "Healthcare",
          address: "North Wing, Level 1",
          locations: [
            { id: 3, name: "OPD Patient Registration", type: "Registration", max_capacity: 150 },
            { id: 4, name: "Central Outpatient Pharmacy", type: "Pharmacy", max_capacity: 80 },
          ]
        }
      ])
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Building className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Multi-Location & Facility Hierarchy
            </h2>
            <p className="text-xs text-slate-500">
              Manage physical facilities, assign regional administrator permissions, and configure capacities
            </p>
          </div>
        </div>
      </div>

      {/* Facilities List */}
      <div className="space-y-6">
        {facilities.map((fac) => (
          <Card key={fac.id} className="rounded-2xl border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 py-4 px-6 flex flex-row items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold">{fac.name}</CardTitle>
                  <Badge variant="outline" className="text-xs">{fac.type}</Badge>
                </div>
                <CardDescription className="text-xs mt-1">{fac.address}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fac.locations?.map((loc: any) => (
                  <div
                    key={loc.id}
                    className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {loc.type}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {loc.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Max Capacity:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{loc.max_capacity} people</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
