import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Blog from "@/components/home/Blog";
import {
  Compass, CheckCircle2, Clock, Calendar, ArrowRight,
  Shield, Sparkles, HeartPulse, HelpCircle, Users
} from "lucide-react";
import { Link } from "react-router";

export default function YouthSupportPage() {
  const benefits = [
    {
      title: "Academic Pressure & Exam Anxiety",
      desc: "Manage high-stakes school stress, perfectionism, and procrastination with practical focus and study coping rituals."
    },
    {
      title: "Social Anxiety & Peer Dynamics",
      desc: "Navigate bullying, friendship shifts, and online social pressure while building authentic interpersonal confidence."
    },
    {
      title: "Identity, Self-Worth & Direction",
      desc: "Safe exploration of personal identity, emotional independence, and values-driven future planning without judgment."
    },
    {
      title: "Parent-Teen Communication Bridge",
      desc: "Facilitate mutual understanding, emotional de-escalation, and healthy family boundaries."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Teen & Parent Intake",
      desc: "A collaborative 50-minute consultation establishing confidentiality bounds, school context, and primary concerns."
    },
    {
      step: "02",
      title: "Building Rapport & Trust",
      desc: "Creating an open, creative, and pressure-free environment where the young person feels validated and understood."
    },
    {
      step: "03",
      title: "Coping Strategy Toolkits",
      desc: "Interactive exercises developing emotional regulation, positive self-talk, and social assertiveness skills."
    },
    {
      step: "04",
      title: "Family Alignment & Graduation",
      desc: "Equipping the young adult with self-mastery habits and establishing ongoing healthy family support channels."
    }
  ];

  const faqs = [
    {
      q: "What age range is covered in Youth & Young Adult Support?",
      a: "Our youth support is tailored for adolescents aged 13–18 as well as university students and young adults (18–25) navigating early career transitions."
    },
    {
      q: "How is confidentiality handled with parents?",
      a: "Therapy provides a confidential space for the teen. Parents receive high-level progress summaries and parenting strategies without breaching the young person's trust."
    },
    {
      q: "Can sessions be conducted online after school hours?",
      a: "Yes. Flexible late afternoon and Saturday morning telehealth slots are available to accommodate school and varsity schedules."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f2820]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-24">
        {/* ── HERO ── */}
        <section className="container mx-auto px-4 max-w-6xl mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                <Compass className="w-4 h-4 text-[#156e52]" />
                <span className="text-xs font-bold tracking-wider uppercase text-[#156e52]">
                  Adolescent &amp; Young Adult Mentorship
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2820] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Youth &amp; Young Adult <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #156e52 0%, #52b74c 60%, #ea7627 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Counselling &amp; Guidance
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Compassionate guidance for teens and university students navigating academic expectations, peer dynamics, emotional regulation, and future purpose.
              </p>

              <div className="flex flex-wrap items-center gap-4 py-2 text-sm text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold">
                  <Clock className="w-4 h-4 text-[#156e52]" /> 50 Minutes
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold text-[#156e52]">
                  <span>R550 – R750</span> per session
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" /> Safe &amp; Supportive Space
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/booking"
                  className="bg-gradient-to-r from-[#156e52] to-[#52b74c] hover:opacity-95 text-white px-7 py-3.5 rounded-xl font-bold text-sm text-center shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
                >
                  Book Youth Consultation <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/intake"
                  className="border border-slate-200 hover:border-emerald-300 bg-white text-[#0f2820] px-6 py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:bg-emerald-50/50 cursor-pointer"
                >
                  Youth Intake Form
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <img
                  src="/images/services/youth-support.jpg"
                  alt="Youth Support Session"
                  className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Empowering Young Minds</p>
                  <p className="text-sm font-semibold">Study Strategies · Emotional Balance · Identity Formation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOCUS AREAS ── */}
        <section className="bg-slate-50/60 border-y border-slate-200/80 py-16 sm:py-20 mb-20">
          <div className="container mx-auto px-4 max-w-6xl space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#156e52]">Youth Focus Areas</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Common Challenges Addressed
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#156e52]">Mentorship Path</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              How We Guide Young People
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
            <span className="text-xs font-bold uppercase tracking-wider text-[#156e52]">Answers for Families</span>
            <h2 className="text-3xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Youth Therapy FAQs
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
          <div className="bg-gradient-to-br from-[#0f2820] via-[#156e52] to-[#52b74c] rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-xl">
            <h3 className="text-3xl sm:text-4xl font-bold font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Support Your Young Adult's Future
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Book a youth consultation slot to help your teen develop resilience and clarity.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/booking"
                className="bg-white text-[#0f2820] hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                Schedule Youth Session
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
