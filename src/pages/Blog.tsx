import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Link } from "react-router";
import {
  Calendar, Clock, User, ArrowRight, Search, Sparkles,
  BookOpen, Eye, Tag, Heart, ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  "All",
  "Emotional Healing",
  "Relationships",
  "Life Coaching",
  "Trauma Recovery",
  "Coping Skills",
  "Youth Support",
  "Substance Use",
];

// Fallback articles in case backend is empty
const FALLBACK_BLOGS: any[] = [];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const convexBlogs = useQuery(api.blogs.getBlogs, {
    category: selectedCategory === "All" ? undefined : selectedCategory,
  });

  const posts = (convexBlogs && convexBlogs.length > 0) ? convexBlogs : (selectedCategory === "All" ? FALLBACK_BLOGS : FALLBACK_BLOGS.filter(b => b.category.toLowerCase() === selectedCategory.toLowerCase()));

  const filteredPosts = posts.filter((p: any) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black text-slate-900 dark:text-zinc-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-24">
        {/* ── HERO HEADER ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-4 py-1.5 rounded-full text-xs font-bold text-[#156e52] dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> Clinical Sanctuary &amp; Guidance Hub
            </div>
            
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Therapeutic Insights &amp; Coping Wisdom
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Empowering articles, evidence-based coping exercises, and relationship insights crafted by qualified therapists to support your personal growth.
            </p>

            {/* Search & Category Filter */}
            <div className="pt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by topic, keyword, or symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#156e52] text-white shadow-xs"
                      : "bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-emerald-500/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── POSTS CONTAINER ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-950 p-8">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">No matching articles found</h3>
              <p className="text-xs text-slate-500 mt-1">Try searching for a different keyword or select "All".</p>
            </div>
          ) : (
            <>
              {/* Featured Post Card */}
              {featuredPost && (
                <div className="relative rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-7 h-64 sm:h-80 lg:h-full relative overflow-hidden bg-slate-100 dark:bg-zinc-900">
                      <img
                        src={featuredPost.imageUrl}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/95 dark:bg-black/90 text-[#156e52] dark:text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold shadow-xs border border-emerald-200/60 dark:border-emerald-800/60 backdrop-blur-md">
                          {featuredPost.category}
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#156e52]" /> {featuredPost.date}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
                          </span>
                        </div>

                        <h2
                          className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-[#156e52] dark:group-hover:text-emerald-400 transition-colors leading-tight"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {featuredPost.title}
                        </h2>

                        <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src="/images/therapist-portrait.jpg"
                            alt={featuredPost.author}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-zinc-700"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{featuredPost.author}</p>
                            <p className="text-[10px] text-slate-500 dark:text-zinc-400">{featuredPost.authorRole || "Counselling Therapist"}</p>
                          </div>
                        </div>

                        <Link
                          to={`/blog/${featuredPost.slug}`}
                          className="inline-flex items-center gap-2 bg-[#156e52] hover:bg-[#0f5940] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                        >
                          Read Article <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Remaining Posts */}
              {remainingPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingPosts.map((post: any) => (
                    <article
                      key={post._id || post.slug}
                      className="group flex flex-col rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs hover:shadow-md transition-all"
                    >
                      <div className="relative h-48 w-full bg-slate-100 dark:bg-zinc-900 overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/95 dark:bg-black/90 text-[#156e52] dark:text-emerald-400 px-3 py-0.5 rounded-full text-[11px] font-bold shadow-xs border border-emerald-200/60 dark:border-emerald-800/60 backdrop-blur-md">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2.5 text-[11px] text-slate-400 dark:text-zinc-500">
                            <span>{post.date}</span>
                            <span>·</span>
                            <span>{post.readTime}</span>
                          </div>

                          <h3
                            className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#156e52] dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                          >
                            {post.title}
                          </h3>

                          <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                            {post.author}
                          </span>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="text-xs font-bold text-[#156e52] dark:text-emerald-400 hover:underline flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                          >
                            Read Full <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* ── CLINICAL NEWSLETTER & DISCOVERY CTA ── */}
        <section className="max-w-5xl mx-auto px-4 mt-20">
          <div className="rounded-3xl bg-gradient-to-br from-[#0f2820] to-[#156e52] p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Ready to Begin Your Healing Journey?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
              Book a confidential 50-minute individual or couples counselling session with Maletsatsi Sibanda. Online and in-person sessions available.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/booking"
                className="bg-white text-[#0f2820] hover:bg-emerald-50 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all transform hover:scale-[1.02]"
              >
                Book Your Session Now
              </Link>
              <Link
                to="/services"
                className="bg-emerald-800/60 hover:bg-emerald-800 text-white border border-emerald-600/60 px-6 py-3 rounded-xl font-bold text-sm transition-all"
              >
                Explore All 7 Disciplines
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
