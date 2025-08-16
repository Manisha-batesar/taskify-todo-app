"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTask } from "@/context/TaskContext"
import { Plus } from "lucide-react"
import TaskCard from "./TaskCard"
import TaskInput from "./TaskInput"
import { Task } from "@/types"

export default function TaskList() {
  const {
    tasks,
    currentView,
    selectedProject,
    selectedDate,
    searchQuery,
    filterPriority,
    filterDate,
    addTask,
  } = useTask()

  const getFilteredTasks = () => {
    let filtered = tasks.filter((task) => {
      const priorityMatch = filterPriority === "all" || task.priority === filterPriority
      const dateMatch = filterDate === "all" || task.date === filterDate

      if (currentView === "today") {
        const today = new Date().toISOString().split("T")[0]
        return priorityMatch && dateMatch && task.dueDate === today
      } else if (currentView === "project" && selectedProject) {
        return priorityMatch && dateMatch && task.category === selectedProject.name
      } else if (currentView === "inbox") {
        return priorityMatch && dateMatch
      } else if (currentView === "search") {
        return priorityMatch && dateMatch
      }

      return priorityMatch && dateMatch
    })

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }

  const filteredTasks = getFilteredTasks()

  const groupedTasks = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = []
      }
      acc[task.category].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  if (currentView === "project" && selectedProject) {
    return (
      <Card className="bg-[var(--background)] border-[var(--taskify-border)] shadow-sm overflow-hidden">
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <selectedProject.icon className="w-4 h-4 sm:w-6 sm:h-6 text-[var(--taskify-content)] flex-shrink-0" />
              <h3 className="text-sm sm:text-lg font-semibold text-[var(--taskify-text-primary)] font-display truncate">
                {selectedProject.name}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white flex-shrink-0 ml-2 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
              onClick={() => addTask(selectedProject.name)}
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add task</span>
            </Button>
          </div>

          <div className="space-y-2 sm:space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            <TaskInput category={selectedProject.name} />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show message if no tasks in Inbox or Today views
  const isInboxOrToday = currentView === "inbox" || (currentView === "today")
  if (isInboxOrToday && filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-[var(--taskify-text-secondary)]">
        <span className="text-2xl mb-2">🗒️</span>
        <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
        <p className="text-sm">Add a new task to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedTasks).map(([category, categoryTasks]) => (
        <Card key={category} className="bg-[var(--background)] border-[var(--taskify-border)] shadow-sm overflow-hidden">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <h3 className="text-sm sm:text-lg font-semibold text-[var(--taskify-text-primary)] font-display truncate flex-1">
                {category}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white flex-shrink-0 ml-2 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
                onClick={() => addTask(category)}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Add task</span>
              </Button>
            </div>

            <div className="space-y-2 sm:space-y-4">
              {categoryTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}

              <TaskInput category={category} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
