import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Blog from "@/components/home/Blog";
import {
  Target, CheckCircle2, Clock, Calendar, ArrowRight,
  Shield, Sparkles, Zap, HelpCircle, Compass
} from "lucide-react";
import { Link } from "react-router";

export default function LifeCoachingPage() {
  const benefits = [
    {
      title: "Goal Clarity & Strategic Execution",
      desc: "Transform vague aspirations into concrete, prioritized action milestones with accountability mechanisms designed to maintain momentum."
    },
    {
      title: "Dismantling Imposter Syndrome & Procrastination",
      desc: "Identify limiting core beliefs, fears of failure or visibility, and replace hesitation with self-trust and decisiveness."
    },
    {
      title: "Career & Purpose Recalibration",
      desc: "Align your professional trajectory with your authentic core values, executive presence, and long-term legacy."
    },
    {
      title: "Boundaries, Habits & Energy Optimization",
      desc: "Design daily rituals that eliminate mental clutter, protect your schedule, and create sustainable high performance."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Vision & Value Blueprint",
      desc: "Assess current satisfaction across key life domains and identify your non-negotiable core values and quarterly targets."
    },
    {
      step: "02",
      title: "Roadmap Construction",
      desc: "Break down ambitious visions into manageable 30-day sprints, identifying potential roadblocks and contingency strategies."
    },
    {
      step: "03",
      title: "Bi-Weekly Action & Accountability",
      desc: "50-minute strategic sessions to evaluate wins, debug bottlenecks, and refine leadership habits in real-time."
    },
    {
      step: "04",
      title: "Self-Sustaining Mastery",
      desc: "Consolidate your self-coaching mindset to continuously elevate your life, career, and wellbeing independently."
    }
  ];

  const faqs = [
    {
      q: "What is the difference between therapy and life coaching?",
      a: "Therapy focuses primarily on emotional healing, resolving past trauma, and nervous system regulation. Coaching is forward-looking and action-oriented, focusing on strategy, habit mastery, and goal attainment."
    },
    {
      q: "How often are coaching sessions scheduled?",
      a: "Most clients thrive on bi-weekly 50-minute sessions over a 3 to 6-month period, providing enough time to implement action items between check-ins."
    },
    {
      q: "Is coaching suitable for entrepreneurs and executives?",
      a: "Yes. Many of our clients are professionals, leaders, and entrepreneurs seeking strategic sounding boards and emotional resilience tools."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f2820]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-24">
        {/* ── HERO SECTION ── */}
        <section className="container mx-auto px-4 max-w-6xl mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                <Target className="w-4 h-4 text-[#156e52]" />
                <span className="text-xs font-bold tracking-wider uppercase text-[#156e52]">
                  Strategic Self-Mastery
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2820] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Life Coaching &amp; <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Personal Mastery
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Break through self-limiting beliefs, establish rock-solid habits, and step into purposeful leadership and aligned personal fulfillment.
              </p>

              {/* Pricing & Duration Quick Pill */}
              <div className="flex flex-wrap items-center gap-4 py-2 text-sm text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold">
                  <Clock className="w-4 h-4 text-[#156e52]" /> 50 Minutes
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold text-[#156e52]">
                  <span>R600 – R800</span> per session
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Action-Oriented Strategy
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/booking"
                  className="bg-gradient-to-r from-[#156e52] to-[#52b74c] hover:opacity-95 text-white px-7 py-3.5 rounded-xl font-bold text-sm text-center shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
                >
                  Book Coaching Session <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/services"
                  className="border border-slate-200 hover:border-emerald-300 bg-white text-[#0f2820] px-6 py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:bg-emerald-50/50 cursor-pointer"
                >
                  Explore All Programs
                </Link>
              </div>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <img
                  src="/images/services/life-coaching.jpg"
                  alt="Executive Life Coaching Session"
                  className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Visionary Leadership</p>
                  <p className="text-sm font-semibold">Strategic Roadmaps &amp; Dedicated Accountability</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOCUS AREAS ── */}
        <section className="bg-slate-50/60 border-y border-slate-200/80 py-16 sm:py-20 mb-20">
          <div className="container mx-auto px-4 max-w-6xl space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#156e52]">Transformation Pillars</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Key Areas of Mastery
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((b, idx) => (
                <div key={idx} className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-[#156e52] flex items-center justify-center font-bold text-sm">
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#156e52]">The Framework</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              4-Phase Coaching Trajectory
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 relative space-y-3 shadow-xs">
                <span className="text-3xl font-black text-emerald-900/15 font-mono">{step.step}</span>
                <h3 className="text-base font-bold text-[#0f2820] leading-snug">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQS ── */}
        <section className="container mx-auto px-4 max-w-4xl mb-20">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#156e52]">Frequently Asked Questions</span>
            <h2 className="text-3xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Coaching Questions Answered
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-2">
                <h4 className="font-bold text-base text-[#0f2820] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#156e52] shrink-0" />
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
          <div className="bg-gradient-to-br from-[#0f2820] via-[#156e52] to-[#ea7627] rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-xl">
            <h3 className="text-3xl sm:text-4xl font-bold font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Elevate Your Life and Vision Today
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Book your private coaching strategy session to build unstoppable clarity and habits.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/booking"
                className="bg-white text-[#0f2820] hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                Schedule Strategy Session
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
