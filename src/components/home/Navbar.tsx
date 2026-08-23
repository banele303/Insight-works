import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ArrowRight, HeartPulse, User, LogIn, ChevronDown,
  Heart, Target, Sparkles, Compass, ShieldAlert, Zap, Clock, BookOpen
} from "lucide-react";
import { Link, useLocation } from "react-router";
import FloatingTherapyChatbot from "@/components/global/FloatingTherapyChatbot";

const CORE_SERVICES = [
  {
    title: "Individual Counselling",
    desc: "Anxiety, depression, burnout & emotional healing",
    icon: User,
    color: "text-[#156e52] bg-emerald-50",
    href: "/services/individual-counselling",
  },
  {
    title: "Couples & Relationships",
    desc: "Communication, conflict resolution & trust repair",
    icon: Heart,
    color: "text-[#ea7627] bg-amber-50",
    href: "/services/couples-counselling",
  },
  {
    title: "Life Coaching & Self-Mastery",
    desc: "Goal clarity, imposter syndrome & boundary work",
    icon: Target,
    color: "text-[#156e52] bg-emerald-50",
    href: "/services/life-coaching",
  },
  {
    title: "Trauma Recovery & Healing",
    desc: "Somatic therapy, grief & emotional desensitization",
    icon: Sparkles,
    color: "text-[#ea7627] bg-amber-50",
    href: "/services/trauma-recovery",
  },
  {
    title: "Youth & Young Adult Support",
    desc: "Academic stress, identity & social anxiety",
    icon: Compass,
    color: "text-[#156e52] bg-emerald-50",
    href: "/services/youth-support",
  },
  {
    title: "Substance Use Support",
    desc: "Harm-reduction, trigger tools & relapse prevention",
    icon: ShieldAlert,
    color: "text-[#ea7627] bg-amber-50",
    href: "/services/substance-support",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl py-1.5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border-b border-slate-200/80"
            : "bg-white/90 backdrop-blur-md py-2 sm:py-2.5 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Brand Logo Only */}
            <Link to="/" className="flex items-center group py-0.5">
              <img
                src="/images/logo.png"
                alt="Insight Works Therapy & Coaching Logo"
                className="h-12 sm:h-14 md:h-16 w-auto max-h-[64px] object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink to="/about" active={location.pathname === "/about"}>About</NavLink>

              {/* Services Dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={`flex items-center gap-1 font-semibold text-sm px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                    location.pathname.startsWith("/services") || servicesOpen
                      ? "text-[#156e52] bg-emerald-50/90 font-bold"
                      : "text-slate-600 hover:text-[#156e52] hover:bg-emerald-50/40"
                  }`}
                >
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? "rotate-180 text-[#156e52]" : "text-slate-400"}`} />
                </button>

                {servicesOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[520px] rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 grid grid-cols-2 gap-2 animate-in fade-in-50 zoom-in-95 z-50">
                    <div className="col-span-2 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Therapeutic Disciplines</span>
                      <Link to="/services" className="text-xs font-bold text-[#156e52] hover:underline flex items-center gap-1">
                        View All Services <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    {CORE_SERVICES.map((s) => (
                      <Link
                        key={s.title}
                        to={s.href}
                        onClick={() => setServicesOpen(false)}
                        className="p-2 rounded-xl hover:bg-emerald-50/50 transition-colors group cursor-pointer block"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-[#156e52] transition-colors">{s.title}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1 leading-relaxed">{s.desc}</p>
                        </div>
                      </Link>
                    ))}

                    <div className="col-span-2 pt-2 mt-1 border-t border-slate-100 flex items-center justify-between bg-slate-50/80 -mx-4 -mb-4 p-3 rounded-b-2xl">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-[#156e52]" />
                        <span>Free 15-min initial discovery consultations available</span>
                      </div>
                      <Link
                        to="/booking"
                        className="text-xs font-bold text-white px-3 py-1.5 rounded-lg transition-all shadow-xs btn-orange-gradient"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/intake" active={location.pathname === "/intake"}>Intake</NavLink>
              <NavLink to="/blog" active={location.pathname === "/blog" || location.pathname.startsWith("/blog/")}>Blog</NavLink>
              <NavLink to="/wellness-insights" active={location.pathname === "/wellness-insights"}>Wellness Insights</NavLink>
              <NavLink to="/faq" active={location.pathname === "/faq"}>FAQ</NavLink>
              <NavLink to="/contact" active={location.pathname === "/contact"}>Contact</NavLink>
              
              <div className="w-px h-5 bg-slate-200 mx-2" />
              
              {/* Portal Login Link */}
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#156e52] px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" /> Portal Sign In
              </Link>

              <Link
                to="/booking"
                className="flex items-center gap-2 btn-dual-gradient text-white px-5 py-2.5 rounded-xl font-bold text-sm ml-1 cursor-pointer"
              >
                Book a Session
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200 px-5 pt-3 pb-6 space-y-1 shadow-xl">
            <MobileNavLink to="/about" active={location.pathname === "/about"}>About</MobileNavLink>
            <MobileNavLink to="/services" active={location.pathname === "/services"}>All Services &amp; Disciplines</MobileNavLink>
            <MobileNavLink to="/intake" active={location.pathname === "/intake"}>Intake Form</MobileNavLink>
            <MobileNavLink to="/blog" active={location.pathname === "/blog" || location.pathname.startsWith("/blog/")}>Blog &amp; Insights</MobileNavLink>
            <MobileNavLink to="/wellness-insights" active={location.pathname === "/wellness-insights"}>Wellness Insights</MobileNavLink>
            <MobileNavLink to="/faq" active={location.pathname === "/faq"}>FAQ</MobileNavLink>
            <MobileNavLink to="/privacy" active={location.pathname === "/privacy"}>Privacy Policy</MobileNavLink>
            <MobileNavLink to="/contact" active={location.pathname === "/contact"}>Contact</MobileNavLink>
            
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/login"
                className="text-center flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer"
              >
                <LogIn className="w-4 h-4" /> Portal Sign In / Register
              </Link>
              <Link
                to="/booking"
                className="text-center flex items-center justify-center gap-2 btn-dual-gradient text-white px-5 py-3 rounded-xl font-bold text-sm cursor-pointer"
              >
                Book a Session <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Floating Interactive Cloudflare AI Sanctuary Chatbot Widget */}
      <FloatingTherapyChatbot />
    </>
  );
};

function NavLink({ to, active, children }: { to: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`font-semibold text-sm px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
        active
          ? "text-[#156e52] bg-emerald-50/90 font-bold"
          : "text-slate-600 hover:text-[#156e52] hover:bg-emerald-50/40"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, active, children }: { to: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`block text-base font-semibold py-2.5 px-3 rounded-lg transition-colors cursor-pointer ${
        active
          ? "text-[#156e52] bg-emerald-50 font-bold"
          : "text-slate-700 hover:text-[#156e52] hover:bg-emerald-50/40"
      }`}
    >
      {children}
    </Link>
  );
}

export default Navbar;

