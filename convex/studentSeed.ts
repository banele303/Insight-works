import { mutation } from "./_generated/server";

/**
 * STUDENT SEED — Seeds 5 demo students into existing classes.
 * Safe to re-run — uses upsert logic (no duplicates).
 * Run via Convex Dashboard → Functions → studentSeed:seedDemoStudents
 */
export const seedDemoStudents = mutation({
  args: {},
  handler: async (ctx) => {
    const log: string[] = [];

    // Fetch all classes so we can map grade name → class ID
    const allClasses = await ctx.db.query("classes").collect();
    const classByName = new Map(allClasses.map((c) => [c.name, c._id]));

    log.push(`Found ${allClasses.length} classes: ${allClasses.map((c) => c.name).join(", ")}`);

    const demoStudents = [
      {
        name: "Zanele Dlamini",
        email: "zanele.dlamini@student.glenandalearning.co.za",
        gradeName: "Grade 10",
        bio: "Grade 10 learner passionate about Mathematics and Physical Sciences.",
      },
      {
        name: "Liam Patel",
        email: "liam.patel@student.glenandalearning.co.za",
        gradeName: "Grade 11",
        bio: "Grade 11 candidate focusing on Information Technology and Accounting.",
      },
      {
        name: "Sipho Zulu",
        email: "sipho.zulu@student.glenandalearning.co.za",
        gradeName: "Grade 12",
        bio: "Grade 12 Matric candidate aiming for distinction in CAPS examinations.",
      },
      {
        name: "Thandiwe Mbedzi",
        email: "thandiwe.mbedzi@student.glenandalearning.co.za",
        gradeName: "Grade 8",
        bio: "Senior Phase Grade 8 student active in STEM and study groups.",
      },
      {
        name: "Amara Okafor",
        email: "amara.okafor@student.glenandalearning.co.za",
        gradeName: "Grade 4",
        bio: "Intermediate Phase Grade 4 learner enthusiastic about Natural Sciences.",
      },
    ];

    let created = 0;
    let updated = 0;

    for (const s of demoStudents) {
      const classId = classByName.get(s.gradeName);

      if (!classId) {
        log.push(`⚠️  Class "${s.gradeName}" not found — skipping ${s.name}. Run masterSeed first!`);
        continue;
      }

      const existing = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", s.email))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          name: s.name,
          role: "student",
          isActive: true,
          isApproved: true,
          studentClass: classId,
          bio: s.bio,
        });

        // Also add student to class.students array if not already there
        const classDoc = await ctx.db.get(classId);
        if (classDoc && !classDoc.students.includes(existing._id)) {
          await ctx.db.patch(classId, {
            students: [...classDoc.students, existing._id],
          });
        }

        log.push(`✅ Updated existing user → ${s.name} (${s.email}) → ${s.gradeName}`);
        updated++;
      } else {
        const userId = await ctx.db.insert("users", {
          name: s.name,
          email: s.email,
          role: "student",
          isActive: true,
          isApproved: true,
          studentClass: classId,
          bio: s.bio,
        });

        // Add student to class.students array
        const classDoc = await ctx.db.get(classId);
        if (classDoc) {
          await ctx.db.patch(classId, {
            students: [...classDoc.students, userId],
          });
        }

        log.push(`✅ Created student → ${s.name} (${s.email}) → ${s.gradeName}`);
        created++;
      }
    }

    return {
      success: true,
      log,
      summary: `Done! ${created} students created, ${updated} students updated.`,
    };
  },
});
