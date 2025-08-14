"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/context/AuthContext"
import { useTask } from "@/context/TaskContext"
import { 
  Menu, 
  Search, 
  Bell, 
  Filter, 
  Palette, 
  Monitor, 
  Sun, 
  Moon 
} from "lucide-react"
import { Theme } from "@/types"

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { user } = useAuth()
  const {
    currentView,
    selectedProject,
    searchQuery,
    setSearchQuery,
    currentTheme,
    setCurrentTheme,
    selectedDate,
  } = useTask()

  const [showFilters, setShowFilters] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)

  const getCurrentViewTitle = () => {
    if (currentView === "today") {
      return selectedDate === new Date().toISOString().split("T")[0] ? "Today" : selectedDate
    } else if (currentView === "project" && selectedProject) {
      return selectedProject.name
    } else if (currentView === "inbox") {
      return "Inbox"
    } else if (currentView === "search") {
      return "Search"
    }
    return "Today"
  }

  const switchTheme = (theme: Theme) => {
    setCurrentTheme(theme)
    setShowThemeSelector(false)

    const root = document.documentElement

    if (theme === "light") {
      root.style.setProperty("--taskify-background", "#ffffff")
      root.style.setProperty("--taskify-content", "#007bff")
      root.style.setProperty("--taskify-sidebar", "#f8f9fa")
      root.style.setProperty("--taskify-border", "#e0e0e0")
      root.style.setProperty("--taskify-hover", "#f8f9fa")
      root.style.setProperty("--taskify-accent", "#0056b3")
      root.style.setProperty("--taskify-text-primary", "#111111")
      root.style.setProperty("--taskify-text-secondary", "#222222")
    } else if (theme === "dark") {
      root.style.setProperty("--taskify-background", "#121212")
      root.style.setProperty("--taskify-content", "#3399ff")
      root.style.setProperty("--taskify-sidebar", "#1a1a1a")
      root.style.setProperty("--taskify-border", "#333333")
      root.style.setProperty("--taskify-hover", "#2a2a2a")
      root.style.setProperty("--taskify-accent", "#2980ff")
      root.style.setProperty("--taskify-text-primary", "#ffffff")
      root.style.setProperty("--taskify-text-secondary", "#e0e0e0")
    } else {
      // Default theme - reset to original values
      root.style.setProperty("--taskify-background", "#dcedf2")
      root.style.setProperty("--taskify-content", "#a1c8fa")
      root.style.setProperty("--taskify-sidebar", "#ffffff")
      root.style.setProperty("--taskify-border", "#e2e8f0")
      root.style.setProperty("--taskify-hover", "#f8fafc")
      root.style.setProperty("--taskify-accent", "#8bb4f0")
      root.style.setProperty("--taskify-text-primary", "#1e293b")
      root.style.setProperty("--taskify-text-secondary", "#64748b")
    }
  }

  return (
    <header className="bg-white border-b border-[var(--taskify-border)] px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="sm" className="lg:hidden p-1 sm:p-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--taskify-text-primary)] font-display truncate">
            {getCurrentViewTitle()}
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--taskify-text-secondary)]" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-48 lg:w-64 bg-[var(--taskify-background)] border-[var(--taskify-border)]"
            />
          </div>

          <Button variant="ghost" size="sm" className="sm:hidden p-1">
            <Search className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-[var(--taskify-content)] text-white" : ""}
          >
            <Filter className="w-5 h-5" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className={showThemeSelector ? "bg-[var(--taskify-content)] text-white" : ""}
            >
              <Palette className="w-5 h-5" />
            </Button>

            {showThemeSelector && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[var(--taskify-border)] rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <div className="text-sm font-medium text-[var(--taskify-text-primary)] mb-2 px-2">
                    Choose Theme
                  </div>
                  <button
                    onClick={() => switchTheme("default")}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[var(--taskify-hover)] ${
                      currentTheme === "default"
                        ? "bg-[var(--taskify-content)] text-white"
                        : "text-[var(--taskify-text-primary)]"
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    Default Theme
                  </button>
                  <button
                    onClick={() => switchTheme("light")}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[var(--taskify-hover)] ${
                      currentTheme === "light"
                        ? "bg-[var(--taskify-content)] text-white"
                        : "text-[var(--taskify-text-primary)]"
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    🎨 Light Theme
                  </button>
                  <button
                    onClick={() => switchTheme("dark")}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[var(--taskify-hover)] ${
                      currentTheme === "dark"
                        ? "bg-[var(--taskify-content)] text-white"
                        : "text-[var(--taskify-text-primary)]"
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    🌙 Dark Theme
                  </button>
                </div>
              </div>
            )}
          </div>

          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-[var(--taskify-content)] text-white text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
