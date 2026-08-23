import { ArrowRight, Clock, User, Mail, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const FALLBACK_POSTS = [
  {
    slug: "understanding-anxiety",
    category: "Emotional Healing",
    categoryColor: "bg-emerald-50 text-[#156e52] border-emerald-200/80",
    title: "Understanding Anxiety: Signs & When to Seek Professional Guidance",
    excerpt:
      "Anxiety is more than everyday stress. Learn to recognize the subtle physical and emotional indicators of anxiety and explore how compassionate therapeutic strategies can restore peace of mind.",
    imageUrl: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=700&h=450&fit=crop",
    author: "Maletsatsi Sibanda",
    authorAvatar: "/images/therapist-portrait.jpg",
    date: "15 Aug 2026",
    readTime: "5 min read",
  },
  {
    slug: "grounding-techniques",
    category: "Coping Skills",
    categoryColor: "bg-amber-50 text-[#ea7627] border-amber-200/80",
    title: "5 Evidence-Based Grounding Techniques for Panic and Acute Stress",
    excerpt:
      "When sensory overload strikes, these five somatic and cognitive grounding exercises help anchor your nervous system back to safety.",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=350&fit=crop",
    author: "Maletsatsi Sibanda",
    authorAvatar: "/images/therapist-portrait.jpg",
    date: "10 Aug 2026",
    readTime: "4 min read",
  },
  {
    slug: "couples-therapy-first-session",
    category: "Relationships",
    categoryColor: "bg-emerald-50 text-[#156e52] border-emerald-200/80",
    title: "Couples Counselling: What Really Happens in Your First Consultation?",
    excerpt:
      "Nervous about relationship counselling? Here is an open look at the intake framework, ground rules, and how we facilitate productive dialogue.",
    imageUrl: "https://images.unsplash.com/photo-1527628173875-3c7bfd28ad78?w=500&h=350&fit=crop",
    author: "Maletsatsi Sibanda",
    authorAvatar: "/images/therapist-portrait.jpg",
    date: "5 Aug 2026",
    readTime: "6 min read",
  },
];

const Blog = () => {
  const convexBlogs = useQuery(api.blogs.getBlogs, {});
  const displayPosts = (convexBlogs && convexBlogs.length > 0) ? convexBlogs : FALLBACK_POSTS;
  const [featured, ...rest] = displayPosts;

  if (!featured) return null;

  return (
    <section
      id="blog"
      className="py-24 lg:py-32 bg-white dark:bg-black relative overflow-hidden"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Decorative background glows */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-emerald-50/60 dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-amber-50/60 dark:bg-amber-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 px-3.5 py-1 rounded-full mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#156e52]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52] dark:text-emerald-400">
                Resources &amp; Psychoeducation
              </span>
            </div>
            <h2
              className="leading-[1.08] tracking-tight text-[#0f2820] dark:text-white"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                fontWeight: 900,
              }}
            >
              Mental Wellness{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Articles &amp; Guides
              </span>
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#156e52] dark:text-emerald-400 hover:text-[#52b74c] hover:translate-x-0.5 transition-all shrink-0 cursor-pointer"
          >
            Browse all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured + Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Featured Post Card (Col 1-7) */}
          <Link
            to={`/blog/${featured.slug}`}
            className="lg:col-span-7 group rounded-3xl bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
          >
            <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100 dark:bg-zinc-900">
              <img
                src={featured.imageUrl || (featured as any).image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/95 dark:bg-black/90 text-[#156e52] dark:text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold shadow-xs border border-emerald-200/60 dark:border-emerald-800">
                  {featured.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-zinc-500">
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#156e52] dark:group-hover:text-emerald-400 transition-colors leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {featured.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-zinc-900 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{featured.author}</span>
                <span className="text-xs font-bold text-[#156e52] dark:text-emerald-400 flex items-center gap-1">
                  Read Full Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Remaining Posts Grid (Col 8-12) */}
          <div className="lg:col-span-5 space-y-4">
            {rest.slice(0, 3).map((post: any) => (
              <Link
                key={post._id || post.slug}
                to={`/blog/${post.slug}`}
                className="group flex gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800/80 hover:border-emerald-300 dark:hover:border-zinc-700 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="h-24 w-28 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-900">
                  <img
                    src={post.imageUrl || post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#156e52] dark:text-emerald-400 uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 group-hover:text-[#156e52] dark:group-hover:text-emerald-400 line-clamp-2 leading-snug">
                      {post.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 pt-1">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Blog;
