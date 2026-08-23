import { ArrowUp, Phone, Mail, MapPin, HeartPulse, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import SocialLinks from "@/components/global/SocialIcons";

const Footer = () => {
  return (
    <footer className="pt-20 pb-12 border-t border-slate-200/80 bg-[#fafaf9] text-slate-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-4">
              <img
                src="/images/logo.png"
                alt="Insight Works Logo"
                className="h-16 sm:h-20 w-auto max-h-[80px] object-contain drop-shadow-xs"
              />
              <div>
                <span className="text-2xl font-black tracking-tight text-[#0f2820] font-serif block">
                  Insight Works
                </span>
                <p className="text-xs text-[#156e52] uppercase tracking-wider font-bold mt-0.5">Therapy & Coaching</p>
              </div>
            </div>
            
            <p className="text-[#475569] leading-relaxed text-sm max-w-sm">
              You don't have to face life's challenges alone. With Maletsatsi Sibanda (Counselling Therapist & Life Coach), we offer compassionate counselling, trauma recovery, couples support, and transformational life coaching.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4 text-[#156e52]" />
              <span>POPIA Compliant · Confidential Care</span>
            </div>

            <div className="pt-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Connect With Us</p>
              <SocialLinks
                className="flex flex-wrap items-center gap-2"
                itemClassName="w-9 h-9 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 shadow-2xs hover:bg-[#156e52] hover:text-white hover:border-[#156e52] transition-all cursor-pointer"
                iconClassName="w-4 h-4"
              />
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[#0f2820] font-bold text-xs uppercase tracking-widest font-serif border-b border-slate-200 pb-2">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "About Maletsatsi", to: "/about" },
                { label: "Our Services", to: "/services" },
                { label: "Wellness Insights", to: "/wellness-insights" },
                { label: "Mental Health Blog", to: "/blog/understanding-anxiety" },
                { label: "Frequently Asked Questions", to: "/faq" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-[#475569] hover:text-[#156e52] transition-colors font-medium cursor-pointer">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Support (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[#0f2820] font-bold text-xs uppercase tracking-widest font-serif border-b border-slate-200 pb-2">
              Services & Intake
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Book a Session", to: "/booking" },
                { label: "Client Intake Form", to: "/intake" },
                { label: "Individual Counselling", to: "/services" },
                { label: "Couples & Relationships", to: "/services" },
                { label: "Life Coaching", to: "/services" },
                { label: "Privacy & POPIA Policy", to: "/privacy" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-[#475569] hover:text-[#156e52] transition-colors font-medium cursor-pointer">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[#0f2820] font-bold text-xs uppercase tracking-widest font-serif border-b border-slate-200 pb-2">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#156e52] mt-0.5 shrink-0" />
                <span className="text-[#475569]">9 Moray Drive, Bryanston, Sandton, 2091</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#156e52] shrink-0" />
                <a href="tel:+27795501557" className="text-[#475569] hover:text-[#156e52] transition-colors font-medium cursor-pointer">
                  +27 79 550 1557
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#156e52] shrink-0" />
                <a href="mailto:maletsatsi@insightherapyandcoaching.co.za" className="text-[#475569] hover:text-[#156e52] transition-colors font-medium text-xs break-all cursor-pointer">
                  maletsatsi@insightherapyandcoaching.co.za
                </a>
              </li>
              <li className="pt-2">
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center gap-2 w-full btn-dual-gradient text-white text-xs font-bold px-4 py-3 rounded-xl hover:shadow-md hover:shadow-emerald-900/20 transition-all shadow-xs cursor-pointer"
                >
                  Schedule Appointment <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          <p>© {new Date().getFullYear()} Insight Works Therapy & Coaching. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link to="/login" className="text-[#156e52] font-bold hover:underline transition-colors cursor-pointer">Client &amp; Staff Portal</Link>
            <Link to="/privacy" className="hover:text-[#156e52] transition-colors cursor-pointer">Privacy Policy</Link>
            <Link to="/intake" className="hover:text-[#156e52] transition-colors cursor-pointer">Intake Portal</Link>
            <Link to="/contact" className="hover:text-[#156e52] transition-colors cursor-pointer">Contact</Link>
            <span className="text-slate-400">|</span>
            <span>Emergency SADAG: 0800 456 789</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center hover:bg-slate-100 transition-all text-slate-600 shadow-2xs cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
