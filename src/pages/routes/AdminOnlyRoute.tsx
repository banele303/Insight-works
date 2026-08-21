import { useAuth } from "@/hooks/AuthProvider";
import { Navigate, Outlet } from "react-router";
import { Loader2, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * AdminOnlyRoute — blocks access to any route wrapped inside it.
 * Only users with role === "admin" can pass through.
 * Everyone else gets a clear "Access Denied" screen.
 */
const AdminOnlyRoute = () => {
  const { loading, user, signOut } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#156e52]" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 text-center">
        <div className="max-w-md w-full p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center">
            <ShieldX className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Access Denied
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              This area is restricted to practice administrators only. If you believe you should have access, please contact Insight Works support.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              onClick={() => window.history.back()}
              className="w-full bg-[#156e52] hover:bg-[#0f5940] text-white"
            >
              Go Back
            </Button>
            <Button
              onClick={() => void signOut()}
              variant="outline"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminOnlyRoute;
