import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Programs from "@/components/home/Programs";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Blog from "@/components/home/Blog";
import Newsletter from "@/components/home/Newsletter";
import FAQPreview from "@/components/home/FAQPreview";
import Footer from "@/components/home/Footer";
import { Link } from "react-router";
import { ArrowRight, HeartPulse, CalendarCheck, ClipboardType, ShieldCheck, Award, Lock, Sparkles } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-white min-h-screen text-[#0f172a] selection:bg-rose-100 selection:text-rose-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      
      <main className="flex flex-col">
        <Hero />

        {/* ── HPCSA ACCREDITATION & TRUST STRIP ── */}
        <section className="py-10 border-y border-slate-200/80 bg-[#f8fafc] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[#64748b] text-xs font-bold uppercase tracking-[0.25em] mb-7">
              Trusted, Compliant & HPCSA-Registered Therapy Practice
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {[
                { icon: Award, title: "HPCSA Registered", sub: "Clinical Psychologists & Counselors" },
                { icon: Lock, title: "POPIA Compliant", sub: "100% Confidential Data Protection" },
                { icon: ShieldCheck, title: "Medical Aid Accepted", sub: "Discovery, Momentum, Bonitas & more" },
                { icon: Sparkles, title: "Evidence-Based", sub: "CBT, ACT, Psychodynamic & EMDR" },
              ].map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200/70 shadow-2xs hover:border-rose-200 hover:shadow-sm transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#9f1239] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#0f172a] tracking-tight">{badge.title}</p>
                      <p className="text-[11px] text-[#64748b] leading-tight">{badge.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <HowItWorks />
        <Features />
        <Programs />
        <Stats />
        <Testimonials />
        <FAQPreview />
        <Blog />
        <Newsletter />

        {/* ── LUXURY BOTTOM CTA BANNER ── */}
        <section className="py-24 lg:py-32 relative overflow-hidden bg-white">
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-rose-100/40 via-sky-100/30 to-rose-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-[#fff7f8] via-white to-[#f0f9ff] p-8 sm:p-14 lg:p-20 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06),0_10px_30px_-5px_rgba(159,18,57,0.04)] text-center">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-rose-200/80 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#9f1239] shadow-2xs mb-8">
                <HeartPulse className="h-4 w-4 text-[#be123c]" />
                Your First Session Awaits
              </div>

              {/* Title */}
              <h2
                className="text-3xl sm:text-4xl md:text-6xl font-black text-[#0f172a] mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Begin Your Healing Journey with{" "}
                <span
                  className="italic"
                  style={{
                    background: "linear-gradient(135deg, #881337 0%, #be123c 50%, #0284c7 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Compassionate Support
                </span>
              </h2>

              <p className="text-base sm:text-lg text-[#475569] mb-12 max-w-2xl mx-auto leading-relaxed">
                Take the courageous first step toward clarity, resilience, and emotional peace. Our registered practitioners provide a safe, non-judgmental space to help you heal, grow, and thrive.
              </p>

              {/* 3-step mini strip in crisp white cards */}
              <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto mb-12 text-left">
                {[
                  {
                    icon: CalendarCheck,
                    step: "01",
                    title: "Book Online",
                    desc: "Choose an in-person or telehealth time slot that suits you.",
                  },
                  {
                    icon: ClipboardType,
                    step: "02",
                    title: "Digital Intake",
                    desc: "Share your background securely via our POPIA form.",
                  },
                  {
                    icon: HeartPulse,
                    step: "03",
                    title: "Meet Your Therapist",
                    desc: "Connect with your practitioner and begin your care plan.",
                  },
                ].map(({ icon: Icon, step, title, desc }) => (
                  <div
                    key={title}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-rose-200 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-[#9f1239] group-hover:scale-105 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 font-serif">{step}</span>
                    </div>
                    <p className="text-[#0f172a] font-bold text-base font-serif mb-1">{title}</p>
                    <p className="text-[#64748b] text-xs leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link
                  to="/booking"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#881337] to-[#be123c] text-white px-9 py-4 rounded-xl font-bold text-base hover:shadow-xl hover:shadow-rose-900/25 transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
                >
                  Book a Session <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="w-full sm:w-auto bg-white border border-slate-200 text-[#0f172a] px-8 py-4 rounded-xl font-bold text-base hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center shadow-2xs"
                >
                  Learn About Our Team
                </Link>
              </div>

              {/* Trust Subtext */}
              <p className="text-xs text-[#64748b] mt-8 font-medium">
                Strictly Confidential · HPCSA Registered Professionals · Medical Aid Claim Statements Provided
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
    </div>
  );
};

export default Home;
