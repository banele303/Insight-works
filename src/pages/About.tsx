import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Shield, Users, Heart, Brain, Star, Award, CheckCircle2, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { Link } from "react-router";

const team = [
  {
    name: "Maletsatsi Sibanda",
    role: "Counselling Therapist & Life Coach",
    creds: "Counselling Practitioner & Certified Life Coach",
    specialties: ["Individual & Couples Counselling", "Trauma Recovery & Emotional Healing", "Personal Growth & Life Coaching", "Youth & Substance Use Support"],
    bio: "Passionate about creating a safe, non-judgmental sanctuary where clients can process challenges, heal emotional wounds, reconnect with their authentic selves, and master their personal goals.",
    img: "/images/therapist-portrait.jpg",
  },
  {
    name: "Dr. James Mokoena",
    role: "Counselling Psychologist",
    creds: "M.Ed Psych, B.Psych (Hons) · HPCSA PS 0159482",
    specialties: ["Couples & Relationship Therapy", "Men's Mental Health", "Grief & Loss"],
    bio: "Gottman-trained couples specialist dedicated to helping partners repair relational trust, dismantle communication barriers, and navigate profound grief.",
    img: "https://images.unsplash.com/photo-1537368910025-7028ba1ea9b4?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Ms. Fatima Adams",
    role: "Family Therapist & Youth Specialist",
    creds: "MSW (Clinical), BSW · SACSSP 10-29481",
    specialties: ["Family Dynamics", "Youth & Young Adult Support", "Trauma-Informed Care"],
    bio: "Focuses on systemic family therapy and adolescent resilience, fostering open communication channels within households during turbulent life stages.",
    img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600&h=600",
  },
  {
    name: "Mr. Thabo Ndlovu",
    role: "Executive & Mindset Coach",
    creds: "ICF Professional Certified Coach (PCC), B.Com",
    specialties: ["Executive Career Transitions", "Work-Life Boundaries", "Mindset Shift"],
    bio: "Partnering with ambitious professionals and leaders to conquer imposter syndrome, design sustainable career roadmaps, and achieve high performance without burnout.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600&h=600",
  },
];

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
    <div className="bg-white min-h-screen text-[#0f2820]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
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
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Compassionate Care, Guided by{" "}
                  <span
                    className="italic"
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
                    <MapPin className="w-3.5 h-3.5 text-[#156e52]" /> Johannesburg & Telehealth Nationwide
                  </span>
                </div>
              </div>

              {/* Right Column Image Collage */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] group">
                  <img 
                    src="/images/how-we-help-flyer.jpg" 
                    alt="Maletsatsi Sibanda - Insight Works Therapy & Coaching" 
                    className="w-full h-[460px] object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Warm & Confidential</span>
                    </div>
                    <p className="font-bold text-lg font-serif">A Sanctuary for Healing & Growth</p>
                    <p className="text-xs text-slate-200 mt-0.5">Together, we help you heal, grow, reconnect, and thrive.</p>
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
                  style={{ fontFamily: "'Playfair Display', serif" }}
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

        {/* ── CLINICAL TEAM SECTION ── */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold uppercase tracking-widest text-[#9f1239]">
                Expert Practitioners
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif text-[#0f172a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Our Multidisciplinary Clinical Team
              </h2>
              <p className="text-[#64748b] text-base leading-relaxed">
                Meet our dedicated, HPCSA-registered psychologists and registered counselors committed to supporting your unique journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="group bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:border-rose-200 hover:-translate-y-1.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Portrait Photo */}
                    <div className="relative mb-5 overflow-hidden rounded-2xl aspect-square border border-slate-100">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/80 text-[10px] font-bold text-[#881337] shadow-2xs">
                        HPCSA Registered
                      </div>
                    </div>

                    <h3 className="font-extrabold text-[#0f172a] text-xl font-serif leading-snug">{member.name}</h3>
                    <p className="text-xs text-[#9f1239] mt-1 font-bold tracking-wide uppercase">{member.role}</p>
                    <p className="text-[11px] text-[#64748b] mt-0.5 font-medium">{member.creds}</p>

                    <p className="text-xs text-[#475569] mt-3 leading-relaxed border-t border-slate-100 pt-3">
                      {member.bio}
                    </p>

                    {/* Specialty tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {member.specialties.map((spec, i) => (
                        <span key={i} className="text-[10px] font-medium bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-md text-slate-600">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100">
                    <Link
                      to="/booking"
                      className="inline-flex items-center justify-between w-full text-xs font-bold text-[#881337] group-hover:text-[#be123c] transition-colors"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
    </div>
  );
};

export default About;
