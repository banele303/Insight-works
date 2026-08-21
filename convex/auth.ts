import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

const ADMIN_EMAILS = [
  "alexsouthflow@gmail.com",
  "ramadimukondi13@gmail.com",
  "alexsouthflow2@gmail.com",
  "alxsouthflow2@gmail.com",
];

function isConvexIdLike(value: unknown) {
  return typeof value === "string" && /^[a-z0-9]{20,}$/.test(value);
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = String(params.email || "").trim().toLowerCase();
        const isAdminEmail = ADMIN_EMAILS.includes(email);
        const studentClass = isConvexIdLike(params.studentClass)
          ? params.studentClass
          : undefined;
        const teacherSubject = Array.isArray(params.teacherSubject)
          ? params.teacherSubject.filter(isConvexIdLike)
          : undefined;

        // Default role is always "student" (Patient/Client) for all public signups
        const assignedRole = isAdminEmail ? "admin" : (params.role || "student");

        return {
          email,
          ...(params.name ? { name: params.name } : {}),
          role: assignedRole,
          isApproved: true, // Instantly active & live for all users
          isActive: true,
          onboardingCompleted: true,
          ...(studentClass ? { studentClass: studentClass as any } : {}),
          ...(teacherSubject && teacherSubject.length > 0
            ? { teacherSubject: teacherSubject as any }
            : {}),
        };
      },
    }),
  ],
});

