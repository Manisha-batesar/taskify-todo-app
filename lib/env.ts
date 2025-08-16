/**
 * Environment variable validation and utilities
 */

export const getEnvVar = (name: string, fallback?: string): string => {
  const value = process.env[name]
  
  if (!value && !fallback) {
    if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
      // During build time in production, log error but don't throw
      console.error(`Missing required environment variable: ${name}`)
      return ''
    }
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
