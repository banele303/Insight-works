import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

import {
  type UserRole,
  type user,
} from "@/types";
import { FieldGroup } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { CustomInput } from "@/components/global/CustomInput";
import { CustomSelect } from "@/components/global/CustomSelect";
import { useEffect } from "react";
import { useAuth } from "@/hooks/AuthProvider";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";

export type FormType = "login" | "create" | "update";
interface Props {
  type: FormType;
  initialData?: user | null;
  onSuccess?: () => void;
  role?: UserRole;
}

const createSchema = (type: FormType) => {
  return z
    .object({
      name:
        type === "login"
          ? z.string().optional()
          : z.string().min(2, "Name is required"),
      email: z.string().email("Invalid email address"),
      role: z.string().optional(),
      phone: z.string().optional(),
      therapyFocus: z.string().optional(),
      sessionPreference: z.string().optional(),
      password:
        type === "update"
          ? z
              .string()
              .optional()
              .refine((val) => !val || val.length >= 6, {
                message: "Password must be at least 6 characters",
              })
          : z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword:
        type === "create"
          ? z.string().min(8, {
              message: "Password must be at least 8 characters.",
            })
          : z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (type === "create" && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match",
          path: ["confirmPassword"],
        });
      }
    });
};

type FormValues = z.infer<ReturnType<typeof createSchema>>;

const UniversalUserForm = ({ type, initialData, onSuccess, role }: Props) => {
  useAuth();
  const isUpdate = type === "update";
  const isLogin = type === "login";

  const form = useForm<FormValues>({
    resolver: zodResolver(createSchema(type)),
    defaultValues: {
      name: "",
      email: "",
      role: role || "student",
      phone: "",
      therapyFocus: "Individual Counselling",
      sessionPreference: "Telehealth Video",
      password: "",
    },
  });

  const { signIn } = useAuthActions();
  const createAdminUser = useMutation(api.adminUsers.createUserAdmin);
  const updateConvexUser = useMutation(api.users.updateUser);

  // Populate form for Update mode
  useEffect(() => {
    if (initialData && isUpdate) {
      form.reset({
        name: initialData.name || "",
        email: initialData.email || "",
        role: initialData.role,
        phone: (initialData as any).phone || "",
        therapyFocus: (initialData as any).therapyFocus || "Individual Counselling",
        sessionPreference: (initialData as any).sessionPreference || "Telehealth Video",
        password: "",
      });
    }
  }, [initialData, isUpdate, form]);

  async function onSubmit(data: FormValues) {
    try {
      if (type === "login") {
        await signIn("password", {
          email: data.email,
          password: data.password!,
          flow: "signIn",
        });
        toast.success("Welcome back to Insight Works");
        if (onSuccess) onSuccess();
      } else if (type === "create") {
        await createAdminUser({
          email: data.email,
          name: data.name || "",
          password: data.password!,
          role: (data.role as UserRole) || role || "student",
          phone: data.phone || undefined,
        });

        toast.success("User successfully added to practice directory");
        if (onSuccess) onSuccess();
      } else if (type === "update") {
        if (!initialData?._id) return;
        const updatePayload: any = {
          id: initialData._id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
        };
        await updateConvexUser(updatePayload);
        toast.success("Practice details updated successfully");
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.log(error);
      let friendlyMessage = error.message || "An error occurred. Please try again.";
      if (friendlyMessage.includes("InvalidAccountId")) {
        friendlyMessage = "Account not found. Please verify email or sign up.";
      } else if (friendlyMessage.includes("InvalidSecret")) {
        friendlyMessage = "Incorrect password. Please try again.";
      } else if (friendlyMessage.includes("TooManyFailedAttempts")) {
        friendlyMessage = "Too many failed attempts. Please try again later.";
      }
      toast.error(friendlyMessage);
    }
  }

  const roleOptions = [
    { label: "Client (In Therapy / Coaching)", value: "student" },
    { label: "Therapist / Practitioner", value: "teacher" },
    { label: "Partner / Family Contact", value: "parent" },
    { label: "Practice Administrator", value: "admin" },
  ];

  const disciplineOptions = [
    { label: "Individual Counselling", value: "Individual Counselling" },
    { label: "Couples & Relationships", value: "Couples & Relationships" },
    { label: "Life Coaching & Self-Mastery", value: "Life Coaching" },
    { label: "Trauma Recovery & EMDR", value: "Trauma Recovery" },
    { label: "Youth & Young Adult Support", value: "Youth Support" },
    { label: "Substance Use Recovery", value: "Substance Recovery" },
    { label: "Free Initial Consultation", value: "Free Consultation" },
  ];

  const modalityOptions = [
    { label: "Secure Telehealth Video", value: "Telehealth Video" },
    { label: "In-Person Consulting Room (Johannesburg)", value: "In-Person Room" },
  ];

  const selectedRole = form.watch("role");
  const pending = form.formState.isSubmitting;
  const showRoleSelector = !isLogin;
  const isClient = selectedRole === "student";

  return (
    <div className="space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {!isLogin && (
              <CustomInput
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="e.g. Sarah Jenkins"
                disabled={pending}
              />
            )}

            <CustomInput
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="client@example.co.za"
              disabled={pending}
            />

            {!isLogin && (
              <CustomInput
                control={form.control}
                name="phone"
                label="WhatsApp / Phone Number"
                placeholder="+27 79 550 1557"
                disabled={pending}
              />
            )}

            {showRoleSelector && (
              <CustomSelect
                control={form.control}
                name="role"
                label="Practice Directory Role"
                placeholder="Select Role"
                options={roleOptions}
                disabled={pending}
              />
            )}

            {isClient && !isLogin && (
              <>
                <CustomSelect
                  control={form.control}
                  name="therapyFocus"
                  label="Primary Therapy Discipline"
                  placeholder="Select Care Focus"
                  options={disciplineOptions}
                  disabled={pending}
                />

                <CustomSelect
                  control={form.control}
                  name="sessionPreference"
                  label="Preferred Care Modality"
                  placeholder="Select Modality"
                  options={modalityOptions}
                  disabled={pending}
                />
              </>
            )}

            {!isUpdate && (
              <CustomInput
                control={form.control}
                name="password"
                label="Portal Password"
                type="password"
                placeholder="••••••••"
                disabled={pending}
              />
            )}

            {type === "create" && (
              <CustomInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                disabled={pending}
              />
            )}
          </div>

          <Button type="submit" className="w-full mt-4 bg-[#156e52] hover:bg-[#0f5940] text-white font-bold text-xs py-3 rounded-xl cursor-pointer" disabled={pending}>
            {pending
              ? "Processing..."
              : isLogin
              ? "Sign In to Client Portal"
              : isUpdate
              ? "Update Practice Record"
              : "Save to Practice Directory"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};

export default UniversalUserForm;
