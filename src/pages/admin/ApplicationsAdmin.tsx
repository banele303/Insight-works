import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-amber-500/15 text-amber-500 border-amber-500/30" },
  reviewing: { label: "Reviewing", cls: "bg-blue-500/15 text-blue-500 border-blue-500/30" },
  accepted: { label: "Accepted", cls: "bg-green-500/15 text-green-500 border-green-500/30" },
  rejected: { label: "Rejected", cls: "bg-red-500/15 text-red-500 border-red-500/30" },
  waitlist: { label: "Waitlist", cls: "bg-purple-500/15 text-purple-500 border-purple-500/30" },
};

const FILTERS = ["pending", "reviewing", "accepted", "rejected", "waitlist", "all"] as const;

export default function ApplicationsAdmin() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("pending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [notes, setNotes] = useState("");

  const apps = useQuery(api.applications.getApplications, {
    status: filter === "all" ? undefined : filter,
    search: search || undefined,
  });
  const stats = useQuery(api.applications.getApplicationStats);
  const updateStatus = useMutation(api.applications.updateApplicationStatus);

  const isAdmin = user?.role === "admin" || user?.role === "teacher";

  if (!isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground text-lg font-medium">Access Denied: Admin only</p>
      </div>
    );
  }

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateStatus({ applicationId: id as any, status: status as any });
      toast.success(`Application marked as ${status}`);
      if (selected?._id === id) {
        setSelected({ ...selected, status });
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to update application");
    }
  };

  const openDetails = (app: any) => {
    setSelected(app);
    setNotes(app.adminNotes || "");
  };

  const statCards = [
    { label: "Total", value: stats?.total ?? 0, icon: Inbox, cls: "text-blue-500" },
    { label: "Pending", value: stats?.pending ?? 0, icon: Clock, cls: "text-amber-500" },
    { label: "Accepted", value: stats?.accepted ?? 0, icon: CheckCircle2, cls: "text-green-500" },
    { label: "Waitlist", value: stats?.waitlist ?? 0, icon: Eye, cls: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Inbox className="h-8 w-8 text-primary" />
          Enrolment Applications
        </h1>
        <p className="text-muted-foreground mt-1">
          Review, manage and respond to home schooling enrolment applications.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, cls }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("h-11 w-11 rounded-xl bg-muted flex items-center justify-center", cls)}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all border",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or number..."
            className="pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Table */}
      {apps === undefined ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : apps.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Inbox className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="font-semibold">No applications {filter !== "all" ? `with status "${filter}"` : ""}</p>
            <p className="text-sm mt-1">New applications from the website will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-4 font-semibold">Application</th>
                  <th className="p-4 font-semibold">Learner</th>
                  <th className="p-4 font-semibold">Grade</th>
                  <th className="p-4 font-semibold">Parent</th>
                  <th className="p-4 font-semibold">Received</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {apps.map((app: any) => (
                  <tr key={app._id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <p className="font-mono text-xs font-bold text-primary">{app.applicationNumber}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{app.learnerFirstName} {app.learnerLastName}</p>
                      <p className="text-xs text-muted-foreground">DOB: {app.learnerDateOfBirth}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        {app.gradeApplyingFor === 0 ? "R" : app.gradeApplyingFor}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{app.parentFirstName} {app.parentLastName}</p>
                      <p className="text-xs text-muted-foreground">{app.parentEmail}</p>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge className={STATUS_META[app.status]?.cls} variant="outline">
                        {STATUS_META[app.status]?.label || app.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Button size="sm" variant="outline" onClick={() => openDetails(app)}>
                        <Eye className="h-3.5 w-3.5 mr-1.5" /> Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Details dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Application {selected.applicationNumber}
                </DialogTitle>
              </DialogHeader>

              {/* Status actions */}
              <div className="flex flex-wrap gap-2">
                {[
                  { s: "reviewing", label: "Mark Reviewing", icon: Eye },
                  { s: "accepted", label: "Accept", icon: CheckCircle2 },
                  { s: "waitlist", label: "Waitlist", icon: Clock },
                  { s: "rejected", label: "Reject", icon: XCircle },
                ].map(({ s, label, icon: Icon }) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selected.status === s ? "default" : "outline"}
                    onClick={() => handleStatus(selected._id, s)}
                    className="gap-1.5"
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </Button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <DetailRow icon={User} label="Learner" value={`${selected.learnerFirstName} ${selected.learnerLastName}`} />
                <DetailRow icon={CalendarDays} label="Date of Birth" value={selected.learnerDateOfBirth} />
                <DetailRow icon={GraduationCap} label="Grade Applying For" value={selected.gradeApplyingFor === 0 ? "Grade R" : `Grade ${selected.gradeApplyingFor}`} />
                <DetailRow icon={GraduationCap} label="Phase" value={selected.schoolPhase} />
                <DetailRow icon={User} label="Gender" value={selected.learnerGender || "—"} />
                <DetailRow icon={FileText} label="Current School" value={selected.currentSchool || "—"} />
                <DetailRow icon={User} label="Parent" value={`${selected.parentFirstName} ${selected.parentLastName}`} />
                <DetailRow icon={Mail} label="Email" value={selected.parentEmail} />
                <DetailRow icon={Phone} label="Phone" value={selected.parentPhone} />
                <DetailRow icon={FileText} label="Home Language" value={selected.homeLanguage || "—"} />
                <DetailRow icon={FileText} label="How heard" value={selected.howDidYouHear || "—"} />
                <DetailRow icon={FileText} label="Additional subjects" value={selected.additionalSubjects || "—"} />
              </div>

              {selected.motivation && (
                <div className="rounded-xl bg-muted/40 p-4 text-sm">
                  <p className="font-semibold mb-1 flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-primary" /> Motivation
                  </p>
                  <p className="text-muted-foreground leading-relaxed">{selected.motivation}</p>
                </div>
              )}

              {/* Admin notes */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Admin Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes about this applicant..."
                  className="w-full min-h-[90px] rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  size="sm"
                  className="mt-2 gap-1.5"
                  onClick={async () => {
                    try {
                      await updateStatus({
                        applicationId: selected._id,
                        status: selected.status,
                        adminNotes: notes,
                      });
                      toast.success("Notes saved");
                      setSelected({ ...selected, adminNotes: notes });
                    } catch (e: any) {
                      toast.error(e?.message || "Failed to save notes");
                    }
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Save Notes
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Received {new Date(selected.createdAt).toLocaleString()}
                {selected.reviewedAt && <> • Last reviewed {new Date(selected.reviewedAt).toLocaleString()}</>}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-muted/30 p-3">
      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium break-all">{value}</p>
      </div>
    </div>
  );
}
