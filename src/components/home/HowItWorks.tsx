import { useState } from "react";
import {
  FileText,
  UserCheck,
  Video,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Zap,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router";

const steps = [
  {
    id: "01",
    icon: FileText,
    badge: "Step 01",
    title: "Easy Enrolment",
    subtitle: "Quick Online Application",
    desc: "Submit your learner's details and select their CAPS grade (Grade R to 12). Our admissions team reviews and approves applications within 24 hours.",
    color: "from-orange-500 to-amber-500",
    textColor: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    glowColor: "rgba(249, 115, 22, 0.15)",
    preview: {
      tag: "Admissions Portal",
      title: "Online Application Status",
      status: "Approved for 2026",
      items: [
        { label: "Grade Selection", value: "Grade 10 FET Phase" },
        { label: "Curriculum", value: "Full CAPS Aligned" },
        { label: "Verification", value: "DBE & SACE Verified" },
      ],
    },
  },
  {
    id: "02",
    icon: UserCheck,
    badge: "Step 02",
    title: "Personalised Onboarding",
    subtitle: "Custom Learning Portal",
    desc: "Get instant access to the parent & student portals. View your learner's timetable, textbook materials, and personalized study schedules.",
    color: "from-amber-400 to-yellow-500",
    textColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    glowColor: "rgba(245, 158, 11, 0.15)",
    preview: {
      tag: "Learner Portal",
      title: "Active Learning Hub",
      status: "Configured",
      items: [
        { label: "Enrolled Subjects", value: "7 CAPS Subjects" },
        { label: "Timetable Sync", value: "Daily Live Schedule" },
        { label: "Resource Library", value: "Textbooks & Past Papers" },
      ],
    },
  },
  {
    id: "03",
    icon: Video,
    badge: "Step 03",
    title: "Live Classes & AI Support",
    subtitle: "Interactive Daily Learning",
    desc: "Learners attend live classes taught by SACE-registered educators, and use our 24/7 AI Study Buddy for instant homework help and practice tests.",
    color: "from-emerald-400 to-teal-500",
    textColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    glowColor: "rgba(16, 185, 129, 0.15)",
    preview: {
      tag: "Live Classroom",
      title: "Mathematics Grade 10",
      status: "Live Now • 98 Attending",
      items: [
        { label: "Educator", value: "Mr. Thabo Mokoena (SACE)" },
        { label: "AI Assistant", value: "Active 24/7 for Q&A" },
        { label: "Interactive Tools", value: "Shared Whiteboard & Chat" },
      ],
    },
  },
  {
    id: "04",
    icon: BarChart3,
    badge: "Step 04",
    title: "Assessments & Reports",
    subtitle: "Certified Academic Progress",
    desc: "Complete CAPS-aligned SBA tasks, term exams, and real-time assessments. Parents receive detailed report cards and diagnostic progress insights.",
    color: "from-violet-400 to-purple-500",
    textColor: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    glowColor: "rgba(139, 92, 246, 0.15)",
    preview: {
      tag: "Progress Analytics",
      title: "Term 3 Report Summary",
      status: "84% Overall Average",
      items: [
        { label: "SBA Submissions", value: "100% Completed" },
        { label: "Term Average", value: "Level 7 (Distinction)" },
        { label: "Report Card", value: "Official CAPS Verified" },
      ],
    },
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  const currentPreview = steps[activeStep].preview;

  return (
    <section id="how-it-works" className="py-28 bg-[#030712] relative overflow-hidden">
      {/* Dynamic ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[160px] transition-all duration-700"
          style={{ background: steps[activeStep].glowColor }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Simple 4-Step Process
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
            How <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Glenanda Learning</span> Works
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            From seamless enrolment to official CAPS-aligned report cards — we empower learners to excel with live interactive classes and AI-guided study support.
          </p>
        </div>

        {/* Interactive Steps Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Interactive Step Cards */}
          <div className="lg:col-span-6 space-y-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`group relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border ${
                    isActive
                      ? "bg-white/[0.06] border-orange-500/40 shadow-xl shadow-black/40 scale-[1.01]"
                      : "bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    {/* Icon Container */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                        isActive
                          ? `${step.bgColor} ${step.borderColor} scale-110 shadow-lg`
                          : "bg-white/[0.04] border-white/10 group-hover:scale-105"
                      }`}
                    >
                      <Icon
                        className={`w-7 h-7 ${
                          isActive ? step.textColor : "text-gray-400 group-hover:text-gray-200"
                        }`}
                      />
                    </div>

                    {/* Step Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            isActive ? step.textColor : "text-gray-500"
                          }`}
                        >
                          {step.badge}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                            Active Step <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-orange-500 to-amber-500 rounded-r-full" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Mockup Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl shadow-black/60 overflow-hidden">
              {/* Top Card Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-semibold text-gray-500 tracking-wider uppercase">
                    {currentPreview.tag}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {currentPreview.status}
                </span>
              </div>

              {/* Preview Title */}
              <div className="mb-6">
                <h4 className="text-2xl font-black text-white mb-1">
                  {currentPreview.title}
                </h4>
                <p className="text-xs text-gray-400">
                  Glenanda Learning Center Platform • Grade R–12 CAPS Ecosystem
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-8">
                {currentPreview.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.07] transition-all hover:bg-white/[0.05]"
                  >
                    <span className="text-sm font-medium text-gray-300">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-orange-400">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Interactive Footer Banner inside card */}
              <div className="rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 border border-orange-500/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Full CAPS Alignment</p>
                    <p className="text-[11px] text-gray-400">SACE-registered educators & real assessments</p>
                  </div>
                </div>
                <Link
                  to="/apply"
                  className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1"
                >
                  Apply <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-20 relative rounded-3xl overflow-hidden border border-orange-500/25 bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-orange-950/40 p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="space-y-2 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-orange-400">
                <Zap className="w-4 h-4" /> 2026 Academic Year Admission
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white">
                Ready to Give Your Child a Brighter Future?
              </h3>
              <p className="text-gray-300 max-w-2xl text-base">
                Join Glenanda Learning Center today. Full CAPS curriculum, live expert classes, and interactive AI study assistance for Grade R to Matric.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto">
              <Link
                to="/apply"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-base hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-[1.02] text-center flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-5 h-5" /> Start Application
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all text-center flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-orange-400" /> Talk to Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
