import React from 'react'
import { Link } from 'react-router-dom'
import { Wind, FileCheck, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import BackButton from '@/components/common/BackButton'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
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
          <div className="flex items-center gap-3">
            <BackButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-xs text-muted-foreground">Effective Date: November 2026</p>
        </div>

        <div className="space-y-6 text-muted-foreground leading-relaxed text-xs sm:text-sm">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand-green-600" /> 1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using SaansSaathi, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of the platform.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" /> 2. Environmental Telemetry & Accuracy
            </h2>
            <p>
              Air quality data displayed on SaansSaathi is aggregated from public monitoring networks including the Central Pollution Control Board (CPCB), State Pollution Control Boards (SPCBs), and OpenAQ. While we endeavor to provide real-time accuracy, atmospheric conditions vary locally. Telemetry readings reflect monitoring station locations and may not represent hyper-local micro-environments (e.g., immediate proximity to road intersections or biomass fires).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">3. User Conduct & Responsibilities</h2>
            <p>
              Users agree to provide accurate information when configuring family vulnerability profiles and submitting community incident reports. Any malicious misuse, automated scraping, or denial of service attacks against SaansSaathi infrastructure is strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground">4. Intellectual Property & Open Source</h2>
            <p>
              SaansSaathi is an open-source platform distributed under the MIT License. You are welcome to inspect, contribute to, and fork the repository in accordance with open-source licensing terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
