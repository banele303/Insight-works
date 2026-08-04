import { ArrowRight, Video, Sparkles, BookOpen, Zap, GraduationCap, CheckCircle2, PlayCircle, Star, Users, TrendingUp, Award } from "lucide-react";
import { Link } from "react-router";
import { useEffect, useRef } from "react";

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="relative pt-28 pb-16 overflow-hidden min-h-screen flex items-center bg-[#030712]">
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-orange-600/[0.07] rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-[-100px] w-[500px] h-[500px] bg-amber-500/[0.06] rounded-full blur-[130px]" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-orange-400/[0.04] rounded-full blur-[100px]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Top fade */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#030712] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT ── */}
          <div className="space-y-9">

            {/* Live badge */}
            <div className="inline-flex items-center gap-2.5 bg-orange-500/[0.08] border border-orange-500/25 px-4 py-2 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
              </span>
              <span className="text-orange-400 text-sm font-semibold tracking-wide">
                2026 Enrolments Now Open
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05]">
                <span className="text-white">Glenanda</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #f97316 0%, #fbbf24 50%, #f97316 100%)",
                    backgroundSize: "200% auto",
                    animation: "shimmer 3s linear infinite",
                  }}
                >
                  Learning Center
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed">
                A quality <strong className="text-white font-semibold">home schooling centre</strong> offering a
                full CAPS-aligned curriculum from Grade&nbsp;R to Matric. Live online classes,
                AI-powered study support, and real assessments that track every learner's true potential.
              </p>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: Video, label: "Live Online Classes", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
                { icon: Sparkles, label: "AI Study Buddy", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                { icon: BookOpen, label: "CAPS Aligned R–12", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { icon: Zap, label: "Real Exams & Reports", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
              ].map(({ icon: Icon, label, color, bg }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 ${bg} border px-3.5 py-2 rounded-full text-sm font-medium transition-all hover:scale-[1.03] cursor-default`}
                >
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                  <span className="text-gray-200">{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/apply"
                className="group relative flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/25"
                style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
              >
                <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                <GraduationCap className="h-5 w-5 relative" />
                <span className="relative">Apply for Enrolment</span>
                <ArrowRight className="h-5 w-5 relative group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/programs"
                className="flex items-center justify-center gap-2.5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/[0.06] hover:border-orange-500/40 transition-all"
              >
                <PlayCircle className="h-5 w-5 text-orange-400" />
                Explore Programmes
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-400">Trusted by families in Gauteng</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                SACE-registered educators
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Award className="h-4 w-4 text-orange-400 shrink-0" />
                CAPS certified
              </div>
            </div>
          </div>

          {/* ── RIGHT — glassmorphism dashboard card ── */}
          <div className="hidden lg:flex flex-col gap-4 relative">

            {/* Floating top-left stat */}
            <div
              className="absolute -top-8 -left-8 z-20 rounded-2xl border border-white/10 px-5 py-3 backdrop-blur-2xl flex items-center gap-3 animate-float-slow"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">94% Pass Rate</p>
                <p className="text-gray-500 text-xs">Matric 2025 cohort</p>
              </div>
            </div>

            {/* Main card */}
            <div
              className="relative rounded-3xl border border-white/[0.09] p-8 shadow-2xl shadow-black/60 overflow-hidden"
              style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)", backdropFilter: "blur(24px)" }}
            >
              {/* Card glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Card header */}
              <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Learner Progress</p>
                    <p className="text-gray-500 text-xs">Term 3 · 2026</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                  On Track ✓
                </span>
              </div>

              {/* Subject progress bars */}
              {[
                { sub: "Mathematics", mark: 86, color: "from-orange-400 to-orange-500" },
                { sub: "English Home Language", mark: 78, color: "from-amber-400 to-yellow-500" },
                { sub: "Natural Sciences", mark: 91, color: "from-emerald-400 to-green-500" },
                { sub: "History", mark: 74, color: "from-violet-400 to-purple-500" },
              ].map((row) => (
                <div key={row.sub} className="mb-5">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 font-medium">{row.sub}</span>
                    <span className="text-white font-extrabold">{row.mark}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.05] overflow-hidden border border-white/[0.04]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${row.color} transition-all duration-1000`}
                      style={{ width: `${row.mark}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Mini stat grid */}
              <div className="mt-7 grid grid-cols-3 gap-3">
                {[
                  { label: "Assignments", value: "12/12", color: "text-orange-400", glow: "bg-orange-500/10" },
                  { label: "Avg Score", value: "82%", color: "text-emerald-400", glow: "bg-emerald-500/10" },
                  { label: "Attendance", value: "98%", color: "text-amber-400", glow: "bg-amber-500/10" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-2xl ${stat.glow} border border-white/[0.07] p-4 text-center transition-transform hover:scale-[1.03]`}
                  >
                    <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* CAPS badge */}
              <div
                className="absolute -top-4 -right-4 rounded-2xl text-white px-4 py-3 shadow-xl rotate-6 border border-orange-400/30"
                style={{ background: "linear-gradient(135deg, #f97316, #f59e0b)" }}
              >
                <p className="text-xs font-black">CAPS</p>
                <p className="text-[9px] opacity-90 font-semibold">Certified</p>
              </div>
            </div>

            {/* Bottom floating badge */}
            <div
              className="absolute -bottom-6 -left-6 rounded-2xl border border-white/10 px-5 py-4 backdrop-blur-2xl flex items-center gap-3 z-20"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div className="h-10 w-10 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Applications Open</p>
                <p className="text-xs text-gray-400">Limited seats per grade</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
