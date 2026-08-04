import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Inbox,
  Search,
  User,
  Mail,
  Phone,
  CalendarDays,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  RefreshCw,
  Sparkles,
  School,
  UserCheck,
  Building2,
  Filter,
  Check,
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
    label: "Pending Review",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: Clock,
  },
  reviewing: {
    label: "Under Review",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/30",
    icon: Eye,
  },
  accepted: {
    label: "Accepted & Enrolled",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Declined",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
    icon: XCircle,
  },
  waitlist: {
    label: "Waitlisted",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
    icon: Clock,
  },
};

const STATUS_FILTERS = [
  { id: "pending", label: "Pending" },
  { id: "reviewing", label: "Reviewing" },
  { id: "accepted", label: "Accepted" },
  { id: "waitlist", label: "Waitlist" },
  { id: "rejected", label: "Declined" },
  { id: "all", label: "All Applications" },
] as const;

export default function ApplicationsAdmin() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]["id"]>("pending");
  const [gradeFilter, setGradeFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [isEnrolling, setIsEnrolling] = useState(false);

  const apps = useQuery(api.applications.getApplications, {
    status: statusFilter === "all" ? undefined : (statusFilter as any),
    grade: gradeFilter === "all" ? undefined : gradeFilter,
    search: searchQuery || undefined,
  });

  const stats = useQuery(api.applications.getApplicationStats);
  const classes = useQuery(api.classes.getClasses);
  const updateStatus = useMutation(api.applications.updateApplicationStatus);
  const acceptAndCreateStudent = useMutation(
    api.applications.acceptAndCreateStudent
  );

  const isAdmin = user?.role === "admin" || user?.role === "teacher";

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-8">
        <div className="text-center space-y-3 bg-[#0a0608] border border-white/10 rounded-2xl p-8 max-w-md">
          <Building2 className="h-12 w-12 text-[#9f1239] mx-auto" />
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Access Restricted
          </h2>
          <p className="text-[#888] text-sm">
            Only authorized Glenanda Learning Centre administrative staff and educators can manage admissions.
          </p>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateStatus({
        applicationId: id as any,
        status: newStatus as any,
      });
      toast.success(`Application marked as ${newStatus}`);
      if (selectedApp?._id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to update status");
    }
  };

  const handleAcceptAndEnrol = async (appId: string) => {
    setIsEnrolling(true);
    try {
      await acceptAndCreateStudent({
        applicationId: appId as any,
        adminNotes: adminNotes || undefined,
      });
      toast.success(
        "Application accepted & learner account created successfully!"
      );
      if (selectedApp?._id === appId) {
        setSelectedApp({ ...selectedApp, status: "accepted" });
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to enrol student");
    } finally {
      setIsEnrolling(false);
    }
  };

  const openAppDetails = (app: any) => {
    setSelectedApp(app);
    setAdminNotes(app.adminNotes || "");
  };

  const metrics = [
    {
      label: "Total Applications",
      value: stats?.total ?? 0,
      sub: "2026 Academic Year",
      color: "text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      label: "Pending Review",
      value: stats?.pending ?? 0,
      sub: "Action required",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Accepted & Enrolled",
      value: stats?.accepted ?? 0,
      sub: "Confirmed seats",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Waitlisted",
      value: stats?.waitlist ?? 0,
      sub: "Under consideration",
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div
      className="space-y-8 p-1 sm:p-4 text-white"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#9f1239]" />
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: "#e2a0b0" }}
            >
              Admissions & Enrolments
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-black text-white tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Learner <span className="italic text-[#38bdf8]">Applications</span>
          </h1>
          <p className="text-[#888] text-sm mt-1 max-w-xl">
            Review, evaluate, and manage home schooling enrolment applications for Glenanda Learning Centre.
          </p>
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-3 bg-[#0a0608] border border-white/10 px-4 py-2.5 rounded-xl self-start lg:self-auto">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-[#ccc]">
            2026 Academic Year Admissions Open
          </span>
        </div>
      </div>

      {/* ── METRICS GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={cn(
              "rounded-2xl p-5 border backdrop-blur-xl transition-transform hover:scale-[1.02]",
              m.bg
            )}
          >
            <p className="text-xs font-bold text-[#888] uppercase tracking-wider">
              {m.label}
            </p>
            <p
              className={cn("text-3xl font-black mt-2", m.color)}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {m.value}
            </p>
            <p className="text-[11px] text-[#666] mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* ── FILTERS & SEARCH BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0608] border border-white/10 p-4 rounded-2xl">
        {/* Status Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0",
                statusFilter === f.id
                  ? "bg-[#9f1239] text-white border-[#9f1239] shadow-lg shadow-[#9f1239]/30"
                  : "bg-white/[0.02] border-white/10 text-[#888] hover:text-white hover:border-white/20"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grade Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Grade Dropdown */}
          <select
            value={gradeFilter}
            onChange={(e) =>
              setGradeFilter(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium text-[#ccc] focus:outline-none focus:border-[#38bdf8] w-full sm:w-auto"
          >
            <option value="all" className="bg-[#0a0608] text-white">
              All Grades
            </option>
            <option value="0" className="bg-[#0a0608] text-white">
              Grade R (Pre-Primary)
            </option>
            {[...Array(12)].map((_, i) => (
              <option
                key={i + 1}
                value={i + 1}
                className="bg-[#0a0608] text-white"
              >
                Grade {i + 1}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applicant name, email..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#38bdf8]"
            />
          </div>
        </div>
      </div>

      {/* ── APPLICATIONS TABLE / LIST ── */}
      {apps === undefined ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3 bg-[#0a0608] border border-white/10 rounded-2xl">
          <Loader2 className="h-8 w-8 animate-spin text-[#38bdf8]" />
          <p className="text-[#888] text-xs">Loading enrolment applications...</p>
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center p-16 bg-[#0a0608] border border-white/10 rounded-2xl space-y-3">
          <Inbox className="h-12 w-12 text-[#444] mx-auto" />
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            No Applications Found
          </h3>
          <p className="text-[#666] text-xs max-w-sm mx-auto">
            {statusFilter !== "all"
              ? `There are currently no applications marked as "${statusFilter}".`
              : "No online enrolment applications have been submitted yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0a0608] shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-[#888]">
                  <th className="p-4">App ID</th>
                  <th className="p-4">Learner Name</th>
                  <th className="p-4">Grade & Phase</th>
                  <th className="p-4">Parent / Guardian</th>
                  <th className="p-4">Received Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-xs">
                {apps.map((app: any) => {
                  const statusInfo =
                    STATUS_META[app.status] || STATUS_META.pending;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* App ID */}
                      <td className="p-4 font-mono font-bold text-[#38bdf8]">
                        {app.applicationNumber || "GSLC-2026"}
                      </td>

                      {/* Learner */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#5c061c] to-[#9f1239] flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {app.learnerFirstName?.[0]}
                            {app.learnerLastName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-white">
                              {app.learnerFirstName} {app.learnerLastName}
                            </p>
                            <p className="text-[11px] text-[#666]">
                              DOB: {app.learnerDateOfBirth || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Grade & Phase */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-white font-bold text-[11px]">
                            Grade {app.gradeApplyingFor === 0 ? "R" : app.gradeApplyingFor}
                          </span>
                          <span className="text-[10px] text-[#888]">
                            {app.schoolPhase || "CAPS"}
                          </span>
                        </div>
                      </td>

                      {/* Parent */}
                      <td className="p-4">
                        <p className="font-medium text-white">
                          {app.parentFirstName} {app.parentLastName}
                        </p>
                        <p className="text-[11px] text-[#888]">{app.parentEmail}</p>
                        <p className="text-[11px] text-[#666]">{app.parentPhone}</p>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-[#888]">
                        {new Date(app.createdAt).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border",
                            statusInfo.bg,
                            statusInfo.text,
                            statusInfo.border
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          onClick={() => openAppDetails(app)}
                          className="bg-white/[0.05] hover:bg-[#9f1239] text-white border border-white/10 hover:border-[#9f1239] transition-all text-xs font-bold gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── APPLICATION DETAILS MODAL ── */}
      <Dialog
        open={!!selectedApp}
        onOpenChange={(o) => !o && setSelectedApp(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0608] border border-white/10 text-white">
          {selectedApp && (
            <div className="space-y-6">
              {/* Dialog Header */}
              <DialogHeader className="border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#38bdf8]" />
                    <DialogTitle
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Application {selectedApp.applicationNumber}
                    </DialogTitle>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border",
                      STATUS_META[selectedApp.status]?.bg,
                      STATUS_META[selectedApp.status]?.text,
                      STATUS_META[selectedApp.status]?.border
                    )}
                  >
                    {STATUS_META[selectedApp.status]?.label}
                  </span>
                </div>
              </DialogHeader>

              {/* Status Action Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-[#888] uppercase tracking-wider">
                  Update Application Status
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={isEnrolling}
                    onClick={() => handleAcceptAndEnrol(selectedApp._id)}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-xs gap-1.5 hover:shadow-lg hover:shadow-emerald-600/30"
                  >
                    {isEnrolling ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <UserCheck className="h-3.5 w-3.5" />
                    )}
                    Accept & Enrol Learner
                  </Button>

                  {[
                    { id: "reviewing", label: "Mark Reviewing", icon: Eye },
                    { id: "waitlist", label: "Waitlist", icon: Clock },
                    { id: "rejected", label: "Decline", icon: XCircle },
                  ].map((st) => (
                    <Button
                      key={st.id}
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleStatusUpdate(selectedApp._id, st.id)
                      }
                      className={cn(
                        "bg-white/[0.03] border-white/10 text-xs font-semibold hover:bg-white/[0.08] text-white gap-1.5",
                        selectedApp.status === st.id && "border-[#38bdf8] text-[#38bdf8]"
                      )}
                    >
                      <st.icon className="h-3.5 w-3.5" />
                      {st.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Learner & Parent Profile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <DetailBox
                  icon={User}
                  label="Learner Full Name"
                  value={`${selectedApp.learnerFirstName} ${selectedApp.learnerLastName}`}
                />
                <DetailBox
                  icon={CalendarDays}
                  label="Date of Birth"
                  value={selectedApp.learnerDateOfBirth || "Not specified"}
                />
                <DetailBox
                  icon={GraduationCap}
                  label="Grade Applying For"
                  value={
                    selectedApp.gradeApplyingFor === 0
                      ? "Grade R (Pre-Primary)"
                      : `Grade ${selectedApp.gradeApplyingFor}`
                  }
                />
                <DetailBox
                  icon={School}
                  label="School Phase"
                  value={selectedApp.schoolPhase || "CAPS Aligned"}
                />
                <DetailBox
                  icon={User}
                  label="Parent / Guardian Name"
                  value={`${selectedApp.parentFirstName} ${selectedApp.parentLastName}`}
                />
                <DetailBox
                  icon={Mail}
                  label="Parent Email"
                  value={selectedApp.parentEmail}
                />
                <DetailBox
                  icon={Phone}
                  label="Parent Phone"
                  value={selectedApp.parentPhone}
                />
                <DetailBox
                  icon={FileText}
                  label="Home Language"
                  value={selectedApp.homeLanguage || "English"}
                />
                <DetailBox
                  icon={Building2}
                  label="Previous / Current School"
                  value={selectedApp.currentSchool || "Not specified"}
                />
                <DetailBox
                  icon={Sparkles}
                  label="How They Found Us"
                  value={selectedApp.howDidYouHear || "Website / Referral"}
                />
              </div>

              {/* Motivation Section */}
              {selectedApp.motivation && (
                <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4 space-y-1.5">
                  <p className="text-xs font-bold text-[#38bdf8] flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Parent Motivation Statement
                  </p>
                  <p className="text-xs text-[#ccc] leading-relaxed italic">
                    "{selectedApp.motivation}"
                  </p>
                </div>
              )}

              {/* Admin Internal Notes */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-bold text-[#888] uppercase tracking-wider block">
                  Internal Administrative Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record interview observations, document checks, or approval notes..."
                  className="w-full min-h-[90px] rounded-xl bg-white/[0.04] border border-white/10 p-3 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#38bdf8]"
                />
                <Button
                  size="sm"
                  onClick={async () => {
                    try {
                      await updateStatus({
                        applicationId: selectedApp._id,
                        status: selectedApp.status,
                        adminNotes,
                      });
                      toast.success("Admin notes saved successfully!");
                      setSelectedApp({ ...selectedApp, adminNotes });
                    } catch (e: any) {
                      toast.error(e?.message || "Failed to save notes");
                    }
                  }}
                  className="bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 text-xs font-bold gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Save Internal Notes
                </Button>
              </div>

              <div className="pt-2 text-[11px] text-[#666] flex justify-between">
                <span>
                  Submitted: {new Date(selectedApp.createdAt).toLocaleString()}
                </span>
                {selectedApp.reviewedAt && (
                  <span>
                    Last Reviewed:{" "}
                    {new Date(selectedApp.reviewedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailBox({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] border border-white/10 p-3">
      <Icon className="h-4 w-4 text-[#38bdf8] shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-[#888] uppercase">{label}</p>
        <p className="font-semibold text-white truncate">{value}</p>
      </div>
    </div>
  );
}
