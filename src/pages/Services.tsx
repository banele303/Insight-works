import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { Link } from 'react-router';
import { User, Heart, Target, Sparkles, Compass, ShieldAlert, Zap, ArrowRight, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

const Services = () => {
  const services = [
    {
      id: "individual-counselling",
      icon: User,
      title: "Individual Counselling",
      rates: "R650 – R850",
      duration: "50–60 min",
      href: "/services/individual-counselling",
      description: "One-on-one confidential sessions exploring anxiety, depression, burnout, identity, life transitions, and emotional healing in a safe, non-judgmental space.",
      for: ["Anxiety & Panic Management", "Depression & Low Mood", "Burnout & Workplace Stress", "Life Transitions & Healing"],
      badgeColor: "bg-emerald-50 text-[#156e52] border-emerald-200",
      iconColor: "#156e52",
    },
    {
      id: "couples-relationships",
      icon: Heart,
      title: "Couples & Relationship Counselling",
      rates: "R850 – R1,100",
      duration: "60–75 min",
      href: "/services/couples-counselling",
      description: "Dedicated guidance to repair trust, dismantle destructive communication patterns, resolve ongoing conflict, and deepen emotional intimacy.",
      for: ["Communication Breakdown", "Conflict Resolution", "Rebuilding Relational Trust", "Pre-marital Alignment"],
      badgeColor: "bg-amber-50 text-[#ea7627] border-amber-200",
      iconColor: "#ea7627",
    },
    {
      id: "life-coaching",
      icon: Target,
      title: "Life Coaching & Self-Mastery",
      rates: "R600 – R800",
      duration: "50 min",
      href: "/services/life-coaching",
      description: "Action-oriented strategies and accountability designed to help you break through mental barriers, establish healthy boundaries, and unlock your fullest potential.",
      for: ["Goal Clarity & Strategy", "Overcoming Imposter Syndrome", "Mindset Shift & Habits", "Career & Purpose Alignment"],
      badgeColor: "bg-emerald-50 text-[#156e52] border-emerald-200",
      iconColor: "#156e52",
    },
    {
      id: "trauma-recovery",
      icon: Sparkles,
      title: "Trauma Recovery & Emotional Healing",
      rates: "R750 – R950",
      duration: "60 min",
      href: "/services/trauma-recovery",
      description: "Trauma-informed, somatic and cognitive therapy to safely desensitize past distress, process grief, release emotional burdens, and restore inner equilibrium.",
      for: ["Past Trauma & Attachment Wounds", "Grief & Profound Loss", "Emotional Triggers & Flashbacks", "Inner Child Healing"],
      badgeColor: "bg-amber-50 text-[#ea7627] border-amber-200",
      iconColor: "#ea7627",
    },
    {
      id: "youth-support",
      icon: Compass,
      title: "Youth & Young Adult Support",
      rates: "R550 – R750",
      duration: "50 min",
      href: "/services/youth-support",
      description: "Specialized youth mentorship and counselling for adolescents and young adults navigating modern academic pressures, social anxiety, and identity formation.",
      for: ["Academic & Exam Stress", "Social Anxiety & Peer Dynamics", "Identity & Self-Worth", "Family Communication"],
      badgeColor: "bg-emerald-50 text-[#156e52] border-emerald-200",
      iconColor: "#156e52",
    },
    {
      id: "substance-support",
      icon: ShieldAlert,
      title: "Substance Use Support",
      rates: "R650 – R850",
      duration: "50–60 min",
      href: "/services/substance-support",
      description: "Empathetic, harm-reduction informed guidance providing coping toolkits, trigger management, and compassionate relapse prevention pathways.",
      for: ["Substance Dependency Coping", "Behavioral Habit Change", "Relapse Prevention Toolkits", "Family Recovery Support"],
      badgeColor: "bg-amber-50 text-[#ea7627] border-amber-200",
      iconColor: "#ea7627",
    },
    {
      id: "personal-growth",
      icon: Zap,
      title: "Personal Growth & Self-Mastery",
      rates: "R650 – R850",
      duration: "50 min",
      href: "/services/life-coaching",
      description: "Holistic self-discovery focused on self-compassion, emotional intelligence, assertiveness training, and intentional values-aligned decision making.",
      for: ["Self-Discovery & Values", "Emotional Intelligence", "Confidence & Assertiveness", "Resilience Building"],
      badgeColor: "bg-emerald-50 text-[#156e52] border-emerald-200",
      iconColor: "#156e52",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f2820]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* ── HEADER ── */}
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#156e52]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
                Coaching & Therapy Offerings
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2820] leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
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
                Help You
              </span>
            </h1>
            <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              You don't have to face life's challenges alone. Together, we can help you heal, grow, reconnect, and thrive through structured therapy and transformational coaching.
            </p>
          </div>

          {/* ── 7 SERVICE CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  id={service.id}
                  className="scroll-mt-28 bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Icon & Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-2xs"
                        style={{
                          background: `${service.iconColor}10`,
                          borderColor: `${service.iconColor}25`,
                          color: service.iconColor,
                        }}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${service.badgeColor}`}>
                        {service.duration}
                      </span>
                    </div>

                    <h3
                      className="text-2xl font-bold text-[#0f2820] mb-2 font-serif"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {service.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm font-black text-[#156e52] mb-4">
                      <span>{service.rates}</span>
                      <span className="text-slate-300 font-normal">·</span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {service.duration}
                      </span>
                    </div>

                    <p className="text-[#475569] text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    {/* "Best For" pill block */}
                    <div className="bg-[#fafaf9] rounded-2xl p-4 border border-slate-200/80 mb-6">
                      <h4 className="text-[11px] uppercase tracking-wider text-[#64748b] font-bold mb-2.5">
                        Recommended For:
                      </h4>
                      <ul className="space-y-1.5">
                        {service.for.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#156e52] shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                      <Link
                        to={service.href}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 hover:text-[#156e52] transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/booking"
                        className="py-2.5 px-4 rounded-xl bg-[#156e52] hover:bg-[#0f5940] text-white text-xs font-bold transition-all text-center shadow-xs cursor-pointer"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── COACHING VS THERAPY COMPARISON ── */}
          <div className="bg-[#fafaf9] border border-slate-200 rounded-3xl p-8 md:p-12 mb-20 shadow-sm">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full mb-3">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#9f1239]">
                  Clarity of Scope
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl font-extrabold font-serif text-[#0f172a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Coaching vs. Therapy: What is the Difference?
              </h2>
              <p className="text-[#475569] text-sm sm:text-base mt-2">
                While both modalities foster growth, understanding their clinical distinction ensures you select the right support.
              </p>
            </div>

            {/* Comparison Grid Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Therapy Card */}
              <div className="bg-white border border-rose-200/90 rounded-2xl p-7 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-serif text-[#0f172a]">Psychotherapy</h3>
                  <span className="text-xs font-bold text-[#9f1239] bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                    Clinical / Healing
                  </span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Focuses on healing past pain, addressing clinical symptoms (anxiety, depression, PTSD), understanding subconscious patterns, and restoring mental functioning.
                </p>
                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">Practitioner:</span>
                    <span className="text-slate-600">HPCSA Registered Psychologist</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">Medical Aid:</span>
                    <span className="text-emerald-700 font-semibold">Claimable under PMB / Psych</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">Primary Goal:</span>
                    <span className="text-slate-600">Symptom relief & inner healing</span>
                  </div>
                </div>
              </div>

              {/* Coaching Card */}
              <div className="bg-white border border-sky-200/90 rounded-2xl p-7 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-serif text-[#0f172a]">Life Coaching</h3>
                  <span className="text-xs font-bold text-[#0284c7] bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                    Performance / Strategy
                  </span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Forward-focused strategy for individuals who are mentally well but feeling stuck. Concentrates on setting measurable goals, executive productivity, and habits.
                </p>
                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">Practitioner:</span>
                    <span className="text-slate-600">ICF Accredited Life Coach</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">Medical Aid:</span>
                    <span className="text-slate-500">Private payment only</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-700">Primary Goal:</span>
                    <span className="text-slate-600">Action plans & milestones</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Aid Pill Block */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold font-serif text-[#0f172a]">Medical Aids We Work With</h3>
              </div>
              <p className="text-xs text-[#475569] mb-5 leading-relaxed">
                Psychotherapy services are claimable from Prescribed Minimum Benefits (PMB) or your day-to-day psychological benefits pool. We provide comprehensive ICD-10 diagnostic invoices.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "Discovery Health", "Momentum Health", "Bonitas Medical Fund",
                  "Medshield", "GEMS", "BestMed", "Bankmed", "Fedhealth"
                ].map((aid) => (
                  <span
                    key={aid}
                    className="px-3.5 py-1.5 bg-[#f8fafc] border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs"
                  >
                    {aid}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM CTA ── */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-serif font-bold text-[#0f172a]">
              Ready to Book Your Session?
            </h2>
            <p className="text-[#475569] text-base max-w-lg mx-auto">
              Find an appointment slot that suits your schedule or contact us for assistance.
            </p>
            <div className="pt-2">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 btn-dual-gradient text-white px-9 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                Book a Session Online <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
    </div>
  );
};

export default Services;
