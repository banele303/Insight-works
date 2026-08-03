import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { api } from "./_generated/api";

declare const process: { env: Record<string, string | undefined> };

const QUESTION_TYPE = v.union(
  v.literal("MCQ"),
  v.literal("SHORT_ANSWER"),
  v.literal("ESSAY"),
  v.literal("TRUE_FALSE"),
  v.literal("FILL_BLANK"),
  v.literal("MATCH_COLUMN"),
  v.literal("CALCULATION"),
  v.literal("DIAGRAM_LABEL")
);

const questionShape = v.object({
  questionText: v.string(),
  type: QUESTION_TYPE,
  options: v.optional(v.array(v.string())),
  correctAnswer: v.optional(v.string()),
  points: v.number(),
  topic: v.optional(v.string()),
  matchPairs: v.optional(v.array(v.object({ left: v.string(), right: v.string() }))),
  diagramUrl: v.optional(v.string()),
  memo: v.optional(v.string()),
});

// ─── HELPERS ─────────────────────────────────────────────────────

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

async function isTeacherOrAdmin(ctx: any, userId: any): Promise<boolean> {
  const user = await ctx.db.get(userId);
  return user?.role === "teacher" || user?.role === "admin";
}

// Objective question auto-grade (MCQ, TRUE_FALSE, FILL_BLANK, MATCH_COLUMN)
function autoGrade(q: any, studentAnswer?: string, matchAnswers?: Record<string, string>): number {
  const pts = q.points || 0;
  if (q.type === "MCQ" || q.type === "TRUE_FALSE") {
    if (!q.correctAnswer || !studentAnswer) return 0;
    const norm = normalize(studentAnswer);
    const correct = normalize(q.correctAnswer);
    if (correct === norm) return pts;
    // AI often sets correctAnswer to just the letter ("B") while options are "B) text"
    if (q.type === "MCQ" && Array.isArray(q.options)) {
      const letter = correct.replace(/[^a-z]/gi, "").toLowerCase();
      if (letter.length === 1) {
        const idx = letter.charCodeAt(0) - 97;
        const target = q.options[idx];
        if (target && normalize(target) === norm) return pts;
        // also match "B) text" style answers
        if (norm.startsWith(letter + ")") || norm === letter) return pts;
      }
    }
    return 0;
  }
  if (q.type === "FILL_BLANK") {
    if (!q.correctAnswer || !studentAnswer) return 0;
    // Accept the exact phrase OR any of its comma-separated alternatives
    const accepted = q.correctAnswer.split(",").map((a: string) => normalize(a));
    const norm = normalize(studentAnswer);
    return accepted.some((a: string) => a === norm || norm.includes(a) || a.includes(norm)) ? pts : 0;
  }
  if (q.type === "MATCH_COLUMN") {
    if (!q.matchPairs || !matchAnswers) return 0;
    const pairs = q.matchPairs;
    let earned = 0;
    for (const pair of pairs) {
      const studentRight = matchAnswers[pair.left];
      if (studentRight && normalize(studentRight) === normalize(pair.right)) {
        earned += pts / pairs.length;
      }
    }
    return Math.round(earned * 100) / 100;
  }
  return 0;
}

function totalPointsOf(questions: any[]): number {
  return questions.reduce((sum, q) => sum + (q.points || 0), 0);
}

// ─── QUERIES ─────────────────────────────────────────────────────

// Student: published tasks for my class, with my submission status
export const getMyTasks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const user = await ctx.db.get(userId);
    if (!user) return [];
    if (user.role === "student" && !user.studentClass) return [];

    const tasks = await ctx.db.query("homeworkTasks").collect();
    const visible = tasks.filter((t) => t.status !== "draft");

    const result = [];
    for (const t of visible) {
      if (user.role === "student") {
        if (t.class !== user.studentClass) continue;
        const sub = await ctx.db
          .query("homeworkTaskSubmissions")
          .withIndex("by_task_student", (q) => q.eq("task", t._id).eq("student", userId))
          .first();
        const subject = await ctx.db.get(t.subject);
        const cls = await ctx.db.get(t.class);
        result.push({ ...t, subject: subject ? { _id: subject._id, name: subject.name } : null, class: cls ? { _id: cls._id, name: cls.name } : null, mySubmission: sub || null });
      } else {
        const subject = await ctx.db.get(t.subject);
        const cls = await ctx.db.get(t.class);
        result.push({ ...t, subject: subject ? { _id: subject._id, name: subject.name } : null, class: cls ? { _id: cls._id, name: cls.name } : null });
      }
    }
    return result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  },
});

// Teacher/admin: tasks I created (or all for admin)
export const getTeacherTasks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    if (!(await isTeacherOrAdmin(ctx, userId))) return [];

    const tasks = await ctx.db.query("homeworkTasks").collect();
    const mine = tasks.filter((t) => t.teacher === userId);
    const result = [];
    for (const t of mine) {
      const subject = await ctx.db.get(t.subject);
      const cls = await ctx.db.get(t.class);
      const subs = await ctx.db
        .query("homeworkTaskSubmissions")
        .withIndex("by_task", (q) => q.eq("task", t._id))
        .collect();
      const classDoc = cls as any;
      const studentCount = classDoc?.students?.length ?? 0;
      result.push({
        ...t,
        subject: subject ? { _id: subject._id, name: subject.name } : null,
        class: cls ? { _id: cls._id, name: cls.name } : null,
        submissionCount: subs.length,
        studentCount,
        gradedCount: subs.filter((s) => s.status === "graded" || s.status === "returned").length,
        avgScore: subs.filter((s) => s.score !== undefined).length
          ? Math.round(subs.filter((s) => s.score !== undefined).reduce((a, s) => a + (s.score || 0), 0) / subs.filter((s) => s.score !== undefined).length)
          : 0,
      });
    }
    return result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  },
});

// Single task detail (teacher or student of that class)
export const getTask = query({
  args: { taskId: v.id("homeworkTasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const task = await ctx.db.get(args.taskId);
    if (!task) return null;

    const user = await ctx.db.get(userId);
    const isTeacherView = user?.role === "teacher" || user?.role === "admin";
    if (!isTeacherView && user?.role === "student") {
      if (task.status === "draft" || task.class !== user.studentClass) return null;
    }

    const subject = await ctx.db.get(task.subject);
    const cls = await ctx.db.get(task.class);
    const teacher = await ctx.db.get(task.teacher);
    let mySubmission = null;
    if (user?.role === "student") {
      mySubmission = await ctx.db
        .query("homeworkTaskSubmissions")
        .withIndex("by_task_student", (q) => q.eq("task", task._id).eq("student", userId))
        .first();
    }

    return {
      ...task,
      subject: subject ? { _id: subject._id, name: subject.name } : null,
      class: cls ? { _id: cls._id, name: cls.name } : null,
      teacher: teacher ? { _id: teacher._id, name: teacher.name } : null,
      isTeacherView,
      mySubmission,
    };
  },
});

// Teacher: all submissions for a task (with student info)
export const getTaskSubmissions = query({
  args: { taskId: v.id("homeworkTasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    if (!(await isTeacherOrAdmin(ctx, userId))) return [];

    const subs = await ctx.db
      .query("homeworkTaskSubmissions")
      .withIndex("by_task", (q) => q.eq("task", args.taskId))
      .collect();
    const result = [];
    for (const s of subs) {
      const student = await ctx.db.get(s.student);
      result.push({
        ...s,
        student: student ? { _id: student._id, name: student.name, email: student.email, image: student.image } : null,
      });
    }
    return result.sort((a, b) => b.submittedAt - a.submittedAt);
  },
});

// ─── MUTATIONS (teacher) ─────────────────────────────────────────

export const createTask = mutation({
  args: {
    title: v.string(),
    instructions: v.optional(v.string()),
    subject: v.id("subjects"),
    class: v.id("classes"),
    dueDate: v.string(),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    allowResubmission: v.optional(v.boolean()),
    showAnswersAfter: v.optional(v.union(v.literal("never"), v.literal("afterDue"), v.literal("afterGrade"))),
    questions: v.array(questionShape),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    if (!(await isTeacherOrAdmin(ctx, userId))) throw new Error("Only teachers can create homework");

    return await ctx.db.insert("homeworkTasks", {
      title: args.title,
      instructions: args.instructions,
      subject: args.subject,
      class: args.class,
      teacher: userId,
      dueDate: args.dueDate,
      totalPoints: totalPointsOf(args.questions),
      status: args.status || "draft",
      allowResubmission: args.allowResubmission ?? false,
      showAnswersAfter: args.showAnswersAfter ?? "never",
      createdAt: Date.now(),
      questions: args.questions,
    });
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("homeworkTasks"),
    title: v.optional(v.string()),
    instructions: v.optional(v.string()),
    subject: v.optional(v.id("subjects")),
    class: v.optional(v.id("classes")),
    dueDate: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"), v.literal("closed"))),
    allowResubmission: v.optional(v.boolean()),
    showAnswersAfter: v.optional(v.union(v.literal("never"), v.literal("afterDue"), v.literal("afterGrade"))),
    questions: v.optional(v.array(questionShape)),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    if (!(await isTeacherOrAdmin(ctx, userId))) throw new Error("Only teachers can update homework");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Homework not found");
    if (task.teacher !== userId) {
      const user = await ctx.db.get(userId);
      if (user?.role !== "admin") throw new Error("Not your homework");
    }

    const patch: any = {};
    if (args.title !== undefined) patch.title = args.title;
    if (args.instructions !== undefined) patch.instructions = args.instructions;
    if (args.subject !== undefined) patch.subject = args.subject;
    if (args.class !== undefined) patch.class = args.class;
    if (args.dueDate !== undefined) patch.dueDate = args.dueDate;
    if (args.status !== undefined) patch.status = args.status;
    if (args.allowResubmission !== undefined) patch.allowResubmission = args.allowResubmission;
    if (args.showAnswersAfter !== undefined) patch.showAnswersAfter = args.showAnswersAfter;
    if (args.questions !== undefined) {
      patch.questions = args.questions;
      patch.totalPoints = totalPointsOf(args.questions);
    }
    await ctx.db.patch(args.taskId, patch);
    return { success: true };
  },
});

export const setTaskStatus = mutation({
  args: {
    taskId: v.id("homeworkTasks"),
    status: v.union(v.literal("draft"), v.literal("published"), v.literal("closed")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    if (!(await isTeacherOrAdmin(ctx, userId))) throw new Error("Only teachers can change status");
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Homework not found");
    if (task.teacher !== userId) {
      const user = await ctx.db.get(userId);
      if (user?.role !== "admin") throw new Error("Not your homework");
    }
    await ctx.db.patch(args.taskId, { status: args.status });
    return { success: true };
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("homeworkTasks") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    if (!(await isTeacherOrAdmin(ctx, userId))) throw new Error("Only teachers can delete homework");
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Homework not found");
    if (task.teacher !== userId) {
      const user = await ctx.db.get(userId);
      if (user?.role !== "admin") throw new Error("Not your homework");
    }
    // Delete linked submissions
    const subs = await ctx.db.query("homeworkTaskSubmissions").withIndex("by_task", (q) => q.eq("task", args.taskId)).collect();
    for (const s of subs) await ctx.db.delete(s._id);
    await ctx.db.delete(args.taskId);
    return { success: true };
  },
});

// ─── MUTATIONS (student) ─────────────────────────────────────────

export const submitTask = mutation({
  args: {
    taskId: v.id("homeworkTasks"),
    answers: v.array(
      v.object({
        questionIndex: v.number(),
        answer: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Homework not found");
    if (task.status === "draft") throw new Error("Homework is not published yet");
    if (task.status === "closed") throw new Error("Homework is closed");

    const existing = await ctx.db
      .query("homeworkTaskSubmissions")
      .withIndex("by_task_student", (q) => q.eq("task", args.taskId).eq("student", userId))
      .first();

    // Auto-grade objective questions
    const grades: any[] = [];
    let autoScore = 0;
    for (const q of task.questions) {
      const qIndex = task.questions.indexOf(q);
      const ans = args.answers.find((a) => a.questionIndex === qIndex);
      if (q.type === "MCQ" || q.type === "TRUE_FALSE" || q.type === "FILL_BLANK" || q.type === "MATCH_COLUMN") {
        let matchAnswers: Record<string, string> | undefined;
        if (q.type === "MATCH_COLUMN" && ans?.answer) {
          try {
            matchAnswers = JSON.parse(ans.answer);
          } catch {
            matchAnswers = {};
          }
        }
        const earned = autoGrade(q, ans?.answer, matchAnswers);
        autoScore += earned;
        grades.push({
          questionIndex: qIndex,
          earned,
          feedback: earned === q.points ? "✓ Correct" : "Incorrect — check the memo",
          gradedBy: "auto" as const,
        });
      } else {
        grades.push({ questionIndex: qIndex, earned: undefined, feedback: undefined, gradedBy: undefined });
      }
    }

    const payload = {
      task: args.taskId,
      student: userId,
      answers: args.answers,
      submittedAt: Date.now(),
      status: "submitted" as const,
      score: autoScore > 0 ? autoScore : undefined,
      grades,
      aiFeedback: undefined,
      teacherFeedback: existing?.teacherFeedback,
    };

    if (existing) {
      // Allow resubmission only if enabled; otherwise throw
      if (!task.allowResubmission && existing.status !== "returned") {
        throw new Error("Homework already submitted and resubmission is not allowed");
      }
      await ctx.db.patch(existing._id, payload);
      return { submissionId: existing._id, resubmitted: true };
    }
    const id = await ctx.db.insert("homeworkTaskSubmissions", payload);
    return { submissionId: id, resubmitted: false };
  },
});

// Teacher: override a grade / add feedback / return
export const teacherGrade = mutation({
  args: {
    submissionId: v.id("homeworkTaskSubmissions"),
    grades: v.optional(
      v.array(
        v.object({
          questionIndex: v.number(),
          earned: v.optional(v.number()),
          feedback: v.optional(v.string()),
          gradedBy: v.optional(v.union(v.literal("auto"), v.literal("ai"), v.literal("teacher"))),
        })
      )
    ),
    teacherFeedback: v.optional(v.string()),
    status: v.optional(v.union(v.literal("submitted"), v.literal("graded"), v.literal("returned"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    if (!(await isTeacherOrAdmin(ctx, userId))) throw new Error("Only teachers can grade");

    const sub = await ctx.db.get(args.submissionId);
    if (!sub) throw new Error("Submission not found");

    const task = await ctx.db.get(sub.task);
    const patch: any = {};
    if (args.grades) {
      patch.grades = args.grades.map((g) => ({ ...g, gradedBy: (g.gradedBy || "teacher") as any }));
      // Recompute total
      const total = args.grades.reduce((a, g) => a + (g.earned || 0), 0);
      patch.score = Math.round(total * 100) / 100;
    }
    if (args.teacherFeedback !== undefined) patch.teacherFeedback = args.teacherFeedback;
    if (args.status) patch.status = args.status;
    if (args.status === "graded" || args.status === "returned") patch.gradedAt = Date.now();
    await ctx.db.patch(args.submissionId, patch);
    return { success: true, task };
  },
});

// ─── AI GRADING ACTION ───────────────────────────────────────────

// Grade a student's open-ended answers (ESSAY, SHORT_ANSWER, CALCULATION, DIAGRAM_LABEL).
// Handles both typed text and photo-of-workbook (imageUrl) answers.
export const gradeSubmissionWithAI = action({
  args: {
    submissionId: v.id("homeworkTaskSubmissions"),
  },
  handler: async (ctx, args) => {
    const sub: any = await ctx.runQuery(api.homeworkTasks.getSubmissionForAIGrading, {
      submissionId: args.submissionId,
    });
    if (!sub) throw new Error("Submission not found");

    const { submission, task } = sub;
    const openEnded = ["ESSAY", "SHORT_ANSWER", "CALCULATION", "DIAGRAM_LABEL"];

    const gradingItems = (task.questions as any[])
      .map((q: any, idx: number) => ({ ...q, idx }))
      .filter((q: any) => openEnded.includes(q.type));

    if (gradingItems.length === 0) {
      return { success: true, message: "No open-ended questions to grade" };
    }

    const cfWorkerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://edunexus-ai.edusqwizooor.workers.dev";
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;

    const gradedItems: any[] = [];
    let totalEarned = 0;

    for (const q of gradingItems) {
      const ans = (submission.answers || []).find((a: any) => a.questionIndex === q.idx);
      const studentText = ans?.answer || "";
      const imageUrl = ans?.imageUrl || "";
      const memo = q.memo || q.correctAnswer || "";

      let result: any = null;

      // Photo answer → vision grading via worker
      if (imageUrl) {
        try {
          const visionRes = await fetch(`${cfWorkerUrl}/api/grade-photo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl,
              questionText: q.questionText,
              memoText: memo,
              maxPoints: q.points,
              subjectName: task.subject?.name,
            }),
          });
          if (visionRes.ok) {
            result = await visionRes.json();
          }
        } catch (e) {
          console.warn("Vision grading failed, falling back to text:", e);
        }
      }

      // Text answer → text grading (primary provider, then worker)
      if (!result && studentText.trim()) {
        if (apiKey) {
          try {
            const openai = createOpenAI({
              apiKey,
              baseURL: process.env.DEEPSEEK_API_KEY ? "https://api.deepseek.com/v1" : undefined,
            });
            const prompt = buildGradingPrompt(q, studentText, memo, task);
            const res = await generateText({ model: openai.chat("deepseek-chat"), prompt });
            result = parseGradingJson(res.text);
          } catch (e) {
            console.warn("Primary AI grading failed:", e);
          }
        }
        if (!result) {
          try {
            const cfRes = await fetch(`${cfWorkerUrl}/api/mark-scanned-work`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: task.title,
                subjectName: task.subject?.name,
                questionText: q.questionText,
                memoText: memo || "No memo provided. Infer a fair rubric from the question.",
                studentText,
                rubric: `Total marks available: ${q.points}. Grade fairly against the memo and question.`,
              }),
            });
            if (cfRes.ok) {
              const cfData = await cfRes.json();
              const earned = q.points * ((cfData.percentage || 0) / 100);
              result = {
                earnedPoints: Math.min(q.points, Math.round(earned * 100) / 100),
                feedback: cfData.feedback || "",
              };
            }
          } catch (e) {
            console.error("Worker grading failed:", e);
          }
        }
      }

      if (result && typeof result.earnedPoints === "number") {
        const earned = Math.max(0, Math.min(q.points, Math.round(result.earnedPoints * 100) / 100));
        totalEarned += earned;
        gradedItems.push({
          questionIndex: q.idx,
          earned,
          feedback: result.feedback || "",
          gradedBy: "ai",
        });
      } else {
        gradedItems.push({
          questionIndex: q.idx,
          earned: undefined,
          feedback: studentText.trim() || imageUrl ? "Not graded yet — add a typed answer or retry AI grading." : "No answer provided.",
          gradedBy: undefined,
        });
      }
    }

    // Merge with existing auto-grades (objective questions)
    const existingGrades = (submission.grades || []).filter((g: any) => g.gradedBy === "auto");
    const merged = [...existingGrades, ...gradedItems].sort((a, b) => a.questionIndex - b.questionIndex);
    const finalScore = merged.filter((g: any) => typeof g.earned === "number").reduce((a, g: any) => a + g.earned, 0);

    await ctx.runMutation(api.homeworkTasks.saveAIGrade, {
      submissionId: args.submissionId,
      grades: merged,
      score: Math.round(finalScore * 100) / 100,
      aiFeedback: buildOverallFeedback(gradedItems),
    });

    return { success: true, gradedItems, score: Math.round(finalScore * 100) / 100 };
  },
});

// Internal: fetch submission + task for the AI grading action
export const getSubmissionForAIGrading = query({
  args: { submissionId: v.id("homeworkTaskSubmissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) return null;
    const task = await ctx.db.get(submission.task);
    if (!task) return null;
    const subject = task.subject ? await ctx.db.get(task.subject) : null;
    const student = await ctx.db.get(submission.student);
    return {
      submission,
      task: { ...task, subject: subject ? { _id: subject._id, name: subject.name } : null },
      studentName: student?.name || "Student",
    };
  },
});

// Internal: persist AI grades
export const saveAIGrade = mutation({
  args: {
    submissionId: v.id("homeworkTaskSubmissions"),
    grades: v.array(
      v.object({
        questionIndex: v.number(),
        earned: v.optional(v.number()),
        feedback: v.optional(v.string()),
        gradedBy: v.optional(v.union(v.literal("auto"), v.literal("ai"), v.literal("teacher"))),
      })
    ),
    score: v.number(),
    aiFeedback: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, {
      grades: args.grades,
      score: args.score,
      aiFeedback: args.aiFeedback,
      status: "graded",
      gradedAt: Date.now(),
    });
  },
});

// ─── AI HOMEWORK QUESTION GENERATION ─────────────────────────────

// Generate a set of homework questions with AI (teacher picks topic +
// question mix; AI writes the questions and memos). Grade-aware: the
// real grade is derived from the class name, never from "difficulty".
export const generateHomeworkQuestions = action({
  args: {
    classId: v.id("classes"),
    subjectId: v.id("subjects"),
    topics: v.array(v.string()),
    difficulty: v.optional(v.string()),
    questionMix: v.array(
      v.object({
        type: v.string(),
        count: v.number(),
        points: v.number(),
      })
    ),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");
    if (!(await isTeacherOrAdmin(ctx, userId))) throw new Error("Only teachers can generate homework");

    if (args.topics.length === 0) throw new Error("Add at least one topic");

    const classes: any = await ctx.runQuery(api.classes.getClasses, { academicYear: undefined });
    const classObj = classes?.find((c: any) => c._id === args.classId);
    const parsedGrade = classObj?.name ? parseInt(String(classObj.name).replace(/\D/g, ""), 10) : NaN;
    const grade = Number.isNaN(parsedGrade) ? undefined : parsedGrade;

    const subjects: any = await ctx.runQuery(api.subjects.getSubjects);
    const subject = subjects?.find((s: any) => s._id === args.subjectId);
    const subjectName = subject?.name || "General";
    const subjectCategory = (subject?.category || "other").toLowerCase();

    const PHASE_FOR_GRADE = (g: number): string => {
      if (g <= 0) return "Pre-school (Grade R)";
      if (g <= 3) return "Foundation Phase (Grades 1-3)";
      if (g <= 6) return "Intermediate Phase (Grades 4-6)";
      if (g <= 9) return "Senior Phase (Grades 7-9)";
      return "FET Phase (Grades 10-12)";
    };
    const COGNITIVE_BY_PHASE: Record<string, string> = {
      "Pre-school (Grade R)": "concrete, play-based, visual; simple recall and recognition",
      "Foundation Phase (Grades 1-3)": "recall, simple comprehension; short answers; concrete contexts",
      "Intermediate Phase (Grades 4-6)": "recall, comprehension, basic application; structured questions",
      "Senior Phase (Grades 7-9)": "application, analysis and evaluation with clear instruction verbs",
      "FET Phase (Grades 10-12)": "full range of cognitive levels matching NSC examination verb conventions (state, define, describe, explain, discuss, evaluate, compare, analyse)",
    };
    const LANGUAGE_BY_PHASE: Record<string, string> = {
      "Pre-school (Grade R)": "simple, short sentences; everyday vocabulary; pictures/visual prompts",
      "Foundation Phase (Grades 1-3)": "simple English with short sentences; familiar everyday vocabulary; step-by-step wording",
      "Intermediate Phase (Grades 4-6)": "clear, accessible English; define any technical terms; moderately complex sentences",
      "Senior Phase (Grades 7-9)": "standard academic register with defined terminology",
      "FET Phase (Grades 10-12)": "full NSC academic register; subject-specific terminology expected without definitions",
    };
    const phase = grade !== undefined ? PHASE_FOR_GRADE(grade) : "Intermediate Phase (Grades 4-6)";
    const cognitive = COGNITIVE_BY_PHASE[phase];
    const language = LANGUAGE_BY_PHASE[phase];
    const difficulty = args.difficulty || "Medium";
    const gradeLabel = grade !== undefined ? `Grade ${grade} (${phase})` : `Class ${classObj?.name || ""} — grade inferred`;

    const typeInstructions = (mix: { type: string; count: number; points: number }[]) =>
      mix
        .map((m) => {
          const guide: Record<string, string> = {
            MCQ: "multiple choice with exactly 4 options (A, B, C, D) and the correct option letter + text as correctAnswer",
            TRUE_FALSE: "true/false statement; correctAnswer is 'True' or 'False'",
            FILL_BLANK: "fill-in-the-blank with a single missing word/phrase; correctAnswer lists accepted answers separated by commas",
            MATCH_COLUMN: "match-column with 3-5 pairs; matchPairs is [{left, right}]",
            SHORT_ANSWER: "short answer (2-5 sentences expected); memo holds key points the answer must contain",
            ESSAY: "essay question; memo holds the marking rubric / key points (arguments, evidence, structure)",
            CALCULATION: "calculation problem; memo holds the method and final answer",
            DIAGRAM_LABEL: "diagram-label question; memo holds the expected labels (e.g. '1=nucleus, 2=membrane')",
          };
          return `- ${m.count} × ${m.type} (${m.points} marks each): ${guide[m.type] || "standard question"}`;
        })
        .join("\n");

    const prompt = `You are an expert South African CAPS teacher. Create a homework assignment titled "${args.title}" for ${gradeLabel}.

SUBJECT: ${subjectName} (category: ${subjectCategory})
TOPICS TO COVER: ${args.topics.join(", ")}
DIFFICULTY: ${difficulty}

CURRICULUM CONTEXT:
- Phase: ${phase}
- Cognitive demand: ${cognitive}
- Language register: ${language}

QUESTION MIX:
${typeInstructions(args.questionMix)}

RULES:
1. Output ONLY raw JSON — no markdown fences, no extra text.
2. Every question must be at the correct grade level — never above or below.
3. Use South African context where relevant (rand, SA place names, CAPS terminology).
4. MCQ must have exactly 4 options and correctAnswer = "A) <text>" style or just the letter.
5. TRUE_FALSE correctAnswer is exactly "True" or "False".
6. FILL_BLANK correctAnswer can have comma-separated accepted variants.
7. For open-ended types (SHORT_ANSWER, ESSAY, CALCULATION, DIAGRAM_LABEL) provide a thorough memo with the key marking points.
8. Total questions must match the requested mix exactly.

JSON FORMAT:
{
  "questions": [
    {
      "questionText": "...",
      "type": "MCQ",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correctAnswer": "B",
      "points": 5,
      "topic": "Topic name",
      "memo": "Model answer / marking key (required for open-ended types)"
    }
  ]
}`;

    const cfWorkerUrl = process.env.CLOUDFLARE_WORKER_URL || "https://edunexus-ai.edusqwizooor.workers.dev";
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    let text = "";

    if (apiKey) {
      try {
        const openai = createOpenAI({
          apiKey,
          baseURL: process.env.DEEPSEEK_API_KEY ? "https://api.deepseek.com/v1" : undefined,
        });
        const res = await generateText({ model: openai.chat("deepseek-chat"), prompt });
        text = res.text;
      } catch (e) {
        console.warn("Primary AI homework generation failed, trying worker:", e);
      }
    }
    if (!text) {
      try {
        const cfRes = await fetch(`${cfWorkerUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
        });
        if (cfRes.ok) {
          const cfData: any = await cfRes.json();
          text = cfData.response || "";
        }
      } catch (e) {
        console.error("Worker homework generation failed:", e);
      }
    }
    if (!text) {
      return { success: false, questions: [], error: "AI service is unavailable. Check API keys / Cloudflare Workers AI." };
    }

    const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return { success: false, questions: [], error: "AI returned invalid JSON" };
    }
    let parsed: any;
    try {
      parsed = JSON.parse(clean.substring(start, end + 1));
    } catch {
      return { success: false, questions: [], error: "AI returned invalid JSON" };
    }
    const normalizeOptions = (opts: any): string[] | undefined => {
      if (Array.isArray(opts)) return opts.map(String).filter((o) => o.trim());
      if (opts && typeof opts === "object") {
        // Models often return {A: "...", B: "...", C: "...", D: "..."}
        const keys = Object.keys(opts).sort();
        const arr = keys.map((k) => `${k}) ${String(opts[k]).trim()}`);
        return arr.length >= 2 ? arr : undefined;
      }
      return undefined;
    };
    const questions: any[] = (parsed.questions || []).map((q: any) => ({
      questionText: String(q.questionText || "").trim(),
      type: String(q.type || "SHORT_ANSWER").toUpperCase().replace(" ", "_"),
      options: normalizeOptions(q.options),
      correctAnswer: q.correctAnswer !== undefined && q.correctAnswer !== null ? String(q.correctAnswer) : undefined,
      points: Math.max(1, Number(q.points) || 5),
      topic: q.topic ? String(q.topic) : undefined,
      memo: q.memo ? String(q.memo) : undefined,
    })).filter((q: any) => q.questionText);

    if (questions.length === 0) {
      return { success: false, questions: [], error: "AI returned no questions" };
    }
    return { success: true, questions, generatedGrade: grade, phase };
  },
});

// ─── PROMPT HELPERS ──────────────────────────────────────────────

function buildGradingPrompt(q: any, studentText: string, memo: string, task: any): string {
  const typeGuide: Record<string, string> = {
    SHORT_ANSWER: "Short answer (2-5 sentences). Award marks for accuracy, key terminology, and completeness.",
    ESSAY: "Essay. Award marks for argument structure, evidence, insight, and curriculum alignment.",
    CALCULATION: "Calculation. Award marks for correct method AND correct final answer; give partial marks for working.",
    DIAGRAM_LABEL: "Diagram labelling. Award marks for correct identification and spelling of labels.",
  };
  return `You are an expert South African CAPS teacher marking a student's homework.

HOMEWORK: ${task.title}
QUESTION TYPE: ${q.type}
${typeGuide[q.type] || ""}
MAXIMUM MARKS: ${q.points}

QUESTION: ${q.questionText}

TEACHER MEMO / EXPECTED ANSWER:
${memo || "Not provided — infer a fair rubric from the question."}

STUDENT'S ANSWER:
"${studentText}"

Return ONLY valid JSON (no markdown fences):
{
  "earnedPoints": <number between 0 and ${q.points}, partial marks allowed>,
  "feedback": "<1-3 sentences: what was correct, what was missing, one improvement tip, encouraging>"
}`;
}

function parseGradingJson(text: string): any {
  const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(clean.substring(start, end + 1));
  } catch {
    return null;
  }
}

function buildOverallFeedback(gradedItems: any[]): string {
  const graded = gradedItems.filter((g) => typeof g.earned === "number");
  if (graded.length === 0) return "No open-ended answers graded yet.";
  const total = graded.reduce((a, g) => a + (g.earned || 0), 0);
  const max = graded.reduce((a, g) => a + g.maxPoints, 0) || 1;
  const pct = Math.round((total / max) * 100);
  const strengths = graded.filter((g) => (g.earned || 0) >= (g.maxPoints || 1) * 0.7).length;
  let msg = `You scored ${total} marks on the marked questions (${pct}%). `;
  if (strengths === graded.length) msg += "Excellent work — strong understanding across the board. Keep it up! ";
  else if (pct >= 70) msg += "Good job! A few areas to polish — read the feedback below. ";
  else if (pct >= 50) msg += "Solid effort. Review the feedback and try again on the weaker questions. ";
  else msg += "Don't give up — use the feedback to improve and ask your teacher for help. ";
  return msg;
}
