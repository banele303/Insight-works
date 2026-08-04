import { useState } from "react";
import { Link } from "react-router";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { ChevronDown, ChevronUp, Search, MessageCircle, Sparkles } from "lucide-react";

const faqs = [
  {
    category: "Academics & Compliance",
    questions: [
      {
        q: "Is Glenanda Learning Centre fully CAPS aligned?",
        a: "Yes, our entire academic syllabus is strictly mapped to the South African Department of Basic Education's CAPS framework. We prepare students for the National Senior Certificate (NSC) matric exams.",
      },
      {
        q: "How do we register with the Department of Basic Education (DBE)?",
        a: "Our enrolment team assists parents through the entire provincial DBE home education registration process. We provide the necessary timetables, curriculum outlines, and assessment guides required for compliance.",
      },
      {
        q: "Who teaches the live interactive modules?",
        a: "All online classes and SBA task assessments are designed and guided by SACE-registered educators with extensive classroom experience in South African public and private schools.",
      },
    ],
  },
  {
    category: "Online Learning Hub",
    questions: [
      {
        q: "How do live online classes work?",
        a: "Classes meet daily on our high-speed, interactive portal. Educators teach with live whiteboard tools, active student chat, and instant quizzes. All sessions are recorded and archived for 24/7 student access.",
      },
      {
        q: "What is the AI Study Buddy?",
        a: "The AI Study Buddy is an advanced, POPIA-compliant assistant trained directly on CAPS textbook materials. Students use it to solve complex math problems, get homework reviews, or generate study summaries in English, isiZulu, Sesotho, and Afrikaans.",
      },
      {
        q: "How are formal assessments and exams managed?",
        a: "We conduct timed mid-year and final exams directly within our secure testing portal. Matric candidates write national papers under SACE-accredited conditions. Formative SBA marks are automatically generated and reflected on termly report cards.",
      },
    ],
  },
  {
    category: "Fees & Enrolment",
    questions: [
      {
        q: "What are the enrolment fees?",
        a: "Tuition varies by phase (Foundation, Intermediate, Senior, or FET). We offer flexible payment plans (monthly, termly, or annual) with discounts applied for siblings. Please request a detailed prospectus through our contact form.",
      },
      {
        q: "Can my child join mid-term?",
        a: "Yes, we support year-round admissions. Since all modules and live lessons are fully recorded and organized by topic, learners can seamlessly catch up and transition into their new grade without lag.",
      },
      {
        q: "Are text materials and books included?",
        a: "Our portal includes full digital text material, curriculum resources, and past papers. Recommended print books can be sourced independently or ordered directly through our resource office.",
      },
    ],
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const toggle = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  const filteredFaqs = faqs
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-36 pb-20 bg-gradient-to-b from-[#5c061c]/10 via-[#030712] to-[#030712]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5c061c]/20 border border-[#5c061c]/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Support Directory
            </div>
            <h1 className="text-5xl md:text-6xl font-black font-serif text-white tracking-tight leading-none">
              Academic FAQ
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Find answers regarding registration, CAPS syllabus structure, live lessons, and academic compliance.
            </p>
            <div className="max-w-xl mx-auto relative pt-4">
              <Search className="absolute left-4 top-7.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search queries..."
                className="w-full bg-[#111827] border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 transition-all shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-20 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No matching inquiries found.</p>
                <Link to="/contact" className="text-sky-400 font-bold hover:underline">
                  Contact admissions office instead →
                </Link>
              </div>
            ) : (
              filteredFaqs.map((cat) => (
                <div key={cat.category} className="mb-14">
                  <h2 className="text-2xl font-bold font-serif text-white mb-6 flex items-center gap-3">
                    <span>{cat.category}</span>
                    <span className="text-xs font-normal text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
                      {cat.questions.length} Questions
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {cat.questions.map((item, idx) => {
                      const key = `${cat.category}-${idx}`;
                      const isOpen = openIndex === key;
                      return (
                        <div
                          key={key}
                          className="border border-white/[0.08] bg-white/[0.01] rounded-2xl overflow-hidden hover:border-sky-500/20 transition-all"
                        >
                          <button
                            onClick={() => toggle(key)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.03] transition-colors"
                          >
                            <span className="font-semibold text-white pr-4 font-serif leading-snug">
                              {item.q}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-sky-400 shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/[0.08] pt-5 text-sm">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Still have questions */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#030712] to-[#5c061c]/10 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <MessageCircle className="w-12 h-12 text-sky-400 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold font-serif text-white">
              Still have questions?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Our academic advising team is standing by to assist with your specific questions.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5c061c] to-[#9f1239] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#5c061c]/30 transition-all hover:scale-[1.02] border border-white/10"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
