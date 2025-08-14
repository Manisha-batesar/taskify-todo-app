"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { Task, Project, CurrentView } from "@/types"
import { Briefcase, Calendar } from "lucide-react"

interface TaskContextType {
  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  toggleTask: (id: string) => void
  addTask: (category: string, priority?: "normal" | "medium" | "high") => void
  deleteTask: (id: string) => void
  editTask: (id: string, title: string) => void
  
  // Projects
  customProjects: Project[]
  setCustomProjects: (projects: Project[]) => void
  addCustomProject: (name: string) => void
  editProject: (id: string, name: string) => void
  deleteProject: (id: string) => void
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
  
  // UI State
  currentView: CurrentView
  setCurrentView: (view: CurrentView) => void
  selectedDate: string
  setSelectedDate: (date: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  filterPriority: string
  setFilterPriority: (priority: string) => void
  filterDate: string
  setFilterDate: (date: string) => void
  
  // New task input
  newTask: string
  setNewTask: (task: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

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

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [customProjects, setCustomProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentView, setCurrentView] = useState<CurrentView>("today")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [newTask, setNewTask] = useState("")

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

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const editTask = (id: string, title: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, title } : task)))
  }

  const addCustomProject = (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      icon: Briefcase,
      count: 0,
    }
    setCustomProjects([...customProjects, newProject])
  }

  const editProject = (id: string, name: string) => {
    const oldProject = customProjects.find((p) => p.id === id)
    if (oldProject) {
      setCustomProjects(
        customProjects.map((project) =>
          project.id === id ? { ...project, name } : project
        )
      )
      
      // Update tasks category
      setTasks(
        tasks.map((task) =>
          task.category === oldProject.name ? { ...task, category: name } : task
        )
      )
    }
  }

  const deleteProject = (id: string) => {
    const projectToDelete = customProjects.find((p) => p.id === id)
    if (projectToDelete) {
      setCustomProjects(customProjects.filter((p) => p.id !== id))
      
      // Move tasks to Personal category
      setTasks(tasks.map((task) => 
        task.category === projectToDelete.name ? { ...task, category: "Personal" } : task
      ))

      if (selectedProject?.id === id) {
        setSelectedProject(null)
        setCurrentView("today")
      }
    }
  }

  return (
    <TaskContext.Provider value={{
      tasks,
      setTasks,
      toggleTask,
      addTask,
      deleteTask,
      editTask,
      customProjects,
      setCustomProjects,
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
      filterPriority,
      setFilterPriority,
      filterDate,
      setFilterDate,
      newTask,
      setNewTask,
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}
