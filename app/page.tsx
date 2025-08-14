"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  Menu,
  Inbox,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Briefcase,
  Filter,
  Bell,
  Edit3,
  Trash2,
  FolderPlus,
  LogIn,
  UserPlus,
  X,
  User,
  Edit2,
  Check,
  Palette,
  Sun,
  Moon,
  Monitor,
} from "lucide-react"

interface Task {
  id: string
  title: string
  time?: string
  completed: boolean
  priority?: "high" | "medium" | "normal"
  category: string
  date?: string
}

interface Project {
  id: string
  name: string
  icon: any
  count: number
}

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Do 30 minutes of yoga",
    time: "7:30 AM",
    completed: false,
    priority: "medium",
    category: "Personal",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    title: "Dentist appointment",
    time: "10:00 AM",
    completed: false,
    priority: "high",
    category: "Personal",
    date: new Date().toISOString().split("T")[0],
  },
]

export default function TaskifyApp() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [newTask, setNewTask] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [showCalendar, setShowCalendar] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTaskTitle, setEditTaskTitle] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterDate, setFilterDate] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [newProjectName, setNewProjectName] = useState("")
  const [showAddProject, setShowAddProject] = useState(false)

  const [customProjects, setCustomProjects] = useState<Project[]>([])

  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editProjectName, setEditProjectName] = useState("")

  const [currentView, setCurrentView] = useState<string>("today")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDateProjectCreation, setShowDateProjectCreation] = useState(false)
  const [newDateProjectName, setNewDateProjectName] = useState("")

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [signInEmail, setSignInEmail] = useState("")
  const [signInPassword, setSignInPassword] = useState("")
  const [signUpEmail, setSignUpEmail] = useState("")
  const [signUpPassword, setSignUpPassword] = useState("")
  const [signUpName, setSignUpName] = useState("")
  const [currentUserName, setCurrentUserName] = useState("")
  const [currentUserEmail, setCurrentUserEmail] = useState("")

  const [currentTheme, setCurrentTheme] = useState<"default" | "light" | "dark">("default")
  const [showThemeSelector, setShowThemeSelector] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchInputRef, setSearchInputRef] = useState<HTMLInputElement | null>(null)

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const addTask = (category: string, priority: "normal" | "medium" | "high" = "normal") => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        category,
        priority,
        date: selectedDate,
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const addTaskToProject = (projectName: string, priority: "normal" | "medium" | "high" = "normal") => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        category: projectName,
        priority,
        date: selectedDate,
      }
      setTasks([...tasks, task])
      setNewTask("")
    }
  }

  const addDateProject = () => {
    if (newDateProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: `${newDateProjectName} (${selectedDate})`,
        icon: Calendar,
        count: 0,
      }
      setCustomProjects([...customProjects, newProject])
      setNewDateProjectName("")
      setShowDateProjectCreation(false)
      setSelectedProject(newProject)
      setCurrentView("project")
    }
  }

  const selectProject = (project: Project) => {
    setSelectedProject(project)
    setCurrentView("project")
  }

  const switchTheme = (theme: "default" | "light" | "dark") => {
    setCurrentTheme(theme)
    setShowThemeSelector(false)

    const root = document.documentElement

    if (theme === "light") {
      root.style.setProperty("--taskify-background", "#ffffff")
      root.style.setProperty("--taskify-content", "#007bff")
      root.style.setProperty("--taskify-sidebar", "#f8f9fa")
      root.style.setProperty("--taskify-border", "#e0e0e0")
      root.style.setProperty("--taskify-hover", "#f8f9fa")
      root.style.setProperty("--taskify-accent", "#0056b3")
      root.style.setProperty("--taskify-text-primary", "#111111")
      root.style.setProperty("--taskify-text-secondary", "#222222")
    } else if (theme === "dark") {
      root.style.setProperty("--taskify-background", "#121212")
      root.style.setProperty("--taskify-content", "#3399ff")
      root.style.setProperty("--taskify-sidebar", "#1a1a1a")
      root.style.setProperty("--taskify-border", "#333333")
      root.style.setProperty("--taskify-hover", "#2a2a2a")
      root.style.setProperty("--taskify-accent", "#2980ff")
      root.style.setProperty("--taskify-text-primary", "#ffffff")
      root.style.setProperty("--taskify-text-secondary", "#e0e0e0")
    } else {
      // Default theme - reset to original values
      root.style.setProperty("--taskify-background", "#dcedf2")
      root.style.setProperty("--taskify-content", "#a1c8fa")
      root.style.setProperty("--taskify-sidebar", "#ffffff")
      root.style.setProperty("--taskify-border", "#e2e8f0")
      root.style.setProperty("--taskify-hover", "#f8fafc")
      root.style.setProperty("--taskify-accent", "#8bb4f0")
      root.style.setProperty("--taskify-text-primary", "#1e293b")
      root.style.setProperty("--taskify-text-secondary", "#64748b")
    }
  }

  const handleSidebarNavigation = (view: string) => {
    setCurrentView(view)

    if (view === "search" && searchInputRef) {
      setTimeout(() => {
        searchInputRef.focus()
      }, 100)
    }
  }

  const startEditTask = (task: Task) => {
    setEditingTask(task.id)
    setEditTaskTitle(task.title)
  }

  const saveEditTask = () => {
    if (editingTask && editTaskTitle.trim()) {
      setTasks(tasks.map((task) => (task.id === editingTask ? { ...task, title: editTaskTitle } : task)))
      setEditingTask(null)
      setEditTaskTitle("")
    }
  }

  const cancelEditTask = () => {
    setEditingTask(null)
    setEditTaskTitle("")
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const addCustomProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        icon: Briefcase,
        count: 0,
      }
      setCustomProjects([...customProjects, newProject])
      setNewProjectName("")
      setShowAddProject(false)
    }
  }

  const startEditProject = (project: Project) => {
    setEditingProject(project.id)
    setEditProjectName(project.name)
  }

  const saveProjectEdit = () => {
    if (editProjectName.trim()) {
      setCustomProjects(
        customProjects.map((project) =>
          project.id === editingProject ? { ...project, name: editProjectName.trim() } : project,
        ),
      )

      setTasks(
        tasks.map((task) =>
          task.category === customProjects.find((p) => p.id === editingProject)?.name
            ? { ...task, category: editProjectName.trim() }
            : task,
        ),
      )

      setEditingProject(null)
      setEditProjectName("")
    }
  }

  const cancelProjectEdit = () => {
    setEditingProject(null)
    setEditProjectName("")
  }

  const deleteProject = (projectId: string) => {
    const projectToDelete = customProjects.find((p) => p.id === projectId)
    if (projectToDelete) {
      setCustomProjects(customProjects.filter((p) => p.id !== projectId))

      setTasks(tasks.map((task) => (task.category === projectToDelete.name ? { ...task, category: "Personal" } : task)))

      if (selectedProject?.id === projectId) {
        setSelectedProject(null)
        setCurrentView("today")
      }
    }
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (signInEmail && signInPassword) {
      setIsAuthenticated(true)
      setCurrentUserEmail(signInEmail)
      // For sign in, we'll use the email as name if no name was previously set
      setCurrentUserName(signInEmail.split('@')[0])
      setShowSignIn(false)
      setSignInEmail("")
      setSignInPassword("")
    }
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    if (signUpEmail && signUpPassword && signUpName) {
      setIsAuthenticated(true)
      setCurrentUserName(signUpName)
      setCurrentUserEmail(signUpEmail)
      setShowSignUp(false)
      setSignUpEmail("")
      setSignUpPassword("")
      setSignUpName("")
    }
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setCurrentUserName("")
    setCurrentUserEmail("")
  }

  const getFilteredTasks = () => {
    let filtered = tasks.filter((task) => {
      const priorityMatch = filterPriority === "all" || task.priority === filterPriority
      const dateMatch = filterDate === "all" || task.date === filterDate

      if (currentView === "today") {
        const dateFilter = selectedDate === new Date().toISOString().split("T")[0] || task.date === selectedDate
        return priorityMatch && dateMatch && dateFilter
      } else if (currentView === "project" && selectedProject) {
        return priorityMatch && dateMatch && task.category === selectedProject.name
      } else if (currentView === "inbox") {
        return priorityMatch && dateMatch
      } else if (currentView === "search") {
        return priorityMatch && dateMatch
      }

      return priorityMatch && dateMatch
    })

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }

  const filteredTasks = getFilteredTasks()

  const groupedTasks = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = []
      }
      acc[task.category].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  const sidebarItems = [
    { icon: Search, label: "Search", count: null, view: "search" },
    { icon: Inbox, label: "Inbox", count: tasks.length, view: "inbox" },
    {
      icon: Calendar,
      label: "Today's ToDos",
      count: filteredTasks.filter((t) => !t.completed).length,
      active: currentView === "today",
      view: "today",
    },
    { icon: Calendar, label: "Calendar", count: null, isCalendar: true },
  ]

  const getCurrentViewTitle = () => {
    if (currentView === "today") {
      return selectedDate === new Date().toISOString().split("T")[0] ? "Today" : selectedDate
    } else if (currentView === "project" && selectedProject) {
      return selectedProject.name
    } else if (currentView === "inbox") {
      return "Inbox"
    } else if (currentView === "search") {
      return "Search"
    }
    return "Today"
  }

  // If user is not authenticated, show welcome screen with auth options
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-[var(--taskify-background)]">
        {/* Sign In Modal */}
        {showSignIn && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSignIn(false)}
                  className="absolute right-2 top-2 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardTitle className="text-center">Sign In to Taskify</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)]">
                    Sign In
                  </Button>
                  <p className="text-center text-sm text-[var(--taskify-text-secondary)]">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSignIn(false)
                        setShowSignUp(true)
                      }}
                      className="text-[var(--taskify-content)] hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sign Up Modal */}
        {showSignUp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSignUp(false)}
                  className="absolute right-2 top-2 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
                <CardTitle className="text-center">Sign Up for Taskify</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="password"
                      placeholder="Password"
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)]">
                    Sign Up
                  </Button>
                  <p className="text-center text-sm text-[var(--taskify-text-secondary)]">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setShowSignUp(false)
                        setShowSignIn(true)
                      }}
                      className="text-[var(--taskify-content)] hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Welcome Screen */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <img src="/taskify-logo.png" alt="Taskify" className="w-16 h-16" />
              <div>
                <h1 className="text-3xl font-bold text-[var(--taskify-text-primary)] font-display">Taskify</h1>
                <p className="text-[var(--taskify-text-secondary)]">From Plan To Done</p>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-[var(--taskify-text-primary)]">Welcome to Taskify</h2>
              <p className="text-[var(--taskify-text-secondary)] text-lg">
                Your personal task management solution. Get organized, stay productive, and achieve your goals.
              </p>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => setShowSignIn(true)}
                className="w-full bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white py-3 text-lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Button>
              <Button
                onClick={() => setShowSignUp(true)}
                variant="outline"
                className="w-full border-[var(--taskify-content)] text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white py-3 text-lg"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Account
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 mt-12 text-left">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-[var(--taskify-border)]">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[var(--taskify-text-primary)]">Organize Tasks</h3>
                  <p className="text-sm text-[var(--taskify-text-secondary)]">Keep track of your daily tasks and projects</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-[var(--taskify-border)]">
                <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[var(--taskify-text-primary)]">Schedule & Plan</h3>
                  <p className="text-sm text-[var(--taskify-text-secondary)]">Plan your time and manage deadlines effectively</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-[var(--taskify-border)]">
                <Briefcase className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[var(--taskify-text-primary)]">Custom Projects</h3>
                  <p className="text-sm text-[var(--taskify-text-secondary)]">Create and manage custom project categories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main authenticated UI
  return (
    <div className="flex h-screen bg-[var(--taskify-background)]">

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-[var(--taskify-sidebar)] border-r border-[var(--taskify-border)]
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col
      `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-[var(--taskify-border)]">
          <div className="flex items-center gap-3">
            <img src="/taskify-logo.png" alt="Taskify" className="w-10 h-10" />
            <div>
              <h1 className="text-xl font-bold text-[var(--taskify-text-primary)] font-display">Taskify</h1>
              <p className="text-sm text-[var(--taskify-text-secondary)]">From Plan To Done</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="p-6 border-b border-[var(--taskify-border)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-[var(--taskify-content)] text-white font-semibold">
                    {currentUserName.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-[var(--taskify-border)]">
                  <User className="w-3 h-3 text-[var(--taskify-content)]" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--taskify-text-primary)]">{currentUserName || "User"}</h3>
                <p className="text-sm text-[var(--taskify-text-secondary)]">{currentUserEmail}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="w-full text-[var(--taskify-text-secondary)] hover:text-[var(--taskify-text-primary)] bg-transparent"
            >
              Sign Out
            </Button>
          </div>
        </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto taskify-scrollbar p-4">
            <nav className="space-y-2">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (item.isCalendar) {
                      setShowCalendar(!showCalendar)
                    } else if (item.view) {
                      handleSidebarNavigation(item.view)
                    }
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                    ${
                      item.active || currentView === item.view
                        ? "bg-[var(--taskify-content)] text-white"
                        : "text-[var(--taskify-text-secondary)] hover:bg-[var(--taskify-hover)] hover:text-[var(--taskify-text-primary)]"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.count && (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
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
                            addCustomProject()
                          }
                        }}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={addCustomProject}
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
                                if (
                                  confirm(
                                    `Are you sure you want to delete "${project.name}"? Tasks will be moved to Personal category.`,
                                  )
                                ) {
                                  deleteProject(project.id)
                                }
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-[var(--taskify-border)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
              <h2 className="text-2xl font-bold text-[var(--taskify-text-primary)] font-display">
                {getCurrentViewTitle()}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--taskify-text-secondary)]" />
                <Input
                  ref={setSearchInputRef}
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-[var(--taskify-background)] border-[var(--taskify-border)]"
                />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-[var(--taskify-content)] text-white" : ""}
              >
                <Filter className="w-5 h-5" />
              </Button>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowThemeSelector(!showThemeSelector)}
                  className={showThemeSelector ? "bg-[var(--taskify-content)] text-white" : ""}
                >
                  <Palette className="w-5 h-5" />
                </Button>

                {showThemeSelector && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[var(--taskify-border)] rounded-lg shadow-lg z-50">
                    <div className="p-2">
                      <div className="text-sm font-medium text-[var(--taskify-text-primary)] mb-2 px-2">
                        Choose Theme
                      </div>
                      <button
                        onClick={() => switchTheme("default")}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[var(--taskify-hover)] ${
                          currentTheme === "default"
                            ? "bg-[var(--taskify-content)] text-white"
                            : "text-[var(--taskify-text-primary)]"
                        }`}
                      >
                        <Monitor className="w-4 h-4" />
                        Default Theme
                      </button>
                      <button
                        onClick={() => switchTheme("light")}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[var(--taskify-hover)] ${
                          currentTheme === "light"
                            ? "bg-[var(--taskify-content)] text-white"
                            : "text-[var(--taskify-text-primary)]"
                        }`}
                      >
                        <Sun className="w-4 h-4" />🎨 Light Theme
                      </button>
                      <button
                        onClick={() => switchTheme("dark")}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[var(--taskify-hover)] ${
                          currentTheme === "dark"
                            ? "bg-[var(--taskify-content)] text-white"
                            : "text-[var(--taskify-text-primary)]"
                        }`}
                      >
                        <Moon className="w-4 h-4" />🌙 Dark Theme
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {isAuthenticated && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-[var(--taskify-content)] text-white text-sm">
                    {currentUserName.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto taskify-scrollbar p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {currentView === "project" && selectedProject ? (
              <Card className="bg-white border-[var(--taskify-border)] shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <selectedProject.icon className="w-6 h-6 text-[var(--taskify-content)]" />
                      <h3 className="text-lg font-semibold text-[var(--taskify-text-primary)] font-display">
                        {selectedProject.name}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white"
                      onClick={() => addTaskToProject(selectedProject.name)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add task
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-[var(--taskify-hover)] transition-colors group"
                      >
                        <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-[var(--taskify-text-secondary)] group-hover:text-[var(--taskify-content)]" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          {editingTask === task.id ? (
                            <div className="flex gap-2">
                              <Input
                                value={editTaskTitle}
                                onChange={(e) => setEditTaskTitle(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") saveEditTask()
                                  if (e.key === "Escape") cancelEditTask()
                                }}
                                className="flex-1"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                onClick={saveEditTask}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEditTask}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <>
                              <p
                                className={`font-medium ${
                                  task.completed
                                    ? "line-through text-[var(--taskify-text-secondary)]"
                                    : "text-[var(--taskify-text-primary)]"
                                }`}
                              >
                                {task.title}
                              </p>
                              {task.time && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3 text-[var(--taskify-text-secondary)]" />
                                  <span className="text-sm text-[var(--taskify-text-secondary)]">{task.time}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-3 h-3 text-[var(--taskify-text-secondary)]" />
                                <span className="text-sm text-[var(--taskify-text-secondary)]">{task.date}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {task.priority && (
                          <Badge
                            variant="secondary"
                            className={`
                              ${task.priority === "high" ? "bg-red-100 text-red-700 border-red-200" : ""}
                              ${task.priority === "medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : ""}
                              ${task.priority === "normal" ? "bg-green-100 text-green-700 border-green-200" : ""}
                            `}
                          >
                            {task.priority}
                          </Badge>
                        )}

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditTask(task)}
                            className="h-8 w-8 p-0 text-[var(--taskify-text-secondary)] hover:text-[var(--taskify-content)] hover:bg-[var(--taskify-content)]/10"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="h-8 w-8 p-0 text-[var(--taskify-text-secondary)] hover:text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 border-2 border-dashed border-[var(--taskify-border)] rounded-lg">
                        <Circle className="w-5 h-5 text-[var(--taskify-text-secondary)]" />
                        <Input
                          placeholder="Add a new task..."
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addTaskToProject(selectedProject.name)
                            }
                          }}
                          className="border-none bg-transparent focus:ring-0 focus:border-none p-0 font-medium"
                        />
                        <select
                          onChange={(e) => {
                            if (newTask.trim()) {
                              addTaskToProject(selectedProject.name, e.target.value as "normal" | "medium" | "high")
                            }
                          }}
                          className="px-2 py-1 border border-[var(--taskify-border)] rounded text-sm bg-white"
                          defaultValue="normal"
                        >
                          <option value="normal">Normal</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <Button
                          size="sm"
                          onClick={() => addTaskToProject(selectedProject.name)}
                          className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                <Card key={category} className="bg-white border-[var(--taskify-border)] shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-[var(--taskify-text-primary)] font-display">
                        {category}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white"
                        onClick={() => addTask(category)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add task
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {categoryTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-4 p-4 rounded-lg hover:bg-[var(--taskify-hover)] transition-colors group"
                        >
                          <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-[var(--taskify-text-secondary)] group-hover:text-[var(--taskify-content)]" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            {editingTask === task.id ? (
                              <div className="flex gap-2">
                                <Input
                                  value={editTaskTitle}
                                  onChange={(e) => setEditTaskTitle(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") saveEditTask()
                                    if (e.key === "Escape") cancelEditTask()
                                  }}
                                  className="flex-1"
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  onClick={saveEditTask}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEditTask}>
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <>
                                <p
                                  className={`font-medium ${
                                    task.completed
                                      ? "line-through text-[var(--taskify-text-secondary)]"
                                      : "text-[var(--taskify-text-primary)]"
                                  }`}
                                >
                                  {task.title}
                                </p>
                                {task.time && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Clock className="w-3 h-3 text-[var(--taskify-text-secondary)]" />
                                    <span className="text-sm text-[var(--taskify-text-secondary)]">{task.time}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {task.priority && (
                            <Badge
                              variant="secondary"
                              className={`
                                ${task.priority === "high" ? "bg-red-100 text-red-700 border-red-200" : ""}
                                ${task.priority === "medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : ""}
                                ${task.priority === "normal" ? "bg-green-100 text-green-700 border-green-200" : ""}
                              `}
                            >
                              {task.priority}
                            </Badge>
                          )}

                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditTask(task)}
                              className="h-8 w-8 p-0 text-[var(--taskify-text-secondary)] hover:text-[var(--taskify-content)] hover:bg-[var(--taskify-content)]/10"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTask(task.id)}
                              className="h-8 w-8 p-0 text-[var(--taskify-text-secondary)] hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <div className="space-y-3">
                        <div className="flex items-center gap-4 p-4 border-2 border-dashed border-[var(--taskify-border)] rounded-lg">
                          <Circle className="w-5 h-5 text-[var(--taskify-text-secondary)]" />
                          <Input
                            placeholder="Add a new task..."
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addTask(category)
                              }
                            }}
                            className="border-none bg-transparent focus:ring-0 focus:border-none p-0 font-medium"
                          />
                          <select
                            onChange={(e) => {
                              if (newTask.trim()) {
                                addTask(category, e.target.value as "normal" | "medium" | "high")
                              }
                            }}
                            className="px-2 py-1 border border-[var(--taskify-border)] rounded text-sm bg-white"
                            defaultValue="normal"
                          >
                            <option value="normal">Normal</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          <Button
                            size="sm"
                            onClick={() => addTask(category)}
                            className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
