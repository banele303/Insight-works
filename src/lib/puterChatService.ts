import { CLOUDFLARE_WORKER_URL } from "./cloudflareWorker";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  showBookingCard?: boolean;
  bookingData?: any;
}

const THERAPY_SYSTEM_PROMPT = `You are the empathetic, knowledgeable Information & Intake AI Assistant for Insight Works Therapy & Coaching in South Africa, founded by Maletsatsi Sibanda (Counselling Therapist & Life Coach).

Practice Information:
- Practitioner: Maletsatsi Sibanda (Counselling Therapist & Life Coach, HPCSA Registered)
- Phone / WhatsApp: +27 79 550 1557
- Email: maletsatsi@insightherapyandcoaching.co.za
- Location: 9 Moray Drive, Bryanston, Sandton, 2091 (In-person rooms & Telehealth video nationwide & international)
- Tagline: "You don't have to face life's challenges alone. Together, we can help you heal, grow, reconnect, and thrive."

Operating & Consulting Hours:
- Monday to Friday: 08:00 – 18:00 (8:00 AM – 6:00 PM) -> Closing time is 18:00 (6:00 PM) on weekdays.
- Saturday: 09:00 – 13:00 (9:00 AM – 1:00 PM) -> Closing time is 13:00 (1:00 PM) on Saturdays.
- Sunday: Closed (Urgent inquiries via WhatsApp or 24/7 SADAG helpline).

The 7 Core Care Disciplines & Rates:
1. Individual Counselling (R650 – R850 / 60 min) - Anxiety, depression, stress, life transitions.
2. Couples & Relationship Counselling (R850 – R1,100 / 75 min) - Communication, conflict resolution, intimacy rebuild.
3. Life Coaching & Self-Mastery (R600 – R800 / 50 min) - Goal alignment, mindset breakthroughs, habit mastery.
4. Trauma Recovery & Emotional Healing (R750 – R950 / 60 min) - PTSD, EMDR techniques, somatic emotional processing.
5. Youth & Young Adult Support (R550 – R750 / 50 min) - Academic burnout, peer pressure, identity.
6. Substance Use Support (R700 – R900 / 60 min) - Relapse prevention, recovery scaffolding, harm reduction.
7. Free Initial Consultation (Free / 15 min) - Discover the right therapeutic fit.

Immediate Crisis Line:
If someone is in acute distress or experiencing suicidal thoughts, provide SADAG: 0800 456 789 (24/7 Helpline) or Suicide Crisis Line: 0800 567 567.

Your role:
- Answer user questions warmly, accurately, and empathetically.
- If asked about hours or when we close, state clearly: Monday–Friday 08:00–18:00 (closes at 6 PM), and Saturday 09:00–13:00 (closes at 1 PM).
- If asked about booking or scheduling, encourage clicking the 'Book Appointment' button directly in the chat.`;

/**
 * Streams AI response using Cloudflare Workers AI (Llama 3.3 70B) with smooth typewriter playback.
 */
export async function streamTherapyChat(
  userMessage: string,
  history: ChatMessage[] = [],
  onChunk: (accumulatedText: string) => void
): Promise<string> {
  let fullReply = "";

  const formattedMessages = [
    ...history.slice(-6).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    })),
    { role: "user", content: userMessage },
  ];

  // Call Cloudflare Workers AI API (Llama 3.3 70B)
  try {
    const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/therapy-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: formattedMessages }),
    });

    if (res.ok) {
      const data = await res.json();
      fullReply = data.response || "";
    }
  } catch (error) {
    console.warn("Cloudflare Workers AI request failed, falling back:", error);
  }

  // If network is offline or request failed, use smart local clinical knowledge
  if (!fullReply) {
    fullReply = getSmartTherapyFallback(userMessage);
  }

  // Smooth typewriter playback for live conversational experience
  const words = fullReply.split(" ");
  let currentAccumulated = "";
  for (let i = 0; i < words.length; i++) {
    currentAccumulated += (i > 0 ? " " : "") + words[i];
    onChunk(currentAccumulated);
    await new Promise((r) => setTimeout(r, 14)); // 14ms per word chunk
  }

  return fullReply;
}

// Backwards-compatible alias for existing imports
export const streamPuterChat = streamTherapyChat;

export async function sendPuterChat(
  userMessage: string,
  history: ChatMessage[] = []
): Promise<string> {
  return streamTherapyChat(userMessage, history, () => {});
}


