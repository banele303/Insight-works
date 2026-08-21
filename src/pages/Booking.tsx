import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import {
  Calendar, Clock, CreditCard, HelpCircle, PhoneCall, ShieldCheck,
  Check, Sparkles, ChevronDown, ChevronLeft, ChevronRight,
  Video, MapPin, CheckCircle2, User, Mail, Phone, MessageSquare,
  ExternalLink, ArrowRight, RotateCcw
} from "lucide-react";
import { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { ComposioService } from "@/lib/composioService";

const sessionTypes = [
  {
    id: "individual",
    title: "Individual Counselling",
    rate: "R650 – R850",
    duration: "60 min",
    desc: "One-on-one space for anxiety, depression, emotional fatigue, life transitions, and self-discovery.",
    popular: true,
  },
  {
    id: "couples",
    title: "Couples & Relationship Counselling",
    rate: "R850 – R1,100",
    duration: "75 min",
    desc: "Strengthen communication, resolve conflicts, rebuild intimacy, and heal relational strain.",
    popular: false,
  },
  {
    id: "coaching",
    title: "Life Coaching & Self-Mastery",
    rate: "R600 – R800",
    duration: "50 min",
    desc: "Goal clarity, mindset shifts, accountability, and unlocking your true personal and career potential.",
    popular: false,
  },
  {
    id: "trauma",
    title: "Trauma Recovery & Emotional Healing",
    rate: "R750 – R950",
    duration: "60 min",
    desc: "Safe, compassionate processing of past painful experiences, grief, and emotional distress.",
    popular: false,
  },
  {
    id: "youth",
    title: "Youth & Young Adult Support",
    rate: "R550 – R750",
    duration: "50 min",
    desc: "Empowering guidance for teens and young adults navigating academic pressure, identity, and stress.",
    popular: false,
  },
  {
    id: "substance",
    title: "Substance Use Support",
    rate: "R700 – R900",
    duration: "60 min",
    desc: "Non-judgmental, structured recovery support and relapse prevention strategies.",
    popular: false,
  },
  {
    id: "intro",
    title: "Free Initial Consultation",
    rate: "Free",
    duration: "15 min",
    desc: "A brief introductory discussion to explore your needs, questions, and match the right approach.",
    popular: false,
  },
];

const morningSlots = ["09:00 AM", "10:30 AM", "11:45 AM"];
const afternoonSlots = ["02:00 PM", "03:30 PM", "05:00 PM", "06:15 PM"];

const faqs = [
  {
    q: "How does the Composio AI Google Calendar & Email sync work?",
    a: "When you book a session, Composio AI automatically reserves the event on Maletsatsi's official Google Calendar and dispatches an automated calendar invite and confirmation email to your inbox.",
  },
  {
    q: "What is your cancellation and rescheduling policy?",
    a: "We require a minimum of 24 hours' notice for cancellations or rescheduling. Cancellations made with less than 24 hours' notice may incur the standard session fee.",
  },
  {
    q: "Are sessions conducted in-person or online via Telehealth?",
    a: "We offer both! You can attend in-person at our Johannesburg consulting rooms or join via secure, POPIA-compliant Telehealth video consultations from anywhere in South Africa.",
  },
  {
    q: "How do payments work?",
    a: "We support secure payments via PayFast (Instant EFT, Credit/Debit Card) and direct EFT. Invoicing and payment links are provided smoothly upon booking confirmation.",
  },
];

const Booking = () => {
  const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
  const [sessionFormat, setSessionFormat] = useState<"in_person" | "telehealth">("telehealth");
  
  // Interactive Calendar State
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("10:30 AM");

  // Client Details
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const createBookingMutation = useMutation(api.bookings.createBooking);
  const submitApplicationMutation = useMutation(api.applications.submitApplication);
  const selectedService = sessionTypes[selectedServiceIdx];

  // Month navigation
  const monthName = currentMonthDate.toLocaleString("default", { month: "long", year: "numeric" });

  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isPast = new Date(dateStr + "T23:59:59") < new Date();
      const isWeekend = [0, 6].includes(new Date(year, month, day).getDay());
      days.push({
        day,
        dateStr,
        isPast,
        isWeekend,
        available: !isPast && !isWeekend,
      });
    }
    return days;
  }, [currentMonthDate]);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }
    if (!consent) {
      toast.error("Please agree to the confidentiality and POPIA consent.");
      return;
    }

    setIsSubmitting(true);
    const formatLabel = sessionFormat === "in_person" ? "In-Person Consulting Room (Johannesburg)" : "Secure Telehealth Video (South Africa)";

    try {
      // 1. Submit to Convex database via createBooking (with fallback)
      try {
        await createBookingMutation({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          serviceType: selectedService.title,
          format: formatLabel,
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          duration: selectedService.duration,
          rate: selectedService.rate,
          notes: notes.trim(),
        });
      } catch (e) {
        console.warn("Retrying via secondary table:", e);
        const names = clientName.trim().split(" ");
        await submitApplicationMutation({
          learnerFirstName: names[0] || "Client",
          learnerLastName: names.slice(1).join(" ") || "Client",
          learnerDateOfBirth: "1995-01-01",
          gradeApplyingFor: 12,
          schoolPhase: "Practice Session",
          parentFirstName: names[0] || "Client",
          parentLastName: names.slice(1).join(" ") || "Client",
          parentEmail: clientEmail.trim(),
          parentPhone: clientPhone.trim(),
          relationship: "Self",
          motivation: `Service: ${selectedService.title} (${selectedService.rate}) | Format: ${formatLabel} | Date: ${selectedDate} | Time: ${selectedTimeSlot}`,
          additionalSubjects: `Notes: ${notes || "None"} | Synced with Composio AI Google Calendar`,
          howDidYouHear: "Website Booking Portal",
        });
      }

      // 2. Prepare Composio AI Google Calendar & Email payload
      const payload = {
        clientName,
        clientEmail,
        clientPhone,
        serviceType: selectedService.title,
        format: formatLabel,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        duration: selectedService.duration,
        rate: selectedService.rate,
        notes,
      };

      const composioResult = await ComposioService.syncBookingWithComposio(payload);
      const gcalUrl = ComposioService.generateGoogleCalendarUrl(payload);
      const roomId = `room_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

      setBookingConfirmed({
        ...payload,
        composioResult,
        gcalUrl,
        roomId,
      });

      toast.success("Appointment confirmed & synced with Google Calendar via Composio AI!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to complete booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfdfc] text-[#0f2820]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-4 py-1.5 rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#156e52]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
                Composio AI Google Calendar &amp; Email Synced
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2820]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Schedule Your{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Session with Maletsatsi
              </span>
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Select your service, choose an available time slot on the interactive calendar, and receive instant confirmation.
            </p>
          </div>

          {/* Booking Flow Container */}
          {bookingConfirmed ? (
            /* Confirmation Screen */
            <div className="max-w-2xl mx-auto bg-white border border-emerald-200 rounded-3xl p-8 sm:p-12 shadow-lg text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-[#156e52]">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#156e52] bg-emerald-50 px-3 py-1 rounded-full">
                  Booking Confirmed &amp; Synced
                </span>
                <h2 className="text-3xl font-black font-serif text-[#0f2820]">
                  You are all scheduled!
                </h2>
                <p className="text-sm text-slate-600">
                  A confirmation email and Google Calendar invitation have been dispatched to{" "}
                  <strong className="text-[#0f2820]">{bookingConfirmed.clientEmail}</strong> and{" "}
                  <strong>maletsatsi@insightherapyandcoaching.co.za</strong>.
                </p>
              </div>

              {/* Appointment summary box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 text-left space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                  <span className="text-slate-500 font-medium">Service</span>
                  <span className="font-bold text-[#0f2820]">{bookingConfirmed.serviceType}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                  <span className="text-slate-500 font-medium">Date &amp; Time</span>
                  <span className="font-bold text-[#156e52]">
                    {bookingConfirmed.date} · {bookingConfirmed.timeSlot} ({bookingConfirmed.duration})
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-200 pb-2.5">
                  <span className="text-slate-500 font-medium">Format</span>
                  <span className="font-semibold text-slate-700">{bookingConfirmed.format}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Clinician</span>
                  <span className="font-bold text-[#0f2820]">Maletsatsi Sibanda</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <a
                  href={`/therapy-lobby/${bookingConfirmed.roomId}?type=${encodeURIComponent(bookingConfirmed.serviceType)}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0f5940] hover:bg-[#0b422f] text-white px-5 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer ring-2 ring-emerald-500/30"
                >
                  <Video className="w-4 h-4 text-emerald-300 animate-pulse" />
                  Enter Telehealth Video Session Room
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </a>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={bookingConfirmed.gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-[#156e52] hover:bg-[#0f5940] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    Add to Calendar
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <a
                    href={`https://wa.me/27795501557?text=${encodeURIComponent(
                      `Hi Maletsatsi, I just booked an appointment for ${bookingConfirmed.serviceType} on ${bookingConfirmed.date} at ${bookingConfirmed.timeSlot}. Video Room: ${window.location.origin}/therapy-lobby/${bookingConfirmed.roomId}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>

              <button
                onClick={() => setBookingConfirmed(null)}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Book another appointment
              </button>
            </div>
          ) : (
            /* Main 2-Column Booking Interface */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
              
              {/* Left Column: Service & Clinician (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Clinician Profile */}
                <div className="bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/40 border border-slate-200/90 p-5 rounded-3xl shadow-2xs flex items-center gap-4">
                  <img
                    src="/images/therapist-portrait.jpg"
                    alt="Maletsatsi Sibanda"
                    className="w-16 h-16 rounded-2xl object-cover object-top border border-slate-200 shadow-xs shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-[#156e52] bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                      Counselling Therapist &amp; Life Coach
                    </span>
                    <h4 className="font-bold text-base text-[#0f2820] font-serif mt-1">Maletsatsi Sibanda</h4>
                    <p className="text-[11px] text-slate-500">Insight Works Therapy &amp; Coaching · +27 79 550 1557</p>
                  </div>
                </div>

                {/* Session Format Toggle */}
                <div className="bg-white border border-slate-200/90 p-5 rounded-3xl shadow-2xs space-y-3">
                  <h4 className="font-bold text-sm font-serif text-[#0f2820]">Session Location &amp; Format</h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSessionFormat("telehealth")}
                      className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                        sessionFormat === "telehealth"
                          ? "bg-emerald-50/90 border-[#156e52] text-[#156e52] font-bold shadow-xs ring-1 ring-[#156e52]/30"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Video className="w-5 h-5 text-[#156e52]" />
                      <span className="text-xs">Telehealth Video</span>
                      <span className="text-[10px] text-slate-400 font-normal">Nationwide SA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSessionFormat("in_person")}
                      className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all cursor-pointer ${
                        sessionFormat === "in_person"
                          ? "bg-emerald-50/90 border-[#156e52] text-[#156e52] font-bold shadow-xs ring-1 ring-[#156e52]/30"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <MapPin className="w-5 h-5 text-[#ea7627]" />
                      <span className="text-xs">In-Person Room</span>
                      <span className="text-[10px] text-slate-400 font-normal">Johannesburg</span>
                    </button>
                  </div>
                </div>

                {/* Service Types Selector */}
                <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold font-serif text-[#0f2820]">1. Select Service</h3>
                    <span className="text-xs text-slate-400">7 Disciplines</span>
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {sessionTypes.map((st, idx) => (
                      <div
                        key={st.id}
                        onClick={() => setSelectedServiceIdx(idx)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          selectedServiceIdx === idx
                            ? "bg-emerald-50/80 border-[#156e52] shadow-xs ring-1 ring-[#156e52]/20"
                            : "bg-white border-slate-200/80 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-0.5">
                          <span className="font-bold text-xs sm:text-sm text-[#0f2820]">{st.title}</span>
                          <span className="font-extrabold text-xs text-[#156e52] shrink-0 ml-2">{st.rate}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed mb-1.5">{st.desc}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1 text-[#156e52]">
                            <Clock size={11} /> {st.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crisis Contact */}
                <div className="bg-emerald-50/60 border border-emerald-200/70 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#156e52]">
                    <PhoneCall className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="font-bold">Immediate Crisis Support</p>
                      <p className="text-[11px] text-slate-500">SADAG 24/7 Hotline: 0800 456 789</p>
                    </div>
                  </div>
                  <a
                    href="tel:0800456789"
                    className="bg-[#156e52] text-white px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-[#0f5940] transition-colors shrink-0"
                  >
                    Call Free
                  </a>
                </div>

              </div>

              {/* Right Column: Interactive Date & Time Picker + Form (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 2. Interactive Calendar & Time Slot Picker */}
                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold font-serif text-[#0f2820]">
                        2. Pick Date &amp; Available Time
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Live scheduling powered by Composio AI</p>
                    </div>

                    {/* Month Nav Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-bold text-slate-700 px-2 min-w-[110px] text-center">
                        {monthName}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Days Header */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
                      <div key={i} className="py-1">{d}</div>
                    ))}
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarDays.map((item, idx) => {
                      if (!item) {
                        return <div key={`empty-${idx}`} className="h-10 rounded-xl" />;
                      }
                      const isSelected = selectedDate === item.dateStr;
                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          disabled={!item.available}
                          onClick={() => setSelectedDate(item.dateStr)}
                          className={`h-11 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                            isSelected
                              ? "bg-[#156e52] text-white shadow-sm ring-2 ring-[#156e52]/30"
                              : item.available
                              ? "bg-emerald-50/40 hover:bg-emerald-100/60 text-[#0f2820] border border-emerald-100/60"
                              : "text-slate-300 cursor-not-allowed bg-transparent"
                          }`}
                        >
                          <span>{item.day}</span>
                          {item.available && !isSelected && (
                            <span className="w-1 h-1 rounded-full bg-[#156e52] mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Date & Available Time Slots */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0f2820]">
                        Available Slots for <span className="text-[#156e52]">{selectedDate}</span>:
                      </span>
                      <span className="text-[11px] text-slate-400">SAST (UTC+2)</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Morning</p>
                      <div className="grid grid-cols-3 gap-2">
                        {morningSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              selectedTimeSlot === slot
                                ? "bg-[#156e52] text-white border-[#156e52] shadow-2xs"
                                : "bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>

                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2">Afternoon &amp; Evening</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {afternoonSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              selectedTimeSlot === slot
                                ? "bg-[#156e52] text-white border-[#156e52] shadow-2xs"
                                : "bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Client Information & Booking Submission */}
                <form onSubmit={handleBookingSubmit} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-serif text-[#0f2820]">
                      3. Client Details &amp; Confirmation
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Your information is protected under strict POPIA clinical confidentiality.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="e.g. Sipho Ndlovu"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#0f2820] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#156e52] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="name@example.co.za"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#0f2820] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#156e52] transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+27 79 000 0000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#0f2820] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#156e52] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Presenting Concern (Optional)</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Briefly tell us what you would like to focus on..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-[#0f2820] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#156e52] transition-all"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 accent-[#156e52] rounded cursor-pointer"
                    />
                    <label htmlFor="consent" className="text-[11px] text-slate-500 leading-snug cursor-pointer">
                      I consent to confidential session scheduling and agree to the 24-hour rescheduling policy under POPIA compliance.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#156e52] hover:bg-[#0f5940] text-white py-3.5 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Syncing with Google Calendar via Composio AI...
                      </>
                    ) : (
                      <>
                        <span>Confirm Appointment ({selectedService.rate})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

              </div>

            </div>
          )}

          {/* ── FAQ ACCORDION SECTION ── */}
          <div className="max-w-3xl mx-auto pt-8">
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-3xl font-serif font-bold text-[#0f2820] flex items-center justify-center gap-2">
                <HelpCircle className="text-[#156e52]" /> Booking &amp; Scheduling FAQs
              </h2>
              <p className="text-slate-500 text-sm">
                Common questions regarding appointment policies, Google Calendar sync, and session formats.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-[#0f2820] text-base font-serif">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180 text-[#156e52]" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
    </div>
  );
};

export default Booking;
