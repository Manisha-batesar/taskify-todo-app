"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import ProjectDialog from "./ProjectDialog"
import type { Project } from "@/types"

interface ProjectItemProps {
  project: Project
  isSelected: boolean
  taskCount: number
  onSelect: (project: Project) => void
  onEdit: (projectId: string, newName: string, description?: string) => Promise<void>
  onDelete: (projectId: string, projectName: string) => Promise<void>
  isLoading?: boolean
}

export default function ProjectItem({
  project,
  isSelected,
  taskCount,
  onSelect,
  onEdit,
  onDelete,
  isLoading = false
}: ProjectItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = async (id: string, name: string, description?: string) => {
    await onEdit(id, name, description)
  }

  const handleDelete = async () => {
    if (isDeleting) return

    const confirmMessage = taskCount > 0
      ? `Are you sure you want to delete "${project.name}"? This will also delete ${taskCount} associated task(s).`
      : `Are you sure you want to delete "${project.name}"?`

    if (confirm(confirmMessage)) {
      setIsDeleting(true)
      try {
        await onDelete(project.id, project.name)
      } catch (error) {
        console.error('Failed to delete project:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="group relative">
      <button
        onClick={() => onSelect(project)}
        className={`w-full flex items-start gap-3 px-4 py-3 rounded-lg text-left transition-colors ${isSelected
            ? "bg-[var(--taskify-content)] text-white"
            : "text-[var(--taskify-text-secondary)] hover:bg-[var(--taskify-hover)] hover:text-[var(--taskify-text-primary)]"
          }`}
        disabled={isLoading}
      >
        <project.icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate pr-2">{project.name}</span>
            <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs flex-shrink-0">
              {taskCount}
            </Badge>
          </div>
          {project.description && (
            <p className={`text-xs mt-1 line-clamp-2 ${isSelected
                ? "text-white/80"
                : "text-[var(--taskify-text-secondary)]"
              }`}>
              {project.description}
            </p>
          )}
        </div>

        <div className="flex gap-1 ml-2 flex-shrink-0">
          <ProjectDialog
            mode="edit"
            project={project}
            onEditProject={handleEdit}
            isLoading={isLoading}
            trigger={
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
                className={`h-6 w-6 p-0 text-[var(--taskify-content)] hover:bg-[var(--taskify-content)]/10 hover:text-[var(--taskify-content)] ${isSelected ? 'text-white' : ''}`}
                disabled={isLoading}
              ><Edit /> </Button>
            }
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className={`h-6 w-6 p-0 text-red-500 hover:text-red-500`}
            disabled={isLoading || isDeleting}
          >
            {isDeleting ? (
              <div className="w-3 h-3 border border-[var(--taskify-content)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
          </Button>
        </div>
      </button>
    </div>
  )
}
