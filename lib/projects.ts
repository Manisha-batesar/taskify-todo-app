import { supabase } from './supabase'
import type { Project } from '@/types'

export interface DatabaseProject {
  id: string
  user_id: string
  title: string
  description?: string
  created_at: string
}

export async function createProject(title: string, description?: string): Promise<DatabaseProject | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      title,
      description
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    throw error
  }

  return data
}

export async function getUserProjects(): Promise<DatabaseProject[]> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    throw error
  }

  return data || []
}

export async function updateProject(id: string, title: string, description?: string): Promise<DatabaseProject | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('projects')
    .update({ title, description })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    throw error
  }

  return data
}

export async function deleteProjectWithTasks(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Start a transaction-like operation
  // First, delete all tasks associated with this project
  const { error: tasksError } = await supabase
    .from('tasks')
    .delete()
    .eq('project_id', id)

  if (tasksError) {
    console.error('Error deleting project tasks:', tasksError)
    throw tasksError
  }

  // Then delete the project itself
  const { error: projectError } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (projectError) {
    console.error('Error deleting project:', projectError)
    throw projectError
  }
}

export async function getProjectTasksCount(projectId: string): Promise<number> {
  const { data, error } = await supabase
    .from('tasks')
    .select('id', { count: 'exact' })
    .eq('project_id', projectId)
    .eq('completed', false)

  if (error) {
    console.error('Error fetching project tasks count:', error)
    return 0
  }

  return data?.length || 0
}
