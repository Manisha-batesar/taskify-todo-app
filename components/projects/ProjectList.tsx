"use client"

import { useState } from "react"
import { useTask } from "@/context/TaskContext"
import type { Project } from "@/types"
import AddProjectDialog from "./AddProjectDialog"
import ProjectItem from "./ProjectItem"

interface ProjectListProps {
  onProjectSelect: (project: Project) => void
  selectedProject: Project | null
  currentView: string
}

export default function ProjectList({ onProjectSelect, selectedProject, currentView }: ProjectListProps) {
  const { customProjects, tasks, addCustomProject, editProject, deleteProject } = useTask()
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editProjectName, setEditProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddProject = async (name: string, description?: string) => {
    setIsLoading(true)
    try {
      await addCustomProject(name, description)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditProject = async (projectId: string, newName: string) => {
    setIsLoading(true)
    try {
      await editProject(projectId, newName)
    } finally {
      setIsLoading(false)
      setEditingProject(null)
      setEditProjectName("")
    }
  }

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    setIsLoading(true)
    try {
      await deleteProject(projectId)
    } finally {
      setIsLoading(false)
    }
  }

  const startEditProject = (project: Project) => {
    setEditingProject(project.id)
    setEditProjectName(project.name)
  }

  const cancelProjectEdit = () => {
    setEditingProject(null)
    setEditProjectName("")
  }

  const getTaskCount = (projectName: string) => {
    return tasks.filter((t) => t.category === projectName && !t.completed).length
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between px-4 py-2">
        <h4 className="text-sm font-semibold text-[var(--taskify-text-primary)] uppercase tracking-wide">
          Projects
        </h4>
        <AddProjectDialog 
          onAddProject={handleAddProject}
          isLoading={isLoading}
        />
      </div>

      <div className="space-y-1">
        {customProjects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            isSelected={selectedProject?.id === project.id && currentView === "project"}
            taskCount={getTaskCount(project.name)}
            onSelect={onProjectSelect}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
            isEditing={editingProject === project.id}
            onStartEdit={startEditProject}
            onCancelEdit={cancelProjectEdit}
            editingName={editProjectName}
            onEditNameChange={setEditProjectName}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  )
}
