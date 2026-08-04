import { Link } from "react-router";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Shield, Heart, Target, Award, Sparkles, BookOpen } from "lucide-react";

const About = () => {
  const team = [
    { name: "Mr. Thabo Mokoena", role: "Principal & Senior Science Educator", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300" },
    { name: "Mrs. Sarah van der Merwe", role: "Vice Principal & Language Director", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300" },
    { name: "Mr. Sipho Ndlovu", role: "Academic Director & Economics Specialist", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300" },
    { name: "Ms. Nomsa Khumalo", role: "Head of Student Care & Life Orientation", img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300&h=300" },
  ];

  const values = [
    { icon: Heart, title: "Learner-Centered", desc: "Small interactive cohorts, personalized tutoring, and active feedback loops for absolute mastery." },
    { icon: Shield, title: "DBE & CAPS Certified", desc: "A rigorous curriculum fully mapped to South Africa's national guidelines from Grade R to Matric." },
    { icon: Award, title: "Elite Educators", desc: "All lessons are developed and led by SACE-registered professionals committed to excellence." },
    { icon: Target, title: "Future-Ready Support", desc: "Integrating advanced AI study tools, coding foundation courses, and personalized diagnostic pathing." },
  ];

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-36 pb-24 overflow-hidden bg-gradient-to-b from-[#5c061c]/10 via-[#030712] to-[#030712]">
          <div className="absolute top-20 left-10 w-96 h-96 bg-sky-950/10 rounded-full blur-[120px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5c061c]/20 border border-[#5c061c]/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  About Our Academy
                </div>
                <h1 className="text-5xl md:text-6xl font-black font-serif leading-[1.1] text-white">
                  Cultivating Minds,<br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-sky-300 to-rose-400">
                    Inspiring Futures
                  </span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                  Glenanda Learning Centre is an elite home schooling academy located in Glenanda, Johannesburg. We deliver a comprehensive, CAPS-aligned educational ecosystem built to empower independent learners from Grade R to Matric.
                </p>
              </div>
              <div className="lg:col-span-4 flex justify-center">
                <img 
                  src="/logo-school.jpeg" 
                  alt="Glenanda Learning Centre Emblem" 
                  className="h-48 md:h-56 w-auto rounded-3xl border border-white/10 shadow-2xl shadow-black/60 bg-white/5 p-4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission and Metrics */}
        <section className="py-20 border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-white">Our Vision</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  We believe that the home learning environment, when combined with professional educators and advanced interactive platforms, provides the optimal foundation for academic achievement.
                </p>
                <p className="text-gray-400 text-lg leading-relaxed">
                  From our modern physical resource base in Glenanda, Johannesburg, we support families across Gauteng and South Africa with comprehensive lesson plans, live online instruction, and accredited diagnostic reports.
                </p>
                <div className="flex gap-8 pt-4">
                  <div>
                    <p className="text-4xl font-black text-rose-500 font-serif">100%</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">CAPS Aligned</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-sky-400 font-serif">SACE</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Certified Staff</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-emerald-400 font-serif">Grade R–12</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Comprehensive Phase</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {values.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="bg-white/[0.02] rounded-2xl p-6 border border-white/[0.08] hover:bg-white/[0.04] hover:border-sky-500/20 transition-all">
                    <div className="bg-sky-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-sky-500/20">
                      <Icon className="w-6 h-6 text-sky-400" />
                    </div>
                    <h3 className="font-bold text-white mb-2 font-serif text-lg">{title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Academic Team */}
        <section className="py-20 border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-white">Our Educational Leaders</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Meet the certified, SACE-registered subject matter experts who lead our live interactive cohorts.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.name} className="text-center group bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 hover:border-[#5c061c]/40 hover:bg-white/[0.04] transition-all">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-5 object-cover border-4 border-[#5c061c]/30 group-hover:border-sky-400/40 transition-colors shadow-lg"
                  />
                  <h3 className="font-extrabold text-white text-lg font-serif">{member.name}</h3>
                  <p className="text-sm text-sky-400 mt-1 uppercase tracking-wider font-semibold">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden border-t border-white/[0.05] bg-gradient-to-b from-[#030712] to-[#5c061c]/10">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-black font-serif text-white">
              Embark on an Elite CAPS Journey
            </h2>
            <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
              Enrolments for the 2026 Academic Year are active. Secure your learner's place in our live online cohorts and unlock their academic path.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/apply"
                className="bg-gradient-to-r from-[#5c061c] to-[#9f1239] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#5c061c]/30 transition-all hover:scale-[1.02] border border-white/10"
              >
                Start Your Application
              </Link>
              <Link
                to="/contact"
                className="border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/5 transition-all"
              >
                Talk to Academic Advising
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
