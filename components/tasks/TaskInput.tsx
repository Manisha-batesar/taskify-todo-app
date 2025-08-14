"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTask } from "@/context/TaskContext"
import { Circle, Plus } from "lucide-react"

interface TaskInputProps {
  category: string
}

export default function TaskInput({ category }: TaskInputProps) {
  const { newTask, setNewTask, addTask } = useTask()

  const handleSubmit = (priority: "normal" | "medium" | "high" = "normal") => {
    addTask(category, priority)
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 border-2 border-dashed border-[var(--taskify-border)] rounded-lg">
      <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--taskify-text-secondary)] flex-shrink-0 mt-2 sm:mt-0" />
      <div className="flex-1 w-full">
        <Input
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit()
            }
          }}
          className="border-none bg-transparent focus:ring-0 focus:border-none p-0 font-medium text-sm sm:text-base break-words"
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          onChange={(e) => {
            if (newTask.trim()) {
              handleSubmit(e.target.value as "normal" | "medium" | "high")
            }
          }}
          className="px-2 py-1 border border-[var(--taskify-border)] rounded text-xs sm:text-sm bg-white flex-1 sm:flex-none"
          defaultValue="normal"
        >
          <option value="normal">Normal</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <Button
          size="sm"
          onClick={() => handleSubmit()}
          className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  )
}
