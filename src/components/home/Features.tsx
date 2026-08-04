import { Link } from "react-router";

const features = [
  {
    label: "Live Classes",
    title: "Daily Interactive Lessons",
    desc: "Every learner attends structured live sessions with SACE-registered educators. Classes are recorded so nothing is ever missed.",
    img: "/img-online-class.jpg",
    stat: "Daily",
    statLabel: "Live sessions",
  },
  {
    label: "Expert Teachers",
    title: "SACE-Registered Educators",
    desc: "All our teachers are certified and subject-specialist — passionate about helping South African learners achieve their best results.",
    img: "/img-teacher.jpg",
    stat: "100%",
    statLabel: "SACE certified",
  },
  {
    label: "CAPS Curriculum",
    title: "Full National Curriculum",
    desc: "Every subject, every grade — Grade R to Matric — covered in full alignment with South Africa's CAPS framework.",
    img: "/img-books.jpg",
    stat: "R–12",
    statLabel: "All grades",
  },
  {
    label: "Results",
    title: "Proven Academic Results",
    desc: "Our learners consistently achieve distinction-level results. Join a community where excellence is the standard.",
    img: "/img-graduation.jpg",
    stat: "94%",
    statLabel: "Matric pass rate",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-28 relative overflow-hidden"
      style={{ background: "#0a0608", fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#9f1239]" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#e2a0b0" }}>
                Why Glenanda
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
              Everything Your Child
              <br />
              <span style={{ fontStyle: "italic", color: "#38bdf8" }}>Needs to Excel</span>
            </h2>
          </div>
          <p className="text-[#888] max-w-md leading-relaxed text-base lg:text-right">
            A complete home schooling solution — from live certified classes to official CAPS report cards — all under one roof.
          </p>
        </div>

        {/* Feature cards — 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden flex flex-col"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.02)",
                transition: "border-color 0.3s, transform 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(56,189,248,0.2)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ height: "220px" }}>
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(8,5,8,0.8) 100%)" }}
                />
                {/* Stat overlay */}
                <div className="absolute bottom-4 right-4 text-right">
                  <p
                    className="text-white font-black text-3xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {feature.stat}
                  </p>
                  <p className="text-[#aaa] text-xs">{feature.statLabel}</p>
                </div>
                {/* Label pill */}
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded text-xs font-bold text-white"
                  style={{ background: "rgba(92,6,28,0.85)", letterSpacing: "0.06em" }}
                >
                  {feature.label}
                </div>
              </div>

              {/* Text */}
              <div className="p-7 flex flex-col gap-3">
                <h3
                  className="text-white font-bold text-xl"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-[#888] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-16 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{
            background: "linear-gradient(135deg, rgba(92,6,28,0.15) 0%, rgba(56,189,248,0.05) 100%)",
            border: "1px solid rgba(159,18,57,0.2)",
          }}
        >
          <div>
            <p
              className="text-white font-bold text-xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to give your child the best start?
            </p>
            <p className="text-[#888] text-sm mt-1">Enrolments for 2026 are open now. Limited seats per grade.</p>
          </div>
          <Link
            to="/apply"
            className="shrink-0 inline-flex items-center gap-2 px-8 py-4 text-white font-bold text-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #7f0c26, #c01442)",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(159,18,57,0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            Apply Now →
          </Link>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>
    </section>
  );
};

export default Features;
