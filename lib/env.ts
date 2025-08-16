/**
 * Environment variable validation and utilities
 */

export const getEnvVar = (name: string, fallback?: string): string => {
  const value = process.env[name]
  
  if (!value && !fallback) {
    // In browser environment, show a more user-friendly error
    if (typeof window !== 'undefined') {
      console.error(`Missing required environment variable: ${name}`)
      return ''
    }
    
    // During build time in production, log error but don't throw
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      console.error(`Missing required environment variable: ${name}`)
      return ''
    }
    
    // In development, throw error for debugging
    throw new Error(`Missing required environment variable: ${name}`)
  }
  
  return value || fallback || ''
}

export const isSupabaseConfigured = (): boolean => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return Boolean(url && key)
}

export const getSupabaseConfig = () => {
  return {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
}
