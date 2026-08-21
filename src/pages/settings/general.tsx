import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/global/CustomInput";
import { FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save, ShieldCheck, HeartPulse, Sparkles, Building, Phone, Mail, MapPin } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Practice name is required"),
  address: z.string().min(5, "Practice location is required"),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  motto: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function GeneralSettings() {
  const settings = useQuery(api.schoolSettings.getSettings);
  const updateSettings = useMutation(api.schoolSettings.updateSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "Insight Works Therapy & Coaching",
      address: "Johannesburg, Gauteng, South Africa (In-person & Telehealth)",
      phone: "+27 79 550 1557",
      email: "maletsatsi@insightherapyandcoaching.co.za",
      motto: "Where Healing Begins with Connection · HPCSA Registered",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        name: settings.name || "Insight Works Therapy & Coaching",
        address: settings.address || "Johannesburg, Gauteng, South Africa",
        phone: settings.phone || "+27 79 550 1557",
        email: settings.email || "maletsatsi@insightherapyandcoaching.co.za",
        motto: settings.motto || "Where Healing Begins with Connection",
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await updateSettings({
        id: settings?._id,
        ...data,
      });
      toast.success("Practice settings and profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update practice settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 bg-[#fbfdfc] dark:bg-slate-950 min-h-screen text-[#0f2820] dark:text-slate-100" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#156e52] dark:text-emerald-400 mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          POPIA &amp; Practice Compliance
        </div>
        <h1 className="text-3xl font-black font-serif tracking-tight text-[#0f2820] dark:text-white">
          Practice Profile &amp; Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure clinical practice credentials, emergency crisis disclosures, and POPIA contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <CardTitle className="text-lg font-bold font-serif text-[#0f2820] dark:text-white">
                Practice Identity &amp; Contact Details
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                This information appears on appointment confirmations, booking calendar invites, and intake disclosures.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FieldGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <CustomInput
                        control={form.control}
                        name="name"
                        label="Practice Name"
                        placeholder="Insight Works Therapy & Coaching"
                      />
                    </div>

                    <div>
                      <CustomInput
                        control={form.control}
                        name="email"
                        label="Practice Email Address"
                        placeholder="maletsatsi@insightherapyandcoaching.co.za"
                      />
                    </div>

                    <div>
                      <CustomInput
                        control={form.control}
                        name="phone"
                        label="WhatsApp & Direct Contact"
                        placeholder="+27 79 550 1557"
                      />
                    </div>

                    <div className="col-span-2">
                      <CustomInput
                        control={form.control}
                        name="address"
                        label="Consulting Rooms / Location"
                        placeholder="Johannesburg, Gauteng (In-person & Telehealth nationwide)"
                      />
                    </div>

                    <div className="col-span-2">
                      <CustomInput
                        control={form.control}
                        name="motto"
                        label="Practice Philosophy / Tagline"
                        placeholder="Where Healing Begins with Connection"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-[#156e52] hover:bg-[#0f5940] text-white font-bold text-xs py-3 rounded-xl gap-2 shadow-2xs cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving Practice Settings...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Practice Profile
                      </>
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Side Compliance Panel */}
        <div className="space-y-6">
          <Card className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-[#156e52] dark:text-emerald-400 font-bold text-sm font-serif">
                <ShieldCheck className="w-4 h-4" />
                <span>POPIA Compliance Status</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <p><strong>POPIA Registered:</strong> Compliant under South African Protection of Personal Information Act.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <p><strong>Data Retention:</strong> 5-year clinical record preservation window active.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <p><strong>Telehealth Encryption:</strong> 256-bit encrypted end-to-end video stream.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm font-serif">
                <HeartPulse className="w-4 h-4" />
                <span>24/7 Crisis Hotline Protocol</span>
              </div>
            </CardHeader>
            <CardContent className="text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <p>In cases of acute emergency or suicidal distress, clients are routed to:</p>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl font-bold text-rose-700 dark:text-rose-400 text-center">
                SADAG 24/7 Helpline: 0800 456 789
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
