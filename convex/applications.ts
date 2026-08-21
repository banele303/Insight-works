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

// ─── SEED: Demo applications for CRM pipeline ─────────────────────────────────

export const seedDemoApplications = mutation({
  handler: async (ctx) => {
    const existing = await ctx.db.query("applications").collect();
    if (existing.length >= 10) {
      return { seeded: false, count: existing.length };
    }

    const year = new Date().getFullYear();
    const count = existing.length;

    const demos = [
      // Pending (New Leads)
      {
        learnerFirstName: "Amahle", learnerLastName: "Dlamini",
        learnerDateOfBirth: "2014-03-12", learnerGender: "Female",
        gradeApplyingFor: 4, schoolPhase: "Intermediate Phase",
        parentFirstName: "Nomvula", parentLastName: "Dlamini",
        parentEmail: "nomvula.dlamini@gmail.com", parentPhone: "+27 82 345 6789",
        relationship: "Mother", currentSchool: "Thokoza Primary",
        homeLanguage: "Zulu", howDidYouHear: "WhatsApp community",
        motivation: "My daughter is very bright and I believe this school will help her reach her full potential.",
        status: "pending" as const,
      },
      {
        learnerFirstName: "Lethiwe", learnerLastName: "Nkosi",
        learnerDateOfBirth: "2016-07-22", learnerGender: "Female",
        gradeApplyingFor: 2, schoolPhase: "Foundation Phase",
        parentFirstName: "Sipho", parentLastName: "Nkosi",
        parentEmail: "sipho.nkosi@outlook.com", parentPhone: "+27 71 234 5678",
        relationship: "Father", currentSchool: "Sunrise Preparatory",
        homeLanguage: "Zulu", howDidYouHear: "Google Search",
        motivation: "We are looking for a more personalised learning environment for our daughter.",
        status: "pending" as const,
      },
      {
        learnerFirstName: "Ethan", learnerLastName: "Van Der Berg",
        learnerDateOfBirth: "2009-11-05", learnerGender: "Male",
        gradeApplyingFor: 8, schoolPhase: "Senior Phase",
        parentFirstName: "Karen", parentLastName: "Van Der Berg",
        parentEmail: "karen.vdb@webmail.co.za", parentPhone: "+27 83 901 2345",
        relationship: "Mother", currentSchool: "Greenfields High",
        homeLanguage: "Afrikaans", howDidYouHear: "Friend recommendation",
        motivation: "Ethan struggled with large class sizes. We believe smaller groups will help him thrive.",
        status: "pending" as const,
      },
      {
        learnerFirstName: "Riya", learnerLastName: "Pillay",
        learnerDateOfBirth: "2013-04-18", learnerGender: "Female",
        gradeApplyingFor: 5, schoolPhase: "Intermediate Phase",
        parentFirstName: "Priya", parentLastName: "Pillay",
        parentEmail: "priya.pillay@gmail.com", parentPhone: "+27 61 567 8901",
        relationship: "Mother", currentSchool: "Sunridge Academy",
        homeLanguage: "English", howDidYouHear: "Facebook Ad",
        motivation: "Riya is a gifted learner who needs more challenge and enrichment than her current school provides.",
        status: "pending" as const,
      },
      // Reviewing
      {
        learnerFirstName: "Lwazi", learnerLastName: "Mthembu",
        learnerDateOfBirth: "2012-09-30", learnerGender: "Male",
        gradeApplyingFor: 6, schoolPhase: "Intermediate Phase",
        parentFirstName: "Nandi", parentLastName: "Mthembu",
        parentEmail: "nandi.mthembu@gmail.com", parentPhone: "+27 73 456 7890",
        relationship: "Mother", currentSchool: "Bhekuzulu Primary",
        homeLanguage: "Zulu", howDidYouHear: "Word of mouth",
        motivation: "Lwazi has a passion for mathematics and science and we want to nurture that.",
        status: "reviewing" as const,
        adminNotes: "School report verified. Good academic record. Schedule interview.",
      },
      {
        learnerFirstName: "Jade", learnerLastName: "Botha",
        learnerDateOfBirth: "2011-06-14", learnerGender: "Female",
        gradeApplyingFor: 7, schoolPhase: "Intermediate Phase",
        parentFirstName: "Riaan", parentLastName: "Botha",
        parentEmail: "riaan.botha@mweb.co.za", parentPhone: "+27 82 678 9012",
        relationship: "Father", currentSchool: "Laerskool Rooihuiskraal",
        homeLanguage: "Afrikaans", howDidYouHear: "Teacher referral",
        motivation: "Jade is artistic and analytical. We believe in a balanced holistic education.",
        status: "reviewing" as const,
        adminNotes: "Parents attended open day. Very engaged. Awaiting Grade 6 report.",
      },
      {
        learnerFirstName: "Kabelo", learnerLastName: "Sithole",
        learnerDateOfBirth: "2015-01-28", learnerGender: "Male",
        gradeApplyingFor: 1, schoolPhase: "Foundation Phase",
        parentFirstName: "Thabang", parentLastName: "Sithole",
        parentEmail: "thabang.sithole@gmail.com", parentPhone: "+27 79 345 6789",
        relationship: "Father", homeLanguage: "Sotho",
        howDidYouHear: "Community notice board",
        motivation: "Our son is ready for Grade 1 and we want the best possible start for him.",
        status: "reviewing" as const,
      },
      // Accepted (Enrolled)
      {
        learnerFirstName: "Zanele", learnerLastName: "Khumalo",
        learnerDateOfBirth: "2013-08-10", learnerGender: "Female",
        gradeApplyingFor: 5, schoolPhase: "Intermediate Phase",
        parentFirstName: "Bongiwe", parentLastName: "Khumalo",
        parentEmail: "bongiwe.khumalo@gmail.com", parentPhone: "+27 84 567 8901",
        relationship: "Mother", currentSchool: "Siyanda Primary",
        homeLanguage: "Zulu", howDidYouHear: "Social media",
        motivation: "Zanele loves reading and creative writing. We're excited for this opportunity.",
        status: "accepted" as const,
        adminNotes: "Accepted for Grade 5. Placed in Ms Mokoena's class. Fees confirmed.",
      },
      {
        learnerFirstName: "Aiden", learnerLastName: "Pretorius",
        learnerDateOfBirth: "2010-12-03", learnerGender: "Male",
        gradeApplyingFor: 9, schoolPhase: "Senior Phase",
        parentFirstName: "Louise", parentLastName: "Pretorius",
        parentEmail: "louise.pretorius@gmail.com", parentPhone: "+27 71 890 1234",
        relationship: "Mother", currentSchool: "Waterkloof House Prep",
        homeLanguage: "Afrikaans", howDidYouHear: "Previous parent",
        motivation: "We are relocating and need a school with strong academics and sport programmes.",
        status: "accepted" as const,
        adminNotes: "Strong academic record. Sport captain. Enrolled. Welcome pack sent.",
      },
      {
        learnerFirstName: "Thandi", learnerLastName: "Molefe",
        learnerDateOfBirth: "2016-05-19", learnerGender: "Female",
        gradeApplyingFor: 0, schoolPhase: "Foundation Phase",
        parentFirstName: "Palesa", parentLastName: "Molefe",
        parentEmail: "palesa.molefe@webmail.co.za", parentPhone: "+27 65 234 5678",
        relationship: "Mother", homeLanguage: "Sotho",
        howDidYouHear: "Neighbour",
        motivation: "Thandi is very curious and eager to learn. Grade R will be the perfect start.",
        status: "accepted" as const,
        adminNotes: "Accepted for Grade R. Registration form and deposit received.",
      },
      // Waitlist
      {
        learnerFirstName: "Siyanda", learnerLastName: "Ngcobo",
        learnerDateOfBirth: "2012-02-14", learnerGender: "Male",
        gradeApplyingFor: 6, schoolPhase: "Intermediate Phase",
        parentFirstName: "Lungile", parentLastName: "Ngcobo",
        parentEmail: "lungile.ngcobo@gmail.com", parentPhone: "+27 83 012 3456",
        relationship: "Father", currentSchool: "Ithemba Primary",
        homeLanguage: "Xhosa", howDidYouHear: "Church community",
        motivation: "Siyanda shows great leadership skills and we want to develop them further.",
        status: "waitlist" as const,
        adminNotes: "Grade 6 class is full. On waitlist position #1. Parent notified.",
      },
      {
        learnerFirstName: "Mia", learnerLastName: "Jacobs",
        learnerDateOfBirth: "2014-10-08", learnerGender: "Female",
        gradeApplyingFor: 4, schoolPhase: "Intermediate Phase",
        parentFirstName: "Celeste", parentLastName: "Jacobs",
        parentEmail: "celeste.jacobs@outlook.com", parentPhone: "+27 72 123 4567",
        relationship: "Mother", currentSchool: "Paarl Girls Primary",
        homeLanguage: "Afrikaans", howDidYouHear: "Instagram",
        motivation: "Mia is bilingual and we value a school that embraces diversity.",
        status: "waitlist" as const,
        adminNotes: "Waitlist #2. Strong applicant. Will contact if space opens.",
      },
      // Rejected
      {
        learnerFirstName: "Jason", learnerLastName: "Williams",
        learnerDateOfBirth: "2007-03-25", learnerGender: "Male",
        gradeApplyingFor: 11, schoolPhase: "FET Phase",
        parentFirstName: "Deborah", parentLastName: "Williams",
        parentEmail: "deborah.williams@gmail.com", parentPhone: "+27 81 234 5678",
        relationship: "Mother", currentSchool: "Athlone High",
        homeLanguage: "English", howDidYouHear: "Website",
        motivation: "Jason wants to change schools for his final two years of high school.",
        status: "rejected" as const,
        adminNotes: "Declined — we currently do not offer Grade 11. Family referred to suitable school.",
      },
      {
        learnerFirstName: "Keamogetswe", learnerLastName: "Tau",
        learnerDateOfBirth: "2008-11-17", learnerGender: "Male",
        gradeApplyingFor: 10, schoolPhase: "FET Phase",
        parentFirstName: "Dineo", parentLastName: "Tau",
        parentEmail: "dineo.tau@gmail.com", parentPhone: "+27 76 789 0123",
        relationship: "Mother", currentSchool: "Soweto High",
        homeLanguage: "Sotho", howDidYouHear: "Google Search",
        motivation: "We believe a change of environment will improve Keamogetswe's performance.",
        status: "rejected" as const,
        adminNotes: "Declined — capacity full for Grade 10 this year. Advised to re-apply next intake.",
      },
    ];

    let inserted = 0;
    for (const demo of demos) {
      const seq = count + inserted + 1;
      const appNumber = `GSLC-${year}-${String(seq).padStart(4, "0")}`;
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = Date.now() - daysAgo * 86_400_000;

      const { status, adminNotes, ...rest } = demo;
      await ctx.db.insert("applications", {
        ...rest,
        status,
        adminNotes,
        applicationNumber: appNumber,
        createdAt,
      });
      inserted++;
    }

    return { seeded: true, count: inserted };
  },
});
