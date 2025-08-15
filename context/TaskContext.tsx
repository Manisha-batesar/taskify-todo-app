"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { Task, Project, CurrentView } from "@/types"
import { Briefcase, Calendar } from "lucide-react"
import { useAuth } from "./AuthContext"
import { 
  createProject, 
  getUserProjects, 
  updateProject as updateProjectInDB, 
  deleteProjectWithTasks 
} from "@/lib/projects"

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
  addCustomProject: (name: string) => Promise<void>
  editProject: (id: string, name: string) => Promise<void>
  deleteProject: (id: string) => Promise<void>
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
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [customProjects, setCustomProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentView, setCurrentView] = useState<CurrentView>("today")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [newTask, setNewTask] = useState("")

  // Load projects from database when user changes
  useEffect(() => {
    if (user) {
      loadUserProjects()
    } else {
      setCustomProjects([])
    }
  }, [user])

  const loadUserProjects = async () => {
    try {
      const dbProjects = await getUserProjects()
      const projects: Project[] = dbProjects.map(dbProject => ({
        id: dbProject.id,
        name: dbProject.title,
        icon: Briefcase,
        count: 0
      }))
      setCustomProjects(projects)
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

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

  const addCustomProject = async (name: string) => {
    try {
      const dbProject = await createProject(name)
      if (dbProject) {
        const newProject: Project = {
          id: dbProject.id,
          name: dbProject.title,
          icon: Briefcase,
          count: 0,
        }
        setCustomProjects(prev => [...prev, newProject])
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    }
  }

  const editProject = async (id: string, name: string) => {
    try {
      const oldProject = customProjects.find((p) => p.id === id)
      if (oldProject) {
        await updateProjectInDB(id, name)
        
        setCustomProjects(prev =>
          prev.map((project) =>
            project.id === id ? { ...project, name } : project
          )
        )
        
        // Update tasks category
        setTasks(prev =>
          prev.map((task) =>
            task.category === oldProject.name ? { ...task, category: name } : task
          )
        )

        // Update selected project if it's the one being edited
        if (selectedProject?.id === id) {
          setSelectedProject(prev => prev ? { ...prev, name } : null)
        }
      }
    } catch (error) {
      console.error('Failed to update project:', error)
      throw error
    }
  }

  const deleteProject = async (id: string) => {
    try {
      const projectToDelete = customProjects.find((p) => p.id === id)
      if (projectToDelete) {
        // Delete project and its tasks from database
        await deleteProjectWithTasks(id)
        
        // Remove project from local state
        setCustomProjects(prev => prev.filter((p) => p.id !== id))
        
        // Remove tasks with this project's category from local state
        setTasks(prev => prev.filter(task => task.category !== projectToDelete.name))

        // Reset selected project if it's the one being deleted
        if (selectedProject?.id === id) {
          setSelectedProject(null)
          setCurrentView("today")
        }
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
      throw error
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
