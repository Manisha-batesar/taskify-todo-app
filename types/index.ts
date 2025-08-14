export interface Task {
  id: string
  title: string
  time?: string
  completed: boolean
  priority?: "high" | "medium" | "normal"
  category: string
  date?: string
}

export interface Project {
  id: string
  name: string
  icon: any
  count: number
}

export interface User {
  name: string
  email: string
}

export type CurrentView = "today" | "project" | "inbox" | "search"
