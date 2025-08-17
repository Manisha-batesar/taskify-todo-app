"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { FolderPlus, Plus, Edit, Save } from "lucide-react"
import type { Project } from "@/types"

interface ProjectDialogProps {
  mode?: "create" | "edit"
  project?: Project
  onAddProject?: (name: string, description?: string) => Promise<void>
  onEditProject?: (id: string, name: string, description?: string) => Promise<void>
  isLoading?: boolean
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function ProjectDialog({ 
  mode = "create", 
  project, 
  onAddProject, 
  onEditProject, 
  isLoading = false,
  trigger,
  open,
  onOpenChange
}: ProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  // Initialize form data when editing
  useEffect(() => {
    if (mode === "edit" && project) {
      setProjectName(project.name)
      setProjectDescription(project.description || "")
    } else {
      setProjectName("")
      setProjectDescription("")
    }
  }, [mode, project, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (projectName.trim() && !isLoading) {
      try {
        if (mode === "create" && onAddProject) {
          await onAddProject(projectName.trim(), projectDescription.trim() || undefined)
        } else if (mode === "edit" && onEditProject && project) {
          await onEditProject(project.id, projectName.trim(), projectDescription.trim() || undefined)
        }
        
        if (mode === "create") {
          setProjectName("")
          setProjectDescription("")
        }
        setIsOpen(false)
      } catch (error) {
        console.error(`Failed to ${mode} project:`, error)
      }
    }
  }

  const handleCancel = () => {
    if (mode === "create") {
      setProjectName("")
      setProjectDescription("")
    } else if (project) {
      setProjectName(project.name)
      setProjectDescription(project.description || "")
    }
    setIsOpen(false)
  }

  const isCreate = mode === "create"
  const defaultTrigger = (
    <Button
      variant="ghost"
      size="sm"
      className={isCreate 
        ? "h-6 w-6 p-0 text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white"
        : "h-6 w-6 p-0 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
      }
      disabled={isLoading}
    >
      {isCreate ? <FolderPlus className="w-4 h-4" /> : <Edit className="w-3 h-3" />}
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCreate ? (
              <>
                <FolderPlus className="w-5 h-5 text-[var(--taskify-content)]" />
                Create New Project
              </>
            ) : (
              <>
                <Edit className="w-5 h-5 text-blue-500" />
                Edit Project
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={isLoading}
              autoFocus
              className="h-12 px-4"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Enter project description (optional)..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="resize-none px-4 py-3"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={isCreate 
                ? "bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              }
              disabled={isLoading || !projectName.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isCreate ? "Creating..." : "Saving..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isCreate ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {isCreate ? "Create Project" : "Save Changes"}
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
