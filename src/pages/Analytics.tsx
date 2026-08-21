import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users, TrendingUp, HeartPulse, Activity,
  Calendar, CheckCircle2, Star, Clock, ShieldCheck,
  Video, MapPin, Sparkles, ArrowUpRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area, ComposedChart
} from "recharts";

const serviceData = [
  { name: "Individual Counselling", value: 38, color: "#10b981" },
  { name: "Couples & Relationships", value: 22, color: "#f59e0b" },
  { name: "Life Coaching & Self-Mastery", value: 16, color: "#06b6d4" },
  { name: "Trauma Recovery & EMDR", value: 12, color: "#8b5cf6" },
  { name: "Youth & Young Adult", value: 7, color: "#ec4899" },
  { name: "Substance Use Support", value: 5, color: "#f43f5e" },
];

const monthlyTrends = [
  { month: "Jan", sessions: 112, caseload: 56, outcome: 76 },
  { month: "Feb", sessions: 128, caseload: 62, outcome: 78 },
  { month: "Mar", sessions: 140, caseload: 68, outcome: 80 },
  { month: "Apr", sessions: 135, caseload: 71, outcome: 82 },
  { month: "May", sessions: 152, caseload: 76, outcome: 84 },
  { month: "Jun", sessions: 158, caseload: 79, outcome: 85 },
  { month: "Jul", sessions: 164, caseload: 82, outcome: 86 },
  { month: "Aug", sessions: 167, caseload: 84, outcome: 87 },
];

const symptomTrajectory = [
  { week: "Intake (W1)", phq9: 18.5, gad7: 17.8, wellbeing: 32 },
  { week: "Week 2", phq9: 16.2, gad7: 15.4, wellbeing: 41 },
  { week: "Week 4", phq9: 12.8, gad7: 11.6, wellbeing: 58 },
  { week: "Week 6", phq9: 9.4, gad7: 8.2, wellbeing: 72 },
  { week: "Week 8", phq9: 6.1, gad7: 5.0, wellbeing: 86 },
];

const referralSources = [
  { source: "Online Search & Website", value: 40, color: "#10b981" },
  { source: "Word of Mouth & Family", value: 28, color: "#06b6d4" },
  { source: "Medical Practitioner / GP", value: 20, color: "#f59e0b" },
  { source: "Social Media (@insightworks)", value: 12, color: "#8b5cf6" },
];

function StatCard({ title, value, icon: Icon, sub, trend, color }: {
  title: string; value: string | number; icon: any; sub?: string; trend?: "up" | "down"; color?: string;
}) {
  return (
    <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{title}</CardTitle>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 shrink-0">
          <Icon className="h-4 w-4" style={{ color: color || "#10b981" }} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">{value}</div>
        {sub && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1">
            {trend === "up" && <span className="text-emerald-600 dark:text-emerald-400 font-semibold">↑</span>}
            {sub}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 mb-2">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Clinical Telemetry & Outcomes
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Practice Analytics & Clinical Outcomes
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time caseload metrics, therapeutic progression curves, and session modality analytics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Clinical Telemetry</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Active Caseload" value="84" icon={Users} sub="+12% active clients this quarter" trend="up" color="#10b981" />
        <StatCard title="Monthly Sessions" value="167" icon={Calendar} sub="+8% vs last month" trend="up" color="#f59e0b" />
        <StatCard title="Outcome Improvement" value="87%" icon={Activity} sub="PHQ-9 & GAD-7 drop rate" trend="up" color="#06b6d4" />
        <StatCard title="Satisfaction Rating" value="4.9 / 5" icon={Star} sub="98% positive reviews" trend="up" color="#8b5cf6" />
      </div>

      {/* Primary Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Session Volume & Caseload (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Monthly Session Volume & Caseload Growth
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                Completed consultation hours and active client caseload (Jan – Aug)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200/60 dark:stroke-zinc-800/80" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#888888" }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#888888" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#888888" }} domain={[50, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", color: "#f4f4f5", fontSize: "12px" }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sessions" name="Sessions Completed" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="outcome" name="Outcome % Score" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 7 Core Disciplines Breakdown (1 col) */}
        <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Disciplines Caseload
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Distribution across clinical care areas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={serviceData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {serviceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", color: "#f4f4f5", fontSize: "12px" }}
                  formatter={(v) => [`${v}%`, "Caseload"]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-1.5 mt-2 max-h-[120px] overflow-y-auto pr-1">
              {serviceData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[140px]">{item.name}</span>
                  </div>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Chart Row: Symptom Trajectory & Modality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PHQ-9 and GAD-7 Trajectory */}
        <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Clinical Symptom Trajectory (8-Week Course)
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Average PHQ-9 (Depression) & GAD-7 (Anxiety) symptom reduction (lower = healthier)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={symptomTrajectory}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200/60 dark:stroke-zinc-800/80" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#888888" }} />
                <YAxis domain={[0, 25]} tick={{ fontSize: 11, fill: "#888888" }} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px", color: "#f4f4f5", fontSize: "12px" }} />
                <Legend />
                <Line type="monotone" dataKey="phq9" name="PHQ-9 (Depression)" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 4 }} />
                <Line type="monotone" dataKey="gad7" name="GAD-7 (Anxiety)" stroke="#10b981" strokeWidth={3} dot={{ fill: "#10b981", r: 4 }} />
                <Line type="monotone" dataKey="wellbeing" name="Wellbeing Index" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Format & Referral Sources */}
        <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Modality Split & Client Acquisition
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              In-Person vs Telehealth Video and client referral channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* In-Person vs Telehealth */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono">
                  <MapPin className="w-3.5 h-3.5" /> In-Person Room (58%)
                </span>
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-mono">
                  <Video className="w-3.5 h-3.5" /> Telehealth Video (42%)
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "58%" }} />
                <div className="h-full bg-amber-500" style={{ width: "42%" }} />
              </div>
            </div>

            {/* Referral Channels */}
            <div className="space-y-2.5 pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-500">Referral Sources</p>
              {referralSources.map((rf) => (
                <div key={rf.source} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">{rf.source}</span>
                    <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{rf.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${rf.value}%`, backgroundColor: rf.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
