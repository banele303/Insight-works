import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Shield, Users, Heart, Brain, Star, Award, CheckCircle2, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { Link } from "react-router";

const maletsatsiProfile = {
  name: "Maletsatsi Sibanda",
  role: "Counselling Therapist & Life Coach",
  creds: "Counselling Practitioner & Certified Life Coach",
  specialties: [
    "Individual Counselling",
    "Couples & Relationship Counselling",
    "Trauma Recovery & Emotional Healing",
    "Personal Growth & Life Coaching",
    "Youth & Young Adult Support",
    "Substance Use Support",
  ],
  bio: "Passionate about creating a safe, non-judgmental sanctuary where clients can process challenges, heal emotional wounds, reconnect with their authentic selves, and master their personal goals.",
  img: "/images/therapist-seated-plant.jpg",
};

const values = [
  {
    icon: Shield,
    title: "Uncompromising Confidentiality",
    desc: "Your privacy is our absolute priority. We strictly adhere to ethical standards and the Protection of Personal Information Act (POPIA) to keep your records fully protected.",
  },
  {
    icon: Heart,
    title: "Trauma-Informed & Compassionate",
    desc: "We create a genuinely safe, soothing environment that honors your lived experiences without pressure, judgment, or retraumatization.",
  },
  {
    icon: Brain,
    title: "Evidence-Based & Holistic",
    desc: "We integrate scientifically validated therapeutic modalities and coaching frameworks for lasting neurobehavioral and emotional transformation.",
  },
  {
    icon: Users,
    title: "Supportive & Person-Centered",
    desc: "You don't have to face life's challenges alone. We meet you exactly where you are and walk alongside you every step of the way.",
  },
];

const About = () => {
  return (
    <div className="bg-white min-h-screen text-[#0f2820]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      
      <main>
        {/* ── HERO SECTION ── */}
        <section className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-amber-50/20 to-white">
          <div className="absolute top-10 right-10 w-[550px] h-[550px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-40 left-0 w-[450px] h-[450px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[#156e52] text-xs font-bold uppercase tracking-widest">
                  <Star className="w-3.5 h-3.5 text-[#ea7627]" />
                  About Insight Works Therapy & Coaching
                </div>

                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-black font-serif leading-[1.1] text-[#0f2820]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Compassionate Care, Guided by{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Experience & Empathy
                  </span>
                </h1>

                <p className="text-lg text-[#334155] leading-relaxed max-w-2xl">
                  Insight Works Therapy & Coaching was founded by Maletsatsi Sibanda with a clear, heartfelt mission: to ensure that no one has to navigate emotional turbulence, life transitions, or relationship challenges alone.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Certified & Experienced
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> POPIA Protected & Safe
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                    <MapPin className="w-3.5 h-3.5 text-[#156e52]" /> Telehealth Nationwide & International
                  </span>
                </div>
              </div>

              {/* Right Column Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] group">
                  <img 
                    src="/images/therapist-seated-room.jpg" 
                    alt="Maletsatsi Sibanda - Counselling Therapist & Life Coach" 
                    className="w-full h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (!img.src.includes('therapist-portrait.jpg')) {
                        img.src = "/images/therapist-portrait.jpg";
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Warm & Confidential</span>
                    </div>
                    <p className="font-bold text-lg font-serif">Maletsatsi Sibanda</p>
                    <p className="text-xs text-slate-200 mt-0.5">Counselling Therapist & Life Coach</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── OUR PHILOSOPHY & VALUES SECTION ── */}
        <section className="py-24 border-t border-slate-200/80 bg-[#fafaf9] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold uppercase tracking-widest text-[#9f1239]">
                  Our Philosophy
                </div>
                <h2
                  className="text-3xl sm:text-4xl font-extrabold font-serif text-[#0f172a]"
                  style={{ fontFamily: "'Poppins', serif" }}
                >
                  Mental Health is the Foundation of a Meaningful Life
                </h2>
                <p className="text-[#475569] text-base leading-relaxed">
                  We believe that seeking therapy is a demonstration of strength, not fragility. Every individual possesses the innate capacity for profound transformation when provided with the right therapeutic alliance, safety, and evidence-based guidance.
                </p>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
                    <p className="text-3xl font-black text-[#881337] font-serif">10+</p>
                    <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mt-1">Years Exp</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
                    <p className="text-3xl font-black text-[#0284c7] font-serif">500+</p>
                    <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mt-1">Clients Helped</p>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
                    <p className="text-3xl font-black text-[#059669] font-serif">6</p>
                    <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider mt-1">Session Types</p>
                  </div>
                </div>
              </div>

              {/* 4 Values Cards Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {values.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-rose-200 hover:-translate-y-1 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="bg-rose-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border border-rose-100 text-[#9f1239]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-[#0f172a] mb-2 font-serif text-lg">{title}</h3>
                      <p className="text-sm text-[#475569] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── CLINICIAN PROFILE SECTION ── */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold uppercase tracking-widest text-[#156e52]">
                <Sparkles className="w-3.5 h-3.5 text-[#ea7627]" />
                Therapist & Life Coach
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif text-[#0f2820]"
                style={{ fontFamily: "'Poppins', serif" }}
              >
                Meet Maletsatsi Sibanda
              </h2>
              <p className="text-[#64748b] text-base leading-relaxed">
                Dedicated to helping individuals, couples, and youth navigate life's complexities with empathy, clinical depth, and transformational life coaching.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-emerald-50/60 via-white to-amber-50/30 border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] grid md:grid-cols-12 gap-8 items-center">
                
                {/* Portrait Photo */}
                <div className="md:col-span-5">
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-slate-200 shadow-md">
                    <img
                      src={maletsatsiProfile.img}
                      alt={maletsatsiProfile.name}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (!img.src.includes('maletsatsi-portrait.jpg')) {
                          img.src = "/images/maletsatsi-portrait.jpg";
                        }
                      }}
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-emerald-200/80 text-[11px] font-bold text-[#156e52] shadow-2xs">
                      Certified Practitioner
                    </div>
                  </div>
                </div>

                {/* Details & Specialties */}
                <div className="md:col-span-7 space-y-5">
                  <div>
                    <span className="text-xs font-bold text-[#156e52] uppercase tracking-wider bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-200/60 inline-block mb-2">
                      {maletsatsiProfile.role}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#0f2820]">
                      {maletsatsiProfile.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {maletsatsiProfile.creds} · Telehealth Nationwide & International
                    </p>
                  </div>

                  <p className="text-sm text-[#475569] leading-relaxed">
                    {maletsatsiProfile.bio}
                  </p>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[#0f2820] uppercase tracking-wider">Focus Areas & Offerings:</p>
                    <div className="flex flex-wrap gap-2">
                      {maletsatsiProfile.specialties.map((spec) => (
                        <span key={spec} className="text-xs font-semibold bg-white border border-emerald-200/80 px-3 py-1 rounded-lg text-[#156e52] shadow-2xs">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <Link
                      to="/booking"
                      className="inline-flex items-center gap-2 btn-dual-gradient text-white text-xs font-bold px-6 py-3 rounded-xl hover:shadow-md hover:shadow-emerald-900/20 transition-all shadow-xs cursor-pointer"
                    >
                      Book a Session <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl hover:bg-slate-50 hover:text-[#156e52] transition-colors cursor-pointer"
                    >
                      Send Inquiries
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── ACCREDITATION & ETHICS STRIP ── */}
        <section className="py-16 bg-[#f8fafc] border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <Award className="w-8 h-8 text-[#9f1239] mx-auto mb-3" />
                <h4 className="font-bold text-[#0f172a] font-serif text-lg">HPCSA & PsySSA Aligned</h4>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  Strict adherence to ethical codes of conduct and continuous professional development.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <Shield className="w-8 h-8 text-[#0284c7] mx-auto mb-3" />
                <h4 className="font-bold text-[#0f172a] font-serif text-lg">POPIA Section 18 Safeguards</h4>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  End-to-end encrypted storage and transmission of all client medical records.
                </p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <Heart className="w-8 h-8 text-[#059669] mx-auto mb-3" />
                <h4 className="font-bold text-[#0f172a] font-serif text-lg">Medical Aid PMB Billing</h4>
                <p className="text-xs text-[#64748b] mt-1 leading-relaxed">
                  Assistance with Prescribed Minimum Benefits and direct medical aid statements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA BANNER ── */}
        <section className="py-20 bg-gradient-to-br from-emerald-50/60 via-amber-50/30 to-teal-50/40 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black font-serif text-[#0f2820]">
              Ready to Connect with Maletsatsi?
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
              You don't have to face life's challenges alone. Book an appointment or free consultation to start your healing and growth journey today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <Link
                to="/booking"
                className="btn-dual-gradient text-white px-8 py-4 rounded-xl font-bold text-base hover:shadow-lg hover:shadow-emerald-900/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                Schedule Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="bg-white border border-slate-300 text-slate-800 px-8 py-4 rounded-xl font-bold text-base hover:bg-emerald-50/50 hover:text-[#156e52] hover:border-emerald-300 transition-all flex items-center justify-center cursor-pointer"
              >
                Send Us a Message
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
