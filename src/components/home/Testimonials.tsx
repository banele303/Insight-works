import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Mrs. Nomsa Dlamini",
    role: "Principal",
    school: "Ekurhuleni Secondary School, Gauteng",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    quote:
      "Glenanda Shopping Learning Center transformed how we manage our school. Our teachers spend less time on admin and more time in the classroom. The report cards alone saved us two full weeks of work each term.",
    tag: "Administration",
  },
  {
    name: "Mr. Thabo Mokoena",
    role: "HOD Mathematics",
    school: "Soweto High School, Johannesburg",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    quote:
      "The Grade Insights dashboard is incredible. I can see exactly which learners are struggling with algebra and intervene before the exams. Our Maths pass rate improved by 18% this year.",
    tag: "Analytics",
  },
  {
    name: "Ms. Fatima Adams",
    role: "Deputy Principal",
    school: "Boland High School, Western Cape",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    quote:
      "The timetabling feature is a lifesaver. What used to take our admin staff three days now takes 20 minutes. And it's always conflict-free. Absolutely brilliant South African software.",
    tag: "Timetabling",
  },
  {
    name: "Mr. Sipho Ndlovu",
    role: "IT Coordinator",
    school: "uMgungundlovu School, KZN",
    avatar: "https://i.pravatar.cc/150?img=68",
    rating: 5,
    quote:
      "The online classes are structured and the reports are honest — we always know exactly how our daughter is doing. Communication with teachers has never been this easy.",
    tag: "Communication",
  },
  {
    name: "Dr. Liesl van Wyk",
    role: "Circuit Manager",
    school: "Boland Circuit, Western Cape DoE",
    avatar: "https://i.pravatar.cc/150?img=21",
    rating: 5,
    quote:
      "We piloted Glenanda Shopping Learning Center across 12 schools in our circuit. The DBE compliance of the reports and the POPIA-aligned data handling gave us complete confidence to roll it out district-wide.",
    tag: "Compliance",
  },
  {
    name: "Ms. Zanele Khumalo",
    role: "Grade 10 Teacher",
    school: "Thembisa Secondary, Ekurhuleni",
    avatar: "https://i.pravatar.cc/150?img=56",
    rating: 5,
    quote:
      "I use the AI Study Buddy with my learners and the difference is remarkable. They can get help at home late at night. My learners feel more confident and arrive better prepared for class.",
    tag: "AI Learning",
  },
];

const tagColors: Record<string, string> = {
  Administration: "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/20",
  Analytics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Timetabling: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Communication: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Compliance: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "AI Learning": "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#f97316]/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#f97316]/10 border border-[#f97316]/20 text-[#f97316] text-xs font-bold uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Trusted by Educators{" "}
            <span className="text-[#f97316]">Across South Africa</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Real stories from principals, teachers, and district managers who've
            transformed their schools with Glenanda Shopping Learning Center.
          </p>
        </div>

        {/* Average rating bar */}
        <div className="flex items-center justify-center gap-4 mb-14">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-3xl font-black text-white">5.0</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            from families across Gauteng
          </span>
        </div>

        {/* Testimonials masonry-style grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="break-inside-avoid group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 hover:border-[#f97316]/30 hover:shadow-xl transition-all duration-300"
            >
              {/* Stars + tag */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tagColors[t.tag]}`}
                >
                  {t.tag}
                </span>
              </div>

              {/* Quote */}
              <p className="text-gray-300 leading-relaxed mb-6 text-sm italic">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#f97316]/40"
                />
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                  <p className="text-xs text-[#f97316] font-medium">{t.school}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
