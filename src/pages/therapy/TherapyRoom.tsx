import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { fetchTurnCredentials, generateSessionNotes } from "@/lib/cloudflareWorker";
import type { SessionNotes } from "@/lib/cloudflareWorker";
import {
  Mic, MicOff, Video as VideoIcon, VideoOff, Monitor, PhoneOff,
  MessageSquare, FileText, Sparkles, Shield, Copy,
  ChevronRight, Download, RotateCcw, AlertCircle,
  CheckCircle, Clock, Users, Heart
} from "lucide-react";
import { ThemeModeToggle } from "@/components/theme/ThemeModeToggle";

function formatDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0
    ? `${h}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

type SidebarTab = "chat" | "transcript" | "notes";

export default function TherapyRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const myName = searchParams.get("name") ?? user?.name ?? "Unknown";
  const initialMic = searchParams.get("mic") !== "false";
  const initialCam = searchParams.get("cam") !== "false";
  const sessionType = searchParams.get("type") ?? "Therapy Session";

  // @ts-ignore
  const session = useQuery(api.therapySessions.getSession, roomId ? { roomId } : "skip");
  // @ts-ignore
  const updateStatus = useMutation(api.therapySessions.updateSessionStatus);
  // @ts-ignore
  const sendSignal = useMutation(api.therapySessions.sendSignal);
  // @ts-ignore
  const clearSignals = useMutation(api.therapySessions.clearProcessedSignals);
  // @ts-ignore
  const appendTx = useMutation(api.therapySessions.appendTranscript);
  // @ts-ignore
  const saveManual = useMutation(api.therapySessions.saveManualNotes);
  // @ts-ignore
  const saveAiNotesMutation = useMutation(api.therapySessions.saveAiNotes);

  const isTherapist = user?.role === "teacher" || user?.role === "admin";
  const myId = user?._id ? String(user._id) : `guest:${myName}`;

  const [micOn, setMicOn] = useState(initialMic);
  const [camOn, setCamOn] = useState(initialCam);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("transcript");
  const [showSidebar, setShowSidebar] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([]);
  const [manualNotes, setManualNotes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [aiNotes, setAiNotes] = useState<SessionNotes | null>(null);
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartMs, setSessionStartMs] = useState<number | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<"good" | "fair" | "poor" | "unknown">("unknown");
  const [isEnding, setIsEnding] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [iceServers, setIceServers] = useState<RTCIceServer[]>([]);
  const [transcribing, setTranscribing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const processedSigs = useRef<Set<string>>(new Set());
  const recognitionRef = useRef<any>(null);
  const txBufferRef = useRef<string>("");
  const manualNotesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statsInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // Fetch TURN credentials
  useEffect(() => {
    fetchTurnCredentials().then(setIceServers).catch(() => {
      setIceServers([{ urls: "stun:stun.l.google.com:19302" }]);
    });
  }, []);

  // Start local media with resilient fallback
  useEffect(() => {
    if (iceServers.length === 0) return;
    const start = async () => {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: initialCam,
          audio: initialMic,
        });
      } catch (err) {
        console.warn("Primary media device not found, trying fallback:", err);
        if (initialMic) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setCamOn(false);
          } catch { /* noop */ }
        }
        if (!stream && initialCam) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setMicOn(false);
          } catch { /* noop */ }
        }
      }

      if (stream) {
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getAudioTracks().forEach((t) => { t.enabled = initialMic; });
        stream.getVideoTracks().forEach((t) => { t.enabled = initialCam; });
      }
    };
    start();
    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      pcRef.current?.close();
    };
  }, [iceServers]);

  // Session timer
  useEffect(() => {
    if (isConnected && !sessionStartMs) {
      const now = Date.now();
      setSessionStartMs(now);
      durationInterval.current = setInterval(() => setSessionDuration(Date.now() - now), 1000);
      updateStatus({ roomId: roomId!, status: "active" }).catch(console.error);
    }
    return () => { if (durationInterval.current) clearInterval(durationInterval.current); };
  }, [isConnected]);

  const createPc = useCallback(() => {
    if (pcRef.current) pcRef.current.close();
    const servers = Array.isArray(iceServers) && iceServers.length > 0
      ? iceServers
      : [{ urls: "stun:stun.cloudflare.com:3478" }, { urls: "stun:stun.l.google.com:19302" }];
    const pc = new RTCPeerConnection({ iceServers: servers });
    pcRef.current = pc;
    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        const rs = event.streams[0] ?? new MediaStream([event.track]);
        remoteVideoRef.current.srcObject = rs;
        remoteVideoRef.current.play().catch(() => {
          if (remoteVideoRef.current) { remoteVideoRef.current.muted = true; remoteVideoRef.current.play().catch(console.warn); }
        });
      }
    };

    pc.onicecandidate = (e) => {
      if (e.candidate && roomId) {
        sendSignal({ roomId, sender: myId, target: "other", type: "candidate", payload: JSON.stringify(e.candidate) }).catch(console.error);
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      setIsConnected(state === "connected");
      setRemoteConnected(state === "connected" || state === "connecting");
      if (state === "failed") {
        toast.error("Connection lost. Retrying...");
        setTimeout(() => initiateCall(), 3000);
      }
    };

    if (statsInterval.current) clearInterval(statsInterval.current);
    statsInterval.current = setInterval(async () => {
      try {
        const stats = await pc.getStats();
        let rtt = 0; let loss = 0;
        stats.forEach((r: any) => {
          if (r.type === "remote-inbound-rtp" && r.kind === "video") { rtt = r.roundTripTime ?? 0; loss = r.fractionLost ?? 0; }
        });
        setConnectionQuality(rtt < 0.1 && loss < 0.02 ? "good" : rtt < 0.3 && loss < 0.05 ? "fair" : "poor");
      } catch { /* noop */ }
    }, 5000);

    return pc;
  }, [iceServers, myId, roomId]);

  const initiateCall = useCallback(async () => {
    if (!roomId) return;
    const pc = createPc();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await sendSignal({ roomId, sender: myId, target: "other", type: "offer", payload: JSON.stringify({ type: offer.type, sdp: offer.sdp }) });
  }, [createPc, myId, roomId, sendSignal]);
  useEffect(() => {
    if (!session?.signals || !roomId) return;
    const process = async () => {
      const mine = (session.signals ?? []).filter((s: any) => (s.target === myId || s.target === "other") && s.sender !== myId && !processedSigs.current.has(s.id));
      if (mine.length === 0) return;
      const toAck: string[] = [];
      for (const sig of mine) {
        processedSigs.current.add(sig.id);
        toAck.push(sig.id);
        try {
          if (sig.type === "offer") {
            const pc = createPc();
            await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(sig.payload)));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await sendSignal({ roomId, sender: myId, target: sig.sender, type: "answer", payload: JSON.stringify({ type: answer.type, sdp: answer.sdp }) });
          } else if (sig.type === "answer" && pcRef.current?.signalingState === "have-local-offer") {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(sig.payload)));
          } else if (sig.type === "candidate" && pcRef.current?.remoteDescription) {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(JSON.parse(sig.payload)));
          }
        } catch (err) { console.warn("Signal err:", err); }
      }
      if (toAck.length > 0) clearSignals({ roomId, signalIds: toAck }).catch(console.error);
    };
    process();
  }, [session?.signals]);

  useEffect(() => {
    if (iceServers.length > 0 && isTherapist && !pcRef.current) {
      const t = setTimeout(() => initiateCall(), 2000);
      return () => clearTimeout(t);
    }
  }, [iceServers, isTherapist]);

  const startTranscription = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { toast.error("Transcription requires Chrome or Edge."); return; }
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = "en-ZA";
    recognitionRef.current = rec;
    rec.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.trim();
          if (!text) continue;
          const ts = new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
          setTranscript((p) => p ? `${p}\n[${ts}] ${myName}: ${text}` : `[${ts}] ${myName}: ${text}`);
          txBufferRef.current += ` ${text}`;
          if (txBufferRef.current.split(" ").length >= 10) {
            const chunk = txBufferRef.current.trim(); txBufferRef.current = "";
            appendTx({ roomId: roomId!, chunk, speaker: myName }).catch(console.error);
          }
        }
      }
    };
    rec.onerror = (e: any) => { if (e.error !== "no-speech") console.warn(e.error); };
    rec.onend = () => { if (transcribing) rec.start(); };
    rec.start();
    setTranscribing(true);
    toast.success("Transcription started", { icon: "???" });
  }, [roomId, myName, appendTx]);

  const stopTranscription = useCallback(() => {
    recognitionRef.current?.stop();
    setTranscribing(false);
    if (txBufferRef.current.trim()) {
      appendTx({ roomId: roomId!, chunk: txBufferRef.current.trim(), speaker: myName }).catch(console.error);
      txBufferRef.current = "";
    }
  }, [roomId, myName, appendTx]);

  const toggleMic = () => {
    const t = localStreamRef.current?.getAudioTracks()[0];
    if (t) { t.enabled = !t.enabled; setMicOn(t.enabled); }
  };

  const toggleCam = () => {
    const t = localStreamRef.current?.getVideoTracks()[0];
    if (t) { t.enabled = !t.enabled; setCamOn(t.enabled); }
  };

  const stopScreenShare = useCallback(() => {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setIsScreenSharing(false);
    const camTrack = localStreamRef.current?.getVideoTracks()[0];
    if (camTrack && pcRef.current) {
      pcRef.current.getSenders().find((s) => s.track?.kind === "video")?.replaceTrack(camTrack);
    }
  }, []);

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
    } else {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = screen;
        const st = screen.getVideoTracks()[0];
        if (pcRef.current && st) {
          pcRef.current.getSenders().find((s) => s.track?.kind === "video")?.replaceTrack(st);
        }
        setIsScreenSharing(true);
        setTimeout(() => {
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = screen;
          }
        }, 50);
        st.onended = () => stopScreenShare();
        toast.success("Screen sharing started on main stage");
      } catch {
        toast.error("Screen share cancelled");
      }
    }
  };

  const handleNotesChange = (val: string) => {
    setManualNotes(val);
    if (manualNotesTimer.current) clearTimeout(manualNotesTimer.current);
    manualNotesTimer.current = setTimeout(() => saveManual({ roomId: roomId!, notes: val }).catch(console.error), 1500);
  };

  const handleGenerateNotes = async () => {
    const tx = session?.transcript ?? transcript;
    if (!tx || tx.trim().length < 50) { toast.error("Not enough transcript yet."); return; }
    setGeneratingNotes(true);
    try {
      const duration = sessionStartMs ? formatDuration(Date.now() - sessionStartMs) : undefined;
      const result = await generateSessionNotes({ transcript: tx, sessionType, duration });
      setAiNotes(result.notes);
      await saveAiNotesMutation({ roomId: roomId!, aiNotes: JSON.stringify(result.notes) });
      setSidebarTab("notes");
      toast.success("Session notes generated!", { icon: "?" });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to generate notes");
    } finally { setGeneratingNotes(false); }
  };

  const handleDownloadNotes = () => {
    if (!aiNotes) return;
    const lines = [
      "INSIGHT THERAPY & COACHING � SESSION NOTES",
      `Session Type: ${sessionType}`,
      `Date: ${new Date().toLocaleDateString("en-ZA")}`,
      `Duration: ${formatDuration(sessionDuration)}`,
      "",
      "SESSION SUMMARY",
      aiNotes.sessionSummary,
      "",
      "PRESENTING CONCERNS",
      ...(aiNotes.presentingConcerns ?? []).map((c) => `� ${c}`),
      "",
      "KEY THEMES",
      ...(aiNotes.keyThemes ?? []).map((t) => `� ${t}`),
      "",
      "CLIENT PROGRESS",
      aiNotes.clientProgress,
      "",
      "INTERVENTIONS USED",
      ...(aiNotes.interventionsUsed ?? []).map((i) => `� ${i}`),
      "",
      "ACTION ITEMS",
      ...(aiNotes.actionItems ?? []).map((a) => `� ${a}`),
      "",
      "FOLLOW-UP",
      ...(aiNotes.followUpRecommendations ?? []).map((r) => `� ${r}`),
      "",
      "RISK FACTORS",
      aiNotes.riskFactors,
      "",
      "PRACTITIONER NOTES (PRIVATE)",
      aiNotes.practitionerNotes,
      "",
      manualNotes ? `MY NOTES\n${manualNotes}\n` : "",
      "TRANSCRIPT",
      session?.transcript ?? transcript,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `session-${roomId}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((p) => [...p, { id: `m${Date.now()}`, sender: myName, text: chatInput.trim(), time: new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }) }]);
    setChatInput("");
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    setShowEndConfirm(false);
    if (transcribing) stopTranscription();
    const tx = session?.transcript ?? transcript;
    if (tx && tx.trim().length >= 50 && !aiNotes) {
      try {
        setGeneratingNotes(true);
        const duration = sessionStartMs ? formatDuration(Date.now() - sessionStartMs) : undefined;
        const result = await generateSessionNotes({ transcript: tx, sessionType, duration });
        setAiNotes(result.notes);
        await saveAiNotesMutation({ roomId: roomId!, aiNotes: JSON.stringify(result.notes) });
        setGeneratingNotes(false);
      } catch { /* continue */ }
    }
    if (manualNotes) await saveManual({ roomId: roomId!, notes: manualNotes }).catch(console.error);
    await updateStatus({ roomId: roomId!, status: "ended" }).catch(console.error);
    pcRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    if (statsInterval.current) clearInterval(statsInterval.current);
    if (durationInterval.current) clearInterval(durationInterval.current);
    toast.success("Session ended. Notes saved.");
    navigate("/dashboard");
  };

  const qualityColor =
    connectionQuality === "good"
      ? "bg-emerald-500"
      : connectionQuality === "fair"
      ? "bg-amber-500"
      : connectionQuality === "poor"
      ? "bg-red-500"
      : "bg-slate-400 dark:bg-slate-600";

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-[#0d1117] text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-200">

      {/* TOP BAR */}
      <header className="h-14 shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-slate-200 dark:border-slate-800/60 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-teal-500/10 dark:bg-teal-600/20 border border-teal-500/30 flex items-center justify-center shadow-xs">
            <Heart className="h-4 w-4 text-teal-600 dark:text-teal-400 fill-teal-500/20" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{sessionType}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Insight Therapy &amp; Coaching</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span className={cn("h-2 w-2 rounded-full", qualityColor)} />
            {isConnected ? "Connected" : remoteConnected ? "Connecting..." : "Waiting for participant"}
          </div>
          {isConnected && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-mono font-medium">
              <Clock className="h-3 w-3" />
              {formatDuration(sessionDuration)}
            </div>
          )}
          <button
            onClick={() => { navigator.clipboard.writeText(roomId ?? ""); toast.success("Room ID copied!"); }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition-all border border-slate-200 dark:border-slate-700 cursor-pointer"
          >
            <Copy className="h-3 w-3" />
            <span className="font-mono">{roomId?.slice(0, 8)}…</span>
          </button>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Shield className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" /> E2E Encrypted
          </div>
          <ThemeModeToggle compact className="h-8 w-8" />
        </div>
      </header>

      {/* MAIN BODY */}
      <div className="flex-1 flex overflow-hidden">

        {/* VIDEO AREA */}
        <section className="flex-1 relative bg-slate-950 dark:bg-[#080c10] overflow-hidden flex items-center justify-center">
          {isScreenSharing ? (
            /* MAIN STAGE: Live Screen Share */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
              <div className="absolute top-4 left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-xl">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>You are presenting your screen</span>
              </div>
            </div>
          ) : isConnected ? (
            /* MAIN STAGE: Remote Participant Video */
            <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            /* MAIN STAGE: Waiting State */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 bg-slate-950">
              <div className="relative">
                <div className="h-24 w-24 rounded-3xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-xl">
                  <Users className="h-10 w-10 text-teal-400" />
                </div>
                <span className="absolute inset-0 rounded-3xl border-2 border-teal-400/40 animate-ping" />
              </div>
              <div className="text-center max-w-sm">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
                  {isTherapist ? "👑 You are the Host · Room Live" : "Telehealth Waiting Room"}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isTherapist ? "Waiting for Client to Connect" : "Waiting for Practitioner"}
                </h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  {isTherapist
                    ? "Your video room and clinical note canvas are ready. Share this invite link with your client."
                    : "Your practitioner will connect momentarily. Please stay on this screen."}
                </p>
              </div>
              {isTherapist && (
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        window.location.origin +
                          "/therapy-lobby/" +
                          roomId +
                          "?type=" +
                          encodeURIComponent(sessionType)
                      );
                      toast.success("Client invite link copied to clipboard!");
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-lg shadow-teal-600/20 transition-all active:scale-95 cursor-pointer"
                  >
                    <Copy className="h-4 w-4" /> Copy Client Invite Link
                  </button>
                  <Button
                    onClick={initiateCall}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reconnect
                  </Button>
                </div>
              )}
            </div>
          )}

          {isConnected && !isScreenSharing && (
            <div className="absolute bottom-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur border border-white/10 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-sm text-white font-medium">{isTherapist ? (session?.clientName ?? "Client") : "Therapist"}</span>
            </div>
          )}

          {/* Local Camera Picture-in-Picture */}
          <div className="absolute bottom-6 right-6 w-36 h-24 md:w-48 md:h-32 rounded-2xl overflow-hidden border-2 border-white/20 dark:border-slate-700/60 shadow-2xl bg-slate-900 z-20">
            {camOn ? (
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <VideoOff className="h-6 w-6 text-slate-600" />
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 text-[10px] text-white/80 font-medium px-1.5 py-0.5 bg-black/50 backdrop-blur-xs rounded">You</div>
          </div>

          {generatingNotes && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-12 w-12 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
                <p className="text-white font-semibold">Generating AI session notes…</p>
                <p className="text-slate-400 text-sm">This takes 5–10 seconds</p>
              </div>
            </div>
          )}
        </section>

        {/* SIDEBAR */}
        {showSidebar && (
          <aside className="w-full md:w-[360px] shrink-0 border-l border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#0d1117] flex flex-col overflow-hidden shadow-sm transition-colors duration-200">
            <div className="flex border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-transparent">
              {(["transcript", "notes", "chat"] as SidebarTab[]).map((tab) => (
                <button key={tab} onClick={() => setSidebarTab(tab)}
                  className={cn("flex-1 py-3 text-xs font-bold capitalize flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer",
                    sidebarTab === tab
                      ? "border-teal-500 text-teal-700 dark:text-white bg-white dark:bg-slate-900/40 shadow-xs"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                >
                  {tab === "transcript" && <FileText className="h-3.5 w-3.5" />}
                  {tab === "notes" && <Sparkles className="h-3.5 w-3.5" />}
                  {tab === "chat" && <MessageSquare className="h-3.5 w-3.5" />}
                  {tab}
                  {tab === "notes" && aiNotes && <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />}
                </button>
              ))}
            </div>

            {sidebarTab === "transcript" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/30 dark:bg-transparent">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Transcript</p>
                  {!transcribing ? (
                    <button onClick={startTranscription} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-teal-50 dark:bg-teal-600/20 hover:bg-teal-100 dark:hover:bg-teal-600/30 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 text-xs font-bold cursor-pointer transition-all">
                      <Mic className="h-3 w-3" /> Start
                    </button>
                  ) : (
                    <button onClick={stopTranscription} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold animate-pulse cursor-pointer">
                      <span className="h-2 w-2 rounded-full bg-red-500" /> Recording
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-50/30 dark:bg-transparent">
                  {(session?.transcript ?? transcript) || (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400 dark:text-slate-600 text-center font-sans">
                      <FileText className="h-9 w-9 opacity-40" />
                      <p className="font-medium text-sm">Click "Start" to begin live transcription.</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-600">Audio will be transcribed in South African English.</p>
                    </div>
                  )}
                </div>
                {(session?.transcript ?? transcript) && (
                  <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-[#0d1117]">
                    <button onClick={handleGenerateNotes} disabled={generatingNotes}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50 shadow-lg shadow-teal-600/10 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      {generatingNotes ? "Generating…" : "Generate AI Notes"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {sidebarTab === "notes" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {aiNotes ? (
                  <>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-transparent">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        <p className="text-xs font-bold text-teal-700 dark:text-teal-400">AI-Generated Notes</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={handleGenerateNotes} title="Regenerate" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><RotateCcw className="h-3.5 w-3.5" /></button>
                        <button onClick={handleDownloadNotes} title="Download" className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><Download className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-50/30 dark:bg-transparent">
                      <NoteSection title="Session Summary" icon="📋"><p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiNotes.sessionSummary}</p></NoteSection>
                      {aiNotes.presentingConcerns?.length > 0 && (
                        <NoteSection title="Presenting Concerns" icon="🎯">
                          <ul className="space-y-1">{aiNotes.presentingConcerns.map((c, i) => <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300"><span className="text-teal-600 dark:text-teal-400 shrink-0">•</span>{c}</li>)}</ul>
                        </NoteSection>
                      )}
                      {aiNotes.keyThemes?.length > 0 && (
                        <NoteSection title="Key Themes" icon="🔑">
                          <div className="flex flex-wrap gap-1.5">{aiNotes.keyThemes.map((t, i) => <span key={i} className="px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-300 text-[11px] font-medium">{t}</span>)}</div>
                        </NoteSection>
                      )}
                      <NoteSection title="Client Progress" icon="📈"><p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiNotes.clientProgress}</p></NoteSection>
                      {aiNotes.interventionsUsed?.length > 0 && (
                        <NoteSection title="Interventions Used" icon="🛠️">
                          <ul className="space-y-1">{aiNotes.interventionsUsed.map((v, i) => <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300"><span className="text-indigo-600 dark:text-indigo-400 shrink-0">•</span>{v}</li>)}</ul>
                        </NoteSection>
                      )}
                      {aiNotes.actionItems?.length > 0 && (
                        <NoteSection title="Action Items" icon="✅">
                          <ul className="space-y-1">{aiNotes.actionItems.map((a, i) => <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300"><CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />{a}</li>)}</ul>
                        </NoteSection>
                      )}
                      {aiNotes.followUpRecommendations?.length > 0 && (
                        <NoteSection title="Follow-up" icon="📅">
                          <ul className="space-y-1">{aiNotes.followUpRecommendations.map((r, i) => <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300"><span className="text-amber-600 dark:text-amber-400 shrink-0">→</span>{r}</li>)}</ul>
                        </NoteSection>
                      )}
                      <NoteSection title="Risk Factors" icon="⚠️">
                        <p className={cn("leading-relaxed font-medium", aiNotes.riskFactors?.toLowerCase().includes("none") ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-300")}>{aiNotes.riskFactors}</p>
                      </NoteSection>
                      {aiNotes.practitionerNotes && (
                        <NoteSection title="Practitioner Notes (Private)" icon="🔒">
                          <p className="text-slate-600 dark:text-slate-400 italic leading-relaxed">{aiNotes.practitionerNotes}</p>
                        </NoteSection>
                      )}
                    </div>
                    <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-[#0d1117]">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-bold uppercase tracking-wider">My Notes (private)</p>
                      <textarea value={manualNotes} onChange={(e) => handleNotesChange(e.target.value)} placeholder="Add your own notes here…" rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500" />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 p-4 flex flex-col gap-4 bg-slate-50/20 dark:bg-transparent">
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <Sparkles className="h-10 w-10 text-teal-500/40" />
                      <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">No AI notes yet</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs max-w-[240px]">Start transcription then click Generate to get structured clinical notes.</p>
                      <button onClick={handleGenerateNotes} disabled={generatingNotes || !(session?.transcript ?? transcript)}
                        className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-600/20 dark:hover:bg-teal-600/30 border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-300 text-xs font-bold transition-all disabled:opacity-40 cursor-pointer shadow-xs">
                        <Sparkles className="h-4 w-4" /> Generate from transcript
                      </button>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 font-bold uppercase tracking-wider">My Notes (private, auto-saved)</p>
                      <textarea value={manualNotes} onChange={(e) => handleNotesChange(e.target.value)} placeholder="Type your session notes here…" rows={8}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-teal-500" />
                      <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">Auto-saved every 1.5 seconds</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {sidebarTab === "chat" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20 dark:bg-transparent">
                  {chatMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 dark:text-slate-600">
                      <MessageSquare className="h-8 w-8 opacity-30" />
                      <p className="text-xs text-center font-medium">No messages yet.</p>
                    </div>
                  ) : chatMessages.map((msg) => {
                    const isMe = msg.sender === myName;
                    return (
                      <div key={msg.id} className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "items-start")}>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 px-1">{msg.sender} · {msg.time}</span>
                        <div className={cn("px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow-xs", isMe ? "bg-teal-600 text-white rounded-tr-none" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700")}>
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleSendChat} className="flex gap-2 p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-[#0d1117]">
                  <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message…"
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500" />
                  <button type="submit" className="h-9 w-9 rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-xs">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* BOTTOM CONTROL BAR */}
      <footer className="h-20 shrink-0 bg-white/95 dark:bg-[#0d1117] border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between px-4 md:px-8 z-30 shadow-xs transition-colors duration-200">
        <div className="hidden md:flex items-center gap-4 min-w-[160px]">
          {isConnected && <div className="text-sm text-slate-800 dark:text-slate-300 font-mono font-bold">{formatDuration(sessionDuration)}</div>}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <span className={cn("h-2 w-2 rounded-full", qualityColor)} />
            {connectionQuality === "good" ? "Excellent" : connectionQuality === "fair" ? "Fair" : connectionQuality === "poor" ? "Poor" : "—"}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <ControlBtn active={!micOn} danger={!micOn} onClick={toggleMic} title={micOn ? "Mute" : "Unmute"}>
            {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </ControlBtn>
          <ControlBtn active={!camOn} danger={!camOn} onClick={toggleCam} title={camOn ? "Camera off" : "Camera on"}>
            {camOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </ControlBtn>
          <ControlBtn active={isScreenSharing} onClick={toggleScreenShare} title="Share screen">
            <Monitor className="h-5 w-5" />
          </ControlBtn>
          <ControlBtn active={transcribing} onClick={transcribing ? stopTranscription : startTranscription} title={transcribing ? "Stop transcription" : "Transcribe"}>
            <Mic className={cn("h-5 w-5", transcribing && "animate-pulse")} />
          </ControlBtn>
          {isTherapist && (
            <button onClick={handleGenerateNotes} disabled={generatingNotes} title="Generate AI notes" className="relative cursor-pointer">
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center border transition-all shadow-sm", "bg-gradient-to-br from-teal-500/20 to-indigo-500/20 dark:from-teal-600/30 dark:to-indigo-600/30 border-teal-500/40 text-teal-700 dark:text-teal-300 hover:border-teal-400 hover:scale-105", generatingNotes && "animate-pulse")}>
                <Sparkles className="h-5 w-5" />
              </div>
            </button>
          )}
          <button onClick={() => setShowEndConfirm(true)} className="cursor-pointer" title="End call">
            <div className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-500 border border-red-500/30 text-white flex items-center justify-center transition-all shadow-lg shadow-red-600/20 active:scale-95">
              <PhoneOff className="h-5 w-5" />
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 min-w-[120px] justify-end">
          <button onClick={() => { setSidebarTab("transcript"); setShowSidebar(!showSidebar); }}
            title="Toggle Transcript"
            className={cn("h-10 w-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-xs", showSidebar && sidebarTab === "transcript" ? "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white")}>
            <FileText className="h-4 w-4" />
          </button>
          <button onClick={() => { setSidebarTab("notes"); setShowSidebar(!showSidebar || sidebarTab !== "notes"); }}
            title="Toggle Notes"
            className={cn("relative h-10 w-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-xs", showSidebar && sidebarTab === "notes" ? "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white")}>
            <Sparkles className="h-4 w-4" />
            {aiNotes && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-teal-500 border border-white dark:border-slate-950" />}
          </button>
          <button onClick={() => { setSidebarTab("chat"); setShowSidebar(!showSidebar || sidebarTab !== "chat"); }}
            title="Toggle Chat"
            className={cn("h-10 w-10 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-xs", showSidebar && sidebarTab === "chat" ? "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white" : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white")}>
            <MessageSquare className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">End Session?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">This will close the call for all participants</p>
              </div>
            </div>
            {(session?.transcript ?? transcript) && !aiNotes && (
              <div className="mb-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-500/5 border border-teal-200 dark:border-teal-500/20">
                <p className="text-xs text-teal-800 dark:text-teal-300 flex items-start gap-2 font-medium">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
                  AI notes will be auto-generated from your transcript upon ending.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setShowEndConfirm(false)}>Continue Session</Button>
              <Button className="flex-1 bg-red-600 hover:bg-red-500 text-white" onClick={handleEndSession} disabled={isEnding}>{isEnding ? "Ending…" : "End Session"}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlBtn({ children, active, danger, onClick, title }: { children: React.ReactNode; active?: boolean; danger?: boolean; onClick: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title}
      className={cn("h-12 w-12 rounded-full flex items-center justify-center border transition-all active:scale-95 cursor-pointer shadow-xs",
        danger ? "bg-red-500/10 dark:bg-red-500/20 border-red-500/30 dark:border-red-500/50 text-red-600 dark:text-red-300 hover:bg-red-500/20 dark:hover:bg-red-500/30"
          : active ? "bg-teal-500/10 dark:bg-teal-500/20 border-teal-500/30 dark:border-teal-500/40 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 dark:hover:bg-teal-500/30"
          : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
      )}>
      {children}
    </button>
  );
}

function NoteSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3 shadow-2xs">
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
        <span>{icon}</span>{title}
      </p>
      {children}
    </div>
  );
}
