import { ArrowRight, Video, Sparkles, BookOpen, Zap, GraduationCap, CheckCircle2, PlayCircle, Star } from "lucide-react";
import { Link } from "react-router";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-[92vh] flex items-center bg-[#030712]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full text-orange-400 text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              Enrolments Open — 2026 Academic Year
            </div>

            <div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Glenanda Shopping
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-500">
                  Learning Center
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl mt-6 leading-relaxed">
                A quality <strong className="text-white">home schooling centre</strong> offering a full
                CAPS-aligned curriculum from Grade R to Matric. Live online classes, AI-powered study
                support, and real assessments — so every learner achieves their best.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Video, label: "Live Online Classes", color: "text-orange-400" },
                { icon: Sparkles, label: "AI Study Buddy", color: "text-amber-400" },
                { icon: BookOpen, label: "CAPS Aligned (R–12)", color: "text-green-400" },
                { icon: Zap, label: "Real Exams & Reports", color: "text-purple-400" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-3 py-2 rounded-full text-sm"
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                  <span className="font-medium text-gray-200">{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/apply"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all transform hover:scale-[1.02]"
              >
                Apply for Enrolment <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/programs"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/15 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/[0.05] hover:border-orange-500/40 transition-all"
              >
                <PlayCircle className="h-5 w-5 text-orange-400" />
                Explore Programmes
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-400">Trusted by families in Gauteng</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                SACE-registered educators
              </div>
            </div>
          </div>

          {/* Right visual — dashboard-style card */}
          <div className="hidden lg:block relative">
            <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Learner Progress</p>
                    <p className="text-gray-500 text-xs">Term 3 • 2026</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
                  On Track
                </span>
              </div>

              {/* Fake subject rows */}
              {[
                { sub: "Mathematics", mark: 86, color: "bg-orange-400" },
                { sub: "English Home Language", mark: 78, color: "bg-amber-400" },
                { sub: "Natural Sciences", mark: 91, color: "bg-green-400" },
                { sub: "History", mark: 74, color: "bg-purple-400" },
              ].map((row) => (
                <div key={row.sub} className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300">{row.sub}</span>
                    <span className="text-white font-bold">{row.mark}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.color}`}
                      style={{ width: `${row.mark}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Assignments", value: "12/12", color: "text-orange-400" },
                  { label: "Avg Score", value: "82%", color: "text-green-400" },
                  { label: "Attendance", value: "98%", color: "text-amber-400" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-3 text-center">
                    <p className={`text-lg font-extrabold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[11px] text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Decorative floating badge */}
              <div className="absolute -top-5 -right-5 rounded-2xl bg-orange-500 text-white px-4 py-3 shadow-xl shadow-orange-500/30 rotate-3">
                <p className="text-xs font-bold">CAPS</p>
                <p className="text-[10px] opacity-90">Certified</p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white/[0.05] border border-white/[0.1] px-5 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">Applications Open</p>
                  <p className="text-xs text-gray-400">Limited seats per grade</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
