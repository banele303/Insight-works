import { Link } from "react-router";
import { ArrowRight, Calendar, FileText, UserCheck, Sparkles, ShieldCheck } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Calendar,
    title: "Book Online in 2 Minutes",
    desc: "Choose your preferred format (in-person in Johannesburg or online telehealth nationwide) and select a convenient time via our real-time booking scheduler.",
  },
  {
    num: "02",
    icon: FileText,
    title: "Complete Digital Intake Form",
    desc: "Fill out a confidential, POPIA-compliant onboarding form detailing your background, current challenges, and personal therapy or coaching goals.",
  },
  {
    num: "03",
    icon: UserCheck,
    title: "Connect with Maletsatsi Sibanda",
    desc: "Attend your first session in a warm, non-judgmental sanctuary. Together, we unpack what brings you in and tailor an empowering roadmap.",
  },
  {
    num: "04",
    icon: Sparkles,
    title: "Heal, Grow, Reconnect & Thrive",
    desc: "Engage in structured, compassionate sessions at your own pace. Develop deeper self-mastery, emotional resilience, and authentic peace.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 lg:py-32 relative overflow-hidden bg-[#fbfdfc]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 lg:mb-20">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#156e52]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
                Your Journey With Us
              </span>
            </div>
            <h2
              className="leading-[1.08] tracking-tight text-[#0f2820]"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                fontWeight: 900,
              }}
            >
              How Care Works at{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Insight Works
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-[#475569] leading-relaxed text-base lg:text-lg">
              You don't have to face life's challenges alone. From your initial booking to sustainable growth, every step is designed for safety, confidentiality, and empowerment.
            </p>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left — Image showcase */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Big featured image */}
            <div
              className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] group"
              style={{ height: "390px" }}
            >
              <img
                src="/images/maletsatsi-portrait.jpg"
                alt="Maletsatsi Sibanda - Counselling Therapist & Life Coach"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/15 to-transparent" />
              
              {/* Overlay card */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                <div>
                  <p className="text-white font-bold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Maletsatsi Sibanda
                  </p>
                  <p className="text-emerald-200 text-xs mt-0.5">Counselling Therapist & Life Coach</p>
                </div>
                <div
                  className="px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-md"
                  style={{ background: "linear-gradient(135deg, #156e52, #ea7627)" }}
                >
                  INSIGHT WORKS
                </div>
              </div>
            </div>

            {/* Two small support cards below */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-2xl overflow-hidden relative bg-white border border-slate-200/80 shadow-sm group"
                style={{ height: "150px" }}
              >
                <img
                  src="/images/therapist-seated-room.jpg"
                  alt="Therapy sanctuary"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <p className="text-xs font-bold leading-tight">Private Sanctuary</p>
                </div>
              </div>

              <div
                className="rounded-2xl p-5 flex flex-col justify-between bg-white border border-slate-200/90 shadow-sm"
              >
                <span className="text-[#ea7627] text-xs font-bold uppercase tracking-widest">
                  Care Focus
                </span>
                <div>
                  <p
                    className="text-[#0f2820] text-3xl font-black"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    7+
                  </p>
                  <p className="text-[#64748b] text-xs font-medium mt-0.5">Core Disciplines</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Step-by-step list */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="space-y-6">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="group flex gap-5 bg-white border border-slate-200/80 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-300 relative"
                  >
                    {/* Number badge */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        background: idx === 0 ? "linear-gradient(135deg, #156e52, #52b74c)" : "#f8fafc",
                        color: idx === 0 ? "#ffffff" : "#0f2820",
                        border: idx === 0 ? "none" : "1px solid #e2e8f0",
                        boxShadow: idx === 0 ? "0 4px 12px rgba(21,110,82,0.25)" : "none",
                      }}
                    >
                      <span className="font-serif">{step.num}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className="w-4 h-4 text-[#156e52]" />
                        <h3
                          className="text-[#0f2820] font-bold text-lg"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-[#475569] text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA button */}
            <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-emerald-900/15 hover:shadow-lg hover:shadow-emerald-900/25 hover:-translate-y-0.5 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #156e52, #52b74c)",
                  letterSpacing: "0.02em",
                }}
              >
                Book Your Session
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-[#64748b] font-medium">
                No referral required · 100% Confidential
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
