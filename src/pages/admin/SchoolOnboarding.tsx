import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle, Users, Settings, ArrowRight,
  MapPin, Phone, Mail, ShieldCheck, HeartPulse, Sparkles
} from "lucide-react";
import { toast } from "sonner";

const STEPS = [
  { id: "practice", label: "Practice Profile", icon: HeartPulse },
  { id: "practitioners", label: "Practitioners & Roles", icon: Users },
  { id: "compliance", label: "POPIA & Compliance", icon: ShieldCheck },
  { id: "complete", label: "Complete", icon: CheckCircle },
];

export default function SchoolOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const [practiceData, setPracticeData] = useState({
    name: "Insight Works Therapy & Coaching",
    leadPractitioner: "Maletsatsi Sibanda (Counselling Therapist & Life Coach)",
    hpcsaNumber: "HPCSA PRC 0048291",
    address: "Johannesburg, South Africa & Telehealth Nationwide",
    phone: "+27 79 550 1557",
    email: "maletsatsi@insightherapyandcoaching.co.za",
    tagline: "Where healing begins with connection. Reconnect, grow, and thrive.",
    primaryColor: "#156e52",
  });

  const stepsContent = [
    /* Step 0: Practice Profile */
    <Card key="practice" className="rounded-3xl border border-slate-200 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold font-serif text-[#0f2820]">
          <HeartPulse className="h-5 w-5 text-[#156e52]" /> Practice Profile &amp; Clinical Identity
        </CardTitle>
        <CardDescription className="text-xs">
          General information for Insight Works Therapy &amp; Coaching
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        <div>
          <Label className="font-bold text-slate-700">Practice Name *</Label>
          <Input
            value={practiceData.name}
            onChange={(e) => setPracticeData({ ...practiceData, name: e.target.value })}
            className="rounded-xl mt-1 text-xs"
          />
        </div>
        <div>
          <Label className="font-bold text-slate-700">Lead Practitioner &amp; HPCSA Credentials</Label>
          <Input
            value={practiceData.leadPractitioner}
            onChange={(e) => setPracticeData({ ...practiceData, leadPractitioner: e.target.value })}
            className="rounded-xl mt-1 text-xs"
          />
        </div>
        <div>
          <Label className="font-bold text-slate-700">Consulting Rooms &amp; Telehealth Coverage</Label>
          <Textarea
            value={practiceData.address}
            onChange={(e) => setPracticeData({ ...practiceData, address: e.target.value })}
            rows={2}
            className="rounded-xl mt-1 text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="font-bold text-slate-700">Phone / WhatsApp</Label>
            <Input
              value={practiceData.phone}
              onChange={(e) => setPracticeData({ ...practiceData, phone: e.target.value })}
              className="rounded-xl mt-1 text-xs"
            />
          </div>
          <div>
            <Label className="font-bold text-slate-700">Practice Email</Label>
            <Input
              value={practiceData.email}
              onChange={(e) => setPracticeData({ ...practiceData, email: e.target.value })}
              className="rounded-xl mt-1 text-xs"
            />
          </div>
        </div>
        <div>
          <Label className="font-bold text-slate-700">Practice Tagline / Philosophy</Label>
          <Input
            value={practiceData.tagline}
            onChange={(e) => setPracticeData({ ...practiceData, tagline: e.target.value })}
            className="rounded-xl mt-1 text-xs"
          />
        </div>
      </CardContent>
    </Card>,

    /* Step 1: Practitioners & Roles */
    <Card key="practitioners" className="rounded-3xl border border-slate-200 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold font-serif text-[#0f2820]">
          <Users className="h-5 w-5 text-[#ea7627]" /> Clinical Practitioners &amp; Care Roles
        </CardTitle>
        <CardDescription className="text-xs">
          Assigned roles for therapists, psychologists, life coaches, and intake staff
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
          <p className="font-bold text-[#156e52]">Maletsatsi Sibanda</p>
          <p className="text-slate-600">Lead Therapist &amp; Clinical Director · Full Practice Administration &amp; POPIA Officer</p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
          <p className="font-bold text-slate-800">Associate Therapists &amp; Coaches</p>
          <p className="text-slate-500">Configure caseload assignments, private clinical session records, and client messaging.</p>
        </div>
      </CardContent>
    </Card>,

    /* Step 2: POPIA & Compliance */
    <Card key="compliance" className="rounded-3xl border border-slate-200 shadow-xs">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold font-serif text-[#0f2820]">
          <ShieldCheck className="h-5 w-5 text-emerald-700" /> POPIA &amp; HPCSA Ethical Compliance
        </CardTitle>
        <CardDescription className="text-xs">
          Data protection governance under the Protection of Personal Information Act (Act 4 of 2013)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
          <CheckCircle className="w-4 h-4 text-[#156e52]" />
          <span>5-Year Clinical Data Retention Window Configured</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
          <CheckCircle className="w-4 h-4 text-[#156e52]" />
          <span>Client Informed Consent &amp; Emergency Protocol Initialized</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
          <CheckCircle className="w-4 h-4 text-[#156e52]" />
          <span>SADAG Crisis Helpline (0800 456 789) Hotline Integrated</span>
        </div>
      </CardContent>
    </Card>,

    /* Step 3: Complete */
    <Card key="complete" className="rounded-3xl border border-slate-200 shadow-xs text-center p-8">
      <CardContent className="space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-[#156e52] rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-[#0f2820]">Practice Onboarding Complete!</h2>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          Insight Works Therapy &amp; Coaching is fully configured. You can now manage patient intakes, schedule sessions, and explore client analytics.
        </p>
        <Button
          onClick={() => {
            window.location.href = "/wellness-insights";
          }}
          className="bg-[#156e52] hover:bg-[#0f5940] text-white font-bold text-xs px-6 py-3 rounded-xl cursor-pointer"
        >
          Go to Practice Dashboard
        </Button>
      </CardContent>
    </Card>,
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Steps Navigation Bar */}
      <div className="flex items-center justify-between border-b pb-4">
        {STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${
                currentStep === idx
                  ? "text-[#156e52] border-b-2 border-[#156e52] pb-1"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <StepIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Content */}
      {stepsContent[currentStep]}

      {/* Bottom Nav Buttons */}
      {currentStep < 3 && (
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="rounded-xl text-xs"
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (currentStep < 3) setCurrentStep(currentStep + 1);
              toast.success("Step saved successfully");
            }}
            className="bg-[#156e52] hover:bg-[#0f5940] text-white rounded-xl text-xs font-bold gap-1.5"
          >
            Next Step <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

