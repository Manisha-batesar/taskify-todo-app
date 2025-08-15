"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { FolderPlus, Plus } from "lucide-react"

interface AddProjectDialogProps {
  onAddProject: (name: string, description?: string) => Promise<void>
  isLoading?: boolean
}

export default function AddProjectDialog({ onAddProject, isLoading = false }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (projectName.trim() && !isLoading) {
      try {
        await onAddProject(projectName.trim(), projectDescription.trim() || undefined)
        setProjectName("")
        setProjectDescription("")
        setOpen(false)
      } catch (error) {
        console.error('Failed to create project:', error)
      }
    }
  }

  const handleCancel = () => {
    setProjectName("")
    setProjectDescription("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-[var(--taskify-content)] hover:bg-[var(--taskify-content)]"
          disabled={isLoading}
        >
          <FolderPlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-[var(--taskify-content)]" />
            Create New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Enter project description (optional)..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              disabled={isLoading}
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
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
              className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white"
              disabled={isLoading || !projectName.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Project
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
