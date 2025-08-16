import type { Metadata } from "next"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import TaskList from "@/components/tasks/TaskList"

export const metadata: Metadata = {
  title: "Today's Tasks - Focus on What Matters",
  description: "View and manage your tasks scheduled for today. Stay focused and productive with your daily task overview.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function TodayTasksPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--taskify-background)]">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">Today's Tasks</h1>
          <TaskList />
        </div>
      </div>
    </ProtectedRoute>
  )
}
