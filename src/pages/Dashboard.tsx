import { useMemo } from "react";
import { useAuth } from "@/hooks/AuthProvider";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar, FileText, Sparkles, Video,
  TrendingUp, Clock, ArrowRight, MessageSquare,
  Users, HeartPulse, ShieldCheck, Heart,
  Activity, UserCheck, Bot, CalendarDays,
  DollarSign, CheckCircle2, AlertCircle, MapPin,
  ExternalLink, Layers, GraduationCap, Settings,
  Award, HelpCircle, FileCheck, PhoneCall
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate, Link } from "react-router";
import { toast } from "sonner";
import type { Id } from "../../convex/_generated/dataModel";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const announcements = useQuery(api.announcements.getAnnouncements);
  const upcomingEvents = useQuery(api.events.getUpcomingEvents);
  const unreadCount = useQuery(api.notifications.getUnreadCount);

  // Appointments & CRM Queries
  const recentBookings = useQuery(api.bookings.getBookings, { status: undefined });
  const updateBookingStatus = useMutation(api.bookings.updateBookingStatus);
  const seedSampleBookings = useMutation(api.bookings.seedSampleBookings);

  // Derive stats safely from recentBookings
  const appointmentStats = useMemo(() => {
    if (!recentBookings) return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, estimatedRevenue: 0 };
    const total = recentBookings.length;
    const pending = recentBookings.filter((b) => b.status === "pending").length;
    const confirmed = recentBookings.filter((b) => b.status === "confirmed").length;
    const completed = recentBookings.filter((b) => b.status === "completed").length;
    const cancelled = recentBookings.filter((b) => b.status === "cancelled").length;

    let estimatedRevenue = 0;
    for (const b of recentBookings) {
      if (b.status !== "cancelled" && b.rate) {
        const num = parseInt(b.rate.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(num)) estimatedRevenue += num;
      }
    }
    return { total, pending, confirmed, completed, cancelled, estimatedRevenue };
  }, [recentBookings]);

  const isClient = user?.role === "student";
  const isPractitioner = user?.role === "teacher" || user?.role === "admin";

  const handleStatusChange = async (bookingId: Id<"bookings">, status: "confirmed" | "pending" | "completed" | "cancelled") => {
    try {
      await updateBookingStatus({ bookingId, status });
      toast.success(`Appointment status set to ${status.toUpperCase()}`);
    } catch (e: any) {
      toast.error("Failed to update appointment status.");
    }
  };

  const handleSeedData = async () => {
    try {
      const res = await seedSampleBookings();
      if (res.seeded) {
        toast.success(`Seeded ${res.count} sample appointments!`);
      } else {
        toast.info(`Practice CRM has ${res.count} appointment records.`);
      }
    } catch (e: any) {
      toast.error("Failed to seed sample appointments.");
    }
  };

  // Comprehensive System Navigation Hub (All Pages)
  const systemNavigationCategories = [
    {
      category: "Clinical Care & Appointments",
      items: [
        { label: "Appointments CRM", path: "/appointments", icon: Calendar, desc: "Manage bookings & intake queue", color: "text-emerald-500 bg-emerald-500/10" },
        { label: "Session Schedule", path: "/events", icon: CalendarDays, desc: "Google Calendar & events", color: "text-amber-500 bg-amber-500/10" },
        { label: "Client Intake Queue", path: "/admin/applications", icon: FileText, desc: "Review incoming client forms", color: "text-blue-500 bg-blue-500/10" },
        { label: "Practice Analytics", path: "/analytics", icon: TrendingUp, desc: "Caseload & financial insights", color: "text-purple-500 bg-purple-500/10" },
      ],
    },
    {
      category: "Telehealth & Sessions",
      items: [
        { label: "Telehealth Video Lobby", path: "/therapy-lobby/room-live", icon: Video, desc: "Join 256-bit encrypted room", color: "text-rose-500 bg-rose-500/10" },
        { label: "Group Live Workshops", path: "/lives", icon: Users, desc: "Interactive group sessions", color: "text-teal-500 bg-teal-500/10" },
        { label: "Clinical Whiteboard", path: "/whiteboard", icon: Activity, desc: "Somatic & therapeutic canvas", color: "text-sky-500 bg-sky-500/10" },
        { label: "AI Companion", path: "/study-buddy", icon: Bot, desc: "24/7 AI wellness sanctuary", color: "text-[#156e52] bg-emerald-500/10" },
      ],
    },
    {
      category: "Directory & Practice Management",
      items: [
        { label: "Client Directory", path: "/users/students", icon: UserCheck, desc: "Manage client caseloads", color: "text-indigo-500 bg-indigo-500/10" },
        { label: "Practitioners & Coaches", path: "/users/teachers", icon: Users, desc: "Psychologists & life coaches", color: "text-amber-600 bg-amber-500/10" },
        { label: "POPIA Roles & Access", path: "/settings/roles", icon: ShieldCheck, desc: "Team rights & HPCSA credentials", color: "text-[#156e52] bg-emerald-500/10" },
        { label: "Practice Settings", path: "/settings/general", icon: Settings, desc: "Identity & hotline numbers", color: "text-zinc-500 bg-zinc-500/10" },
      ],
    },
    {
      category: "Learning & Clinical Resources",
      items: [
        { label: "Clinical Files & Library", path: "/resources", icon: Heart, desc: "Therapeutic materials & worksheets", color: "text-rose-500 bg-rose-500/10" },
        { label: "AI Homework & Studio", path: "/ai/homework", icon: Sparkles, desc: "Worksheets & homework tools", color: "text-amber-500 bg-amber-500/10" },
        { label: "Blog & Publications", path: "/admin/blogs", icon: FileCheck, desc: "Publish practice articles", color: "text-blue-500 bg-blue-500/10" },
        { label: "Recognitions & Badges", path: "/badges", icon: Award, desc: "Client milestone badges", color: "text-purple-500 bg-purple-500/10" },
      ],
    },
  ];

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 bg-white dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Insight Works Clinical Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {isClient ? "Client Wellness Portal" : isPractitioner ? "Clinical Practice Dashboard & CRM" : "Practice Dashboard"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user?.name || "Maletsatsi"} · Live practice metrics, brief appointments, and system directory.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/appointments"
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium text-xs px-4 py-2 rounded-lg shadow-xs transition-all cursor-pointer border border-transparent h-9"
          >
            <Calendar className="w-3.5 h-3.5" />
            Appointments CRM
          </Link>

          <Link
            to="/therapy-lobby/room-live"
            className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs px-3.5 py-2 rounded-lg transition-all cursor-pointer h-9"
          >
            <Video className="w-3.5 h-3.5 text-rose-500" />
            Join Telehealth Room
          </Link>
        </div>
      </div>

      {/* Top Stat Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Appointments</span>
              <Calendar className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {appointmentStats?.total || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Pending Intake</span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-amber-600 dark:text-amber-400">
              {appointmentStats?.pending || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Confirmed Upcoming</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
              {appointmentStats?.confirmed || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Completed Sessions</span>
              <UserCheck className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-blue-600 dark:text-blue-400">
              {appointmentStats?.completed || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs col-span-2 lg:col-span-1">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Est. Practice Value</span>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              R{(appointmentStats?.estimatedRevenue || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ─── APPOINTMENTS & CRM BRIEF SECTION ─────────────────────────────────── */}
      <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Recent Appointments & Brief Notes
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Live snapshot of client appointments, pending intake requests, and session details.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => navigate("/appointments")}
              className="text-xs font-medium bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg h-8 gap-1.5 cursor-pointer"
            >
              Open Full CRM <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {!recentBookings ? (
            <div className="p-8 text-center text-xs text-zinc-500 animate-pulse">Loading appointments...</div>
          ) : recentBookings.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Calendar className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-xs text-zinc-500">No appointments logged yet.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono font-medium uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Service & Modality</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4">Brief Notes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {recentBookings.slice(0, 5).map((b) => {
                  const isTelehealth = b.format.toLowerCase().includes("telehealth") || b.format.toLowerCase().includes("video");
                  return (
                    <tr key={b._id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                      <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        <div>
                          <p>{b.clientName}</p>
                          <p className="text-[10px] text-zinc-400 font-mono font-normal">{b.clientPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{b.serviceType}</p>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1">
                          {isTelehealth ? <Video className="w-3 h-3 text-emerald-500" /> : <MapPin className="w-3 h-3 text-amber-500" />}
                          {b.format}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">{b.date}</p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{b.timeSlot}</p>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">{b.rate}</td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-zinc-600 dark:text-zinc-300 line-clamp-1 text-[11px]">
                          {b.notes || "No intake notes."}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                            b.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                              : b.status === "pending"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                              : b.status === "completed"
                              ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                              : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                          }`}
                        >
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {b.status === "pending" ? (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(b._id, "confirmed")}
                            className="h-6 text-[10px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded px-2 cursor-pointer"
                          >
                            Approve
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate("/appointments")}
                            className="h-6 text-[10px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                          >
                            View
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* ─── ALL PAGES SYSTEM DIRECTORY & QUICK NAVIGATION HUB ───────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Practice Systems & All Pages Hub
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Direct access to all modules, clinical tools, user directories, and system settings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemNavigationCategories.map((cat, idx) => (
            <Card key={idx} className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 shadow-xs">
              <CardHeader className="p-3.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/80">
                <CardTitle className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {cat.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {cat.items.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn("w-7 h-7 rounded-md flex items-center justify-center shrink-0", item.color)}>
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-all" />
                  </button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
