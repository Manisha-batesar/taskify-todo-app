export interface Task {
  id: string
  project_id?: string
  title: string
  time?: string
  completed: boolean
  priority?: "high" | "medium" | "normal"
  category: string
  date?: string
  description?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  icon: any
  count: number
}

export interface User {
  id: string
  name?: string
  email?: string
  user_metadata?: {
    name?: string
    full_name?: string
    [key: string]: any
  }
  app_metadata?: {
    [key: string]: any
  }
}

export type CurrentView = "today" | "project" | "inbox" | "search"
