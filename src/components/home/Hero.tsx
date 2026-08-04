import { Link } from "react-router";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0608] flex flex-col">

      {/* ── BACKGROUND TEXTURE ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />
        {/* Deep burgundy glow — top right */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(92,6,28,0.35) 0%, transparent 70%)" }} />
        {/* Sky blue glow — bottom left */}
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)" }} />
        {/* Thin horizontal rule accent */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#9f1239]/40 to-transparent" />
      </div>

      {/* ── TOP NAV SPACE ── */}
      <div className="h-20 shrink-0" />

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex items-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* ── LEFT — Typography + CTAs ── */}
            <div className="flex flex-col gap-8">

              {/* Eyebrow tag */}
              <div className="flex items-center gap-3">
                <div className="h-px w-10 bg-[#9f1239]" />
                <span
                  className="text-xs font-bold tracking-[0.25em] uppercase"
                  style={{ color: "#e2a0b0", fontFamily: "'DM Sans', sans-serif" }}
                >
                  Gauteng · Est. 2020
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1
                  className="leading-[1.0] tracking-[-0.02em]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(3rem, 6vw, 5.5rem)", fontWeight: 900, color: "#fff" }}
                >
                  Where Every
                  <br />
                  <span
                    style={{
                      fontStyle: "italic",
                      background: "linear-gradient(90deg, #f43f5e, #38bdf8)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Child Thrives
                  </span>
                  <br />
                  <span className="text-white">Academically.</span>
                </h1>
              </div>

              {/* Sub-copy */}
              <p
                className="text-[#a09aa5] leading-relaxed max-w-lg"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem" }}
              >
                Glenanda Learning Centre is a CAPS-aligned home schooling centre offering
                structured live lessons, certified assessment plans, and dedicated educators
                from Grade R through to Matric — all from the comfort of your home.
              </p>

              {/* Credential strip */}
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {[
                  "SACE-Registered Educators",
                  "CAPS Curriculum R–12",
                  "Live Daily Lessons",
                  "Certified Report Cards",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#38bdf8]" />
                    <span
                      className="text-[#ccc] text-sm font-medium"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/apply"
                  id="hero-apply-btn"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-white font-bold text-base overflow-hidden transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: "linear-gradient(135deg, #7f0c26 0%, #c01442 100%)",
                    borderRadius: "4px",
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(159,18,57,0.4)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  Apply for Enrolment
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  to="/programs"
                  id="hero-programs-btn"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-base border transition-all duration-300"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#e2e8f0",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "4px",
                    letterSpacing: "0.02em",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(56,189,248,0.4)"; (e.currentTarget as HTMLElement).style.color = "#38bdf8"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.color = "#e2e8f0"; }}
                >
                  View Programmes
                </Link>
              </div>

              {/* Social proof */}
              <div
                className="flex items-center gap-4 pt-2 border-t"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                {/* Avatars */}
                <div className="flex -space-x-2">
                  {["#5c061c", "#9f1239", "#38bdf8", "#0284c7", "#0ea5e9"].map((color, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-[#0a0608] flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: color, zIndex: 5 - i }}
                    >
                      {["T", "K", "L", "A", "M"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white text-sm font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    200+ enrolled learners
                  </p>
                  <p className="text-[#888] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Trusted by families across Gauteng
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT — Image collage ── */}
            <div className="hidden lg:grid grid-cols-5 grid-rows-6 gap-3 h-[560px]">

              {/* Large portrait — student studying */}
              <div
                className="col-span-3 row-span-4 rounded-2xl overflow-hidden relative"
                style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}
              >
                <img
                  src="/hero-student.jpg"
                  alt="Student studying at Glenanda Learning Centre"
                  className="w-full h-full object-cover"
                />
                {/* Overlay label */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}
                >
                  <p
                    className="text-white font-bold text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Structured Daily Learning
                  </p>
                  <p className="text-[#aaa] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Live classes · Grade R to Matric
                  </p>
                </div>
              </div>

              {/* Study room card */}
              <div
                className="col-span-2 row-span-3 rounded-2xl overflow-hidden relative"
                style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
              >
                <img
                  src="/hero-room.jpg"
                  alt="Home study environment"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, rgba(92,6,28,0.3) 0%, transparent 60%)" }}
                />
              </div>

              {/* Stats card */}
              <div
                className="col-span-2 row-span-3 rounded-2xl p-5 flex flex-col justify-between"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div>
                  <p
                    className="text-4xl font-black text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    94%
                  </p>
                  <p
                    className="text-[#e2a0b0] text-sm font-semibold mt-1"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Matric Pass Rate
                  </p>
                  <p className="text-[#666] text-xs mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    2025 cohort
                  </p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Maths", pct: 86 },
                    { label: "English", pct: 78 },
                    { label: "Science", pct: 91 },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#aaa]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
                        <span className="text-white font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.pct}%`,
                            background: "linear-gradient(90deg, #9f1239, #38bdf8)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graduate photo */}
              <div
                className="col-span-3 row-span-2 rounded-2xl overflow-hidden relative"
                style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
              >
                <img
                  src="/hero-graduate.jpg"
                  alt="Glenanda Learning Centre graduate"
                  className="w-full h-full object-cover object-top"
                />
                {/* CAPS badge overlay */}
                <div
                  className="absolute top-3 right-3 px-3 py-1.5 rounded text-white text-xs font-black tracking-widest uppercase"
                  style={{
                    background: "linear-gradient(135deg, #5c061c, #9f1239)",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.12em",
                  }}
                >
                  CAPS Certified
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STRIP ── */}
      <div
        className="relative z-10 border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p
              className="text-[#555] text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Enrolments open for 2026
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {[
                { num: "R–12", label: "All Grades" },
                { num: "200+", label: "Learners" },
                { num: "CAPS", label: "Aligned" },
                { num: "100%", label: "Online" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span
                    className="font-black text-white text-sm"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {s.num}
                  </span>
                  <span className="text-[#555] text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
