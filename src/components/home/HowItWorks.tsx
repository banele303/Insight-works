import { Link } from "react-router";

const steps = [
  {
    num: "01",
    title: "Submit Your Application",
    desc: "Fill in your learner's details online. Our admissions team reviews and responds within 24 hours — no lengthy paperwork.",
  },
  {
    num: "02",
    title: "Personalised Onboarding",
    desc: "Get instant access to the parent & learner portals. View timetables, CAPS textbooks, and your personalised study schedule.",
  },
  {
    num: "03",
    title: "Attend Live Daily Classes",
    desc: "Learners join live sessions with SACE-registered educators each day — interactive, structured, and curriculum-aligned.",
  },
  {
    num: "04",
    title: "Certified Assessments & Reports",
    desc: "Complete CAPS-aligned SBA tasks and term exams. Parents receive official report cards every term.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-28 relative overflow-hidden"
      style={{ background: "#080508", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Subtle burgundy glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(92,6,28,0.18) 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[#9f1239]" />
              <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: "#e2a0b0" }}>
                Simple Process
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
              How Glenanda
              <br />
              <span style={{ fontStyle: "italic", color: "#38bdf8" }}>Learning Works</span>
            </h2>
          </div>
          <p className="text-[#888] leading-relaxed text-base lg:pt-8">
            From enrolment to your child's first official report card — our structured four-step journey keeps every learner on track with the full CAPS curriculum.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left — image + enrolment scene */}
          <div className="flex flex-col gap-4">
            {/* Big image */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ height: "360px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}
            >
              <img
                src="/img-online-class.jpg"
                alt="Student attending live online class at Glenanda Learning Centre"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }}
              />
              {/* Overlay badge */}
              <div
                className="absolute bottom-5 left-5 right-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Live Daily Classes
                  </p>
                  <p className="text-[#aaa] text-xs">SACE-registered educators · Grade R–12</p>
                </div>
                <div
                  className="px-3 py-1.5 rounded text-white text-xs font-black"
                  style={{ background: "linear-gradient(135deg, #5c061c, #9f1239)", letterSpacing: "0.08em" }}
                >
                  LIVE
                </div>
              </div>
            </div>

            {/* Two small cards below */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{ height: "160px", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
              >
                <img src="/img-teacher.jpg" alt="SACE-registered teacher" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" }}
                />
                <p className="absolute bottom-3 left-3 text-white text-xs font-bold">SACE Educators</p>
              </div>
              <div
                className="rounded-2xl p-5 flex flex-col justify-between"
                style={{
                  background: "linear-gradient(135deg, rgba(56,189,248,0.07), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(56,189,248,0.15)",
                }}
              >
                <p className="text-[#38bdf8] text-xs font-bold uppercase tracking-widest">Pass Rate</p>
                <div>
                  <p
                    className="text-white text-4xl font-black"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    94%
                  </p>
                  <p className="text-[#888] text-xs mt-1">Matric 2025 cohort</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — numbered steps */}
          <div className="flex flex-col gap-0">
            {steps.map((step, idx) => (
              <div
                key={step.num}
                className="flex gap-6 pb-8 relative"
                style={{ borderLeft: idx < steps.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent", marginLeft: "20px", paddingLeft: "32px" }}
              >
                {/* Circle number */}
                <div
                  className="absolute -left-[20px] top-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                  style={{
                    background: idx === 0 ? "linear-gradient(135deg, #5c061c, #9f1239)" : "rgba(255,255,255,0.04)",
                    border: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: idx === 0 ? "#fff" : "#666",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {step.num}
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <h3
                    className="text-white font-bold text-lg"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-[#888] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}

            {/* CTA */}
            <div className="mt-4" style={{ marginLeft: "20px", paddingLeft: "32px" }}>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-bold text-sm transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #7f0c26, #c01442)",
                  borderRadius: "4px",
                  letterSpacing: "0.04em",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(159,18,57,0.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                Start Your Application →
              </Link>
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

export default HowItWorks;
