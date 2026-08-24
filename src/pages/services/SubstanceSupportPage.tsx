import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Blog from "@/components/home/Blog";
import {
  ShieldAlert, CheckCircle2, Clock, Calendar, ArrowRight,
  Shield, Sparkles, HeartPulse, HelpCircle, Activity
} from "lucide-react";
import { Link } from "react-router";

export default function SubstanceSupportPage() {
  const benefits = [
    {
      title: "Harm Reduction & Compassionate Coping",
      desc: "A non-judgmental, shame-free framework to evaluate dependency triggers and establish realistic harm reduction targets."
    },
    {
      title: "Trigger Identification & De-escalation",
      desc: "Unpack the emotional and environmental cues (stress, social environments, isolation) that prompt compulsive urges."
    },
    {
      title: "Relapse Prevention Toolkits",
      desc: "Develop personalized somatic grounding rituals and emergency response plans to navigate cravings safely."
    },
    {
      title: "Family Recovery & Boundary Repair",
      desc: "Rebuild interpersonal trust, communication transparency, and healthy accountability systems with loved ones."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Confidential Intake & Habit Assessment",
      desc: "An empathetic, judgment-free assessment of usage patterns, underlying emotional triggers, and personal goals."
    },
    {
      step: "02",
      title: "Personalized Harm-Reduction Plan",
      desc: "Tailored strategies combining cognitive habit replacement, emotional coping toolkits, and lifestyle adjustments."
    },
    {
      step: "03",
      title: "Trigger De-escalation & Coping",
      desc: "Weekly 50-minute sessions practicing real-world craving management and emotional regulation."
    },
    {
      step: "04",
      title: "Sustained Sobriety & Lifestyle Balance",
      desc: "Solidifying healthy support networks, boundary maintenance, and long-term self-worth."
    }
  ];

  const faqs = [
    {
      q: "Is complete abstinence required before starting support?",
      a: "No. We adopt a compassionate, harm-reduction approach that meets you exactly where you are, supporting your journey towards moderation or complete sobriety based on your goals."
    },
    {
      q: "Is substance counselling completely confidential?",
      a: "Yes. All discussions are protected under strict Section 18 POPIA confidentiality and clinical ethical standards."
    },
    {
      q: "Do you coordinate with medical detox or inpatient clinics?",
      a: "Yes. Where medical detox or medical management is required, we collaborate with certified medical physicians and recovery facilities."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f2820]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-24">
        {/* ── HERO ── */}
        <section className="container mx-auto px-4 max-w-6xl mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">
                <ShieldAlert className="w-4 h-4 text-[#ea7627]" />
                <span className="text-xs font-bold tracking-wider uppercase text-[#ea7627]">
                  Empathetic Habit &amp; Addiction Recovery
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2820] leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Substance Use Support &amp; <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #ea7627 0%, #d9534f 50%, #156e52 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Habit Recovery
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Shame-free, empathetic guidance providing practical coping toolkits, trigger management, and compassionate relapse prevention pathways.
              </p>

              <div className="flex flex-wrap items-center gap-4 py-2 text-sm text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold">
                  <Clock className="w-4 h-4 text-[#ea7627]" /> 50–60 Minutes
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold text-[#ea7627]">
                  <span>R650 – R850</span> per session
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" /> 100% Confidential &amp; Safe
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/booking"
                  className="bg-gradient-to-r from-[#ea7627] to-[#d9534f] hover:opacity-95 text-white px-7 py-3.5 rounded-xl font-bold text-sm text-center shadow-md shadow-amber-900/15 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
                >
                  Book Recovery Session <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/chat"
                  className="border border-slate-200 hover:border-amber-300 bg-white text-[#0f2820] px-6 py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:bg-amber-50/50 cursor-pointer"
                >
                  Chat with Therapy Assistant
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <img
                  src="/images/services/substance-support.jpg"
                  alt="Substance Use Support Session"
                  className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Shame-Free Support</p>
                  <p className="text-sm font-semibold">Harm Reduction · Trigger Mapping · Rebuilding Trust</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOCUS AREAS ── */}
        <section className="bg-amber-50/30 border-y border-amber-200/60 py-16 sm:py-20 mb-20">
          <div className="container mx-auto px-4 max-w-6xl space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ea7627]">Recovery Pillars</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Poppins', sans-serif" }}>
                How We Support Your Recovery
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((b, idx) => (
                <div key={idx} className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#ea7627] flex items-center justify-center font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-lg text-[#0f2820] font-serif" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {b.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ROADMAP ── */}
        <section className="container mx-auto px-4 max-w-6xl mb-20">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ea7627]">The Pathway</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Poppins', sans-serif" }}>
              4 Stages to Sustainable Freedom
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 relative space-y-3 shadow-xs">
                <span className="text-3xl font-black text-amber-900/15 font-mono">{step.step}</span>
                <h3 className="text-base font-bold text-[#0f2820] leading-snug">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQS ── */}
        <section className="container mx-auto px-4 max-w-4xl mb-20">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ea7627]">Common Questions</span>
            <h2 className="text-3xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Poppins', serif" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-2">
                <h4 className="font-bold text-base text-[#0f2820] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#ea7627] shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-[#1c130c] via-[#ea7627] to-[#156e52] rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-xl">
            <h3 className="text-3xl sm:text-4xl font-bold font-serif" style={{ fontFamily: "'Poppins', serif" }}>
              Take the Courageous Step Forward
            </h3>
            <p className="text-amber-100 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Book a confidential recovery session and build practical coping toolkits.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/booking"
                className="bg-white text-[#0f2820] hover:bg-amber-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                Schedule Recovery Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Blog />
      <Footer />
    </div>
  );
}
