import { mutation } from "./_generated/server";

/**
 * MASTER SEED — Glenanda Learning Center
 *
 * What it does:
 *  1. Ensures the 2026 Academic Year exists (current).
 *  2. Upserts ALL CAPS subjects for every grade (R/0 to 12).
 *  3. Upserts ALL classes (one class per grade, Grade R → 12).
 *  4. Ensures alexsouthflow2@gmail.com is an active admin user.
 *  5. Fixes school settings name (removes "Shopping").
 *
 * Safe to re-run — uses upsert logic so no duplicates are created.
 *
 * Run via Convex dashboard → Functions → masterSeed:runMasterSeed
 */
export const runMasterSeed = mutation({
  args: {},
  handler: async (ctx) => {
    const log: string[] = [];

    // ─────────────────────────────────────────────────────────────
    // 1. ACADEMIC YEAR
    // ─────────────────────────────────────────────────────────────
    const allYears = await ctx.db.query("academicYears").collect();
    let yearId = allYears.find((y) => y.fromYear === "2026" && y.isCurrent)?._id;

    if (!yearId) {
      // Mark any existing current year as not current
      for (const y of allYears) {
        if (y.isCurrent) await ctx.db.patch(y._id, { isCurrent: false });
      }
      yearId = await ctx.db.insert("academicYears", {
        name: "2026 Academic Year",
        fromYear: "2026",
        toYear: "2026",
        isCurrent: true,
      });
      log.push("✅ Created 2026 Academic Year");
    } else {
      log.push("ℹ️  2026 Academic Year already exists");
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ALL CAPS SUBJECTS — one entry per subject-grade combo
    // ─────────────────────────────────────────────────────────────
    // grade → subjects for that grade
    const capsSubjectsByGrade: {
      grade: number;
      phase: string;
      subjects: { name: string; code: string; category: string }[];
    }[] = [
      // ── Grade R (pre-primary, grade = 0) ──
      {
        grade: 0,
        phase: "Foundation",
        subjects: [
          { name: "Mathematics", code: "MATH-GR", category: "maths" },
          { name: "Home Language (HL)", code: "HL-GR", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-GR", category: "language" },
          { name: "Life Skills", code: "LIFE-GR", category: "life_skills" },
        ],
      },
      // ── Grade 1 ──
      {
        grade: 1,
        phase: "Foundation",
        subjects: [
          { name: "Mathematics", code: "MATH-G1", category: "maths" },
          { name: "Home Language (HL)", code: "HL-G1", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-G1", category: "language" },
          { name: "Life Skills", code: "LIFE-G1", category: "life_skills" },
        ],
      },
      // ── Grade 2 ──
      {
        grade: 2,
        phase: "Foundation",
        subjects: [
          { name: "Mathematics", code: "MATH-G2", category: "maths" },
          { name: "Home Language (HL)", code: "HL-G2", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-G2", category: "language" },
          { name: "Life Skills", code: "LIFE-G2", category: "life_skills" },
        ],
      },
      // ── Grade 3 ──
      {
        grade: 3,
        phase: "Foundation",
        subjects: [
          { name: "Mathematics", code: "MATH-G3", category: "maths" },
          { name: "Home Language (HL)", code: "HL-G3", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-G3", category: "language" },
          { name: "Life Skills", code: "LIFE-G3", category: "life_skills" },
        ],
      },
      // ── Grade 4 ──
      {
        grade: 4,
        phase: "Intermediate",
        subjects: [
          { name: "Mathematics", code: "MATH-G4", category: "maths" },
          { name: "Home Language (HL)", code: "HL-G4", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-G4", category: "language" },
          { name: "Natural Sciences & Technology", code: "NST-G4", category: "science" },
          { name: "Social Sciences", code: "SS-G4", category: "humanities" },
          { name: "Life Skills", code: "LIFE-G4", category: "life_skills" },
          { name: "Economic and Management Sciences", code: "EMS-G4", category: "other" },
          { name: "Arts and Culture", code: "ART-G4", category: "arts" },
        ],
      },
      // ── Grade 5 ──
      {
        grade: 5,
        phase: "Intermediate",
        subjects: [
          { name: "Mathematics", code: "MATH-G5", category: "maths" },
          { name: "Home Language (HL)", code: "HL-G5", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-G5", category: "language" },
          { name: "Natural Sciences & Technology", code: "NST-G5", category: "science" },
          { name: "Social Sciences", code: "SS-G5", category: "humanities" },
          { name: "Life Skills", code: "LIFE-G5", category: "life_skills" },
          { name: "Economic and Management Sciences", code: "EMS-G5", category: "other" },
          { name: "Arts and Culture", code: "ART-G5", category: "arts" },
        ],
      },
      // ── Grade 6 ──
      {
        grade: 6,
        phase: "Intermediate",
        subjects: [
          { name: "Mathematics", code: "MATH-G6", category: "maths" },
          { name: "Home Language (HL)", code: "HL-G6", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-G6", category: "language" },
          { name: "Natural Sciences & Technology", code: "NST-G6", category: "science" },
          { name: "Social Sciences", code: "SS-G6", category: "humanities" },
          { name: "Life Skills", code: "LIFE-G6", category: "life_skills" },
          { name: "Economic and Management Sciences", code: "EMS-G6", category: "other" },
          { name: "Arts and Culture", code: "ART-G6", category: "arts" },
        ],
      },
      // ── Grade 7 ──
      {
        grade: 7,
        phase: "Senior",
        subjects: [
          { name: "Mathematics", code: "MATH-G7", category: "maths" },
          { name: "Home Language (HL)", code: "HL-G7", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-G7", category: "language" },
          { name: "Natural Sciences", code: "NS-G7", category: "science" },
          { name: "Social Sciences", code: "SS-G7", category: "humanities" },
          { name: "Life Orientation", code: "LO-G7", category: "life_skills" },
          { name: "Economic and Management Sciences", code: "EMS-G7", category: "other" },
          { name: "Technology", code: "TECH-G7", category: "technology" },
          { name: "Creative Arts", code: "CA-G7", category: "arts" },
        ],
      },
      // ── Grade 8 ──
      {
        grade: 8,
        phase: "Senior",
        subjects: [
          { name: "Mathematics", code: "MATH-G8", category: "maths" },
          { name: "Home Language (HL)", code: "HL-G8", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-G8", category: "language" },
          { name: "Natural Sciences", code: "NS-G8", category: "science" },
          { name: "Social Sciences", code: "SS-G8", category: "humanities" },
          { name: "Life Orientation", code: "LO-G8", category: "life_skills" },
          { name: "Economic and Management Sciences", code: "EMS-G8", category: "other" },
          { name: "Technology", code: "TECH-G8", category: "technology" },
          { name: "Creative Arts", code: "CA-G8", category: "arts" },
        ],
      },
      // ── Grade 9 ──
      {
        grade: 9,
        phase: "Senior",
        subjects: [
          { name: "Mathematics", code: "MATH-G9", category: "maths" },
          { name: "Home Language (HL)", code: "HL-G9", category: "language" },
          { name: "First Additional Language (FAL)", code: "FAL-G9", category: "language" },
          { name: "Natural Sciences", code: "NS-G9", category: "science" },
          { name: "Social Sciences", code: "SS-G9", category: "humanities" },
          { name: "Life Orientation", code: "LO-G9", category: "life_skills" },
          { name: "Economic and Management Sciences", code: "EMS-G9", category: "other" },
          { name: "Technology", code: "TECH-G9", category: "technology" },
          { name: "Creative Arts", code: "CA-G9", category: "arts" },
        ],
      },
      // ── Grade 10 ──
      {
        grade: 10,
        phase: "FET",
        subjects: [
          { name: "Mathematics", code: "MATH-G10", category: "maths" },
          { name: "Mathematical Literacy", code: "MATHLIT-G10", category: "maths" },
          { name: "English Home Language", code: "ENG-G10", category: "language" },
          { name: "Afrikaans First Additional Language", code: "AFR-G10", category: "language" },
          { name: "Life Orientation", code: "LO-G10", category: "life_skills" },
          { name: "Physical Sciences", code: "PHYS-G10", category: "science" },
          { name: "Life Sciences", code: "LSCI-G10", category: "science" },
          { name: "History", code: "HIST-G10", category: "humanities" },
          { name: "Geography", code: "GEO-G10", category: "humanities" },
          { name: "Accounting", code: "ACC-G10", category: "other" },
          { name: "Business Studies", code: "BUS-G10", category: "other" },
          { name: "Economics", code: "ECON-G10", category: "other" },
          { name: "Computer Applications Technology", code: "CAT-G10", category: "technology" },
          { name: "Information Technology", code: "IT-G10", category: "technology" },
          { name: "Visual Arts", code: "VART-G10", category: "arts" },
          { name: "Music", code: "MUS-G10", category: "arts" },
          { name: "Dramatic Arts", code: "DRAM-G10", category: "arts" },
          { name: "Tourism", code: "TOUR-G10", category: "other" },
          { name: "Agricultural Sciences", code: "AGRI-G10", category: "science" },
        ],
      },
      // ── Grade 11 ──
      {
        grade: 11,
        phase: "FET",
        subjects: [
          { name: "Mathematics", code: "MATH-G11", category: "maths" },
          { name: "Mathematical Literacy", code: "MATHLIT-G11", category: "maths" },
          { name: "English Home Language", code: "ENG-G11", category: "language" },
          { name: "Afrikaans First Additional Language", code: "AFR-G11", category: "language" },
          { name: "Life Orientation", code: "LO-G11", category: "life_skills" },
          { name: "Physical Sciences", code: "PHYS-G11", category: "science" },
          { name: "Life Sciences", code: "LSCI-G11", category: "science" },
          { name: "History", code: "HIST-G11", category: "humanities" },
          { name: "Geography", code: "GEO-G11", category: "humanities" },
          { name: "Accounting", code: "ACC-G11", category: "other" },
          { name: "Business Studies", code: "BUS-G11", category: "other" },
          { name: "Economics", code: "ECON-G11", category: "other" },
          { name: "Computer Applications Technology", code: "CAT-G11", category: "technology" },
          { name: "Information Technology", code: "IT-G11", category: "technology" },
          { name: "Visual Arts", code: "VART-G11", category: "arts" },
          { name: "Music", code: "MUS-G11", category: "arts" },
          { name: "Dramatic Arts", code: "DRAM-G11", category: "arts" },
          { name: "Tourism", code: "TOUR-G11", category: "other" },
          { name: "Agricultural Sciences", code: "AGRI-G11", category: "science" },
        ],
      },
      // ── Grade 12 ──
      {
        grade: 12,
        phase: "FET",
        subjects: [
          { name: "Mathematics", code: "MATH-G12", category: "maths" },
          { name: "Mathematical Literacy", code: "MATHLIT-G12", category: "maths" },
          { name: "English Home Language", code: "ENG-G12", category: "language" },
          { name: "Afrikaans First Additional Language", code: "AFR-G12", category: "language" },
          { name: "Life Orientation", code: "LO-G12", category: "life_skills" },
          { name: "Physical Sciences", code: "PHYS-G12", category: "science" },
          { name: "Life Sciences", code: "LSCI-G12", category: "science" },
          { name: "History", code: "HIST-G12", category: "humanities" },
          { name: "Geography", code: "GEO-G12", category: "humanities" },
          { name: "Accounting", code: "ACC-G12", category: "other" },
          { name: "Business Studies", code: "BUS-G12", category: "other" },
          { name: "Economics", code: "ECON-G12", category: "other" },
          { name: "Computer Applications Technology", code: "CAT-G12", category: "technology" },
          { name: "Information Technology", code: "IT-G12", category: "technology" },
          { name: "Visual Arts", code: "VART-G12", category: "arts" },
          { name: "Music", code: "MUS-G12", category: "arts" },
          { name: "Dramatic Arts", code: "DRAM-G12", category: "arts" },
          { name: "Tourism", code: "TOUR-G12", category: "other" },
          { name: "Agricultural Sciences", code: "AGRI-G12", category: "science" },
        ],
      },
    ];

    // Upsert subjects — key by code
    const existingSubjects = await ctx.db.query("subjects").collect();
    const subjectByCode = new Map(existingSubjects.map((s) => [s.code, s]));
    const subjectIdByCode: Record<string, any> = {};
    let subjectsCreated = 0;
    let subjectsUpdated = 0;

    for (const gradeData of capsSubjectsByGrade) {
      for (const sub of gradeData.subjects) {
        const existing = subjectByCode.get(sub.code);
        if (existing) {
          await ctx.db.patch(existing._id, {
            name: sub.name,
            code: sub.code,
            category: sub.category,
            grade: gradeData.grade,
            isActive: true,
          });
          subjectIdByCode[sub.code] = existing._id;
          subjectsUpdated++;
        } else {
          const id = await ctx.db.insert("subjects", {
            name: sub.name,
            code: sub.code,
            category: sub.category,
            grade: gradeData.grade,
            isActive: true,
          });
          subjectIdByCode[sub.code] = id;
          subjectsCreated++;
        }
      }
    }

    log.push(
      `✅ Subjects: ${subjectsCreated} created, ${subjectsUpdated} updated (${subjectsCreated + subjectsUpdated} total)`
    );

    // ─────────────────────────────────────────────────────────────
    // 3. ALL CLASSES — one class per grade (R to 12)
    // ─────────────────────────────────────────────────────────────
    const classDefinitions: {
      name: string;
      grade: number;
      capacity: number;
      subjectCodes: string[];
    }[] = [
      {
        name: "Grade R",
        grade: 0,
        capacity: 25,
        subjectCodes: ["MATH-GR", "HL-GR", "FAL-GR", "LIFE-GR"],
      },
      {
        name: "Grade 1",
        grade: 1,
        capacity: 30,
        subjectCodes: ["MATH-G1", "HL-G1", "FAL-G1", "LIFE-G1"],
      },
      {
        name: "Grade 2",
        grade: 2,
        capacity: 30,
        subjectCodes: ["MATH-G2", "HL-G2", "FAL-G2", "LIFE-G2"],
      },
      {
        name: "Grade 3",
        grade: 3,
        capacity: 30,
        subjectCodes: ["MATH-G3", "HL-G3", "FAL-G3", "LIFE-G3"],
      },
      {
        name: "Grade 4",
        grade: 4,
        capacity: 30,
        subjectCodes: ["MATH-G4", "HL-G4", "FAL-G4", "NST-G4", "SS-G4", "LIFE-G4", "EMS-G4", "ART-G4"],
      },
      {
        name: "Grade 5",
        grade: 5,
        capacity: 30,
        subjectCodes: ["MATH-G5", "HL-G5", "FAL-G5", "NST-G5", "SS-G5", "LIFE-G5", "EMS-G5", "ART-G5"],
      },
      {
        name: "Grade 6",
        grade: 6,
        capacity: 30,
        subjectCodes: ["MATH-G6", "HL-G6", "FAL-G6", "NST-G6", "SS-G6", "LIFE-G6", "EMS-G6", "ART-G6"],
      },
      {
        name: "Grade 7",
        grade: 7,
        capacity: 32,
        subjectCodes: ["MATH-G7", "HL-G7", "FAL-G7", "NS-G7", "SS-G7", "LO-G7", "EMS-G7", "TECH-G7", "CA-G7"],
      },
      {
        name: "Grade 8",
        grade: 8,
        capacity: 32,
        subjectCodes: ["MATH-G8", "HL-G8", "FAL-G8", "NS-G8", "SS-G8", "LO-G8", "EMS-G8", "TECH-G8", "CA-G8"],
      },
      {
        name: "Grade 9",
        grade: 9,
        capacity: 32,
        subjectCodes: ["MATH-G9", "HL-G9", "FAL-G9", "NS-G9", "SS-G9", "LO-G9", "EMS-G9", "TECH-G9", "CA-G9"],
      },
      {
        name: "Grade 10",
        grade: 10,
        capacity: 35,
        // Core compulsory + common electives
        subjectCodes: [
          "MATH-G10", "ENG-G10", "AFR-G10", "LO-G10",
          "PHYS-G10", "LSCI-G10", "HIST-G10", "GEO-G10",
          "ACC-G10", "BUS-G10", "ECON-G10", "CAT-G10",
        ],
      },
      {
        name: "Grade 11",
        grade: 11,
        capacity: 35,
        subjectCodes: [
          "MATH-G11", "ENG-G11", "AFR-G11", "LO-G11",
          "PHYS-G11", "LSCI-G11", "HIST-G11", "GEO-G11",
          "ACC-G11", "BUS-G11", "ECON-G11", "CAT-G11",
        ],
      },
      {
        name: "Grade 12",
        grade: 12,
        capacity: 35,
        subjectCodes: [
          "MATH-G12", "ENG-G12", "AFR-G12", "LO-G12",
          "PHYS-G12", "LSCI-G12", "HIST-G12", "GEO-G12",
          "ACC-G12", "BUS-G12", "ECON-G12", "CAT-G12",
        ],
      },
    ];

    const existingClasses = await ctx.db.query("classes").collect();
    const classByName = new Map(existingClasses.map((c) => [c.name, c]));
    let classesCreated = 0;
    let classesUpdated = 0;

    for (const cls of classDefinitions) {
      // Resolve subject IDs — only those that were seeded
      const subjectIds = cls.subjectCodes
        .map((code) => subjectIdByCode[code])
        .filter(Boolean);

      const existing = classByName.get(cls.name);
      if (existing) {
        await ctx.db.patch(existing._id, {
          academicYear: yearId,
          subjects: subjectIds,
          capacity: cls.capacity,
        });
        classesUpdated++;
      } else {
        await ctx.db.insert("classes", {
          name: cls.name,
          academicYear: yearId,
          subjects: subjectIds,
          students: [],
          capacity: cls.capacity,
        });
        classesCreated++;
      }
    }

    log.push(
      `✅ Classes: ${classesCreated} created, ${classesUpdated} updated (Grade R to Grade 12)`
    );

    // ─────────────────────────────────────────────────────────────
    // 4. ADMIN — ensure alexsouthflow2@gmail.com is admin
    // ─────────────────────────────────────────────────────────────
    const adminEmail = "alexsouthflow2@gmail.com";
    const existingAdmin = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", adminEmail))
      .first();

    if (existingAdmin) {
      await ctx.db.patch(existingAdmin._id, {
        role: "admin",
        isActive: true,
        isApproved: true,
        name: existingAdmin.name || "Alex Southflow",
      });
      log.push(`✅ Admin updated: ${adminEmail} → role=admin, isActive=true`);
    } else {
      await ctx.db.insert("users", {
        name: "Alex Southflow",
        email: adminEmail,
        role: "admin",
        isActive: true,
        isApproved: true,
      });
      log.push(`✅ Admin created: ${adminEmail}`);
    }

    // ─────────────────────────────────────────────────────────────
    // 5. SCHOOL SETTINGS — fix name & upsert
    // ─────────────────────────────────────────────────────────────
    const allSettings = await ctx.db.query("schoolSettings").collect();
    if (allSettings.length === 0) {
      await ctx.db.insert("schoolSettings", {
        name: "Glenanda Learning Center",
        address: "Glenanda, Johannesburg, Gauteng, 2000",
        phone: "+27 11 000 0000",
        email: "info@glenandalearning.co.za",
        motto: "Quality Education, Real Results",
        primaryColor: "#f97316",
      });
      log.push("✅ School settings created");
    } else {
      // Fix name if it still has "Shopping"
      for (const s of allSettings) {
        if (s.name.includes("Shopping")) {
          await ctx.db.patch(s._id, {
            name: "Glenanda Learning Center",
            address: "Glenanda, Johannesburg, Gauteng, 2000",
          });
          log.push("✅ School settings name fixed (removed 'Shopping')");
        }
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 6. DEMO USERS — 5 Demo Teachers & 5 Demo Students
    // ─────────────────────────────────────────────────────────────
    const demoTeachers = [
      {
        name: "Mr. Thabo Mokoena",
        email: "thabo.mokoena@glenandalearning.co.za",
        role: "teacher" as const,
        bio: "Head of Physical Sciences & Mathematics with 12+ years CAPS teaching experience.",
      },
      {
        name: "Mrs. Sarah van der Merwe",
        email: "sarah.vandermerwe@glenandalearning.co.za",
        role: "teacher" as const,
        bio: "Senior Educator specializing in English Home Language & Afrikaans FAL.",
      },
      {
        name: "Ms. Nomsa Khumalo",
        email: "nomsa.khumalo@glenandalearning.co.za",
        role: "teacher" as const,
        bio: "Life Orientation & History Specialist committed to holistic learner development.",
      },
      {
        name: "Mr. Sipho Ndlovu",
        email: "sipho.ndlovu@glenandalearning.co.za",
        role: "teacher" as const,
        bio: "Humanities & Economics HOD guiding learners towards academic distinction.",
      },
      {
        name: "Mrs. Lerato Moloi",
        email: "lerato.moloi@glenandalearning.co.za",
        role: "teacher" as const,
        bio: "Technology & Computer Applications specialist blending digital skills with CAPS.",
      },
    ];

    for (const t of demoTeachers) {
      const existing = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", t.email))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          name: t.name,
          role: "teacher",
          isActive: true,
          isApproved: true,
          bio: t.bio,
        });
      } else {
        await ctx.db.insert("users", {
          name: t.name,
          email: t.email,
          role: "teacher",
          isActive: true,
          isApproved: true,
          bio: t.bio,
        });
      }
    }
    log.push(`✅ 5 Demo Teachers ready`);

    // Get class IDs for students
    const allClasses = await ctx.db.query("classes").collect();
    const classByNameMap = new Map(allClasses.map((c) => [c.name, c._id]));

    const demoStudents = [
      {
        name: "Zanele Dlamini",
        email: "zanele.dlamini@student.glenandalearning.co.za",
        role: "student" as const,
        studentClass: classByNameMap.get("Grade 10"),
        bio: "Grade 10 learner passionate about Mathematics and Physical Sciences.",
      },
      {
        name: "Liam Patel",
        email: "liam.patel@student.glenandalearning.co.za",
        role: "student" as const,
        studentClass: classByNameMap.get("Grade 11"),
        bio: "Grade 11 candidate focusing on Information Technology and Accounting.",
      },
      {
        name: "Sipho Zulu",
        email: "sipho.zulu@student.glenandalearning.co.za",
        role: "student" as const,
        studentClass: classByNameMap.get("Grade 12"),
        bio: "Grade 12 Matric candidate aiming for distinction in CAPS examinations.",
      },
      {
        name: "Thandiwe Mbedzi",
        email: "thandiwe.mbedzi@student.glenandalearning.co.za",
        role: "student" as const,
        studentClass: classByNameMap.get("Grade 8"),
        bio: "Senior Phase Grade 8 student active in STEM and study groups.",
      },
      {
        name: "Amara Okafor",
        email: "amara.okafor@student.glenandalearning.co.za",
        role: "student" as const,
        studentClass: classByNameMap.get("Grade 4"),
        bio: "Intermediate Phase Grade 4 learner enthusiastic about Natural Sciences & Tech.",
      },
    ];

    for (const s of demoStudents) {
      let studentId;
      const existing = await ctx.db
        .query("users")
        .withIndex("email", (q) => q.eq("email", s.email))
        .first();
      if (existing) {
        studentId = existing._id;
        await ctx.db.patch(existing._id, {
          name: s.name,
          role: "student",
          isActive: true,
          isApproved: true,
          studentClass: s.studentClass,
          bio: s.bio,
        });
      } else {
        studentId = await ctx.db.insert("users", {
          name: s.name,
          email: s.email,
          role: "student",
          isActive: true,
          isApproved: true,
          studentClass: s.studentClass,
          bio: s.bio,
        });
      }

      // Explicitly link student to class.students array
      if (s.studentClass) {
        const clsDoc = await ctx.db.get(s.studentClass);
        if (clsDoc && !clsDoc.students.includes(studentId)) {
          await ctx.db.patch(s.studentClass, {
            students: [...clsDoc.students, studentId],
          });
        }
      }
    }
    log.push(`✅ 5 Demo Students ready and linked to classes`);

    return {
      success: true,
      log,
      summary: `Done! Subjects: ${subjectsCreated + subjectsUpdated} | Classes: ${classesCreated + classesUpdated} (Grade R–12) | Admin: ${adminEmail} | 5 Demo Teachers & 5 Demo Students created`,
    };
  },
});

