const phases = [
  {
    phase: "Foundation Phase",
    grades: "Grade R – 3",
    desc: "Literacy, numeracy and life skills — building the core academic foundation with care and patience.",
    subjects: ["Home Language", "Mathematics", "Life Skills"],
    color: "#38bdf8",
  },
  {
    phase: "Intermediate Phase",
    grades: "Grade 4 – 6",
    desc: "Expanding learning areas with Natural Sciences, Social Sciences, Technology and the Arts.",
    subjects: ["English", "Mathematics", "Natural Sciences", "Social Sciences", "Technology", "Arts & Culture"],
    color: "#9f1239",
  },
  {
    phase: "Senior Phase",
    grades: "Grade 7 – 9",
    desc: "Deeper subject specialisation and critical thinking to prepare learners for the FET phase.",
    subjects: ["English", "Mathematics / Maths Lit", "Natural Sciences", "Social Sciences", "EMS", "Creative Arts"],
    color: "#38bdf8",
  },
  {
    phase: "FET Phase",
    grades: "Grade 10 – 12",
    desc: "Full NSC preparation — Matric subjects, SBA tracking, and official certified assessment plans.",
    subjects: ["Mathematics / Maths Lit", "Physical Sciences", "Life Sciences", "Accounting", "Business Studies", "History", "English HL/FAL"],
    color: "#9f1239",
  },
];

const Programs = () => {
  return (
    <section
      id="programs"
      className="py-28 relative overflow-hidden"
      style={{ background: "#060408", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Decorative image strip */}
      <div className="relative h-56 mb-0 overflow-hidden">
        <img
          src="/img-books.jpg"
          alt="CAPS textbooks and school resources"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.35)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(6,4,8,0) 0%, rgba(6,4,8,1) 100%)",
          }}
        />
        {/* Centred headline on image */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#9f1239]" />
            <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#e2a0b0" }}>
              CAPS-Aligned Programmes
            </span>
            <div className="h-px w-10 bg-[#9f1239]" />
          </div>
          <h2
            className="leading-[1.05] tracking-tight text-white"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 900,
            }}
          >
            Every Grade.{" "}
            <span style={{ fontStyle: "italic", color: "#38bdf8" }}>Every Subject.</span>
          </h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">

        {/* Phase grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phases.map((phase, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${phase.color}33`;
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.035)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
              }}
            >
              {/* Phase header */}
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: phase.color }}
                  >
                    {phase.phase}
                  </p>
                  <h3
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {phase.grades}
                  </h3>
                </div>
                <div
                  className="h-px mt-4 flex-1 mx-4"
                  style={{ background: `linear-gradient(to right, ${phase.color}40, transparent)` }}
                />
              </div>

              <p className="text-[#888] text-sm leading-relaxed">{phase.desc}</p>

              {/* Subject tags */}
              <div className="flex flex-wrap gap-2">
                {phase.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="px-3 py-1 rounded text-xs font-medium"
                    style={{
                      background: `${phase.color}10`,
                      border: `1px solid ${phase.color}25`,
                      color: "#ccc",
                    }}
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom image + stats row */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graduation photo */}
          <div
            className="lg:col-span-2 relative rounded-2xl overflow-hidden"
            style={{ height: "260px", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
          >
            <img
              src="/img-graduation.jpg"
              alt="Glenanda Learning Centre graduating class"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }}
            />
            <div className="absolute left-7 top-1/2 -translate-y-1/2">
              <p
                className="text-white font-black text-4xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                94%
              </p>
              <p className="text-[#ddd] font-semibold text-sm mt-1">Matric Pass Rate 2025</p>
              <p className="text-[#aaa] text-xs mt-0.5">CAPS-aligned · SACE certified educators</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-col gap-4">
            {[
              { num: "200+", label: "Active Learners", sub: "Across all grades" },
              { num: "13", label: "Subject Areas", sub: "Full CAPS coverage" },
              { num: "4", label: "Phase Programmes", sub: "Foundation to FET" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 rounded-xl p-5 flex flex-col justify-center"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p
                  className="text-white font-black text-3xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {stat.num}
                </p>
                <p className="text-white text-sm font-semibold mt-0.5">{stat.label}</p>
                <p className="text-[#666] text-xs">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </section>
  );
};

export default Programs;
