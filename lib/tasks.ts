import { supabase } from './supabase'
import type { Task } from '@/types'

export interface DatabaseTask {
  id: string
  project_id: string
  title: string
  description?: string
  due_date?: string
  completed: boolean
  created_at: string
}

export async function createTask(
  projectId: string, 
  title: string, 
  description?: string, 
  dueDate?: string
): Promise<DatabaseTask | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      project_id: projectId,
      title,
      description,
      due_date: dueDate,
      completed: false
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating task:', error)
    throw error
  }

  return data
}

export async function getProjectTasks(projectId: string): Promise<DatabaseTask[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }

  return data || []
}

export async function getAllUserTasks(): Promise<DatabaseTask[]> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      projects!inner (
        user_id
      )
    `)
    .eq('projects.user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user tasks:', error)
    throw error
  }

  return data || []
}

export async function updateTask(
  id: string, 
  updates: {
    title?: string
    description?: string
    due_date?: string
    completed?: boolean
  }
): Promise<DatabaseTask | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating task:', error)
    throw error
  }

  return data
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

export async function toggleTaskCompletion(id: string, completed: boolean): Promise<DatabaseTask | null> {
  return updateTask(id, { completed })
}
