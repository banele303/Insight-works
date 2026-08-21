import { Moon, Sun, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/provider/theme";

export const ThemeToogle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80">
      <button
        type="button"
        onClick={() => setTheme("light")}
        title="Light Mode"
        className={cn(
          "h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer",
          theme === "light"
            ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs font-bold"
            : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        )}
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        title="Dark Mode"
        className={cn(
          "h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer",
          theme === "dark"
            ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs font-bold"
            : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        )}
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setTheme("system")}
        title="System Default"
        className={cn(
          "h-7 w-7 rounded-lg flex items-center justify-center transition-all cursor-pointer",
          theme === "system"
            ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-2xs font-bold"
            : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
        )}
      >
        <Laptop className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

