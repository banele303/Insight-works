import { createBrowserRouter } from "react-router";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Apply from "@/pages/Apply";
import ProgramsPage from "@/pages/Programs";
import FAQ from "@/pages/FAQ";
import PrivateRoutes from "@/pages/routes/PrivateRoutes";
// Therapy practice pages
import ServicesPage from "@/pages/Services";
import IndividualCounsellingPage from "@/pages/services/IndividualCounsellingPage";
import CouplesCounsellingPage from "@/pages/services/CouplesCounsellingPage";
import LifeCoachingPage from "@/pages/services/LifeCoachingPage";
import TraumaRecoveryPage from "@/pages/services/TraumaRecoveryPage";
import YouthSupportPage from "@/pages/services/YouthSupportPage";
import SubstanceSupportPage from "@/pages/services/SubstanceSupportPage";
import BookingPage from "@/pages/Booking";
import PrivacyPage from "@/pages/Privacy";
import BlogPage from "@/pages/Blog";
import BlogPostPage from "@/pages/BlogPost";
import BlogManagement from "@/pages/admin/BlogManagement";
import WellnessDashboard from "@/pages/WellnessDashboard";
import ChatPage from "@/pages/Chat";
import Dashboard from "@/pages/Dashboard";
import AcademicYear from "@/pages/settings/academic-year";
import UserManagementPage from "@/pages/users";
import Classes from "@/pages/academics/Classes";
import { Subjects } from "@/pages/academics/Subjects";
import Timetable from "@/pages/academics/Timetable";
import Exams from "@/pages/lms/Exams";
import Exam from "../lms/Exam";
import ExamArena from "@/pages/lms/ExamArena";
import GeneralSettings from "@/pages/settings/general";
import RolesPermissions from "@/pages/settings/roles";
import AttendancePage from "@/pages/academics/Attendance";
import FeesPage from "@/pages/finance/fees";
import ExpensesPage from "@/pages/finance/expenses";
import AssignmentsPage from "@/pages/lms/Assignments";
import MaterialsPage from "@/pages/lms/Materials";
import QuestionBank from "@/pages/lms/QuestionBank";
import SalaryPage from "@/pages/finance/salary";
import AnnouncementsPage from "@/pages/Announcements";
import EventsCalendar from "@/pages/EventsCalendar";
import MessagesPage from "@/pages/Messages";
import AnalyticsPage from "@/pages/Analytics";
import BadgesPage from "@/pages/Badges";
import LearningPathsPage from "@/pages/academics/LearningPaths";

import ParentPortal from "@/pages/ParentPortal";
import StudentPortal from "@/pages/StudentPortal";
import StudyBuddyPage from "@/pages/StudyBuddy";
import ProfileSettings from "@/pages/ProfileSettings";
import ReportCardGenerator from "@/pages/academics/ReportCard";
import AssignmentDetails from "@/pages/lms/AssignmentDetails";
import ResourceLibrary from "@/pages/ResourceLibrary";
import AdminResources from "@/pages/admin/ResourceManagement";
import LiveClassesPage from "@/pages/lives/LiveClasses";
import LiveRoomPage from "@/pages/lives/LiveRoom";
import VideoLibraryPage from "@/pages/videos/VideoLibrary";
import HomeworkCheckerPage from "@/pages/ai/HomeworkChecker";
import AIMarkingPage from "@/pages/ai/AIMarking";
import HomeworkStudioPage from "@/pages/ai/HomeworkStudio";
import StudyGroupsPage from "@/pages/groups/StudyGroups";
import PeerTutoringPage from "@/pages/tutoring/PeerTutoring";
import SchoolOnboarding from "@/pages/admin/SchoolOnboarding";
import ApplicationsAdmin from "@/pages/admin/ApplicationsAdmin";
import CRMPipeline from "@/pages/admin/CRMPipeline";
import PremiumSuite from "@/pages/premium/PremiumSuite";
import WhiteboardList from "@/pages/whiteboard/WhiteboardList";
import WhiteboardPage from "@/pages/whiteboard/WhiteboardPage";
// Therapy & Coaching Video Call
import TherapyLobby from "@/pages/therapy/TherapyLobby";
import TherapyRoom from "@/pages/therapy/TherapyRoom";
import AppointmentsCRM from "@/pages/AppointmentsCRM";

import ScrollToTop from "@/components/global/ScrollToTop";
import { Outlet } from "react-router";
import AdminOnlyRoute from "@/pages/routes/AdminOnlyRoute";

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home />, errorElement: <RouteErrorBoundary /> },
      { path: "login", element: <Login />, errorElement: <RouteErrorBoundary /> },
      { path: "about", element: <About />, errorElement: <RouteErrorBoundary /> },
      { path: "contact", element: <Contact />, errorElement: <RouteErrorBoundary /> },
      { path: "apply", element: <BookingPage />, errorElement: <RouteErrorBoundary /> },
      { path: "programs", element: <ServicesPage />, errorElement: <RouteErrorBoundary /> },
      { path: "faq", element: <FAQ />, errorElement: <RouteErrorBoundary /> },
      // Therapy practice routes
      { path: "services", element: <ServicesPage />, errorElement: <RouteErrorBoundary /> },
      { path: "services/individual-counselling", element: <IndividualCounsellingPage />, errorElement: <RouteErrorBoundary /> },
      { path: "services/couples-counselling", element: <CouplesCounsellingPage />, errorElement: <RouteErrorBoundary /> },
      { path: "services/life-coaching", element: <LifeCoachingPage />, errorElement: <RouteErrorBoundary /> },
      { path: "services/trauma-recovery", element: <TraumaRecoveryPage />, errorElement: <RouteErrorBoundary /> },
      { path: "services/youth-support", element: <YouthSupportPage />, errorElement: <RouteErrorBoundary /> },
      { path: "services/substance-support", element: <SubstanceSupportPage />, errorElement: <RouteErrorBoundary /> },
      { path: "booking", element: <BookingPage />, errorElement: <RouteErrorBoundary /> },
      { path: "intake", element: <BookingPage />, errorElement: <RouteErrorBoundary /> },
      { path: "chat", element: <ChatPage />, errorElement: <RouteErrorBoundary /> },
      { path: "privacy", element: <PrivacyPage />, errorElement: <RouteErrorBoundary /> },
      { path: "blog", element: <BlogPage />, errorElement: <RouteErrorBoundary /> },
      { path: "blog/:slug", element: <BlogPostPage />, errorElement: <RouteErrorBoundary /> },
      { path: "wellness-insights", element: <WellnessDashboard />, errorElement: <RouteErrorBoundary /> },
      // ─── THERAPY VIDEO CALL (public lobby, clients join without auth) ─────────
      { path: "therapy-lobby/:roomId", element: <TherapyLobby />, errorElement: <RouteErrorBoundary /> },
      {
        element: <PrivateRoutes />,
        errorElement: <RouteErrorBoundary />,
        children: [
          // ── Routes accessible to ALL logged-in users ──────────────────
          { path: "dashboard", element: <Dashboard /> },
          { path: "appointments", element: <AppointmentsCRM /> },
          { path: "activities-log", element: <Dashboard /> },
          { path: "profile", element: <ProfileSettings /> },
          { path: "resources", element: <ResourceLibrary /> },
          { path: "messages", element: <MessagesPage /> },
          { path: "events", element: <EventsCalendar /> },
          { path: "announcements", element: <AnnouncementsPage /> },
          { path: "parent-portal", element: <ParentPortal /> },
          { path: "student-portal", element: <StudentPortal /> },
          { path: "study-buddy", element: <StudyBuddyPage /> },

          // Therapy video room (authenticated users only)
          { path: "therapy-room/:roomId", element: <TherapyRoom /> },

          // AI tools (all roles)
          { path: "ai/homework", element: <HomeworkStudioPage /> },
          { path: "ai/homework-checker", element: <HomeworkCheckerPage /> },
          { path: "ai/marking", element: <AIMarkingPage /> },

          // ── Admin-only routes (role === "admin" required) ─────────────
          {
            element: <AdminOnlyRoute />,
            children: [
              // People & Caseload — admin only
              { path: "users", element: <UserManagementPage role="student" title="Client Caseload Directory" description="Manage active clinical caseload, therapy disciplines, session modalities, and POPIA consent records." /> },
              { path: "users/students", element: <UserManagementPage role="student" title="Client Caseload Directory" description="Manage active clinical caseload, therapy disciplines, session modalities, and POPIA consent records." /> },
              { path: "users/teachers", element: <UserManagementPage role="teacher" title="Practitioners & Coaches" description="Manage counselling therapists, psychologists, and life coaches." /> },
              { path: "users/parents", element: <UserManagementPage role="parent" title="Partners & Family" description="Manage partner, guardian, and family contacts." /> },
              { path: "users/admins", element: <UserManagementPage role="admin" title="Practice Administrators" description="Manage practice administrative access." /> },

              // Admin tools
              { path: "admin/resources", element: <AdminResources /> },
              { path: "admin/applications", element: <ApplicationsAdmin /> },
              { path: "admin/pipeline", element: <CRMPipeline /> },
              { path: "admin/blogs", element: <BlogManagement /> },
              { path: "admin/onboarding", element: <SchoolOnboarding /> },

              // Analytics & Reporting
              { path: "analytics", element: <AnalyticsPage /> },
              { path: "badges", element: <BadgesPage /> },

              // Settings
              { path: "settings/academic-years", element: <AcademicYear /> },
              { path: "settings/general", element: <GeneralSettings /> },
              { path: "settings/roles", element: <RolesPermissions /> },

              // Academics management
              { path: "classes", element: <Classes /> },
              { path: "subjects", element: <Subjects /> },
              { path: "timetable", element: <Timetable /> },
              { path: "attendance", element: <AttendancePage /> },
              { path: "learning-paths", element: <LearningPathsPage /> },
              { path: "report-cards", element: <ReportCardGenerator /> },

              // LMS management
              { path: "lms/assignments", element: <AssignmentsPage /> },
              { path: "lms/assignments/:id", element: <AssignmentDetails /> },
              { path: "lms/exams", element: <Exams /> },
              { path: "lms/exams/:id", element: <Exam /> },
              { path: "lms/exams/:id/arena", element: <ExamArena /> },
              { path: "lms/exam-arena", element: <ExamArena /> },
              { path: "lms/question-bank", element: <QuestionBank /> },
              { path: "lms/materials", element: <MaterialsPage /> },

              // Live & Media
              { path: "lives", element: <LiveClassesPage /> },
              { path: "lives/room/:id", element: <LiveRoomPage /> },
              { path: "videos", element: <VideoLibraryPage /> },
              { path: "whiteboard", element: <WhiteboardList /> },
              { path: "whiteboard/:id", element: <WhiteboardPage /> },

              // Premium / Command center
              { path: "command-center", element: <PremiumSuite /> },
              { path: "lesson-studio", element: <PremiumSuite /> },
              { path: "student-timeline", element: <PremiumSuite /> },
              { path: "parent-reports", element: <PremiumSuite /> },
              { path: "class-engagement", element: <PremiumSuite /> },
              { path: "recording-studio", element: <PremiumSuite /> },
              { path: "teacher-marketplace", element: <PremiumSuite /> },
              { path: "offline-mode", element: <PremiumSuite /> },
              { path: "white-label", element: <PremiumSuite /> },
              { path: "ai-tutor-memory", element: <PremiumSuite /> },
            ],
          },
        ],
      },
    ],
  },
]);

