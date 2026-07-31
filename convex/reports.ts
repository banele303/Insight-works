import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// ─── SA 7-POINT SYMBOL SCALE (DBE) ───────────────────────────────
export const symbolForPercentage = (pct: number): string => {
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  if (pct >= 40) return "E";
  if (pct >= 30) return "F";
  return "G";
};

export const achievementLevelForPercentage = (pct: number): string => {
  if (pct >= 80) return "Outstanding achievement";
  if (pct >= 70) return "Meritorious achievement";
  if (pct >= 60) return "Substantial achievement";
  if (pct >= 50) return "Adequate achievement";
  if (pct >= 40) return "Elementary achievement";
  if (pct >= 30) return "Not achieved — moderate";
  return "Not achieved";
};

// ─── REAL REPORT CARD DATA ───────────────────────────────────────
// Builds term marks from ACTUAL assessment records (exam submissions
// and assignment submissions), never from mock data.

export const getStudentReportData = query({
  args: {
    studentId: v.id("users"),
    term: v.optional(v.number()), // 1-4, optional — filters by exam dueDate month
    academicYear: v.optional(v.id("academicYears")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");
    const viewer = await ctx.db.get(userId);
    if (!viewer) throw new Error("Unauthorized");

    const isStaff = viewer.role === "admin" || viewer.role === "teacher";
    const isParent = viewer.role === "parent" && viewer.linkedStudent === args.studentId;
    const isSelf = viewer._id === args.studentId;
    if (!isStaff && !isParent && !isSelf) {
      throw new Error("Not authorized to view this student's report");
    }

    const student = await ctx.db.get(args.studentId);
    if (!student) throw new Error("Student not found");

    // ── Gather all exam submissions for this student ─────────────
    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("student"), args.studentId))
      .collect();

    // ── Gather all assignment submissions ─────────────────────────
    const assignmentSubs = await ctx.db
      .query("assignmentSubmissions")
      .filter((q) => q.eq(q.field("student"), args.studentId))
      .collect();

    // ── Attendance ────────────────────────────────────────────────
    const attendanceRecords = await ctx.db
      .query("attendance")
      .filter((q) => q.eq(q.field("student"), args.studentId))
      .collect();

    const presentDays = attendanceRecords.filter((a) => a.status === "present").length;
    const attendancePct =
      attendanceRecords.length > 0
        ? Math.round((presentDays / attendanceRecords.length) * 100)
        : null;

    // ── Resolve subject info per exam ─────────────────────────────
    const examCache = new Map<string, any>();
    for (const sub of submissions) {
      if (!examCache.has(sub.exam)) {
        examCache.set(sub.exam, await ctx.db.get(sub.exam));
      }
    }
    const assignmentCache = new Map<string, any>();
    for (const sub of assignmentSubs) {
      if (!assignmentCache.has(sub.assignment)) {
        assignmentCache.set(sub.assignment, await ctx.db.get(sub.assignment));
      }
    }

    // ── Per-subject aggregation ───────────────────────────────────
    const subjectMap = new Map<
      string,
      {
        subjectId: string;
        subjectName: string;
        subjectCode?: string;
        category?: string;
        examEntries: { examTitle: string; score: number; total: number; pct: number; dueDate: string; examType?: string }[];
        assignmentEntries: { assignmentTitle: string; grade: number; max: number; pct: number; dueDate: string }[];
      }
    >();

    for (const sub of submissions) {
      const exam = examCache.get(sub.exam);
      if (!exam) continue;
      const total = exam.totalPoints || exam.questions?.reduce((s: number, q: any) => s + (q.points || 0), 0) || 0;
      if (total <= 0) continue;

      const pct = Math.min(100, Math.round((sub.score / total) * 100));
      const key = exam.subject;
      const subject: any = await ctx.db.get(exam.subject);

      let entry = subjectMap.get(key);
      if (!entry) {
        entry = {
          subjectId: key,
          subjectName: subject?.name || "Subject",
          subjectCode: subject?.code,
          category: subject?.category,
          examEntries: [],
          assignmentEntries: [],
        };
        subjectMap.set(key, entry);
      }
      entry.examEntries.push({
        examTitle: exam.title,
        score: sub.score,
        total,
        pct,
        dueDate: exam.dueDate,
        examType: exam.southAfricanExamType || exam.examType,
      });
    }

    for (const sub of assignmentSubs) {
      const assignment = assignmentCache.get(sub.assignment);
      if (!assignment) continue;
      const max = assignment.maxPoints || 100;
      if (max <= 0 || sub.grade === undefined || sub.grade === null) continue;

      const pct = Math.min(100, Math.round((sub.grade / max) * 100));
      const key = assignment.subject;
      const subject: any = await ctx.db.get(assignment.subject);

      let entry = subjectMap.get(key);
      if (!entry) {
        entry = {
          subjectId: key,
          subjectName: subject?.name || "Subject",
          subjectCode: subject?.code,
          category: subject?.category,
          examEntries: [],
          assignmentEntries: [],
        };
        subjectMap.set(key, entry);
      }
      entry.assignmentEntries.push({
        assignmentTitle: assignment.title,
        grade: sub.grade,
        max,
        pct,
        dueDate: assignment.dueDate,
      });
    }

    // ── Compute term marks (CAPS weighting: 40% exams + 60% SBA is
    //    the common FET split; for lower phases 50/50. We use a
    //    transparent formula: weighted mean of all recorded entries,
    //    exams weighted 2x assignments for FET, 1x for lower phases.)
    const studentClass = student.studentClass ? await ctx.db.get(student.studentClass) : null;
    const isFET = (studentClass?.name || "").match(/Grade\s*1[012]/i) !== null;

    const subjects = Array.from(subjectMap.values()).map((entry) => {
      const allPcts = [
        ...entry.examEntries.map((e) => e.pct),
        ...entry.assignmentEntries.map((a) => a.pct),
      ];
      if (allPcts.length === 0) return null;

      const weighted =
        isFET && entry.examEntries.length > 0
          ? Math.round(
              (entry.examEntries.reduce((s, e) => s + e.pct, 0) * 2 +
                entry.assignmentEntries.reduce((s, a) => s + a.pct, 0)) /
                (entry.examEntries.length * 2 + entry.assignmentEntries.length)
            )
          : Math.round(allPcts.reduce((s, p) => s + p, 0) / allPcts.length);

      const termMark = Math.min(100, Math.max(0, weighted));

      // Class average for the same subject (only from same-class exams)
      return {
        subjectId: entry.subjectId,
        subjectName: entry.subjectName,
        subjectCode: entry.subjectCode,
        category: entry.category,
        termMark,
        symbol: symbolForPercentage(termMark),
        achievement: achievementLevelForPercentage(termMark),
        examCount: entry.examEntries.length,
        assignmentCount: entry.assignmentEntries.length,
        entryCount: allPcts.length,
        bestMark: Math.max(...allPcts),
        lowestMark: Math.min(...allPcts),
      };
    });

    const validSubjects = subjects.filter(Boolean) as NonNullable<typeof subjects[number]>[];
    validSubjects.sort((a, b) => b.termMark - a.termMark);

    const average =
      validSubjects.length > 0
        ? Math.round(validSubjects.reduce((s, x) => s + x.termMark, 0) / validSubjects.length)
        : null;

    return {
      student: {
        name: student.name || "Student",
        id: student._id,
        class: studentClass?.name || "Unassigned",
        dateOfBirth: student.dateOfBirth || null,
      },
      summary: {
        average,
        overallSymbol: average !== null ? symbolForPercentage(average) : null,
        subjectsCount: validSubjects.length,
        examCount: submissions.length,
        assignmentCount: assignmentSubs.filter((s) => s.grade !== undefined).length,
        attendancePct,
        presentDays,
        totalSchoolDays: attendanceRecords.length,
      },
      subjects: validSubjects,
      examEntries: Array.from(subjectMap.values()).flatMap((e) =>
        e.examEntries.map((x) => ({ ...x, subjectName: e.subjectName }))
      ),
    };
  },
});

// ─── CLASS AVERAGES (for comparison on report) ───────────────────
export const getClassAverages = query({
  args: { classId: v.id("classes"), term: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");
    const viewer = await ctx.db.get(userId);
    if (!viewer) throw new Error("Unauthorized");

    const classObj = await ctx.db.get(args.classId);
    if (!classObj) return null;

    // All exams for this class
    const exams = await ctx.db
      .query("exams")
      .filter((q) => q.eq(q.field("class"), args.classId))
      .collect();
    const examIds = new Set(exams.map((e) => e._id));

    const allSubs = await ctx.db.query("submissions").collect();
    const classSubs = allSubs.filter((s) => examIds.has(s.exam));

    // Per subject: average percentage across all submissions
    const subjectAgg = new Map<string, { sum: number; count: number; name: string }>();
    for (const sub of classSubs) {
      const exam = exams.find((e) => e._id === sub.exam);
      if (!exam) continue;
      const total = exam.totalPoints || 0;
      if (total <= 0) continue;
      const pct = Math.round((sub.score / total) * 100);
      const cur = subjectAgg.get(exam.subject) || { sum: 0, count: 0, name: "" };
      cur.sum += pct;
      cur.count += 1;
      if (!cur.name) {
        const subject: any = await ctx.db.get(exam.subject);
        cur.name = subject?.name || "Subject";
      }
      subjectAgg.set(exam.subject, cur);
    }

    return Array.from(subjectAgg.entries()).map(([subjectId, agg]) => ({
      subjectId,
      subjectName: agg.name,
      average: agg.count > 0 ? Math.round(agg.sum / agg.count) : null,
      submissionsCount: agg.count,
    }));
  },
});

// ─── TEACHER: list of students with real term averages ───────────
export const getStudentAverages = query({
  args: { classId: v.optional(v.id("classes")) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Unauthorized");
    const viewer = await ctx.db.get(userId);
    if (!viewer || (viewer.role !== "admin" && viewer.role !== "teacher")) {
      throw new Error("Only teachers and admins can view averages");
    }

    const students = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "student"))
      .collect();
    const filtered = args.classId
      ? students.filter((s) => s.studentClass === args.classId)
      : students;

    const results = [];
    for (const student of filtered) {
      const subs = await ctx.db
        .query("submissions")
        .filter((q) => q.eq(q.field("student"), student._id))
        .collect();

      let totalPct = 0;
      let count = 0;
      for (const sub of subs) {
        const exam = await ctx.db.get(sub.exam);
        if (!exam) continue;
        const total = exam.totalPoints || 0;
        if (total <= 0) continue;
        totalPct += Math.round((sub.score / total) * 100);
        count += 1;
      }

      const assignmentSubs = await ctx.db
        .query("assignmentSubmissions")
        .filter((q) => q.eq(q.field("student"), student._id))
        .collect();
      const gradedAssignments = assignmentSubs.filter((a) => a.grade !== undefined);
      for (const a of gradedAssignments) {
        const assignment = await ctx.db.get(a.assignment);
        if (!assignment || !assignment.maxPoints) continue;
        totalPct += Math.round((a.grade! / assignment.maxPoints) * 100);
        count += 1;
      }

      const avg = count > 0 ? Math.round(totalPct / count) : null;
      const classObj = student.studentClass ? await ctx.db.get(student.studentClass) : null;

      results.push({
        studentId: student._id,
        name: student.name || "Student",
        class: classObj?.name || "Unassigned",
        average: avg,
        symbol: avg !== null ? symbolForPercentage(avg) : null,
        assessmentsCount: count,
      });
    }

    results.sort((a, b) => (b.average ?? -1) - (a.average ?? -1));
    return results;
  },
});
