import React from 'react'
import { Link } from 'react-router-dom'
import { Wind, ArrowLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: November 2026</p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-relaxed text-xs sm:text-sm">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-green-600" /> 1. Commitment to Privacy
            </h2>
            <p>
              SaansSaathi is built on principles of data minimization and user trust. We believe health and environmental vulnerability data belong strictly to your family. We never sell, lease, or monetize personal information.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-sky-500" /> 2. Information We Collect
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Credentials:</strong> Email address and bcrypt-hashed passwords.</li>
              <li><strong>Geographic Coordinates:</strong> City or approximate neighborhood coordinates used to locate the nearest CPCB/OpenAQ monitoring station. Exact street addresses are never required.</li>
              <li><strong>Optional Family Profiles:</strong> Age groups (Child, Adult, Senior) and optional sensitivity flags (Asthma, Cardiac, Respiratory) stored exclusively to tailor protective alerts.</li>
              <li><strong>Indoor Assessments:</strong> Approximate room counts, kitchen exhaust availability, and fuel types used to generate Clean Air Room guides.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" /> 3. Security & AI Processing
            </h2>
            <p>
              All communication between your client and our backend is encrypted using TLS. AI conversational prompts sent to the Google Gemini API are anonymized and contain only environmental telemetry and demographic categories. No Personally Identifiable Information (PII) is included in LLM context windows.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" /> 4. Non-Clinical Medical Disclaimer
            </h2>
            <p>
              SaansSaathi provides preventive lifestyle, commuting, and indoor exposure reduction guidance based on published CPCB, WHO, and NCDC recommendations. It does not provide clinical diagnosis, pharmaceutical prescriptions, or medical treatment. In cases of acute respiratory distress or chest pain, always contact local emergency services immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
