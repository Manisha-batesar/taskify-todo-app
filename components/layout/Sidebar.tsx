"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { useTask } from "@/context/TaskContext"
import ProjectList from "@/components/projects/ProjectList"
import { 
  Search, 
  Inbox, 
  Calendar, 
  X, 
  User, 
  FolderPlus, 
  Plus
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
    selectedProject,
    setSelectedProject,
    currentView,
    setCurrentView,
    selectedDate,
    setSelectedDate,
  } = useTask()

  const [showCalendar, setShowCalendar] = useState(false)
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

  const addDateProject = () => {
    // This is a placeholder for now - you may want to implement this functionality
    if (newDateProjectName.trim()) {
      setNewDateProjectName("")
      setShowDateProjectCreation(false)
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

            <ProjectList 
              onProjectSelect={selectProject}
              selectedProject={selectedProject}
              currentView={currentView}
            />
          </nav>
        </div>
      </div>
    </>
  )
}
