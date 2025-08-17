"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTask } from "@/context/TaskContext"
import { Loader2, Plus, ArrowLeft, X } from "lucide-react"
import TaskCard from "./TaskCard"
import TaskInput from "./TaskInput"
import AddProjectDialog from "@/components/projects/AddProjectDialog"
import { Task } from "@/types"
import { useState } from "react"

export default function TaskList() {
  // Updated button names from "Go Back" and "Go to Inbox" to "Clear Filter"
  const {
    tasks,
    currentView,
    selectedProject,
    selectedDate,
    searchQuery,
    filterPriority,
    filterDate,
    addTask,
    addCustomProject,
    setSelectedProject,
    setCurrentView,
    setFilterPriority,
    setFilterDate,
    setSearchQuery,
  } = useTask();
  const [isAddingProject, setIsAddingProject] = useState(false);

  const handleGoToInbox = () => {
    // Clear all filters and search
    setFilterPriority("all")
    setFilterDate("all")
    setSearchQuery("")
    setSelectedProject(null)
    setCurrentView("inbox")
  }

  const handleAddProject = async (name: string, description?: string) => {
    setIsAddingProject(true);
    const newProject = await addCustomProject(name, description)
    
    // Select the newly created project
    if (newProject) {
      setSelectedProject(newProject)
      setCurrentView("project")
    }
    setIsAddingProject(false);
  }

  const getFilteredTasks = () => {
    let filtered = tasks.filter((task) => {
      const priorityMatch = filterPriority === "all" || task.priority === filterPriority
      
      // Handle date filtering
      let dateMatch = true
      if (filterDate !== "all") {
        if (filterDate === "week") {
          // Get start of current week (Sunday)
          const now = new Date()
          const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
          startOfWeek.setHours(0, 0, 0, 0)
          
          // Get end of current week (Saturday)
          const endOfWeek = new Date(startOfWeek)
          endOfWeek.setDate(startOfWeek.getDate() + 6)
          endOfWeek.setHours(23, 59, 59, 999)
          
          const taskDate = new Date(task.dueDate)
          dateMatch = taskDate >= startOfWeek && taskDate <= endOfWeek
        } else {
          dateMatch = task.dueDate === filterDate
        }
      }

      if (currentView === "today") {
        const today = new Date().toISOString().split("T")[0]
        return priorityMatch && dateMatch && task.dueDate === today
      } else if (currentView === "project" && selectedProject) {
        return priorityMatch && dateMatch && task.category === selectedProject.name
      } else if (currentView === "inbox") {
        return priorityMatch && dateMatch
      } else if (currentView === "search") {
        return priorityMatch && dateMatch
      }

      return priorityMatch && dateMatch
    })

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }

  const filteredTasks = getFilteredTasks()
  const hasActiveFilters = filterPriority !== "all" || filterDate !== "all" || searchQuery.trim() !== ""

  const getActiveFiltersDisplay = () => {
    const filters = []
    if (filterPriority !== "all") {
      filters.push({
        type: "priority",
        label: `${filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1)} Priority`,
        value: filterPriority,
        color: filterPriority === "high" ? "bg-red-100 text-red-700 border-red-200" : 
               filterPriority === "medium" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : 
               "bg-green-100 text-green-700 border-green-200"
      })
    }
    if (filterDate !== "all") {
      filters.push({
        type: "date",
        label: filterDate === "week" ? "This Week" : new Date(filterDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        value: filterDate,
        color: "bg-blue-100 text-blue-700 border-blue-200"
      })
    }
    if (searchQuery.trim()) {
      filters.push({
        type: "search",
        label: `"${searchQuery}"`,
        value: searchQuery,
        color: "bg-purple-100 text-purple-700 border-purple-200"
      })
    }
    return filters
  }

  const getNoTasksMessage = () => {
    if (filterDate !== "all" && filterPriority !== "all") {
      const dateText = filterDate === "week" ? "this week" : new Date(filterDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      return {
        title: "No matching tasks found",
        message: `No tasks found with ${filterPriority} priority scheduled for ${dateText}`,
        emoji: "🔍",
        action: "Try adjusting your filters or create a new task"
      }
    } else if (filterDate !== "all") {
      if (filterDate === "week") {
        return {
          title: "No tasks this week",
          message: "No tasks are scheduled for this week",
          emoji: "📅",
          action: "Plan your week by adding some tasks"
        }
      } else {
        return {
          title: "No tasks on this date",
          message: `No tasks are scheduled for ${new Date(filterDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
          emoji: "📅",
          action: "Try selecting a different date or add a new task"
        }
      }
    } else if (filterPriority !== "all") {
      return {
        title: `No ${filterPriority} priority tasks`,
        message: `No tasks found with ${filterPriority} priority level`,
        emoji: filterPriority === "high" ? "🔴" : filterPriority === "medium" ? "🟡" : "🟢",
        action: "Try selecting a different priority or create a new task"
      }
    } else if (searchQuery.trim()) {
      return {
        title: "No search results",
        message: `No tasks found matching "${searchQuery}"`,
        emoji: "🔍",
        action: "Try a different search term or create a new task"
      }
    } else if (currentView === "today") {
      return {
        title: "No tasks for today",
        message: "You're all caught up for today! 🎉",
        emoji: "✅",
        action: "Enjoy your free time or plan for tomorrow"
      }
    } else {
      return {
        title: "No tasks found",
        message: "Start organizing your day by adding your first task",
        emoji: "🗒️",
        action: "Click the + button to create a task"
      }
    }
  }

  const groupedTasks = filteredTasks.reduce(
    (acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = []
      }
      acc[task.category].push(task)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  if (currentView === "project" && selectedProject) {
    return (
      <div className="space-y-4">
        {/* Filter Status Bar for Project View */}
        {hasActiveFilters && filteredTasks.length > 0 && (
          <Card className="bg-[var(--taskify-background)] border-[var(--taskify-border)] shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-[var(--taskify-text-secondary)]">
                    Filtered by:
                  </span>
                  {getActiveFiltersDisplay().map((filter, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className={`text-xs font-medium border ${filter.color}`}
                    >
                      {filter.label}
                      <button
                        onClick={() => {
                          if (filter.type === "priority") setFilterPriority("all")
                          if (filter.type === "date") setFilterDate("all")
                          if (filter.type === "search") setSearchQuery("")
                        }}
                        className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  ))}
                  <span className="text-xs text-[var(--taskify-text-secondary)]">
                    ({filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found)
                  </span>
                </div>
                <Button
                  onClick={handleGoToInbox}
                  variant="outline"
                  size="sm"
                  className="text-[var(--taskify-content)] border-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white transition-all duration-200 self-start sm:self-auto"
                >
                  <ArrowLeft className="w-3 h-3 mr-2" />
                  Clear Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-[var(--background)] border-[var(--taskify-border)] shadow-sm overflow-hidden">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <selectedProject.icon className="w-4 h-4 sm:w-6 sm:h-6 text-[var(--taskify-content)] flex-shrink-0" />
                <h3 className="text-sm sm:text-lg font-semibold text-[var(--taskify-text-primary)] font-display truncate">
                  {selectedProject.name}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white flex-shrink-0 ml-2 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
                onClick={() => addTask(selectedProject.name)}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Add task</span>
              </Button>
            </div>

            <div className="space-y-2 sm:space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}

              {filteredTasks.length === 0 && hasActiveFilters && (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center text-[var(--taskify-text-secondary)]">
                  <div className="max-w-sm mx-auto">
                    {(() => {
                      const noTasksInfo = getNoTasksMessage()
                      return (
                        <>
                          <div className="w-12 h-12 mx-auto mb-3 bg-[var(--taskify-hover)] rounded-full flex items-center justify-center">
                            <span className="text-2xl">{noTasksInfo.emoji}</span>
                          </div>
                          <h4 className="text-lg font-semibold mb-2 text-[var(--taskify-text-primary)]">{noTasksInfo.title}</h4>
                          <p className="text-sm mb-4 text-[var(--taskify-text-secondary)] leading-relaxed">{noTasksInfo.message}</p>
                          <Button 
                            onClick={handleGoToInbox}
                            variant="outline" 
                            size="sm"
                            className="text-[var(--taskify-content)] border-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white transition-all duration-200"
                          >
                            <span className="mr-2">📥</span>
                            Clear Filter
                          </Button>
                        </>
                      )
                    })()}
                  </div>
                </div>
              )}

              <TaskInput category={selectedProject.name} />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show message if no tasks in Inbox or Today views
  const isInboxOrToday = currentView === "inbox" || (currentView === "today")
  
  if (isInboxOrToday && filteredTasks.length === 0) {
    const noTasksInfo = getNoTasksMessage()
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-[var(--taskify-text-secondary)]">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-[var(--taskify-hover)] rounded-full flex items-center justify-center">
            <span className="text-3xl">{noTasksInfo.emoji}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-[var(--taskify-text-primary)]">{noTasksInfo.title}</h3>
          <p className="text-sm mb-2 text-[var(--taskify-text-secondary)] leading-relaxed">{noTasksInfo.message}</p>
          <p className="text-xs text-[var(--taskify-text-secondary)]/80 mb-6">{noTasksInfo.action}</p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {hasActiveFilters && (
              <Button 
                onClick={handleGoToInbox}
                variant="outline" 
                className="text-[var(--taskify-content)] border-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white transition-all duration-200"
              >
                <span className="mr-2">📥</span>
                Clear Filter
              </Button>
            )}
            
            {currentView === "inbox" && filterPriority === "all" && filterDate === "all" && !searchQuery.trim() && (
              <AddProjectDialog
                mode="create"
                onAddProject={handleAddProject}
                trigger={
                  <Button 
                    disabled={isAddingProject}
                    className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                   {isAddingProject ? <Loader2 className="animate-spin w-4 h-4 mr-2"/> : <Plus className="w-4 h-4 mr-2" />}
                    Create New Project
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter Status Bar - Show when there are active filters and tasks */}
      {hasActiveFilters && filteredTasks.length > 0 && (
        <Card className="bg-[var(--taskify-background)] border-[var(--taskify-border)] shadow-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-[var(--taskify-text-secondary)]">
                  Filtered by:
                </span>
                {getActiveFiltersDisplay().map((filter, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className={`text-xs font-medium border ${filter.color}`}
                  >
                    {filter.label}
                    <button
                      onClick={() => {
                        if (filter.type === "priority") setFilterPriority("all")
                        if (filter.type === "date") setFilterDate("all")
                        if (filter.type === "search") setSearchQuery("")
                      }}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </Badge>
                ))}
                <span className="text-xs text-[var(--taskify-text-secondary)]">
                  ({filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} found)
                </span>
              </div>
              <Button
                onClick={handleGoToInbox}
                variant="outline"
                size="sm"
                className="text-[var(--taskify-content)] border-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white transition-all duration-200 self-start sm:self-auto"
              >
                <ArrowLeft className="w-3 h-3 mr-2" />
                Clear Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {Object.keys(groupedTasks).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-[var(--taskify-text-secondary)]">
          {(() => {
            const noTasksInfo = getNoTasksMessage()
            return (
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-[var(--taskify-hover)] rounded-full flex items-center justify-center">
                  <span className="text-3xl">{noTasksInfo.emoji}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[var(--taskify-text-primary)]">{noTasksInfo.title}</h3>
                <p className="text-sm mb-2 text-[var(--taskify-text-secondary)] leading-relaxed">{noTasksInfo.message}</p>
                <p className="text-xs text-[var(--taskify-text-secondary)]/80 mb-6">{noTasksInfo.action}</p>
                
                {hasActiveFilters && (
                  <Button 
                    onClick={handleGoToInbox}
                    variant="outline" 
                    className="text-[var(--taskify-content)] border-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white transition-all duration-200"
                  >
                    <span className="mr-2">📥</span>
                    Clear Filter
                  </Button>
                )}
              </div>
            )
          })()}
        </div>
      ) : (
        Object.entries(groupedTasks).map(([category, categoryTasks]) => (
          <Card key={category} className="bg-[var(--background)] border-[var(--taskify-border)] shadow-sm overflow-hidden">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-6">
                <h3 className="text-sm sm:text-lg font-semibold text-[var(--taskify-text-primary)] font-display truncate flex-1">
                  {category}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[var(--taskify-content)] hover:bg-[var(--taskify-content)] hover:text-white flex-shrink-0 ml-2 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:px-3 sm:py-2"
                  onClick={() => addTask(category)}
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add task</span>
                </Button>
              </div>

              <div className="space-y-2 sm:space-y-4">
                {categoryTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}

                <TaskInput category={category} />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
