import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { Shield, Lock, FileText, AlertTriangle, CheckCircle2, Scale, HeartHandshake, EyeOff, Sparkles } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white text-[#0f2820]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          
          {/* ── HEADER ── */}
          <div className="mb-12 border-b border-slate-200 pb-8 space-y-3">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full">
              <Shield className="w-3.5 h-3.5 text-[#156e52]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#156e52]">
                Legal & Ethical Safeguards
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-black text-[#0f2820]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Privacy & Confidentiality Policy
            </h1>
            <p className="text-[#64748b] text-sm font-medium">
              Protection of Personal Information Act (POPI Act 4 of 2013) & Professional Ethical Compliance · Last Updated: August 2026
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* ── LEFT STICKY TABLE OF CONTENTS (4 cols) ── */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-28 bg-[#fbfdfc] border border-slate-200 rounded-3xl p-6 shadow-2xs space-y-3 text-xs">
                <p className="font-bold text-[#0f2820] uppercase tracking-wider text-[11px] font-serif border-b border-slate-200 pb-2">
                  Table of Contents
                </p>
                <div className="space-y-2 text-[#475569] font-medium">
                  <a href="#intro" className="block hover:text-[#156e52] transition-colors py-0.5">1. Ethical Commitment & Overview</a>
                  <a href="#collect" className="block hover:text-[#156e52] transition-colors py-0.5">2. What Information We Collect</a>
                  <a href="#use" className="block hover:text-[#156e52] transition-colors py-0.5">3. Purpose & Lawful Processing</a>
                  <a href="#confidentiality" className="block hover:text-[#156e52] transition-colors py-0.5">4. Client Confidentiality Privilege</a>
                  <a href="#exceptions" className="block hover:text-[#156e52] transition-colors py-0.5">5. Mandatory Statutory Reporting</a>
                  <a href="#popia" className="block hover:text-[#156e52] transition-colors py-0.5">6. POPIA Rights & Retention</a>
                  <a href="#telehealth" className="block hover:text-[#156e52] transition-colors py-0.5">7. Telehealth Data Encryption</a>
                  <a href="#payment" className="block hover:text-[#156e52] transition-colors py-0.5">8. Payment & Gateway Security</a>
                  <a href="#cookies" className="block hover:text-[#156e52] transition-colors py-0.5">9. Cookies & Web Telemetry</a>
                  <a href="#contact" className="block hover:text-[#156e52] transition-colors py-0.5">10. Information Officer Contact</a>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-[11px] text-[#64748b] leading-relaxed">
                    <p className="font-bold text-[#0f2820] mb-1 flex items-center gap-1.5">
                      <Lock size={12} className="text-[#156e52]" /> 100% Encrypted
                    </p>
                    All clinical notes are stored under ISO-27001 and POPIA compliance protocols.
                  </div>
                </div>
              </div>
            </div>

            {/* ── MAIN DOCUMENT CONTENT (8 cols) ── */}
            <div className="lg:col-span-8 space-y-12 text-[#334155] leading-relaxed text-sm sm:text-base">
              
              {/* Section 1 */}
              <section id="intro" className="space-y-4">
                <div className="flex items-center gap-2.5 text-[#156e52]">
                  <Scale className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">1. Ethical Commitment & Overview</h2>
                </div>
                <p>
                  At Insight Works Therapy & Coaching, we recognize that counselling and life coaching require profound trust and total transparency. We are bound by the highest professional codes of conduct and the South African Protection of Personal Information Act (POPIA Act No. 4 of 2013).
                </p>
                <p>
                  This document governs how your personal identification, diagnostic data, session notes, and payment information are collected, processed, and safeguarded throughout your care.
                </p>
              </section>

              {/* Section 2 */}
              <section id="collect" className="space-y-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2.5 text-[#156e52]">
                  <FileText className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">2. What Information We Collect</h2>
                </div>
                <p>
                  We collect only information essential to providing ethical counselling and coaching services:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-[#475569]">
                  <li><strong>Personal Identifiers:</strong> Name, ID number, date of birth, contact numbers, email address, physical address.</li>
                  <li><strong>Emergency Contacts:</strong> Name, relationship, and contact details of your nominated emergency contact.</li>
                  <li><strong>Clinical & Intake Data:</strong> Presenting concerns, medical and psychological history, medications, previous therapy experiences.</li>
                  <li><strong>Session Process Notes:</strong> Confidential therapeutic observations maintained strictly for treatment planning.</li>
                  <li><strong>Financial & Invoicing Data:</strong> Transaction references, invoice histories, and payment logs (handled via PayFast).</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="use" className="space-y-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2.5 text-[#156e52]">
                  <CheckCircle2 className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">3. Purpose & Lawful Processing</h2>
                </div>
                <p>
                  Your information is processed strictly for providing direct counselling and coaching, scheduling appointments, delivering secure Telehealth links, and processing invoices. We never sell, rent, or trade client personal data.
                </p>
              </section>

              {/* Section 4 */}
              <section id="confidentiality" className="space-y-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2.5 text-[#156e52]">
                  <Lock className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">4. Client Confidentiality Privilege</h2>
                </div>
                <p>
                  All disclosures made in individual, couples, or group sessions remain confidential. Records are stored in secure, encrypted cloud environments with two-factor authentication and strict access controls.
                </p>
              </section>

              {/* Section 5 */}
              <section id="exceptions" className="space-y-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2.5 text-[#ea7627]">
                  <AlertTriangle className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">5. Mandatory Statutory Reporting</h2>
                </div>
                <p>
                  In accordance with South African law, confidentiality may only be broken under specific statutory circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-sm text-[#475569]">
                  <li>Clear and imminent risk of serious physical harm or suicide to yourself.</li>
                  <li>Clear and imminent risk of serious physical harm to another person.</li>
                  <li>Suspected abuse or neglect of children or vulnerable adults (Children's Act 38 of 2005).</li>
                  <li>A valid court order or subpoena requiring the release of specific records.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="popia" className="space-y-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2.5 text-[#156e52]">
                  <Shield className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">6. POPIA Rights & Retention</h2>
                </div>
                <p>
                  Under POPIA, you have the right to request access to your personal data, request corrections, or object to processing. Adult clinical records are retained securely for a statutory minimum of 5 to 6 years following discharge, after which they are securely destroyed.
                </p>
              </section>

              {/* Section 7 */}
              <section id="telehealth" className="space-y-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2.5 text-[#156e52]">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">7. Telehealth & Data Security</h2>
                </div>
                <p>
                  All remote video sessions occur over end-to-end encrypted, POPIA-compliant communication software. Video sessions are <strong>never recorded</strong> without formal, written agreement. Electronic files are stored on ISO-27001 certified encrypted servers protected by multi-factor authentication.
                </p>
              </section>

              {/* Section 8 */}
              <section id="payment" className="space-y-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2.5 text-[#156e52]">
                  <Lock className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">8. Payment & Gateway Security</h2>
                </div>
                <p>
                  Online credit card and Instant EFT transactions are processed through PayFast, a PCI-DSS Level 1 certified payment gateway. Insight Works does not access, store, or process full debit or credit card numbers on local infrastructure.
                </p>
              </section>

              {/* Section 9 */}
              <section id="cookies" className="space-y-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2.5 text-[#156e52]">
                  <EyeOff className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">9. Cookies & Website Telemetry</h2>
                </div>
                <p>
                  Our website uses lightweight functional cookies exclusively to manage appointment booking workflows and maintain session security. We do not use intrusive cross-site tracking cookies.
                </p>
              </section>

              {/* Section 10 */}
              <section id="contact" className="space-y-4 border-t border-slate-100 pt-8">
                <div className="flex items-center gap-2.5 text-[#156e52]">
                  <HeartHandshake className="w-5 h-5" />
                  <h2 className="text-2xl font-bold font-serif text-[#0f2820]">10. Contact Our Information Officer</h2>
                </div>
                <p>
                  If you have inquiries regarding this privacy charter, wish to exercise your POPIA data subject rights, or require record copies, please contact our appointed Information Officer:
                </p>
                <div className="bg-[#fbfdfc] border border-slate-200 rounded-2xl p-6 space-y-1 text-sm">
                  <p className="font-bold text-[#0f2820]">Insight Works Therapy & Coaching — Information Officer (Maletsatsi Sibanda)</p>
                  <p className="text-[#475569]">Email: <a href="mailto:maletsatsi@insightherapyandcoaching.co.za" className="text-[#156e52] font-medium hover:underline">maletsatsi@insightherapyandcoaching.co.za</a></p>
                  <p className="text-[#475569]">Phone / WhatsApp: +27 79 550 1557</p>
                  <p className="text-[#475569]">Consulting Location: Johannesburg, South Africa & Nationwide Telehealth</p>
                </div>
              </section>

            </div>

          </div>

        </div>
      </main>
      
      <Footer />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
    </div>
  );
};

export default Privacy;
