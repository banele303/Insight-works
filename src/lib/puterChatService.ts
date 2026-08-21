import { CLOUDFLARE_WORKER_URL } from "./cloudflareWorker";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  showBookingCard?: boolean;
  bookingData?: any;
}

const THERAPY_SYSTEM_PROMPT = `You are the empathetic, knowledgeable Information & Intake Assistant for Insight Works Therapy & Coaching in South Africa, led by Maletsatsi Sibanda (Counselling Therapist & Life Coach).

Practice Information:
- Practitioner: Maletsatsi Sibanda (Counselling Therapist & Life Coach, HPCSA Registered)
- Phone / WhatsApp: +27 79 550 1557
- Email: maletsatsi@insightherapyandcoaching.co.za
- Location: Johannesburg, South Africa (In-person rooms & Telehealth nationwide)
- Tagline: "You don't have to face life's challenges alone. Together, we can help you heal, grow, reconnect, and thrive."

The 7 Core Disciplines:
1. Individual Counselling (R650 – R850 / 60 min)
2. Couples & Relationship Counselling (R850 – R1,100 / 75 min)
3. Life Coaching & Self-Mastery (R600 – R800 / 50 min)
4. Trauma Recovery & Emotional Healing (R750 – R950 / 60 min)
5. Youth & Young Adult Support (R550 – R750 / 50 min)
6. Substance Use Support (R700 – R900 / 60 min)
7. Free Initial Consultation (Free / 15 min)

Immediate Crisis Line:
If someone is experiencing suicidal thoughts or severe distress, always mention SADAG: 0800 456 789 (24/7 Helpline).

Your role:
- Answer questions warmly, professionally, and with empathy.
- Keep answers concise, clear, and reassuring.
- When the user asks to book an appointment, schedule a session, or asks for rates/availability, kindly offer them the booking options and encourage them to click 'Book Appointment' right here in the chat.`;

let puterLoaded = false;
let puterLoadingPromise: Promise<boolean> | null = null;

export async function loadPuter(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if ((window as any).puter) return true;
  if (puterLoaded) return true;
  if (puterLoadingPromise) return puterLoadingPromise;

  puterLoadingPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    script.onload = () => {
      puterLoaded = true;
      resolve(true);
    };
    script.onerror = () => {
      console.warn("Could not load external Puter.js CDN, using fallback.");
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return puterLoadingPromise;
}

/**
 * Streams AI response token-by-token for a cool, live typewriter experience using Cloudflare AI (Llama 3.3 70B)
 */
export async function streamPuterChat(
  userMessage: string,
  history: ChatMessage[] = [],
  onChunk: (accumulatedText: string) => void
): Promise<string> {
  let fullReply = "";

  try {
    const formattedMessages = [
      ...history.slice(-6).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: userMessage },
    ];

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
    console.warn("Cloudflare AI therapy chat request failed, using fallback:", error);
  }

  // Fallback intelligent responses if offline
  if (!fullReply) {
    const lower = userMessage.toLowerCase();
    if (lower.includes("book") || lower.includes("appointment") || lower.includes("schedule") || lower.includes("session")) {
      fullReply = "I would be delighted to help you book a session with Maletsatsi Sibanda. You can choose between In-Person consulting in Johannesburg or Telehealth video nationwide. Click the 'Book Appointment' button below to schedule instantly with Google Calendar sync!";
    } else if (lower.includes("price") || lower.includes("cost") || lower.includes("fee") || lower.includes("rate")) {
      fullReply = "Our session rates range from R650–R850 for Individual Counselling (60 min), R850–R1,100 for Couples Counselling (75 min), and R600–R800 for Life Coaching. We also offer a complimentary 15-minute initial consultation. You can schedule directly using the 'Book Appointment' button below!";
    } else if (lower.includes("anxiety") || lower.includes("depress") || lower.includes("stress") || lower.includes("overwhelm")) {
      fullReply = "Thank you for opening up. Experiencing emotional overwhelm or anxiety can feel isolating, but you do not have to walk this path alone. Maletsatsi provides compassionate, evidence-based guidance in a safe sanctuary. Would you like to schedule an introductory session?";
    } else {
      fullReply = "Welcome to Insight Works Therapy & Coaching. I can help guide you through our therapeutic disciplines, rates, and scheduling options. How may I best support you today?";
    }
  }

  // Smooth typewriter streaming output
  const words = fullReply.split(" ");
  let currentAccumulated = "";
  for (let i = 0; i < words.length; i++) {
    currentAccumulated += (i > 0 ? " " : "") + words[i];
    onChunk(currentAccumulated);
    await new Promise((r) => setTimeout(r, 18)); // 18ms per token
  }

  return fullReply;
}

export async function sendPuterChat(
  userMessage: string,
  history: ChatMessage[] = []
): Promise<string> {
  return streamPuterChat(userMessage, history, () => {});
}

