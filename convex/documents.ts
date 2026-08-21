import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const ADMIN_EMAILS = [
  "alexsouthflow@gmail.com",
  "ramadimukondi13@gmail.com",
  "alexsouthflow2@gmail.com",
  "alxsouthflow2@gmail.com",
];

// Helper: verify user
async function getUser(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  const user = await ctx.db.get(userId);
  const isAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) || user?.role === "admin";
  const isPractitioner = user?.role === "teacher" || isAdmin;
  return { userId, user, isAdmin, isPractitioner };
}

// ─── 1. PUBLIC / AUTHENTICATED QUERIES ────────────────────────────────────────

// Get all documents accessible to the user
export const getDocuments = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const auth = await getUser(ctx);

    let docsQuery = ctx.db.query("clinicalDocuments");
    const docs = await docsQuery.collect();

    // Map download URLs from Convex Storage
    const resolved = await Promise.all(
      docs.map(async (doc) => {
        let downloadUrl = doc.fileUrl;
        if (doc.storageId) {
          const storageUrl = await ctx.storage.getUrl(doc.storageId);
          if (storageUrl) downloadUrl = storageUrl;
        }
        return {
          ...doc,
          downloadUrl: downloadUrl || "#",
        };
      })
    );

    // Filter by category if specified
    let filtered = resolved;
    if (args.category && args.category !== "all" && args.category !== "All") {
      filtered = resolved.filter(
        (d) => d.category.toLowerCase() === args.category!.toLowerCase()
      );
    }

    // Filter permissions: if user is not logged in or patient, return public docs
    if (!auth || (!auth.isAdmin && !auth.isPractitioner)) {
      filtered = filtered.filter((d) => d.isPublic);
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ─── 2. MUTATIONS ─────────────────────────────────────────────────────────────

// Generate short-lived upload URL for Convex Storage
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const auth = await getUser(ctx);
    if (!auth) throw new Error("Unauthorized: Please sign in to upload files.");
    return await ctx.storage.generateUploadUrl();
  },
});

// Create and register a real uploaded document
export const createDocument = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    fileUrl: v.optional(v.string()),
    fileName: v.string(),
    fileSize: v.string(),
    fileType: v.string(),
    format: v.string(),
    isPublic: v.boolean(),
    popiaCompliant: v.boolean(),
  },
  handler: async (ctx, args) => {
    const auth = await getUser(ctx);
    if (!auth) throw new Error("Unauthorized: Sign in required");

    const docId = await ctx.db.insert("clinicalDocuments", {
      title: args.title.trim(),
      category: args.category,
      description: args.description?.trim(),
      storageId: args.storageId,
      fileUrl: args.fileUrl,
      fileName: args.fileName,
      fileSize: args.fileSize,
      fileType: args.fileType,
      format: args.format,
      uploadedBy: auth.user.name || "Practitioner",
      uploaderEmail: auth.user.email,
      isPublic: args.isPublic,
      popiaCompliant: args.popiaCompliant,
      downloads: 0,
      createdAt: Date.now(),
    });

    return docId;
  },
});

// Delete a document and its storage file
export const deleteDocument = mutation({
  args: { id: v.id("clinicalDocuments") },
  handler: async (ctx, args) => {
    const auth = await getUser(ctx);
    if (!auth || (!auth.isAdmin && !auth.isPractitioner)) {
      throw new Error("Unauthorized: Admin or Practitioner privilege required");
    }

    const doc = await ctx.db.get(args.id);
    if (doc?.storageId) {
      try {
        await ctx.storage.delete(doc.storageId);
      } catch { /* noop */ }
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Increment download counter
export const incrementDownload = mutation({
  args: { id: v.id("clinicalDocuments") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (doc) {
      await ctx.db.patch(args.id, { downloads: (doc.downloads || 0) + 1 });
    }
  },
});

// Seed Initial Clinical Documentation Templates
export const seedInitialDocuments = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("clinicalDocuments").first();
    if (existing) return { message: "Documents already seeded" };

    const initialDocs = [
      {
        title: "CBT Automatic Thought Record & Cognitive Restructuring Worksheet",
        category: "CBT & Grounding",
        description: "Evidence-based 7-column cognitive restructuring form to identify, evaluate, and modify negative automatic thought patterns.",
        fileName: "CBT_Cognitive_Restructuring_Worksheet.pdf",
        fileSize: "240 KB",
        fileType: "application/pdf",
        format: "PDF",
        uploadedBy: "Maletsatsi Sibanda",
        uploaderEmail: "alexsouthflow@gmail.com",
        isPublic: true,
        popiaCompliant: true,
        downloads: 48,
        createdAt: Date.now() - 86400000 * 12,
      },
      {
        title: "Gottman Four Horsemen & Antidotes Relationship Guide",
        category: "Couples Tools",
        description: "Clinical framework identifying criticism, contempt, defensiveness, and stonewalling with proven therapeutic antidotes.",
        fileName: "Gottman_Four_Horsemen_Guide.pdf",
        fileSize: "410 KB",
        fileType: "application/pdf",
        format: "PDF",
        uploadedBy: "Maletsatsi Sibanda",
        uploaderEmail: "alexsouthflow@gmail.com",
        isPublic: true,
        popiaCompliant: true,
        downloads: 62,
        createdAt: Date.now() - 86400000 * 8,
      },
      {
        title: "Insight Works New Client POPIA Consent & Therapeutic Disclosure Form",
        category: "Intake & Legal",
        description: "Mandatory South African POPIA Act compliance document, telehealth agreement, and confidentiality bounds.",
        fileName: "POPIA_Consent_Therapeutic_Disclosure.pdf",
        fileSize: "180 KB",
        fileType: "application/pdf",
        format: "PDF",
        uploadedBy: "Admin",
        uploaderEmail: "alexsouthflow@gmail.com",
        isPublic: true,
        popiaCompliant: true,
        downloads: 135,
        createdAt: Date.now() - 86400000 * 18,
      },
      {
        title: "5-4-3-2-1 Somatic Grounding & Acute Panic Protocol",
        category: "CBT & Grounding",
        description: "Quick-reference sensory grounding sheet for patients experiencing acute anxiety or panic triggers.",
        fileName: "5-4-3-2-1_Somatic_Grounding_Protocol.pdf",
        fileSize: "150 KB",
        fileType: "application/pdf",
        format: "PDF",
        uploadedBy: "Maletsatsi Sibanda",
        uploaderEmail: "alexsouthflow@gmail.com",
        isPublic: true,
        popiaCompliant: true,
        downloads: 89,
        createdAt: Date.now() - 86400000 * 4,
      },
      {
        title: "Values Clarification & Goal Hierarchy Blueprint",
        category: "Life Coaching",
        description: "Structured self-mastery worksheet to clarify personal core values, establish boundaries, and construct action hierarchies.",
        fileName: "Values_Clarification_Blueprint.pdf",
        fileSize: "320 KB",
        fileType: "application/pdf",
        format: "PDF",
        uploadedBy: "Maletsatsi Sibanda",
        uploaderEmail: "alexsouthflow@gmail.com",
        isPublic: true,
        popiaCompliant: true,
        downloads: 41,
        createdAt: Date.now() - 86400000 * 2,
      },
    ];

    for (const doc of initialDocs) {
      await ctx.db.insert("clinicalDocuments", doc);
    }

    return { success: true, count: initialDocs.length };
  },
});
