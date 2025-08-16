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
import {
  createTask,
  getAllUserTasks,
  updateTask as updateTaskInDB,
  deleteTask as deleteTaskFromDB,
  toggleTaskCompletion
} from "@/lib/tasks"

interface TaskContextType {
  // Tasks
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  toggleTask: (id: string) => Promise<void>
  addTask: (category: string, priority?: "normal" | "medium" | "high", dueDate?: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  editTask: (id: string, title: string, newDueDate?: string) => Promise<void>
  
  // Projects
  customProjects: Project[]
  setCustomProjects: (projects: Project[]) => void
  addCustomProject: (name: string, description?: string) => Promise<Project | undefined>
  editProject: (id: string, name: string, description?: string) => Promise<void>
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
    createdAt: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
  },
  {
    id: "2",
    title: "Dentist appointment",
    time: "10:00 AM",
    completed: false,
    priority: "high",
    category: "Personal",
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
  },
]

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [customProjects, setCustomProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentView, setCurrentView] = useState<CurrentView>("inbox")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [newTask, setNewTask] = useState("")

  // Load projects and tasks from database when user changes
  useEffect(() => {
    if (user) {
      loadUserProjects()
      loadUserTasks()
    } else {
      setCustomProjects([])
      setTasks([])
    }
  }, [user])

  const loadUserTasks = async () => {
    try {
      const dbTasks = await getAllUserTasks()
      const tasks: Task[] = dbTasks.map(dbTask => ({
        id: dbTask.id,
        project_id: dbTask.project_id,
        title: dbTask.title,
        description: dbTask.description,
        completed: dbTask.completed,
        category: getProjectNameById(dbTask.project_id) || "Personal",
        date: dbTask.due_date || new Date().toISOString().split("T")[0],
        priority: "normal" as const,
        createdAt: dbTask.created_at || new Date().toISOString().split("T")[0],
        dueDate: dbTask.due_date || new Date().toISOString().split("T")[0],
      }))
      setTasks(tasks)
    } catch (error) {
      console.error('Failed to load tasks:', error)
    }
  }

  // Reload tasks when projects change to update category names
  useEffect(() => {
    if (customProjects.length > 0) {
      loadUserTasks()
    }
  }, [customProjects])

  const getProjectNameById = (projectId: string): string | undefined => {
  const project = customProjects.find(p => p.id === projectId)
  return project?.name
  }

  const getProjectIdByName = (projectName: string): string | undefined => {
    const project = customProjects.find(p => p.name === projectName)
    return project?.id
  }

  const loadUserProjects = async () => {
    try {
      const dbProjects = await getUserProjects()
      const projects: Project[] = dbProjects.map(dbProject => ({
        id: dbProject.id,
        name: dbProject.title,
        description: dbProject.description,
        icon: Briefcase,
        count: 0
      }))
      setCustomProjects(projects)
      
      // Don't auto-select project - keep default inbox view
    } catch (error) {
      console.error('Failed to load projects:', error)
    }
  }

  const toggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (task && task.project_id) {
        await toggleTaskCompletion(id, !task.completed)
        setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
      }
    } catch (error) {
      console.error('Failed to toggle task:', error)
    }
  }

  const addTask = async (category: string, priority: "normal" | "medium" | "high" = "normal", dueDate?: string) => {
    if (newTask.trim()) {
      try {
        const now = new Date().toISOString().split("T")[0]
        const projectId = getProjectIdByName(category)
        if (projectId) {
          const dbTask = await createTask(projectId, newTask.trim(), undefined, dueDate || selectedDate)
          if (dbTask) {
            const task: Task = {
              id: dbTask.id,
              project_id: dbTask.project_id,
              title: dbTask.title,
              description: dbTask.description,
              completed: dbTask.completed,
              category,
              priority,
              date: dbTask.due_date || selectedDate,
              createdAt: dbTask.created_at || now,
              dueDate: dbTask.due_date || dueDate || selectedDate,
            }
            setTasks([...tasks, task])
            setNewTask("")
          }
        } else {
          // Handle case where project doesn't exist (e.g., "Personal" category)
          const task: Task = {
            id: Date.now().toString(),
            title: newTask,
            completed: false,
            category,
            priority,
            date: selectedDate,
            createdAt: now,
            dueDate: dueDate || selectedDate,
          }
          setTasks([...tasks, task])
          setNewTask("")
        }
      } catch (error) {
        console.error('Failed to add task:', error)
      }
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (task && task.project_id) {
        await deleteTaskFromDB(id)
      }
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const editTask = async (id: string, title: string, newDueDate?: string) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (task && task.project_id) {
        await updateTaskInDB(id, { title, due_date: newDueDate })
      }
      setTasks(tasks.map((task) => (task.id === id ? { ...task, title, dueDate: newDueDate !== undefined ? newDueDate : task.dueDate } : task)))
    } catch (error) {
      console.error('Failed to edit task:', error)
    }
  }

  const addCustomProject = async (name: string, description?: string) => {
    try {
      const dbProject = await createProject(name, description)
      if (dbProject) {
        const newProject: Project = {
          id: dbProject.id,
          name: dbProject.title,
          description: dbProject.description,
          icon: Briefcase,
          count: 0,
        }
        setCustomProjects(prev => [...prev, newProject])
        return newProject
      }
    } catch (error) {
      console.error('Failed to create project:', error)
      throw error
    }
  }

  const editProject = async (id: string, name: string, description?: string) => {
    try {
      const oldProject = customProjects.find((p) => p.id === id)
      if (oldProject) {
        await updateProjectInDB(id, name, description)
        
        setCustomProjects(prev =>
          prev.map((project) =>
            project.id === id ? { ...project, name, description } : project
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
          setSelectedProject(prev => prev ? { ...prev, name, description } : null)
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
