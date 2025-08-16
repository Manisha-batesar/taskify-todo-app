import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig, isSupabaseConfigured } from './env'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Create a safe fallback for build time
const createSupabaseClient = () => {
  // During build time, if Supabase is not configured, return a mock client
  if (!isBrowser && !isSupabaseConfigured() && process.env.NODE_ENV === 'production') {
    console.warn('Supabase not configured during build - using mock client')
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({ data: null, error: new Error('Supabase not configured') }),
        insert: () => ({ data: null, error: new Error('Supabase not configured') }),
        update: () => ({ data: null, error: new Error('Supabase not configured') }),
        delete: () => ({ data: null, error: new Error('Supabase not configured') })
      })
    } as any
  }
  
  const config = getSupabaseConfig()
  
  return createClient(config.url, config.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

export const supabase = createSupabaseClient()
