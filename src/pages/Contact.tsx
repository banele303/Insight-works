import { useState } from "react";
import { Link } from "react-router";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Sparkles } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", grade: "", role: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast.success("Message sent! Academic advising will contact you shortly.");
    setForm({ name: "", email: "", grade: "", role: "", message: "" });
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-36 pb-20 bg-gradient-to-b from-[#5c061c]/10 via-[#030712] to-[#030712]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5c061c]/20 border border-[#5c061c]/30 text-rose-300 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                Contact Admissions
              </div>
              <h1 className="text-5xl md:text-6xl font-black font-serif text-white tracking-tight">
                Connect With Us
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Whether you're inquiring about the CAPS curriculum, live online classes, tuition fees, or standard enrolment — we're here to guide your family.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold font-serif text-white mb-6">Academy Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-sky-500/10 p-3 rounded-xl shrink-0 border border-sky-500/20">
                        <MapPin className="w-5 h-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white font-serif">Physical Campus</p>
                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">Glenanda, Johannesburg, Gauteng, 2091</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-sky-500/10 p-3 rounded-xl shrink-0 border border-sky-500/20">
                        <Phone className="w-5 h-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white font-serif">Phone & WhatsApp</p>
                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">+27 11 000 0000</p>
                        <p className="text-gray-500 text-xs mt-0.5">Mon–Fri, 8:00 AM – 5:00 PM SAST</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-sky-500/10 p-3 rounded-xl shrink-0 border border-sky-500/20">
                        <Mail className="w-5 h-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white font-serif">Academic Advising</p>
                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">admissions@glenandalearning.co.za</p>
                        <p className="text-gray-400 text-sm">info@glenandalearning.co.za</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="bg-sky-500/10 p-3 rounded-xl shrink-0 border border-sky-500/20">
                        <Clock className="w-5 h-5 text-sky-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white font-serif">Admissions Response</p>
                        <p className="text-gray-400 text-sm mt-1 leading-relaxed">Within 24 hours on academic days</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/[0.02] rounded-3xl p-6 border border-white/[0.08] space-y-3">
                  <h4 className="font-bold text-white font-serif">Accreditation Support</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Our advisors assist families in registering with the provincial Department of Basic Education (DBE) for formal home education compliance.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="md:col-span-2">
                <div className="bg-white/[0.02] rounded-3xl p-8 border border-white/[0.08] shadow-2xl shadow-black/50">
                  <h3 className="text-xl font-bold font-serif text-white mb-6 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-sky-400" />
                    Inquire Online
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Parent / Guardian Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 transition-all"
                          placeholder="First and last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 transition-all"
                          placeholder="parent@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Learner's Current Grade
                        </label>
                        <input
                          type="text"
                          value={form.grade}
                          onChange={(e) => setForm({ ...form, grade: e.target.value })}
                          className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 transition-all"
                          placeholder="e.g. Grade 10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Inquiry Type
                        </label>
                        <select
                          value={form.role}
                          onChange={(e) => setForm({ ...form, role: e.target.value })}
                          className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 transition-all"
                        >
                          <option value="">Select option...</option>
                          <option value="enrolment">New Enrolment Inquiries</option>
                          <option value="fees">Fee Schedules & Payment Plans</option>
                          <option value="curriculum">CAPS Syllabus & Assessment Details</option>
                          <option value="tutoring">Private Tutoring Support</option>
                          <option value="other">General Academic Q&A</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Your Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-[#111827] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-400 transition-all resize-none"
                        placeholder="Tell us about your learner and any specific questions you have..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-gradient-to-r from-[#5c061c] to-[#9f1239] hover:bg-rose-900 text-white px-6 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#5c061c]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 border border-white/10"
                    >
                      {sending ? (
                        <>Sending Inquiries...</>
                      ) : (
                        <>
                          <Send className="w-5 h-5 text-sky-300" />
                          Send Inquiry Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#030712] to-[#5c061c]/10 border-t border-white/[0.05]">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <h2 className="text-3xl font-extrabold font-serif text-white">
              Academic Frequently Asked Questions
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">
              Find immediate answers regarding terms, assessments, and DBE registration.
            </p>
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-sky-400 font-bold hover:text-sky-300 transition-colors pt-2"
            >
              Visit FAQ Database <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
