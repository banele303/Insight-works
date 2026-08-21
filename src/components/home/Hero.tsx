import { Link } from "react-router";
import { ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-white flex flex-col justify-between pt-24 pb-0">
      {/* ── BACKGROUND AMBIENT GRADIENTS & TEXTURE ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft rose ambient orb - top right */}
        <div
          className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full blur-3xl opacity-70"
          style={{
            background: "radial-gradient(circle, rgba(244,63,94,0.12) 0%, rgba(254,205,211,0.08) 40%, transparent 70%)",
          }}
        />
        {/* Calming sky ambient orb - bottom left */}
        <div
          className="absolute top-1/3 -left-32 w-[550px] h-[550px] rounded-full blur-3xl opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(224,242,254,0.06) 50%, transparent 70%)",
          }}
        />
        {/* Warm pearl glow in center */}
        <div
          className="absolute -bottom-20 right-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(251,207,232,0.1) 0%, transparent 60%)",
          }}
        />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(#0f172a 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Top subtle border line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent" />
      </div>

      {/* ── MAIN HERO CONTENT ── */}
      <div className="flex-1 flex items-center relative z-10 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-14 items-center">

            {/* ── LEFT — Typography + CTAs (col-span-7) ── */}
            <div className="lg:col-span-7 flex flex-col gap-7">

              {/* Main Headline */}
              <div>
                <h1
                  className="leading-[1.04] tracking-[-0.025em] text-[#0f2820]"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(2.75rem, 5.2vw, 4.75rem)",
                    fontWeight: 900,
                  }}
                >
                  Where Healing{" "}
                  <span
                    className="italic inline-block"
                    style={{
                      background: "linear-gradient(135deg, #ea7627 0%, #f59e0b 35%, #22c55e 75%, #156e52 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Begins with
                  </span>{" "}
                  <br className="hidden sm:inline" />
                  Connection & Insight
                </h1>
              </div>

              {/* Sub-copy from Flyer */}
              <p
                className="text-[#334155] leading-relaxed max-w-xl text-base sm:text-lg"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                You don't have to face life's challenges alone. Together, we can help you <strong className="text-[#156e52]">heal, grow, reconnect, and thrive</strong> through compassionate counselling and transformational life coaching.
              </p>

              {/* Credential Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {[
                  { icon: ShieldCheck, text: "Counselling Therapist & Life Coach" },
                  { icon: CheckCircle2, text: "POPIA Compliant & Confidential" },
                  { icon: HeartHandshake, text: "In-Person & Telehealth Nationwide" },
                  { icon: Sparkles, text: "Evidence-Based Emotional Healing" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-slate-700">
                    <div className="h-5 w-5 rounded-md bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-[#156e52] shrink-0">
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <span
                      className="text-sm font-medium text-[#1e293b]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/booking"
                  id="hero-apply-btn"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-white font-bold text-base rounded-xl btn-emerald-gradient cursor-pointer shadow-md"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Book a Session
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/services"
                  id="hero-programs-btn"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base text-white rounded-xl btn-orange-gradient cursor-pointer shadow-md"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Explore Services
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Social Proof Strip */}
              <div className="flex items-center gap-5 pt-3 border-t border-slate-200/70">
                {/* Avatars */}
                <div className="flex -space-x-2.5">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
                    "/images/therapist-portrait.jpg",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Client portrait"
                      className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-sm"
                    />
                  ))}
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-[#156e52] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    500+
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                    <span className="font-bold text-[#0f172a] text-xs ml-1">4.9/5</span>
                  </div>
                  <p
                    className="text-[#64748b] text-xs font-medium mt-0.5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Trusted by clients across South Africa
                  </p>
                </div>
              </div>

            </div>

            {/* ── RIGHT — Image collage (col-span-5) ── */}
            <div className="lg:col-span-5 relative">
              {/* Decorative back-plate glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/60 via-amber-100/40 to-teal-100/60 rounded-3xl blur-2xl transform -rotate-2 scale-105 pointer-events-none" />

              <div className="relative grid grid-cols-12 gap-3.5 h-[560px]">

                {/* Large portrait image (col 1-7, row 1-5) */}
                <div
                  className="col-span-7 row-span-4 rounded-2xl overflow-hidden relative bg-white border border-slate-200/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] group"
                >
                  <img
                    src="/images/therapist-seated-plant.jpg"
                    alt="Maletsatsi Sibanda - Counselling Therapist & Life Coach"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p
                      className="font-bold text-sm text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Maletsatsi Sibanda
                    </p>
                    <p className="text-emerald-200 text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      Counselling Therapist & Life Coach
                    </p>
                  </div>
                </div>

                {/* Secondary upper card - Headshot portrait (col 8-12, row 1-2) */}
                <div
                  className="col-span-5 row-span-2 rounded-2xl overflow-hidden relative bg-white border border-slate-200/80 shadow-md group"
                >
                  <img
                    src="/images/therapist-portrait.jpg"
                    alt="Maletsatsi Sibanda Portrait"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <span className="absolute bottom-2.5 left-3 text-[11px] font-bold text-white tracking-wide">
                    Lead Therapist
                  </span>
                </div>

                {/* Stat progress card (col 8-12, row 3-4) */}
                <div
                  className="col-span-5 row-span-2 rounded-2xl p-4 flex flex-col justify-between bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50"
                >
                  <div>
                    <div className="flex items-baseline justify-between">
                      <p
                        className="text-3xl font-black text-[#0f2820]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        7+
                      </p>
                      <span className="text-[10px] font-bold text-[#156e52] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                        Focus Areas
                      </span>
                    </div>
                    <p
                      className="text-[#ea7627] text-xs font-bold mt-0.5 leading-tight"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Coaching & Therapy
                    </p>
                  </div>

                  <div className="space-y-2 mt-2">
                    {[
                      { label: "Individual", pct: 92 },
                      { label: "Couples", pct: 85 },
                      { label: "Life Coaching", pct: 89 },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-[#64748b] font-medium">{s.label}</span>
                          <span className="text-[#0f172a] font-bold">~{s.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${s.pct}%`,
                              background: "linear-gradient(90deg, #156e52, #ea7627)",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom photo strip with Brand Badge (col 1-12, row 5-6) */}
                <div
                  className="col-span-12 row-span-2 rounded-2xl overflow-hidden relative bg-white border border-slate-200/80 shadow-md group"
                >
                  <img
                    src="/images/hero-therapy-session.jpg"
                    alt="Insight Works Therapy & Coaching Studio Space"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white">
                    <p className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                      In-Person & Telehealth Support
                    </p>
                    <p className="text-emerald-200 text-xs mt-0.5 font-mono">+27 79 550 1557 · South Africa</p>
                  </div>
                  <div
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-wider uppercase shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #ea7627, #156e52)",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Insight Works
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM STATS STRIP ── */}
      <div className="relative z-10 border-t border-slate-200/80 bg-slate-50/80 backdrop-blur-md mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <p
                className="text-[#475569] text-xs font-bold tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Accepting New Clients This Month
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {[
                { num: "10+", label: "Years Experience" },
                { num: "500+", label: "Clients Guided" },
                { num: "3", label: "Care Formats" },
                { num: "100%", label: "POPIA Confidential" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span
                    className="font-black text-[#0f172a] text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {s.num}
                  </span>
                  <span className="text-[#64748b] text-xs font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </section>
  );
};

export default Hero;
