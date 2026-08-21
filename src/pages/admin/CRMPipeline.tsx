import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import {
  Search, Mail, Phone, GraduationCap, CheckCircle2,
  ChevronRight, TrendingUp, Hourglass, ClipboardList,
  Ban, Star, Users, RefreshCw, ArrowUpRight, Sparkles,
  BookOpen, UserCheck, XCircle, MoveRight,
} from "lucide-react";
import { toast } from "sonner";
import type { Id } from "../../../convex/_generated/dataModel";

// ─── Stage config ─────────────────────────────────────────────────────────────
const STAGES = [
  {
    id: "pending",
    label: "New Leads",
    icon: Hourglass,
    color: "#F59E0B",
    bg: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
    softBg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-l-amber-500",
    pill: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
    glow: "shadow-amber-500/20",
    next: [{ label: "Start Review", status: "reviewing" as const }],
  },
  {
    id: "reviewing",
    label: "In Review",
    icon: ClipboardList,
    color: "#3B82F6",
    bg: "bg-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
    softBg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-l-blue-500",
    pill: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
    glow: "shadow-blue-500/20",
    next: [
      { label: "Enrol", status: "accepted" as const },
      { label: "Waitlist", status: "waitlist" as const },
      { label: "Decline", status: "rejected" as const },
    ],
  },
  {
    id: "accepted",
    label: "Enrolled",
    icon: CheckCircle2,
    color: "#10B981",
    bg: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
    softBg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-l-emerald-500",
    pill: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    glow: "shadow-emerald-500/20",
    next: [],
  },
  {
    id: "waitlist",
    label: "Waitlisted",
    icon: Star,
    color: "#8B5CF6",
    bg: "bg-violet-500",
    textColor: "text-violet-600 dark:text-violet-400",
    softBg: "bg-violet-50 dark:bg-violet-500/10",
    border: "border-l-violet-500",
    pill: "bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300",
    glow: "shadow-violet-500/20",
    next: [{ label: "Enrol Now", status: "accepted" as const }],
  },
  {
    id: "rejected",
    label: "Declined",
    icon: Ban,
    color: "#EF4444",
    bg: "bg-rose-500",
    textColor: "text-rose-600 dark:text-rose-400",
    softBg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-l-rose-500",
    pill: "bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300",
    glow: "shadow-rose-500/20",
    next: [],
  },
];

type AppStatus = "pending" | "reviewing" | "accepted" | "waitlist" | "rejected";

function timeAgo(ms: number) {
  const d = Date.now() - ms;
  const m = Math.floor(d / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function gradeLabel(g: number) {
  return g === 0 ? "Grade R" : `Grade ${g}`;
}

function avatarInitials(first: string, last: string) {
  return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
}

// ─── Detail Sheet ──────────────────────────────────────────────────────────────
function DetailSheet({
  app,
  onClose,
  onMove,
}: {
  app: any;
  onClose: () => void;
  onMove: (id: Id<"applications">, s: AppStatus) => void;
}) {
  const stage = STAGES.find((s) => s.id === app.status)!;
  const [notes, setNotes] = useState(app.adminNotes || "");
  const updateStatus = useMutation(api.applications.updateApplicationStatus);

  const handleSave = async (newStatus?: AppStatus) => {
    try {
      await updateStatus({
        applicationId: app._id,
        status: (newStatus ?? app.status) as AppStatus,
        adminNotes: notes,
      });
      toast.success(newStatus ? `Moved to ${STAGES.find((s) => s.id === newStatus)?.label}` : "Notes saved");
      if (newStatus) onMove(app._id, newStatus);
    } catch {
      toast.error("Failed to update");
    }
  };

  const StageIcon = stage.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-lg bg-white dark:bg-zinc-900 sm:rounded-3xl rounded-t-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[92dvh] flex flex-col animate-in slide-in-from-bottom-6 duration-300">

        {/* Mobile handle */}
        <div className="sm:hidden flex justify-center py-3">
          <div className="w-9 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
        </div>

        {/* Header bar */}
        <div className="flex items-center gap-3 px-5 pb-4 pt-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base font-mono shrink-0"
            style={{ backgroundColor: stage.color }}
          >
            {avatarInitials(app.learnerFirstName, app.learnerLastName)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-100 text-base truncate">
              {app.learnerFirstName} {app.learnerLastName}
            </h2>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-md ${stage.pill}`}>
                {app.applicationNumber}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                <StageIcon className="w-3 h-3" style={{ color: stage.color }} />
                {stage.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 cursor-pointer transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Thin accent line */}
        <div className="h-0.5 w-full" style={{ backgroundColor: stage.color, opacity: 0.3 }} />

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: GraduationCap, label: "Grade", value: gradeLabel(app.gradeApplyingFor) },
              { icon: BookOpen, label: "Phase", value: app.schoolPhase },
              { icon: Users, label: "Parent", value: `${app.parentFirstName} ${app.parentLastName}` },
              { icon: Mail, label: "Email", value: app.parentEmail },
              ...(app.parentPhone ? [{ icon: Phone, label: "Phone", value: app.parentPhone }] : []),
              ...(app.homeLanguage ? [{ icon: Sparkles, label: "Language", value: app.homeLanguage }] : []),
            ].map((item, i) => (
              <div key={i} className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <item.icon className="w-3 h-3 text-zinc-400" />
                  <span className="text-[10px] text-zinc-400 font-medium">{item.label}</span>
                </div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Motivation */}
          {app.motivation && (
            <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-4">
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Motivation</p>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{app.motivation}</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Internal Notes</p>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for this application..."
              className="w-full rounded-2xl text-xs bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 px-4 py-3 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 resize-none transition-colors"
            />
          </div>

          {/* Move actions */}
          {STAGES.filter((s) => s.id !== app.status).length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Move Application</p>
              <div className="grid grid-cols-2 gap-2">
                {STAGES.filter((s) => s.id !== app.status).map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSave(s.id as AppStatus)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                      style={{
                        backgroundColor: `${s.color}15`,
                        color: s.color,
                        border: `1px solid ${s.color}30`,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
          <button
            onClick={() => handleSave()}
            className="flex-1 h-11 rounded-2xl text-white text-sm font-semibold transition-opacity hover:opacity-90 active:opacity-80"
            style={{ backgroundColor: stage.color }}
          >
            Save Notes
          </button>
          <button
            onClick={onClose}
            className="px-5 h-11 rounded-2xl text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lead Card ────────────────────────────────────────────────────────────────
function LeadCard({
  app,
  stage,
  onView,
  onMove,
}: {
  app: any;
  stage: (typeof STAGES)[0];
  onView: (a: any) => void;
  onMove: (id: Id<"applications">, s: AppStatus) => void;
}) {
  return (
    <div
      className={`relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 border-l-4 ${stage.border} overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200`}
    >
      <div className="p-4">
        {/* Top */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm font-mono shrink-0"
            style={{ backgroundColor: stage.color }}
          >
            {avatarInitials(app.learnerFirstName, app.learnerLastName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight truncate">
              {app.learnerFirstName} {app.learnerLastName}
            </p>
            <p className="text-[10px] text-zinc-400 font-mono">{app.applicationNumber}</p>
          </div>
          <button
            onClick={() => onView(app)}
            className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-pointer transition-all opacity-0 group-hover:opacity-100"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg ${stage.pill}`}>
            <GraduationCap className="w-3 h-3" />
            {gradeLabel(app.gradeApplyingFor)}
          </span>
          <span className="text-[10px] font-medium px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {app.schoolPhase}
          </span>
        </div>

        {/* Contact */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
            <Mail className="w-3 h-3 shrink-0 text-zinc-400" />
            <span className="truncate">{app.parentEmail}</span>
          </div>
          {app.parentPhone && (
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <Phone className="w-3 h-3 shrink-0 text-zinc-400" />
              {app.parentPhone}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[10px] text-zinc-400 font-mono">{timeAgo(app.createdAt)}</span>
          <div className="flex items-center gap-1">
            {stage.next.map((n) => (
              <button
                key={n.status}
                onClick={() => onMove(app._id, n.status)}
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: `${stage.color}18`, color: stage.color }}
              >
                {n.label}
                <MoveRight className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={() => onView(app)}
              className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CRMPipeline() {
  const [activeStage, setActiveStage] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const allApps = useQuery(api.applications.getApplications, {});
  const submitApp = useMutation(api.applications.submitApplication);
  const updateStatus = useMutation(api.applications.updateApplicationStatus);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeed = async () => {
    setIsSeeding(true);
    let count = 0;
    try {
      const demoLeads = [
        {
          learnerFirstName: "Amahle", learnerLastName: "Dlamini",
          learnerDateOfBirth: "2014-03-12", learnerGender: "Female",
          gradeApplyingFor: 4, schoolPhase: "Intermediate Phase",
          parentFirstName: "Nomvula", parentLastName: "Dlamini",
          parentEmail: "nomvula.dlamini@gmail.com", parentPhone: "+27 82 345 6789",
          relationship: "Mother", currentSchool: "Thokoza Primary",
          homeLanguage: "Zulu", howDidYouHear: "WhatsApp community",
          motivation: "My daughter is very bright and I believe this school will help her reach her full potential.",
          targetStatus: "pending" as const,
        },
        {
          learnerFirstName: "Lethiwe", learnerLastName: "Nkosi",
          learnerDateOfBirth: "2016-07-22", learnerGender: "Female",
          gradeApplyingFor: 2, schoolPhase: "Foundation Phase",
          parentFirstName: "Sipho", parentLastName: "Nkosi",
          parentEmail: "sipho.nkosi@outlook.com", parentPhone: "+27 71 234 5678",
          relationship: "Father", currentSchool: "Sunrise Preparatory",
          homeLanguage: "Zulu", howDidYouHear: "Google Search",
          motivation: "We are looking for a more personalised learning environment for our daughter.",
          targetStatus: "pending" as const,
        },
        {
          learnerFirstName: "Ethan", learnerLastName: "Van Der Berg",
          learnerDateOfBirth: "2009-11-05", learnerGender: "Male",
          gradeApplyingFor: 8, schoolPhase: "Senior Phase",
          parentFirstName: "Karen", parentLastName: "Van Der Berg",
          parentEmail: "karen.vdb@webmail.co.za", parentPhone: "+27 83 901 2345",
          relationship: "Mother", currentSchool: "Greenfields High",
          homeLanguage: "Afrikaans", howDidYouHear: "Friend recommendation",
          motivation: "Ethan struggled with large class sizes. We believe smaller groups will help him thrive.",
          targetStatus: "pending" as const,
        },
        {
          learnerFirstName: "Riya", learnerLastName: "Pillay",
          learnerDateOfBirth: "2013-04-18", learnerGender: "Female",
          gradeApplyingFor: 5, schoolPhase: "Intermediate Phase",
          parentFirstName: "Priya", parentLastName: "Pillay",
          parentEmail: "priya.pillay@gmail.com", parentPhone: "+27 61 567 8901",
          relationship: "Mother", currentSchool: "Sunridge Academy",
          homeLanguage: "English", howDidYouHear: "Facebook Ad",
          motivation: "Riya is a gifted learner who needs more challenge and enrichment than her current school provides.",
          targetStatus: "pending" as const,
        },
        {
          learnerFirstName: "Lwazi", learnerLastName: "Mthembu",
          learnerDateOfBirth: "2012-09-30", learnerGender: "Male",
          gradeApplyingFor: 6, schoolPhase: "Intermediate Phase",
          parentFirstName: "Nandi", parentLastName: "Mthembu",
          parentEmail: "nandi.mthembu@gmail.com", parentPhone: "+27 73 456 7890",
          relationship: "Mother", currentSchool: "Bhekuzulu Primary",
          homeLanguage: "Zulu", howDidYouHear: "Word of mouth",
          motivation: "Lwazi has a passion for mathematics and science and we want to nurture that.",
          targetStatus: "reviewing" as const,
          notes: "School report verified. Good academic record. Schedule interview.",
        },
        {
          learnerFirstName: "Jade", learnerLastName: "Botha",
          learnerDateOfBirth: "2011-06-14", learnerGender: "Female",
          gradeApplyingFor: 7, schoolPhase: "Intermediate Phase",
          parentFirstName: "Riaan", parentLastName: "Botha",
          parentEmail: "riaan.botha@mweb.co.za", parentPhone: "+27 82 678 9012",
          relationship: "Father", currentSchool: "Laerskool Rooihuiskraal",
          homeLanguage: "Afrikaans", howDidYouHear: "Teacher referral",
          motivation: "Jade is artistic and analytical. We believe in a balanced holistic education.",
          targetStatus: "reviewing" as const,
          notes: "Parents attended open day. Very engaged. Awaiting Grade 6 report.",
        },
        {
          learnerFirstName: "Zanele", learnerLastName: "Khumalo",
          learnerDateOfBirth: "2013-08-10", learnerGender: "Female",
          gradeApplyingFor: 5, schoolPhase: "Intermediate Phase",
          parentFirstName: "Bongiwe", parentLastName: "Khumalo",
          parentEmail: "bongiwe.khumalo@gmail.com", parentPhone: "+27 84 567 8901",
          relationship: "Mother", currentSchool: "Siyanda Primary",
          homeLanguage: "Zulu", howDidYouHear: "Social media",
          motivation: "Zanele loves reading and creative writing. We're excited for this opportunity.",
          targetStatus: "accepted" as const,
          notes: "Accepted for Grade 5. Placed in Ms Mokoena's class. Fees confirmed.",
        },
        {
          learnerFirstName: "Aiden", learnerLastName: "Pretorius",
          learnerDateOfBirth: "2010-12-03", learnerGender: "Male",
          gradeApplyingFor: 9, schoolPhase: "Senior Phase",
          parentFirstName: "Louise", parentLastName: "Pretorius",
          parentEmail: "louise.pretorius@gmail.com", parentPhone: "+27 71 890 1234",
          relationship: "Mother", currentSchool: "Waterkloof House Prep",
          homeLanguage: "Afrikaans", howDidYouHear: "Previous parent",
          motivation: "We are relocating and need a school with strong academics and sport programmes.",
          targetStatus: "accepted" as const,
          notes: "Strong academic record. Sport captain. Enrolled. Welcome pack sent.",
        },
        {
          learnerFirstName: "Siyanda", learnerLastName: "Ngcobo",
          learnerDateOfBirth: "2012-02-14", learnerGender: "Male",
          gradeApplyingFor: 6, schoolPhase: "Intermediate Phase",
          parentFirstName: "Lungile", parentLastName: "Ngcobo",
          parentEmail: "lungile.ngcobo@gmail.com", parentPhone: "+27 83 012 3456",
          relationship: "Father", currentSchool: "Ithemba Primary",
          homeLanguage: "Xhosa", howDidYouHear: "Church community",
          motivation: "Siyanda shows great leadership skills and we want to develop them further.",
          targetStatus: "waitlist" as const,
          notes: "Grade 6 class is full. On waitlist position #1. Parent notified.",
        },
        {
          learnerFirstName: "Jason", learnerLastName: "Williams",
          learnerDateOfBirth: "2007-03-25", learnerGender: "Male",
          gradeApplyingFor: 11, schoolPhase: "FET Phase",
          parentFirstName: "Deborah", parentLastName: "Williams",
          parentEmail: "deborah.williams@gmail.com", parentPhone: "+27 81 234 5678",
          relationship: "Mother", currentSchool: "Athlone High",
          homeLanguage: "English", howDidYouHear: "Website",
          motivation: "Jason wants to change schools for his final two years of high school.",
          targetStatus: "rejected" as const,
          notes: "Declined — we currently do not offer Grade 11. Family referred to suitable school.",
        },
      ];

      for (const item of demoLeads) {
        const { targetStatus, notes, ...fields } = item;
        const res = await submitApp(fields);
        count++;
        if (targetStatus !== "pending" && res?.applicationId) {
          try {
            await updateStatus({ applicationId: res.applicationId, status: targetStatus, adminNotes: notes });
          } catch (_e) {
            // Unauthenticated client might fail status update, but lead is submitted!
          }
        }
      }
      toast.success(`Seeded ${count} demo applications into pipeline!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to seed demo applications.");
    } finally {
      setIsSeeding(false);
    }
  };

  const stats = useMemo(() => {
    if (!allApps) return { total: 0, pending: 0, reviewing: 0, accepted: 0, waitlist: 0, rejected: 0, rate: 0 };
    const c = (s: string) => allApps.filter((a) => a.status === s).length;
    const t = allApps.length;
    const acc = c("accepted");
    return { total: t, pending: c("pending"), reviewing: c("reviewing"), accepted: acc, waitlist: c("waitlist"), rejected: c("rejected"), rate: t > 0 ? Math.round((acc / t) * 100) : 0 };
  }, [allApps]);

  const grouped = useMemo(() => {
    if (!allApps) return {} as Record<string, any[]>;
    const q = search.toLowerCase();
    const filtered = q
      ? allApps.filter((a) =>
          `${a.learnerFirstName} ${a.learnerLastName}`.toLowerCase().includes(q) ||
          a.parentEmail.toLowerCase().includes(q) ||
          (a.applicationNumber ?? "").toLowerCase().includes(q) ||
          (a.parentPhone ?? "").includes(q)
        )
      : allApps;
    return STAGES.reduce((acc, s) => {
      acc[s.id] = filtered.filter((a) => a.status === s.id);
      return acc;
    }, {} as Record<string, any[]>);
  }, [allApps, search]);

  const handleMove = async (id: Id<"applications">, status: AppStatus) => {
    try {
      await updateStatus({ applicationId: id, status });
      toast.success(`Moved to ${STAGES.find((s) => s.id === status)?.label}`);
      if (selectedApp?._id === id) setSelectedApp((p: any) => p ? { ...p, status } : null);
    } catch {
      toast.error("Failed to move");
    }
  };

  const stage = STAGES.find((s) => s.id === activeStage)!;
  const cards = grouped[activeStage] ?? [];

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-50 dark:bg-zinc-950 overflow-hidden">

      {/* ═══ HEADER ═══ */}
      <header className="shrink-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800/80">

        {/* Top row */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="flex-1">
            <h1 className="text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight leading-none">
              Enrolment Pipeline
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5 font-medium">
              {stats.total} total · {stats.rate}% conversion
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 cursor-pointer transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isSeeding ? "Seeding..." : "Seed Demo Leads"}
            </button>
            <div className="relative w-36 sm:w-52">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* ── Funnel stat blocks ── */}
        <div className="flex overflow-x-auto scrollbar-none px-4 gap-2 pb-3">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const count = grouped[s.id]?.length ?? 0;
            const isActive = activeStage === s.id;
            const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

            return (
              <button
                key={s.id}
                onClick={() => setActiveStage(s.id)}
                className={`shrink-0 flex flex-col items-start gap-1 rounded-2xl px-4 py-3 cursor-pointer transition-all duration-200 border min-w-[100px] sm:min-w-[120px] ${
                  isActive
                    ? "border-transparent shadow-lg scale-[1.02]"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
                style={isActive ? { backgroundColor: s.color, boxShadow: `0 8px 24px ${s.color}30` } : {}}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white/80" : s.textColor}`} />
                  {i < STAGES.length - 1 && !isActive && (
                    <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
                  )}
                </div>
                <span className={`text-2xl font-black font-mono leading-none ${isActive ? "text-white" : "text-zinc-900 dark:text-zinc-100"}`}>
                  {count}
                </span>
                <span className={`text-[10px] font-semibold leading-tight ${isActive ? "text-white/80" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {s.label}
                </span>
                {/* Mini progress bar */}
                <div className={`h-0.5 w-full rounded-full mt-1 ${isActive ? "bg-white/30" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: isActive ? "rgba(255,255,255,0.7)" : s.color,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </header>

      {/* ═══ ACTIVE STAGE LABEL ═══ */}
      <div
        className="shrink-0 flex items-center gap-2.5 px-4 py-2"
        style={{ borderBottom: `1px solid ${stage.color}20`, backgroundColor: `${stage.color}08` }}
      >
        {(() => { const Icon = stage.icon; return <Icon className="w-4 h-4" style={{ color: stage.color }} />; })()}
        <span className="text-sm font-bold" style={{ color: stage.color }}>{stage.label}</span>
        <span
          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg"
          style={{ backgroundColor: `${stage.color}18`, color: stage.color }}
        >
          {cards.length} applications
        </span>
        {search && (
          <span className="ml-auto text-[10px] text-zinc-400">
            Filtered · <button onClick={() => setSearch("")} className="underline cursor-pointer hover:text-zinc-600">clear</button>
          </span>
        )}
      </div>

      {/* ═══ CARD GRID ═══ */}
      <main className="flex-1 overflow-y-auto">
        {!allApps ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-zinc-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <p className="text-sm font-medium">Loading pipeline...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-4 px-8">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: `${stage.color}15` }}
            >
              {(() => { const Icon = stage.icon; return <Icon className="w-7 h-7" style={{ color: stage.color }} />; })()}
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No applications in {stage.label}</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs mb-3">
                {search ? "Try clearing your search filter" : "Applications will appear here as they progress"}
              </p>
              {stats.total === 0 && (
                <button
                  onClick={handleSeed}
                  disabled={isSeeding}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  {isSeeding ? "Seeding..." : "Seed 14 Demo Applications"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cards.map((app) => (
              <LeadCard
                key={app._id}
                app={app}
                stage={stage}
                onView={setSelectedApp}
                onMove={handleMove}
              />
            ))}
          </div>
        )}
      </main>

      {/* ═══ BOTTOM STATS BAR (mobile) ═══ */}
      <footer className="shrink-0 sm:hidden bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center px-4 py-2 gap-4">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{stats.rate}%</span>
          <span className="text-xs text-zinc-400">conversion</span>
        </div>
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{stats.accepted}</span>
          <span className="text-xs text-zinc-400">enrolled</span>
        </div>
        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex items-center gap-1.5">
          <Hourglass className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{stats.pending}</span>
          <span className="text-xs text-zinc-400">pending</span>
        </div>
      </footer>

      {/* ═══ DETAIL SHEET ═══ */}
      {selectedApp && (
        <DetailSheet
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onMove={handleMove}
        />
      )}
    </div>
  );
}
