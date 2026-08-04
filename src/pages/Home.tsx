import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import Programs from "@/components/home/Programs";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import Blog from "@/components/home/Blog";
import Newsletter from "@/components/home/Newsletter";
import FAQPreview from "@/components/home/FAQPreview";
import Footer from "@/components/home/Footer";
import { Link } from "react-router";
import { ArrowRight, GraduationCap, CalendarCheck, FileCheck2 } from "lucide-react";

const Home = () => {
  return (
    <div className="bg-[#030712] min-h-screen">
      <Navbar />
      <main className="flex flex-col">
        <Hero />

        {/* Accreditation / partners strip */}
        <section className="py-12 border-y border-white/[0.06] bg-[#050a18]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">
              Aligned with South Africa's Education Framework
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 hover:opacity-100 transition-all duration-500">
              <span className="text-2xl font-black text-white">DBE</span>
              <span className="text-2xl font-black text-white">UMALUSI</span>
              <span className="text-2xl font-black text-white">SACE</span>
              <span className="text-2xl font-black text-white">CAPS</span>
              <span className="text-2xl font-black text-white">NSC</span>
            </div>
          </div>
        </section>

        <HowItWorks />
        <Features />
        <Programs />
        <Stats />
        <Testimonials />
        <FAQPreview />
        <Blog />
        <Newsletter />

        {/* Enrolment CTA */}
        <section className="py-28 relative overflow-hidden bg-[#030712]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-orange-500/20">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500" />
              <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

              <div className="relative z-10 p-12 md:p-20 text-center">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-white text-sm font-semibold mb-8">
                  <GraduationCap className="h-4 w-4" />
                  Enrolment for 2026 is now open
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                  Give Your Child the Gift of
                  <br className="hidden md:block" /> Quality Education
                </h2>
                <p className="text-xl text-white/85 mb-10 max-w-2xl mx-auto">
                  Join Glenanda Learning Center — a caring home schooling community with
                  certified educators, a full CAPS curriculum, and real assessments that track your
                  child's true progress.
                </p>

                {/* 3-step enrolment mini strip */}
                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10">
                  {[
                    { icon: FileCheck2, title: "1. Submit Application", desc: "Fill in the online form" },
                    { icon: CalendarCheck, title: "2. Assessment Interview", desc: "We meet your learner" },
                    { icon: GraduationCap, title: "3. Welcome Aboard", desc: "Start learning immediately" },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="bg-black/20 backdrop-blur rounded-2xl p-4 border border-white/10">
                      <Icon className="h-6 w-6 text-white mb-2 mx-auto" />
                      <p className="text-white font-bold text-sm">{title}</p>
                      <p className="text-white/70 text-xs mt-1">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    to="/apply"
                    className="bg-white text-orange-600 px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2"
                  >
                    Start Your Application <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/contact"
                    className="bg-transparent border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center"
                  >
                    Talk to Our Team
                  </Link>
                </div>
                <p className="text-sm text-white/60 mt-6 font-medium">
                  No application fees • Response within 48 hours • Limited seats per grade
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
