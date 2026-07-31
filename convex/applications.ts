import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── PUBLIC: Submit an enrolment application (no login required) ──

export const submitApplication = mutation({
  args: {
    learnerFirstName: v.string(),
    learnerLastName: v.string(),
    learnerDateOfBirth: v.string(),
    learnerGender: v.optional(v.string()),
    gradeApplyingFor: v.number(),
    schoolPhase: v.string(),
    parentFirstName: v.string(),
    parentLastName: v.string(),
    parentEmail: v.string(),
    parentPhone: v.string(),
    relationship: v.optional(v.string()),
    currentSchool: v.optional(v.string()),
    homeLanguage: v.optional(v.string()),
    additionalSubjects: v.optional(v.string()),
    previousSchoolReport: v.optional(v.string()),
    motivation: v.optional(v.string()),
    howDidYouHear: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Basic validation
    if (!args.learnerFirstName.trim() || !args.learnerLastName.trim()) {
      throw new Error("Learner first and last name are required");
    }
    if (args.gradeApplyingFor < 0 || args.gradeApplyingFor > 12) {
      throw new Error("Grade must be between R (0) and 12");
    }
    if (!args.parentEmail.includes("@")) {
      throw new Error("A valid parent email is required");
    }

    const createdAt = Date.now();

    // Generate application number: GSLC-<YEAR>-<counter-ish>
    const year = new Date().getFullYear();
    const count = await ctx.db
      .query("applications")
      .filter((q) => q.gte(q.field("createdAt"), new Date(`${year}-01-01`).getTime()))
      .collect();
    const applicationNumber = `GSLC-${year}-${String(count.length + 1).padStart(4, "0")}`;

    const applicationId = await ctx.db.insert("applications", {
      ...args,
      status: "pending",
      createdAt,
      applicationNumber,
    });

    // Notify admins via notificationQueue (if any admin exists)
    try {
      const admins = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("role"), "admin"))
        .collect();
      for (const admin of admins) {
        await ctx.db.insert("notificationQueue", {
          recipient: admin._id,
          type: "application",
          channel: "in_app",
          content: `New enrolment application ${applicationNumber} from ${args.learnerFirstName} ${args.learnerLastName} (Grade ${args.gradeApplyingFor === 0 ? "R" : args.gradeApplyingFor})`,
          scheduledFor: Date.now(),
          status: "pending",
        });
      }
    } catch (_err) {
      // Notification failure must not block the application
    }

    return { success: true, applicationId, applicationNumber };
  },
});

// ─── PUBLIC: Check application status by number + email ──────────

export const getApplicationByNumber = mutation({
  args: {
    applicationNumber: v.string(),
    parentEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const apps = await ctx.db
      .query("applications")
      .filter((q) =>
        q.and(
          q.eq(q.field("applicationNumber"), args.applicationNumber),
          q.eq(q.field("parentEmail"), args.parentEmail.toLowerCase().trim())
        )
      )
      .collect();
    if (apps.length === 0) return null;
    const app = apps[0];
    return {
      applicationNumber: app.applicationNumber,
      learnerFirstName: app.learnerFirstName,
      learnerLastName: app.learnerLastName,
      gradeApplyingFor: app.gradeApplyingFor,
      schoolPhase: app.schoolPhase,
      status: app.status,
      createdAt: app.createdAt,
      adminNotes: app.adminNotes,
      reviewedAt: app.reviewedAt,
    };
  },
});

// ─── ADMIN: List applications (optionally filtered) ──────────────

export const getApplications = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("reviewing"),
        v.literal("accepted"),
        v.literal("rejected"),
        v.literal("waitlist")
      )
    ),
    grade: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      throw new Error("Only admins and teachers can view applications");
    }

    let apps = await ctx.db.query("applications").collect();

    if (args.status) {
      apps = apps.filter((a) => a.status === args.status);
    }
    if (args.grade !== undefined) {
      apps = apps.filter((a) => a.gradeApplyingFor === args.grade);
    }
    if (args.search) {
      const s = args.search.toLowerCase();
      apps = apps.filter(
        (a) =>
          a.learnerFirstName.toLowerCase().includes(s) ||
          a.learnerLastName.toLowerCase().includes(s) ||
          a.parentFirstName.toLowerCase().includes(s) ||
          a.parentLastName.toLowerCase().includes(s) ||
          a.parentEmail.toLowerCase().includes(s) ||
          (a.applicationNumber || "").toLowerCase().includes(s)
      );
    }

    // Newest first
    apps.sort((a, b) => b.createdAt - a.createdAt);

    return apps;
  },
});

// ─── ADMIN: Get application stats for dashboard ──────────────────

export const getApplicationStats = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") throw new Error("Only admins can view stats");

    const apps = await ctx.db.query("applications").collect();
    const count = (s: string) => apps.filter((a) => a.status === s).length;

    return {
      total: apps.length,
      pending: count("pending"),
      reviewing: count("reviewing"),
      accepted: count("accepted"),
      rejected: count("rejected"),
      waitlist: count("waitlist"),
      byGrade: Object.fromEntries(
        Array.from({ length: 13 }, (_, g) => [
          g,
          apps.filter((a) => a.gradeApplyingFor === g).length,
        ])
      ),
    };
  },
});

// ─── ADMIN: Update application status ─────────────────────────────

export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("applications"),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewing"),
      v.literal("accepted"),
      v.literal("rejected"),
      v.literal("waitlist")
    ),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      throw new Error("Only admins and teachers can update applications");
    }

    const app = await ctx.db.get(args.applicationId);
    if (!app) throw new Error("Application not found");

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      adminNotes: args.adminNotes !== undefined ? args.adminNotes : app.adminNotes,
      reviewedBy: userId,
      reviewedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// ─── ADMIN: Create learner account from accepted application ─────

export const acceptAndCreateStudent = mutation({
  args: {
    applicationId: v.id("applications"),
    classId: v.optional(v.id("classes")),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Only admins can create student accounts");
    }

    const app = await ctx.db.get(args.applicationId);
    if (!app) throw new Error("Application not found");

    // Create the student user record (no credentials — they'll set password via invite flow)
    const studentId = await ctx.db.insert("users", {
      name: `${app.learnerFirstName} ${app.learnerLastName}`,
      email: app.parentEmail, // parent email as contact; can be changed later
      phone: app.parentPhone,
      role: "student",
      isActive: true,
      isApproved: true,
      dateOfBirth: app.learnerDateOfBirth,
      studentClass: args.classId,
      onboardingCompleted: false,
    });

    await ctx.db.patch(args.applicationId, {
      status: "accepted",
      linkedStudent: studentId,
      adminNotes: args.adminNotes !== undefined ? args.adminNotes : app.adminNotes,
      reviewedBy: userId,
      reviewedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true, studentId };
  },
});
