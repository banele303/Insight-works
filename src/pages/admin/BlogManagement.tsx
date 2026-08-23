import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  BookOpen, Plus, Trash2, Edit3, Eye, Calendar, Clock,
  Upload, Sparkles, Check, X, Search, FileText, Image as ImageIcon, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router";
import type { Id } from "../../../convex/_generated/dataModel";

const CATEGORIES = [
  "Emotional Healing",
  "Relationships",
  "Life Coaching",
  "Trauma Recovery",
  "Coping Skills",
  "Youth Support",
  "Substance Use",
  "Mindfulness",
];

export default function BlogManagement() {
  const blogs = useQuery(api.blogs.getAdminBlogs) || [];
  const createBlogMutation = useMutation(api.blogs.createBlog);
  const updateBlogMutation = useMutation(api.blogs.updateBlog);
  const deleteBlogMutation = useMutation(api.blogs.deleteBlog);
  const seedBlogsMutation = useMutation(api.blogs.seedInitialBlogs);
  const generateUploadUrl = useMutation(api.blogs.generateUploadUrl);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<Id<"blogs"> | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverStorageId, setCoverStorageId] = useState<Id<"_storage"> | undefined>(undefined);
  const [author, setAuthor] = useState("Maletsatsi Sibanda");
  const [authorRole, setAuthorRole] = useState("Counselling Therapist & Life Coach");
  const [readTime, setReadTime] = useState("5 min read");
  const [published, setPublished] = useState(true);
  const [tagsInput, setTagsInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editingBlogId) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();
      setCoverStorageId(storageId);
      setCoverImageUrl(URL.createObjectURL(file));
      toast.success("Cover image uploaded to Convex storage successfully!");
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image. You can also paste an image URL.");
    } finally {
      setIsUploading(false);
    }
  };

  const openCreateModal = () => {
    setEditingBlogId(null);
    setTitle("");
    setSlug("");
    setCategory(CATEGORIES[0]);
    setExcerpt("");
    setContent("");
    setCoverImageUrl("");
    setCoverStorageId(undefined);
    setAuthor("Maletsatsi Sibanda");
    setAuthorRole("Counselling Therapist & Life Coach");
    setReadTime("5 min read");
    setPublished(true);
    setTagsInput("Therapy, Healing, Mental Health");
    setIsModalOpen(true);
  };

  const openEditModal = (blog: any) => {
    setEditingBlogId(blog._id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setCategory(blog.category);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setCoverImageUrl(blog.imageUrl || blog.coverImage || "");
    setCoverStorageId(blog.coverStorageId);
    setAuthor(blog.author);
    setAuthorRole(blog.authorRole || "Counselling Therapist & Life Coach");
    setReadTime(blog.readTime || "5 min read");
    setPublished(blog.published);
    setTagsInput((blog.tags || []).join(", "));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim()) {
      toast.error("Please fill in Title, Slug, Excerpt, and Content.");
      return;
    }

    try {
      setIsSubmitting(true);
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

      if (editingBlogId) {
        await updateBlogMutation({
          id: editingBlogId,
          title,
          slug,
          category,
          excerpt,
          content,
          coverImage: coverImageUrl || undefined,
          coverStorageId,
          author,
          authorRole,
          readTime,
          published,
          tags,
        });
        toast.success("Blog post updated successfully!");
      } else {
        await createBlogMutation({
          title,
          slug,
          category,
          excerpt,
          content,
          coverImage: coverImageUrl || undefined,
          coverStorageId,
          author,
          authorRole,
          readTime,
          published,
          tags,
        });
        toast.success("New blog article published to live portal!");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: Id<"blogs">, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteBlogMutation({ id });
        toast.success("Article deleted successfully.");
      } catch (err: any) {
        toast.error("Failed to delete article.");
      }
    }
  };

  const handleSeed = async () => {
    try {
      const res = await seedBlogsMutation();
      toast.success(res.message || `Seeded ${res.count} articles!`);
    } catch (err) {
      toast.error("Could not seed blogs.");
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <BookOpen className="w-4 h-4" /> Practice Publications
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Blog &amp; Clinical Insights Management
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create, edit, and publish clinical thought leadership articles stored natively on Convex.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={openCreateModal}
            className="bg-[#156e52] hover:bg-[#0f5940] text-white gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Article
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Search articles by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === "All"
                ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
            }`}
          >
            All Categories ({blogs.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = blogs.filter((b) => b.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-8 bg-zinc-50/50 dark:bg-zinc-950/40">
          <BookOpen className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No blog articles found</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
            Get started by creating a new publication.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Button onClick={openCreateModal} size="sm" className="bg-[#156e52] hover:bg-[#0f5940] text-white">
              Create First Post
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((b) => (
            <div
              key={b._id}
              className="group flex flex-col rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-xs hover:shadow-md transition-all"
            >
              {/* Cover Image */}
              <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                {b.imageUrl ? (
                  <img
                    src={b.imageUrl}
                    alt={b.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <Badge className="bg-white/95 dark:bg-zinc-900/95 text-zinc-800 dark:text-zinc-200 backdrop-blur-md text-[10px] font-bold border border-zinc-200 dark:border-zinc-700">
                    {b.category}
                  </Badge>
                  {!b.published && (
                    <Badge variant="destructive" className="text-[10px]">
                      Draft
                    </Badge>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-600" /> {b.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {b.readTime || "5 min"}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {b.views || 0} views
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {b.excerpt}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                  <Link
                    to={`/blog/${b.slug}`}
                    target="_blank"
                    className="text-xs font-semibold text-zinc-500 hover:text-emerald-600 flex items-center gap-1"
                  >
                    Preview <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => openEditModal(b)}
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(b._id, b.title)}
                      variant="ghost"
                      size="icon-sm"
                      className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                  {editingBlogId ? "Edit Blog Article" : "Create New Blog Article"}
                </h2>
                <p className="text-xs text-zinc-500">
                  Fill in article details. Images are automatically saved to Convex cloud storage.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Article Title *</label>
                  <Input
                    required
                    placeholder="e.g. Somatic Grounding Tools for Acute Stress"
                    value={title}
                    onChange={handleTitleChange}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">URL Slug *</label>
                  <Input
                    required
                    placeholder="e.g. somatic-grounding-tools"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              {/* Category & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Category *</label>
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
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Author</label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Read Time</label>
                  <Input
                    placeholder="e.g. 5 min read"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Cover Image (Convex Storage or External URL)
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto gap-2 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {isUploading ? "Uploading to Convex..." : "Upload Local Image"}
                  </Button>

                  <span className="text-xs text-zinc-400">or paste URL:</span>

                  <Input
                    placeholder="https://images.unsplash.com/..."
                    value={coverImageUrl}
                    onChange={(e) => {
                      setCoverImageUrl(e.target.value);
                      setCoverStorageId(undefined);
                    }}
                    className="flex-1 rounded-xl text-xs bg-white dark:bg-zinc-950"
                  />
                </div>

                {coverImageUrl && (
                  <div className="mt-2 relative h-28 w-44 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Summary / Excerpt *</label>
                <Textarea
                  required
                  rows={2}
                  placeholder="A concise 2-sentence summary that appears on blog cards and search engines..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>

              {/* Full Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Article Content (Markdown supported) *</label>
                <Textarea
                  required
                  rows={9}
                  placeholder="Write the full publication content here. Use ### for subheadings, * for bullet points, etc."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="rounded-xl font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Tags & Published Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Tags (comma separated)</label>
                  <Input
                    placeholder="Anxiety, Healing, Relationships"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    Publish immediately to live portal
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#156e52] hover:bg-[#0f5940] text-white shadow-xs"
                >
                  {isSubmitting ? "Saving Article..." : editingBlogId ? "Save Changes" : "Publish Article"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
