"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface AddProjectFormProps {
  onAddProject: (name: string) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function AddProjectForm({ onAddProject, onCancel, isLoading = false }: AddProjectFormProps) {
  const [projectName, setProjectName] = useState("")

  const handleSubmit = async () => {
    if (projectName.trim() && !isLoading) {
      try {
        await onAddProject(projectName.trim())
        setProjectName("")
        onCancel()
      } catch (error) {
        console.error('Failed to create project:', error)
      }
    }
  }

  return (
    <div className="px-4 py-2">
      <div className="flex gap-2">
        <Input
          placeholder="Project name..."
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSubmit()
            } else if (e.key === "Escape") {
              onCancel()
            }
          }}
          className="text-sm"
          disabled={isLoading}
          autoFocus
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white"
          disabled={isLoading || !projectName.trim()}
        >
          {isLoading ? (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          className="bg-transparent"
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
