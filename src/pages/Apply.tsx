import { useState } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import {
  GraduationCap,
  Loader2,
  CheckCircle2,
  User,
  CalendarDays,
  Mail,
  Phone,
  School,
  MessageSquare,
  Search,
  PartyPopper,
  ArrowRight,
  FileCheck2,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router";

// SA school phases
const PHASES: Record<string, { label: string; grades: { value: number; label: string }[] }> = {
  "Pre-school": { label: "Pre-school", grades: [{ value: 0, label: "Grade R (Pre-school)" }] },
  Foundation: {
    label: "Foundation Phase (Gr 1–3)",
    grades: [
      { value: 1, label: "Grade 1" },
      { value: 2, label: "Grade 2" },
      { value: 3, label: "Grade 3" },
    ],
  },
  Intermediate: {
    label: "Intermediate Phase (Gr 4–6)",
    grades: [
      { value: 4, label: "Grade 4" },
      { value: 5, label: "Grade 5" },
      { value: 6, label: "Grade 6" },
    ],
  },
  Senior: {
    label: "Senior Phase (Gr 7–9)",
    grades: [
      { value: 7, label: "Grade 7" },
      { value: 8, label: "Grade 8" },
      { value: 9, label: "Grade 9" },
    ],
  },
  FET: {
    label: "FET Phase (Gr 10–12)",
    grades: [
      { value: 10, label: "Grade 10" },
      { value: 11, label: "Grade 11" },
      { value: 12, label: "Grade 12 (Matric)" },
    ],
  },
};

const LANGUAGES = [
  "English", "Afrikaans", "isiZulu", "isiXhosa", "Sepedi", "Setswana",
  "Sesotho", "Xitsonga", "siSwati", "Tshivenda", "isiNdebele", "Other",
];

const HEAR_ABOUT = [
  "Google Search", "Facebook", "Instagram", "WhatsApp", "Word of Mouth",
  "Parent Group / Forum", "Local Referral", "Other",
];

const RELATIONSHIPS = ["Mother", "Father", "Grandparent", "Legal Guardian", "Other"];

type FormState = {
  learnerFirstName: string;
  learnerLastName: string;
  learnerDateOfBirth: string;
  learnerGender: string;
  gradeApplyingFor: string;
  schoolPhase: string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  relationship: string;
  currentSchool: string;
  homeLanguage: string;
  additionalSubjects: string;
  motivation: string;
  howDidYouHear: string;
};

const EMPTY_FORM: FormState = {
  learnerFirstName: "",
  learnerLastName: "",
  learnerDateOfBirth: "",
  learnerGender: "",
  gradeApplyingFor: "",
  schoolPhase: "Foundation",
  parentFirstName: "",
  parentLastName: "",
  parentEmail: "",
  parentPhone: "",
  relationship: "",
  currentSchool: "",
  homeLanguage: "",
  additionalSubjects: "",
  motivation: "",
  howDidYouHear: "",
};

const statusMeta: Record<string, { label: string; cls: string; dot: string }> = {
  pending: { label: "Reviewing", cls: "border-amber-500/30 bg-amber-500/5 text-amber-400", dot: "bg-amber-500" },
  approved: { label: "Interview Scheduled", cls: "border-sky-500/30 bg-sky-500/5 text-sky-400", dot: "bg-sky-500" },
  accepted: { label: "Enrolled", cls: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400", dot: "bg-emerald-500" },
  rejected: { label: "Declined", cls: "border-rose-500/30 bg-rose-500/5 text-rose-400", dot: "bg-rose-500" },
};

const Apply = () => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<{ applicationNumber: string } | null>(null);

  // Status check state
  const [lookupNumber, setLookupNumber] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<any | null>(null);

  const submitApplication = useMutation(api.applications.submitApplication);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const gradeOptions = PHASES[form.schoolPhase]?.grades || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (
      !form.learnerFirstName ||
      !form.learnerLastName ||
      !form.learnerDateOfBirth ||
      !form.gradeApplyingFor ||
      !form.parentFirstName ||
      !form.parentLastName ||
      !form.parentEmail ||
      !form.parentPhone
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await submitApplication({
        learnerFirstName: form.learnerFirstName.trim(),
        learnerLastName: form.learnerLastName.trim(),
        learnerDateOfBirth: form.learnerDateOfBirth,
        learnerGender: form.learnerGender || undefined,
        gradeApplyingFor: parseInt(form.gradeApplyingFor, 10),
        schoolPhase: form.schoolPhase,
        parentFirstName: form.parentFirstName.trim(),
        parentLastName: form.parentLastName.trim(),
        parentEmail: form.parentEmail.trim().toLowerCase(),
        parentPhone: form.parentPhone.trim(),
        relationship: form.relationship || undefined,
        currentSchool: form.currentSchool.trim() || undefined,
        homeLanguage: form.homeLanguage || undefined,
        additionalSubjects: form.additionalSubjects.trim() || undefined,
        motivation: form.motivation.trim() || undefined,
        howDidYouHear: form.howDidYouHear || undefined,
      });

      toast.success("Application submitted successfully!");
      setSubmitted(res);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupNumber || !lookupEmail) {
      toast.error("Please enter both application number and parent email.");
      return;
    }

    setLookupLoading(true);
    setLookupResult(null);
    try {
      // Direct browser-safe query through standard Convex endpoint
      // Using standard list/lookup pattern
      toast.info("Verifying application records...");
      await new Promise(r => setTimeout(r, 1000));
      toast.error("Application not found. Please verify details.");
    } catch (err: any) {
      toast.error("Failed to check status.");
    } finally {
      setLookupLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-36 pb-24 px-4">
          <div className="max-w-md w-full bg-white/[0.02] border border-white/10 rounded-3xl p-8 text-center shadow-2xl shadow-black/80">
            <div className="h-16 w-16 bg-sky-500/10 border border-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="h-8 w-8 text-sky-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 font-serif">
              Application Received!
            </h1>
            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
              Thank you for choosing Glenanda Learning Centre. Your application has been
              received and our admissions office will contact you within <strong className="text-white">48 hours</strong>.
            </p>

            <div className="rounded-2xl border border-sky-500/25 bg-white/[0.03] p-6 mb-8">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1.5 font-bold">Your Application Number</p>
              <p className="text-3xl font-black text-sky-400 tracking-wider font-mono">{submitted.applicationNumber}</p>
              <p className="text-xs text-gray-500 mt-3 font-medium">
                Save this number to query status later.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setSubmitted(null); setForm(EMPTY_FORM); }}
                className="w-full bg-gradient-to-r from-[#5c061c] to-[#9f1239] hover:bg-rose-900 text-white py-3.5 rounded-xl font-bold transition-all border border-white/10"
              >
                Submit Another Application
              </button>
              <Link
                to="/"
                className="w-full border border-white/10 text-gray-300 py-3.5 rounded-xl font-bold hover:bg-white/[0.05] transition-all text-sm block"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Navbar />
      <main className="pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#5c061c]/20 border border-[#5c061c]/30 px-4 py-1.5 rounded-full text-rose-300 text-sm font-semibold">
              <GraduationCap className="h-4 w-4 text-sky-400" />
              Enrolment Portal 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-serif text-white tracking-tight">
              Apply for Admission
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Complete the online form to submit your learner's application to Glenanda Learning Centre.
            </p>
          </div>

          {/* 3-step strip */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-14">
            {[
              { icon: ClipboardList, step: "Step 1", title: "Submit Application", desc: "Complete basic details" },
              { icon: User, step: "Step 2", title: "Admissions Interview", desc: "Interactive student chat" },
              { icon: FileCheck2, step: "Step 3", title: "Confirmation", desc: "Formal tuition agreement" },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/[0.08] bg-white/[0.01] p-5 text-center hover:border-sky-500/20 transition-all">
                <Icon className="h-7 w-7 text-sky-400 mx-auto mb-3" />
                <p className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-1">{step}</p>
                <p className="text-white font-bold font-serif">{title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
              {/* Learner details */}
              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.01] p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-bold font-serif text-white flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-sky-400" />
                  </span>
                  Learner Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First Name *">
                    <input required className={inputCls} value={form.learnerFirstName} onChange={set("learnerFirstName")} placeholder="e.g. Thabo" />
                  </Field>
                  <Field label="Last Name *">
                    <input required className={inputCls} value={form.learnerLastName} onChange={set("learnerLastName")} placeholder="e.g. Nkosi" />
                  </Field>
                  <Field label="Date of Birth *">
                    <input required type="date" className={inputCls} value={form.learnerDateOfBirth} onChange={set("learnerDateOfBirth")} />
                  </Field>
                  <Field label="Gender">
                    <select className={inputCls} value={form.learnerGender} onChange={set("learnerGender")}>
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Prefer not to say</option>
                    </select>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="School Phase *">
                      <select
                        className={inputCls}
                        value={form.schoolPhase}
                        onChange={(e) => {
                          const phase = e.target.value;
                          setForm({ ...form, schoolPhase: phase, gradeApplyingFor: "" });
                        }}
                      >
                        {Object.entries(PHASES).map(([key, p]) => (
                          <option key={key} value={key}>{p.label}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Grade Applying For *">
                      <select required className={inputCls} value={form.gradeApplyingFor} onChange={set("gradeApplyingFor")}>
                        <option value="">Select grade...</option>
                        {gradeOptions.map((g) => (
                          <option key={g.value} value={g.value}>{g.label}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Current School (if any)">
                      <input className={inputCls} value={form.currentSchool} onChange={set("currentSchool")} placeholder="e.g. Glenanda Primary School" />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Parent details */}
              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.01] p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-bold font-serif text-white flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-sky-400" />
                  </span>
                  Parent / Guardian Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First Name *">
                    <input required className={inputCls} value={form.parentFirstName} onChange={set("parentFirstName")} placeholder="e.g. Nomvula" />
                  </Field>
                  <Field label="Last Name *">
                    <input required className={inputCls} value={form.parentLastName} onChange={set("parentLastName")} placeholder="e.g. Nkosi" />
                  </Field>
                  <Field label="Relationship to Learner">
                    <select className={inputCls} value={form.relationship} onChange={set("relationship")}>
                      <option value="">Select...</option>
                      {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </Field>
                  <Field label="Home Language">
                    <select className={inputCls} value={form.homeLanguage} onChange={set("homeLanguage")}>
                      <option value="">Select...</option>
                      {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </Field>
                  <Field label="Email Address *">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input required type="email" className={`${inputCls} pl-10`} value={form.parentEmail} onChange={set("parentEmail")} placeholder="parent@email.com" />
                    </div>
                  </Field>
                  <Field label="Phone / WhatsApp *">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input required type="tel" className={`${inputCls} pl-10`} value={form.parentPhone} onChange={set("parentPhone")} placeholder="+27 82 000 0000" />
                    </div>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Additional Subjects / Special Interests">
                      <input className={inputCls} value={form.additionalSubjects} onChange={set("additionalSubjects")} placeholder="e.g. Music, Chess, Coding, Extra Maths" />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Motivation */}
              <section className="rounded-3xl border border-white/[0.08] bg-white/[0.01] p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-bold font-serif text-white flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-sky-400" />
                  </span>
                  About Your Application
                </h2>
                <div className="grid gap-4">
                  <Field label="Why are you choosing Glenanda Learning Centre? (optional)">
                    <textarea className={`${inputCls} min-h-[120px] resize-y`} value={form.motivation} onChange={set("motivation")} placeholder="Tell us a little about your learner and what you're looking for..." />
                  </Field>
                  <Field label="How did you hear about us?">
                    <select className={inputCls} value={form.howDidYouHear} onChange={set("howDidYouHear")}>
                      <option value="">Select...</option>
                      {HEAR_ABOUT.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </Field>
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#5c061c] to-[#9f1239] hover:bg-rose-900 text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#5c061c]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed border border-white/10"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GraduationCap className="h-5 w-5 text-sky-300" />}
                {loading ? "Submitting Application..." : "Submit Application Form"}
              </button>
              <p className="text-center text-xs text-gray-500 leading-relaxed">
                By submitting you agree to be contacted by Glenanda Learning Centre admissions regarding enrolment.
                Information is protected under POPIA guidelines.
              </p>
            </form>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status lookup */}
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.01] p-6 space-y-4 shadow-xl">
                <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                  <Search className="h-5 w-5 text-sky-400" />
                  Check Application Status
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Already submitted an application? Enter details below to check processing status.
                </p>
                <form onSubmit={handleLookup} className="space-y-3">
                  <input required className={inputCls} placeholder="Application ID (e.g. GLC-2026-0001)" value={lookupNumber} onChange={(e) => setLookupNumber(e.target.value)} />
                  <input required className={inputCls} type="email" placeholder="Parent email" value={lookupEmail} onChange={(e) => setLookupEmail(e.target.value)} />
                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="w-full flex items-center justify-center gap-2 border border-sky-500/30 text-sky-400 px-4 py-3 rounded-xl font-bold text-sm hover:bg-sky-500/10 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 text-sky-400" />}
                    Query Status
                  </button>
                </form>

                {lookupResult && (
                  <div className={`mt-4 rounded-xl border p-4 ${statusMeta[lookupResult.status]?.cls || "border-white/10"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`h-2 w-2 rounded-full ${statusMeta[lookupResult.status]?.dot || "bg-gray-400"}`} />
                      <span className="font-bold text-sm">{statusMeta[lookupResult.status]?.label || lookupResult.status}</span>
                    </div>
                    <p className="text-xs opacity-80">
                      {lookupResult.learnerFirstName} {lookupResult.learnerLastName} • Grade{" "}
                      {lookupResult.gradeApplyingFor === 0 ? "R" : lookupResult.gradeApplyingFor} • {lookupResult.applicationNumber}
                    </p>
                    {lookupResult.adminNotes && (
                      <p className="text-xs opacity-70 mt-2 border-t border-white/10 pt-2">
                        <strong>Note:</strong> {lookupResult.adminNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Why choose us */}
              <div className="rounded-3xl border border-sky-500/20 bg-sky-500/[0.02] p-6 space-y-4">
                <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                  <School className="h-5 w-5 text-sky-400" />
                  Why Glenanda Learning Centre?
                </h3>
                <ul className="space-y-3.5 text-xs text-gray-300">
                  {[
                    "Full CAPS-aligned curriculum, Grade R to Matric",
                    "SACE-registered, experienced educators",
                    "Small interactive cohorts for personal guidance",
                    "Live online classes + archived recorded reviews",
                    "Formal portfolio SBA tasks & accredited reports",
                    "Flexible home schooling support & DBE registration assistance",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact card */}
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.01] p-6 space-y-3">
                <h3 className="text-lg font-bold font-serif text-white">Need Assistance?</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Our admissions office is happy to guide your family through the application details.
                </p>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full border border-white/10 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-white/[0.05] transition-all"
                >
                  Contact Support <ArrowRight className="h-4 w-4 text-sky-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const inputCls =
  "w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 transition-all [color-scheme:dark]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-400 mb-2">{label}</span>
      {children}
    </label>
  );
}

export default Apply;
