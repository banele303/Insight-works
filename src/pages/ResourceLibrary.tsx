import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  FileText, Download, ShieldCheck, Search, Filter,
  BookOpen, Clock, Lock, Sparkles, CheckCircle2, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import type { Id } from "../../convex/_generated/dataModel";

const CATEGORIES = [
  "All",
  "CBT & Grounding",
  "Couples Tools",
  "Intake & Legal",
  "Mindfulness & Worksheets",
  "Life Coaching",
  "Assessment Forms",
];

export default function ResourceLibrary() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const documents = useQuery(api.documents.getDocuments, {
    category: selectedCategory === "All" ? undefined : selectedCategory,
  }) || [];

  const incrementDownloadMutation = useMutation(api.documents.incrementDownload);

  const handleDownload = (docId: Id<"clinicalDocuments">, url: string) => {
    incrementDownloadMutation({ id: docId }).catch(() => {});
    window.open(url, "_blank");
  };

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(search.toLowerCase())) ||
      d.fileName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-black min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── HEADER (Vercel Style) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4" /> Therapeutic Sanctuary Materials
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Clinical Resource Library
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Download evidence-based psychoeducation worksheets, CBT thought journals, and grounding exercises.
          </p>
        </div>

        <Link
          to="/booking"
          className="inline-flex items-center gap-2 bg-[#156e52] hover:bg-[#0f5940] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          Book Consultation <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── SEARCH & CATEGORIES ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search exercises and worksheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                  : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESOURCE GRID ── */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-300 dark:border-zinc-800/80 rounded-3xl p-8 bg-zinc-50/50 dark:bg-zinc-950/40">
          <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No resources found</h3>
          <p className="text-xs text-zinc-500 mt-1">Try another search keyword or switch categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="flex flex-col justify-between rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 p-5 shadow-xs hover:border-emerald-500/40 dark:hover:border-zinc-700 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                    {doc.category}
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono border-zinc-200 dark:border-zinc-800">
                    {doc.format}
                  </Badge>
                </div>

                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                {doc.description && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                  <span>{doc.fileSize}</span>
                  {doc.downloads !== undefined && <span> · {doc.downloads} downloads</span>}
                </div>

                <Button
                  onClick={() => handleDownload(doc._id, doc.downloadUrl)}
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-bold gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
