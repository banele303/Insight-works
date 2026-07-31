import { Twitter, Facebook, Linkedin, ArrowUp, Phone, Mail, MapPin, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="pt-20 pb-10 border-t border-white/[0.06] bg-[#050a18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/logo-school.jpeg"
                alt="Glenanda Shopping Learning Center"
                className="h-12 w-auto rounded-xl border border-white/10"
              />
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Glenanda Shopping <span className="text-orange-400">Learning Center</span>
                </span>
                <p className="text-[10px] text-gray-500 -mt-0.5">Quality Education, Real Results</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              A home schooling centre providing CAPS-aligned education from Grade R to Matric.
              Live online classes, certified educators, and real assessments that track true progress.
            </p>
            <div className="flex space-x-3">
              {[Twitter, Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all text-gray-400 shadow-sm"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* For Learners */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">For Learners</h4>
            <ul className="space-y-3">
              {["Live Online Classes", "Video Library", "AI Study Buddy", "Homework Checker", "Study Groups", "Past Papers"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* The School */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">The School</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", to: "/about" },
                { label: "Programmes", to: "/programs" },
                { label: "Apply for Enrolment", to: "/apply" },
                { label: "FAQ", to: "/faq" },
                { label: "Contact", to: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-gray-400 hover:text-orange-400 transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <span className="text-gray-400">Glenanda Shopping Centre, Johannesburg, Gauteng</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="tel:+27110000000" className="text-gray-400 hover:text-orange-400 transition-colors">+27 11 000 0000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href="mailto:info@glenandalearning.co.za" className="text-gray-400 hover:text-orange-400 transition-colors">info@glenandalearning.co.za</a>
              </li>
              <li className="pt-2">
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white text-sm font-bold px-5 py-3 rounded-xl transition-all"
                >
                  <GraduationCap className="h-4 w-4" /> Apply Now <ArrowRight className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Glenanda Shopping Learning Center. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <span>POPIA Compliant</span>
            <span>CAPS Aligned</span>
            <span>SACE Registered Educators</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all text-gray-400"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
