"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { useTask } from "@/context/TaskContext"
import { 
  Search, 
  Inbox, 
  Calendar, 
  X, 
  User, 
  FolderPlus, 
  Plus,
  Check,
  Edit2,
  Trash2
} from "lucide-react"
import { Project, CurrentView } from "@/types"

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { user, signOut } = useAuth()
  const {
    tasks,
    customProjects,
    addCustomProject,
    editProject,
    deleteProject,
    selectedProject,
    setSelectedProject,
    currentView,
    setCurrentView,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
  } = useTask()

  const [showCalendar, setShowCalendar] = useState(false)
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editProjectName, setEditProjectName] = useState("")
  const [showDateProjectCreation, setShowDateProjectCreation] = useState(false)
  const [newDateProjectName, setNewDateProjectName] = useState("")

  const handleNavigation = (view: CurrentView) => {
    setCurrentView(view)
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const selectProject = (project: Project) => {
    setSelectedProject(project)
    setCurrentView("project")
    if (window.innerWidth < 1024) {
      setSidebarOpen(false)
    }
  }

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      addCustomProject(newProjectName.trim())
      setNewProjectName("")
      setShowAddProject(false)
    }
  }

  const startEditProject = (project: Project) => {
    setEditingProject(project.id)
    setEditProjectName(project.name)
  }

  const saveProjectEdit = () => {
    if (editProjectName.trim() && editingProject) {
      editProject(editingProject, editProjectName.trim())
      setEditingProject(null)
      setEditProjectName("")
    }
  }

  const cancelProjectEdit = () => {
    setEditingProject(null)
    setEditProjectName("")
  }

  const handleDeleteProject = (projectId: string, projectName: string) => {
    if (confirm(`Are you sure you want to delete "${projectName}"? Tasks will be moved to Personal category.`)) {
      deleteProject(projectId)
    }
  }

  const addDateProject = () => {
    if (newDateProjectName.trim()) {
      const projectName = `${newDateProjectName} (${selectedDate})`
      addCustomProject(projectName)
      setNewDateProjectName("")
      setShowDateProjectCreation(false)
      const newProject = {
        id: Date.now().toString(),
        name: projectName,
        icon: Calendar,
        count: 0,
      }
      setSelectedProject(newProject)
      setCurrentView("project")
    }
  }

  const getFilteredTasks = () => {
    if (currentView === "today") {
      return tasks.filter(task => task.date === selectedDate)
    }
    return tasks
  }

  const filteredTasks = getFilteredTasks()

  const sidebarItems = [
    { icon: Search, label: "Search", count: null, view: "search" as CurrentView },
    { icon: Inbox, label: "Inbox", count: tasks.length, view: "inbox" as CurrentView },
    {
      icon: Calendar,
      label: "Today's ToDos",
      count: filteredTasks.filter((t) => !t.completed).length,
      active: currentView === "today",
      view: "today" as CurrentView,
    },
    { icon: Calendar, label: "Calendar", count: null, isCalendar: true },
  ]

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[var(--taskify-sidebar)] border-r border-[var(--taskify-border)]
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col
      `}
      >
        {/* Logo Section */}
        <div className="p-4 sm:p-6 border-b border-[var(--taskify-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/taskify-logo.png" alt="Taskify" className="w-8 h-8 sm:w-10 sm:h-10" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-[var(--taskify-text-primary)] font-display">Taskify</h1>
                <p className="text-xs sm:text-sm text-[var(--taskify-text-secondary)]">From Plan To Done</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-4 sm:p-6 border-b border-[var(--taskify-border)]">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                  <AvatarFallback className="bg-[var(--taskify-content)] text-white font-semibold text-sm sm:text-base">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center border-2 border-[var(--taskify-border)]">
                  <User className="w-2 h-2 sm:w-3 sm:h-3 text-[var(--taskify-content)]" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm sm:text-base text-[var(--taskify-text-primary)] truncate">
                  {user?.name || "User"}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--taskify-text-secondary)] truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="w-full text-[var(--taskify-text-secondary)] hover:text-[var(--taskify-text-primary)] bg-transparent"
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <nav className="space-y-1 sm:space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.isCalendar) {
                    setShowCalendar(!showCalendar)
                  } else if (item.view) {
                    handleNavigation(item.view)
                  }
                }}
                className={`
                  w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-left transition-colors
                  ${
                    item.active || currentView === item.view
                      ? "bg-[var(--taskify-content)] text-white"
                      : "text-[var(--taskify-text-secondary)] hover:bg-[var(--taskify-hover)] hover:text-[var(--taskify-text-primary)]"
                  }
                `}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="flex-1 font-medium text-sm sm:text-base truncate">{item.label}</span>
                {item.count !== null && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs flex-shrink-0">
                    {item.count}
                  </Badge>
                )}
              </button>
            ))}

            {showCalendar && (
              <div className="ml-8 p-4 bg-[var(--taskify-hover)] rounded-lg space-y-3">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setCurrentView("today")
                  }}
                  className="w-full p-2 border border-[var(--taskify-border)] rounded-md bg-white"
                />
                <div className="space-y-2">
                  <p className="text-xs text-[var(--taskify-text-secondary)]">Create project for this date:</p>
                  {showDateProjectCreation ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Project name..."
                        value={newDateProjectName}
                        onChange={(e) => setNewDateProjectName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            addDateProject()
                          }
                        }}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={addDateProject}
                        className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDateProjectCreation(true)}
                      className="w-full text-xs"
                    >
                      <FolderPlus className="w-3 h-3 mr-1" />
                      Add Project
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div className="pt-6">
              <div className="flex items-center justify-between px-4 py-2">
                <h4 className="text-sm font-semibold text-[var(--taskify-text-primary)] uppercase tracking-wide">
                  Projects
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddProject(!showAddProject)}
                  className="h-6 w-6 p-0 text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white"
                >
                  <FolderPlus className="w-4 h-4" />
                </Button>
              </div>

              {showAddProject && (
                <div className="px-4 py-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Project name..."
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddProject()
                        }
                      }}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={handleAddProject}
                      className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                {customProjects.map((project) => (
                  <div key={project.id} className="group relative">
                    {editingProject === project.id ? (
                      <div className="flex items-center gap-2 px-4 py-2">
                        <project.icon className="w-4 h-4 text-[var(--taskify-content)]" />
                        <Input
                          value={editProjectName}
                          onChange={(e) => setEditProjectName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              saveProjectEdit()
                            } else if (e.key === "Escape") {
                              cancelProjectEdit()
                            }
                          }}
                          className="flex-1 text-sm h-8"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={saveProjectEdit}
                          className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelProjectEdit}
                          className="h-6 w-6 p-0 bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => selectProject(project)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
                          selectedProject?.id === project.id && currentView === "project"
                            ? "bg-[var(--taskify-content)] text-white"
                            : "text-[var(--taskify-text-secondary)] hover:bg-[var(--taskify-hover)] hover:text-[var(--taskify-text-primary)]"
                        }`}
                      >
                        <project.icon className="w-4 h-4" />
                        <span className="flex-1 text-sm font-medium">{project.name}</span>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                          {tasks.filter((t) => t.category === project.name && !t.completed).length}
                        </Badge>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              startEditProject(project)
                            }}
                            className="h-6 w-6 p-0 hover:bg-blue-500 hover:text-white"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteProject(project.id, project.name)
                            }}
                            className="h-6 w-6 p-0 hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
