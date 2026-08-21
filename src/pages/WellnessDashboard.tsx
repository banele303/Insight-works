import { useState } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ScatterChart, Scatter, ComposedChart, ReferenceLine,
} from "recharts";
import {
  Brain, TrendingUp, Users, Calendar, Heart, Activity,
  Sparkles, ArrowUp, ArrowDown, MessageCircle, Clock, ShieldCheck,
  BarChart2, Star, Send, Bot, CheckCircle2, Shield, Award, HelpCircle
} from "lucide-react";

const moodTrendData = [
  { month: "Jan", anxiety: 72, depression: 65, stress: 80, wellbeing: 30 },
  { month: "Feb", anxiety: 68, depression: 60, stress: 75, wellbeing: 38 },
  { month: "Mar", anxiety: 60, depression: 55, stress: 68, wellbeing: 45 },
  { month: "Apr", anxiety: 52, depression: 48, stress: 60, wellbeing: 55 },
  { month: "May", anxiety: 45, depression: 42, stress: 50, wellbeing: 65 },
  { month: "Jun", anxiety: 38, depression: 35, stress: 42, wellbeing: 72 },
  { month: "Jul", anxiety: 30, depression: 28, stress: 35, wellbeing: 80 },
  { month: "Aug", anxiety: 25, depression: 22, stress: 28, wellbeing: 87 },
];

const sessionTypeData = [
  { name: "Individual Counselling", value: 45, color: "#156e52" },
  { name: "Couples & Relationship", value: 25, color: "#52b74c" },
  { name: "Life Coaching", value: 15, color: "#ea7627" },
  { name: "Trauma Recovery", value: 10, color: "#0d9488" },
  { name: "Youth & Young Adult", value: 5, color: "#0284c7" },
];

const weeklySessionsData = [
  { day: "Mon", sessions: 6, capacity: 8 },
  { day: "Tue", sessions: 7, capacity: 8 },
  { day: "Wed", sessions: 5, capacity: 8 },
  { day: "Thu", sessions: 8, capacity: 8 },
  { day: "Fri", sessions: 4, capacity: 6 },
];

const clientProgressData = [
  { name: "Severe Distress", before: 38, after: 8 },
  { name: "Moderate Distress", before: 35, after: 22 },
  { name: "Mild Symptoms", before: 18, after: 35 },
  { name: "Sub-Clinical / Well", before: 9, after: 35 },
];

const outcomeRadarData = [
  { axis: "Emotional Reg.", score: 78 },
  { axis: "Relationships", score: 85 },
  { axis: "Self-Esteem", score: 72 },
  { axis: "Anxiety Mgmt", score: 88 },
  { axis: "Work-Life", score: 65 },
  { axis: "Resilience", score: 80 },
];

const retentionData = [
  { month: "Jan", retained: 92, discharged: 8 },
  { month: "Feb", retained: 89, discharged: 11 },
  { month: "Mar", retained: 91, discharged: 9 },
  { month: "Apr", retained: 87, discharged: 13 },
  { month: "May", retained: 93, discharged: 7 },
  { month: "Jun", retained: 95, discharged: 5 },
  { month: "Jul", retained: 90, discharged: 10 },
  { month: "Aug", retained: 88, discharged: 12 },
];

const revenueData = [
  { month: "Jan", sessions: 24, revenue: 18000 },
  { month: "Feb", sessions: 28, revenue: 21000 },
  { month: "Mar", sessions: 32, revenue: 24000 },
  { month: "Apr", sessions: 30, revenue: 22500 },
  { month: "May", sessions: 35, revenue: 26250 },
  { month: "Jun", sessions: 38, revenue: 28500 },
  { month: "Jul", sessions: 40, revenue: 30000 },
  { month: "Aug", sessions: 36, revenue: 27000 },
];

const phq9Data = [
  { week: "W1", score: 18 }, { week: "W2", score: 16 }, { week: "W3", score: 15 },
  { week: "W4", score: 13 }, { week: "W5", score: 11 }, { week: "W6", score: 9 },
  { week: "W7", score: 7 }, { week: "W8", score: 5 },
];

const gad7Data = [
  { week: "W1", score: 19 }, { week: "W2", score: 17 }, { week: "W3", score: 15 },
  { week: "W4", score: 13 }, { week: "W5", score: 10 }, { week: "W6", score: 8 },
  { week: "W7", score: 6 }, { week: "W8", score: 4 },
];

const ageDistData = [
  { age: "18-24", clients: 22 }, { age: "25-34", clients: 38 },
  { age: "35-44", clients: 27 }, { age: "45-54", clients: 15 },
  { age: "55-64", clients: 8 }, { age: "65+", clients: 4 },
];

const referralData = [
  { source: "Online Search", value: 35, color: "#156e52" },
  { source: "Word of Mouth / Client Referrals", value: 28, color: "#52b74c" },
  { source: "Social Media Channels", value: 22, color: "#ea7627" },
  { source: "Healthcare Referrals", value: 10, color: "#0d9488" },
  { source: "Community Outreach", value: 5, color: "#0284c7" },
];

const aiInsights = [
  {
    icon: TrendingUp, color: "#156e52",
    title: "Caseload Outcomes Trending Positive",
    detail: "78% of active clients demonstrate significant symptom reduction and enhanced self-mastery across standard outcome metrics after 6+ sessions.",
  },
  {
    icon: Clock, color: "#52b74c",
    title: "Peak Attendance Window",
    detail: "Tuesday and Thursday mornings show a 94% attendance rate and lowest cancellation rate. Prioritize new intake consultations in these slots.",
  },
  {
    icon: Heart, color: "#ea7627",
    title: "High Demand for Couples Counselling",
    detail: "Couples & relationship counseling waitlist is currently 3x higher than individual therapy. Consider opening one additional weekend slot.",
  },
  {
    icon: ShieldCheck, color: "#0d9488",
    title: "POPIA Data Governance Status",
    detail: "All active patient files comply with Section 18 POPIA and statutory record retention rules. Zero privacy anomalies detected.",
  },
];

const scatterData = Array.from({ length: 40 }, (_, i) => ({
  session: (i % 12) + 1,
  mood: Math.min(10, Math.max(1, 3 + (i / 40) * 6 + ((i % 3) - 1) * 0.8)),
}));

function StatCard({ icon: Icon, label, value, trend, color }: { icon: React.ElementType; label: string; value: string; trend: string; color: string }) {
  const up = trend.startsWith("+");
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center border" style={{ background: `${color}10`, borderColor: `${color}20`, color }}>
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
          up ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-rose-700 bg-rose-50 border border-rose-200"
        }`}>
          {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />} {trend}
        </span>
      </div>
      <div>
        <p className="text-3xl font-black text-[#0f2820]" style={{ fontFamily: "'Playfair Display', serif" }}>{value}</p>
        <p className="text-xs font-bold text-[#64748b] uppercase tracking-wider mt-1">{label}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon: Icon, children }: { title: string; subtitle?: string; icon?: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-[#0f2820] font-bold text-lg font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
          {subtitle && <p className="text-[#64748b] text-xs mt-0.5">{subtitle}</p>}
        </div>
        {Icon && <Icon className="w-5 h-5 text-slate-400" />}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.08)",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "12px",
  color: "#0f2820",
};

const WellnessDashboard = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "clients" | "financial" | "ai">("overview");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your AI practice assistant. I can help analyze caseload trends, summarize symptom trajectories, or answer questions about aggregate practice outcomes without touching any client PII.",
    },
    {
      sender: "user",
      text: "What is the primary driver of symptom reduction in our caseload?",
    },
    {
      sender: "ai",
      text: "Aggregate data indicates that clients attending 6 or more consecutive sessions show a 78% average drop on distress scores. Grounding techniques and mindfulness tools show the highest client self-reported efficacy.",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Based on your aggregate practice telemetry, Thursday sessions are running at 100% capacity with 8 clients. Your overall client satisfaction rating remains high at 4.9/5 stars.`,
        },
      ]);
    }, 800);
  };

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart2 },
    { id: "clients" as const, label: "Client Outcomes", icon: Users },
    { id: "financial" as const, label: "Practice Health & Invoicing", icon: TrendingUp },
    { id: "ai" as const, label: "AI Practice Intelligence", icon: Brain },
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen text-[#0f2820]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* ── HEADER ── */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#156e52] text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" />
                  Clinical Analytics & Outcome Tracking
                </div>
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-black font-serif text-[#0f2820]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Insight Works{" "}
                  <span
                    className="italic"
                    style={{
                      background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Intelligence
                  </span>
                </h1>
                <p className="text-[#475569] text-sm sm:text-base max-w-2xl leading-relaxed">
                  Real-time clinical metrics, anonymized symptom trajectories, session capacity, and practice financial telemetry.
                </p>
              </div>

              <div className="flex items-center gap-3 px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-2xl self-start md:self-center shadow-2xs">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-[#0f2820]">POPIA Compliant</p>
                  <p className="text-[10px] text-[#64748b]">Live Anonymized Feed</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mt-8 flex-wrap border-t border-slate-100 pt-6">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-[#156e52] text-white shadow-sm"
                        : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── TAB 1: OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={Users} label="Active Caseload" value="84" trend="+12%" color="#0284c7" />
                <StatCard icon={Calendar} label="Sessions This Month" value="167" trend="+8%" color="#881337" />
                <StatCard icon={Star} label="Avg Client Rating" value="4.9/5" trend="+0.2" color="#d97706" />
                <StatCard icon={Activity} label="Outcome Improvement" value="87%" trend="+5%" color="#0d9488" />
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <ChartCard title="Caseload Symptom Reduction Trends" subtitle="Average standardized symptom index over 8 months (lower is healthier)">
                    <div className="h-72 w-full pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={moodTrendData}>
                          <defs>
                            <linearGradient id="anxLight" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#881337" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#881337" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="depLight" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="wbLight" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                              <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                          <Area type="monotone" dataKey="anxiety" name="Anxiety Index" stroke="#881337" fill="url(#anxLight)" strokeWidth={2.5} />
                          <Area type="monotone" dataKey="depression" name="Depression Index" stroke="#0284c7" fill="url(#depLight)" strokeWidth={2.5} />
                          <Area type="monotone" dataKey="wellbeing" name="Overall Wellbeing" stroke="#0d9488" fill="url(#wbLight)" strokeWidth={2.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>

                <div className="lg:col-span-4">
                  <ChartCard title="Session Modality Split" subtitle="Caseload breakdown by therapy format">
                    <div className="h-48 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={sessionTypeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                            {sessionTypeData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, ""]} contentStyle={tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-1.5 mt-2 border-t border-slate-100 pt-3">
                      {sessionTypeData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                            <span className="text-slate-600 font-medium">{item.name}</span>
                          </div>
                          <span className="text-[#0f172a] font-bold">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </ChartCard>
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Weekly Booking vs Capacity" subtitle="Consultation room utilization">
                  <div className="h-60 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklySessionsData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
                        <Bar dataKey="sessions" name="Booked Sessions" fill="#881337" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="capacity" name="Max Room Slots" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Client Demographics by Age" subtitle="Distribution across active caseload">
                  <div className="h-60 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageDistData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                        <YAxis dataKey="age" type="category" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} width={50} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="clients" name="Active Clients" fill="#0284c7" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>

              {/* Referral Sources Card */}
              <ChartCard title="Client Referral Channels" subtitle="Primary pathways clients discovered Serene Minds (Last 12 Months)">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
                  <div className="md:col-span-5 h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={referralData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={2}>
                          {referralData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, ""]} contentStyle={tooltipStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="md:col-span-7 space-y-3">
                    {referralData.map((item) => (
                      <div key={item.source} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">{item.source}</span>
                          <span className="text-[#0f172a] font-bold">{item.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.value}%`, background: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>
            </div>
          )}

          {/* ── TAB 2: CLIENT OUTCOMES ── */}
          {activeTab === "clients" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={TrendingUp} label="Avg PHQ-9 Drop" value="-13 pts" trend="+clinical avg" color="#0d9488" />
                <StatCard icon={Heart} label="Goal Attainment" value="78%" trend="+9%" color="#881337" />
                <StatCard icon={MessageCircle} label="Session Retention" value="91%" trend="+3%" color="#0284c7" />
                <StatCard icon={Users} label="Graduated Caseload" value="23" trend="+6 this qtr" color="#d97706" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="PHQ-9 Depression Trajectory" subtitle="Average score progression across 8 treatment weeks (lower = healthier)">
                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={phq9Data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} domain={[0, 21]} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <ReferenceLine y={10} stroke="#0284c7" strokeDasharray="4 4" label={{ value: "Moderate Cutoff", fill: "#0284c7", fontSize: 10 }} />
                        <Line type="monotone" dataKey="score" name="PHQ-9 Mean" stroke="#881337" strokeWidth={3} dot={{ fill: "#881337", r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="GAD-7 Anxiety Trajectory" subtitle="Average score progression across 8 treatment weeks (lower = healthier)">
                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={gad7Data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} domain={[0, 21]} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <ReferenceLine y={10} stroke="#881337" strokeDasharray="4 4" label={{ value: "Moderate Cutoff", fill: "#881337", fontSize: 10 }} />
                        <Line type="monotone" dataKey="score" name="GAD-7 Mean" stroke="#0284c7" strokeWidth={3} dot={{ fill: "#0284c7", r: 5 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Symptom Severity: Intake vs Post-Care" subtitle="Caseload distribution before treatment vs after 8+ sessions">
                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={clientProgressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
                        <Bar dataKey="before" name="Intake Baseline (%)" fill="#881337" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="after" name="Post-Treatment (%)" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Therapeutic Outcome Radar" subtitle="Client-reported functioning by psychological domain (100 = optimal)">
                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={outcomeRadarData} cx="50%" cy="50%">
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="axis" tick={{ fill: "#64748b", fontSize: 11 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                        <Radar name="Outcomes" dataKey="score" stroke="#0284c7" fill="#0284c7" fillOpacity={0.25} />
                        <Tooltip contentStyle={tooltipStyle} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>
            </div>
          )}

          {/* ── TAB 3: FINANCIAL & INVOICING ── */}
          {activeTab === "financial" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard icon={TrendingUp} label="Monthly Revenue" value="R27,000" trend="+14%" color="#0d9488" />
                <StatCard icon={Calendar} label="Billed Sessions" value="36" trend="+12%" color="#0284c7" />
                <StatCard icon={Activity} label="Average Session Tariff" value="R750" trend="+5%" color="#881337" />
                <StatCard icon={Users} label="Medical Aid Claims" value="18" trend="+3" color="#d97706" />
              </div>

              <ChartCard title="Monthly Revenue & Session Volume" subtitle="Historical billing telemetry across 8 months">
                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                      <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                      <Bar yAxisId="left" dataKey="sessions" name="Sessions Volume" fill="#0284c7" opacity={0.4} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="revenue" name="Total Revenue (ZAR)" stroke="#0d9488" strokeWidth={3} dot={{ fill: "#0d9488", r: 5 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChartCard title="Payment Method Breakdown" subtitle="Client settlement methods">
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: "Direct EFT", value: 45, color: "#0284c7" },
                          { name: "Medical Aid Direct", value: 30, color: "#881337" },
                          { name: "PayFast Card / EFT", value: 20, color: "#0d9488" },
                          { name: "Private Cash", value: 5, color: "#d97706" },
                        ]} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={3}>
                          {["#0284c7", "#881337", "#0d9488", "#d97706"].map((c, i) => <Cell key={i} fill={c} />)}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, ""]} contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "5px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Recent Invoicing Ledger" subtitle="Simulated PayFast settlement queue">
                  <div className="space-y-2.5 pt-1">
                    {[
                      { id: "PF-8910", client: "Client A. (Indiv. Session)", amount: "R750", status: "Settled", date: "19 Aug 2026" },
                      { id: "PF-8911", client: "Client B. (Couples Intake)", amount: "R950", status: "Settled", date: "18 Aug 2026" },
                      { id: "PF-8912", client: "Client C. (Group Therapy)", amount: "R350", status: "Pending", date: "18 Aug 2026" },
                      { id: "PF-8913", client: "Client D. (EMDR Session)", amount: "R850", status: "Settled", date: "17 Aug 2026" },
                    ].map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] text-[#881337]">
                            PF
                          </div>
                          <div>
                            <p className="font-bold text-[#0f172a]">{tx.client}</p>
                            <p className="text-[10px] text-[#64748b]">{tx.id} · {tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#0f172a]">{tx.amount}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tx.status === "Settled" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>
            </div>
          )}

          {/* ── TAB 4: AI PRACTICE INTELLIGENCE ── */}
          {activeTab === "ai" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* 4 AI Insight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiInsights.map((insight) => {
                  const InsightIcon = insight.icon;
                  return (
                    <div
                      key={insight.title}
                      className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex gap-4 items-start"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                        style={{ background: `${insight.color}10`, borderColor: `${insight.color}25`, color: insight.color }}
                      >
                        <InsightIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-[#0f172a] font-bold text-base mb-1.5 font-serif">{insight.title}</h3>
                        <p className="text-[#475569] text-xs sm:text-sm leading-relaxed">{insight.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scatter Chart */}
              <ChartCard title="Session Count vs. Mood Score Cluster" subtitle="Scatter analysis indicating positive mood elevation as session count progresses">
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="session" name="Session Number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} />
                      <YAxis dataKey="mood" name="Self-Reported Mood (1-10)" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#e2e8f0" }} domain={[1, 10]} />
                      <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "#cbd5e1" }} contentStyle={tooltipStyle} />
                      <Scatter name="Clients" data={scatterData} fill="#0284c7" fillOpacity={0.6} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              {/* AI Chatbot Assistant Panel */}
              <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#881337]">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg font-serif text-[#0f172a]">AI Practice Assistant</h3>
                      <p className="text-xs text-[#64748b]">Powered by Google Gemini · Zero Client PII Processed</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    POPIA Protected
                  </span>
                </div>

                {/* Conversation bubbles container */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 bg-[#f8fafc] p-4 rounded-2xl border border-slate-200/80">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.sender === "ai" && (
                        <div className="w-8 h-8 rounded-xl bg-[#0284c7] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          AI
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-md ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-[#881337] to-[#be123c] text-white rounded-tr-none shadow-xs"
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat input form */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about practice outcomes, attendance patterns, or evidence-based interventions..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-[#881337] to-[#be123c] text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:shadow-md hover:shadow-rose-900/20 transition-all shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-[11px] text-[#64748b]">
                  Note: This assistant uses anonymized aggregate statistical summaries only. No client names, contact records, or medical notes are exposed.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
      
      <Footer />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
    </div>
  );
};

export default WellnessDashboard;
