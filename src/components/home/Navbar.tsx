import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#030712]/85 backdrop-blur-xl py-3 shadow-lg shadow-black/30 border-b border-white/[0.06]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-4 group">
            <img
              src="/logo-school.jpeg"
              alt="Glenanda Learning Center"
              className="h-16 w-auto rounded-xl border border-white/10 group-hover:border-sky-400/40 transition-colors shadow-md"
            />
            <div className="hidden sm:block">
              <span className="block font-black tracking-tight text-white text-xl leading-none font-serif">
                Glenanda
              </span>
              <span className="block text-[10px] font-bold text-sky-400 uppercase tracking-[0.2em] mt-1 leading-none">
                Learning Centre
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/programs">Programmes</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <div className="w-px h-6 bg-white/10 mx-2" />
            <Link
              to="/login"
              className="text-gray-300 hover:text-sky-400 transition-colors font-medium text-sm px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/apply"
              className="flex items-center gap-2 bg-[#5c061c] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#7e0b27] hover:shadow-lg hover:shadow-[#5c061c]/25 transition-all transform hover:scale-[1.02] ml-2 border border-white/10"
            >
              <GraduationCap className="h-4 w-4 text-sky-300" />
              Apply Now
            </Link>
          </div>

          {/* Mobile button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-gray-300">
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#030712]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 pt-2 pb-6 space-y-3">
          <MobileNavLink to="/about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
          <MobileNavLink to="/programs" onClick={() => setIsOpen(false)}>Programmes</MobileNavLink>
          <MobileNavLink to="/faq" onClick={() => setIsOpen(false)}>FAQ</MobileNavLink>
          <MobileNavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link to="/login" className="text-center text-gray-300 font-medium py-2">Sign In</Link>
            <Link
              to="/apply"
              className="text-center flex items-center justify-center gap-2 bg-[#5c061c] text-white px-5 py-3 rounded-xl font-bold border border-white/10"
            >
              Apply Now <ArrowRight className="h-4 w-4 text-sky-300" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-gray-300 hover:text-sky-400 transition-colors font-medium text-sm px-3 py-2 rounded-lg hover:bg-white/[0.04]"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-gray-300 hover:text-sky-400 text-lg font-medium py-2"
    >
      {children}
    </Link>
  );
}

export default Navbar;
