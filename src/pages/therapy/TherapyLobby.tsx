import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Mic, MicOff, Video as VideoIcon, VideoOff, ArrowRight,
  Shield, Clock, Heart, Play, Sparkles, CheckCircle2, Crown, Users, Settings2
} from "lucide-react";
import { ThemeModeToggle } from "@/components/theme/ThemeModeToggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TherapyLobby() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // @ts-ignore
  const createSession = useMutation(api.therapySessions.createSession);
  // @ts-ignore
  const session = useQuery(api.therapySessions.getSession, roomId ? { roomId } : "skip");

  const [guestName, setGuestName] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [devices, setDevices] = useState<{ video: MediaDeviceInfo[]; audio: MediaDeviceInfo[] }>({ video: [], audio: [] });
  const [selectedVideo, setSelectedVideo] = useState("");
  const [selectedAudio, setSelectedAudio] = useState("");
  const [joining, setJoining] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const sessionType = searchParams.get("type") ?? session?.sessionType ?? "Therapy & Coaching Session";
  const isTherapist = user?.role === "teacher" || user?.role === "admin";
  const displayName = user?.name ?? guestName;

  // Enumerate devices
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((list) => {
      const video = list.filter((d) => d.kind === "videoinput");
      const audio = list.filter((d) => d.kind === "audioinput");
      setDevices({ video, audio });
      if (video[0] && !selectedVideo) setSelectedVideo(video[0].deviceId);
      if (audio[0] && !selectedAudio) setSelectedAudio(audio[0].deviceId);
    }).catch(console.warn);
  }, []);

  // Preview camera and microphone audio level meter
  useEffect(() => {
    let s: MediaStream | null = null;
    const start = async () => {
      try {
        const videoConstraint = camOn ? (selectedVideo ? { deviceId: { ideal: selectedVideo } } : true) : false;
        const audioConstraint = micOn ? (selectedAudio ? { deviceId: { ideal: selectedAudio } } : true) : false;

        if (!videoConstraint && !audioConstraint) return;

        try {
          s = await navigator.mediaDevices.getUserMedia({
            video: videoConstraint,
            audio: audioConstraint,
          });
        } catch {
          // If ideal device failed, try generic fallback
          try {
            s = await navigator.mediaDevices.getUserMedia({
              video: camOn,
              audio: micOn,
            });
          } catch {
            // Try single track fallback if user only has audio or only video
            if (camOn) {
              try { s = await navigator.mediaDevices.getUserMedia({ video: true }); setMicOn(false); } catch { /* noop */ }
            }
            if (!s && micOn) {
              try { s = await navigator.mediaDevices.getUserMedia({ audio: true }); setCamOn(false); } catch { /* noop */ }
            }
          }
        }

        if (s) {
          setStream(s);
          if (videoRef.current) videoRef.current.srcObject = s;
        }

        // Setup audio level analyzer
        if (micOn && s.getAudioTracks().length > 0) {
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioCtx();
            const src = ctx.createMediaStreamSource(s);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 64;
            src.connect(analyser);
            audioContextRef.current = ctx;
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateMeter = () => {
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
              const avg = sum / dataArray.length;
              setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
              animFrameRef.current = requestAnimationFrame(updateMeter);
            };
            updateMeter();
          } catch (e) {
            console.warn("Audio meter setup skipped:", e);
          }
        }
      } catch (err) {
        console.warn("Media preview access:", err);
      }
    };
    start();
    return () => {
      s?.getTracks().forEach((t) => t.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
    };
  }, [camOn, micOn, selectedVideo, selectedAudio]);

  const handleStartOrJoin = async () => {
    if (!roomId) return;
    const name = user?.name ?? guestName.trim();
    if (!name) {
      toast.error("Please enter your name to proceed.");
      return;
    }
    setJoining(true);
    try {
      // Ensure session exists in Convex
      await createSession({ roomId, sessionType, clientName: !isTherapist ? name : undefined });

      // Stop preview stream before room opens
      stream?.getTracks().forEach((t) => t.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

      navigate(`/therapy-room/${roomId}?name=${encodeURIComponent(name)}&mic=${micOn}&cam=${camOn}&type=${encodeURIComponent(sessionType)}`);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to initialize session");
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a10] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-teal-500 selection:text-white transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeModeToggle compact className="h-9 w-9 rounded-xl shadow-xs" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold tracking-wider uppercase mb-3 shadow-inner">
            <Heart className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 fill-teal-500/20" />
            Insight Therapy &amp; Coaching · Telehealth
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{sessionType}</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 max-w-lg mx-auto">
            {isTherapist
              ? "You are hosting this session. Configure your camera and microphone, then click Start Session."
              : "Check your video and audio settings before joining your practitioner."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Camera Preview & Mic Meter (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800/90 aspect-video flex items-center justify-center shadow-2xl ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-md">
              {camOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                    <VideoOff className="h-8 w-8 text-slate-400 opacity-60" />
                  </div>
                  <span className="text-sm font-medium text-slate-400">Camera preview is off</span>
                </div>
              )}

              {/* Identity & Host Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-lg">
                {isTherapist ? (
                  <>
                    <Crown className="h-3.5 w-3.5 text-amber-400" />
                    <span className="text-amber-300">Host (Practitioner)</span>
                  </>
                ) : (
                  <>
                    <Users className="h-3.5 w-3.5 text-teal-400" />
                    <span>{displayName || "Guest Client"}</span>
                  </>
                )}
              </div>

              {/* Live Mic Activity Visualizer */}
              {micOn && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-lg">
                  <Mic className="h-3.5 w-3.5 text-teal-400" />
                  <div className="flex items-end gap-0.5 h-3.5">
                    <span className="w-1 bg-teal-400 rounded-full transition-all duration-75" style={{ height: `${Math.max(20, audioLevel * 1.0)}%` }} />
                    <span className="w-1 bg-teal-400 rounded-full transition-all duration-75" style={{ height: `${Math.max(30, audioLevel * 1.4)}%` }} />
                    <span className="w-1 bg-teal-400 rounded-full transition-all duration-75" style={{ height: `${Math.max(20, audioLevel * 0.8)}%` }} />
                  </div>
                </div>
              )}

              {/* Bottom In-Preview Quick Toggles */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
                <div className="text-xs text-white/90 font-semibold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs border border-white/10 shadow-xs">
                  {displayName ? `${displayName}` : "Ready"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMicOn(!micOn)}
                    title={micOn ? "Mute Microphone" : "Unmute Microphone"}
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-all border shadow-lg cursor-pointer",
                      micOn
                        ? "bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800"
                        : "bg-red-500/90 border-red-400 text-white hover:bg-red-500"
                    )}
                  >
                    {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setCamOn(!camOn)}
                    title={camOn ? "Turn Camera Off" : "Turn Camera On"}
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center transition-all border shadow-lg cursor-pointer",
                      camOn
                        ? "bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800"
                        : "bg-red-500/90 border-red-400 text-white hover:bg-red-500"
                    )}
                  >
                    {camOn ? <VideoIcon className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Security & Feature Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-3 flex items-center gap-2.5 shadow-xs">
                <Shield className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-slate-200">E2E Encrypted</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">POPIA Compliant</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-3 flex items-center gap-2.5 shadow-xs">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-slate-200">AI Clinical Notes</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Instant Summary</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-3 flex items-center gap-2.5 shadow-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-slate-200">Cloudflare TURN</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Ultra-Low Latency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Controls, Details & START/JOIN CTA (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Session Info Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm dark:shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Session Overview</p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium">
                  {roomId?.slice(0, 12)}
                </span>
              </div>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Service Type</span>
                  <span className="font-bold text-slate-900 dark:text-white">{sessionType}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Practitioner</span>
                  <span className="font-bold text-teal-700 dark:text-teal-400">Maletsatsi Sibanda</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Your Role</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {isTherapist ? "Session Host (Owner)" : "Client Guest"}
                  </span>
                </div>
              </div>
            </div>

            {/* Guest Name Input (Only if unauthenticated) */}
            {!user && (
              <div className="rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm dark:shadow-xl backdrop-blur-md">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Your Name</label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g., Sarah Johnson"
                  className="bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus-visible:ring-teal-500 h-11 rounded-xl text-sm"
                />
              </div>
            )}

            {/* Hardware Devices Selector */}
            <div className="rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 p-5 space-y-3 shadow-sm dark:shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-1">
                <Settings2 className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Device Settings</p>
              </div>
              {devices.video.length > 0 && (
                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 block">Camera</label>
                  <Select value={selectedVideo} onValueChange={setSelectedVideo}>
                    <SelectTrigger className="bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-200 h-10 text-xs rounded-xl">
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                      {devices.video.map((d) => (
                        <SelectItem key={d.deviceId} value={d.deviceId} className="text-xs">
                          {d.label || "Camera"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {devices.audio.length > 0 && (
                <div>
                  <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1 block">Microphone</label>
                  <Select value={selectedAudio} onValueChange={setSelectedAudio}>
                    <SelectTrigger className="bg-slate-50 dark:bg-slate-950/80 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-200 h-10 text-xs rounded-xl">
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                      {devices.audio.map((d) => (
                        <SelectItem key={d.deviceId} value={d.deviceId} className="text-xs">
                          {d.label || "Microphone"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* DYNAMIC OWNER (START) vs CLIENT (JOIN) ACTION BUTTON */}
            <Button
              onClick={handleStartOrJoin}
              disabled={joining || (!user && !guestName.trim())}
              className={cn(
                "w-full h-14 rounded-2xl font-bold text-base gap-2 shadow-2xl transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50",
                isTherapist
                  ? "bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-teal-600/30 ring-2 ring-teal-400/40"
                  : "bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white shadow-teal-600/20"
              )}
            >
              {joining ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  {isTherapist ? "Starting Session..." : "Joining..."}
                </span>
              ) : isTherapist ? (
                <>
                  <Play className="h-5 w-5 fill-white text-white" />
                  Start Session (Host)
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Join Telehealth Session
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
              {isTherapist
                ? "As the practitioner, starting the room will generate your clinical transcript and private notes canvas."
                : "By joining you agree to Insight Therapy's telehealth privacy practices and POPIA consent."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
