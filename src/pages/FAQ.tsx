import { useState, useMemo } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { ChevronDown, MessageCircleQuestion, Search, ArrowRight, PhoneCall, Mail } from "lucide-react";
import { Link } from "react-router";

const categories = [
  "All Questions",
  "Confidentiality & Privacy",
  "Sessions & Booking",
  "Fees & Medical Aid",
  "Telehealth & Technology",
  "First Session Expectations",
];

const faqs = [
  {
    category: "Confidentiality & Privacy",
    q: "Is everything I share in therapy strictly confidential?",
    a: "Yes. Absolute confidentiality is maintained in full accordance with HPCSA professional rules and the South African Protection of Personal Information Act (POPIA). Your personal disclosures and session records will never be released without your written consent.",
  },
  {
    category: "Confidentiality & Privacy",
    q: "Are there any legal exceptions to confidentiality?",
    a: "Yes. In accordance with South African law, therapists are legally required to breach confidentiality if there is an imminent risk of severe harm to yourself or someone else, or in cases of suspected child or vulnerable adult abuse.",
  },
  {
    category: "Confidentiality & Privacy",
    q: "How secure are remote telehealth video sessions?",
    a: "We utilize end-to-end encrypted, POPIA and HIPAA-compliant video software. Video calls are never recorded, and data packets are protected with AES-256 bit encryption.",
  },
  {
    category: "Sessions & Booking",
    q: "How do I schedule an appointment?",
    a: "You can book directly via our online Booking portal in just 2 minutes. Choose your preferred clinician, select an open time slot, and receive immediate calendar confirmation.",
  },
  {
    category: "Sessions & Booking",
    q: "What is your cancellation and rescheduling policy?",
    a: "We request a minimum of 24 hours' notice for any cancellation or rescheduling. This allows us to offer the reserved time slot to waiting clients.",
  },
  {
    category: "Sessions & Booking",
    q: "How long does a typical therapy session last?",
    a: "Standard individual and life coaching sessions are 50 minutes. Couples therapy sessions are typically 60 to 75 minutes, and group therapy sessions are 90 minutes.",
  },
  {
    category: "Fees & Medical Aid",
    q: "What are your session fees?",
    a: "Our private session fees range from R650 to R850 for individual therapy, R850 to R1,100 for couples therapy, and R350 for group therapy. Full fee schedules are detailed during intake.",
  },
  {
    category: "Fees & Medical Aid",
    q: "Do you accept Medical Aid claims?",
    a: "Yes. We submit claims directly to most South African medical aids (Discovery, Momentum, Bonitas, Medshield, GEMS, etc.) or provide itemized statements with ICD-10 diagnostic codes for reimbursement.",
  },
  {
    category: "Fees & Medical Aid",
    q: "What payment methods are supported?",
    a: "We accept secure credit/debit cards and Instant EFT via PayFast, as well as direct EFT transfers and medical aid allocations.",
  },
  {
    category: "Telehealth & Technology",
    q: "What equipment do I need for an online session?",
    a: "You need a laptop, tablet, or smartphone with a working camera, microphone, and a stable internet connection. We recommend wearing headphones in a private room.",
  },
  {
    category: "Telehealth & Technology",
    q: "Can I receive therapy if I live outside Johannesburg or abroad?",
    a: "Yes! Our psychologists are licensed to provide telehealth care across all nine provinces in South Africa and to South African expatriates living internationally.",
  },
  {
    category: "First Session Expectations",
    q: "What happens during the initial therapy consultation?",
    a: "The first session is a relaxed, supportive intake assessment. Your clinician will learn about your background, understand what prompted you to reach out, and collaborate on a comfortable treatment plan.",
  },
  {
    category: "First Session Expectations",
    q: "Do I need a doctor's referral to begin therapy?",
    a: "No GP referral is required. You are welcome to book directly as a self-referral.",
  },
];

const FAQ = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "All Questions" || faq.category === selectedCategory;
      const matchesSearch =
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-white min-h-screen text-[#0f2820]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* ── HEADER ── */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#156e52] text-xs font-bold uppercase tracking-widest">
              <MessageCircleQuestion className="w-3.5 h-3.5 text-[#156e52]" />
              Help & Information Center
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2820]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Frequently Asked{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Questions
              </span>
            </h1>
            <p className="text-[#475569] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Transparent answers regarding our counselling and coaching modalities, session fees, telehealth, and confidentiality.
            </p>
          </div>

          {/* ── SEARCH BAR ── */}
          <div className="relative mb-8 max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. coaching, cancellation, confidentiality)..."
              className="w-full bg-[#fbfdfc] border border-slate-200 rounded-2xl pl-13 pr-5 py-4 text-sm text-[#0f2820] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#156e52] focus:ring-4 focus:ring-emerald-500/10 shadow-xs transition-all"
            />
          </div>

          {/* ── CATEGORY TABS ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start sm:justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#156e52] text-white shadow-sm"
                    : "bg-[#fbfdfc] border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── ACCORDION LIST ── */}
          <div className="space-y-4 mb-16">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                      isOpen
                        ? "border-emerald-200 shadow-md shadow-emerald-900/5 ring-1 ring-emerald-100"
                        : "border-slate-200/90 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer"
                    >
                      <div className="pr-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#156e52] block mb-1">
                          {faq.category}
                        </span>
                        <span
                          className="font-bold text-[#0f2820] text-base sm:text-lg block"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                          {faq.q}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[#156e52]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-[#475569] leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-[#fafaf9] rounded-3xl border border-slate-200">
                <p className="text-base font-bold text-[#0f2820]">No matching questions found</p>
                <p className="text-xs text-[#64748b] mt-1">Try another keyword or reach out directly to our team.</p>
              </div>
            )}
          </div>

          {/* ── STILL HAVE QUESTIONS CALLOUT CARD ── */}
          <div className="bg-gradient-to-br from-[#f0fdf4] via-white to-[#fffbeb] rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-sm text-center space-y-4">
            <h3
              className="text-2xl sm:text-3xl font-bold text-[#0f2820]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Still Have Questions?
            </h3>
            <p className="text-[#475569] text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              If you did not find the information you were looking for, Maletsatsi and our team are on hand to assist you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#156e52] to-[#52b74c] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg hover:shadow-emerald-900/20 transition-all cursor-pointer"
              >
                <Mail size={16} /> Contact Practice Directly
              </Link>
              <a
                href="tel:+27795501557"
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-[#0f2820] px-7 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
              >
                <PhoneCall size={16} className="text-[#156e52]" /> +27 79 550 1557
              </a>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
