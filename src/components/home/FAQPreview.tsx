import { useState } from "react";
import { Plus, Minus, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const faqs = [
  {
    q: "Is everything I say in counselling and coaching completely confidential?",
    a: "Yes. Confidentiality is the cornerstone of Insight Works. Everything discussed in your sessions remains strictly private, in full compliance with professional standards and POPIA regulations. Exceptions only apply in rare cases of severe, imminent harm to yourself or others, which is thoroughly discussed during intake.",
  },
  {
    q: "What are your session rates and payment methods?",
    a: "Standard individual counselling and coaching sessions range from R600 to R850, while couples sessions range from R850 to R1,100. We accept secure PayFast payments (Credit/Debit card and Instant EFT) as well as direct EFT.",
  },
  {
    q: "How does telehealth (online sessions) work?",
    a: "Telehealth sessions are conducted via secure, end-to-end encrypted video link. You will receive an access link upon booking confirmation. You only need a quiet, private space and a stable internet connection. Online sessions across South Africa offer the same depth of connection as in-person consultations.",
  },
  {
    q: "What should I expect in my first consultation session with Maletsatsi?",
    a: "The first session is a gentle, collaborative initial conversation. We will explore your background, current challenges, and personal goals for therapy or life coaching at your own pace. There is zero pressure — this is your safe, supportive space.",
  },
];

const FAQPreview = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq-preview" className="py-24 lg:py-32 bg-[#fbfdfc] relative overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Ambient glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full">
            <HelpCircle className="h-3.5 w-3.5 text-[#156e52]" />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
              Questions & Answers
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0f2820]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Clear Answers to Your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Questions
            </span>
          </h2>
          <p className="text-[#475569] text-base sm:text-lg max-w-xl mx-auto">
            Everything you need to know about starting your healing journey, session formats, fees, and confidentiality.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${
                open === idx
                  ? "border-emerald-200 shadow-md shadow-emerald-900/5 ring-1 ring-emerald-100"
                  : "border-slate-200/80 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left gap-4 cursor-pointer"
              >
                <span
                  className="font-bold text-[#0f2820] text-base sm:text-lg pr-4"
                  style={{ fontFamily: "'Poppins', serif" }}
                >
                  {faq.q}
                </span>
                <span
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    open === idx
                      ? "bg-[#156e52] text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {open === idx ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === idx ? "max-h-72 pb-6 px-6" : "max-h-0"
                }`}
              >
                <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA below FAQ */}
        <div className="text-center mt-12 pt-4">
          <p className="text-[#64748b] text-sm mb-4">
            Have a specific concern or inquiry? Maletsatsi and our team are glad to assist you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/faq"
              className="px-6 py-3.5 rounded-xl border border-slate-200 text-[#1e293b] font-bold text-sm bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
            >
              Browse Complete FAQ
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl btn-dual-gradient text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-900/20 transition-all shadow-xs cursor-pointer"
            >
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQPreview;
