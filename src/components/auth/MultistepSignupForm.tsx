import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/global/CustomInput";
import { CustomSelect } from "@/components/global/CustomSelect";
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Heart } from "lucide-react";

const createSchema = () => {
  return z
    .object({
      therapyFocus: z.string().optional(),
      sessionPreference: z.string().optional(),
      name: z.string().min(2, "Full name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(8, "Phone / WhatsApp number is required"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }
    });
};

type FormValues = z.infer<ReturnType<typeof createSchema>>;

const THERAPY_DISCIPLINES = [
  { label: "Individual Counselling (60 min)", value: "Individual Counselling" },
  { label: "Couples & Relationship Counselling (75 min)", value: "Couples & Relationships" },
  { label: "Life Coaching & Self-Mastery (50 min)", value: "Life Coaching" },
  { label: "Trauma Recovery & EMDR (60 min)", value: "Trauma Recovery" },
  { label: "Youth & Young Adult Support (50 min)", value: "Youth Support" },
  { label: "Substance Use Support (60 min)", value: "Substance Recovery" },
  { label: "Free Initial Consultation (15 min)", value: "Free Consultation" },
];

const MODALITY_OPTIONS = [
  { label: "Secure Telehealth Video (South Africa)", value: "Telehealth Video" },
  { label: "In-Person Consulting Room (Johannesburg)", value: "In-Person Room" },
];

export default function MultistepSignupForm() {
  const [step, setStep] = useState(1);
  const { signIn } = useAuthActions();

  const form = useForm<FormValues>({
    resolver: zodResolver(createSchema()),
    defaultValues: {
      therapyFocus: "Individual Counselling",
      sessionPreference: "Telehealth Video",
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleNextStep = async () => {
    setStep(2);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const result = await signIn("password", {
        email: data.email,
        password: data.password,
        flow: "signUp",
        name: data.name,
        role: "student", // All new signups default to patient/client account
      });

      if (result?.signingIn) {
        toast.success("Account created successfully! Welcome to Insight Works.");
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      console.error(error);
      let friendly = error.message || "Signup failed. Please try again.";
      if (friendly.includes("AccountAlreadyExists")) {
        friendly = "An account with this email already exists. Please sign in instead.";
      }
      toast.error(friendly);
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Progress Indicators */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
        {[
          { num: 1, label: "Care Preferences" },
          { num: 2, label: "Patient Account Details" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s.num
                  ? "bg-[#156e52] text-white shadow-2xs"
                  : step > s.num
                  ? "bg-emerald-100 text-[#156e52]"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
            </div>
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* STEP 1: Care Focus & Modality */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in-50">
            <div className="text-center space-y-1 mb-2">
              <h3 className="text-lg font-bold text-[#0f2820] font-serif">Care Focus &amp; Modality</h3>
              <p className="text-xs text-slate-500">Personalize your care portal and wellness records</p>
            </div>

            <CustomSelect
              control={form.control}
              name="therapyFocus"
              label="Primary Discipline / Care Focus"
              placeholder="Select Discipline"
              options={THERAPY_DISCIPLINES}
            />

            <CustomSelect
              control={form.control}
              name="sessionPreference"
              label="Preferred Session Modality"
              placeholder="Select Modality"
              options={MODALITY_OPTIONS}
            />

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#156e52] shrink-0 mt-0.5" />
              <p className="text-xs text-[#0f2820] leading-relaxed">
                Your patient account provides direct access to private therapy notes, encrypted video rooms, appointment scheduling, and intake history.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full bg-[#156e52] hover:bg-[#0f5940] text-white font-bold text-xs py-3 rounded-xl gap-2 mt-4 cursor-pointer"
            >
              Continue to Account Details <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* STEP 2: Personal & Login Credentials */}
        {step === 2 && (
          <div className="space-y-3 animate-in fade-in-50">
            <div className="text-center space-y-1 mb-2">
              <h3 className="text-lg font-bold text-[#0f2820] font-serif">Create Your Patient Account</h3>
              <p className="text-xs text-slate-500">Protected under strict POPIA compliance</p>
            </div>

            <CustomInput
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="e.g. Sipho Ndlovu"
            />

            <CustomInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="sipho@example.co.za"
            />

            <CustomInput
              control={form.control}
              name="phone"
              label="WhatsApp / Mobile Number"
              placeholder="+27 79 550 1557"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
              />
              <CustomInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/3 text-xs font-bold rounded-xl cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-2/3 bg-[#156e52] hover:bg-[#0f5940] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                {form.formState.isSubmitting ? "Creating Patient Account..." : "Complete Registration"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

