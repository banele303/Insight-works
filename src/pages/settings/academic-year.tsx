import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Calendar, ShieldCheck, Clock } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Button } from "@/components/ui/button";
// import Alert from "@/components/global/alert";
import AcademicYearTable from "@/components/academic-year/academic-year-table";
import Search from "@/components/global/Search";
import AcademicYearForm from "@/components/academic-year/AcademicYearForm";
import CustomAlert from "@/components/global/CustomAlert";

const AcademicYear = () => {
  const convexYears = useQuery(api.academicYears.getAcademicYears);
  
  // --- Search & Pagination State ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageNum, setPageNum] = useState(1);
  
  // Client-side filtering and pagination
  const filteredYears = convexYears?.filter(y => 
    y.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredYears.length / itemsPerPage));
  const currentYears = filteredYears.slice((pageNum - 1) * itemsPerPage, pageNum * itemsPerPage);

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<any | null>(null);

  // Alert States
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Debounce Search Input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPageNum(1); // Reset to first page on new search
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleCreate = () => {
    setEditingYear(null);
    setIsFormOpen(true);
  };

  const handleEdit = (year: any) => {
    setEditingYear(year);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsAlertOpen(true);
  };

  const deleteYearMutation = useMutation(api.academicYears.deleteYear);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteYearMutation({ id: deletingId as any });
      toast.success("Practice cycle period removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setIsAlertOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#fbfdfc] dark:bg-slate-950 min-h-screen text-[#0f2820] dark:text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#156e52] dark:text-emerald-400 mb-2">
            <Clock className="w-3.5 h-3.5" />
            Practice Calendar &amp; Retention
          </div>
          <h1 className="text-3xl font-black font-serif tracking-tight text-[#0f2820] dark:text-white">
            Clinical Practice Cycles &amp; Retention Windows
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage practice operating periods, clinical audit cycles, and POPIA 5-year data retention timelines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Search search={search} setSearch={setSearch} title="Search practice cycles..." />
          <Button onClick={handleCreate} className="bg-[#156e52] hover:bg-[#0f5940] text-white font-bold text-xs gap-1.5 shadow-2xs cursor-pointer">
            <Plus className="h-4 w-4" /> Add Practice Cycle
          </Button>
        </div>
      </div>

      {/* Table Component */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xs overflow-hidden">
        <AcademicYearTable
          data={currentYears as any}
          loading={convexYears === undefined}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          pageNum={pageNum}
          setPageNum={setPageNum}
          totalPages={totalPages}
        />
      </div>

      {/* Form Dialog */}
      <AcademicYearForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        editingYear={editingYear}
        onSuccess={() => {}}
      />

      {/* Delete Alert */}
      <CustomAlert
        isOpen={isAlertOpen}
        setIsOpen={setIsAlertOpen}
        handleDelete={confirmDelete}
        title="Remove Practice Cycle?"
        description="This will remove the selected practice operating period from your historical calendar."
      />
    </div>
  );
};

export default AcademicYear;
