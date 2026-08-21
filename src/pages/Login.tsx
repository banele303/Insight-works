import UniversalUserForm from "@/components/auth/UniversalUserForm";
import MultistepSignupForm from "@/components/auth/MultistepSignupForm";
import { SchoolBrand } from "@/components/brand/SchoolBrand";
import { useAuth } from "@/hooks/AuthProvider";
import { Navigate, Link } from "react-router";
import { useState } from "react";
import { ShieldCheck, Heart, Sparkles, ArrowLeft } from "lucide-react";

const Login = () => {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "create">("login");

  // If already logged in, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-white text-[#0f2820]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left Panel */}
      <div className="flex flex-col gap-6 p-6 sm:p-10 justify-between">
        <div className="flex items-center justify-between">
          <SchoolBrand compact />
          <Link
            to="/"
            className="text-xs font-bold text-slate-500 hover:text-[#156e52] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-6">
          <div className="w-full max-w-sm space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2 text-center">
              <div className="inline-flex items-center gap-1.5 mx-auto bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#156e52]">
                <ShieldCheck className="w-3.5 h-3.5" />
                {mode === "login" ? "Secure Portal Access" : "Client & Practitioner Portal"}
              </div>
              <h1 className="text-3xl font-black tracking-tight font-serif text-[#0f2820]">
                {mode === "login" ? "Welcome Back" : "Begin Your Journey"}
              </h1>
              <p className="text-slate-500 text-sm">
                {mode === "login"
                  ? "Sign in to access your sessions, confidential notes, and wellness dashboard."
                  : "Create an account to manage your appointments, intake records, and care plan."}
              </p>
            </div>

            {/* Form */}
            {mode === "login" ? <UniversalUserForm type={mode} /> : <MultistepSignupForm />}

            {/* Toggle */}
            <div className="text-center text-sm text-slate-600">
              {mode === "login" ? (
                <>
                  New to Insight Works?{" "}
                  <button
                    onClick={() => setMode("create")}
                    className="font-bold text-[#156e52] hover:text-[#52b74c] underline underline-offset-4 cursor-pointer"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    onClick={() => setMode("login")}
                    className="font-bold text-[#156e52] hover:text-[#52b74c] underline underline-offset-4 cursor-pointer"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>

            {/* SA Compliance note */}
            <p className="text-center text-xs text-slate-400">
              Protected under <span className="font-semibold text-slate-600">POPIA (Act 4 of 2013)</span> · 100% Confidential &amp; Encrypted
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Insight Works Therapy &amp; Coaching. All rights reserved.
        </div>
      </div>

      {/* Right Panel — Therapeutic Sanctuary Image */}
      <div className="relative hidden lg:block bg-[#0f2820]">
        <img
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1400"
          alt="Calm, serene therapy space"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f2820] via-[#0f2820]/40 to-transparent" />
        
        <div className="absolute bottom-12 left-10 right-10 text-white space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#156e52]/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Therapy &amp; Life Coaching Sanctuary
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold font-serif leading-tight">
            "You don't have to face life's challenges alone."
          </h2>
          <p className="text-emerald-100/90 text-sm max-w-md leading-relaxed">
            Together, we help you heal emotional wounds, grow self-mastery, reconnect with meaningful relationships, and thrive.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/15 text-xs text-emerald-100">
            <div>
              <p className="font-bold text-white text-base font-serif">100%</p>
              <p className="text-[11px] text-emerald-200/80">Confidential</p>
            </div>
            <div>
              <p className="font-bold text-white text-base font-serif">POPIA</p>
              <p className="text-[11px] text-emerald-200/80">Compliant</p>
            </div>
            <div>
              <p className="font-bold text-white text-base font-serif">7 Core</p>
              <p className="text-[11px] text-emerald-200/80">Disciplines</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
