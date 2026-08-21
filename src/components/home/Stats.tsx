import { Shield, Sparkles, Award, HeartHandshake } from "lucide-react";

const stats = [
  {
    num: "10+",
    label: "Years in Practice",
    sub: "Dedicated clinical & psychological experience",
    icon: Award,
  },
  {
    num: "500+",
    label: "Clients Guided",
    sub: "Individuals & couples across South Africa",
    icon: HeartHandshake,
  },
  {
    num: "4.9/5",
    label: "Client Satisfaction",
    sub: "Based on verified post-therapy feedback",
    icon: Sparkles,
  },
  {
    num: "8+",
    label: "Medical Aids Covered",
    sub: "Direct claim invoices provided for sessions",
    icon: Shield,
  },
];

const Stats = () => {
  return (
    <section
      id="stats"
      className="relative overflow-hidden bg-white py-24 lg:py-32"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-50/80 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-amber-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#156e52]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
              Meaningful Impact
            </span>
          </div>
          <h2
            className="leading-[1.08] tracking-tight text-[#0f2820] mb-5"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
              fontWeight: 900,
            }}
          >
            A Journey Towards{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Healing & Growth
            </span>
          </h2>
          <p className="text-[#475569] text-base sm:text-lg leading-relaxed">
            You don't have to face life's challenges alone. Together, we can help you heal, grow, reconnect, and thrive.
          </p>
        </div>

        {/* 4 Overlapping Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const isFeatured = idx === 0;
            return (
              <div
                key={idx}
                className={`rounded-3xl p-8 text-center flex flex-col items-center justify-between transition-all duration-300 ${
                  isFeatured
                    ? "bg-gradient-to-br from-[#156e52] to-[#52b74c] text-white shadow-xl shadow-emerald-900/20 hover:-translate-y-1.5"
                    : "bg-white border border-slate-200/80 text-[#0f2820] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1.5"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                    isFeatured
                      ? "bg-white/15 text-white"
                      : "bg-emerald-50 text-[#156e52] border border-emerald-100"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p
                    className="font-black text-4xl sm:text-5xl tracking-tight mb-2"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: isFeatured ? "#ffffff" : "#0f2820",
                    }}
                  >
                    {stat.num}
                  </p>
                  <p
                    className={`font-bold text-base mb-1 ${
                      isFeatured ? "text-white" : "text-[#1e293b]"
                    }`}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={`text-xs ${
                      isFeatured ? "text-emerald-100" : "text-[#64748b]"
                    }`}
                  >
                    {stat.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Two-Column Feature Below */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left card - Telehealth highlight (Larger, more prominent image) */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden bg-[#0f2820] border border-slate-200/80 shadow-xl group min-h-[420px] sm:min-h-[480px] flex flex-col justify-end p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1573497491765-dccce02b29df?w=1200&h=800&fit=crop"
              alt="Telehealth therapy session"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.92]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f2820]/95 via-[#0f2820]/40 to-transparent" />
            <div className="relative z-10 text-white space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#156e52]/90 border border-emerald-400/40 text-emerald-100 backdrop-blur-md shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                Accessible Nationally
              </span>
              <h3
                className="font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Flexible Telehealth Care
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
                Connect conveniently via secure, encrypted video consultations from the comfort of your private space anywhere in South Africa.
              </p>
            </div>
          </div>

          {/* Right column - 2 stacked cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Top small card */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm group p-6 flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                <img
                  src="/images/therapist-portrait.jpg"
                  alt="Maletsatsi Sibanda"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-[#156e52] uppercase tracking-wider">
                  Counselling & Coaching
                </span>
                <h4
                  className="text-[#0f2820] font-bold text-lg"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Maletsatsi Sibanda
                </h4>
                <p className="text-[#64748b] text-xs mt-1">
                  Counselling Therapist & Life Coach · Insight Works Therapy & Coaching
                </p>
              </div>
            </div>

            {/* Bottom stat callout */}
            <div className="rounded-3xl p-7 flex items-center gap-6 bg-emerald-50/80 border border-emerald-200/80 shadow-sm">
              <p
                className="text-[#156e52] font-black shrink-0"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "3.25rem",
                  lineHeight: 1,
                }}
              >
                7
              </p>
              <div>
                <h4
                  className="text-[#0f2820] font-bold text-lg mb-1"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Core Healing & Coaching Offerings
                </h4>
                <p className="text-[#475569] text-xs sm:text-sm">
                  Individual counselling, couples & relationship support, life coaching, trauma recovery, youth support, substance use support, and self-mastery.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Stats;
