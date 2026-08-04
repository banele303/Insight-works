const testimonials = [
  {
    name: "Mrs. Nomsa Dlamini",
    role: "Parent · Grade 10 learner",
    initials: "ND",
    color: "#9f1239",
    quote:
      "Glenanda Learning Centre completely changed our family's experience with home schooling. The teachers are exceptional and my son's marks have improved dramatically. The report cards are detailed and honest.",
    tag: "Parent Feedback",
  },
  {
    name: "Mr. Thabo Mokoena",
    role: "Parent · Grade 7 learner",
    initials: "TM",
    color: "#38bdf8",
    quote:
      "The live classes are incredibly well-structured. My daughter never feels like she's missing out compared to traditional school. If anything, she gets more one-on-one attention and support.",
    tag: "Parent Feedback",
  },
  {
    name: "Ms. Fatima Adams",
    role: "Parent · Grade 4 learner",
    initials: "FA",
    color: "#5c061c",
    quote:
      "I was nervous about home schooling but Glenanda made it seamless. From the very first day the onboarding was clear, the timetable was set, and the teachers were welcoming. Highly recommended.",
    tag: "Parent Feedback",
  },
  {
    name: "Mr. Sipho Ndlovu",
    role: "Parent · Matric learner",
    initials: "SN",
    color: "#0ea5e9",
    quote:
      "My son wrote Matric with Glenanda and passed with a Bachelor's pass. The CAPS coverage was thorough, the assessments were rigorous, and the educators pushed him to his best potential.",
    tag: "Parent Feedback",
  },
  {
    name: "Dr. Liesl van Wyk",
    role: "Parent · Grade 8 & 10 learners",
    initials: "LV",
    color: "#9f1239",
    quote:
      "We have two children enrolled and the difference in academic confidence is remarkable. The Glenanda team genuinely cares about each learner individually — it shows in every class.",
    tag: "Parent Feedback",
  },
  {
    name: "Ms. Zanele Khumalo",
    role: "Parent · Grade 11 learner",
    initials: "ZK",
    color: "#38bdf8",
    quote:
      "What I love most is the transparency — I can see my child's progress every week. The educators communicate openly and respond quickly. It feels like a real partnership.",
    tag: "Parent Feedback",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-28 relative overflow-hidden"
      style={{ background: "#060408", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Decorative glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(56,189,248,0.04) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#9f1239]" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#e2a0b0" }}>
                What Parents Say
              </span>
            </div>
            <h2
              className="leading-[1.05] tracking-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 900,
                color: "#fff",
              }}
            >
              Trusted by Families
              <br />
              <span style={{ fontStyle: "italic", color: "#38bdf8" }}>Across Gauteng</span>
            </h2>
          </div>

          {/* Rating block */}
          <div className="flex items-center gap-6">
            <div
              className="rounded-2xl p-6 flex flex-col items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #5c061c, #9f1239)",
                minWidth: "120px",
              }}
            >
              <p
                className="text-white font-black text-5xl"
                style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1 }}
              >
                5.0
              </p>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-white/70 text-xs mt-1">Average rating</p>
            </div>
            <p className="text-[#888] text-sm leading-relaxed max-w-xs">
              Every review is submitted by real parents of enrolled learners. We believe in full transparency.
            </p>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${t.color}30`;
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
              }}
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#bbb] text-sm leading-relaxed italic flex-1">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-[#666] text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom image */}
        <div
          className="mt-14 relative rounded-2xl overflow-hidden"
          style={{ height: "220px" }}
        >
          <img
            src="/img-graduation.jpg"
            alt="Glenanda Learning Centre graduate success"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.45)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)" }}
          />
          <div className="absolute left-8 top-1/2 -translate-y-1/2">
            <p
              className="text-white font-bold text-2xl max-w-sm"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Join hundreds of families who chose Glenanda.
            </p>
            <p className="text-[#aaa] text-sm mt-2">Enrolments for 2026 are now open.</p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </section>
  );
};

export default Testimonials;
