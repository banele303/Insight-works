import { Link } from "react-router";
import { ArrowRight, Calendar, Video, FileCheck, Brain } from "lucide-react";

const features = [
  {
    icon: Calendar,
    label: "Online Booking",
    title: "Schedule in Seconds, 24/7",
    desc: "Book, reschedule, or manage your appointments anytime via our intuitive digital portal with instant confirmation and automated calendar invites.",
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=700&h=450&fit=crop",
    stat: "24/7",
    statLabel: "Live Booking Access",
  },
  {
    icon: Video,
    label: "Telehealth Care",
    title: "Secure Therapy From Anywhere",
    desc: "Encrypted, POPIA-compliant video sessions accessible anywhere in South Africa. Enjoy the same depth of clinical care from your own private space.",
    img: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=700&h=450&fit=crop",
    stat: "100%",
    statLabel: "Encrypted & Confidential",
  },
  {
    icon: FileCheck,
    label: "Digital Intake",
    title: "Private Paperless Onboarding",
    desc: "Quick, confidential digital intake questionnaires for medical history and personal goals, completed securely prior to your first session.",
    img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&h=450&fit=crop",
    stat: "POPIA",
    statLabel: "Compliant & Protected",
  },
  {
    icon: Brain,
    label: "AI Wellness Support",
    title: "Between-Session Reflection Tools",
    desc: "Support your therapeutic work with between-session mood check-ins, guided mindfulness exercises, and personalized clinical resources.",
    img: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=700&h=450&fit=crop",
    stat: "AI+",
    statLabel: "Evidence-Based Insights",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 lg:py-32 relative overflow-hidden bg-white"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Subtle ambient light mesh */}
      <div className="absolute top-1/2 left-0 w-[450px] h-[450px] bg-emerald-50/70 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-amber-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 lg:mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#156e52]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
                Seamless Client Care
              </span>
            </div>
            <h2
              className="leading-[1.08] tracking-tight text-[#0f2820]"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                fontWeight: 900,
              }}
            >
              Support & Healing,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Made Accessible
              </span>
            </h2>
          </div>
          <p className="text-[#475569] max-w-md leading-relaxed text-base lg:text-right">
            We remove the administrative friction so you can focus entirely on what matters most — emotional wellbeing, self-mastery, and authentic connection.
          </p>
        </div>

        {/* Feature cards — 2×2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                {/* Card Image Banner with small padding */}
                <div className="p-3 sm:p-3.5 pb-0">
                  <div className="relative overflow-hidden rounded-2xl" style={{ height: "220px" }}>
                    <img
                      src={feature.img}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/10 to-transparent" />
                    
                    {/* Label pill on top left */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0f2820] border border-slate-200/60 shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-[#156e52]" />
                      {feature.label}
                    </div>

                    {/* Stat overlay on bottom right */}
                    <div className="absolute bottom-4 right-4 text-right text-white">
                      <p
                        className="font-black text-2xl sm:text-3xl drop-shadow-sm"
                        style={{ fontFamily: "'Poppins', serif" }}
                      >
                        {feature.stat}
                      </p>
                      <p className="text-emerald-200 text-xs font-medium drop-shadow-sm">{feature.statLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-7 sm:p-8 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <h3
                      className="text-[#0f2820] font-bold text-xl mb-2.5 group-hover:text-[#156e52] transition-colors"
                      style={{ fontFamily: "'Poppins', serif" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-[#475569] text-sm sm:text-base leading-relaxed">{feature.desc}</p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#64748b]">
                      Available for all sessions
                    </span>
                    <Link
                      to="/services"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#156e52] group-hover:text-[#52b74c] group-hover:translate-x-0.5 transition-all cursor-pointer"
                    >
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div
          className="mt-16 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 border border-emerald-200/80 shadow-lg shadow-emerald-950/5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #fffbeb 100%)",
          }}
        >
          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <h3
              className="text-[#0f2820] font-extrabold text-2xl sm:text-3xl"
              style={{ fontFamily: "'Poppins', serif" }}
            >
              Ready to begin your healing journey?
            </h3>
            <p className="text-[#475569] text-sm sm:text-base mt-2">
              Book your session in just 2 minutes with Maletsatsi Sibanda. In-person and telehealth consultations available.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-emerald-900/15 hover:shadow-lg hover:shadow-emerald-900/25 hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #156e52, #52b74c)",
              }}
            >
              Book a Session
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-6 py-4 text-[#1e293b] font-semibold text-sm bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Ask a Question
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
