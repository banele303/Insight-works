export const CLOUDFLARE_WORKER_URL =
  import.meta.env.VITE_CLOUDFLARE_WORKER_URL || "https://edunexus-ai.edusqwizooor.workers.dev";

export interface UploadResult {
  fileUrl: string;
  objectKey: string;
  contentType: string;
}

export interface IngestPayload {
  objectKey: string;
  filename: string;
  contentType: string;
  subjectId: string;
  materialId: string;
  title: string;
  description?: string;
}

export async function ingestMaterial(payload: IngestPayload): Promise<{
  extractedTextPreview: string;
  chunkCount: number;
}> {
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to index material for semantic search.");
  }

  const data = await res.json();
  return {
    extractedTextPreview: data.extractedTextPreview || "",
    chunkCount: data.chunkCount || 0,
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chatWithAI(
  messages: ChatMessage[],
  subjectName?: string
): Promise<string> {
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, subjectName }),
  });

  if (!res.ok) {
    throw new Error("Failed to chat with AI. Is the Cloudflare Worker running?");
  }

  const data = await res.json();
  return data.response;
}

export async function gradeHomeworkWithAI(payload: {
  question: string;
  studentAnswer?: string;
  subjectName?: string;
  gradeLevel?: number;
}): Promise<{ grade: number; feedback: string; correctAnswer?: string }> {
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/grade-assignment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to grade homework.");
  }

  return res.json();
}

export async function createStreamDirectUpload(payload: {
  name: string;
  creator?: string;
  maxDurationSeconds?: number;
}): Promise<{ uid: string; uploadURL: string }> {
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/stream/direct-upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create Cloudflare Stream upload.");
  }

  return res.json();
}

export async function createStreamLiveInput(payload: {
  title: string;
  preferLowLatency?: boolean;
}): Promise<{
  uid: string;
  rtmpsUrl?: string;
  streamKey?: string;
  srtUrl?: string;
  srtStreamId?: string;
  srtPassphrase?: string;
  whipUrl?: string;
  whepUrl?: string;
  playbackUrl?: string;
  iframeUrl?: string;
}> {
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/live/create-input`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create Cloudflare live input.");
  }

  return res.json();
}

export async function uploadVideoToStream(uploadURL: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(uploadURL, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Cloudflare Stream upload failed.");
  }
}

export async function getLiveInputRecordings(whipUrlOrUid: string): Promise<any[]> {
  const uid = whipUrlOrUid.includes("/") ? whipUrlOrUid.split("/").filter(Boolean).pop() : whipUrlOrUid;
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/live/input/${uid}/recordings`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch recordings.");
  }
  return res.json();
}

export async function markScannedWork(payload: {
  title: string;
  subjectName?: string;
  gradeLevel?: number;
  questionText?: string;
  memoText?: string;
  studentText?: string;
  rubric?: string;
}): Promise<{
  mark: number;
  maxMark: number;
  percentage: number;
  level: string;
  feedback: string;
  teacherNotes: string;
  corrections: string[];
  rubricBreakdown?: { criterion: string; mark: number; comment: string }[];
}> {
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/mark-scanned-work`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to mark scanned work.");
  }

  return res.json();
}

export async function uploadFileToR2(file: File, metadata: Record<string, string> = {}): Promise<UploadResult> {
  const targetRes = await fetch(`${CLOUDFLARE_WORKER_URL}/api/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
  });

  if (!targetRes.ok) {
    const err = await targetRes.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create upload URL.");
  }

  const target = await targetRes.json();
  const uploadRes = await fetch(target.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "X-Upload-Metadata": JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream",
        ...metadata,
      }),
    },
    body: file,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err.error || "Failed to upload file.");
  }

  return {
    fileUrl: target.fileUrl,
    objectKey: target.objectKey,
    contentType: file.type || "application/octet-stream",
  };
}

export async function searchMaterials(query: string, items: any[]): Promise<string[]> {
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, items }),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.ids || [];
}

// ─── CLOUDFLARE TURN CREDENTIALS ─────────────────────────────────────────────
// Fetches short-lived ICE server credentials (STUN + TURN) from the worker.
// The API token never leaves the server — only the resulting credentials are returned.
export interface IceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export async function fetchTurnCredentials(): Promise<IceServer[]> {
  try {
    const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/turn/credentials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("TURN credentials fetch failed");
    const data = (await res.json()) as { iceServers?: IceServer[] | IceServer };
    if (!data.iceServers) {
      return [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }];
    }
    const servers = Array.isArray(data.iceServers) ? data.iceServers : [data.iceServers];
    return servers;
  } catch {
    // Fallback to public STUN if worker is unreachable
    return [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }];
  }
}

// ─── THERAPY SESSION AI NOTES ─────────────────────────────────────────────────
// Sends a session transcript to the worker and returns structured AI-generated notes.
export interface SessionNotes {
  sessionSummary: string;
  presentingConcerns: string[];
  keyThemes: string[];
  clientProgress: string;
  interventionsUsed: string[];
  actionItems: string[];
  followUpRecommendations: string[];
  riskFactors: string;
  practitionerNotes: string;
}

export async function generateSessionNotes(payload: {
  transcript: string;
  sessionType?: string;
  duration?: string;
}): Promise<{ notes: SessionNotes; generatedAt: string }> {
  const res = await fetch(`${CLOUDFLARE_WORKER_URL}/api/session/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(err.error || "Failed to generate session notes");
  }

  return res.json();
}
