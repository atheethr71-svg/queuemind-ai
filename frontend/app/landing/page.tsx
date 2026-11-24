"use client"

import React from "react"
import { LandingNav } from "@/components/landing/LandingNav"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { EnvironmentsSection } from "@/components/landing/EnvironmentsSection"
import { TechStackSection } from "@/components/landing/TechStackSection"
import { BenefitsSection } from "@/components/landing/BenefitsSection"
import { Footer } from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <LandingNav />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <EnvironmentsSection />
      <TechStackSection />
      <BenefitsSection />
      <Footer />
    </div>
  )
}
