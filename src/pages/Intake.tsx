import { useState } from 'react';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ShieldCheck, Info, FileText, Send, Lock, Clock, CheckCircle2, Heart, Sparkles } from 'lucide-react';

const formSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dob: z.string().min(1, 'Date of Birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  city: z.string().min(2, 'City / Location is required'),
  emergencyContact: z.string().min(2, 'Emergency contact name is required'),
  emergencyRelationship: z.string().min(2, 'Relationship is required'),
  emergencyPhone: z.string().min(10, 'Emergency phone number is required'),
  concerns: z.array(z.string()).min(1, 'Select at least one concern'),
  details: z.string().min(10, 'Please provide more details'),
  medications: z.string().optional(),
  previousTherapy: z.string().min(1, 'Please select an option'),
  psychiatricHistory: z.string().min(1, 'Please select an option'),
  medicalConditions: z.string().optional(),
  sessionPreference: z.string().min(1, 'Please select a preference'),
  preferredTimes: z.string().min(1, 'Preferred times are required'),
  referral: z.string().optional(),
  popiaConsent: z.boolean().refine(val => val === true, 'You must consent to POPIA'),
  therapyAgreement: z.boolean().refine(val => val === true, 'You must agree to therapy terms'),
  emergencyAuth: z.boolean().refine(val => val === true, 'You must authorize emergency contact'),
});

type FormValues = z.infer<typeof formSchema>;

const concernOptions = [
  'Anxiety & Panic', 'Depression & Low Mood', 'Trauma & PTSD', 
  'Relationship Challenges', 'Grief & Bereavement', 'Workplace Stress & Burnout', 
  'Self-Esteem & Confidence', 'Anger Management', 'Addiction & Habit Control', 'Other'
];

const Intake = () => {
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concerns: [],
      medications: '',
      medicalConditions: '',
      referral: '',
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setSubmittedSuccess(true);
    toast.success('Intake form submitted securely. Our intake coordinator will reach out within 24 hours to confirm your first appointment.');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@400;600;700&display=swap');
        .font-sans { font-family: 'DM Sans', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
      `}</style>
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* ── HEADER ── */}
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 px-3.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9f1239]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#9f1239]">
                Confidential & POPIA Protected
              </span>
            </div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f172a]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              New Client{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(135deg, #881337 0%, #be123c 50%, #0284c7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Intake Form
              </span>
            </h1>
            <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Please complete this confidential onboarding questionnaire prior to your first session. Your responses are encrypted and reviewed solely by our clinical team.
            </p>
          </div>

          {/* ── PROGRESS STRIP ── */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { step: "01", title: "Personal Details" },
                { step: "02", title: "Presenting Concerns" },
                { step: "03", title: "Medical Background" },
                { step: "04", title: "Consent & POPIA" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#fafaf9] border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-[#881337] shadow-2xs">
                    {item.step}
                  </div>
                  <span className="text-xs font-bold text-[#0f172a]">{item.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── FORM & SIDEBAR GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            
            {/* Form Container (8 cols) */}
            <div className="lg:col-span-8">
              {!submittedSuccess ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-8 bg-white border border-slate-200/90 p-7 sm:p-10 rounded-3xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)]"
                >
                  
                  {/* Section 1: Personal Details */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-[#881337] border-b border-slate-100 pb-3">
                      <FileText size={20} />
                      <h2 className="text-xl font-serif font-bold text-[#0f172a]">1. Personal & Contact Information</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Full Legal Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                          {...register('fullName')}
                          placeholder="e.g. Sipho Ndlovu"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                        {errors.fullName && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.fullName.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Date of Birth <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="date"
                          {...register('dob')}
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                        {errors.dob && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.dob.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Gender Identity <span className="text-rose-600">*</span>
                        </label>
                        <select
                          {...register('gender')}
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        >
                          <option value="">Select gender...</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="non-binary">Non-Binary</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                        {errors.gender && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.gender.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Phone Number <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          placeholder="e.g. 082 123 4567"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                        {errors.phone && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="email"
                          {...register('email')}
                          placeholder="you@example.com"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                        {errors.email && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.email.message}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          City / Residential Location <span className="text-rose-600">*</span>
                        </label>
                        <input
                          {...register('city')}
                          placeholder="e.g. Johannesburg, Gauteng"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                        {errors.city && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.city.message}</p>}
                      </div>

                      {/* Emergency Contact */}
                      <div className="sm:col-span-2 pt-2">
                        <p className="text-xs font-bold text-[#881337] uppercase tracking-wider mb-3">Emergency Contact Details</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Emergency Contact Name <span className="text-rose-600">*</span>
                        </label>
                        <input
                          {...register('emergencyContact')}
                          placeholder="Full name"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                        {errors.emergencyContact && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.emergencyContact.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Relationship <span className="text-rose-600">*</span>
                        </label>
                        <input
                          {...register('emergencyRelationship')}
                          placeholder="e.g. Spouse, Parent, Friend"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                        {errors.emergencyRelationship && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.emergencyRelationship.message}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Emergency Phone Number <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="tel"
                          {...register('emergencyPhone')}
                          placeholder="e.g. 083 456 7890"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                        {errors.emergencyPhone && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.emergencyPhone.message}</p>}
                      </div>
                    </div>
                  </section>

                  {/* Section 2: Presenting Concerns */}
                  <section className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-[#881337] border-b border-slate-100 pb-3">
                      <Heart size={20} />
                      <h2 className="text-xl font-serif font-bold text-[#0f172a]">2. Presenting Concerns & Goals</h2>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                        What areas would you like support with? (Select all that apply) <span className="text-rose-600">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {concernOptions.map(option => (
                          <label
                            key={option}
                            className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-rose-200 cursor-pointer text-xs font-medium text-slate-800 transition-colors"
                          >
                            <input
                              type="checkbox"
                              value={option}
                              {...register('concerns')}
                              className="accent-[#881337] w-4 h-4 rounded"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                      {errors.concerns && <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.concerns.message}</p>}
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Tell us more about why you are seeking therapy at this time <span className="text-rose-600">*</span>
                      </label>
                      <textarea
                        rows={4}
                        {...register('details')}
                        placeholder="Briefly describe what you've been experiencing and what you hope to achieve through therapy..."
                        className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                      />
                      {errors.details && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.details.message}</p>}
                    </div>
                  </section>

                  {/* Section 3: Medical & Clinical History */}
                  <section className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-[#881337] border-b border-slate-100 pb-3">
                      <ShieldCheck size={20} />
                      <h2 className="text-xl font-serif font-bold text-[#0f172a]">3. Clinical Background</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Current Medications (Psychiatric or General)
                        </label>
                        <input
                          {...register('medications')}
                          placeholder="e.g. Lexapro 10mg, or 'None'"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Previous therapy experience? <span className="text-rose-600">*</span>
                          </label>
                          <select
                            {...register('previousTherapy')}
                            className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                          >
                            <option value="">Select...</option>
                            <option value="yes-helpful">Yes — it was helpful</option>
                            <option value="yes-neutral">Yes — mixed experience</option>
                            <option value="no-first-time">No — this is my first time</option>
                          </select>
                          {errors.previousTherapy && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.previousTherapy.message}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Previous psychiatric care? <span className="text-rose-600">*</span>
                          </label>
                          <select
                            {...register('psychiatricHistory')}
                            className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                          >
                            <option value="">Select...</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                          {errors.psychiatricHistory && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.psychiatricHistory.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Any other medical conditions or allergies?
                        </label>
                        <input
                          {...register('medicalConditions')}
                          placeholder="e.g. Asthma, Thyroid, none"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Section 4: Preferences */}
                  <section className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-[#881337] border-b border-slate-100 pb-3">
                      <Sparkles size={20} />
                      <h2 className="text-xl font-serif font-bold text-[#0f172a]">4. Session Preferences</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Preferred Format <span className="text-rose-600">*</span>
                        </label>
                        <select
                          {...register('sessionPreference')}
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        >
                          <option value="">Select format...</option>
                          <option value="in-person">In-Person (Johannesburg)</option>
                          <option value="telehealth">Telehealth (Online Video)</option>
                          <option value="hybrid">Flexible / Either</option>
                        </select>
                        {errors.sessionPreference && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.sessionPreference.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Preferred Days / Times <span className="text-rose-600">*</span>
                        </label>
                        <input
                          {...register('preferredTimes')}
                          placeholder="e.g. Tuesday mornings, Saturday"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                        {errors.preferredTimes && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.preferredTimes.message}</p>}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          How did you hear about Serene Minds?
                        </label>
                        <input
                          {...register('referral')}
                          placeholder="e.g. GP Referral, Google, Friend, Medical Aid"
                          className="w-full bg-slate-50/60 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#9f1239] focus:ring-2 focus:ring-rose-500/15 transition-all"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Section 5: Legal Consent & POPIA */}
                  <section className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-[#881337] border-b border-slate-100 pb-3">
                      <Lock size={20} />
                      <h2 className="text-xl font-serif font-bold text-[#0f172a]">5. Consent & Privacy Acknowledgement</h2>
                    </div>

                    <div className="space-y-3.5 bg-[#fafaf9] p-5 rounded-2xl border border-slate-200">
                      <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('popiaConsent')}
                          className="mt-0.5 accent-[#881337] w-4 h-4 rounded shrink-0"
                        />
                        <span>
                          I consent to the processing of my personal health information in compliance with the Protection of Personal Information Act (POPI Act 4 of 2013).
                        </span>
                      </label>
                      {errors.popiaConsent && <p className="text-rose-600 text-xs font-medium pl-7">{errors.popiaConsent.message}</p>}

                      <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('therapyAgreement')}
                          className="mt-0.5 accent-[#881337] w-4 h-4 rounded shrink-0"
                        />
                        <span>
                          I agree to the practice terms of psychotherapy, including the 24-hour cancellation and rescheduling policy.
                        </span>
                      </label>
                      {errors.therapyAgreement && <p className="text-rose-600 text-xs font-medium pl-7">{errors.therapyAgreement.message}</p>}

                      <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('emergencyAuth')}
                          className="mt-0.5 accent-[#881337] w-4 h-4 rounded shrink-0"
                        />
                        <span>
                          I authorize Serene Minds clinicians to contact my nominated emergency contact solely in the event of an acute, life-threatening crisis.
                        </span>
                      </label>
                      {errors.emergencyAuth && <p className="text-rose-600 text-xs font-medium pl-7">{errors.emergencyAuth.message}</p>}
                    </div>
                  </section>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#881337] to-[#be123c] text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-rose-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-base cursor-pointer"
                  >
                    {isSubmitting ? 'Securing & Submitting...' : <><Send size={18} /> Submit Confidential Intake Form</>}
                  </button>
                </form>
              ) : (
                /* Success Confirmation State */
                <div className="bg-white border border-emerald-200 rounded-3xl p-10 shadow-lg text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-3xl font-bold font-serif text-[#0f172a]">Intake Form Received</h3>
                  <p className="text-[#475569] text-base leading-relaxed max-w-lg mx-auto">
                    Thank you for sharing your background with us. Your information is securely encrypted. Our clinical coordinator will review your file and contact you within 24 hours to confirm your first appointment.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setSubmittedSuccess(false)}
                      className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
                    >
                      Submit Another Response
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* What happens next */}
              <div className="bg-white border border-slate-200/90 p-6 rounded-3xl shadow-xs sticky top-28 space-y-6">
                <div className="flex items-center gap-2 text-[#881337]">
                  <Info size={20} />
                  <h3 className="text-lg font-bold font-serif text-[#0f172a]">Next Steps</h3>
                </div>

                <ul className="space-y-5 text-slate-700">
                  <li className="flex gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#881337] font-bold text-xs shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0f172a]">Clinical Review</h4>
                      <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                        Our clinical lead reviews your notes to ensure we assign the most suitable practitioner.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#881337] font-bold text-xs shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0f172a]">Scheduling Confirmation</h4>
                      <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                        We send an email & calendar invite with your session link or directions to our practice.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3.5">
                    <div className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#881337] font-bold text-xs shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#0f172a]">Initial Session</h4>
                      <p className="text-xs text-[#64748b] mt-0.5 leading-relaxed">
                        Your first 50-minute consultation exploring your history and tailored therapy roadmap.
                      </p>
                    </div>
                  </li>
                </ul>

                {/* POPIA notice card */}
                <div className="p-4 bg-sky-50/70 border border-sky-200/70 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-[#0284c7]">
                    <ShieldCheck size={16} />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#0284c7]">
                      POPIA & Medical Privilege
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    All data is encrypted in transit and at rest in full accordance with the South African Protection of Personal Information Act. No third party disclosures are made without your express consent.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
      
      <Footer />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@400;500;600;700;800&display=swap');`}</style>
    </div>
  );
};

export default Intake;
