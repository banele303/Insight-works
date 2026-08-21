import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// --- CREATE SESSION ----------------------------------------------------------
export const createSession = mutation({
  args: {
    roomId: v.string(),
    bookingId: v.optional(v.id("bookings")),
    sessionType: v.optional(v.string()),
    clientName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("therapySessions")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
    if (existing) return { sessionId: existing._id, roomId: existing.roomId };

    const identity = await ctx.auth.getUserIdentity();
    let userId = undefined as any;
    if (identity?.email) {
      const u = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), identity.email))
        .first();
      userId = u?._id;
    }

    const sessionId = await ctx.db.insert("therapySessions", {
      roomId: args.roomId,
      bookingId: args.bookingId,
      therapistId: userId,
      sessionType: args.sessionType,
      clientName: args.clientName,
      status: "waiting",
      createdAt: Date.now(),
      signals: [],
    });
    return { sessionId, roomId: args.roomId };
  },
});

// --- GET SESSION -------------------------------------------------------------
export const getSession = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("therapySessions")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
  },
});

// --- LIST THERAPIST SESSIONS -------------------------------------------------
export const getTherapistSessions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();
    if (!user) return [];
    return await ctx.db
      .query("therapySessions")
      .withIndex("by_therapistId", (q) => q.eq("therapistId", user._id))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// --- UPDATE SESSION STATUS ---------------------------------------------------
export const updateSessionStatus = mutation({
  args: {
    roomId: v.string(),
    status: v.union(v.literal("waiting"), v.literal("active"), v.literal("ended")),
    clientName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("therapySessions")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
    if (!session) throw new Error("Session not found");

    const patch: Record<string, unknown> = { status: args.status };
    if (args.status === "active" && !session.startedAt) patch.startedAt = Date.now();
    if (args.status === "ended" && !session.endedAt) patch.endedAt = Date.now();
    if (args.clientName) patch.clientName = args.clientName;

    await ctx.db.patch(session._id, patch);
    return { success: true };
  },
});

// --- SEND WEBRTC SIGNAL ------------------------------------------------------
export const sendSignal = mutation({
  args: {
    roomId: v.string(),
    sender: v.string(),
    target: v.string(),
    type: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("therapySessions")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
    if (!session) throw new Error("Session room not found");

    const newSignal = {
      id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      sender: args.sender,
      target: args.target,
      type: args.type,
      payload: args.payload,
      createdAt: Date.now(),
    };

    const existing = (session.signals ?? []).slice(-100);
    await ctx.db.patch(session._id, { signals: [...existing, newSignal] });
    return { signalId: newSignal.id };
  },
});

// --- CLEAR PROCESSED SIGNALS -------------------------------------------------
export const clearProcessedSignals = mutation({
  args: { roomId: v.string(), signalIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("therapySessions")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
    if (!session) return;
    const remaining = (session.signals ?? []).filter((s) => !args.signalIds.includes(s.id));
    await ctx.db.patch(session._id, { signals: remaining });
  },
});

// --- APPEND TRANSCRIPT -------------------------------------------------------
export const appendTranscript = mutation({
  args: { roomId: v.string(), chunk: v.string(), speaker: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("therapySessions")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
    if (!session) throw new Error("Session not found");

    const timestamp = new Date().toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
    const line = `[${timestamp}] ${args.speaker ?? "Unknown"}: ${args.chunk}`;
    const updated = session.transcript ? `${session.transcript}\n${line}` : line;
    await ctx.db.patch(session._id, { transcript: updated });
    return { success: true };
  },
});

// --- SAVE MANUAL NOTES -------------------------------------------------------
export const saveManualNotes = mutation({
  args: { roomId: v.string(), notes: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("therapySessions")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
    if (!session) throw new Error("Session not found");
    await ctx.db.patch(session._id, { manualNotes: args.notes });
    return { success: true };
  },
});

// --- SAVE AI NOTES -----------------------------------------------------------
export const saveAiNotes = mutation({
  args: { roomId: v.string(), aiNotes: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("therapySessions")
      .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
      .first();
    if (!session) throw new Error("Session not found");
    await ctx.db.patch(session._id, { aiNotes: args.aiNotes });
    return { success: true };
  },
});

// --- GET SESSIONS WITH NOTES (ARCHIVE) ---------------------------------------
export const getSessionsWithNotes = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();
    if (!user) return [];
    return await ctx.db
      .query("therapySessions")
      .withIndex("by_therapistId", (q) => q.eq("therapistId", user._id))
      .filter((q) => q.eq(q.field("status"), "ended"))
      .order("desc")
      .take(100);
  },
});
