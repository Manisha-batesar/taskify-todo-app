"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeSwitcher } from "@/components/ui/theme-switcher"
import { useAuth } from "@/context/AuthContext"
import { useTask } from "@/context/TaskContext"
import { 
  Menu, 
  Search, 
  Bell, 
  Filter
} from "lucide-react"

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
    selectedDate,
  } = useTask()

  const [showFilters, setShowFilters] = useState(false)

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

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-[var(--taskify-border)] px-4 sm:px-6 py-3 sm:py-4">
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

          <ThemeSwitcher />

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
