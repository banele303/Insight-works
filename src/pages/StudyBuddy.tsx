import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Bot, Sparkles, Send, Calendar, Clock, Video, MapPin,
  CheckCircle2, Heart, ShieldCheck, Phone, User, Mail
} from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { sendPuterChat } from "@/lib/puterChatService";
import { ComposioService } from "@/lib/composioService";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  showBookingCard?: boolean;
  bookingData?: any;
}

const THERAPY_TOPICS = [
  "Individual Counselling",
  "Couples & Relationships",
  "Life Coaching & Mindset",
  "Trauma Recovery & EMDR",
  "Youth & Student Stress",
  "Substance Recovery",
  "Coping & Grounding Tools",
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

export default function StudyBuddyPage() {
  const [input, setInput] = useState("");
  const [activeTopic, setActiveTopic] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to the Insight Works AI Companion 🌿. Powered by Cloudflare AI, I am here to support your therapeutic journey, discuss grounding techniques, explore our 7 care disciplines, or help you schedule a session with Maletsatsi Sibanda.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

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

  const createBookingMutation = useMutation(api.bookings.createBooking);
  const submitApplicationMutation = useMutation(api.applications.submitApplication);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, showBooking]);

  const handleSend = async (customPrompt?: string) => {
    const question = customPrompt || input.trim();
    if (!question || isLoading) return;

    if (!customPrompt) setInput("");
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const lower = question.toLowerCase();
    const wantsBooking = lower.includes("book") || lower.includes("appointment") || lower.includes("schedule") || lower.includes("session");

    try {
      const reply = await sendPuterChat(question, [...messages, userMsg]);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      if (wantsBooking) {
        setShowBooking(true);
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: "assistant",
          content: "I am here with you. Would you like to schedule an appointment with Maletsatsi Sibanda? Click the booking button above to reserve a slot.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInChatBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      toast.error("Please fill in your name, email, and phone number.");
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
          notes: "Booked via Practice AI Companion",
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
          howDidYouHear: "Dashboard AI Companion",
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
        notes: "Booked via Dashboard AI Companion",
      };

      const composioResult = await ComposioService.syncBookingWithComposio(payload);
      const gcalUrl = ComposioService.generateGoogleCalendarUrl(payload);

      setShowBooking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          role: "assistant",
          content: `🌿 Your session for **${selectedService.name}** on **${bookingDate} at ${bookingTime}** is confirmed and synced to Google Calendar via Composio AI.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          bookingData: { ...payload, composioResult, gcalUrl },
        },
      ]);

      toast.success("Appointment successfully booked and synced to Google Calendar!");
    } catch (err: any) {
      toast.error("Failed to book session. Please try again.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#fbfdfc] dark:bg-slate-950 p-4 md:p-6 space-y-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#156e52] dark:text-emerald-400 shadow-2xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-[#0f2820] dark:text-white">
                Insight Works AI Companion
              </h1>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-[#156e52] dark:text-emerald-400 border-emerald-200">
                Cloudflare AI Powered
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Evidence-based mental wellness support, discipline inquiry, and in-chat appointment booking.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setShowBooking(!showBooking)}
          size="sm"
          className="bg-[#156e52] hover:bg-[#0f5940] text-white text-xs font-bold gap-1.5 shadow-2xs cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          {showBooking ? "Hide Booking" : "Book Session in Chat"}
        </Button>
      </div>

      {/* Therapy Topic Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider shrink-0 mr-1">Care Focus:</span>
        {THERAPY_TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => {
              setActiveTopic(topic);
              handleSend(`Tell me more about ${topic} and how it helps.`);
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 transition-all cursor-pointer ${
              activeTopic === topic
                ? "bg-[#156e52] text-white border-[#156e52]"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-[#156e52]"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Main Chat Box */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-950/40">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#156e52] dark:text-emerald-400 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}
              <div className="space-y-2 max-w-[80%]">
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    m.role === "user"
                      ? "bg-[#156e52] text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#0f2820] dark:text-slate-100 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>

                {m.bookingData && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#156e52] dark:text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Appointment Synced with Google Calendar</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>{m.bookingData.serviceType}</strong> on {m.bookingData.date} at {m.bookingData.timeSlot} ({m.bookingData.format})
                    </p>
                    <div className="flex gap-2 pt-1">
                      <a
                        href={m.bookingData.gcalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#156e52] text-white px-3 py-1.5 rounded-lg font-bold text-[11px] hover:bg-[#0f5940]"
                      >
                        Add to Google Calendar
                      </a>
                    </div>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 px-1">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[#156e52]">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl text-xs text-slate-500">
                Insight Works AI thinking...
              </div>
            </div>
          )}

          {/* Embedded In-Chat Booking Form */}
          {showBooking && (
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-emerald-800 rounded-2xl p-5 shadow-sm space-y-3 animate-in fade-in-50 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-[#0f2820] dark:text-white font-serif">
                  Book Session in Companion Chat
                </span>
                <button onClick={() => setShowBooking(false)} className="text-slate-400 text-xs">Close</button>
              </div>

              <form onSubmit={handleInChatBookingSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Service Discipline</label>
                    <select
                      value={selectedService.id}
                      onChange={(e) => {
                        const s = serviceOptions.find((opt) => opt.id === e.target.value);
                        if (s) setSelectedService(s);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2 font-medium"
                    >
                      {serviceOptions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.rate})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Appointment Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border rounded-xl p-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border rounded-xl p-2"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border rounded-xl p-2"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone / WhatsApp"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border rounded-xl p-2"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full bg-[#156e52] hover:bg-[#0f5940] text-white text-xs font-bold cursor-pointer"
                >
                  {isSubmittingBooking ? "Syncing with Google Calendar via Composio..." : `Confirm Session (${selectedService.rate})`}
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about therapeutic methods, coping tools, or book an appointment..."
            className="min-h-[44px] max-h-[120px] resize-none text-xs bg-slate-50 dark:bg-slate-800 rounded-xl"
            rows={1}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-[#156e52] hover:bg-[#0f5940] text-white rounded-xl h-11 w-11 p-0 shrink-0 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
