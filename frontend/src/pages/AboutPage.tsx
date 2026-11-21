import React from 'react'
import { Link } from 'react-router-dom'
import { Wind, ArrowLeft, Shield, Users, HeartHandshake, Sparkles, Cpu, Database, MapPin } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Navbar */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-green-700 to-brand-green-500 flex items-center justify-center text-white shadow-md">
              <Wind className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-green-800 dark:text-brand-green-400">
              Saans<span className="text-brand-sky-500">Saathi</span>
            </span>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 pt-12 space-y-12">
        {/* Hero */}
        <div className="space-y-3 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green-600 bg-brand-green-50 dark:bg-brand-green-950 px-3 py-1 rounded-full border border-brand-green-200 dark:border-brand-green-900 inline-block">
            Our Mission & Purpose
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Protecting Indian Families from Winter Smog & Urban Air Pollution
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            SaansSaathi (सांस साथी — <em>Your Breath Companion</em>) was conceived to solve the critical gap in air quality monitoring: turning cold numbers into life-saving, daily family decisions.
          </p>
        </div>

        {/* The Problem Statement */}
        <div className="p-8 rounded-3xl bg-card border border-border space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-500" /> The Winter Inversion Crisis
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            During northern and western Indian winters, surface radiation cooling traps cold air beneath a warm ceiling layer (atmospheric temperature inversion). As vehicular emissions, industrial fumes, and crop residue smoke get trapped at breathing height, AQI levels repeatedly surge beyond 300 to 500+ (Very Poor to Severe).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Existing dashboards merely display red digits. They don’t tell a mother when it is safe to open windows, they don't guide an asthmatic grandfather when to avoid morning strolls, and they don’t provide low-cost engineering solutions for indoor particulate infiltration. SaansSaathi does all three.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <Users className="w-8 h-8 text-brand-green-600 mb-2" />
            <h3 className="font-bold text-base">Demographic Vulnerability</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Personalized risk evaluations for infants, school-going children, seniors, and patients with cardiac or COPD conditions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <Sparkles className="w-8 h-8 text-amber-500 mb-2" />
            <h3 className="font-bold text-base">Affordable Engineering</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              EPA-evaluated Clean Air Room protocols and DIY box-fan purifiers built for under ₹1,500 using easily sourced domestic components.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <Cpu className="w-8 h-8 text-sky-500 mb-2" />
            <h3 className="font-bold text-base">Medical Safety Guardrails</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI recommendations enriched with localized context while strictly governed by clinical triage guardrails and emergency referrals.
            </p>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Technology Architecture</h2>
          <div className="p-6 rounded-2xl bg-muted/40 border border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="font-bold text-foreground block">Frontend</span>
              <span className="text-muted-foreground">React 19, TypeScript, Vite, Tailwind CSS v3</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Backend</span>
              <span className="text-muted-foreground">Spring Boot 3.2, Java 17, Spring Security</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">Database</span>
              <span className="text-muted-foreground">MySQL 8.0, Flyway Migrations (23 tables)</span>
            </div>
            <div>
              <span className="font-bold text-foreground block">AI & Telemetry</span>
              <span className="text-muted-foreground">Google Gemini 1.5 Flash, OpenAQ v3, Open-Meteo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
