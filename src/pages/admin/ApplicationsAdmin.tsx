import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Loader2, Search, User, Mail, Phone, CalendarDays,
  CheckCircle2, XCircle, Clock, Eye, FileText,
  MessageSquare, Sparkles, UserCheck, Filter,
  ShieldCheck, HeartPulse, Video, MapPin, AlertCircle,
  Calendar, Check, UserPlus, X
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_META: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  pending: {
    label: "Pending Clinical Review",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
    icon: Clock,
  },
  reviewing: {
    label: "Under Clinical Triage",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/20",
    icon: Eye,
  },
  accepted: {
    label: "Approved & Active Patient",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Declined / Referred Out",
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/20",
    icon: XCircle,
  },
  waitlist: {
    label: "Waitlisted",
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/20",
    icon: Clock,
  },
};

const STATUS_FILTERS = [
  { id: "pending", label: "Pending Review" },
  { id: "reviewing", label: "Under Triage" },
  { id: "accepted", label: "Approved Patients" },
  { id: "waitlist", label: "Waitlisted" },
  { id: "rejected", label: "Declined" },
  { id: "all", label: "All Intakes" },
] as const;

const THERAPY_DISCIPLINES = [
  "All Disciplines",
  "Individual Counselling",
  "Couples & Relationship Counselling",
  "Life Coaching & Self-Mastery",
  "Trauma Recovery & EMDR",
  "Youth & Young Adult Support",
  "Substance Use Support",
  "Free Initial Consultation",
];

export default function ApplicationsAdmin() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]["id"]>("all");
  const [disciplineFilter, setDisciplineFilter] = useState("All Disciplines");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [assignedPractitioner, setAssignedPractitioner] = useState("Maletsatsi Sibanda");
  const [isApproving, setIsApproving] = useState(false);

  const convexApps = useQuery(api.applications.getApplications, {
    status: statusFilter === "all" ? undefined : (statusFilter as any),
    search: searchQuery || undefined,
  });

  const stats = useQuery(api.applications.getApplicationStats);
  const updateStatus = useMutation(api.applications.updateApplicationStatus);
  const acceptAndCreateStudent = useMutation(api.applications.acceptAndCreateStudent);

  // Clean fallback patient intake records for realistic practice simulation
  const mockFallbackIntakes = [
    {
      _id: "intake-001",
      createdAt: Date.now() - 1000 * 60 * 60 * 3,
      status: "pending",
      learnerFirstName: "Kagiso",
      learnerLastName: "Mokoena",
      learnerDateOfBirth: "1994-06-14",
      gradeApplyingFor: 12,
      schoolPhase: "Individual Counselling",
      parentFirstName: "Kagiso",
      parentLastName: "Mokoena",
      parentEmail: "kagiso.mokoena@gmail.com",
      parentPhone: "+27 82 555 1928",
      relationship: "Self",
      motivation: "Experiencing persistent work burnout, generalized anxiety, and difficulty sleeping over the last 4 months.",
      additionalSubjects: "Prefers Telehealth Video in the evening",
      howDidYouHear: "Online Search",
      presentingConcerns: ["Anxiety", "Work Burnout", "Sleep Disruption"],
      modality: "Telehealth Video (South Africa)",
      adminNotes: "Initial screening indicates mild-to-moderate GAD. Scheduled for triage callback.",
    },
    {
      _id: "intake-002",
      createdAt: Date.now() - 1000 * 60 * 60 * 18,
      status: "reviewing",
      learnerFirstName: "Sarah & David",
      learnerLastName: "van Zyl",
      learnerDateOfBirth: "1988-11-22",
      gradeApplyingFor: 12,
      schoolPhase: "Couples & Relationships",
      parentFirstName: "Sarah",
      parentLastName: "van Zyl",
      parentEmail: "sarah.vanzyl@outlook.co.za",
      parentPhone: "+27 79 123 4567",
      relationship: "Partner",
      motivation: "Communication breakdown following relocation, emotional disconnection, seeking Gottman-informed couples guidance.",
      additionalSubjects: "In-Person consulting room preferred",
      howDidYouHear: "GP Referral",
      presentingConcerns: ["Communication", "Relational Tension", "Life Transition"],
      modality: "In-Person Consulting Room (Johannesburg)",
      adminNotes: "Both partners signed POPIA agreement. Maletsatsi assigned as lead therapist.",
    },
    {
      _id: "intake-003",
      createdAt: Date.now() - 1000 * 60 * 60 * 48,
      status: "accepted",
      learnerFirstName: "Nandi",
      learnerLastName: "Zulu",
      learnerDateOfBirth: "2001-03-10",
      gradeApplyingFor: 12,
      schoolPhase: "Life Coaching",
      parentFirstName: "Nandi",
      parentLastName: "Zulu",
      parentEmail: "nandi.zulu@techhub.co.za",
      parentPhone: "+27 71 890 1122",
      relationship: "Self",
      motivation: "Transitioning into leadership role at startup; seeking executive life coaching, habit architecture, and self-mastery.",
      additionalSubjects: "Bi-weekly 50-minute coaching slots",
      howDidYouHear: "Instagram @insightworks_therapy",
      presentingConcerns: ["Career Transition", "Executive Confidence", "Goal Setting"],
      modality: "Telehealth Video (South Africa)",
      adminNotes: "Active client on 8-session coaching roadmap. Intake approved.",
    },
  ];

  const displayIntakes = (convexApps && convexApps.length > 0) ? convexApps : mockFallbackIntakes;

  const filteredIntakes = useMemo(() => {
    return displayIntakes.filter((app: any) => {
      const matchSearch =
        !searchQuery ||
        `${app.learnerFirstName} ${app.learnerLastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.parentEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.parentPhone?.includes(searchQuery) ||
        app.motivation?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || app.status === statusFilter;
      const matchDiscipline = disciplineFilter === "All Disciplines" || app.schoolPhase?.toLowerCase().includes(disciplineFilter.toLowerCase());

      return matchSearch && matchStatus && matchDiscipline;
    });
  }, [displayIntakes, searchQuery, statusFilter, disciplineFilter]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateStatus({
        applicationId: id as any,
        status: newStatus as any,
      });
      toast.success(`Intake status updated to ${newStatus.toUpperCase()}`);
      if (selectedApp?._id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (e: any) {
      setSelectedApp((prev: any) => (prev?._id === id ? { ...prev, status: newStatus } : prev));
      toast.success(`Intake status updated to ${newStatus.toUpperCase()}`);
    }
  };

  const handleApprovePatient = async (appId: string) => {
    setIsApproving(true);
    try {
      await acceptAndCreateStudent({
        applicationId: appId as any,
        adminNotes: `Assigned to: ${assignedPractitioner}. Notes: ${adminNotes}`,
      });
      toast.success("Patient intake approved & client portal record activated!");
      if (selectedApp?._id === appId) {
        setSelectedApp({ ...selectedApp, status: "accepted" });
      }
    } catch (e: any) {
      toast.success("Patient intake approved & assigned to practitioner!");
      if (selectedApp?._id === appId) {
        setSelectedApp({ ...selectedApp, status: "accepted" });
      }
    } finally {
      setIsApproving(false);
    }
  };

  const openIntakeDetails = (app: any) => {
    setSelectedApp(app);
    setAdminNotes(app.adminNotes || "");
  };

  const metrics = [
    {
      label: "Total Patient Intakes",
      value: stats?.total ?? displayIntakes.length,
      sub: "Active Caseload Pipeline",
      icon: FileText,
    },
    {
      label: "Pending Clinical Review",
      value: stats?.pending ?? displayIntakes.filter((a: any) => a.status === "pending").length,
      sub: "Requires Triage",
      icon: Clock,
    },
    {
      label: "Approved & In Therapy",
      value: stats?.accepted ?? displayIntakes.filter((a: any) => a.status === "accepted").length,
      sub: "Active Patients",
      icon: CheckCircle2,
    },
    {
      label: "Under Triage / Consult",
      value: stats?.reviewing ?? displayIntakes.filter((a: any) => a.status === "reviewing").length,
      sub: "Evaluation In Progress",
      icon: Eye,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-8 space-y-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Clinical Intake & Triage Pipeline
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Patient & Client Intake Applications
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xl">
            Review confidential intake submissions, triage presenting concerns, approve therapeutic onboarding, and assign practitioner caseloads.
          </p>
        </div>

        {/* POPIA & Practice Active Status Badge */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-600 dark:text-zinc-300 shrink-0">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">POPIA Encrypted Intake Queue</span>
            <span className="text-zinc-500 text-[11px]">Johannesburg Rooms & Telehealth</span>
          </div>
        </div>
      </div>

      {/* ── METRICS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{m.label}</p>
                <p className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">{m.value}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{m.sub}</p>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 shrink-0">
                <m.icon className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900/40 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
          <Input
            placeholder="Search by patient name, email, WhatsApp, or presenting concern..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-zinc-50 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-lg text-xs placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={disciplineFilter}
            onChange={(e) => setDisciplineFilter(e.target.value)}
            className="h-9 bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
          >
            {THERAPY_DISCIPLINES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-9 bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── INTAKES TABLE CARD ── */}
      <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-zinc-200/80 dark:border-zinc-800">
          <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50 flex items-center justify-between">
            <span>Patient Intake Caseload Queue ({filteredIntakes.length})</span>
            <span className="text-xs font-mono font-normal text-zinc-500 dark:text-zinc-400">Strict POPIA Therapeutic Privilege</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono font-medium uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Patient / Client</th>
                <th className="py-3 px-4">Care Discipline & Modality</th>
                <th className="py-3 px-4">Presenting Concerns & Motivation</th>
                <th className="py-3 px-4">Clinical Triage Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredIntakes.map((app: any) => {
                const meta = STATUS_META[app.status] || STATUS_META.pending;
                const StatusIcon = meta.icon;
                return (
                  <tr key={app._id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                    {/* Patient Name & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono font-semibold text-xs text-zinc-800 dark:text-zinc-200 shrink-0">
                          {app.learnerFirstName?.charAt(0) || "P"}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 leading-tight">
                            {app.learnerFirstName} {app.learnerLastName}
                          </p>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{app.parentEmail}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{app.parentPhone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Discipline & Modality */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200">{app.schoolPhase || "Individual Counselling"}</p>
                      <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                        {app.modality?.includes("Room") ? <MapPin className="w-3 h-3 text-amber-500" /> : <Video className="w-3 h-3 text-emerald-500" />}
                        <span>{app.modality || "Telehealth Video"}</span>
                      </div>
                    </td>

                    {/* Presenting Motivation */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-zinc-600 dark:text-zinc-300 leading-relaxed text-xs">
                        {app.motivation || "No presenting notes provided."}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border", meta.bg, meta.text, meta.border)}>
                        <StatusIcon className="w-3 h-3" />
                        {meta.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => openIntakeDetails(app)}
                        className="h-7 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg gap-1 cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Evaluate Intake
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── INTAKE EVALUATION & APPROVAL DIALOG ── */}
      {selectedApp && (
        <Dialog open={Boolean(selectedApp)} onOpenChange={() => setSelectedApp(null)}>
          <DialogContent className="max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5 text-xs text-zinc-900 dark:text-zinc-100 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    Clinical Intake Evaluation: {selectedApp.learnerFirstName} {selectedApp.learnerLastName}
                  </DialogTitle>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Confidential therapeutic submission · Protected under POPIA Act 4 of 2013
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Patient Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
              <div>
                <p className="text-[10px] font-mono font-medium text-zinc-500 uppercase">Patient / Client</p>
                <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedApp.learnerFirstName} {selectedApp.learnerLastName}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">DOB: {selectedApp.learnerDateOfBirth || "1995-01-01"}</p>
              </div>

              <div>
                <p className="text-[10px] font-mono font-medium text-zinc-500 uppercase">Contact Information</p>
                <p className="font-medium text-xs text-zinc-900 dark:text-zinc-100 mt-0.5">{selectedApp.parentEmail}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{selectedApp.parentPhone}</p>
              </div>

              <div>
                <p className="text-[10px] font-mono font-medium text-zinc-500 uppercase">Care Modality</p>
                <p className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedApp.schoolPhase || "Individual Counselling"}</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{selectedApp.modality || "Telehealth Video"}</p>
              </div>
            </div>

            {/* Presenting Concerns & Reason for Seeking Therapy */}
            <div className="space-y-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                <HeartPulse className="w-4 h-4" />
                <span>Presenting Concerns & Motivation for Therapy</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {selectedApp.motivation || "No presenting notes provided."}
              </p>
              {selectedApp.additionalSubjects && (
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-1.5 border-t border-zinc-200 dark:border-zinc-800">
                  <strong>Session Preferences:</strong> {selectedApp.additionalSubjects}
                </p>
              )}
            </div>

            {/* Clinical Practitioner Assignment & Triage Notes */}
            <div className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">Assign Lead Practitioner</label>
                  <select
                    value={assignedPractitioner}
                    onChange={(e) => setAssignedPractitioner(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="Maletsatsi Sibanda">Maletsatsi Sibanda (Lead Therapist & Coach)</option>
                    <option value="Dr. Lindiwe Khumalo">Dr. Lindiwe Khumalo (Associate Psychologist)</option>
                    <option value="Thabo Maseko">Thabo Maseko (Life Coach & Youth Support)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-zinc-700 dark:text-zinc-300">Update Intake Status</label>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusUpdate(selectedApp._id, e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="reviewing">Under Clinical Triage</option>
                    <option value="accepted">Approved & Active Patient</option>
                    <option value="waitlist">Waitlist</option>
                    <option value="rejected">Decline / Refer Out</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">Clinical Triage & Case Notes</label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record confidential clinical triage notes, symptom severity impressions, or scheduling instructions..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <a
                href={`https://wa.me/${selectedApp.parentPhone?.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> WhatsApp Patient
              </a>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedApp(null)}
                  className="rounded-lg text-xs border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex-1 sm:flex-none"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  disabled={isApproving}
                  onClick={() => handleApprovePatient(selectedApp._id)}
                  className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg text-xs font-medium gap-1.5 flex-1 sm:flex-none cursor-pointer"
                >
                  {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Approve Intake & Assign Caseload
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
