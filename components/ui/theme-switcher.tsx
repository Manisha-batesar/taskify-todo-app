"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Monitor, Sun, Moon, Palette } from "lucide-react"

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, systemTheme } = useTheme()
  const [showSelector, setShowSelector] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder that matches the expected size to prevent layout shift
    return (
      <Button variant="ghost" size="sm" className="w-10 h-10">
        <Palette className="w-5 h-5" />
      </Button>
    )
  }

  const getCurrentIcon = () => {
    if (theme === "system") {
      return systemTheme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />
    }
    return theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowSelector(!showSelector)}
        className={showSelector ? "bg-[var(--taskify-content)] text-white" : ""}
      >
        {getCurrentIcon()}
      </Button>

      {showSelector && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--background)] border border-[var(--taskify-border)] rounded-lg shadow-lg z-50">
          <div className="p-2 space-y-1.5">
            <div className="text-sm font-medium text-[var(--taskify-text-primary)] mb-2 px-2">
              Choose Theme
            </div>
            <button
              onClick={() => {
                setTheme("system")
                setShowSelector(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[var(--taskify-hover)] ${
                theme === "system"
                  ? "bg-[var(--taskify-content)] text-white"
                  : "text-[var(--taskify-text-primary)]"
              }`}
            >
              <Monitor className="w-4 h-4" />
              System
            </button>
            <button
              onClick={() => {
                setTheme("light")
                setShowSelector(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[var(--taskify-hover)] ${
                theme === "light"
                  ? "bg-[var(--taskify-content)] text-white"
                  : "text-[var(--taskify-text-primary)]"
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              onClick={() => {
                setTheme("dark")
                setShowSelector(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-[var(--taskify-hover)] ${
                theme === "dark"
                  ? "bg-[var(--taskify-content)] text-white"
                  : "text-[var(--taskify-text-primary)]"
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
