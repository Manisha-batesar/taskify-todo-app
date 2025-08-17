"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTask } from "@/context/TaskContext"
import { Circle, Plus } from "lucide-react"

interface TaskInputProps {
  category: string
}

export default function TaskInput({ category }: TaskInputProps) {
  const { newTask, setNewTask, addTask } = useTask()
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<"normal" | "medium" | "high">("normal")

  const handleSubmit = (submittedPriority?: "normal" | "medium" | "high") => {
    const finalPriority = submittedPriority || priority
    addTask(category, finalPriority, dueDate)
    setPriority("normal") // Reset priority after submission
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 border-2 border-dashed border-[var(--taskify-border)] rounded-lg hover:border-[var(--taskify-content)]/30 transition-all duration-200 group">
      <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--taskify-text-secondary)] group-hover:text-[var(--taskify-content)] flex-shrink-0 mt-2 sm:mt-0 transition-colors" />
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
          className="border-none bg-transparent focus:ring-0 focus-border-none p-0 font-medium text-sm sm:text-base break-words"
          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="mt-2 px-3 py-2 border border-[var(--taskify-border)] rounded-md text-xs sm:text-sm bg-[var(--background)] w-full focus:border-[var(--taskify-content)] focus:ring-1 focus:ring-[var(--taskify-content)] transition-all duration-200"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          value={priority}
          onChange={(e) => {
            const newPriority = e.target.value as "normal" | "medium" | "high"
            setPriority(newPriority)
            if (newTask.trim()) {
              handleSubmit(newPriority)
            }
          }}
          className="px-3 py-2 border border-[var(--taskify-border)] rounded-md text-xs sm:text-sm bg-[var(--background)] flex-1 sm:flex-none focus:border-[var(--taskify-content)] focus:ring-1 focus:ring-[var(--taskify-content)] transition-all duration-200"
        >
          <option value="normal">🟢 Normal</option>
          <option value="medium">🟡 Medium</option>
          <option value="high">🔴 High</option>
        </select>
        <Button
          size="sm"
          onClick={() => handleSubmit()}
          className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white h-8 w-8 p-0 sm:h-10 sm:w-10 sm:px-3 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
    </div>
  )
}
