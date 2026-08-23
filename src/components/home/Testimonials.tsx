import { Link } from "react-router";
import { ArrowRight, CheckCircle2, Star, ThumbsUp, MessageCircle } from "lucide-react";

// Official Google Multi-Color G Icon
const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

interface GoogleReview {
  id: string;
  name: string;
  avatarBg: string;
  initials: string;
  reviewerType: string;
  rating: number;
  timeAgo: string;
  service: string;
  text: string;
  helpfulCount?: number;
  ownerReply?: string;
}

const googleReviewsRow1: GoogleReview[] = [
  {
    id: "gr-1",
    name: "Lerato Mokoena",
    avatarBg: "bg-blue-600",
    initials: "LM",
    reviewerType: "Local Guide · 18 reviews",
    rating: 5,
    timeAgo: "3 days ago",
    service: "Individual Counselling",
    text: "Maletsatsi is an exceptional counselling therapist. Her warmth and empathetic presence immediately put me at ease. The practical tools I received for managing anxiety have genuinely transformed my day-to-day life. Highly recommended!",
    helpfulCount: 4,
    ownerReply: "Thank you so much Lerato! It has been an absolute honor walking alongside you on your journey to calm and emotional resilience.",
  },
  {
    id: "gr-2",
    name: "David van der Merwe",
    avatarBg: "bg-emerald-600",
    initials: "DV",
    reviewerType: "Verified Client · 3 reviews",
    rating: 5,
    timeAgo: "a week ago",
    service: "Couples & Relationship Counselling",
    text: "My partner and I were stuck in destructive communication cycles. Insight Works provided a safe, neutral space to dismantle defensiveness and understand each other again. Maletsatsi is insightful, gentle, and firm when needed.",
    helpfulCount: 7,
  },
  {
    id: "gr-3",
    name: "Nomvula Khumalo",
    avatarBg: "bg-purple-600",
    initials: "NK",
    reviewerType: "Local Guide · 32 reviews",
    rating: 5,
    timeAgo: "2 weeks ago",
    service: "Trauma Recovery & Emotional Healing",
    text: "I was carrying emotional burdens that felt impossible to process. Working with Maletsatsi allowed me to gently heal deep wounds without re-traumatizing myself. The Bryanston rooms are serene and private.",
    helpfulCount: 6,
    ownerReply: "Thank you Nomvula. Your courage throughout our sessions is truly inspiring. Wishing you continued peace and strength.",
  },
  {
    id: "gr-4",
    name: "Bongani Sithole",
    avatarBg: "bg-amber-600",
    initials: "BS",
    reviewerType: "Verified Client · 5 reviews",
    rating: 5,
    timeAgo: "3 weeks ago",
    service: "Life Coaching & Self-Mastery",
    text: "The coaching sessions gave me immense clarity. Maletsatsi challenged my limiting beliefs and helped me construct actionable boundaries and strategic career goals. The transformation in my confidence is real.",
    helpfulCount: 3,
  },
  {
    id: "gr-5",
    name: "Claire Jenkins",
    avatarBg: "bg-teal-600",
    initials: "CJ",
    reviewerType: "Verified Client · 2 reviews",
    rating: 5,
    timeAgo: "a month ago",
    service: "Telehealth Video Sessions (Cape Town)",
    text: "Living in Cape Town, I booked telehealth sessions online. The video connection was seamless and POPIA-compliant, and the depth of connection was just as impactful as in-person therapy. 5 stars all the way!",
    helpfulCount: 5,
    ownerReply: "Thank you Claire! We are delighted that our Telehealth care brings safe, confidential support wherever you are.",
  },
];

const googleReviewsRow2: GoogleReview[] = [
  {
    id: "gr-6",
    name: "Thabo & Zanele",
    avatarBg: "bg-rose-600",
    initials: "TZ",
    reviewerType: "Verified Client · 4 reviews",
    rating: 5,
    timeAgo: "a month ago",
    service: "Relationship Counselling",
    text: "Insight Works helped us save our relationship before getting married. We learned healthy conflict resolution and emotional vulnerability. We could not recommend Maletsatsi enough to any couple navigating friction.",
    helpfulCount: 8,
  },
  {
    id: "gr-7",
    name: "Anriette Pretorius",
    avatarBg: "bg-indigo-600",
    initials: "AP",
    reviewerType: "Local Guide · 45 reviews",
    rating: 5,
    timeAgo: "a month ago",
    service: "Youth & Young Adult Support",
    text: "We reached out to Maletsatsi for our 19-year-old daughter who was struggling with university transition and burnout. Maletsatsi connected with her instantly and guided her with compassion. Outstanding professional.",
    helpfulCount: 9,
    ownerReply: "Warmest thanks Anriette! Supporting young adults during formative transitions is deeply rewarding work.",
  },
  {
    id: "gr-8",
    name: "Kabelo Dlamini",
    avatarBg: "bg-orange-600",
    initials: "KD",
    reviewerType: "Verified Client · 1 review",
    rating: 5,
    timeAgo: "2 months ago",
    service: "Individual Therapy · Stress & Grief",
    text: "After losing my brother, I felt numb and unable to function at work. Maletsatsi created a sacred space to grieve without timeline pressure. I'm forever grateful for her patience and empathy.",
    helpfulCount: 11,
  },
  {
    id: "gr-9",
    name: "Michael Oosthuizen",
    avatarBg: "bg-emerald-700",
    initials: "MO",
    reviewerType: "Verified Client · 6 reviews",
    rating: 5,
    timeAgo: "2 months ago",
    service: "Substance Recovery Support",
    text: "Compassionate, non-judgmental, and deeply knowledgeable about relapse prevention and habit replacement. The holistic care at Insight Works gave me my self-respect back.",
    helpfulCount: 4,
    ownerReply: "Thank you Michael. Your dedication to your own growth and recovery is remarkable.",
  },
  {
    id: "gr-10",
    name: "Sipho & Nandi Ndlovu",
    avatarBg: "bg-blue-700",
    initials: "SN",
    reviewerType: "Local Guide · 21 reviews",
    rating: 5,
    timeAgo: "3 months ago",
    service: "Couples & Family Support",
    text: "From the very first intake call to our closing session, the professionalism was stellar. Clean booking, clear rates, and therapy that truly produces lasting healing. 10/10.",
    helpfulCount: 5,
  },
];

// Single Google Review Card
const GoogleReviewCard = ({ review }: { review: GoogleReview }) => {
  return (
    <div className="w-[340px] sm:w-[380px] shrink-0 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between select-none">
      <div>
        {/* Header: User Avatar + Name + Google G */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${review.avatarBg} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-2xs`}
            >
              {review.initials}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-[#0f2820] leading-snug">
                  {review.name}
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" title="Verified Reviewer" />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {review.reviewerType}
              </p>
            </div>
          </div>
          <GoogleIcon className="w-5 h-5 shrink-0 opacity-90" />
        </div>

        {/* Rating Stars + Time + Category Tag */}
        <div className="flex items-center gap-2 mb-2.5">
          <div className="flex text-[#fbbc04]">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            {review.timeAgo}
          </span>
        </div>

        {/* Service Tag */}
        <span className="inline-block bg-slate-100/90 text-slate-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-md mb-2.5">
          {review.service}
        </span>

        {/* Review Text */}
        <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
          {review.text}
        </p>

        {/* Owner Response Box */}
        {review.ownerReply && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 bg-emerald-50/50 rounded-xl p-2.5 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#156e52]">
              <MessageCircle className="w-3 h-3" />
              <span>Response from Insight Works (Owner)</span>
            </div>
            <p className="italic text-slate-600 leading-normal pl-4 border-l-2 border-emerald-300">
              "{review.ownerReply}"
            </p>
          </div>
        )}
      </div>

      {/* Footer / Helpful link */}
      <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 hover:text-slate-600 cursor-pointer">
          <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpfulCount || 2})
        </span>
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Google Verified
        </span>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-20 lg:py-28 relative overflow-hidden bg-slate-50/70"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200/90 px-3.5 py-1.5 rounded-full shadow-2xs mb-3">
              <GoogleIcon className="w-4 h-4" />
              <span className="text-xs font-bold text-slate-800">
                Google Verified Patient Reviews
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2820] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Real Stories of{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Healing &amp; Transformation
              </span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
              See what individuals, couples, and families across South Africa say about their therapeutic journey with Maletsatsi Sibanda.
            </p>
          </div>

          {/* Google Summary Badge */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm flex items-center gap-5 shrink-0">
            <div className="flex flex-col items-center justify-center pr-5 border-r border-slate-200">
              <div className="flex items-center gap-2">
                <GoogleIcon className="w-6 h-6" />
                <span className="text-3xl sm:text-4xl font-black text-[#0f2820] font-serif">5.0</span>
              </div>
              <div className="flex text-[#fbbc04] text-sm mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
            <div className="text-left space-y-1">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block">
                ★ EXCELLENT RATING
              </span>
              <p className="text-xs text-slate-600 font-medium">
                Based on <strong>48+ Google Reviews</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                100% Confidential &amp; Verified
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── MOVING CARDS MARQUEE CONTAINER ── */}
      <div className="relative w-full overflow-hidden space-y-5 py-2">
        {/* Left and right fade gradient overlays for smooth edge transition */}
        <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none" />

        {/* Row 1: Moving Left */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-left pause-hover flex gap-5">
            {/* Duplicate array for seamless infinite loop */}
            {[...googleReviewsRow1, ...googleReviewsRow1, ...googleReviewsRow1].map((review, idx) => (
              <GoogleReviewCard key={`${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </div>

        {/* Row 2: Moving Right */}
        <div className="flex overflow-hidden">
          <div className="animate-marquee-right pause-hover flex gap-5">
            {/* Duplicate array for seamless infinite loop */}
            {[...googleReviewsRow2, ...googleReviewsRow2, ...googleReviewsRow2].map((review, idx) => (
              <GoogleReviewCard key={`${review.id}-${idx}`} review={review} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#0f2820] via-[#156e52] to-[#0f2820] text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              Ready to begin your journey toward clarity and healing?
            </h3>
            <p className="text-emerald-100/90 text-xs sm:text-sm max-w-xl">
              Book an in-person session at our Bryanston practice or a secure Telehealth consultation nationwide.
            </p>
          </div>
          <Link
            to="/booking"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#ea7627] hover:bg-[#d96b20] text-white font-bold text-sm transition-all shadow-md shrink-0 hover:scale-105 cursor-pointer"
          >
            Book Your Session <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </section>
  );
};

export default Testimonials;

