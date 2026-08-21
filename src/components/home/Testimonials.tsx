import { Link } from "react-router";
import { ArrowRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Client A.",
    role: "Individual Counselling · Anxiety & Stress",
    initials: "A",
    color: "#156e52",
    bg: "bg-emerald-100 text-[#156e52]",
    quote:
      "Working with Maletsatsi at Insight Works has given me practical tools to navigate overwhelming anxiety in ways I never thought possible. She creates a space of pure empathy and zero judgment.",
  },
  {
    name: "T. & M.",
    role: "Couples Counselling · Relationship Support",
    initials: "TM",
    color: "#ea7627",
    bg: "bg-amber-100 text-[#ea7627]",
    quote:
      "We were experiencing significant communication breakdown when we booked our first session. Through careful guided dialogue, we learned how to listen without defensiveness and rebuild genuine connection.",
  },
  {
    name: "Anonymous Client",
    role: "Telehealth Sessions · South Africa",
    initials: "AC",
    color: "#156e52",
    bg: "bg-emerald-100 text-emerald-800",
    quote:
      "I was skeptical about online sessions, but it felt deeply connected and safe. The privacy and ease of booking from home made regular counselling finally work for my demanding schedule.",
  },
  {
    name: "S.N.",
    role: "Trauma Recovery & Emotional Healing",
    initials: "SN",
    color: "#ea7627",
    bg: "bg-amber-100 text-[#ea7627]",
    quote:
      "Working through past emotional distress felt like an insurmountable weight. Maletsatsi's patient, compassionate guidance helped me release deep emotional burdens and rediscover inner peace.",
  },
  {
    name: "Client L.",
    role: "Life Coaching & Personal Growth",
    initials: "L",
    color: "#156e52",
    bg: "bg-emerald-100 text-[#156e52]",
    quote:
      "I felt completely stuck in my routines. The life coaching sessions provided clarity, actionable boundary exercises, and the mindset shift needed to step into self-mastery.",
  },
  {
    name: "M.K.",
    role: "Youth & Young Adult Support",
    initials: "MK",
    color: "#ea7627",
    bg: "bg-amber-100 text-[#ea7627]",
    quote:
      "Insight Works gave our family a collaborative bridge during a really tough transition. The empathetic support for our young adult daughter made all the difference in her confidence.",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-24 lg:py-32 relative overflow-hidden bg-[#fbfdfc]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 lg:mb-20">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#156e52]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
                Client Experiences
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
              Stories of{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Growth, Clarity & Healing
              </span>
            </h2>
          </div>

          {/* Rating Block */}
          <div className="lg:col-span-5 flex items-center gap-5 lg:justify-end">
            <div
              className="rounded-3xl p-5 sm:p-6 flex flex-col items-center justify-center text-white shadow-lg shadow-emerald-900/15 shrink-0"
              style={{
                background: "linear-gradient(135deg, #156e52 0%, #52b74c 100%)",
                minWidth: "130px",
              }}
            >
              <p
                className="font-black text-4xl sm:text-5xl"
                style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1 }}
              >
                4.9
              </p>
              <div className="flex gap-0.5 mt-2 text-amber-300 text-sm">
                {"★★★★★".split("").map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <p className="text-emerald-100 text-[11px] font-medium mt-1">Average rating</p>
            </div>
            <p className="text-[#64748b] text-xs sm:text-sm leading-relaxed max-w-xs">
              All feedback is shared with explicit permission. Identifying details are altered to protect client privacy in full accordance with POPIA.
            </p>
          </div>
        </div>

        {/* Testimonials 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="group rounded-3xl p-8 bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400 text-sm">
                    {"★★★★★".split("").map((star, i) => (
                      <span key={i}>{star}</span>
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-200 group-hover:text-emerald-200 transition-colors" />
                </div>

                <p className="text-[#334155] text-sm sm:text-base leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author Row */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${t.bg}`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-[#0f2820] font-bold text-sm">{t.name}</p>
                  <p className="text-[#64748b] text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div
          className="mt-16 relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-lg min-h-[220px] flex items-center p-8 sm:p-12 group"
        >
          <img
            src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=400&fit=crop"
            alt="Serene therapy space"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-950/20" />
          
          <div className="relative z-10 max-w-xl text-white">
            <h3
              className="text-2xl sm:text-3xl font-extrabold mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              You don't have to face life's challenges alone.
            </h3>
            <p className="text-slate-200 text-sm sm:text-base mb-6">
              Together, we can help you heal, grow, reconnect, and thrive. In-person and telehealth sessions available.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-emerald-900/20 hover:shadow-lg hover:scale-105 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #156e52, #52b74c)",
              }}
            >
              Book Your Appointment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
