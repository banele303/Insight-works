import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ChevronLeft, ChevronRight, Plus, Loader2, Trash2, Calendar as CalendarIcon,
  Clock, RotateCcw, List, LayoutGrid, Sparkles, Video, MapPin, UserCheck,
  CheckCircle2, Phone, Mail, ArrowUpRight, Search, ExternalLink, User, AlertCircle
} from "lucide-react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, isToday,
  getDay, addMonths, subMonths, setMonth, setYear, isSameDay
} from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/AuthProvider";
import { useNavigate } from "react-router";
import type { Id } from "../../convex/_generated/dataModel";

const CLINICAL_EVENT_TYPES: Record<string, { label: string; badgeClass: string; dotClass: string }> = {
  counselling: { label: "1-on-1 Counselling", badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dotClass: "bg-emerald-500" },
  session: { label: "Individual Session", badgeClass: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20", dotClass: "bg-teal-500" },
  coaching: { label: "Life Coaching", badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20", dotClass: "bg-sky-500" },
  workshop: { label: "Group Workshop", badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20", dotClass: "bg-amber-500" },
  supervision: { label: "Clinical Supervision", badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20", dotClass: "bg-purple-500" },
  other: { label: "Practice Admin", badgeClass: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400 border-zinc-500/20", dotClass: "bg-zinc-500" },
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const YEARS = Array.from({ length: 13 }, (_, i) => 2020 + i);

export default function EventsCalendar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isStaff = user?.role === "admin" || user?.role === "teacher";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"grid" | "agenda">("grid");
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upcomingFilter, setUpcomingFilter] = useState<"all" | "confirmed" | "pending" | "telehealth">("all");
  const [upcomingSearch, setUpcomingSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    type: "counselling" as any,
  });

  const monthStr = format(currentDate, "yyyy-MM");
  const events = useQuery(api.events.getEvents, { month: monthStr });
  const allBookings = useQuery(api.bookings.getBookings, {});

  const createEvent = useMutation(api.events.createEvent);
  const deleteEvent = useMutation(api.events.deleteEvent);
  const updateBookingStatus = useMutation(api.bookings.updateBookingStatus);

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
  }, [currentDate]);

  const startPad = getDay(startOfMonth(currentDate));

  const handleMonthChange = (monthIndex: number) => {
    setCurrentDate(setMonth(currentDate, monthIndex));
  };

  const handleYearChange = (yearNum: number) => {
    setCurrentDate(setYear(currentDate, yearNum));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) return toast.error("Title and date are required.");
    setIsSubmitting(true);
    try {
      await createEvent(form);
      toast.success("Clinical session scheduled!");
      setOpen(false);
      setForm({ title: "", description: "", date: format(new Date(), "yyyy-MM-dd"), endDate: "", type: "counselling" });
    } catch (e: any) {
      toast.error(e.message || "Failed to schedule session.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDayKey = format(selectedDay, "yyyy-MM-dd");
  const selectedDayEvents = events?.filter((e) => e.date === selectedDayKey) || [];
  const selectedDayBookings = allBookings?.filter((b) => b.date === selectedDayKey) || [];

  // Filter upcoming bookings chronologically (from today onwards or overall)
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const filteredUpcomingBookings = useMemo(() => {
    if (!allBookings) return [];
    let list = [...allBookings];

    list = list.filter((b) => b.date >= todayStr);
    list.sort((a, b) => a.date.localeCompare(b.date));

    if (upcomingFilter === "confirmed") list = list.filter((b) => b.status === "confirmed");
    if (upcomingFilter === "pending") list = list.filter((b) => b.status === "pending");
    if (upcomingFilter === "telehealth") {
      list = list.filter((b) => b.format.toLowerCase().includes("telehealth") || b.format.toLowerCase().includes("video"));
    }

    if (upcomingSearch.trim()) {
      const s = upcomingSearch.toLowerCase();
      list = list.filter(
        (b) =>
          b.clientName.toLowerCase().includes(s) ||
          b.clientEmail.toLowerCase().includes(s) ||
          b.serviceType.toLowerCase().includes(s) ||
          (b.notes || "").toLowerCase().includes(s)
      );
    }

    return list;
  }, [allBookings, todayStr, upcomingFilter, upcomingSearch]);

  const handleStatusChange = async (bookingId: Id<"bookings">, newStatus: "confirmed" | "completed" | "cancelled") => {
    try {
      await updateBookingStatus({ bookingId, status: newStatus });
      toast.success(`Appointment status updated to ${newStatus.toUpperCase()}`);
    } catch {
      toast.error("Could not update booking status.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-3 sm:p-6 md:p-8 space-y-6 max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-zinc-200 dark:border-zinc-800/80 pb-4 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 mb-1.5 sm:mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Clinical Practice Schedule
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sessions & Practice Calendar
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage therapy appointments, group workshops, clinical supervision, and practice events.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
          <div className="flex items-center p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === "grid" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-[11px]">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === "agenda" ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
              title="Agenda View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden xs:inline text-[11px]">Agenda</span>
            </button>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold text-xs px-3 sm:px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer border border-transparent h-9">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Schedule Session</span>
                <span className="sm:hidden">Schedule</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 sm:rounded-2xl rounded-t-3xl shadow-2xl max-w-md w-full p-5 sm:p-6 text-zinc-900 dark:text-zinc-100">
              <DialogHeader className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  Schedule Clinical Session / Event
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-3.5 pt-2 text-xs">
                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Session / Event Title</Label>
                  <Input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Couples Counselling Session"
                    className="rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="font-medium text-zinc-700 dark:text-zinc-300">Start Date</Label>
                    <Input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="font-medium text-zinc-700 dark:text-zinc-300">End Date (optional)</Label>
                    <Input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Clinical Event Category</Label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
                  >
                    {Object.entries(CLINICAL_EVENT_TYPES).map(([k, meta]) => (
                      <option key={k} value={k}>{meta.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Description / Session Notes</Label>
                  <Textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Location, client contact info, or session focus..."
                    className="rounded-xl text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 p-2.5 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl text-xs font-semibold">
                    {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null} Save Event
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories Legend - Horizontally Scrollable on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-wider shrink-0 pr-1">Categories:</span>
        <div className="flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-700 dark:text-orange-400 shrink-0 text-[11px]">
          <span className="w-2 h-2 rounded-full shrink-0 bg-orange-500" />
          <span className="font-bold">Orange Border = Client Booking</span>
        </div>
        {Object.entries(CLINICAL_EVENT_TYPES).map(([type, meta]) => (
          <div
            key={type}
            className="flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-xl bg-zinc-100/80 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-700 dark:text-zinc-300 shrink-0 text-[11px]"
          >
            <span className={cn("w-2 h-2 rounded-full shrink-0", meta.dotClass)} />
            <span>{meta.label}</span>
          </div>
        ))}
      </div>

      {/* Main Calendar Card */}
      <Card className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-xs overflow-hidden">
        {/* Navigation Bar */}
        <CardHeader className="p-3 sm:p-4 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="h-8 w-8 rounded-xl border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <h2 className="text-sm sm:text-base font-bold font-mono text-zinc-900 dark:text-zinc-50 min-w-[130px] sm:min-w-[150px] text-center">
                {format(currentDate, "MMMM yyyy")}
              </h2>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="h-8 w-8 rounded-xl border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="h-8 text-xs font-mono font-medium rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Today
            </Button>
          </div>

          {/* Fast Month & Year Jump Selectors */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={currentDate.getMonth()}
              onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
              className="h-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx}>{m}</option>
              ))}
            </select>

            <select
              value={currentDate.getFullYear()}
              onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
              className="h-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2 text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4">
          {viewMode === "grid" ? (
            <div className="space-y-4">
              {/* Day Name Headers */}
              <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 pb-2 gap-1 text-center font-mono text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                <span className="sm:hidden">S</span><span className="hidden sm:inline">Sun</span>
                <span className="sm:hidden">M</span><span className="hidden sm:inline">Mon</span>
                <span className="sm:hidden">T</span><span className="hidden sm:inline">Tue</span>
                <span className="sm:hidden">W</span><span className="hidden sm:inline">Wed</span>
                <span className="sm:hidden">T</span><span className="hidden sm:inline">Thu</span>
                <span className="sm:hidden">F</span><span className="hidden sm:inline">Fri</span>
                <span className="sm:hidden">S</span><span className="hidden sm:inline">Sat</span>
              </div>

              {/* ── MOBILE GRID VIEW (< sm) ── */}
              <div className="sm:hidden space-y-4">
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startPad }).map((_, i) => (
                    <div key={`pad-mob-${i}`} className="h-11 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/10" />
                  ))}

                  {days.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const dayEvents = events?.filter((e) => e.date === dateKey) || [];
                    const dayBookings = allBookings?.filter((b) => b.date === dateKey) || [];
                    const hasBooking = dayBookings.length > 0;
                    const hasEvent = dayEvents.length > 0;
                    const isCurrentDay = isToday(day);
                    const isSelected = isSameDay(day, selectedDay);

                    return (
                      <button
                        key={`mob-${day.toISOString()}`}
                        onClick={() => setSelectedDay(day)}
                        className={cn(
                          "h-11 rounded-xl border flex flex-col items-center justify-center p-1 transition-all cursor-pointer relative",
                          isSelected
                            ? "border-2 border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-xs"
                            : hasBooking
                            ? "border-2 border-orange-500 dark:border-orange-400 bg-orange-500/10 text-orange-700 dark:text-orange-300 font-bold shadow-xs ring-1 ring-orange-500/30"
                            : isCurrentDay
                            ? "border-emerald-400/60 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold"
                            : hasEvent
                            ? "border-sky-400/60 bg-sky-500/5 text-sky-600 dark:text-sky-400 font-semibold"
                            : "border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200"
                        )}
                      >
                        <span className="text-xs font-mono">{format(day, "d")}</span>
                        {(hasBooking || hasEvent) && (
                          <div className="flex gap-0.5 mt-0.5">
                            {hasBooking && (
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 ring-1 ring-orange-600 animate-pulse" />
                            )}
                            {dayEvents.slice(0, 2).map((ev, idx) => {
                              const meta = CLINICAL_EVENT_TYPES[ev.type] || CLINICAL_EVENT_TYPES.other;
                              return (
                                <span key={idx} className={cn("w-1.5 h-1.5 rounded-full shrink-0", meta.dotClass)} />
                              );
                            })}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Day Agenda Drawer below grid on Mobile */}
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-3 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 pb-2">
                    <p className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-500" />
                      {format(selectedDay, "EEEE, MMMM d, yyyy")}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {selectedDayBookings.length + selectedDayEvents.length} total item(s)
                    </span>
                  </div>

                  {selectedDayBookings.length === 0 && selectedDayEvents.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic py-2 text-center">No appointments or sessions for this date.</p>
                  ) : (
                    <div className="space-y-2">
                      {/* Show Bookings first */}
                      {selectedDayBookings.map((b) => (
                        <div
                          key={`b-${b._id}`}
                          className="p-2.5 rounded-xl border border-orange-500/40 bg-orange-500/5 dark:bg-orange-500/10 flex items-start justify-between gap-2"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                {b.clientName}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20 font-bold">
                                {b.serviceType}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                              {b.timeSlot} ({b.duration}) · {b.format}
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                            {b.status.toUpperCase()}
                          </span>
                        </div>
                      ))}

                      {/* Show Events */}
                      {selectedDayEvents.map((ev) => {
                        const meta = CLINICAL_EVENT_TYPES[ev.type] || CLINICAL_EVENT_TYPES.other;
                        return (
                          <div
                            key={ev._id}
                            className="p-2.5 rounded-xl border bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-2"
                          >
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">{ev.title}</span>
                                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-mono border", meta.badgeClass)}>
                                  {meta.label}
                                </span>
                              </div>
                              {ev.description && (
                                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">{ev.description}</p>
                              )}
                            </div>

                            {isStaff && (
                              <button
                                type="button"
                                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0"
                                onClick={() => {
                                  if (confirm(`Remove session "${ev.title}"?`)) {
                                    deleteEvent({ id: ev._id }).catch((err) => toast.error(err.message));
                                  }
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ── DESKTOP GRID VIEW (>= sm) ── */}
              <div className="hidden sm:grid grid-cols-7 gap-1.5">
                {Array.from({ length: startPad }).map((_, i) => (
                  <div key={`pad-desk-${i}`} className="min-h-[95px] rounded-xl bg-zinc-50/40 dark:bg-zinc-900/20 border border-transparent" />
                ))}

                {days.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd");
                  const dayEvents = events?.filter((e) => e.date === dateKey) || [];
                  const dayBookings = allBookings?.filter((b) => b.date === dateKey) || [];
                  const hasBooking = dayBookings.length > 0;
                  const isCurrentDay = isToday(day);

                  return (
                    <div
                      key={`desk-${day.toISOString()}`}
                      className={cn(
                        "min-h-[95px] rounded-xl border p-2 text-xs transition-all flex flex-col justify-between",
                        hasBooking
                          ? "border-orange-500 dark:border-orange-400 border-l-4 border-l-orange-500 bg-orange-500/5 ring-1 ring-orange-500/30"
                          : isCurrentDay
                          ? "border-emerald-500 dark:border-emerald-400 bg-emerald-500/5 ring-1 ring-emerald-500/30"
                          : "border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "font-mono text-xs font-semibold px-1.5 py-0.2 rounded-md",
                            hasBooking
                              ? "bg-orange-500 text-white font-bold"
                              : isCurrentDay
                              ? "bg-emerald-600 text-white dark:bg-emerald-400 dark:text-zinc-950 font-bold"
                              : "text-zinc-700 dark:text-zinc-300"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {(hasBooking || dayEvents.length > 0) && (
                          <span className="text-[10px] font-mono text-zinc-400 font-medium">
                            {dayBookings.length + dayEvents.length} item(s)
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 space-y-1 flex-1 overflow-y-auto max-h-[70px]">
                        {/* Bookings inside desktop grid cell */}
                        {dayBookings.map((b) => (
                          <div
                            key={`b-${b._id}`}
                            className="p-1 rounded text-[10px] font-bold border bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30 truncate flex items-center gap-1"
                            title={`Booking: ${b.clientName} (${b.serviceType})`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span className="truncate">{b.clientName} ({b.timeSlot})</span>
                          </div>
                        ))}

                        {/* Events inside desktop grid cell */}
                        {dayEvents.map((ev) => {
                          const meta = CLINICAL_EVENT_TYPES[ev.type] || CLINICAL_EVENT_TYPES.other;
                          return (
                            <div
                              key={ev._id}
                              className={cn(
                                "p-1 rounded text-[10px] font-medium border flex items-center justify-between gap-1 group transition-all",
                                meta.badgeClass
                              )}
                            >
                              <span className="truncate leading-tight font-medium">{ev.title}</span>
                              {isStaff && (
                                <button
                                  type="button"
                                  className="opacity-0 group-hover:opacity-100 hover:text-rose-600 dark:hover:text-rose-400 transition-opacity p-0.5"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Remove session "${ev.title}"?`)) {
                                      deleteEvent({ id: ev._id }).catch((err) => toast.error(err.message));
                                    }
                                  }}
                                  title="Delete event"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Agenda List View */
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">
                  Agenda List for {format(currentDate, "MMMM yyyy")}
                </h3>
              </div>

              {!events || events.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <CalendarIcon className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    No sessions scheduled for {format(currentDate, "MMMM yyyy")}
                  </p>
                  <p className="text-xs text-zinc-500">Use the navigation controls to jump to another month or schedule a session.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                  {events.map((ev) => {
                    const meta = CLINICAL_EVENT_TYPES[ev.type] || CLINICAL_EVENT_TYPES.other;
                    return (
                      <div key={ev._id} className="py-3 px-2 flex items-start sm:items-center justify-between gap-3 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 rounded-xl transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0">
                          <div className="font-mono text-xs text-zinc-500 shrink-0">
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">{ev.date}</p>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">{ev.title}</p>
                              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-mono border shrink-0", meta.badgeClass)}>
                                {meta.label}
                              </span>
                            </div>
                            {ev.description && (
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">{ev.description}</p>
                            )}
                          </div>
                        </div>

                        {isStaff && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`Remove event "${ev.title}"?`)) {
                                deleteEvent({ id: ev._id }).catch((err) => toast.error(err.message));
                              }
                            }}
                            className="h-7 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg px-2 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── UPCOMING APPOINTMENTS & SESSIONS SECTION (AT BOTTOM) ─── */}
      <Card className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-xs overflow-hidden">
        <CardHeader className="p-3.5 sm:p-4 border-b border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-50">
                Upcoming Appointments & Sessions
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                {filteredUpcomingBookings.length} Upcoming
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              Confirmed and pending appointments for today onwards.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Search filter */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search client, email..."
                value={upcomingSearch}
                onChange={(e) => setUpcomingSearch(e.target.value)}
                className="pl-9 h-8 text-xs bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl w-full"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none w-full sm:w-auto">
              {[
                { id: "all", label: "All" },
                { id: "confirmed", label: "Confirmed" },
                { id: "pending", label: "Pending" },
                { id: "telehealth", label: "Telehealth" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setUpcomingFilter(f.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all whitespace-nowrap shrink-0",
                    upcomingFilter === f.id
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-4">
          {!allBookings ? (
            <div className="py-10 text-center text-xs text-zinc-500 animate-pulse flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              Loading upcoming appointments...
            </div>
          ) : filteredUpcomingBookings.length === 0 ? (
            <div className="py-10 sm:py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-center mx-auto text-zinc-400">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">No upcoming appointments found</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                  {upcomingSearch || upcomingFilter !== "all"
                    ? "No appointments match your filter criteria."
                    : "No appointments scheduled from today onwards. Click 'Book New Appointment' to schedule one."}
                </p>
              </div>
              <Button
                onClick={() => navigate("/appointments")}
                className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-xl text-xs font-semibold px-4 py-2 h-9"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Book New Appointment
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredUpcomingBookings.map((b) => {
                const isTelehealth = b.format.toLowerCase().includes("telehealth") || b.format.toLowerCase().includes("video");
                const isConfirmed = b.status === "confirmed";
                const isPending = b.status === "pending";
                const isDone = b.status === "completed";

                return (
                  <div
                    key={b._id}
                    className="bg-white dark:bg-zinc-900 border border-orange-500/40 dark:border-orange-500/30 border-l-4 border-l-orange-500 rounded-2xl p-3.5 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-2.5">
                      {/* Date & Time Slot Banner with Orange -> Green gradient blending */}
                      <div className="flex items-center justify-between bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-emerald-500/15 border border-orange-500/30 px-3 py-1.5 rounded-xl font-mono text-xs text-orange-900 dark:text-orange-300">
                        <span className="font-bold flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          {b.date}
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">@ {b.timeSlot}</span>
                      </div>

                      {/* Client Header Info */}
                      <div className="flex items-start justify-between gap-2 pt-0.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Avatar blending Orange at start -> Green at end */}
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs font-mono shrink-0 shadow-xs">
                            {b.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                              {b.clientName}
                            </h4>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{b.clientEmail}</p>
                          </div>
                        </div>

                        {/* Status pill */}
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border shrink-0",
                            isConfirmed
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                              : isPending
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
                              : isDone
                              ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                              : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              isConfirmed || isDone ? "bg-emerald-500" : isPending ? "bg-amber-500 animate-pulse" : "bg-rose-500"
                            )}
                          />
                          {b.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Service & Modality */}
                      <div className="space-y-1 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80 rounded-xl p-2.5 text-xs">
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200">{b.serviceType}</p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 dark:text-zinc-400 pt-0.5">
                          <div className="flex items-center gap-1">
                            {isTelehealth ? <Video className="w-3 h-3 text-emerald-500 shrink-0" /> : <MapPin className="w-3 h-3 text-amber-500 shrink-0" />}
                            <span className="truncate">{b.format}</span>
                          </div>
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">{b.rate}</span>
                        </div>
                      </div>

                      {/* Notes preview */}
                      {b.notes && (
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 italic leading-tight bg-zinc-50/50 dark:bg-zinc-900/40 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/60">
                          "{b.notes}"
                        </p>
                      )}
                    </div>

                    {/* Touch-friendly Action Buttons with Orange -> Green gradient */}
                    <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      {isTelehealth ? (
                        <button
                          onClick={() => navigate(`/therapy-lobby/room-${b._id}`)}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl bg-gradient-to-r from-orange-500 via-emerald-600 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 active:scale-[0.99] text-white transition-all cursor-pointer shadow-xs"
                        >
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          Join Video Lobby
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate("/appointments")}
                          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-xl bg-gradient-to-r from-orange-500/10 to-emerald-500/10 hover:from-orange-500/20 hover:to-emerald-500/20 text-zinc-800 dark:text-zinc-200 border border-orange-500/20 transition-all cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 shrink-0 text-orange-500" />
                          In-Person Room
                        </button>
                      )}

                      {isPending && isStaff && (
                        <button
                          onClick={() => handleStatusChange(b._id, "confirmed")}
                          className="text-xs font-semibold px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-emerald-600 text-white hover:opacity-90 transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs"
                          title="Confirm Appointment"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
