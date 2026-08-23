import { Link } from "react-router";
import { ArrowRight, User, Heart, Target, Sparkles, Compass, ShieldAlert, Zap } from "lucide-react";

const services = [
  {
    icon: User,
    phase: "One-on-One",
    grades: "Individual Counselling",
    desc: "A confidential, supportive space to navigate anxiety, stress, depression, life transitions, and emotional wellbeing.",
    subjects: ["Personalized Care", "50–60 minutes", "In-Person & Telehealth"],
    badgeColor: "bg-emerald-50 text-[#156e52] border-emerald-200/80",
    accentColor: "#156e52",
  },
  {
    icon: Heart,
    phase: "Partners",
    grades: "Couples & Relationship Counselling",
    desc: "Strengthen emotional connection, navigate difficult conversations, rebuild trust, and cultivate healthy relational dynamics.",
    subjects: ["Relationship Growth", "60–75 minutes", "In-Person & Telehealth"],
    badgeColor: "bg-amber-50 text-[#ea7627] border-amber-200/80",
    accentColor: "#ea7627",
  },
  {
    icon: Target,
    phase: "Goal-Oriented",
    grades: "Life Coaching",
    desc: "Action-oriented strategies, mindset alignment, and accountability to help you bridge the gap between where you are and where you want to be.",
    subjects: ["Clarity & Action", "45–60 minutes", "In-Person & Telehealth"],
    badgeColor: "bg-emerald-50 text-[#156e52] border-emerald-200/80",
    accentColor: "#156e52",
  },
  {
    icon: Sparkles,
    phase: "Healing & Restoration",
    grades: "Trauma Recovery & Emotional Healing",
    desc: "Gentle, trauma-informed guidance to safely process painful past experiences, release emotional burdens, and rediscover wholeness.",
    subjects: ["Trauma-Informed", "60 minutes", "Safe & Grounded"],
    badgeColor: "bg-amber-50 text-[#ea7627] border-amber-200/80",
    accentColor: "#ea7627",
  },
  {
    icon: Compass,
    phase: "Adolescents & Youth",
    grades: "Youth & Young Adult Support",
    desc: "Empowering teens and young adults to overcome academic pressures, peer challenges, identity questions, and emotional overwhelm.",
    subjects: ["Youth Mentorship", "50 minutes", "Empowering & Safe"],
    badgeColor: "bg-emerald-50 text-[#156e52] border-emerald-200/80",
    accentColor: "#156e52",
  },
  {
    icon: ShieldAlert,
    phase: "Recovery Support",
    grades: "Substance Use Support",
    desc: "Empathetic, non-judgmental guidance and practical coping toolkits to navigate addiction patterns and foster sustainable recovery.",
    subjects: ["Non-Judgmental", "50–60 minutes", "Confidential"],
    badgeColor: "bg-amber-50 text-[#ea7627] border-amber-200/80",
    accentColor: "#ea7627",
  },
  {
    icon: Zap,
    phase: "Transformation",
    grades: "Personal Growth & Self-Mastery",
    desc: "Unlocking deeper self-awareness, emotional resilience, boundary-setting, and purpose-driven living.",
    subjects: ["Self-Mastery", "50 minutes", "Transformational"],
    badgeColor: "bg-emerald-50 text-[#156e52] border-emerald-200/80",
    accentColor: "#156e52",
  },
];

const Programs = () => {
  return (
    <section
      id="programs"
      className="py-24 lg:py-32 relative overflow-hidden bg-[#fbfdfc]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#156e52]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
              Coaching & Therapy Offerings
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
            How We{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Help You Thrive
            </span>
          </h2>
          <p className="text-[#475569] text-base sm:text-lg leading-relaxed">
            You don't have to face life's challenges alone. Explore our core therapeutic and coaching disciplines tailored to your healing and self-mastery.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl p-8 bg-white border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar with Icon and Category */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{
                        background: `${service.accentColor}14`,
                        border: `1px solid ${service.accentColor}30`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: service.accentColor }} />
                    </div>
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${service.badgeColor}`}
                    >
                      {service.phase}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[#0f2820] text-2xl font-bold mb-3 group-hover:text-[#156e52] transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {service.grades}
                  </h3>

                  {/* Description */}
                  <p className="text-[#475569] text-sm leading-relaxed mb-6">
                    {service.desc}
                  </p>
                </div>

                {/* Bottom Tags and CTA */}
                <div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mb-6">
                    {service.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/booking"
                    className="inline-flex items-center justify-between w-full py-2 text-xs font-bold text-[#0f2820] group-hover:text-[#156e52] transition-colors cursor-pointer"
                  >
                    <span>Book this service</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Row */}
        <div className="mt-16 text-center">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold text-sm rounded-xl transition-all duration-300 shadow-md shadow-emerald-900/15 hover:shadow-lg hover:shadow-emerald-900/25 hover:-translate-y-0.5 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #156e52, #52b74c)",
            }}
          >
            View Full Service Breakdown & Modalities
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Programs;
