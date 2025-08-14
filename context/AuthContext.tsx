"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "@/types"

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  signIn: (email: string, password: string, name?: string) => void
  signUp: (name: string, email: string, password: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored auth state on mount
    const stored = localStorage.getItem('taskify-auth')
    if (stored) {
      const { isAuthenticated, user } = JSON.parse(stored)
      setIsAuthenticated(isAuthenticated)
      setUser(user)
    }
  }, [])

  const signIn = (email: string, password: string, name?: string) => {
    const userData = {
      name: name || email.split('@')[0],
      email
    }
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('taskify-auth', JSON.stringify({ isAuthenticated: true, user: userData }))
  }

  const signUp = (name: string, email: string, password: string) => {
    const userData = { name, email }
    setIsAuthenticated(true)
    setUser(userData)
    localStorage.setItem('taskify-auth', JSON.stringify({ isAuthenticated: true, user: userData }))
  }

  const signOut = () => {
    setIsAuthenticated(false)
    setUser(null)
    localStorage.removeItem('taskify-auth')
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      signIn,
      signUp,
      signOut
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
