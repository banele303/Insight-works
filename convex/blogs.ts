import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const ADMIN_EMAILS = [
  "alexsouthflow@gmail.com",
  "ramadimukondi13@gmail.com",
  "alexsouthflow2@gmail.com",
  "alxsouthflow2@gmail.com",
  "linktendpro@gmail.com",
];

// Helper: check if caller is an authorized Admin or Practitioner
async function verifyAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Unauthorized: Please sign in");

  const user = await ctx.db.get(userId);
  const isAdminEmail = Boolean(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));
  const isPrivileged = isAdminEmail || user?.role === "admin" || user?.role === "teacher";

  if (!isPrivileged) {
    throw new Error("Unauthorized: Admin or Practitioner privilege required");
  }
  return { userId, user };
}

// ─── 1. PUBLIC QUERIES ────────────────────────────────────────────────────────

// Get all published blog posts
export const getBlogs = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let blogQuery = ctx.db
      .query("blogs")
      .withIndex("by_published", (q) => q.eq("published", true));

    const blogs = await blogQuery.collect();

    // Map storage URLs for uploaded cover images
    const resolved = await Promise.all(
      blogs.map(async (b) => {
        let imageUrl = b.coverImage;
        if (b.coverStorageId) {
          const storageUrl = await ctx.storage.getUrl(b.coverStorageId);
          if (storageUrl) imageUrl = storageUrl;
        }
        return {
          ...b,
          imageUrl: imageUrl || b.coverImage || "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=700&h=450&fit=crop",
        };
      })
    );

    if (args.category && args.category !== "All") {
      return resolved.filter((b) => b.category.toLowerCase() === args.category!.toLowerCase());
    }

    return resolved.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  },
});

// Get a single blog post by slug
export const getBlogBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!blog) return null;

    let imageUrl = blog.coverImage;
    if (blog.coverStorageId) {
      const storageUrl = await ctx.storage.getUrl(blog.coverStorageId);
      if (storageUrl) imageUrl = storageUrl;
    }

    return {
      ...blog,
      imageUrl: imageUrl || blog.coverImage || "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=700&h=450&fit=crop",
    };
  },
});

// Increment post views
export const incrementViews = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post) {
      await ctx.db.patch(args.id, { views: (post.views || 0) + 1 });
    }
  },
});

// ─── 2. ADMIN MUTATIONS & QUERIES ─────────────────────────────────────────────

// Get all blogs for Admin (drafts + published)
export const getAdminBlogs = query({
  args: {},
  handler: async (ctx) => {
    await verifyAdmin(ctx);
    const blogs = await ctx.db.query("blogs").collect();

    return await Promise.all(
      blogs.map(async (b) => {
        let imageUrl = b.coverImage;
        if (b.coverStorageId) {
          const storageUrl = await ctx.storage.getUrl(b.coverStorageId);
          if (storageUrl) imageUrl = storageUrl;
        }
        return {
          ...b,
          imageUrl: imageUrl || b.coverImage,
        };
      })
    );
  },
});

// Generate upload URL for Convex Storage (images)
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await verifyAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

// Create Blog Post
export const createBlog = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    category: v.string(),
    categoryColor: v.optional(v.string()),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    coverStorageId: v.optional(v.id("_storage")),
    author: v.optional(v.string()),
    authorAvatar: v.optional(v.string()),
    authorRole: v.optional(v.string()),
    date: v.optional(v.string()),
    readTime: v.optional(v.string()),
    published: v.boolean(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { user } = await verifyAdmin(ctx);

    const slug = args.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const existing = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existing) {
      throw new Error(`A blog post with slug "${slug}" already exists.`);
    }

    const now = Date.now();
    const formattedDate = args.date || new Date().toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const blogId = await ctx.db.insert("blogs", {
      title: args.title,
      slug,
      category: args.category,
      categoryColor: args.categoryColor || "bg-emerald-50 text-[#156e52] border-emerald-200",
      excerpt: args.excerpt,
      content: args.content,
      coverImage: args.coverImage,
      coverStorageId: args.coverStorageId,
      author: args.author || user.name || "Maletsatsi Sibanda",
      authorAvatar: args.authorAvatar || "/images/therapist-portrait.jpg",
      authorRole: args.authorRole || "Counselling Therapist & Life Coach",
      date: formattedDate,
      readTime: args.readTime || "5 min read",
      published: args.published,
      views: 0,
      tags: args.tags || [],
      createdAt: now,
      updatedAt: now,
    });

    return blogId;
  },
});

// Update Blog Post
export const updateBlog = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    category: v.optional(v.string()),
    categoryColor: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    coverStorageId: v.optional(v.id("_storage")),
    author: v.optional(v.string()),
    authorRole: v.optional(v.string()),
    published: v.optional(v.boolean()),
    readTime: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);
    const { id, ...updates } = args;

    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Blog post not found");

    if (updates.slug && updates.slug !== existing.slug) {
      const slug = updates.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
      const duplicate = await ctx.db
        .query("blogs")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (duplicate && duplicate._id !== id) {
        throw new Error(`Slug "${slug}" is already in use.`);
      }
      updates.slug = slug;
    }

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete Blog Post
export const deleteBlog = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    await verifyAdmin(ctx);
    const post = await ctx.db.get(args.id);
    if (post?.coverStorageId) {
      try {
        await ctx.storage.delete(post.coverStorageId);
      } catch { /* noop */ }
    }
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Seed Initial Clinical Articles
export const seedInitialBlogs = mutation({
  args: {},
  handler: async (ctx) => {
    const initialPosts = [
      {
        slug: "understanding-anxiety",
        category: "Emotional Healing",
        categoryColor: "bg-emerald-50 text-[#156e52] border-emerald-200/80",
        title: "Understanding Anxiety: When Normal Worry Becomes Overwhelming",
        excerpt:
          "Anxiety is more than everyday stress. Learn to recognize the subtle physical and emotional indicators of anxiety and explore how compassionate therapeutic strategies can restore peace of mind.",
        content: `### Recognizing The Warning Signs of Chronic Anxiety

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

Healing from chronic anxiety is not about eliminating all stress; it is about building somatic safety and self-compassion. In therapy, we combine cognitive reframing with nervous system regulation—helping you disarm catastrophic thought loops and inhabit your present moment with calm confidence.`,
        coverImage: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=700&h=450&fit=crop",
        author: "Maletsatsi Sibanda",
        authorAvatar: "/images/therapist-portrait.jpg",
        authorRole: "Counselling Therapist & Life Coach",
        date: "15 Aug 2026",
        readTime: "6 min read",
        published: true,
        views: 142,
        tags: ["Anxiety", "Mental Health", "Somatic Healing", "Coping Tools"],
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now() - 86400000 * 5,
      },
      {
        slug: "grounding-techniques",
        category: "Coping Skills",
        categoryColor: "bg-amber-50 text-[#ea7627] border-amber-200/80",
        title: "5 Evidence-Based Grounding Techniques for Panic and Acute Stress",
        excerpt:
          "When sensory overload strikes, these five somatic and cognitive grounding exercises help anchor your nervous system back to safety.",
        content: `### Reclaiming Your Equilibrium in Moments of Overwhelm

When acute panic or sensory overload hijacks your nervous system, intellectualizing your feelings is almost impossible. What you need are rapid, bodily anchors that signal safety to your amygdala.

#### 1. The 5-4-3-2-1 Sensory Reset
* **5 Things You Can See:** Notice subtle details in your immediate visual field
* **4 Things You Can Touch:** Feel texture—fabric, your desk, cold water
* **3 Things You Can Hear:** Distant traffic, birds, air conditioning
* **2 Things You Can Smell:** Essential oils, fresh coffee, or fresh air
* **1 Thing You Can Taste:** A sip of cold water or mint

#### 2. Physiological Sigh Breathing
Two quick inhalations through the nose followed by one long, audible exhalation through the mouth. Performing this 3–5 times immediately slows cardiac tempo.`,
        coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&h=350&fit=crop",
        author: "Maletsatsi Sibanda",
        authorAvatar: "/images/therapist-portrait.jpg",
        authorRole: "Counselling Therapist & Life Coach",
        date: "10 Aug 2026",
        readTime: "4 min read",
        published: true,
        views: 98,
        tags: ["Panic", "Grounding", "Stress Relief"],
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now() - 86400000 * 10,
      },
      {
        slug: "couples-therapy-first-session",
        category: "Relationships",
        categoryColor: "bg-emerald-50 text-[#156e52] border-emerald-200/80",
        title: "Couples Counselling: What Really Happens in Your First Consultation?",
        excerpt:
          "Nervous about relationship counselling? Here is an open look at the intake framework, ground rules, and how we facilitate productive dialogue.",
        content: `### Demystifying The First Couples Session

Many partners dread entering couples counselling because they fear being blamed, ganged up on, or forced into awkward vulnerability. At Insight Works, the goal of couples therapy is never to choose a winner or assign fault—it is to examine the interactive dance between you both.

#### What We Cover in Session One:
1. **Safety & Ground Rules:** Establishing that both voices receive equal presence and respect.
2. **Relational History & Attachment Dynamics:** Understanding when and how the emotional disconnect began.
3. **De-escalation Tools:** Practical protocols for pausing destructive arguments before they inflict lasting damage.`,
        coverImage: "https://images.unsplash.com/photo-1527628173875-3c7bfd28ad78?w=500&h=350&fit=crop",
        author: "Maletsatsi Sibanda",
        authorAvatar: "/images/therapist-portrait.jpg",
        authorRole: "Counselling Therapist & Life Coach",
        date: "5 Aug 2026",
        readTime: "6 min read",
        published: true,
        views: 112,
        tags: ["Couples", "Relationships", "Communication"],
        createdAt: Date.now() - 86400000 * 15,
        updatedAt: Date.now() - 86400000 * 15,
      },
    ];

    for (const post of initialPosts) {
      const existingPost = await ctx.db
        .query("blogs")
        .withIndex("by_slug", (q) => q.eq("slug", post.slug))
        .first();

      if (existingPost) {
        await ctx.db.patch(existingPost._id, {
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          tags: post.tags,
          category: post.category,
        });
      } else {
        await ctx.db.insert("blogs", post);
      }
    }

    return { success: true, count: initialPosts.length };
  },
});
