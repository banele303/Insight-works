import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  FileText, Download, Plus, Trash2, ShieldCheck, HeartPulse,
  Sparkles, CheckCircle2, Upload, FileCheck, BookOpen, Search,
  Lock, Eye, Filter, ArrowUpRight, Check, X, File, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Id } from "../../../convex/_generated/dataModel";

const CATEGORIES = [
  "CBT & Grounding",
  "Couples Tools",
  "Intake & Legal",
  "Mindfulness & Worksheets",
  "Life Coaching",
  "Assessment Forms",
];

export default function AdminResources() {
  const documents = useQuery(api.documents.getDocuments, {}) || [];
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const createDocumentMutation = useMutation(api.documents.createDocument);
  const deleteDocumentMutation = useMutation(api.documents.deleteDocument);
  const incrementDownloadMutation = useMutation(api.documents.incrementDownload);
  const seedInitialDocuments = useMutation(api.documents.seedInitialDocuments);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [popiaCompliant, setPopiaCompliant] = useState(true);

  // File upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFormatFromType = (fileType: string, fileName: string): string => {
    if (fileType.includes("pdf") || fileName.endsWith(".pdf")) return "PDF";
    if (fileType.includes("word") || fileName.endsWith(".doc") || fileName.endsWith(".docx")) return "DOCX";
    if (fileType.includes("image")) return "IMAGE";
    if (fileType.includes("audio")) return "AUDIO";
    return "DOC";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTitle(cleanName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a document title.");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a document file to upload.");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsUploading(true);

      // 1. Get short-lived upload URL from Convex Storage
      const postUrl = await generateUploadUrl();

      // 2. Upload file binary directly to Convex
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type || "application/octet-stream" },
        body: selectedFile,
      });

      if (!result.ok) {
        throw new Error("File upload to Convex Storage failed.");
      }

      const { storageId } = await result.json();

      // 3. Register document in Convex database
      await createDocumentMutation({
        title,
        category,
        description,
        storageId,
        fileName: selectedFile.name,
        fileSize: formatBytes(selectedFile.size),
        fileType: selectedFile.type || "application/octet-stream",
        format: getFormatFromType(selectedFile.type, selectedFile.name),
        isPublic,
        popiaCompliant,
      });

      toast.success("Document uploaded and published to practice files!");
      setIsModalOpen(false);
      setSelectedFile(null);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload document.");
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: Id<"clinicalDocuments">, docTitle: string) => {
    if (confirm(`Are you sure you want to delete "${docTitle}"?`)) {
      try {
        await deleteDocumentMutation({ id });
        toast.success("Document removed successfully.");
      } catch {
        toast.error("Failed to delete document.");
      }
    }
  };

  const handleDownload = (docId: Id<"clinicalDocuments">, url: string) => {
    incrementDownloadMutation({ id: docId }).catch(() => {});
    window.open(url, "_blank");
  };

  const handleSeed = async () => {
    try {
      const res = await seedInitialDocuments();
      toast.success(res.message || `Seeded ${res.count} clinical templates!`);
    } catch {
      toast.error("Could not seed documents.");
    }
  };

  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(search.toLowerCase())) ||
      d.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "all" || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 text-zinc-900 dark:text-zinc-100 bg-white dark:bg-black min-h-screen overflow-x-hidden" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── TOP HEADER (Responsive & Clean) ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-5">
        <div className="space-y-1 max-w-2xl min-w-0">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5" /> Practice Assets &amp; Compliance
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white truncate">
            Clinical Document Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Upload and distribute POPIA-compliant worksheets, intake PDFs, and therapeutic tools on Convex Cloud.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Button
            onClick={() => {
              setSelectedFile(null);
              setTitle("");
              setDescription("");
              setIsModalOpen(true);
            }}
            className="h-9 px-4 text-xs font-bold bg-[#156e52] hover:bg-[#0f5940] text-white gap-2 shadow-xs cursor-pointer rounded-xl"
          >
            <Upload className="w-3.5 h-3.5" /> Upload Document
          </Button>
        </div>
      </div>

      {/* ── SEARCH & CATEGORY FILTER (Full Width & Mobile Friendly) ── */}
      <div className="space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search documents by title, keyword, or file name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 w-full bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/80 rounded-xl text-xs sm:text-sm"
          />
        </div>

        {/* Scrollable / Wrapping Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              selectedCategory === "all"
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xs"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            }`}
          >
            All ({documents.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = documents.filter((d) => d.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-2xs"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {cat} {count > 0 && <span className="opacity-70 ml-1">({count})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DOCUMENTS LIST (No horizontal scroll, fully responsive) ── */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-14 border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 bg-zinc-50/50 dark:bg-zinc-950/40">
          <FileText className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No documents found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Upload your therapeutic worksheet or select another category filter.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Button
              onClick={() => setIsModalOpen(true)}
              size="sm"
              className="bg-[#156e52] hover:bg-[#0f5940] text-white text-xs h-8"
            >
              Upload Real File
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs">
          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800/80">
            {filteredDocs.map((doc) => (
              <div
                key={doc._id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors group"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-[#156e52] dark:text-emerald-400 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-[#156e52] dark:group-hover:text-emerald-400 transition-colors leading-snug break-words">
                        {doc.title}
                      </h4>
                      <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[9px] sm:text-[10px] font-bold border-zinc-200 dark:border-zinc-700 py-0 px-1.5">
                        {doc.format}
                      </Badge>
                      {doc.popiaCompliant && (
                        <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[9px] sm:text-[10px] font-bold border-emerald-200 dark:border-emerald-800 py-0 px-1.5">
                          POPIA Verified
                        </Badge>
                      )}
                      {!doc.isPublic && (
                        <Badge variant="outline" className="text-[9px] sm:text-[10px] text-zinc-400 gap-1 border-zinc-300 dark:border-zinc-800 py-0 px-1.5">
                          <Lock className="w-2.5 h-2.5" /> Staff Only
                        </Badge>
                      )}
                    </div>

                    {doc.description && (
                      <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed break-words">
                        {doc.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                      <span className="truncate max-w-[140px] sm:max-w-xs">{doc.fileName}</span>
                      <span>·</span>
                      <span>{doc.fileSize}</span>
                      <span>·</span>
                      <span>{doc.category}</span>
                      {doc.downloads !== undefined && (
                        <>
                          <span>·</span>
                          <span>{doc.downloads} downloads</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions (Full-width on mobile row, compact on desktop) */}
                <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-900 shrink-0 self-stretch md:self-center justify-end">
                  <Button
                    onClick={() => handleDownload(doc._id, doc.downloadUrl)}
                    variant="outline"
                    size="sm"
                    className="h-8 flex-1 md:flex-initial rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold gap-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </Button>

                  <Button
                    onClick={() => handleDelete(doc._id, doc.title)}
                    variant="ghost"
                    size="icon-sm"
                    className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── UPLOAD MODAL (Mobile Responsive Modal) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-5 sm:p-6 space-y-4 my-auto animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  Upload Clinical Document
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-500">
                  Select a document file to store in Convex Cloud Storage.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-xl p-4 sm:p-5 text-center hover:border-emerald-500/50 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/30 cursor-pointer transition-all space-y-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.mp3"
                  className="hidden"
                />

                <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-[#156e52] dark:text-emerald-400">
                  <Upload className="w-4 h-4" />
                </div>

                {selectedFile ? (
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5 truncate px-2">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{selectedFile.name}</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono">
                      {formatBytes(selectedFile.size)} · {selectedFile.type || "Document"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Click to choose or drag &amp; drop file
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      Supports PDF, DOCX, Assessment Forms &amp; Worksheets
                    </p>
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Document Title *</label>
                  <Input
                    required
                    placeholder="e.g. CBT Thought Record"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="rounded-xl h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs px-3 text-zinc-900 dark:text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Description / Clinical Purpose</label>
                <Textarea
                  rows={2}
                  placeholder="Clinical guidelines or usage context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl text-xs resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  Visible to Patients / Clients
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={popiaCompliant}
                    onChange={(e) => setPopiaCompliant(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  POPIA &amp; HPCSA Compliant
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-3 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  size="sm"
                  className="h-9 px-4 text-xs font-bold bg-[#156e52] hover:bg-[#0f5940] text-white shadow-xs"
                >
                  {isSubmitting ? "Uploading..." : "Save & Upload File"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
