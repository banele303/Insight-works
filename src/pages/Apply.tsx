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
  "Parent Group / Forum", "Shopping Centre Visit", "Other",
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

const Apply = () => {
  const submitApplication = useMutation(api.applications.submitApplication);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<null | { applicationNumber: string }>(null);

  // Status lookup
  const [lookupNumber, setLookupNumber] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const getApplicationByNumber = useMutation(api.applications.getApplicationByNumber as any);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const gradeOptions = PHASES[form.schoolPhase]?.grades ?? PHASES["Foundation"].grades;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.learnerFirstName.trim() || !form.learnerLastName.trim()) {
      toast.error("Please enter the learner's full name");
      return;
    }
    if (!form.learnerDateOfBirth) {
      toast.error("Please enter the learner's date of birth");
      return;
    }
    if (!form.gradeApplyingFor) {
      toast.error("Please select the grade you are applying for");
      return;
    }
    if (!form.parentFirstName.trim() || !form.parentLastName.trim()) {
      toast.error("Please enter the parent/guardian name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) {
      toast.error("Please enter a valid parent email address");
      return;
    }
    if (!form.parentPhone.trim()) {
      toast.error("Please enter a parent phone number");
      return;
    }

    setLoading(true);
    try {
      const result = await submitApplication({
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
      setSubmitted(result as any);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupNumber.trim() || !lookupEmail.trim()) {
      toast.error("Enter your application number and email");
      return;
    }
    setLookupLoading(true);
    try {
      const result = await getApplicationByNumber({
        applicationNumber: lookupNumber.trim().toUpperCase(),
        parentEmail: lookupEmail.trim().toLowerCase(),
      });
      setLookupResult(result);
      if (!result) toast.error("No application found. Check the number and email and try again.");
    } catch (err: any) {
      toast.error(err?.message || "Lookup failed. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  const statusMeta: Record<string, { label: string; cls: string; dot: string }> = {
    pending: { label: "Pending Review", cls: "bg-amber-500/10 border-amber-500/30 text-amber-400", dot: "bg-amber-400" },
    reviewing: { label: "Being Reviewed", cls: "bg-blue-500/10 border-blue-500/30 text-blue-400", dot: "bg-blue-400" },
    accepted: { label: "Accepted — Welcome!", cls: "bg-green-500/10 border-green-500/30 text-green-400", dot: "bg-green-400" },
    rejected: { label: "Not Accepted", cls: "bg-red-500/10 border-red-500/30 text-red-400", dot: "bg-red-400" },
    waitlist: { label: "Waitlist", cls: "bg-purple-500/10 border-purple-500/30 text-purple-400", dot: "bg-purple-400" },
  };

  // ─── Success screen ────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#030712]">
        <Navbar />
        <main className="pt-36 pb-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-green-500/10 border border-green-500/30 mb-8">
              <PartyPopper className="h-10 w-10 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Application Submitted!
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Thank you for choosing Glenanda Shopping Learning Center. Your application has been
              received and our enrolment team will be in touch within <strong className="text-white">48 hours</strong>.
            </p>

            <div className="rounded-2xl border border-orange-500/25 bg-white/[0.03] p-8 mb-10">
              <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Your Application Number</p>
              <p className="text-4xl font-black text-orange-400 tracking-wider">{submitted.applicationNumber}</p>
              <p className="text-sm text-gray-500 mt-4">
                Save this number — you'll need it to check your application status.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="border border-white/15 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/[0.05] transition-all"
              >
                Back to Home
              </Link>
              <button
                onClick={() => { setSubmitted(null); setForm(EMPTY_FORM); }}
                className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-xl font-bold transition-all"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <Navbar />
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full text-orange-400 text-sm font-semibold mb-6">
              <GraduationCap className="h-4 w-4" />
              Enrolment 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              Apply for Enrolment
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Join Glenanda Shopping Learning Center — complete the form below and our team will
              contact you to arrange an assessment interview.
            </p>
          </div>

          {/* 3-step strip */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-14">
            {[
              { icon: ClipboardList, step: "Step 1", title: "Submit Application", desc: "5 minutes online" },
              { icon: User, step: "Step 2", title: "Assessment Interview", desc: "We meet your learner" },
              { icon: FileCheck2, step: "Step 3", title: "Confirmation", desc: "Enrol & start learning" },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-center">
                <Icon className="h-7 w-7 text-orange-400 mx-auto mb-3" />
                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">{step}</p>
                <p className="text-white font-bold">{title}</p>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
              {/* Learner details */}
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <span className="h-8 w-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                    <User className="h-4 w-4 text-orange-400" />
                  </span>
                  Learner Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First Name *">
                    <input className={inputCls} value={form.learnerFirstName} onChange={set("learnerFirstName")} placeholder="e.g. Thabo" />
                  </Field>
                  <Field label="Last Name *">
                    <input className={inputCls} value={form.learnerLastName} onChange={set("learnerLastName")} placeholder="e.g. Nkosi" />
                  </Field>
                  <Field label="Date of Birth *">
                    <input type="date" className={inputCls} value={form.learnerDateOfBirth} onChange={set("learnerDateOfBirth")} />
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
                      <select className={inputCls} value={form.gradeApplyingFor} onChange={set("gradeApplyingFor")}>
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
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <span className="h-8 w-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-orange-400" />
                  </span>
                  Parent / Guardian Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First Name *">
                    <input className={inputCls} value={form.parentFirstName} onChange={set("parentFirstName")} placeholder="e.g. Nomvula" />
                  </Field>
                  <Field label="Last Name *">
                    <input className={inputCls} value={form.parentLastName} onChange={set("parentLastName")} placeholder="e.g. Nkosi" />
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
                      <input type="email" className={`${inputCls} pl-10`} value={form.parentEmail} onChange={set("parentEmail")} placeholder="parent@email.com" />
                    </div>
                  </Field>
                  <Field label="Phone / WhatsApp *">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input type="tel" className={`${inputCls} pl-10`} value={form.parentPhone} onChange={set("parentPhone")} placeholder="+27 82 000 0000" />
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
              <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                  <span className="h-8 w-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-orange-400" />
                  </span>
                  About Your Application
                </h2>
                <div className="grid gap-4">
                  <Field label="Why are you choosing home schooling / our centre? (optional)">
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
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-5 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GraduationCap className="h-5 w-5" />}
                {loading ? "Submitting..." : "Submit Application"}
              </button>
              <p className="text-center text-xs text-gray-500">
                By submitting you agree to be contacted by Glenanda Shopping Learning Center regarding your application.
                Your information is protected under POPIA.
              </p>
            </form>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status lookup */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-orange-400" />
                  Check Application Status
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Already applied? Enter your application number and parent email to see the status.
                </p>
                <form onSubmit={handleLookup} className="space-y-3">
                  <input className={inputCls} placeholder="Application number (e.g. GSLC-2026-0001)" value={lookupNumber} onChange={(e) => setLookupNumber(e.target.value)} />
                  <input className={inputCls} type="email" placeholder="Parent email" value={lookupEmail} onChange={(e) => setLookupEmail(e.target.value)} />
                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="w-full flex items-center justify-center gap-2 border border-orange-500/40 text-orange-400 px-4 py-3 rounded-xl font-bold text-sm hover:bg-orange-500/10 transition-all disabled:opacity-60"
                  >
                    {lookupLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Check Status
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
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <School className="h-5 w-5 text-orange-400" />
                  Why Glenanda Shopping Learning Center?
                </h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  {[
                    "Full CAPS-aligned curriculum, Grade R to Matric",
                    "SACE-registered, experienced educators",
                    "Small learner groups — real individual attention",
                    "Live online classes + recorded lessons",
                    "Real exams, assignments and term reports",
                    "Flexible home schooling schedules for families",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact card */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h3 className="text-lg font-bold text-white mb-4">Need Help?</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Our enrolment team is happy to answer any questions about the application process.
                </p>
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full border border-white/15 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-white/[0.05] transition-all"
                >
                  Contact Our Team <ArrowRight className="h-4 w-4" />
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
  "w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all [color-scheme:dark]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-400 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export default Apply;
