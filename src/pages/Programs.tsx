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
    color: "from-orange-500 to-amber-500",
    desc: "Building strong literacy, numeracy and life skills foundations in a nurturing environment.",
    subjects: ["Home Language", "First Additional Language", "Mathematics", "Life Skills"],
  },
  {
    name: "Intermediate Phase",
    grades: "Grade 4 – 6",
    icon: BookOpen,
    color: "from-amber-500 to-yellow-500",
    desc: "Developing critical thinking across languages, mathematics, sciences and social studies.",
    subjects: ["Home Language", "First Additional Language", "Mathematics", "Natural Sciences & Technology", "Social Sciences", "Life Skills"],
  },
  {
    name: "Senior Phase",
    grades: "Grade 7 – 9",
    icon: FlaskConical,
    color: "from-yellow-500 to-green-500",
    desc: "Broadening subject choices and preparing learners for FET subject selection.",
    subjects: ["Home Language", "First Additional Language", "Mathematics", "Natural Sciences", "Social Sciences", "Technology", "EMS", "Life Orientation", "Creative Arts"],
  },
  {
    name: "FET Phase",
    grades: "Grade 10 – 12",
    icon: GraduationCap,
    color: "from-green-500 to-teal-500",
    desc: "Focused Matric preparation with specialised subject packages and exam readiness.",
    subjects: ["Home Language", "First Additional Language", "Mathematics / Mathematical Literacy", "Physical Sciences", "Life Sciences", "Accounting", "Geography", "History", "Business Studies", "Life Orientation"],
  },
];

const EXTRAS = [
  { icon: Languages, title: "Extra Languages", desc: "isiZulu, Afrikaans and more" },
  { icon: Calculator, title: "Maths Enrichment", desc: "Olympiad & problem solving" },
  { icon: Music, title: "Creative Arts", desc: "Music, drama and art" },
  { icon: Dumbbell, title: "Physical Education", desc: "Structured PE programme" },
  { icon: Laptop, title: "Coding & Robotics", desc: "Future-ready tech skills" },
  { icon: BookOpen, title: "Reading Programme", desc: "Guided reading & comprehension" },
];

const Programs = () => {
  return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full text-orange-400 text-sm font-semibold mb-6">
              <GraduationCap className="h-4 w-4" />
              Our Programmes
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              A Complete CAPS Journey,
              <br className="hidden md:block" /> From Grade R to Matric
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Every phase of the South African curriculum, taught by certified educators through
              live online classes with real assessments and reports.
            </p>
          </div>

          {/* Phase cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {PHASES.map(({ name, grades, icon: Icon, color, desc, subjects }) => (
              <div
                key={name}
                className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8 hover:border-orange-500/30 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-sm font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                    {grades}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-2 group-hover:text-orange-400 transition-colors">
                  {name}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-5">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <span key={s} className="text-xs bg-white/[0.04] border border-white/[0.08] text-gray-300 px-3 py-1.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Extras strip */}
          <div className="rounded-3xl border border-orange-500/20 bg-orange-500/[0.04] p-8 md:p-10 mb-16">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-8">
              Beyond the Curriculum
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXTRAS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4">
                  <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matric support */}
          <div className="grid lg:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                Matric Exam Readiness,
                <br /> Done Right
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Our FET programme goes beyond content — we build exam technique through real
                past papers, timed assessments, and detailed feedback on every mark.
              </p>
              <ul className="space-y-3">
                {[
                  "Subject packages designed around NSC requirements",
                  "Regular June & November trial examinations",
                  "Per-question marking with cognitive level tracking",
                  "Termly report cards based on actual assessment marks",
                  "University & career guidance support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 mt-8 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all"
              >
                Apply for a Seat <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-bold">Typical Grade 12 Week</p>
                  <p className="text-xs text-gray-500">Sample home schooling schedule</p>
                </div>
              </div>
              {[
                { day: "Mon & Wed", act: "Live Maths & Physical Sciences classes" },
                { day: "Tue & Thu", act: "Live Language & Accounting classes" },
                { day: "Fri", act: "Tutoring, assignments & exam prep" },
                { day: "Daily", act: "AI Study Buddy + recorded lesson review" },
              ].map((row) => (
                <div key={row.day} className="flex justify-between gap-4 py-3 border-b border-white/[0.06] last:border-0 text-sm">
                  <span className="font-bold text-orange-400 shrink-0">{row.day}</span>
                  <span className="text-gray-400 text-right">{row.act}</span>
                </div>
              ))}
              <p className="text-xs text-gray-600 mt-4">
                Flexible scheduling available — home schooling fits your family's rhythm.
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
