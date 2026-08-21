import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";
import CustomAlert from "@/components/global/CustomAlert";
import Search from "@/components/global/Search";

import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Filter, RotateCcw, HeartPulse, Sparkles, UserPlus } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAuth } from "@/hooks/AuthProvider";
import UserTable from "@/components/users/UserTable";
import UserDialog from "@/components/users/UserDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Props {
  role: UserRole;
  title: string;
  description: string;
}

const THERAPY_DISCIPLINES = [
  "Individual Counselling",
  "Couples & Relationships",
  "Life Coaching",
  "Trauma Recovery",
  "Youth Support",
  "Substance Support",
  "Personal Growth",
];

export default function UserManagementPage({
  role,
  title,
  description,
}: Props) {
  const { user } = useAuth();
  const isAuthorized = user?.role === "admin" || user?.role === "teacher";
  const convexUsers = useQuery(api.users.getUsers, isAuthorized ? { role } : "skip");
  const deleteConvexUser = useMutation(api.users.deleteUser);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, setPage] = useState(1);

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Delete States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Handle Debounce for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, disciplineFilter, itemsPerPage]);

  // Practice-aligned filtering
  const filteredUsers = useMemo(() => {
    if (!convexUsers) return [];

    return convexUsers.filter((u: any) => {
      // 1. Search Query (Name or Email)
      const matchesSearch =
        !debouncedSearch ||
        u.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(debouncedSearch.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Status Filter
      if (statusFilter === "active") {
        if (u.isActive === false || u.isApproved === false) return false;
      } else if (statusFilter === "disabled") {
        if (u.isActive !== false) return false;
      } else if (statusFilter === "pending") {
        if (u.isApproved !== false) return false;
      }

      return true;
    });
  }, [convexUsers, debouncedSearch, statusFilter, disciplineFilter, role]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const hasActiveFilters =
    search.length > 0 || statusFilter !== "all" || disciplineFilter !== "all";

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setDisciplineFilter("all");
    setPage(1);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteConvexUser({ id: deleteId as any });
      toast.success("Record deleted successfully from practice directory");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <p className="text-muted-foreground text-lg font-medium">
          Access Denied: You do not have permission to view this practice care directory.
        </p>
      </div>
    );
  }

  const roleLabel =
    role === "student"
      ? "Client"
      : role === "teacher"
      ? "Practitioner"
      : role === "parent"
      ? "Family Contact"
      : "Administrator";

  const pageTitle =
    role === "student"
      ? "Client Caseload Directory"
      : role === "teacher"
      ? "Practitioners & Life Coaches"
      : role === "parent"
      ? "Family & Relationship Contacts"
      : "Practice Administration & POPIA Officers";

  const pageDescription =
    role === "student"
      ? "Manage active clients, therapy disciplines, session modalities, and POPIA consent records."
      : role === "teacher"
      ? "Registered counselling therapists, wellness practitioners, and certified life coaches."
      : role === "parent"
      ? "Spouse, partner, and emergency caregiver contacts linked to client care."
      : "Practice managers, clinical directors, and data protection officers.";

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#fbfdfc] min-h-screen text-[#0f2820]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#156e52] mb-2">
            <HeartPulse className="w-3.5 h-3.5" />
            Insight Works Directory
          </div>
          <h1 className="text-3xl font-black font-serif tracking-tight text-[#0f2820]">
            {pageTitle}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{pageDescription}</p>
        </div>
        <Button onClick={handleCreate} className="bg-[#156e52] hover:bg-[#0f5940] text-white font-bold text-xs gap-1.5 shadow-2xs cursor-pointer">
          <UserPlus className="h-4 w-4" /> Add {roleLabel}
        </Button>
      </div>

      {/* Filter & Toolbar Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="min-w-[240px]">
            <Search search={search} setSearch={setSearch} title={`Search ${roleLabel.toLowerCase()}s by name or email...`} />
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] text-xs font-medium bg-slate-50 rounded-xl border-slate-200">
                <SelectValue placeholder="Care Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Care Statuses</SelectItem>
                <SelectItem value="active">Active in Care</SelectItem>
                <SelectItem value="disabled">Inactive / Discharged</SelectItem>
                <SelectItem value="pending">Pending Intake Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Discipline Filter Dropdown for Clients */}
          {role === "student" && (
            <Select value={disciplineFilter} onValueChange={setDisciplineFilter}>
              <SelectTrigger className="w-[190px] text-xs font-medium bg-slate-50 rounded-xl border-slate-200">
                <SelectValue placeholder="Discipline Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Disciplines</SelectItem>
                {THERAPY_DISCIPLINES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-500 hover:text-[#156e52] cursor-pointer"
            >
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              Reset Filters
            </Button>
          )}
        </div>

        {/* Rows per page selector & Total Count */}
        <div className="flex items-center justify-between lg:justify-end gap-3 text-xs text-slate-500">
          {convexUsers && (
            <Badge variant="secondary" className="font-bold text-xs px-2.5 py-1 bg-emerald-50 text-[#156e52] border border-emerald-200/60">
              {filteredUsers.length} {roleLabel.toLowerCase()}(s)
            </Badge>
          )}

          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <Select
              value={String(itemsPerPage)}
              onValueChange={(v) => setItemsPerPage(Number(v))}
            >
              <SelectTrigger className="w-[70px] h-8 text-xs rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200/90 shadow-2xs bg-white">
        <UserTable
          role={role}
          loading={convexUsers === undefined}
          setDeleteId={setDeleteId}
          setIsDeleteOpen={setIsDeleteOpen}
          setEditingUser={setEditingUser}
          setIsFormOpen={setIsFormOpen}
          users={currentUsers as any}
          setPageNum={setPage}
          pageNum={page}
          totalPages={totalPages}
        />
      </div>

      {/* Create / Edit Dialog */}
      <UserDialog
        editingUser={editingUser}
        role={role}
        open={isFormOpen}
        setOpen={setIsFormOpen}
        onSuccess={() => {}}
      />

      {/* Delete Confirmation Alert */}
      <CustomAlert
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        handleDelete={handleDelete}
        title="Remove from Practice Directory?"
        description="This will permanently delete this client or user record from the practice database."
      />
    </div>
  );
}
