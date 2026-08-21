import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Plus, Search,
  Filter, Video, MapPin, DollarSign, UserCheck, Phone, Mail, FileText,
  Trash2, Edit3, Sparkles, RefreshCw, Eye, ArrowUpRight, ChevronRight, X
} from "lucide-react";
import { toast } from "sonner";
import type { Id } from "../../convex/_generated/dataModel";

const SERVICE_OPTIONS = [
  "Individual Counselling",
  "Couples & Relationship Counselling",
  "Life Coaching & Self-Mastery",
  "Trauma Recovery & EMDR",
  "Youth & Young Adult Support",
  "Substance Use Support",
  "Free Initial Discovery Consultation",
];

const MODALITY_OPTIONS = [
  "Telehealth Video Session",
  "In-Person Consulting Room",
];

export default function AppointmentsCRM() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [modalityFilter, setModalityFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [selectedNotesBooking, setSelectedNotesBooking] = useState<any | null>(null);

  // Queries & Mutations
  const allBookingsForStats = useQuery(api.bookings.getBookings, {});
  const bookings = useQuery(api.bookings.getBookings, { status: activeTab !== "all" ? activeTab : undefined, search });
  const updateStatus = useMutation(api.bookings.updateBookingStatus);
  const createBooking = useMutation(api.bookings.createBooking);
  const updateDetails = useMutation(api.bookings.updateBookingDetails);
  const deleteBooking = useMutation(api.bookings.deleteBooking);
  const seedSample = useMutation(api.bookings.seedSampleBookings);

  // Compute stats safely from allBookingsForStats
  const stats = useMemo(() => {
    if (!allBookingsForStats) return { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0, telehealthCount: 0, inPersonCount: 0, estimatedRevenue: 0 };
    const total = allBookingsForStats.length;
    const pending = allBookingsForStats.filter((b) => b.status === "pending").length;
    const confirmed = allBookingsForStats.filter((b) => b.status === "confirmed").length;
    const completed = allBookingsForStats.filter((b) => b.status === "completed").length;
    const cancelled = allBookingsForStats.filter((b) => b.status === "cancelled").length;

    const telehealthCount = allBookingsForStats.filter((b) => b.format.toLowerCase().includes("telehealth") || b.format.toLowerCase().includes("video")).length;
    const inPersonCount = total - telehealthCount;

    let estimatedRevenue = 0;
    for (const b of allBookingsForStats) {
      if (b.status !== "cancelled" && b.rate) {
        const num = parseInt(b.rate.replace(/[^0-9]/g, ""), 10);
        if (!isNaN(num)) estimatedRevenue += num;
      }
    }
    return { total, pending, confirmed, completed, cancelled, telehealthCount, inPersonCount, estimatedRevenue };
  }, [allBookingsForStats]);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formService, setFormService] = useState(SERVICE_OPTIONS[0]);
  const [formFormat, setFormFormat] = useState(MODALITY_OPTIONS[0]);
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formTime, setFormTime] = useState("10:00 AM");
  const [formDuration, setFormDuration] = useState("60 min");
  const [formRate, setFormRate] = useState("R850");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<"confirmed" | "pending" | "completed" | "cancelled">("confirmed");

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      if (modalityFilter !== "all") {
        const isTelehealth = b.format.toLowerCase().includes("telehealth") || b.format.toLowerCase().includes("video");
        if (modalityFilter === "telehealth" && !isTelehealth) return false;
        if (modalityFilter === "in-person" && isTelehealth) return false;
      }
      return true;
    });
  }, [bookings, modalityFilter]);

  const handleOpenAdd = () => {
    setEditingBooking(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormService(SERVICE_OPTIONS[0]);
    setFormFormat(MODALITY_OPTIONS[0]);
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormTime("10:00 AM");
    setFormDuration("60 min");
    setFormRate("R850");
    setFormNotes("");
    setFormStatus("confirmed");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBooking(b);
    setFormName(b.clientName);
    setFormEmail(b.clientEmail);
    setFormPhone(b.clientPhone);
    setFormService(b.serviceType);
    setFormFormat(b.format);
    setFormDate(b.date);
    setFormTime(b.timeSlot);
    setFormDuration(b.duration || "60 min");
    setFormRate(b.rate || "R850");
    setFormNotes(b.notes || "");
    setFormStatus(b.status);
    setIsModalOpen(true);
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formDate || !formTime) {
      toast.error("Please fill in client name, email, date, and time slot.");
      return;
    }

    try {
      if (editingBooking) {
        await updateDetails({
          bookingId: editingBooking._id as Id<"bookings">,
          clientName: formName,
          clientEmail: formEmail,
          clientPhone: formPhone,
          serviceType: formService,
          format: formFormat,
          date: formDate,
          timeSlot: formTime,
          duration: formDuration,
          rate: formRate,
          notes: formNotes,
          status: formStatus,
        });
        toast.success(`Appointment for ${formName} updated successfully`);
      } else {
        await createBooking({
          clientName: formName,
          clientEmail: formEmail,
          clientPhone: formPhone,
          serviceType: formService,
          format: formFormat,
          date: formDate,
          timeSlot: formTime,
          duration: formDuration,
          rate: formRate,
          notes: formNotes,
          status: formStatus,
        });
        toast.success(`New appointment scheduled & synced to Google Calendar via Composio AI for ${formName}!`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save appointment.");
    }
  };

  const handleStatusChange = async (bookingId: Id<"bookings">, newStatus: "confirmed" | "pending" | "completed" | "cancelled") => {
    try {
      await updateStatus({ bookingId, status: newStatus });
      toast.success(`Appointment status updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error("Could not update status.");
    }
  };

  const handleDelete = async (bookingId: Id<"bookings">, clientName: string) => {
    if (!confirm(`Are you sure you want to delete the appointment for ${clientName}?`)) return;
    try {
      await deleteBooking({ bookingId });
      toast.success(`Appointment for ${clientName} deleted.`);
    } catch (err: any) {
      toast.error("Failed to delete appointment.");
    }
  };

  const handleSeedData = async () => {
    try {
      const res = await seedSample();
      if (res.seeded) {
        toast.success(`Seeded ${res.count} realistic sample appointments into practice CRM!`);
      } else {
        toast.info(`Practice CRM already has ${res.count} appointment records.`);
      }
    } catch (err: any) {
      toast.error("Failed to seed sample appointments.");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-8 space-y-8 max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 mb-2">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Appointments & Clinical CRM
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Appointments Directory & Intake CRM
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track pending intake requests, manage therapy appointments, review brief notes, and monitor practice revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Google Calendar Synced
          </div>
          <Button
            onClick={handleOpenAdd}
            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium text-xs px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-transparent h-9"
          >
            <Plus className="w-4 h-4" /> Book New Appointment
          </Button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Bookings", value: stats?.total || 0, icon: Calendar, badge: "All" },
          { label: "Pending Intake", value: stats?.pending || 0, icon: AlertCircle, color: "text-amber-600 dark:text-amber-400 font-bold" },
          { label: "Confirmed Sessions", value: stats?.confirmed || 0, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400 font-bold" },
          { label: "Completed", value: stats?.completed || 0, icon: UserCheck, color: "text-blue-600 dark:text-blue-400 font-bold" },
          { label: "Telehealth Ratio", value: stats?.total ? `${Math.round((stats.telehealthCount / stats.total) * 100)}%` : "0%", icon: Video },
          { label: "Practice Revenue", value: `R${(stats?.estimatedRevenue || 0).toLocaleString()}`, icon: DollarSign, isMoney: true },
        ].map((item, idx) => (
          <Card key={idx} className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{item.label}</span>
                <item.icon className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <p className={`text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50 ${item.color || ""}`}>
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-xs overflow-hidden">
        <CardHeader className="p-4 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Dropdown & Modality Filter */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-zinc-400" />
                Status:
              </label>
              <select
                id="status-filter"
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="h-9 bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 cursor-pointer min-w-[180px]"
              >
                <option value="all">All Appointments ({stats?.total || 0})</option>
                <option value="pending">Pending Intake ({stats?.pending || 0})</option>
                <option value="confirmed">Confirmed ({stats?.confirmed || 0})</option>
                <option value="completed">Completed ({stats?.completed || 0})</option>
                <option value="cancelled">Cancelled ({stats?.cancelled || 0})</option>
              </select>
            </div>

            {/* Modality Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="modality-filter" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 whitespace-nowrap flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-zinc-400" />
                Format:
              </label>
              <select
                id="modality-filter"
                value={modalityFilter}
                onChange={(e) => setModalityFilter(e.target.value)}
                className="h-9 bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 cursor-pointer min-w-[150px]"
              >
                <option value="all">All Modalities</option>
                <option value="telehealth">Telehealth Video</option>
                <option value="in-person">In-Person Room</option>
              </select>
            </div>

            {(activeTab !== "all" || modalityFilter !== "all" || search.trim() !== "") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveTab("all");
                  setModalityFilter("all");
                  setSearch("");
                }}
                className="h-8 px-2.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
              >
                Reset Filters
              </Button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
            <Input
              placeholder="Search client, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-zinc-50 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-lg text-xs"
            />
          </div>
        </CardHeader>

        {/* Appointments Table */}
        <CardContent className="p-0 overflow-x-auto">
          {!bookings ? (
            <div className="p-8 text-center text-xs text-zinc-500 animate-pulse">Loading appointments directory...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Calendar className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">No appointments found matching your filters</p>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Click "Book New Appointment" to schedule a client session.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono font-medium uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Client Contact</th>
                  <th className="py-3 px-4">Service & Modality</th>
                  <th className="py-3 px-4">Date & Time Slot</th>
                  <th className="py-3 px-4">Rate & Fee</th>
                  <th className="py-3 px-4">Intake Brief</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {filteredBookings.map((b) => {
                  const isTelehealth = b.format.toLowerCase().includes("telehealth") || b.format.toLowerCase().includes("video");
                  return (
                    <tr key={b._id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                      {/* Client Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono font-semibold text-xs text-zinc-800 dark:text-zinc-200 shrink-0">
                            {b.clientName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 leading-tight">
                              {b.clientName}
                            </p>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{b.clientEmail}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">{b.clientPhone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Service & Modality */}
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{b.serviceType}</p>
                        <div className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {isTelehealth ? <Video className="w-3 h-3 text-emerald-500" /> : <MapPin className="w-3 h-3 text-amber-500" />}
                          <span>{b.format}</span>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4">
                        <p className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{b.date}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-zinc-400" /> {b.timeSlot} ({b.duration})
                        </p>
                      </td>

                      {/* Rate */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md font-mono text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
                          {b.rate}
                        </span>
                      </td>

                      {/* Intake Brief */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {b.notes ? (
                          <div className="space-y-1">
                            <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-tight">
                              {b.notes}
                            </p>
                            <button
                              onClick={() => setSelectedNotesBooking(b)}
                              className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <FileText className="w-3 h-3" /> Read Intake Brief
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-400 italic">No notes provided</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                            b.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                              : b.status === "pending"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                              : b.status === "completed"
                              ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                              : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${b.status === "confirmed" || b.status === "completed" ? "bg-emerald-500" : b.status === "pending" ? "bg-amber-500 animate-pulse" : "bg-rose-500"}`} />
                          {b.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {b.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(b._id, "confirmed")}
                              className="h-7 text-[11px] font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-md px-2 gap-1 cursor-pointer"
                              title="Confirm Intake"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Confirm
                            </Button>
                          )}

                          {b.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(b._id, "completed")}
                              className="h-7 text-[11px] font-medium border-zinc-200 dark:border-zinc-800 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-md px-2 gap-1 cursor-pointer"
                              title="Mark Completed"
                            >
                              <UserCheck className="w-3 h-3" /> Done
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(b)}
                            className="h-7 text-xs font-medium rounded-md px-2 border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                            title="Edit Appointment"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(b._id, b.clientName)}
                            className="h-7 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-md px-1.5 cursor-pointer"
                            title="Delete Appointment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Book / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-50">
                  {editingBooking ? `Edit Appointment: ${editingBooking.clientName}` : "Schedule New Practice Appointment"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Book client session, set modality, and log intake details.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBooking} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Client Full Name</Label>
                  <Input
                    required
                    placeholder="e.g. Nandi Cele"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Client Email</Label>
                  <Input
                    required
                    type="email"
                    placeholder="client@gmail.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">WhatsApp / Phone</Label>
                  <Input
                    placeholder="+27 82 345 6789"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Therapeutic Service</Label>
                  <select
                    value={formService}
                    onChange={(e) => setFormService(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Session Modality</Label>
                  <select
                    value={formFormat}
                    onChange={(e) => setFormFormat(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    {MODALITY_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Date (YYYY-MM-DD)</Label>
                  <Input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Time Slot</Label>
                  <Input
                    required
                    placeholder="10:00 AM"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Duration</Label>
                  <Input
                    placeholder="60 min"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Session Rate / Fee</Label>
                  <Input
                    placeholder="R850"
                    value={formRate}
                    onChange={(e) => setFormRate(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">CRM Status</Label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending Intake</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Intake Notes & Brief</Label>
                  <textarea
                    rows={3}
                    placeholder="Client presenting concerns, intake notes, or special requirements..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-lg text-xs border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Cancel
                </Button>
                <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg text-xs font-medium">
                  {editingBooking ? "Save Changes" : "Save & Schedule Appointment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brief Notes Drawer / Modal */}
      {selectedNotesBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-50">
                  Intake Brief: {selectedNotesBooking.clientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNotesBooking(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1 font-mono">
                <p><span className="text-zinc-500">Service:</span> {selectedNotesBooking.serviceType}</p>
                <p><span className="text-zinc-500">Modality:</span> {selectedNotesBooking.format}</p>
                <p><span className="text-zinc-500">Schedule:</span> {selectedNotesBooking.date} @ {selectedNotesBooking.timeSlot}</p>
                <p><span className="text-zinc-500">Contact:</span> {selectedNotesBooking.clientEmail} / {selectedNotesBooking.clientPhone}</p>
              </div>

              <div>
                <h4 className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">Clinical / Client Notes:</h4>
                <p className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {selectedNotesBooking.notes || "No notes provided."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <Button onClick={() => setSelectedNotesBooking(null)} className="rounded-lg text-xs font-medium">
                Close Brief
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
