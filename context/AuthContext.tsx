"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "@/types"
import { supabase } from "@/lib/supabase"
import type { AuthSession, AuthChangeEvent, Session } from '@supabase/supabase-js'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>
  signInWithGoogle: () => Promise<{ error?: string }>
  signOut: () => Promise<void>
  session: AuthSession | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<AuthSession | null>(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
      }
      
      if (session) {
        setSession(session)
        setIsAuthenticated(true)
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          user_metadata: session.user.user_metadata,
          app_metadata: session.user.app_metadata
        })
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session)
        
        if (session) {
          setSession(session)
          setIsAuthenticated(true)
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            user_metadata: session.user.user_metadata,
            app_metadata: session.user.app_metadata
          })
        } else {
          setSession(null)
          setIsAuthenticated(false)
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string): Promise<{ error?: string }> => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        return { error: error.message }
      }

      // If user needs to confirm email, show appropriate message
      if (data.user && !data.session) {
        return { error: 'Please check your email to confirm your account before signing in.' }
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (): Promise<{ error?: string }> => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      session
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
