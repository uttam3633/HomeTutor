import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { AboutPage } from "../pages/AboutPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { ContactPage } from "../pages/ContactPage";
import { FindStudentsPage } from "../pages/FindStudentsPage";
import { FindTutorPage } from "../pages/FindTutorPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { ParentDashboardPage } from "../pages/ParentDashboardPage";
import { PostAvailabilityPage } from "../pages/PostAvailabilityPage";
import { PostRequirementPage } from "../pages/PostRequirementPage";
import { PricingPage } from "../pages/PricingPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ReviewsPage } from "../pages/ReviewsPage";
import { TutorDashboardPage } from "../pages/TutorDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "find-tutor", element: <FindTutorPage /> },
      { path: "find-students", element: <FindStudentsPage /> },
      { path: "post-requirement", element: <PostRequirementPage /> },
      { path: "post-availability", element: <PostAvailabilityPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "parent-dashboard", element: <ParentDashboardPage /> },
      { path: "tutor-dashboard", element: <TutorDashboardPage /> },
      { path: "admin-dashboard", element: <AdminDashboardPage /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
    ],
  },
]);
