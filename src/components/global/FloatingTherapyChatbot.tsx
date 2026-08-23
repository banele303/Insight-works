import { useState, useRef, useEffect } from "react";
import {
  MessageSquare, X, Send, Sparkles, Calendar, Clock, Video,
  MapPin, CheckCircle2, Phone, Bot, ArrowRight, Minimize2,
  ExternalLink, User, ShieldCheck, HeartPulse
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
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
  "How much does individual counselling cost?",
  "I want to book an introductory appointment.",
  "What is the difference between therapy and coaching?",
  "How does couples counselling work?",
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

export default function FloatingTherapyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am your AI Sanctuary Assistant for Insight Works Therapy & Coaching 🌿. Ask me about our 7 core disciplines, explore therapeutic guidance, or book an appointment directly here.",
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
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, showInChatBooking, isOpen]);

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
    const wantsBooking =
      lower.includes("book") || lower.includes("appointment") || lower.includes("schedule") || lower.includes("consultation") || lower.includes("session");

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
      toast.error("Please fill in your name, email, and WhatsApp number.");
      return;
    }

    setIsSubmittingBooking(true);
    const formatLabel =
      selectedFormat === "in_person" ? "In-Person Consulting Room (Johannesburg)" : "Secure Telehealth Video (South Africa)";

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
          notes: "Booked via Floating AI Sanctuary Chatbot",
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
          additionalSubjects: "Booked via Floating AI Assistant with Composio Google Calendar sync",
          howDidYouHear: "Floating AI Widget",
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
        notes: "Booked via Floating AI Chatbot",
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
          content: `✨ Wonderful! Your session for **${selectedService.name}** on **${bookingDate} at ${bookingTime}** is confirmed and synced to Google Calendar via Composio AI.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          bookingData: bookingInfo,
        },
      ]);

      toast.success("Appointment booked and synced to Google Calendar!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to confirm booking. Please try again.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <aside aria-label="AI Sanctuary Chatbot Widget" className="fixed bottom-5 right-5 z-50 flex flex-col items-end" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Floating Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[410px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden mb-3 animate-in fade-in-50 zoom-in-95 duration-200">
          {/* Header with Practice Logo */}
          <div className="bg-[#0f2820] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src="/images/logo.png"
                  alt="Insight Works Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm font-serif leading-tight text-white">
                  Insight Works
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowInChatBooking(!showInChatBooking)}
                className="text-[11px] font-bold bg-gradient-to-r from-[#156e52] to-[#52b74c] hover:from-[#0f5940] hover:to-[#439c3e] text-white px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
              >
                <Calendar className="w-3 h-3" />
                {showInChatBooking ? "Back to Chat" : "Book"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-white border border-emerald-200 p-0.5 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <img
                      src="/images/logo.png"
                      alt="Insight Works Avatar"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="space-y-1.5 max-w-[82%]">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed shadow-2xs ${
                      m.role === "user"
                        ? "bg-[#156e52] text-white rounded-tr-none"
                        : "bg-white border border-slate-200/90 text-[#0f2820] rounded-tl-none"
                    }`}
                  >
                    <MarkdownMessage
                      content={m.content || (isTyping ? "Thinking..." : "")}
                      isUser={m.role === "user"}
                    />

                    {/* Book Appointment CTA inside assistant responses */}
                    {m.role === "assistant" && m.id !== "welcome" && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setShowInChatBooking(true)}
                          className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-[#156e52] border border-emerald-200 px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                        >
                          <Calendar className="w-3 h-3 text-[#156e52]" /> Book Appointment
                        </button>
                        <a
                          href="https://wa.me/27795501557"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-slate-400 hover:text-[#156e52] font-semibold"
                        >
                          WhatsApp Practice
                        </a>
                      </div>
                    )}
                  </div>

                  {m.bookingData && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2 text-[11px] shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[#156e52] font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Appointment Synced with Composio</span>
                      </div>
                      <p className="text-slate-600">
                        <strong>{m.bookingData.serviceType}</strong> on {m.bookingData.date} at {m.bookingData.timeSlot}
                      </p>
                      <a
                        href={m.bookingData.gcalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-[#156e52] text-white px-3 py-1.5 rounded-xl font-bold text-[11px] hover:bg-[#0f5940] shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" /> Add to Google Calendar
                      </a>
                    </div>
                  )}

                  <span className="text-[9px] text-slate-400 block px-1">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && messages[messages.length - 1]?.content === "" && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-full bg-white border border-emerald-200 p-0.5 flex items-center justify-center shrink-0">
                  <img src="/images/logo.png" alt="Insight Works Avatar" className="w-full h-full object-contain animate-pulse" />
                </div>
                <div className="bg-white border border-slate-200 p-2.5 rounded-2xl text-[11px] text-slate-500 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Insight Works AI is replying...
                </div>
              </div>
            )}

            {/* In-Chat Booking Form Card */}
            {showInChatBooking && (
              <div className="bg-white border-2 border-emerald-400 rounded-2xl p-4 shadow-md space-y-3 animate-in fade-in-50 text-xs">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <span className="font-bold text-[#0f2820] font-serif flex items-center gap-1 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[#156e52]" /> Book Therapy Session
                  </span>
                  <button onClick={() => setShowInChatBooking(false)} className="text-[10px] text-slate-400 hover:text-slate-600">
                    Close
                  </button>
                </div>

                <form onSubmit={handleInChatBookingSubmit} className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Discipline</label>
                    <select
                      value={selectedService.id}
                      onChange={(e) => {
                        const s = serviceOptions.find((opt) => opt.id === e.target.value);
                        if (s) setSelectedService(s);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-medium"
                    >
                      {serviceOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} · {s.rate}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedFormat("telehealth")}
                      className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                        selectedFormat === "telehealth"
                          ? "bg-emerald-50 border-[#156e52] text-[#156e52]"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      <Video className="w-3 h-3" /> Telehealth
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedFormat("in_person")}
                      className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer ${
                        selectedFormat === "in_person"
                          ? "bg-emerald-50 border-[#156e52] text-[#156e52]"
                          : "bg-white border-slate-200 text-slate-600"
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-[#ea7627]" /> Room (JHB)
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]"
                    />
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="WhatsApp / Phone Number"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full bg-[#156e52] hover:bg-[#0f5940] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingBooking ? "Syncing Calendar..." : `Confirm Session (${selectedService.rate})`}
                  </button>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick starter chips with hidden scrollbars */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-[10px] whitespace-nowrap">
            {starterQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="bg-white border border-slate-200 text-slate-600 hover:border-[#156e52] hover:text-[#156e52] px-2.5 py-1 rounded-full transition-colors cursor-pointer shrink-0 shadow-2xs font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar with always-accessible "Book Appointment" button */}
          <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowInChatBooking(!showInChatBooking)}
              title="Book Appointment"
              className="bg-emerald-50 hover:bg-emerald-100 text-[#156e52] border border-emerald-200 p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book</span>
            </button>

            <input
              type="text"
              placeholder="Ask a question or request a session..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#0f2820] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#156e52]"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping}
              className="bg-[#156e52] hover:bg-[#0f5940] text-white p-2 rounded-xl transition-colors cursor-pointer disabled:opacity-40 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Trigger Floating Action Button with Logo Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 bg-gradient-to-r from-[#156e52] to-[#52b74c] hover:from-[#0f5940] hover:to-[#439c3e] text-white pl-2 pr-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-white/50 overflow-hidden select-none whitespace-nowrap outline-none ring-0"
      >
        <div className="relative w-8 h-8 rounded-full bg-white p-0.5 border border-emerald-300/60 shrink-0 flex items-center justify-center">
          <img src="/images/logo.png" alt="Insight Works" className="w-full h-full object-contain" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping pointer-events-none" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full pointer-events-none" />
        </div>
        <span className="text-xs font-bold tracking-wide select-none">
          {isOpen ? "Close Assistant" : "AI Sanctuary Chat"}
        </span>
      </button>
    </aside>
  );
}
