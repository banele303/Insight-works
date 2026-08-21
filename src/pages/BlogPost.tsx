import { useEffect } from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { Link, useParams } from 'react-router';
import {
  Calendar, Clock, User, Facebook, Twitter, Linkedin,
  ArrowRight, Bookmark, Share2, Sparkles, CheckCircle2, ChevronLeft, Eye
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const blog = useQuery(api.blogs.getBlogBySlug, { slug: slug || "" });
  const incrementViewsMutation = useMutation(api.blogs.incrementViews);

  useEffect(() => {
    if (blog?._id) {
      incrementViewsMutation({ id: blog._id }).catch(() => {});
    }
  }, [blog?._id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Article link copied to clipboard!");
  };

  // Fallback defaults if loading or not found
  const title = blog?.title || "Understanding Anxiety: When Normal Worry Becomes Overwhelming";
  const category = blog?.category || "Emotional Healing";
  const author = blog?.author || "Maletsatsi Sibanda";
  const authorRole = blog?.authorRole || "Counselling Therapist & Life Coach";
  const authorAvatar = blog?.authorAvatar || "/images/therapist-portrait.jpg";
  const date = blog?.date || "15 Aug 2026";
  const readTime = blog?.readTime || "6 min read";
  const coverImage = blog?.imageUrl || "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=1200&h=600&fit=crop";
  const content = blog?.content || `### Recognizing The Warning Signs of Chronic Anxiety

Anxiety is an evolutionary alarm system designed to protect us from immediate physical danger. In our high-velocity, modern environment, however, this alarm system often gets stuck in the "ON" position—reacting to financial obligations, relationship strain, career deadlines, and unexpressed emotional burdens as if they were imminent physical threats.

#### 1. Somatic & Physical Indicators
When anxiety becomes clinical, the body manifests the struggle before the conscious mind acknowledges it:
* Persistent muscle tension across the neck, shoulders, and jaw
* Unexplained gastrointestinal distress and shallow chest breathing
* Sleep onset insomnia and frequent nocturnal awakenings with rapid heart rate
* Hyper-vigilance and acute sensory exhaustion

#### 2. Cognitive Distortions & Thought Spirals
* **Catastrophizing:** Automatically assuming the absolute worst-case outcome
* **Mind Reading:** Believing you know what others think without evidence
* **All-or-Nothing Thinking:** Viewing setbacks as complete failures

### Restoring Nervous System Equilibrium

Healing from chronic anxiety is not about eliminating all stress; it is about building somatic safety and self-compassion. In therapy, we combine cognitive reframing with nervous system regulation—helping you disarm catastrophic thought loops and inhabit your present moment with calm confidence.`;

  return (
    <div className="min-h-screen bg-white text-[#0f172a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      
      <main className="pt-28 sm:pt-36 pb-24">
        <article className="container mx-auto px-4 max-w-5xl">
          
          {/* Breadcrumb Back */}
          <div className="mb-6 max-w-4xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#156e52] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to All Articles
            </Link>
          </div>

          {/* ── BREADCRUMB & HEADER ── */}
          <header className="mb-10 max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#156e52]">
              <Sparkles className="w-3.5 h-3.5" />
              {category}
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0f2820] leading-[1.15]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#64748b] pt-2">
              <div className="flex items-center gap-2">
                <img
                  src={authorAvatar}
                  alt={author}
                  className="w-7 h-7 rounded-full object-cover object-top border border-slate-200"
                />
                <span className="font-bold text-[#0f2820]">{author}</span>
                <span className="text-slate-400">({authorRole})</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-[#156e52]" />
                <span>{date}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#156e52]" />
                <span>{readTime}</span>
              </div>
              {blog?.views !== undefined && (
                <>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <Eye size={14} className="text-[#156e52]" />
                    <span>{blog.views} views</span>
                  </div>
                </>
              )}
            </div>
          </header>

          {/* ── FEATURED IMAGE ── */}
          <div className="rounded-3xl overflow-hidden mb-12 h-[340px] sm:h-[460px] border border-slate-200 shadow-md relative group">
            <img 
              src={coverImage} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
          </div>

          {/* ── 2-COLUMN ARTICLE LAYOUT ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Main Article Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6 text-[#334155] text-base leading-relaxed">
              
              {blog?.excerpt && (
                <p className="text-lg text-[#1e293b] font-medium leading-relaxed bg-emerald-50/40 p-5 rounded-2xl border border-emerald-100">
                  {blog.excerpt}
                </p>
              )}

              {/* Formatted Article Body */}
              <div className="space-y-5">
                {(() => {
                  const renderInline = (text: string) => {
                    // Match **bold** tokens
                    const parts = text.split(/(\*\*.*?\*\*)/g);
                    return parts.map((part, i) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={i} className="font-bold text-[#0f2820] dark:text-white">
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    });
                  };

                  // Normalize double newlines and parse blocks
                  const blocks = content.split(/\n\s*\n/);

                  return blocks.map((block, idx) => {
                    const trimmed = block.trim();
                    if (!trimmed) return null;

                    const lines = trimmed.split("\n");

                    // Check if block contains headings + list items mixed
                    if (lines.length > 1) {
                      return (
                        <div key={idx} className="space-y-3 my-4">
                          {lines.map((line, lineIdx) => {
                            const trimmedLine = line.trim();
                            if (trimmedLine.startsWith("### ")) {
                              return (
                                <h3
                                  key={lineIdx}
                                  className="text-2xl font-bold text-[#0f2820] dark:text-white pt-3 font-serif"
                                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                >
                                  {trimmedLine.replace("### ", "")}
                                </h3>
                              );
                            }
                            if (trimmedLine.startsWith("#### ")) {
                              return (
                                <h4
                                  key={lineIdx}
                                  className="text-lg font-bold text-[#0f2820] dark:text-emerald-400 pt-2 font-serif"
                                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                >
                                  {trimmedLine.replace("#### ", "")}
                                </h4>
                              );
                            }
                            if (/^\d+\.\s+/.test(trimmedLine)) {
                              const numMatch = trimmedLine.match(/^(\d+)\.\s+(.*)/);
                              const num = numMatch ? numMatch[1] : "";
                              const text = numMatch ? numMatch[2] : trimmedLine;
                              return (
                                <div key={lineIdx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80">
                                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#156e52] dark:text-emerald-400 text-xs font-bold shrink-0 mt-0.5">
                                    {num}
                                  </span>
                                  <div className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                                    {renderInline(text)}
                                  </div>
                                </div>
                              );
                            }
                            if (trimmedLine.startsWith("* ") || trimmedLine.startsWith("- ")) {
                              const text = trimmedLine.replace(/^[\*\-]\s+/, "");
                              return (
                                <div key={lineIdx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-zinc-300">
                                  <CheckCircle2 className="w-4 h-4 text-[#156e52] dark:text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{renderInline(text)}</span>
                                </div>
                              );
                            }
                            return (
                              <p key={lineIdx} className="text-slate-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
                                {renderInline(trimmedLine)}
                              </p>
                            );
                          })}
                        </div>
                      );
                    }

                    // Single-line block
                    if (trimmed.startsWith("### ")) {
                      return (
                        <h3
                          key={idx}
                          className="text-2xl font-bold text-[#0f2820] dark:text-white pt-4 font-serif"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {trimmed.replace("### ", "")}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith("#### ")) {
                      return (
                        <h4
                          key={idx}
                          className="text-lg font-bold text-[#0f2820] dark:text-emerald-400 pt-2 font-serif"
                          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                          {trimmed.replace("#### ", "")}
                        </h4>
                      );
                    }
                    if (/^\d+\.\s+/.test(trimmed)) {
                      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
                      const num = numMatch ? numMatch[1] : "";
                      const text = numMatch ? numMatch[2] : trimmed;
                      return (
                        <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 my-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#156e52] dark:text-emerald-400 text-xs font-bold shrink-0 mt-0.5">
                            {num}
                          </span>
                          <div className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                            {renderInline(text)}
                          </div>
                        </div>
                      );
                    }
                    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                      const text = trimmed.replace(/^[\*\-]\s+/, "");
                      return (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-zinc-300 my-1">
                          <CheckCircle2 className="w-4 h-4 text-[#156e52] dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{renderInline(text)}</span>
                        </div>
                      );
                    }

                    return (
                      <p key={idx} className="text-slate-700 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
                        {renderInline(trimmed)}
                      </p>
                    );
                  });
                })()}
              </div>

              {/* Bottom In-Article CTA */}
              <div className="mt-12 bg-gradient-to-br from-emerald-950 to-[#156e52] text-white rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-4">
                <h3 className="text-2xl sm:text-3xl font-serif font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Take the First Step Toward Inner Peace
                </h3>
                <p className="text-emerald-100 text-sm sm:text-base max-w-lg mx-auto">
                  You do not have to navigate emotional fatigue or relationship transitions alone. Private online and in-person sessions available.
                </p>
                <div className="pt-2">
                  <Link
                    to="/booking"
                    className="inline-flex items-center gap-2 bg-white text-[#0f2820] hover:bg-emerald-50 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105"
                  >
                    Book a Confidential Consultation <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

            </div>

            {/* Right Sidebar Column (4 cols) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Share Card */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#0f2820] flex items-center gap-2">
                  <Share2 size={16} className="text-[#156e52]" /> Share This Article
                </h3>
                <div className="flex gap-2.5">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Bookmark size={14} /> Copy Link
                  </button>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#156e52] hover:text-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all"
                  >
                    <Twitter size={15} />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#156e52] hover:text-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all"
                  >
                    <Linkedin size={15} />
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-[#156e52] hover:text-white border border-slate-200 flex items-center justify-center text-slate-600 transition-all"
                  >
                    <Facebook size={15} />
                  </a>
                </div>
              </div>

              {/* Author Profile Card */}
              <div className="bg-[#fbfdfc] border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={authorAvatar}
                    alt={author}
                    className="w-14 h-14 rounded-2xl object-cover object-top border border-slate-200 shadow-2xs"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-[#0f2820] font-serif">{author}</h4>
                    <p className="text-[11px] text-[#156e52] font-bold uppercase tracking-wider">{authorRole}</p>
                    <p className="text-[10px] text-[#64748b]">Insight Works Practice</p>
                  </div>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Specializes in individual counselling, couples and relationship guidance, trauma recovery, and personal growth &amp; self-mastery.
                </p>
                <Link
                  to="/booking"
                  className="inline-block text-xs font-bold text-[#156e52] hover:text-[#52b74c] transition-colors cursor-pointer"
                >
                  Book with {author.split(" ")[0]} →
                </Link>
              </div>

              {/* Related Disciplines */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-[#0f2820] border-b border-slate-100 pb-3">
                  Therapy Disciplines
                </h3>
                
                <div className="space-y-3">
                  {[
                    { title: "Individual Counselling", rate: "R650 – R850", href: "/services#individual-counselling" },
                    { title: "Couples & Relationships", rate: "R850 – R1,100", href: "/services#couples-relationships" },
                    { title: "Life Coaching & Self-Mastery", rate: "R600 – R800", href: "/services#life-coaching" },
                    { title: "Trauma Recovery & EMDR", rate: "R750 – R950", href: "/services#trauma-recovery" },
                  ].map((disc, i) => (
                    <Link
                      key={i}
                      to={disc.href}
                      className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/60 transition-colors"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-[#0f2820] group-hover:text-[#156e52]">
                          {disc.title}
                        </h4>
                        <p className="text-[10px] text-slate-400">{disc.rate}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#156e52] group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </article>
      </main>
      
      <Footer />
    </div>
  );
}
