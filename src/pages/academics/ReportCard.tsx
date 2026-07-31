import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Printer, FileText, Sparkles, TrendingUp, BarChart3, CalendarCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SYMBOL_COLOR: Record<string, string> = {
  A: "bg-green-500/15 text-green-500 border-green-500/30",
  B: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  C: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  D: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  E: "bg-orange-500/15 text-orange-500 border-orange-500/30",
  F: "bg-red-500/15 text-red-500 border-red-500/30",
  G: "bg-red-600/20 text-red-600 border-red-600/40",
};

export default function ReportCardGenerator() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher" || user?.role === "admin";
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  // Real data — fetch actual students
  const students = useQuery(api.users.getUsers, isTeacher ? { role: "student" } : "skip");

  // REAL marks: computed from actual submissions
  const report = useQuery(
    api.reports.getStudentReportData,
    selectedStudent ? { studentId: selectedStudent as any } : "skip"
  );

  const classAverages = useQuery(
    api.reports.getClassAverages,
    (() => {
      const student = students?.find((s: any) => s._id === selectedStudent);
      const classId = student?.studentClass;
      return typeof classId === "string" && classId.length > 0 ? { classId: classId as any } : "skip";
    })()
  );

  const handlePrint = () => {
    window.print();
  };

  if (!isTeacher) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg font-medium">Access Denied: You do not have permission to view this page.</p>
      </div>
    );
  }

  if (students === undefined || (selectedStudent && report === undefined)) {
    return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const className = report?.student.class || "Grade —";

  const classAvgFor = (subjectId: string) =>
    classAverages?.find((c: any) => c.subjectId === subjectId)?.average ?? null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Report Card Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Official term report built from real assessment marks — no estimates.
          </p>
        </div>
      </div>

      <Card className="print:hidden">
        <CardContent className="p-6 flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="text-sm font-medium mb-1 block">Select Student</label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Search or select a student..." />
              </SelectTrigger>
              <SelectContent>
                {students.map((s: any) => (
                  <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStudent && !report && (
              <p className="text-xs text-amber-500 mt-2 flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5" />
                This student has no graded assessments yet. Marks appear once exams/assignments are submitted and graded.
              </p>
            )}
          </div>
          <Button onClick={handlePrint} disabled={!report} className="w-full sm:w-auto">
            <Printer className="h-4 w-4 mr-2" /> Print / PDF
          </Button>
        </CardContent>
      </Card>

      {report && (
        <Card className="border-2 border-primary/20 shadow-xl print:shadow-none print:border-none print:m-0 print:p-0">
          <CardHeader className="border-b bg-muted/30 pb-6 print:bg-transparent">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-lg">
                  {report.student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Glenanda Shopping Learning Center</h2>
                  <p className="text-muted-foreground">Official Academic Report • {new Date().getFullYear()}</p>
                </div>
              </div>
              <div className="text-right print:hidden">
                <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                  <Printer className="h-4 w-4" /> Print / PDF
                </Button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 bg-background p-4 rounded-xl border">
              <div>
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-semibold text-lg">{report.student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade / Class</p>
                <p className="font-semibold text-lg">{className}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-semibold">{report.student.id.slice(-6).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assessments Graded</p>
                <p className="font-semibold">
                  {report.summary.examCount} exams • {report.summary.assignmentCount} assignments
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-4 font-semibold">Subject</th>
                  <th className="p-4 font-semibold">Term Mark</th>
                  <th className="p-4 font-semibold">Class Avg</th>
                  <th className="p-4 font-semibold">Symbol</th>
                  <th className="p-4 font-semibold">Achievement</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {report.subjects.map((row: any) => {
                  const classAvg = classAvgFor(row.subjectId);
                  return (
                    <tr key={row.subjectId} className="hover:bg-muted/20">
                      <td className="p-4 font-medium">
                        {row.subjectName}
                        <span className="block text-[11px] text-muted-foreground">
                          {row.examCount} exam{row.examCount !== 1 ? "s" : ""}
                          {row.assignmentCount > 0 && ` • ${row.assignmentCount} assignment${row.assignmentCount !== 1 ? "s" : ""}`}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-lg">{row.termMark}%</td>
                      <td className="p-4 text-muted-foreground">
                        {classAvg !== null ? (
                          <span className={row.termMark >= classAvg ? "text-green-500" : "text-red-400"}>
                            {classAvg}% {row.termMark >= classAvg ? "▲" : "▼"}
                          </span>
                        ) : "—"}
                      </td>
                      <td className="p-4">
                        <Badge className={SYMBOL_COLOR[row.symbol] || ""} variant="outline">
                          {row.symbol}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground text-xs">{row.achievement}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Summary strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 border-t bg-muted/20">
              <div className="rounded-xl bg-background border p-4 text-center">
                <p className="text-2xl font-extrabold text-primary">
                  {report.summary.average !== null ? `${report.summary.average}%` : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Term Average</p>
              </div>
              <div className="rounded-xl bg-background border p-4 text-center">
                <p className="text-2xl font-extrabold">
                  {report.summary.overallSymbol || "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Overall Symbol</p>
              </div>
              <div className="rounded-xl bg-background border p-4 text-center">
                <p className="text-2xl font-extrabold text-emerald-500">
                  {report.summary.attendancePct !== null ? `${report.summary.attendancePct}%` : "—"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <CalendarCheck className="h-3 w-3" /> Attendance
                </p>
              </div>
              <div className="rounded-xl bg-background border p-4 text-center">
                <p className="text-2xl font-extrabold text-amber-500">{report.summary.subjectsCount}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Subjects
                </p>
              </div>
            </div>

            <div className="p-6 border-t bg-primary/5">
              <h3 className="font-semibold flex items-center gap-2 mb-3 text-primary">
                <Sparkles className="h-5 w-5" /> Performance Summary
              </h3>
              {report.subjects.length === 0 ? (
                <p className="text-sm leading-relaxed text-foreground/90">
                  No graded assessments on record yet. Term marks will appear here automatically once
                  exams and assignments have been marked.
                </p>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {report.student.name.split(" ")[0]} achieved a term average of{" "}
                    <strong>{report.summary.average}%</strong> ({report.summary.overallSymbol}) across{" "}
                    {report.summary.subjectsCount} subjects, based on {report.summary.examCount} exam
                    submission{report.summary.examCount !== 1 ? "s" : ""} and{" "}
                    {report.summary.assignmentCount} graded assignment
                    {report.summary.assignmentCount !== 1 ? "s" : ""}.
                  </p>
                  {report.subjects.length > 0 && (
                    <p className="text-sm leading-relaxed text-foreground/90 mt-2">
                      <strong className="text-green-500">Strongest:</strong> {report.subjects[0].subjectName} ({report.subjects[0].termMark}%)
                      {report.subjects.length > 1 && (
                        <>
                          {" "}• <strong className="text-red-400">Needs focus:</strong>{" "}
                          {report.subjects[report.subjects.length - 1].subjectName} ({report.subjects[report.subjects.length - 1].termMark}%)
                        </>
                      )}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className="p-6 border-t flex justify-between items-end mt-8">
              <div className="text-center">
                <div className="w-48 border-b-2 border-foreground/20 mb-2 h-10"></div>
                <p className="text-sm font-medium">Principal Signature</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Generated on</p>
                <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on real assessment marks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedStudent && report && (
        <Card className="print:hidden">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Assessment Breakdown
            </h3>
            {report.examEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No graded exam submissions yet.</p>
            ) : (
              <div className="space-y-2">
                {report.examEntries.map((e: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm rounded-lg bg-muted/30 px-3 py-2">
                    <span className="font-medium">{e.subjectName} — {e.examTitle}</span>
                    <span className="font-bold">
                      {e.score}/{e.total} ({e.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
