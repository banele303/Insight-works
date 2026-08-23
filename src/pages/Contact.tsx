import { useState } from "react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { PhoneCall, Clock, MessageSquare, Send, MapPin, Mail, ShieldCheck, CheckCircle2, HeartPulse, Share2 } from "lucide-react";
import { toast } from "sonner";
import SocialLinks from "@/components/global/SocialIcons";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    preferredContact: "email",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
      toast.success("Message sent successfully! Our practice team will respond within 24 hours.");
      setForm({ name: "", email: "", phone: "", inquiryType: "", preferredContact: "email", message: "" });
    }, 1200);
  };

  return (
    <div className="bg-white min-h-screen text-[#0f172a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* ── HEADER ── */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-[#9f1239] text-xs font-bold uppercase tracking-widest">
              <MessageSquare className="w-3.5 h-3.5 text-[#9f1239]" />
              We Are Here For You
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f172a]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Connect with Our{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #881337 0%, #be123c 50%, #0284c7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Therapy Practice
              </span>
            </h1>
            <p className="text-[#475569] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Reach out with questions about our therapy offerings, schedule an initial consultation, or inquire about appointments.
            </p>
          </div>

          {/* ── 2-COLUMN GRID (Practice Info + Interactive Form) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Clinician Card */}
              <div className="bg-gradient-to-br from-emerald-50/80 via-white to-amber-50/40 border border-slate-200/90 rounded-3xl p-6 shadow-xs flex items-center gap-4">
                <img
                  src="/images/therapist-portrait.jpg"
                  alt="Maletsatsi Sibanda"
                  className="w-16 h-16 rounded-2xl object-cover object-top border border-slate-200 shadow-sm shrink-0"
                />
                <div>
                  <span className="text-[10px] font-bold text-[#156e52] bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                    Counselling Therapist & Life Coach
                  </span>
                  <h4 className="font-bold text-base text-[#0f2820] font-serif mt-1">Maletsatsi Sibanda</h4>
                  <p className="text-xs text-[#64748b]">Direct inquiries & session bookings</p>
                </div>
              </div>
              
              {/* Practice Details Card */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-7 shadow-xs space-y-6">
                <h3 className="text-xl font-bold font-serif text-[#0f2820]">Practice Contact</h3>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#156e52] shrink-0">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone & WhatsApp</p>
                      <a href="tel:+27795501557" className="text-sm font-bold text-[#0f2820] hover:text-[#156e52] transition-colors mt-0.5 block cursor-pointer">
                        +27 79 550 1557
                      </a>
                      <p className="text-xs text-[#64748b] mt-0.5">WhatsApp available for confidential inquiries</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#ea7627] shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</p>
                      <a href="mailto:maletsatsi@insightherapyandcoaching.co.za" className="text-sm font-bold text-[#0f2820] hover:text-[#156e52] transition-colors mt-0.5 block break-all cursor-pointer">
                        maletsatsi@insightherapyandcoaching.co.za
                      </a>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Follow & Connect</p>
                    <SocialLinks
                      className="flex flex-wrap items-center gap-2"
                      itemClassName="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-[#156e52] hover:text-white hover:border-[#156e52] transition-all cursor-pointer"
                      iconClassName="w-4 h-4"
                    />
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#156e52] shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location & Coverage</p>
                      <p className="text-sm font-bold text-[#0f2820] mt-0.5">9 Moray Drive, Bryanston, Sandton, 2091</p>
                      <p className="text-xs text-[#64748b] mt-0.5">In-Person Consulting & Telehealth Nationwide & International</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-[#ea7627] shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Consulting Hours</p>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">Monday – Friday: 08:00 – 18:00</p>
                      <p className="text-xs text-slate-700 font-medium">Saturday: 09:00 – 13:00</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-[#64748b]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All inquiries are protected with strict confidentiality under POPIA.</span>
                </div>
              </div>

              {/* SADAG 24/7 Crisis Support Box */}
              <div className="bg-gradient-to-br from-emerald-50/60 via-amber-50/30 to-white border border-emerald-200/90 rounded-3xl p-6 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-[#156e52]">
                  <HeartPulse className="w-5 h-5" />
                  <h4 className="font-bold text-sm uppercase tracking-wider font-serif">24/7 Crisis Support</h4>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  If you are experiencing an acute mental health crisis or suicidal thoughts, please contact the South African Depression and Anxiety Group (SADAG) toll-free:
                </p>
                <div className="space-y-1.5 pt-1">
                  <a
                    href="tel:0800456789"
                    className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-[#156e52] hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>SADAG 24hr Helpline:</span>
                    <span className="font-mono text-sm">0800 456 789</span>
                  </a>
                  <a
                    href="tel:0800567567"
                    className="flex items-center justify-between p-3 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-[#156e52] hover:bg-emerald-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Suicide Crisis Line:</span>
                    <span className="font-mono text-sm">0800 567 567</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right Column - Interactive Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] space-y-6">
                <div>
                  <h3 className="text-2xl font-bold font-serif text-[#0f2820] mb-1">Send a Confidential Message</h3>
                  <p className="text-[#64748b] text-xs">Fill out the fields below and Maletsatsi will respond to you promptly.</p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Your Full Name <span className="text-amber-600">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="e.g. Lerato Khumalo"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#156e52] focus:ring-2 focus:ring-emerald-500/15 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address <span className="text-amber-600">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#156e52] focus:ring-2 focus:ring-emerald-500/15 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="e.g. 079 000 0000"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#156e52] focus:ring-2 focus:ring-emerald-500/15 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Inquiry Service <span className="text-amber-600">*</span>
                        </label>
                        <select
                          required
                          value={form.inquiryType}
                          onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#156e52] focus:ring-2 focus:ring-emerald-500/15 transition-all"
                        >
                          <option value="">Select an offering...</option>
                          <option value="individual">Individual Counselling</option>
                          <option value="couples">Couples & Relationship Counselling</option>
                          <option value="coaching">Life Coaching</option>
                          <option value="trauma">Trauma Recovery & Emotional Healing</option>
                          <option value="youth">Youth & Young Adult Support</option>
                          <option value="substance">Substance Use Support</option>
                          <option value="growth">Personal Growth & Self-Mastery</option>
                          <option value="general">General Question</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Preferred Contact Method
                      </label>
                      <div className="flex gap-4">
                        {["email", "phone", "whatsapp"].map((method) => (
                          <label key={method} className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                            <input
                              type="radio"
                              name="preferredContact"
                              value={method}
                              checked={form.preferredContact === method}
                              onChange={(e) => setForm({ ...form, preferredContact: e.target.value })}
                              className="accent-[#881337]"
                            />
                            <span className="capitalize">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        How can we support you? <span className="text-amber-600">*</span>
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Please share any questions or context you would like us to know..."
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#156e52] focus:ring-2 focus:ring-emerald-500/15 transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full btn-dual-gradient text-white px-6 py-4 rounded-xl font-bold text-base hover:shadow-lg hover:shadow-emerald-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      {sending ? (
                        <>Sending Message...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Confidential Message
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-2xl font-bold font-serif text-[#0f172a]">Thank You for Reaching Out</h4>
                    <p className="text-sm text-[#475569] max-w-md mx-auto">
                      We have received your message. Our clinical coordinator will respond to your preferred contact channel within 24 hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>
      
      <Footer />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap');`}</style>
    </div>
  );
};

export default Contact;
