import { useState, useRef, useMemo } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/AuthProvider";
import {
  Sparkles, Plus, Trash2, Send, Camera, CheckCircle, XCircle, Clock,
  BookOpen, Users, BarChart3, FileText, GraduationCap, ArrowLeft, RefreshCw, X,
  ImagePlus, ListChecks, PenLine, Lightbulb, Trophy, Target,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { uploadFileToR2 } from "@/lib/cloudflareWorker";

type QuestionType = "MCQ" | "SHORT_ANSWER" | "ESSAY" | "TRUE_FALSE" | "FILL_BLANK" | "MATCH_COLUMN" | "CALCULATION" | "DIAGRAM_LABEL";

interface QuestionDraft {
  questionText: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  points: number;
  memo: string;
  matchPairs: { left: string; right: string }[];
}

const EMPTY_Q: QuestionDraft = {
  questionText: "",
  type: "MCQ",
  options: ["", "", "", ""],
  correctAnswer: "",
  points: 5,
  memo: "",
  matchPairs: [{ left: "", right: "" }],
};

const QUESTION_TYPES: { value: QuestionType; label: string; icon: any; hint: string }[] = [
  { value: "MCQ", label: "Multiple Choice", icon: ListChecks, hint: "Pick one of 4 options — auto-graded" },
  { value: "TRUE_FALSE", label: "True / False", icon: CheckCircle, hint: "True or false — auto-graded" },
  { value: "FILL_BLANK", label: "Fill in the Blank", icon: PenLine, hint: "Type the missing word — auto-graded" },
  { value: "MATCH_COLUMN", label: "Match Columns", icon: GitBranchIcon, hint: "Match left to right — auto-graded" },
  { value: "SHORT_ANSWER", label: "Short Answer", icon: PenLine, hint: "2–5 sentence answer — AI graded" },
  { value: "ESSAY", label: "Essay", icon: FileText, hint: "Write in your book, snap a photo — AI graded" },
  { value: "CALCULATION", label: "Calculation", icon: Target, hint: "Show your working — AI graded" },
  { value: "DIAGRAM_LABEL", label: "Diagram / Label", icon: ImagePlus, hint: "Label a diagram — AI graded" },
];

function GitBranchIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" {...props}>
      <line x1="6" x2="6" y1="3" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

const TYPE_COLORS: Record<string, string> = {
  MCQ: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  TRUE_FALSE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  FILL_BLANK: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  MATCH_COLUMN: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  SHORT_ANSWER: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  ESSAY: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  CALCULATION: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  DIAGRAM_LABEL: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
};

export default function HomeworkStudioPage() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6 bg-[#030712] min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            Homework Studio
          </h1>
          <p className="text-zinc-400 mt-1">
            {isTeacher
              ? "Create homework, deliver it to your class, and let AI help you mark it"
              : "Your homework, marked instantly by AI — write in your book, snap a photo, done"}
          </p>
        </div>
        {isTeacher && <CreateTaskCard onCreated={() => {}} compact />}
      </div>

      {isTeacher ? <TeacherView /> : <StudentView />}
    </div>
  );
}

// ─── TEACHER VIEW ────────────────────────────────────────────────

function TeacherView() {
  const tasks = useQuery(api.homeworkTasks.getTeacherTasks);
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  if (selectedTask) {
    return (
      <TaskDetailView task={selectedTask} onBack={() => setSelectedTask(null)} />
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-white/[0.03] border border-white/[0.08]">
        <TabsTrigger value="tasks" className="gap-2"><BookOpen className="h-4 w-4" /> My Homework</TabsTrigger>
        <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-4 w-4" /> Class Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="tasks" className="space-y-4">
        {showCreate ? (
          <CreateTaskCard onCreated={() => setShowCreate(false)} />
        ) : (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-300">Published & drafted homework</h2>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowCreate(true)}>
              <Plus className="h-4 w-4 mr-2" /> New Homework
            </Button>
          </div>
        )}

        {!showCreate && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {!tasks && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            {tasks?.length === 0 && (
              <Card className="md:col-span-2 xl:col-span-3 bg-white/[0.03] border-white/[0.08]">
                <CardContent className="py-16 text-center">
                  <GraduationCap className="h-14 w-14 mx-auto text-zinc-600 mb-4" />
                  <h3 className="text-lg font-semibold text-zinc-300">No homework yet</h3>
                  <p className="text-sm text-zinc-500 mt-1">Create your first homework to deliver to your class</p>
                  <Button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => setShowCreate(true)}>
                    <Plus className="h-4 w-4 mr-2" /> New Homework
                  </Button>
                </CardContent>
              </Card>
            )}
            {tasks?.map((t: any) => <TaskCard key={t._id} task={t} onClick={() => setSelectedTask(t)} />)}
          </div>
        )}
      </TabsContent>

      <TabsContent value="analytics">
        <ClassAnalytics />
      </TabsContent>
    </Tabs>
  );
}

function SkeletonCard() {
  return (
    <Card className="bg-white/[0.03] border-white/[0.08] animate-pulse">
      <CardContent className="p-6 space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="h-3 bg-white/5 rounded w-2/3" />
      </CardContent>
    </Card>
  );
}

function TaskCard({ task, onClick }: { task: any; onClick: () => void }) {
  const isPublished = task.status === "published";
  const isClosed = task.status === "closed";
  const pct = task.studentCount > 0 ? Math.round((task.submissionCount / task.studentCount) * 100) : 0;

  return (
    <button onClick={onClick} className="text-left group">
      <Card className="bg-white/[0.03] border-white/[0.08] hover:border-orange-500/40 transition-colors h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2">
            <Badge className={cn(
              "border",
              isClosed ? "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
              : isPublished ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-400 border-amber-500/30"
            )}>
              {isClosed ? "Closed" : isPublished ? "Published" : "Draft"}
            </Badge>
            <span className="text-xs text-zinc-500">{task.subject?.name}</span>
          </div>
          <CardTitle className="text-base text-white group-hover:text-orange-400 transition-colors line-clamp-1">{task.title}</CardTitle>
          <CardDescription className="text-xs">{task.class?.name} · Due {formatDue(task.dueDate)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {task.submissionCount}/{task.studentCount || "?"}</span>
            <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" /> {task.avgScore || "–"}%</span>
            <span className="flex items-center gap-1"><ListChecks className="h-3.5 w-3.5" /> {task.questions?.length} Q</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-[11px] text-zinc-500">
            <span>{pct}% submitted</span>
            <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {task.gradedCount || 0} graded</span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

function formatDue(d: string): string {
  if (!d) return "No due date";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ─── CREATE TASK ─────────────────────────────────────────────────

function CreateTaskCard({ onCreated, compact }: { onCreated: () => void; compact?: boolean }) {
  const classes = useQuery(api.classes.getClasses, { academicYear: undefined });
  const subjects = useQuery(api.subjects.getSubjects);
  const createTask = useMutation(api.homeworkTasks.createTask);

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [allowResubmission, setAllowResubmission] = useState(false);
  const [questions, setQuestions] = useState<QuestionDraft[]>([{ ...EMPTY_Q }]);
  const [saving, setSaving] = useState(false);

  const updateQ = (idx: number, patch: Partial<QuestionDraft>) => {
    setQuestions((qs) => qs.map((q, i) => (i === idx ? { ...q, ...patch } : q)));
  };

  const addQuestion = () => setQuestions((qs) => [...qs, { ...EMPTY_Q }]);
  const removeQuestion = (idx: number) => setQuestions((qs) => qs.filter((_, i) => i !== idx));

  const totalPoints = useMemo(() => questions.reduce((a, q) => a + (q.points || 0), 0), [questions]);

  const buildQuestionsPayload = () => {
    return questions.map((q) => {
      const payload: any = {
        questionText: q.questionText.trim(),
        type: q.type,
        points: q.points || 1,
      };
      if (q.type === "MCQ") {
        const opts = q.options.filter((o) => o.trim());
        payload.options = opts;
        payload.correctAnswer = q.correctAnswer;
      } else if (q.type === "TRUE_FALSE") {
        payload.correctAnswer = q.correctAnswer;
      } else if (q.type === "FILL_BLANK") {
        payload.correctAnswer = q.correctAnswer;
      } else if (q.type === "MATCH_COLUMN") {
        payload.matchPairs = q.matchPairs.filter((p) => p.left.trim() && p.right.trim());
      } else {
        payload.memo = q.memo;
      }
      return payload;
    });
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) { toast.error("Give the homework a title"); return; }
    if (!classId) { toast.error("Select a class"); return; }
    if (!subjectId) { toast.error("Select a subject"); return; }
    const validQs = questions.filter((q) => q.questionText.trim());
    if (validQs.length === 0) { toast.error("Add at least one question"); return; }
    if (validQs.some((q) => q.type === "MCQ" && q.options.filter((o) => o.trim()).length < 2)) {
      toast.error("Each MCQ needs at least 2 options"); return;
    }

    setSaving(true);
    try {
      await createTask({
        title: title.trim(),
        instructions: instructions.trim() || undefined,
        subject: subjectId as any,
        class: classId as any,
        dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        status: publish ? "published" : "draft",
        allowResubmission,
        questions: buildQuestionsPayload(),
      });
      toast.success(publish ? "Homework published to the class!" : "Saved as draft");
      onCreated();
      // reset
      setTitle(""); setInstructions(""); setClassId(""); setSubjectId(""); setDueDate("");
      setQuestions([{ ...EMPTY_Q }]);
    } catch (e: any) {
      toast.error(e.message || "Failed to create homework");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="bg-white/[0.03] border-orange-500/20 shadow-xl shadow-orange-500/5">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-400" /> Create Homework
        </CardTitle>
        <CardDescription className="text-zinc-400">Set it up like a teacher would — questions, due date, then publish to your class</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basics */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="text-zinc-300">Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Fractions Worksheet — Chapter 4" className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
          </div>
          <div>
            <Label className="text-zinc-300">Class *</Label>
            <Select value={classId} onValueChange={setClassId}>
              <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white"><SelectValue placeholder="Select class..." /></SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white">
                {classes?.map((c: any) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-zinc-300">Subject *</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger className="bg-white/[0.03] border-white/[0.08] text-white"><SelectValue placeholder="Select subject..." /></SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/10 text-white">
                {subjects?.map((s: any) => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-zinc-300">Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="bg-white/[0.03] border-white/[0.08] text-white [color-scheme:dark]" />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input type="checkbox" checked={allowResubmission} onChange={(e) => setAllowResubmission(e.target.checked)} className="accent-orange-500 h-4 w-4" />
              Allow resubmission
            </label>
          </div>
        </div>

        <div>
          <Label className="text-zinc-300">Instructions to students</Label>
          <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} placeholder="e.g. Show all your working. Essays: write in your book and upload a photo." className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-300">Questions <span className="text-zinc-500 font-normal">({questions.length} · {totalPoints} pts)</span></h3>
            <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </div>

          {questions.map((q, idx) => (
            <QuestionBuilder key={idx} q={q} idx={idx} onChange={(patch) => updateQ(idx, patch)} onRemove={() => removeQuestion(idx)} />
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" disabled={saving} onClick={() => handleSave(true)}>
            <Send className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Publish to Class"}
          </Button>
          <Button variant="outline" className="border-white/15 text-zinc-300 hover:bg-white/5" disabled={saving} onClick={() => handleSave(false)}>
            Save as Draft
          </Button>
          {!compact && (
            <Button variant="ghost" className="text-zinc-500" onClick={onCreated}>Cancel</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionBuilder({ q, idx, onChange, onRemove }: {
  q: QuestionDraft; idx: number; onChange: (patch: Partial<QuestionDraft>) => void; onRemove: () => void;
}) {
  const typeInfo = QUESTION_TYPES.find((t) => t.value === q.type)!;

  return (
    <div className="border border-white/[0.08] rounded-xl p-4 space-y-3 bg-white/[0.02]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
          <Select value={q.type} onValueChange={(v) => onChange({ type: v as QuestionType, correctAnswer: "", options: v === "MCQ" ? ["", "", "", ""] : q.options })}>
            <SelectTrigger className="h-8 w-44 bg-white/[0.03] border-white/[0.08] text-white text-xs"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-zinc-950 border-white/10 text-white">
              {QUESTION_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-sm">{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge className={cn("border", TYPE_COLORS[q.type])}>{q.type}</Badge>
        </div>
        <button onClick={onRemove} className="text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="h-4 w-4" /></button>
      </div>

      <p className="text-[11px] text-zinc-500">{typeInfo.hint}</p>

      <Textarea value={q.questionText} onChange={(e) => onChange({ questionText: e.target.value })} rows={2} placeholder="Type the question..." className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />

      {q.type === "MCQ" && (
        <div className="grid gap-2 md:grid-cols-2">
          {q.options.map((opt, oi) => (
            <div key={oi} className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 w-5">{String.fromCharCode(65 + oi)}.</span>
              <Input value={opt} onChange={(e) => onChange({ options: q.options.map((o, i) => (i === oi ? e.target.value : o)) })} placeholder={`Option ${String.fromCharCode(65 + oi)}`} className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
            </div>
          ))}
          <div className="md:col-span-2">
            <Label className="text-xs text-zinc-400">Correct answer (letter or text)</Label>
            <Input value={q.correctAnswer} onChange={(e) => onChange({ correctAnswer: e.target.value })} placeholder="e.g. B or The mitochondria" className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
          </div>
        </div>
      )}

      {q.type === "TRUE_FALSE" && (
        <div className="flex gap-3">
          {["True", "False"].map((v) => (
            <button key={v} onClick={() => onChange({ correctAnswer: v })}
              className={cn("px-4 py-1.5 rounded-lg text-sm border transition-colors",
                q.correctAnswer === v ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/20")}>
              {v}
            </button>
          ))}
        </div>
      )}

      {q.type === "FILL_BLANK" && (
        <div>
          <Label className="text-xs text-zinc-400">Accepted answer(s) — separate alternatives with commas</Label>
          <Input value={q.correctAnswer} onChange={(e) => onChange({ correctAnswer: e.target.value })} placeholder="e.g. photosynthesis, photosynthesis process" className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
        </div>
      )}

      {q.type === "MATCH_COLUMN" && (
        <div className="space-y-2">
          {q.matchPairs.map((p, pi) => (
            <div key={pi} className="flex items-center gap-2">
              <Input value={p.left} onChange={(e) => onChange({ matchPairs: q.matchPairs.map((x, i) => (i === pi ? { ...x, left: e.target.value } : x)) })} placeholder="Left item" className="flex-1 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
              <span className="text-zinc-600">→</span>
              <Input value={p.right} onChange={(e) => onChange({ matchPairs: q.matchPairs.map((x, i) => (i === pi ? { ...x, right: e.target.value } : x)) })} placeholder="Right item" className="flex-1 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
              <button onClick={() => onChange({ matchPairs: q.matchPairs.filter((_, i) => i !== pi) })} className="text-zinc-600 hover:text-red-400"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="border-white/15 text-zinc-300" onClick={() => onChange({ matchPairs: [...q.matchPairs, { left: "", right: "" }] })}>
            <Plus className="h-3 w-3 mr-1" /> Add pair
          </Button>
        </div>
      )}

      {(q.type === "SHORT_ANSWER" || q.type === "ESSAY" || q.type === "CALCULATION" || q.type === "DIAGRAM_LABEL") && (
        <div>
          <Label className="text-xs text-zinc-400">Memo / model answer (used by AI to grade)</Label>
          <Textarea value={q.memo} onChange={(e) => onChange({ memo: e.target.value })} rows={2} placeholder="Key points the answer should contain..." className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
        </div>
      )}

      <div className="flex items-center justify-end gap-2">
        <Label className="text-xs text-zinc-500">Marks</Label>
        <Input type="number" min={1} max={50} value={q.points} onChange={(e) => onChange({ points: Math.max(1, parseInt(e.target.value) || 1) })} className="w-20 h-8 bg-white/[0.03] border-white/[0.08] text-white" />
      </div>
    </div>
  );
}

// ─── TASK DETAIL (teacher) ───────────────────────────────────────

function TaskDetailView({ task, onBack }: { task: any; onBack: () => void }) {
  const [tab, setTab] = useState("submissions");
  const detail = useQuery(api.homeworkTasks.getTask, { taskId: task._id });
  const subs = useQuery(api.homeworkTasks.getTaskSubmissions, { taskId: task._id });
  const setStatus = useMutation(api.homeworkTasks.setTaskStatus);

  const t = detail || task;
  const published = t.status === "published";
  const closed = t.status === "closed";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <Badge className={cn("border", closed ? "bg-zinc-500/15 text-zinc-400 border-zinc-500/30" : published ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : "bg-amber-500/15 text-amber-400 border-amber-500/30")}>
          {closed ? "Closed" : published ? "Published" : "Draft"}
        </Badge>
        <h2 className="text-xl font-bold text-white">{t.title}</h2>
        <div className="flex-1" />
        {!closed && (
          <Button variant="outline" size="sm" className="border-white/15 text-zinc-300" onClick={() => { void setStatus({ taskId: t._id, status: closed ? "published" : "closed" }); toast.success(closed ? "Reopened" : "Closed"); }}>
            {closed ? <RefreshCw className="h-4 w-4 mr-1" /> : <XCircle className="h-4 w-4 mr-1" />} {closed ? "Reopen" : "Close"}
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-white/[0.03] border-white/[0.08]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-300 flex items-center gap-2"><BookOpen className="h-4 w-4 text-orange-400" /> {t.questions?.length || 0} Questions · {t.totalPoints} pts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {t.questions?.map((q: any, i: number) => (
              <div key={i} className="border border-white/[0.08] rounded-lg p-3 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-zinc-500">{i + 1}.</span>
                  <Badge className={cn("border text-[10px]", TYPE_COLORS[q.type])}>{q.type}</Badge>
                  <span className="ml-auto text-xs text-zinc-500">{q.points} pts</span>
                </div>
                <p className="text-sm text-zinc-200">{q.questionText}</p>
                {q.options?.length > 0 && (
                  <p className="text-xs text-zinc-500 mt-1">{q.options.map((o: string, oi: number) => `${String.fromCharCode(65 + oi)}) ${o}`).join("  ")}</p>
                )}
                {(q.memo || q.correctAnswer) && (
                  <p className="text-[11px] text-orange-300/70 mt-1">Memo: {q.memo || q.correctAnswer}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-white/[0.03] border-white/[0.08]">
            <CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-300">Stats</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <StatRow label="Class" value={t.class?.name || "—"} />
              <StatRow label="Subject" value={t.subject?.name || "—"} />
              <StatRow label="Due" value={formatDue(t.dueDate)} />
              <StatRow label="Submitted" value={`${subs?.length || 0} students`} />
              <StatRow label="Max marks" value={`${t.totalPoints || 0} pts`} />
            </CardContent>
          </Card>
          {t.instructions && (
            <Card className="bg-white/[0.03] border-white/[0.08]">
              <CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-300">Instructions</CardTitle></CardHeader>
              <CardContent><p className="text-sm text-zinc-400 whitespace-pre-wrap">{t.instructions}</p></CardContent>
            </Card>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="bg-white/[0.03] border border-white/[0.08]">
          <TabsTrigger value="submissions" className="gap-2"><Users className="h-4 w-4" /> Submissions {subs ? `(${subs.length})` : ""}</TabsTrigger>
          <TabsTrigger value="questions" className="gap-2"><ListChecks className="h-4 w-4" /> Questions</TabsTrigger>
        </TabsList>
        <TabsContent value="submissions" className="mt-4 space-y-3">
          {!subs && <SkeletonCard />}
          {subs?.length === 0 && (
            <Card className="bg-white/[0.03] border-white/[0.08]"><CardContent className="py-12 text-center text-zinc-500">No submissions yet. Students will appear here as they hand in homework.</CardContent></Card>
          )}
          {subs?.map((s: any) => <SubmissionRow key={s._id} sub={s} task={t} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-zinc-500 text-xs">{label}</span>
      <span className="text-zinc-200 font-medium">{value}</span>
    </div>
  );
}

function SubmissionRow({ sub, task }: { sub: any; task: any }) {
  const [open, setOpen] = useState(false);
  const [overrideGrades, setOverrideGrades] = useState<any>(null);
  const [feedback, setFeedback] = useState("");
  const teacherGrade = useMutation(api.homeworkTasks.teacherGrade);
  const gradeWithAI = useAction(api.homeworkTasks.gradeSubmissionWithAI);
  const [aiBusy, setAiBusy] = useState(false);

  const gradedCount = sub.grades?.filter((g: any) => typeof g.earned === "number").length || 0;
  const totalQs = task.questions?.length || 0;
  const pct = task.totalPoints > 0 ? Math.round(((sub.score || 0) / task.totalPoints) * 100) : 0;

  const runAIGrade = async () => {
    setAiBusy(true);
    try {
      await gradeWithAI({ submissionId: sub._id });
      toast.success("AI grading complete");
    } catch (e: any) {
      toast.error(e.message || "AI grading failed");
    } finally {
      setAiBusy(false);
    }
  };

  const startOverride = () => {
    setOverrideGrades((sub.grades || []).map((g: any) => ({ questionIndex: g.questionIndex, earned: g.earned ?? 0, feedback: g.feedback || "" })));
    setFeedback(sub.teacherFeedback || "");
    setOpen(true);
  };

  const saveOverride = async () => {
    try {
      await teacherGrade({
        submissionId: sub._id,
        grades: overrideGrades,
        teacherFeedback: feedback || undefined,
        status: "returned",
      });
      toast.success("Grades saved & returned to student");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Card className="bg-white/[0.03] border-white/[0.08]">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 font-bold text-sm flex items-center justify-center">
            {(sub.student?.name || "S").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{sub.student?.name || "Unknown student"}</p>
            <p className="text-xs text-zinc-500">
              {sub.status === "graded" || sub.status === "returned"
                ? `Graded · ${sub.score ?? 0}/${task.totalPoints} (${pct}%)`
                : `Submitted ${new Date(sub.submittedAt).toLocaleString()}`}
              {sub.teacherFeedback && <span className="text-orange-400"> · Teacher feedback</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {gradedCount < totalQs && (
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={runAIGrade} disabled={aiBusy}>
                <Sparkles className="h-3.5 w-3.5 mr-1" /> {aiBusy ? "Grading…" : "AI Grade"}
              </Button>
            )}
            <Button size="sm" variant="outline" className="border-white/15 text-zinc-300" onClick={startOverride}>
              <PenLine className="h-3.5 w-3.5 mr-1" /> Review
            </Button>
          </div>
        </div>

        {open && (
          <div className="mt-4 space-y-4 border-t border-white/[0.08] pt-4">
            {task.questions?.map((q: any, qi: number) => {
              const ans = sub.answers?.find((a: any) => a.questionIndex === qi);
              const grade = overrideGrades?.find((g: any) => g.questionIndex === qi);
              return (
                <div key={qi} className="border border-white/[0.08] rounded-lg p-3 bg-white/[0.02]">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-zinc-300 font-medium">{qi + 1}. {q.questionText}</p>
                    <Input type="number" min={0} max={q.points} value={grade?.earned ?? 0}
                      onChange={(e) => setOverrideGrades((gs: any[]) => gs.map((g) => g.questionIndex === qi ? { ...g, earned: Math.max(0, Math.min(q.points, parseInt(e.target.value) || 0)) } : g))}
                      className="w-20 h-8 bg-white/[0.03] border-white/[0.08] text-white text-xs" />
                  </div>
                  {ans?.answer && <p className="text-sm text-zinc-400 mt-1 whitespace-pre-wrap">“{ans.answer}”</p>}
                  {ans?.imageUrl && <img src={ans.imageUrl} alt="Student work" className="max-h-40 rounded-lg border border-white/10 mt-2" />}
                  {grade?.feedback && <p className="text-[11px] text-zinc-500 mt-1">{grade.feedback}</p>}
                </div>
              );
            })}
            <div>
              <Label className="text-xs text-zinc-400">Feedback to student</Label>
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={2} placeholder="Encouraging, specific feedback…" className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
            </div>
            <div className="flex gap-2">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={saveOverride}>Save & Return</Button>
              <Button variant="ghost" className="text-zinc-500" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── CLASS ANALYTICS ─────────────────────────────────────────────

function ClassAnalytics() {
  const tasks = useQuery(api.homeworkTasks.getTeacherTasks);

  const completed = tasks?.filter((t: any) => t.status === "published" || t.status === "closed") || [];
  const totalSubs = completed.reduce((a: number, t: any) => a + (t.submissionCount || 0), 0);
  const totalStudents = completed.reduce((a: number, t: any) => a + (t.studentCount || 0), 0);
  const graded = completed.reduce((a: number, t: any) => a + (t.gradedCount || 0), 0);
  const avgAll = completed.filter((t: any) => t.avgScore).length
    ? Math.round(completed.filter((t: any) => t.avgScore).reduce((a: number, t: any) => a + t.avgScore, 0) / completed.filter((t: any) => t.avgScore).length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard icon={BookOpen} label="Homework set" value={String(completed.length)} sub="published tasks" />
        <InsightCard icon={Users} label="Submissions" value={`${totalSubs}/${totalStudents || "–"}`} sub="across all tasks" />
        <InsightCard icon={CheckCircle} label="AI graded" value={String(graded)} sub="with AI assistance" />
        <InsightCard icon={Trophy} label="Class average" value={`${avgAll}%`} sub="across graded tasks" />
      </div>

      {completed.length === 0 ? (
        <Card className="bg-white/[0.03] border-white/[0.08]"><CardContent className="py-16 text-center text-zinc-500">
          Publish homework first — class insights will appear here.
        </CardContent></Card>
      ) : (
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader><CardTitle className="text-sm text-zinc-300">Task performance</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {completed.map((t: any) => {
              const pct = t.studentCount > 0 ? Math.round((t.submissionCount / t.studentCount) * 100) : 0;
              return (
                <div key={t._id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{t.title}</span>
                    <span className="text-zinc-500">{t.submissionCount}/{t.studentCount} · avg {t.avgScore || "–"}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden flex">
                    <div className="h-full bg-orange-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InsightCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub: string }) {
  return (
    <Card className="bg-white/[0.03] border-white/[0.08]">
      <CardContent className="p-5">
        <div className="w-9 h-9 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mb-3">
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-400 mt-1">{label}</p>
        <p className="text-[11px] text-zinc-600">{sub}</p>
      </CardContent>
    </Card>
  );
}

// ─── STUDENT VIEW ────────────────────────────────────────────────

function StudentView() {
  const tasks = useQuery(api.homeworkTasks.getMyTasks);
  const [selected, setSelected] = useState<any>(null);

  if (selected) {
    return <StudentTaskDetail task={selected} onBack={() => setSelected(null)} />;
  }

  const pending = tasks?.filter((t: any) => t.status === "published" && (!t.mySubmission || t.mySubmission.status === "returned")) || [];
  const done = tasks?.filter((t: any) => t.mySubmission && t.mySubmission.status !== "returned") || [];

  return (
    <Tabs defaultValue="pending" className="space-y-6">
      <TabsList className="bg-white/[0.03] border border-white/[0.08]">
        <TabsTrigger value="pending" className="gap-2"><Clock className="h-4 w-4" /> To Do {pending.length > 0 && <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-orange-500 text-white rounded-full">{pending.length}</span>}</TabsTrigger>
        <TabsTrigger value="done" className="gap-2"><CheckCircle className="h-4 w-4" /> Submitted ({done.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4">
        {!tasks && Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)}
        {tasks && pending.length === 0 && (
          <Card className="bg-white/[0.03] border-white/[0.08]"><CardContent className="py-16 text-center">
            <Trophy className="h-14 w-14 mx-auto text-orange-500/40 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300">All caught up!</h3>
            <p className="text-sm text-zinc-500 mt-1">No pending homework. Enjoy the break 🎉</p>
          </CardContent></Card>
        )}
        {pending.map((t: any) => <StudentTaskCard key={t._id} task={t} onClick={() => setSelected(t)} />)}
      </TabsContent>

      <TabsContent value="done" className="space-y-4">
        {done.length === 0 && (
          <Card className="bg-white/[0.03] border-white/[0.08]"><CardContent className="py-16 text-center text-zinc-500">
            Nothing submitted yet.
          </CardContent></Card>
        )}
        {done.map((t: any) => {
          const pct = t.totalPoints > 0 ? Math.round(((t.mySubmission?.score || 0) / t.totalPoints) * 100) : 0;
          return (
            <button key={t._id} className="w-full text-left" onClick={() => setSelected(t)}>
              <Card className="bg-white/[0.03] border-white/[0.08] hover:border-orange-500/40 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border",
                    pct >= 70 ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                    : pct >= 50 ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                    : "bg-red-500/15 border-red-500/30 text-red-400")}>
                    {pct}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{t.title}</p>
                    <p className="text-xs text-zinc-500">{t.subject?.name} · {t.mySubmission?.score ?? 0}/{t.totalPoints} marks</p>
                  </div>
                  <span className="text-xs text-zinc-600">{t.mySubmission?.status === "returned" ? "Returned" : "Graded"}</span>
                </CardContent>
              </Card>
            </button>
          );
        })}
      </TabsContent>
    </Tabs>
  );
}

function StudentTaskCard({ task, onClick }: { task: any; onClick: () => void }) {
  const isLate = task.dueDate && new Date(task.dueDate) < new Date();
  return (
    <button className="w-full text-left" onClick={onClick}>
      <Card className="bg-white/[0.03] border-white/[0.08] hover:border-orange-500/40 transition-colors">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{task.title}</p>
            <p className="text-xs text-zinc-500">{task.subject?.name} · {task.questions?.length} questions · {task.totalPoints} pts</p>
          </div>
          <div className="text-right">
            <p className={cn("text-xs font-medium", isLate ? "text-red-400" : "text-zinc-400")}>Due {formatDue(task.dueDate)}</p>
            <p className="text-[11px] text-zinc-600 mt-0.5">{isLate ? "Overdue" : "Open to answer"}</p>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

// ─── STUDENT ANSWER PAGE ─────────────────────────────────────────

function StudentTaskDetail({ task, onBack }: { task: any; onBack: () => void }) {
  const detail = useQuery(api.homeworkTasks.getTask, { taskId: task._id });
  const submitTask = useMutation(api.homeworkTasks.submitTask);
  const [answers, setAnswers] = useState<Record<number, { answer?: string; imageUrl?: string }>>({});
  const [submitting, setSubmitting] = useState(false);
  const [photoBusy, setPhotoBusy] = useState<Record<number, boolean>>({});

  const t = detail || task;
  const alreadySubmitted = !!t.mySubmission && t.mySubmission.status !== "returned";

  const uploadPhoto = async (idx: number, file: File) => {
    setPhotoBusy((p) => ({ ...p, [idx]: true }));
    try {
      const { fileUrl } = await uploadFileToR2(file);
      setAnswers((a) => ({ ...a, [idx]: { ...a[idx], imageUrl: fileUrl } }));
      toast.success("Photo uploaded");
    } catch (e: any) {
      toast.error(e.message || "Photo upload failed");
    } finally {
      setPhotoBusy((p) => ({ ...p, [idx]: false }));
    }
  };

  const handleSubmit = async () => {
    const payload = (t.questions || []).map((_: any, i: number) => ({
      questionIndex: i,
      answer: answers[i]?.answer?.trim() || undefined,
      imageUrl: answers[i]?.imageUrl,
    }));
    const empty = payload.filter((p: any) => !p.answer && !p.imageUrl).length;
    if (empty > 0) {
      if (!confirm(`${empty} question(s) unanswered. Submit anyway?`)) return;
    }
    setSubmitting(true);
    try {
      await submitTask({ taskId: t._id, answers: payload });
      toast.success("Homework submitted! Objective questions are marked instantly.");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (alreadySubmitted) {
    return <SubmittedResult task={t} onBack={onBack} />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold text-white">{t.title}</h2>
      </div>

      <Card className="bg-white/[0.03] border-orange-500/20">
        <CardContent className="p-5 flex flex-wrap items-center gap-4 text-sm">
          <span className="text-zinc-400"><Users className="h-4 w-4 inline mr-1" /> {t.subject?.name}</span>
          <span className="text-zinc-400"><Clock className="h-4 w-4 inline mr-1" /> Due {formatDue(t.dueDate)}</span>
          <span className="text-zinc-400"><ListChecks className="h-4 w-4 inline mr-1" /> {t.questions?.length} questions · {t.totalPoints} pts</span>
        </CardContent>
      </Card>

      {t.instructions && (
        <Card className="bg-white/[0.03] border-white/[0.08]">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-zinc-300 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-orange-400" /> Instructions</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-zinc-400 whitespace-pre-wrap">{t.instructions}</p></CardContent>
        </Card>
      )}

      <div className="space-y-5">
        {t.questions?.map((q: any, i: number) => (
          <StudentQuestion key={i} q={q} idx={i}
            value={answers[i]}
            onChange={(v) => setAnswers((a) => ({ ...a, [i]: { ...a[i], ...v } }))}
            onUpload={(f) => uploadPhoto(i, f)}
            photoBusy={!!photoBusy[i]} />
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <p className="text-xs text-zinc-500 self-center">Objective questions marked instantly · essays & short answers by AI</p>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8" onClick={handleSubmit} disabled={submitting}>
          <Send className="h-4 w-4 mr-2" /> {submitting ? "Submitting…" : "Submit Homework"}
        </Button>
      </div>
    </div>
  );
}

function StudentQuestion({ q, idx, value, onChange, onUpload, photoBusy }: {
  q: any; idx: number; value?: { answer?: string; imageUrl?: string };
  onChange: (v: { answer?: string; imageUrl?: string }) => void;
  onUpload: (f: File) => void; photoBusy: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Card className="bg-white/[0.03] border-white/[0.08]">
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-white font-medium">{q.questionText}</p>
              <Badge className={cn("border text-[10px]", TYPE_COLORS[q.type])}>{q.type}</Badge>
              <span className="text-[11px] text-zinc-600 ml-auto">{q.points} pts</span>
            </div>
          </div>
        </div>

        {q.type === "MCQ" && (
          <div className="grid gap-2 md:grid-cols-2 pl-10">
            {q.options?.map((opt: string, oi: number) => (
              <button key={oi} onClick={() => onChange({ answer: opt })}
                className={cn("flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors",
                  value?.answer === opt ? "bg-orange-500/15 border-orange-500/40 text-orange-300" : "bg-white/[0.02] border-white/[0.08] text-zinc-300 hover:border-white/20")}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0">{String.fromCharCode(65 + oi)}</span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === "TRUE_FALSE" && (
          <div className="flex gap-3 pl-10">
            {["True", "False"].map((v) => (
              <button key={v} onClick={() => onChange({ answer: v })}
                className={cn("px-5 py-2 rounded-lg border text-sm transition-colors",
                  value?.answer === v ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "bg-white/[0.02] border-white/[0.08] text-zinc-300 hover:border-white/20")}>
                {v}
              </button>
            ))}
          </div>
        )}

        {q.type === "FILL_BLANK" && (
          <div className="pl-10">
            <Input value={value?.answer || ""} onChange={(e) => onChange({ answer: e.target.value })} placeholder="Type your answer…" className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
          </div>
        )}

        {q.type === "MATCH_COLUMN" && (
          <div className="pl-10 space-y-2">
            {q.matchPairs?.map((p: any, pi: number) => {
              const current = (() => { try { return JSON.parse(value?.answer || "{}"); } catch { return {}; } })();
              return (
                <div key={pi} className="flex items-center gap-3">
                  <span className="text-sm text-zinc-200 w-40 truncate">{p.left}</span>
                  <span className="text-zinc-600">→</span>
                  <Select value={current[p.left] || ""} onValueChange={(v) => onChange({ answer: JSON.stringify({ ...current, [p.left]: v }) })}>
                    <SelectTrigger className="flex-1 bg-white/[0.03] border-white/[0.08] text-white"><SelectValue placeholder="Match…" /></SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                      {q.matchPairs?.map((rp: any, ri: number) => (
                        <SelectItem key={ri} value={rp.right}>{rp.right}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        )}

        {(q.type === "SHORT_ANSWER" || q.type === "CALCULATION") && (
          <div className="pl-10">
            <Textarea value={value?.answer || ""} onChange={(e) => onChange({ answer: e.target.value })} rows={3} placeholder="Type your answer…" className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
          </div>
        )}

        {q.type === "ESSAY" && (
          <div className="pl-10 space-y-3">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Camera className="h-3.5 w-3.5" /> Write your essay in your exercise book, then snap a photo of the page.
            </div>
            {value?.imageUrl ? (
              <div className="relative inline-block">
                <img src={value.imageUrl} alt="Your essay" className="max-h-64 rounded-lg border border-white/15" />
                <button onClick={() => onChange({ imageUrl: undefined })} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <button onClick={() => inputRef.current?.click()} disabled={photoBusy}
                className="w-full border-2 border-dashed border-white/15 rounded-xl p-8 flex flex-col items-center gap-2 hover:border-orange-500/50 transition-colors disabled:opacity-50">
                <Camera className="h-8 w-8 text-zinc-500" />
                <span className="text-sm text-zinc-400">{photoBusy ? "Uploading…" : "Take a photo of your book page"}</span>
              </button>
            )}
            <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); e.target.value = ""; }} />            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-600">…or type it here</span>
              <Textarea value={value?.answer || ""} onChange={(e) => onChange({ answer: e.target.value })} rows={3} placeholder="Optional: type your essay instead" className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
            </div>
          </div>
        )}

        {q.type === "DIAGRAM_LABEL" && (
          <div className="pl-10">
            <Textarea value={value?.answer || ""} onChange={(e) => onChange({ answer: e.target.value })} rows={3} placeholder="Label the parts (e.g. 1 = nucleus, 2 = membrane)…" className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-600" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── SUBMITTED RESULT (student) ──────────────────────────────────

function SubmittedResult({ task, onBack }: { task: any; onBack: () => void }) {
  const sub = task.mySubmission;
  const pct = task.totalPoints > 0 ? Math.round(((sub?.score || 0) / task.totalPoints) * 100) : 0;
  const hasAI = !!sub?.aiFeedback;
  const autoCount = sub?.grades?.filter((g: any) => g.gradedBy === "auto" && typeof g.earned === "number").length || 0;
  const aiPending = (task.questions?.length || 0) - (sub?.grades?.filter((g: any) => typeof g.earned === "number").length || 0) > 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h2 className="text-xl font-bold text-white">{task.title}</h2>
      </div>

      <Card className="bg-white/[0.03] border-white/[0.08]">
        <CardContent className="p-8 text-center">
          <div className={cn("w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center text-3xl font-bold mb-4",
            pct >= 70 ? "border-emerald-500/50 text-emerald-400"
            : pct >= 50 ? "border-amber-500/50 text-amber-400"
            : "border-red-500/50 text-red-400")}>
            {pct}%
          </div>
          <h3 className="text-lg font-semibold text-white">{sub?.score ?? 0} / {task.totalPoints} marks</h3>
          <p className="text-sm text-zinc-500 mt-1">
            {hasAI ? "Graded by AI — your teacher may still review it" : aiPending ? `Auto-graded ${autoCount} question(s). AI is marking the rest…` : "Submitted"}
          </p>
          {sub?.teacherFeedback && (
            <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 text-left">
              <p className="text-xs font-semibold text-orange-400 mb-1">Teacher's feedback:</p>
              <p className="text-sm text-zinc-200 whitespace-pre-wrap">{sub.teacherFeedback}</p>
            </div>
          )}
          {hasAI && (
            <div className="mt-4 bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 text-left">
              <p className="text-xs font-semibold text-zinc-400 mb-1">AI feedback:</p>
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">{sub.aiFeedback}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {task.questions?.map((q: any, i: number) => {
          const ans = sub?.answers?.find((a: any) => a.questionIndex === i);
          const grade = sub?.grades?.find((g: any) => g.questionIndex === i);
          const correct = typeof grade?.earned === "number" && grade.earned === q.points;
          const partial = typeof grade?.earned === "number" && grade.earned > 0 && grade.earned < q.points;
          return (
            <Card key={i} className="bg-white/[0.03] border-white/[0.08]">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">{i + 1}.</span>
                  <p className="text-sm text-zinc-200 flex-1">{q.questionText}</p>
                  {typeof grade?.earned === "number" && (
                    <Badge className={cn("border", correct ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" : partial ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : "bg-red-500/15 text-red-400 border-red-500/30")}>
                      {grade.earned}/{q.points}
                    </Badge>
                  )}
                </div>
                {ans?.answer && <p className="text-sm text-zinc-400 pl-5">“{ans.answer}”</p>}
                {ans?.imageUrl && <img src={ans.imageUrl} alt="Your work" className="max-h-40 rounded-lg border border-white/10 ml-5" />}
                {grade?.feedback && <p className="text-xs text-zinc-500 pl-5">{grade.feedback}</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
