import ProtectedRoute from "@/components/auth/ProtectedRoute"
import TaskList from "@/components/tasks/TaskList"

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
