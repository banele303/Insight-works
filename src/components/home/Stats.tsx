const stats = [
  { num: "200+", label: "Enrolled Learners", sub: "Across Gauteng and beyond" },
  { num: "94%", label: "Matric Pass Rate", sub: "2025 NSC cohort" },
  { num: "13+", label: "Subject Areas", sub: "Full CAPS curriculum" },
  { num: "100%", label: "SACE-Certified Staff", sub: "Qualified educators only" },
];

const Stats = () => {
  return (
    <section
      id="stats"
      className="relative overflow-hidden"
      style={{ background: "#080508", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Full-width image banner */}
      <div className="relative" style={{ height: "420px" }}>
        <img
          src="/img-graduation.jpg"
          alt="Glenanda Learning Centre graduating learners"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.4)" }}
        />
        {/* Gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,5,8,0.4) 0%, rgba(8,5,8,0.1) 40%, rgba(8,5,8,0.95) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(92,6,28,0.25) 0%, transparent 60%)",
          }}
        />

        {/* Headline on image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#9f1239]" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#e2a0b0" }}>
              Our Track Record
            </span>
            <div className="h-px w-10 bg-[#9f1239]" />
          </div>
          <h2
            className="leading-[1.05] tracking-tight text-white max-w-2xl"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 900,
            }}
          >
            Proven Results for
            <br />
            <span style={{ fontStyle: "italic", color: "#38bdf8" }}>South African Families</span>
          </h2>
        </div>
      </div>

      {/* Stats strip — overlapping the image */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-28">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-7 text-center flex flex-col items-center gap-2"
              style={{
                background: idx === 0
                  ? "linear-gradient(135deg, #5c061c, #9f1239)"
                  : "rgba(255,255,255,0.03)",
                border: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              }}
            >
              <p
                className="text-white font-black"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "clamp(2rem, 3vw, 2.8rem)",
                  lineHeight: 1,
                }}
              >
                {stat.num}
              </p>
              <p className="text-white font-bold text-sm">{stat.label}</p>
              <p className="text-xs" style={{ color: idx === 0 ? "rgba(255,255,255,0.6)" : "#666" }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Two-column image feature below */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{ height: "280px" }}
          >
            <img
              src="/img-online-class.jpg"
              alt="Live online learning session"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)" }}
            />
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                Live Daily Classes
              </p>
              <p className="text-[#aaa] text-sm mt-1">Interactive · SACE educators · Grade R–12</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div
              className="relative rounded-2xl overflow-hidden flex-1"
              style={{ minHeight: "130px" }}
            >
              <img
                src="/img-teacher.jpg"
                alt="Qualified teacher"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)" }}
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2">
                <p className="text-white font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Qualified Educators</p>
                <p className="text-[#aaa] text-xs mt-0.5">SACE-registered · Subject specialists</p>
              </div>
            </div>

            <div
              className="rounded-2xl p-6 flex items-center gap-5"
              style={{
                background: "linear-gradient(135deg, rgba(56,189,248,0.07), rgba(255,255,255,0.02))",
                border: "1px solid rgba(56,189,248,0.15)",
              }}
            >
              <p
                className="text-[#38bdf8] font-black shrink-0"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", lineHeight: 1 }}
              >
                48h
              </p>
              <div>
                <p className="text-white font-bold text-sm">Application Response</p>
                <p className="text-[#888] text-xs mt-0.5">We respond to every application within 48 hours — guaranteed.</p>
              </div>
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

export default Stats;
