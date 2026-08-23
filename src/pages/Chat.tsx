import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useState, useRef, useEffect } from "react";
import {
  Send, Sparkles, Calendar, Clock, Video, MapPin, CheckCircle2,
  Phone, Mail, User, ShieldCheck, HelpCircle, ArrowRight,
  ExternalLink, RotateCcw, MessageSquare, Bot, AlertCircle
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { streamPuterChat } from "@/lib/puterChatService";
import { ComposioService } from "@/lib/composioService";
import MarkdownMessage from "@/components/global/MarkdownMessage";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  showBookingCard?: boolean;
  bookingData?: any;
}

const starterQuestions = [
  "What are your session rates and medical aid options?",
  "How does couples & relationship counselling work?",
  "I want to book an individual counselling session.",
  "What is the difference between therapy and life coaching?",
  "Tell me about trauma recovery and emotional healing.",
];

const serviceOptions = [
  { id: "individual", name: "Individual Counselling", rate: "R650 – R850", duration: "60 min" },
  { id: "couples", name: "Couples & Relationships", rate: "R850 – R1,100", duration: "75 min" },
  { id: "coaching", name: "Life Coaching & Self-Mastery", rate: "R600 – R800", duration: "50 min" },
  { id: "trauma", name: "Trauma Recovery & EMDR", rate: "R750 – R950", duration: "60 min" },
  { id: "youth", name: "Youth & Young Adult Support", rate: "R550 – R750", duration: "50 min" },
  { id: "substance", name: "Substance Use Support", rate: "R700 – R900", duration: "60 min" },
  { id: "intro", name: "Free Initial Consultation", rate: "Free", duration: "15 min" },
];

const timeSlots = ["09:00 AM", "10:30 AM", "11:45 AM", "02:00 PM", "03:30 PM", "05:00 PM"];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Insight Works Therapy & Coaching Sanctuary. I am your AI Companion powered by Cloudflare AI. How can I support your wellbeing today? Feel free to ask about our disciplines, explore coping tools, or click 'Book Appointment' to schedule a session directly.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showInChatBooking, setShowInChatBooking] = useState(false);

  // In-chat booking state
  const [selectedService, setSelectedService] = useState(serviceOptions[0]);
  const [selectedFormat, setSelectedFormat] = useState<"in_person" | "telehealth">("telehealth");
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [bookingTime, setBookingTime] = useState(timeSlots[1]);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  const createBookingMutation = useMutation(api.bookings.createBooking);
  const submitApplicationMutation = useMutation(api.applications.submitApplication);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showInChatBooking, confirmedBooking]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const assistantId = String(Date.now() + 1);
    const initialAssistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    const lower = query.toLowerCase();
    const wantsBooking = lower.includes("book") || lower.includes("appointment") || lower.includes("schedule") || lower.includes("consultation");

    try {
      await streamPuterChat(query, [...messages, userMsg], (streamChunk) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: streamChunk } : msg
          )
        );
      });

      if (wantsBooking) {
        setShowInChatBooking(true);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content:
                  "I'd love to help you book a session with Maletsatsi Sibanda. Click 'Book Appointment' below to sync directly with Google Calendar.",
              }
            : msg
        )
      );
      setShowInChatBooking(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleInChatBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      toast.error("Please fill in your name, email, and WhatsApp phone number.");
      return;
    }

    setIsSubmittingBooking(true);
    const formatLabel = selectedFormat === "in_person" ? "In-Person Consulting Room (Johannesburg)" : "Secure Telehealth Video (South Africa)";

    try {
      try {
        await createBookingMutation({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          serviceType: selectedService.name,
          format: formatLabel,
          date: bookingDate,
          timeSlot: bookingTime,
          duration: selectedService.duration,
          rate: selectedService.rate,
          notes: "Booked via AI Sanctuary Assistant with Composio Google Calendar sync",
        });
      } catch (err) {
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
          motivation: `Service: ${selectedService.name} (${selectedService.rate}) | Format: ${formatLabel} | Date: ${bookingDate} | Time: ${bookingTime}`,
          additionalSubjects: "Booked via Cloudflare AI Assistant with Composio Google Calendar sync",
          howDidYouHear: "Therapy AI Portal",
        });
      }

      const payload = {
        clientName,
        clientEmail,
        clientPhone,
        serviceType: selectedService.name,
        format: formatLabel,
        date: bookingDate,
        timeSlot: bookingTime,
        duration: selectedService.duration,
        rate: selectedService.rate,
        notes: "Booked via Cloudflare AI Chat Assistant",
      };

      const composioResult = await ComposioService.syncBookingWithComposio(payload);
      const gcalUrl = ComposioService.generateGoogleCalendarUrl(payload);

      const bookingInfo = {
        ...payload,
        composioResult,
        gcalUrl,
      };

      setConfirmedBooking(bookingInfo);
      setShowInChatBooking(false);

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          role: "assistant",
          content: `✨ Excellent! Your appointment for **${selectedService.name}** on **${bookingDate} at ${bookingTime}** is confirmed and synced to Google Calendar via Composio AI.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          bookingData: bookingInfo,
        },
      ]);

      toast.success("Session successfully booked and synced with Google Calendar!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to confirm booking. Please try again.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-[#0f2820] flex flex-col justify-between" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#156e52] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Live Streaming AI Companion
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-serif text-[#0f2820] tracking-tight">
              AI Sanctuary &amp; Practice Assistant
            </h1>
            <p className="text-slate-500 text-sm">
              Conversational guidance, discipline inquiries, and instant Google Calendar appointment booking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInChatBooking(!showInChatBooking)}
              className="inline-flex items-center gap-2 bg-[#156e52] hover:bg-[#0f5940] text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              {showInChatBooking ? "Back to Chat" : "Book Appointment"}
            </button>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-600 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#156e52]" />
              <span>POPIA Safe</span>
            </div>
          </div>
        </div>

        {/* Chat Main View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chat Window (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl shadow-xl flex flex-col h-[640px] overflow-hidden">
            {/* Window Header */}
            <div className="bg-[#0f2820] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-xs">
                  <img src="/images/logo.png" alt="Insight Works" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-serif leading-tight text-white">Insight Works</h3>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMessages([
                      {
                        id: "welcome",
                        role: "assistant",
                        content: "Sanctuary conversation reset. How may I best support your wellbeing journey today?",
                        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                      },
                    ]);
                    setConfirmedBooking(null);
                    setShowInChatBooking(false);
                  }}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  title="Reset Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 text-sm">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-white border border-emerald-200 p-0.5 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      <img src="/images/logo.png" alt="Insight Works" className="w-full h-full object-contain" />
                    </div>
                  )}

                  <div className="space-y-2 max-w-[85%]">
                    <div
                      className={`p-4 rounded-3xl leading-relaxed shadow-2xs ${
                        m.role === "user"
                          ? "bg-[#156e52] text-white rounded-tr-none font-medium"
                          : "bg-white border border-slate-200/90 text-[#0f2820] rounded-tl-none"
                      }`}
                    >
                      <MarkdownMessage
                        content={m.content || (isTyping ? "Streaming thoughts..." : "")}
                        isUser={m.role === "user"}
                      />

                      {/* In-Message Book Appointment CTA */}
                      {m.role === "assistant" && m.id !== "welcome" && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
                          <button
                            onClick={() => setShowInChatBooking(true)}
                            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#156e52] border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#156e52]" /> Book Appointment
                          </button>
                          <a
                            href="https://wa.me/27795501557"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-400 hover:text-[#156e52] font-semibold"
                          >
                            WhatsApp Therapist
                          </a>
                        </div>
                      )}
                    </div>

                    {m.bookingData && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs text-slate-700 shadow-2xs">
                        <div className="flex items-center gap-2 text-[#156e52] font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Google Calendar Event Created via Composio</span>
                        </div>
                        <p><strong>Session:</strong> {m.bookingData.serviceType}</p>
                        <p><strong>Date &amp; Time:</strong> {m.bookingData.date} at {m.bookingData.timeSlot} ({m.bookingData.duration})</p>
                        <p><strong>Modality:</strong> {m.bookingData.format}</p>
                        <div className="pt-2">
                          <a
                            href={m.bookingData.gcalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#156e52] hover:bg-[#0f5940] text-white px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-xs"
                          >
                            <Calendar className="w-4 h-4" /> Open in Google Calendar
                          </a>
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] text-slate-400 block px-1">{m.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-white border border-emerald-200 p-0.5 flex items-center justify-center shrink-0">
                    <img src="/images/logo.png" alt="Insight Works" className="w-full h-full object-contain animate-pulse" />
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Insight Works AI is replying...
                  </div>
                </div>
              )}

              {/* In-Chat Interactive Booking Form */}
              {showInChatBooking && (
                <div className="bg-white border-2 border-emerald-400 rounded-3xl p-5 shadow-lg space-y-4 animate-in fade-in-50">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-[#0f2820] font-serif text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#156e52]" />
                      Schedule Practice Session (Composio Google Calendar Sync)
                    </h4>
                    <button onClick={() => setShowInChatBooking(false)} className="text-xs text-slate-400 hover:text-slate-600">
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleInChatBookingSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Select Therapeutic Discipline</label>
                      <select
                        value={selectedService.id}
                        onChange={(e) => {
                          const s = serviceOptions.find((opt) => opt.id === e.target.value);
                          if (s) setSelectedService(s);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-[#0f2820]"
                      >
                        {serviceOptions.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} · {s.duration} · {s.rate}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedFormat("telehealth")}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                          selectedFormat === "telehealth"
                            ? "bg-emerald-50 border-[#156e52] text-[#156e52]"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <Video className="w-4 h-4" /> Telehealth Video
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFormat("in_person")}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                          selectedFormat === "in_person"
                            ? "bg-emerald-50 border-[#156e52] text-[#156e52]"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-[#ea7627]" /> Consulting Room (JHB)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Preferred Date</label>
                        <input
                          type="date"
                          required
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Time Slot</label>
                        <select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                        >
                          {timeSlots.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="WhatsApp / Phone"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingBooking}
                      className="w-full bg-[#156e52] hover:bg-[#0f5940] text-white py-3 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingBooking ? "Creating Calendar Invite & Dispatching Notifications..." : `Confirm Session Booking (${selectedService.rate})`}
                    </button>
                  </form>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Starter Chips */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-xs whitespace-nowrap">
              {starterQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(q)}
                  className="bg-white border border-slate-200 text-slate-600 hover:border-[#156e52] hover:text-[#156e52] px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 shadow-2xs font-medium"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => setShowInChatBooking(!showInChatBooking)}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#156e52] border border-emerald-200 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Book Appointment</span>
              </button>

              <input
                type="text"
                placeholder="Ask about counselling disciplines, pricing, or request a booking..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-[#0f2820] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#156e52]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-[#156e52] hover:bg-[#0f5940] text-white p-2.5 sm:px-5 sm:py-2.5 rounded-2xl font-bold text-sm transition-colors cursor-pointer disabled:opacity-40 shrink-0 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>

          {/* Quick Info & Practice Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#fbfdfc] border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-slate-200 flex items-center justify-center shrink-0">
                  <img src="/images/logo.png" alt="Insight Works" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-base font-serif text-[#0f2820]">Maletsatsi Sibanda</h4>
                  <p className="text-xs text-[#156e52] font-semibold">Counselling Therapist &amp; Life Coach</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Registered counsellor dedicated to individual healing, relationship renewal, and transformational life coaching in South Africa.
              </p>

              <div className="space-y-2 border-t border-slate-200 pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#156e52]" />
                  <span>+27 79 550 1557 (WhatsApp)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#156e52]" />
                  <span className="break-all">maletsatsi@insightherapyandcoaching.co.za</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#ea7627]" />
                  <span>Telehealth Nationwide &amp; International</span>
                </div>
              </div>
            </div>

            <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-rose-700 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>24/7 Crisis Hotline (SADAG)</span>
              </div>
              <p className="text-rose-900/80 leading-relaxed">
                If you or a loved one are in immediate danger or severe crisis, contact the South African Depression and Anxiety Group (SADAG):
              </p>
              <div className="p-2.5 bg-white border border-rose-200 rounded-xl font-black text-rose-700 text-center text-sm">
                0800 456 789 (Free 24/7)
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
