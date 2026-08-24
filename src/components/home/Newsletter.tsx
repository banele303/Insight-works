import { useState } from "react";
import { Mail, CheckCircle2, Sparkles, Bell, HeartPulse } from "lucide-react";

const perks = [
  { icon: Bell, text: "Monthly wellness & self-help tools" },
  { icon: HeartPulse, text: "Evidence-based clinical insights" },
  { icon: Sparkles, text: "Practice updates & new telehealth slots" },
];

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section
      id="newsletter"
      className="py-24 lg:py-32 relative overflow-hidden bg-[#fbfdfc]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
      
      {/* Delicate dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#0f2820 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6">

          {/* Icon Badge */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white border border-emerald-200/80 shadow-md shadow-emerald-900/5 flex items-center justify-center text-[#156e52]">
              <Mail className="w-7 h-7" />
            </div>
          </div>

          {/* Headline */}
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#156e52]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
                Complimentary Guidance
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0f2820] leading-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Mental Wellness Resources,{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #156e52 0%, #52b74c 50%, #ea7627 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Delivered Monthly
              </span>
            </h2>
            <p className="text-[#475569] mt-4 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Subscribe for evidence-based self-care guides, nervous system grounding tools, and insight updates — entirely free and privacy-protected.
            </p>
          </div>

          {/* Perks Row */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 pt-2">
            {perks.map((perk, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#334155] shadow-xs"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center text-[#156e52] shrink-0">
                  <perk.icon className="w-3.5 h-3.5" />
                </div>
                {perk.text}
              </div>
            ))}
          </div>

          {/* Subscribe Form */}
          <div className="mt-8 max-w-lg mx-auto">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-5 py-4 text-[#0f2820] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#156e52] transition-all text-sm shadow-xs"
                />
                <button
                  type="submit"
                  className="btn-orange-gradient text-white px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Subscribe Free
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-3 py-4 animate-in fade-in zoom-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <p className="text-[#0f172a] font-bold text-lg" style={{ fontFamily: "'Poppins', serif" }}>
                  You're subscribed! 🎉
                </p>
                <p className="text-[#475569] text-sm">
                  Look out for a welcoming email in your inbox shortly.
                </p>
              </div>
            )}
            <p className="text-[#64748b] text-xs mt-3">
              Zero spam. Unsubscribe at any time. Fully POPIA compliant — your personal details remain strictly protected.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;
