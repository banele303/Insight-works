import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Link } from "react-router";
import {
  GraduationCap,
  BookOpen,
  FlaskConical,
  Languages,
  Calculator,
  Music,
  Dumbbell,
  Laptop,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const PHASES = [
  {
    name: "Foundation Phase",
    grades: "Grade R – 3",
    icon: Sparkles,
    color: "from-rose-600 to-rose-900 border-rose-500/30",
    textColor: "text-rose-400",
    bgColor: "bg-rose-500/10",
    desc: "Building strong literacy, numeracy, and cognitive/life skills in a highly interactive and nurturing online cohort.",
    subjects: ["Home Language (HL)", "First Additional Language (FAL)", "Mathematics", "Life Skills"],
  },
  {
    name: "Intermediate Phase",
    grades: "Grade 4 – 6",
    icon: BookOpen,
    color: "from-sky-500 to-indigo-950 border-sky-500/30",
    textColor: "text-sky-400",
    bgColor: "bg-sky-500/10",
    desc: "Developing analytical and critical thinking across languages, mathematics, natural sciences, and social sciences.",
    subjects: ["Home Language", "First Additional Language", "Mathematics", "Natural Sciences & Technology", "Social Sciences", "Life Skills"],
  },
  {
    name: "Senior Phase",
    grades: "Grade 7 – 9",
    icon: FlaskConical,
    color: "from-emerald-500 to-teal-950 border-emerald-500/30",
    textColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    desc: "Broadening academic horizons with dedicated specialized subjects to prepare for FET subject selection.",
    subjects: ["Home Language", "First Additional Language", "Mathematics", "Natural Sciences", "Social Sciences", "Technology", "EMS", "Life Orientation", "Creative Arts"],
  },
  {
    name: "FET Phase",
    grades: "Grade 10 – 12",
    icon: GraduationCap,
    color: "from-violet-500 to-purple-950 border-violet-500/30",
    textColor: "text-violet-400",
    bgColor: "bg-violet-500/10",
    desc: "Targeted Matric NSC preparation with specialized subject paths, timed assessments, and trial readiness plans.",
    subjects: ["Home Language", "First Additional Language", "Mathematics / Mathematical Literacy", "Physical Sciences", "Life Sciences", "Accounting", "Geography", "History", "Business Studies", "Life Orientation"],
  },
];

const EXTRAS = [
  { icon: Languages, title: "Extra Languages", desc: "isiZulu, Afrikaans, and more" },
  { icon: Calculator, title: "Maths Enrichment", desc: "Olympiad & advanced problem solving" },
  { icon: Music, title: "Creative Arts", desc: "Music theory, digital drawing & drama" },
  { icon: Dumbbell, title: "Physical Education", desc: "Structured fitness & coordination routines" },
  { icon: Laptop, title: "Coding & Robotics", desc: "HTML/JS, block coding & future-ready skills" },
  { icon: BookOpen, title: "Advanced Reading", desc: "Guided critical reading & comprehension" },
];

const Programs = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Navbar />
      <main className="pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#5c061c]/20 border border-[#5c061c]/30 px-4 py-1.5 rounded-full text-rose-300 text-sm font-semibold">
              <GraduationCap className="h-4 w-4 text-sky-400" />
              Academic Programs
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-white tracking-tight leading-tight">
              Comprehensive CAPS Journey<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-sky-300 to-rose-400">
                From Grade R to Matric
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Every phase of the South African national curriculum (CAPS) delivered through live educator-led online modules and robust academic assessments.
            </p>
          </div>

          {/* Phase cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {PHASES.map(({ name, grades, icon: Icon, color, textColor, bgColor, desc, subjects }) => (
              <div
                key={name}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-sky-500/30 hover:bg-white/[0.04] transition-all group shadow-xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg border border-white/10`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className={`text-sm font-bold ${textColor} ${bgColor} border border-white/10 px-3.5 py-1 rounded-full`}>
                    {grades}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 font-serif group-hover:text-sky-400 transition-colors">
                  {name}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6 text-sm">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <span key={s} className="text-xs bg-white/[0.03] border border-white/[0.06] text-gray-300 px-3 py-1.5 rounded-full font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Extras strip */}
          <div className="rounded-3xl border border-[#5c061c]/30 bg-gradient-to-r from-[#5c061c]/10 via-[#030712] to-[#5c061c]/10 p-8 md:p-12 mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 font-serif">
              Beyond the Core Curriculum
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXTRAS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-sky-500/20 transition-all">
                  <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base font-serif">{title}</p>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matric support */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold font-serif text-white leading-tight">
                Academic Integrity & Matric Success
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our FET programme is designed to prepare students for academic independence and success. We guide learners through continuous assessments, past trial papers, and cognitive analysis.
              </p>
              <ul className="space-y-4">
                {[
                  "Subject packages aligned with South African matriculation guidelines",
                  "Structured June & November trial examinations under mock conditions",
                  "Cognitive levels tracking on all formative assignments",
                  "Standardized official report cards to track true progress",
                  "Detailed exam preparation with SACE-certified subject experts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300 text-sm">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="leading-normal">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#5c061c] to-[#9f1239] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#5c061c]/30 transition-all hover:scale-[1.02] border border-white/10"
              >
                Apply for Admission <ArrowRight className="h-5 w-5 text-sky-300" />
              </Link>
            </div>
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.01] p-8 shadow-2xl shadow-black/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-8">
                <div className="h-11 w-11 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-sky-400" />
                </div>
                <div>
                  <p className="text-white font-bold font-serif text-lg">Matric Academic Rhythm</p>
                  <p className="text-xs text-gray-500">Sample weekly home learning timetable</p>
                </div>
              </div>
              <div className="space-y-1">
                {[
                  { day: "Mon & Wed", act: "Live Mathematics & Physics modules" },
                  { day: "Tue & Thu", act: "Live Languages & Humanities modules" },
                  { day: "Friday", act: "SBA tasks, interactive peer sessions & educator Q&A" },
                  { day: "Continuous", act: "AI Study Buddy & recorded lessons on demand" },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between gap-4 py-4 border-b border-white/[0.06] last:border-0 text-sm">
                    <span className="font-bold text-sky-400 shrink-0 font-serif">{row.day}</span>
                    <span className="text-gray-300 text-right">{row.act}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-600 mt-6 leading-relaxed">
                * Timetables sync dynamically in the student portal. Recordings are available 24/7.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
