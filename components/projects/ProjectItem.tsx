"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Check, X, Edit, Trash2 } from "lucide-react"
import type { Project } from "@/types"

interface ProjectItemProps {
  project: Project
  isSelected: boolean
  taskCount: number
  onSelect: (project: Project) => void
  onEdit: (projectId: string, newName: string) => Promise<void>
  onDelete: (projectId: string, projectName: string) => Promise<void>
  isEditing?: boolean
  onStartEdit: (project: Project) => void
  onCancelEdit: () => void
  editingName?: string
  onEditNameChange: (name: string) => void
  isLoading?: boolean
}

export default function ProjectItem({
  project,
  isSelected,
  taskCount,
  onSelect,
  onEdit,
  onDelete,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
  editingName = "",
  onEditNameChange,
  isLoading = false
}: ProjectItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleEdit = async () => {
    if (editingName.trim() && !isUpdating) {
      setIsUpdating(true)
      try {
        await onEdit(project.id, editingName.trim())
        onCancelEdit()
      } catch (error) {
        console.error('Failed to update project:', error)
      } finally {
        setIsUpdating(false)
      }
    }
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

  if (isEditing) {
    return (
      <div className="group relative">
        <div className="flex items-center gap-2 px-4 py-2">
          <project.icon className="w-4 h-4 text-[var(--taskify-content)]" />
          <Input
            value={editingName}
            onChange={(e) => onEditNameChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleEdit()
              } else if (e.key === "Escape") {
                onCancelEdit()
              }
            }}
            className="flex-1 text-sm h-8"
            autoFocus
            disabled={isUpdating}
          />
          <Button
            size="sm"
            onClick={handleEdit}
            className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600 text-white"
            disabled={isUpdating || !editingName.trim()}
          >
            {isUpdating ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check className="w-3 h-3" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onCancelEdit}
            className="h-6 w-6 p-0 bg-transparent"
            disabled={isUpdating}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative">
      <button
        onClick={() => onSelect(project)}
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
          isSelected
            ? "bg-[var(--taskify-content)] text-white"
            : "text-[var(--taskify-text-secondary)] hover:bg-[var(--taskify-hover)] hover:text-[var(--taskify-text-primary)]"
        }`}
        disabled={isLoading}
      >
        <project.icon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-sm font-medium truncate">{project.name}</span>
        <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs flex-shrink-0">
          {taskCount}
        </Badge>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onStartEdit(project)
            }}
            className="h-6 w-6 p-0 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
            disabled={isLoading}
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="h-6 w-6 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
            disabled={isLoading || isDeleting}
          >
            {isDeleting ? (
              <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
          </Button>
        </div>
      </button>
    </div>
  )
}
