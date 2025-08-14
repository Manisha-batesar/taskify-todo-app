"use client"

import { useState } from "react"
import Sidebar from "@/components/layout/Sidebar"
import Header from "@/components/layout/Header"
import TaskList from "@/components/tasks/TaskList"

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[var(--taskify-background)]" style={{ 
      wordBreak: 'break-word',
      overflowWrap: 'anywhere'
    }}>
      <style jsx global>{`
        .break-words {
          word-break: break-word;
          overflow-wrap: anywhere;
        }
        .taskify-text-wrap {
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-wrap: anywhere;
        }
      `}</style>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden taskify-scrollbar p-2 sm:p-4 lg:p-6">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-6 lg:space-y-8 min-w-0">
            <TaskList />
          </div>
        </main>
      </div>
    </div>
  )
}
