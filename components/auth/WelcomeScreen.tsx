"use client"

import { Button } from "@/components/ui/button"
import { LogIn, UserPlus, CheckCircle2, Calendar, Briefcase } from "lucide-react"
import Link from "next/link"

export default function WelcomeScreen() {
  return (
    <div className="flex h-screen bg-[var(--taskify-background)]">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-sm sm:max-w-md w-full text-center space-y-6 sm:space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <img src="/taskify-logo.png" alt="Taskify" className="w-12 h-12 sm:w-16 sm:h-16" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--taskify-text-primary)] font-display">Taskify</h1>
              <p className="text-sm sm:text-base text-[var(--taskify-text-secondary)]">From Plan To Done</p>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[var(--taskify-text-primary)]">Welcome to Taskify</h2>
            <p className="text-[var(--taskify-text-secondary)] text-sm sm:text-lg">
              Your personal task management solution. Get organized, stay productive, and achieve your goals.
            </p>
          </div>

          {/* Auth Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <Link href="/signin">
              <Button className="w-full bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white h-11 sm:h-12 text-sm sm:text-lg">
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="w-full border-[var(--taskify-content)] text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white h-11 sm:h-12 text-sm sm:text-lg"
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mt-12 text-left">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-[var(--taskify-border)]">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[var(--taskify-text-primary)]">Organize Tasks</h3>
                <p className="text-sm text-[var(--taskify-text-secondary)]">Keep track of your daily tasks and projects</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-[var(--taskify-border)]">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[var(--taskify-text-primary)]">Schedule & Plan</h3>
                <p className="text-sm text-[var(--taskify-text-secondary)]">Plan your time and manage deadlines effectively</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-[var(--taskify-border)]">
              <Briefcase className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-[var(--taskify-text-primary)]">Custom Projects</h3>
                <p className="text-sm text-[var(--taskify-text-secondary)]">Create and manage custom project categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
