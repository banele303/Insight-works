import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  UserIcon,
  Check,
  Ban,
  UserCheck,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Video,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { user } from "@/types";
import CustomPagination from "@/components/global/CustomPagination";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface Props {
  role: string;
  loading: boolean;
  setDeleteId: (id: string) => void;
  setIsDeleteOpen: (open: boolean) => void;
  setEditingUser: (user: user | null) => void;
  setIsFormOpen: (open: boolean) => void;
  users: user[];
  pageNum: number;
  setPageNum: (page: number) => void;
  totalPages: number;
}

const UserTable = ({
  role,
  loading,
  setDeleteId,
  setIsDeleteOpen,
  setEditingUser,
  setIsFormOpen,
  pageNum,
  setPageNum,
  users = [],
  totalPages,
}: Props) => {
  const navigate = useNavigate();
  const updateUserMutation = useMutation(api.users.updateUser);

  const handleEdit = (user: user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleApprove = async (id: string) => {
    try {
      await updateUserMutation({ id: id as any, isApproved: true });
      toast.success("Client intake approved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to approve intake");
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await updateUserMutation({ id: id as any, isActive: active });
      toast.success(active ? "Account marked active in care" : "Account marked inactive / discharged");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="border-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-50/70">
            <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">
              {role === "student" ? "Client Name" : role === "teacher" ? "Practitioner" : role === "parent" ? "Contact Name" : "Administrator"}
            </TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Contact / Email</TableHead>
            
            {/* Practice Specific Columns */}
            {role === "student" && (
              <>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Therapy Focus</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Modality</TableHead>
              </>
            )}

            {role === "teacher" && (
              <>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Specialization</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Registration</TableHead>
              </>
            )}

            {role === "parent" && (
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Relationship</TableHead>
            )}

            {role === "admin" && (
              <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Practice Role</TableHead>
            )}

            <TableHead className="font-bold text-xs uppercase tracking-wider text-slate-500">Care Status</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-slate-500">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#156e52]" />
                <p className="text-xs text-slate-400 mt-2">Loading practice directory...</p>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-slate-400 text-xs"
              >
                No {role === "student" ? "clients" : role === "teacher" ? "practitioners" : role === "parent" ? "family contacts" : "administrators"} found in practice directory.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user: any) => (
              <TableRow key={user._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                {/* Name & Avatar */}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200/80 dark:border-emerald-800 flex items-center justify-center text-[#156e52] dark:text-emerald-400 font-bold text-xs shadow-2xs">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-[#0f2820] dark:text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400">POPIA Consent On File</p>
                    </div>
                  </div>
                </TableCell>

                {/* Email / WhatsApp */}
                <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-medium">{user.email}</p>
                  <p className="text-[11px] text-slate-400">{user.phone || "+27 (Confidential)"}</p>
                </TableCell>

                {/* Client Therapy Focus & Modality */}
                {role === "student" && (
                  <>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50/80 dark:bg-emerald-950/40 text-[#156e52] dark:text-emerald-300 border-emerald-200/80 text-[11px] font-bold">
                        Individual &amp; Growth
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                        <Video className="w-3.5 h-3.5 text-[#ea7627]" /> Telehealth Video
                      </span>
                    </TableCell>
                  </>
                )}

                {/* Practitioner Specialization */}
                {role === "teacher" && (
                  <>
                    <TableCell>
                      <Badge variant="outline" className="bg-amber-50 text-[#ea7627] border-amber-200 text-[11px] font-bold">
                        CBT · Gottman · EMDR
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                      HPCSA Registered
                    </TableCell>
                  </>
                )}

                {/* Family Contact Relationship */}
                {role === "parent" && (
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-100 text-slate-700 text-[11px]">
                      Partner / Spouse
                    </Badge>
                  </TableCell>
                )}

                {/* Admin Role */}
                {role === "admin" && (
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[11px] font-bold">
                      Clinical Practice Director
                    </Badge>
                  </TableCell>
                )}

                {/* Care Status */}
                <TableCell>
                  {user.isApproved === false ? (
                    <Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50 dark:bg-amber-950/20 text-[10px] font-bold">
                      Pending Intake Review
                    </Badge>
                  ) : user.isActive === false ? (
                    <Badge variant="outline" className="border-slate-300 text-slate-500 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                      Discharged / Inactive
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-emerald-300 text-[#156e52] bg-emerald-50 dark:bg-emerald-950/40 text-[10px] font-bold">
                      ● Active in Care
                    </Badge>
                  )}
                </TableCell>

                {/* Actions Dropdown */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs">
                      <DropdownMenuLabel>Practice Actions</DropdownMenuLabel>
                      
                      <DropdownMenuItem onClick={() => navigate("/events")} className="cursor-pointer">
                        <Calendar className="mr-2 h-3.5 w-3.5 text-[#156e52]" /> Schedule Appointment
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => navigate("/messages")} className="cursor-pointer">
                        <MessageSquare className="mr-2 h-3.5 w-3.5 text-sky-600" /> Message Client
                      </DropdownMenuItem>

                      {user.isApproved === false && (
                        <DropdownMenuItem onClick={() => handleApprove(user._id)} className="cursor-pointer">
                          <UserCheck className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Approve Intake
                        </DropdownMenuItem>
                      )}

                      {user.isActive === false ? (
                        <DropdownMenuItem onClick={() => handleToggleActive(user._id, true)} className="cursor-pointer">
                          <Check className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Mark Active in Care
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleToggleActive(user._id, false)} className="cursor-pointer">
                          <Ban className="mr-2 h-3.5 w-3.5 text-amber-600" /> Mark Inactive / Discharged
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem onClick={() => handleEdit(user)} className="cursor-pointer">
                        <Pencil className="mr-2 h-3.5 w-3.5" /> Edit Details
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-rose-600 cursor-pointer"
                        onClick={() => {
                          setDeleteId(user._id);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <CustomPagination
          loading={loading}
          page={pageNum}
          setPage={setPageNum}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default UserTable;
