"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTask } from "@/context/TaskContext"
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Calendar, 
  Edit3, 
  Trash2 
} from "lucide-react"
import { Task } from "@/types"

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const { toggleTask, editTask, deleteTask } = useTask()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)

  const handleSave = () => {
    if (editTitle.trim()) {
      editTask(task.id, editTitle.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setIsEditing(false)
  }

  return (
    <div className="flex items-start sm:items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg hover:bg-[var(--taskify-hover)] transition-colors group min-w-0">
      <button onClick={() => toggleTask(task.id)} className="flex-shrink-0 mt-1 sm:mt-0">
        {task.completed ? (
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
        ) : (
          <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--taskify-text-secondary)] group-hover:text-[var(--taskify-content)]" />
        )}
      </button>

      <div className="flex-1 min-w-0 overflow-hidden">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSave()
                if (e.key === "Escape") handleCancel()
              }}
              className="flex-1 text-sm sm:text-base break-words"
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm px-2 sm:px-3"
              >
                Save
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleCancel} 
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p
              className={`font-medium text-sm sm:text-base break-words word-wrap ${
                task.completed
                  ? "line-through text-[var(--taskify-text-secondary)]"
                  : "text-[var(--taskify-text-primary)]"
              }`}
              style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
            >
              {task.title}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              {task.time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[var(--taskify-text-secondary)]" />
                  <span className="text-xs text-[var(--taskify-text-secondary)]">{task.time}</span>
                </div>
              )}
              {task.date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[var(--taskify-text-secondary)]" />
                  <span className="text-xs text-[var(--taskify-text-secondary)]">{task.date}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
        {task.priority && (
          <Badge
            variant="secondary"
            className={`text-xs ${
              task.priority === "high" ? "bg-red-100 text-red-700 border-red-200" : ""
            } ${
              task.priority === "medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : ""
            } ${
              task.priority === "normal" ? "bg-green-100 text-green-700 border-green-200" : ""
            }`}
          >
            {task.priority}
          </Badge>
        )}

        <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-[var(--taskify-text-secondary)] hover:text-[var(--taskify-content)] hover:bg-[var(--taskify-content)]/10"
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteTask(task.id)}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-[var(--taskify-text-secondary)] hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
