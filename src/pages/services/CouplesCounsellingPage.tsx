import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Blog from "@/components/home/Blog";
import {
  Heart, CheckCircle2, Clock, Calendar, ArrowRight,
  Shield, Sparkles, HeartPulse, HelpCircle, Users, MessageSquare
} from "lucide-react";
import { Link } from "react-router";

export default function CouplesCounsellingPage() {
  const benefits = [
    {
      title: "Dismantling Destructive Conflict Cycles",
      desc: "Identify repetitive triggers, defensiveness, and criticism (the Gottman 'Four Horsemen') and replace them with compassionate, de-escalating communication."
    },
    {
      title: "Rebuilding Trust & Emotional Intimacy",
      desc: "Safely process past breaches of trust, emotional withdrawal, or infidelity with structured therapeutic neutrality and attachment repair."
    },
    {
      title: "Pre-Marital & Long-Term Alignment",
      desc: "Discuss core values, financial expectations, family dynamics, and conflict boundaries before taking decisive lifetime marital steps."
    },
    {
      title: "Deepening Empathy & Sexual Closeness",
      desc: "Rekindle emotional safety and mutual desire through open, non-judgmental dialogue facilitated by an impartial specialist."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Joint Assessment & Dynamic Mapping",
      desc: "A collaborative 75-minute initial session to understand both partner's perspectives, relationship history, and primary pain points without finger-pointing."
    },
    {
      step: "02",
      title: "Individual Context Sessions",
      desc: "Optional confidential 1-on-1 check-ins with each partner to understand childhood attachment templates and personal goals."
    },
    {
      step: "03",
      title: "Structured Dialogue & Antidote Practice",
      desc: "In-session conflict processing where you learn to pause escalation, validate emotions, and negotiate repair in real-time."
    },
    {
      step: "04",
      title: "Sustainable Connection Rituals",
      desc: "Establish weekly rituals of connection, proactive problem-solving frameworks, and long-term relational health protocols."
    }
  ];

  const faqs = [
    {
      q: "What if one partner is hesitant or resistant to therapy?",
      a: "This is completely normal. Our initial session is non-judgmental and neutral—we do not take sides or assign blame. We focus simply on understanding both experiences."
    },
    {
      q: "How long are couples counselling sessions?",
      a: "Couples sessions are 60 to 75 minutes to ensure ample time for both partners to speak, be heard, and practice constructive tools."
    },
    {
      q: "Can we do couples sessions online?",
      a: "Yes. Telehealth couples sessions can be conducted whether you are in the same room sharing a screen or logging in from separate locations."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f2820]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-24">
        {/* ── HERO SECTION ── */}
        <section className="container mx-auto px-4 max-w-6xl mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full">
                <Heart className="w-4 h-4 text-[#ea7627]" />
                <span className="text-xs font-bold tracking-wider uppercase text-[#ea7627]">
                  Couples &amp; Marriage Therapy
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2820] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Couples &amp; Relationship <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #ea7627 0%, #d9534f 50%, #156e52 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Counselling &amp; Healing
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Break free from destructive communication patterns, rebuild relational trust, and rediscover genuine emotional closeness in a balanced, neutral environment.
              </p>

              {/* Pricing & Duration Quick Pill */}
              <div className="flex flex-wrap items-center gap-4 py-2 text-sm text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold">
                  <Clock className="w-4 h-4 text-[#ea7627]" /> 60–75 Minutes
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold text-[#ea7627]">
                  <span>R850 – R1,100</span> per session
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" /> Neutral &amp; Confidential
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/booking"
                  className="bg-gradient-to-r from-[#ea7627] to-[#d9534f] hover:opacity-95 text-white px-7 py-3.5 rounded-xl font-bold text-sm text-center shadow-md shadow-amber-900/15 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
                >
                  Book Couples Consultation <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/intake"
                  className="border border-slate-200 hover:border-amber-300 bg-white text-[#0f2820] px-6 py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:bg-amber-50/50 cursor-pointer"
                >
                  Couples Intake Form
                </Link>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <img
                  src="/images/services/couples-counselling.jpg"
                  alt="Couples Counselling Session"
                  className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Constructive Dialogue</p>
                  <p className="text-sm font-semibold">Equal Voice for Both Partners · No Finger Pointing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOCUS AREAS ── */}
        <section className="bg-amber-50/30 border-y border-amber-200/60 py-16 sm:py-20 mb-20">
          <div className="container mx-auto px-4 max-w-6xl space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#ea7627]">Key Relationship Modalities</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                How We Help Couples Flourish
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Using Emotionally Focused Therapy (EFT) and Gottman Institute methods to create lasting harmony.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((b, idx) => (
                <div key={idx} className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#ea7627] flex items-center justify-center font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-lg text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#ea7627]">Relational Roadmap</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Steps to Relationship Renewal
            </h2>
            <p className="text-slate-600 text-sm">
              From defusing volatile arguments to establishing lasting mutual appreciation.
            </p>
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
            <h2 className="text-3xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
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
          <div className="bg-gradient-to-br from-[#1a140e] via-[#ea7627] to-[#d9534f] rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-xl">
            <h3 className="text-3xl sm:text-4xl font-bold font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Start Repairing &amp; Deepening Your Connection
            </h3>
            <p className="text-amber-100 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Book a joint 75-minute consultation to begin cultivating harmony and understanding.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/booking"
                className="bg-white text-[#0f2820] hover:bg-amber-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                Schedule Couples Consultation
              </Link>
              <Link
                to="/services"
                className="border border-white/40 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                View All Services
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
