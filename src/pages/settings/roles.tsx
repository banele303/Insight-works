import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, UserCheck, HeartHandshake, Users,
  Lock, Search, Trash2, Edit3,
  CheckCircle2, UserPlus, KeyRound, X
} from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "teacher" | "student" | "parent";
  roleLabel: string;
  hpcsaNumber?: string;
  discipline: string;
  status: "active" | "suspended" | "pending";
  popiaVerified: boolean;
  permissions: string[];
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "tm-1",
    name: "Maletsatsi Sibanda",
    email: "maletsatsi@insightherapyandcoaching.co.za",
    phone: "+27 79 550 1557",
    role: "admin",
    roleLabel: "Clinical Director & Lead Therapist",
    hpcsaNumber: "HPCSA PRC 0048291",
    discipline: "Individual, Couples & Trauma Recovery",
    status: "active",
    popiaVerified: true,
    permissions: ["Full Practice Governance", "Clinical Caseload Oversight", "POPIA Information Officer", "Billing & Analytics"],
  },
  {
    id: "tm-2",
    name: "Dr. Lindiwe Khumalo",
    email: "lindiwe.k@insightherapyandcoaching.co.za",
    phone: "+27 82 441 9081",
    role: "teacher",
    roleLabel: "Associate Psychologist & EMDR Coach",
    hpcsaNumber: "HPCSA PS 0092147",
    discipline: "Trauma Recovery & EMDR Somatics",
    status: "active",
    popiaVerified: true,
    permissions: ["Clinical Notes & Caseload", "Appointment Scheduling", "Client Messaging", "Intake Evaluations"],
  },
  {
    id: "tm-3",
    name: "Thabo Maseko",
    email: "thabo.m@insightherapyandcoaching.co.za",
    phone: "+27 71 883 2049",
    role: "teacher",
    roleLabel: "Life Coach & Youth Counsellor",
    hpcsaNumber: "COMENSA Master Practitioner",
    discipline: "Life Coaching & Youth Support",
    status: "active",
    popiaVerified: true,
    permissions: ["Coaching Sessions", "Goal Tracking", "Client Messaging"],
  },
  {
    id: "tm-4",
    name: "Zanele Dlamini",
    email: "admin@insightherapyandcoaching.co.za",
    phone: "+27 11 440 2819",
    role: "admin",
    roleLabel: "Practice Manager & Intake Coordinator",
    hpcsaNumber: "N/A - Practice Administration",
    discipline: "Client Onboarding & Scheduling",
    status: "active",
    popiaVerified: true,
    permissions: ["Manage Bookings", "Process Intake Forms", "POPIA Filing"],
  },
];

const ROLES_INFO = [
  {
    id: "admin",
    title: "Clinical Director & Practice Admin",
    icon: ShieldCheck,
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    desc: "Full administrative control, POPIA officer oversight, practitioner credentialing, and practice billing.",
    defaultPermissions: ["Full Practice Governance", "Clinical Caseload Oversight", "POPIA Information Officer", "Billing & Analytics"],
  },
  {
    id: "teacher",
    title: "Therapist & Life Coach",
    icon: UserCheck,
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    desc: "Assigned clinical caseloads, private session notes, client appointment calendar, and direct messaging.",
    defaultPermissions: ["Clinical Notes & Caseload", "Appointment Scheduling", "Client Messaging", "Intake Evaluations"],
  },
  {
    id: "student",
    title: "Client (In Therapy & Coaching)",
    icon: HeartHandshake,
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    desc: "Personal client sanctuary, appointment self-scheduling, digital intake questionnaires, and AI companion.",
    defaultPermissions: ["Book & Reschedule", "AI Sanctuary Companion", "Digital Intake & POPIA Consent", "Outcome Tracking"],
  },
  {
    id: "parent",
    title: "Partner & Family Contact",
    icon: Users,
    badge: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    desc: "Linked contact for couples counselling, family therapy, and youth session coordination.",
    defaultPermissions: ["Couples Joint Scheduling", "Consent Verification", "Emergency Contact Status"],
  },
];

const DISCIPLINES = [
  "Individual Counselling",
  "Couples & Relationship Counselling",
  "Life Coaching & Self-Mastery",
  "Trauma Recovery & EMDR",
  "Youth & Young Adult Support",
  "Substance Use Support",
  "Practice Administration & Intake",
];

export default function RolesPermissions() {
  useQuery(api.users.getUsers, {});
  useMutation(api.users.updateUser);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM_MEMBERS);
  const [search, setSearch] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form states for adding / editing
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formHpcsa, setFormHpcsa] = useState("");
  const [formRole, setFormRole] = useState<"admin" | "teacher" | "student" | "parent">("teacher");
  const [formDiscipline, setFormDiscipline] = useState(DISCIPLINES[0]);
  const [formPermissions, setFormPermissions] = useState<string[]>(ROLES_INFO[1].defaultPermissions);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.discipline.toLowerCase().includes(search.toLowerCase()) ||
        (m.hpcsaNumber && m.hpcsaNumber.toLowerCase().includes(search.toLowerCase()));

      const matchRole = selectedRoleFilter === "all" || m.role === selectedRoleFilter;
      return matchSearch && matchRole;
    });
  }, [teamMembers, search, selectedRoleFilter]);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormHpcsa("");
    setFormRole("teacher");
    setFormDiscipline(DISCIPLINES[0]);
    setFormPermissions(ROLES_INFO[1].defaultPermissions);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormEmail(member.email);
    setFormPhone(member.phone);
    setFormHpcsa(member.hpcsaNumber || "");
    setFormRole(member.role);
    setFormDiscipline(member.discipline);
    setFormPermissions(member.permissions);
    setIsAddModalOpen(true);
  };

  const handleRoleChangeInForm = (newRole: "admin" | "teacher" | "student" | "parent") => {
    setFormRole(newRole);
    const matched = ROLES_INFO.find((r) => r.id === newRole);
    if (matched) {
      setFormPermissions(matched.defaultPermissions);
    }
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Please provide both name and email.");
      return;
    }

    const matchedRole = ROLES_INFO.find((r) => r.id === formRole);

    if (editingMember) {
      // Update existing
      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: formName.trim(),
                email: formEmail.trim(),
                phone: formPhone.trim() || m.phone,
                hpcsaNumber: formHpcsa.trim() || m.hpcsaNumber,
                role: formRole,
                roleLabel: matchedRole?.title || formRole,
                discipline: formDiscipline,
                permissions: formPermissions,
              }
            : m
        )
      );
      toast.success(`Updated role & permissions for ${formName}`);
    } else {
      // Create new
      const newMember: TeamMember = {
        id: `tm-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim() || "+27 79 000 0000",
        hpcsaNumber: formHpcsa.trim() || "Pending HPCSA Verification",
        role: formRole,
        roleLabel: matchedRole?.title || formRole,
        discipline: formDiscipline,
        status: "active",
        popiaVerified: true,
        permissions: formPermissions,
      };
      setTeamMembers((prev) => [newMember, ...prev]);
      toast.success(`Added ${formName} to Insight Works practice team with role ${matchedRole?.title}`);
    }

    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setTeamMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextStatus = m.status === "active" ? "suspended" : "active";
          toast.success(`${m.name} status updated to ${nextStatus.toUpperCase()}`);
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleDirectRoleAssign = (id: string, newRole: "admin" | "teacher" | "student" | "parent") => {
    const matchedRole = ROLES_INFO.find((r) => r.id === newRole);
    setTeamMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          toast.success(`Assigned ${matchedRole?.title} role to ${m.name}`);
          return {
            ...m,
            role: newRole,
            roleLabel: matchedRole?.title || newRole,
            permissions: matchedRole?.defaultPermissions || m.permissions,
          };
        }
        return m;
      })
    );
  };

  const handleDeleteMember = (id: string) => {
    const target = teamMembers.find((m) => m.id === id);
    if (target?.email === "maletsatsi@insightherapyandcoaching.co.za") {
      toast.error("Cannot remove primary practice director.");
      return;
    }
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success("Team member removed from practice management");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-200 mb-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            POPIA Governance & Access
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Practice Team & Roles
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Assign clinical roles, customize therapeutic permissions, and manage practitioner credentials.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium text-xs px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-transparent shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add Team Member
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Practice Team", value: teamMembers.length, icon: Users },
          { label: "Active Practitioners", value: teamMembers.filter((m) => m.role === "teacher" || m.role === "admin").length, icon: UserCheck },
          { label: "POPIA Verified", value: teamMembers.filter((m) => m.popiaVerified).length, icon: ShieldCheck },
          { label: "Practice Directors", value: teamMembers.filter((m) => m.role === "admin").length, icon: KeyRound },
        ].map((stat, i) => (
          <Card key={i} className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                <p className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50 mt-1">{stat.value}</p>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-zinc-200/60 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 shrink-0">
                <stat.icon className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Hierarchy Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ROLES_INFO.map((r) => {
          const count = teamMembers.filter((m) => m.role === r.id).length;
          const isSelected = selectedRoleFilter === r.id;
          return (
            <button
              type="button"
              key={r.id}
              onClick={() => setSelectedRoleFilter(isSelected ? "all" : r.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-400 dark:border-zinc-600 ring-1 ring-zinc-400 dark:ring-zinc-600 shadow-xs"
                  : "bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${r.badge}`}>
                  {r.title.split("&")[0]}
                </Badge>
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700/50">
                  {count} {count === 1 ? "member" : "members"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2">{r.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Team Member Management Table Card */}
      <Card className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/40 shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-zinc-200/80 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              Assigned Team Members & Credentials ({filteredMembers.length})
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Manage clinical rights, assigned therapeutic disciplines, and access credentials.
            </CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
              <Input
                placeholder="Filter members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-zinc-50 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 text-zinc-900 dark:text-zinc-100 rounded-lg text-xs placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="h-9 bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Clinical Directors & Admins</option>
              <option value="teacher">Therapists & Coaches</option>
              <option value="student">Clients</option>
              <option value="parent">Partners & Family</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono font-medium uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Practitioner / Staff</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Clinical Discipline</th>
                <th className="py-3 px-4">POPIA & Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                  {/* Member Name & Contact */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono font-semibold text-xs text-zinc-800 dark:text-zinc-200 shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 leading-tight">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{member.email}</p>
                        {member.hpcsaNumber && (
                          <span className="inline-block text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 px-1.5 py-0.2 rounded mt-0.5">
                            {member.hpcsaNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role Dropdown */}
                  <td className="py-3.5 px-4">
                    <select
                      value={member.role}
                      onChange={(e) => handleDirectRoleAssign(member.id, e.target.value as any)}
                      className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none"
                    >
                      <option value="admin">Clinical Director & Admin</option>
                      <option value="teacher">Therapist & Life Coach</option>
                      <option value="student">Client</option>
                      <option value="parent">Partner / Family</option>
                    </select>
                  </td>

                  {/* Discipline */}
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-zinc-700 dark:text-zinc-300">{member.discipline}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">{member.phone}</p>
                  </td>

                  {/* Status & POPIA */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1">
                      <button
                        onClick={() => handleToggleStatus(member.id)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium transition-all cursor-pointer ${
                          member.status === "active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                        {member.status === "active" ? "Active" : "Suspended"}
                      </button>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>POPIA Verified</span>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEdit(member)}
                        className="h-7 text-xs font-medium rounded-lg gap-1 border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteMember(member.id)}
                        className="h-7 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-lg px-2 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Add / Edit Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in-50 zoom-in-95 text-zinc-900 dark:text-zinc-100">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-semibold text-base text-zinc-900 dark:text-zinc-50">
                  {editingMember ? `Edit Team Member: ${editingMember.name}` : "Assign New Practice Team Member"}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Configure clinical identity, assigned role, and POPIA data permissions.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Full Name</Label>
                  <Input
                    required
                    placeholder="e.g. Dr. Lindiwe Khumalo"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Email Address</Label>
                  <Input
                    required
                    type="email"
                    placeholder="lindiwe@insightherapyandcoaching.co.za"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Phone / WhatsApp</Label>
                  <Input
                    placeholder="+27 82 441 9081"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">HPCSA / Council Registration Number</Label>
                  <Input
                    placeholder="e.g. HPCSA PS 0092147 or COMENSA"
                    value={formHpcsa}
                    onChange={(e) => setFormHpcsa(e.target.value)}
                    className="rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Portal Role</Label>
                  <select
                    value={formRole}
                    onChange={(e) => handleRoleChangeInForm(e.target.value as any)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="admin">Clinical Director & Admin</option>
                    <option value="teacher">Therapist & Life Coach</option>
                    <option value="student">Client</option>
                    <option value="parent">Partner / Family</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="font-medium text-zinc-700 dark:text-zinc-300">Primary Discipline Focus</Label>
                  <select
                    value={formDiscipline}
                    onChange={(e) => setFormDiscipline(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none"
                  >
                    {DISCIPLINES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 space-y-2">
                <Label className="font-medium text-zinc-700 dark:text-zinc-300">Assigned Core Permissions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {formPermissions.map((perm, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 p-2 rounded-md text-[11px] text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{perm}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-lg text-xs border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Cancel
                </Button>
                <Button type="submit" className="bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-lg text-xs font-medium">
                  {editingMember ? "Save Changes" : "Assign Member & Grant Access"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
