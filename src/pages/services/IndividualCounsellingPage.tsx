import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import Blog from "@/components/home/Blog";
import {
  User, CheckCircle2, Clock, Calendar, ArrowRight,
  Shield, Sparkles, HeartPulse, HelpCircle, MessageSquare, PhoneCall
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function IndividualCounsellingPage() {
  const benefits = [
    {
      title: "Overcoming Chronic Anxiety & Panic",
      desc: "Develop somatic grounding and cognitive reframing techniques to de-escalate anxiety spirals and restore baseline nervous system regulation."
    },
    {
      title: "Depression & Low Mood Recovery",
      desc: "Unpack emotional numbness, fatigue, and self-criticism in a compassionate space to reconnect with vital energy and intrinsic purpose."
    },
    {
      title: "Burnout & High-Pressure Coping",
      desc: "Establish healthy energetic boundaries and sustainably recalibrate your relationship with career expectations and emotional load."
    },
    {
      title: "Life Transitions & Identity Clarity",
      desc: "Navigate major milestones, relational shifts, grief, or personal crossroads with structured therapeutic clarity and validation."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Confidential Intake & Assessment",
      desc: "We begin by understanding your unique emotional landscape, current stressors, family context, and personal therapeutic goals."
    },
    {
      step: "02",
      title: "Personalized Care Plan",
      desc: "Together, we co-create an evidence-based roadmap combining CBT, mindfulness, and somatic tools tailored specifically to your needs."
    },
    {
      step: "03",
      title: "Active Healing & Tool Integration",
      desc: "Weekly or bi-weekly 50-minute sessions dedicated to unlearning destructive patterns and integrating practical daily self-care rituals."
    },
    {
      step: "04",
      title: "Long-term Resilience & Mastery",
      desc: "Evaluate progress milestones, solidify internal boundaries, and prepare you to maintain sustained mental equilibrium independently."
    }
  ];

  const faqs = [
    {
      q: "How long does individual counselling typically last?",
      a: "The duration depends on your goals. Some clients achieve significant relief and clarity within 6–10 focused sessions, while others benefit from ongoing fortnightly therapy."
    },
    {
      q: "Are individual sessions available online via telehealth?",
      a: "Yes. We offer fully encrypted, POPIA-compliant video sessions across South Africa and internationally, as well as in-person consultations at our private practice at 9 Moray Drive, Bryanston, Sandton, 2091."
    },
    {
      q: "Can I claim session fees from my Medical Aid?",
      a: "Insight Works provides detailed statements with practice and diagnostic codes that can be submitted to your medical aid scheme for reimbursement according to your plan benefits."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f2820]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-24">
        {/* ── HERO SECTION ── */}
        <section className="container mx-auto px-4 max-w-6xl mb-16 sm:mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full">
                <HeartPulse className="w-4 h-4 text-[#156e52]" />
                <span className="text-xs font-bold tracking-wider uppercase text-[#156e52]">
                  Individual Therapy &amp; Healing
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2820] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Individual <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #156e52 0%, #52b74c 60%, #ea7627 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Counselling &amp; Therapy
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
                A safe, confidential, and empathetic space to explore anxiety, depression, emotional exhaustion, and personal growth with experienced practitioner Maletsatsi Sibanda.
              </p>

              {/* Pricing & Duration Quick Pill */}
              <div className="flex flex-wrap items-center gap-4 py-2 text-sm text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold">
                  <Clock className="w-4 h-4 text-[#156e52]" /> 50–60 Minutes
                </div>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-bold text-[#156e52]">
                  <span>R650 – R850</span> per session
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" /> 100% POPIA Confidential
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/booking"
                  className="bg-gradient-to-r from-[#156e52] to-[#52b74c] hover:opacity-95 text-white px-7 py-3.5 rounded-xl font-bold text-sm text-center shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
                >
                  Book Counselling Session <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/chat"
                  className="border border-slate-200 hover:border-emerald-300 bg-white text-[#0f2820] px-6 py-3.5 rounded-xl font-bold text-sm text-center transition-all hover:bg-emerald-50/50 cursor-pointer"
                >
                  Chat with Therapy Assistant
                </Link>
              </div>
            </div>

            {/* Hero Right Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 group">
                <img
                  src="/images/services/individual-counselling.jpg"
                  alt="Individual Counselling Session"
                  className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-300">Safe Therapeutic Haven</p>
                  <p className="text-sm font-semibold">In-person at Glenanda Studio &amp; Secure Telehealth</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOCUS AREAS & WHO IT'S FOR ── */}
        <section className="bg-slate-50/60 border-y border-slate-200/80 py-16 sm:py-20 mb-20">
          <div className="container mx-auto px-4 max-w-6xl space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#156e52]">Clinical Focus Areas</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                What We Address Together
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Evidence-based psychotherapeutic modalities designed to give you clarity, emotional relief, and sustainable life toolkits.
              </p>
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

        {/* ── THE 4-STEP COUNSELLING ROADMAP ── */}
        <section className="container mx-auto px-4 max-w-6xl mb-20">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#156e52]">The Journey</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Your Therapeutic Journey
            </h2>
            <p className="text-slate-600 text-sm">
              How we structure your sessions from your first consultation to sustained emotional resilience.
            </p>
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

        {/* ── THERAPIST BIO CALLOUT ── */}
        <section className="container mx-auto px-4 max-w-5xl mb-20">
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/40 rounded-3xl p-8 sm:p-10 border border-emerald-200/80 flex flex-col md:flex-row items-center gap-8 shadow-sm">
            <img
              src="/images/therapist-portrait.jpg"
              alt="Maletsatsi Sibanda"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover object-top border-2 border-emerald-300 shadow-md shrink-0"
            />
            <div className="space-y-3 flex-1 text-center md:text-left">
              <span className="text-xs font-bold text-[#156e52] uppercase tracking-wider">Your Primary Therapist &amp; Coach</span>
              <h3 className="text-2xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                Maletsatsi Sibanda
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                "You do not have to carry everything alone. In my practice, I blend cognitive behavioural tools, empathetic presence, and somatic grounding to help you reconnect with yourself and step into a fulfilling, grounded life."
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-[#156e52]">
                  <CheckCircle2 className="w-4 h-4" /> Certified Specialist Wellness Counsellor
                </span>
                <span className="flex items-center gap-1.5 text-[#156e52]">
                  <CheckCircle2 className="w-4 h-4" /> ASCHP &amp; HPCSA Aligned
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQS SPECIFIC TO THIS SERVICE ── */}
        <section className="container mx-auto px-4 max-w-4xl mb-20">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#156e52]">Answers to Common Inquiries</span>
            <h2 className="text-3xl font-bold text-[#0f2820] font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Frequently Asked Questions
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

        {/* ── BOTTOM CTA BANNER ── */}
        <section className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-[#0f2820] via-[#156e52] to-[#52b74c] rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-xl">
            <h3 className="text-3xl sm:text-4xl font-bold font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Begin Your Healing Journey?
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Book a confidential 50-minute individual consultation today. In-person in Glenanda, JHB South and secure online video sessions available.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/booking"
                className="bg-white text-[#0f2820] hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                Schedule Individual Consultation
              </Link>
              <Link
                to="/services"
                className="border border-white/40 hover:bg-white/10 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                Explore All Services
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
