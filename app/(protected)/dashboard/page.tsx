import type { Metadata } from "next"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardLayout from "@/components/layout/DashboardLayout"

export const metadata: Metadata = {
  title: "Dashboard - Your Task Management Hub",
  description: "Access your personal task management dashboard. View, organize, and manage your tasks, projects, and deadlines in one central location.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  )
}
