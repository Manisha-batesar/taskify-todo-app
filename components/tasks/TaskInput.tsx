"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTask } from "@/context/TaskContext"
import { 
  Circle, 
  Plus, 
  Calendar, 
  Flag,
  Clock,
  X,
  ChevronDown
} from "lucide-react"

interface TaskInputProps {
  category: string
}

export default function TaskInput({ category }: TaskInputProps) {
  const { newTask, setNewTask, addTask } = useTask()
  const [dueDate, setDueDate] = useState("")
  const [priority, setPriority] = useState<"normal" | "medium" | "high">("normal")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (submittedPriority?: "normal" | "medium" | "high") => {
    if (!newTask.trim()) return
    
    setIsSubmitting(true)
    try {
      const finalPriority = submittedPriority || priority
      await addTask(category, finalPriority, dueDate)
      setPriority("normal") // Reset priority after submission
      setDueDate("") // Reset date after submission
      setIsExpanded(false) // Collapse the form
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearForm = () => {
    setNewTask("")
    setDueDate("")
    setPriority("normal")
    setIsExpanded(false)
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'normal': return '🟢'
      default: return '🟢'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'normal': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getQuickDateOption = (option: string) => {
    const today = new Date()
    switch (option) {
      case 'today':
        return today.toISOString().split('T')[0]
      case 'tomorrow':
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)
        return tomorrow.toISOString().split('T')[0]
      case 'week':
        const nextWeek = new Date(today)
        nextWeek.setDate(today.getDate() + 7)
        return nextWeek.toISOString().split('T')[0]
      default:
        return ''
    }
  }

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    if (dateString === today.toISOString().split('T')[0]) return 'Today'
    if (dateString === tomorrow.toISOString().split('T')[0]) return 'Tomorrow'
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <div className={`transition-all duration-300 rounded-lg border-2 border-dashed ${
      isExpanded 
        ? 'border-[var(--taskify-content)] bg-[var(--taskify-hover)]/30' 
        : 'border-[var(--taskify-border)] hover:border-[var(--taskify-content)]/30'
    }`}>
      {/* Main Input Row */}
      <div className="flex items-center gap-3 p-4 sm:p-5">
        <Circle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-colors ${
          isExpanded ? 'text-[var(--taskify-content)]' : 'text-[var(--taskify-text-secondary)]'
        }`} />
        
        <div className="flex-1 min-w-0">
          <Input
            placeholder="What needs to be done?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isExpanded) {
                handleSubmit()
              } else if (e.key === "Enter" && e.ctrlKey) {
                handleSubmit()
              }
            }}
            onFocus={() => setIsExpanded(true)}
            className="border-none bg-transparent focus:ring-0 focus-visible:ring-0 px-2 py-2 font-medium text-sm sm:text-base placeholder:text-[var(--taskify-text-secondary)] shadow-none h-auto"
            disabled={isSubmitting}
          />
        </div>

        {!isExpanded && (
          <Button
            size="sm"
            onClick={() => handleSubmit()}
            disabled={!newTask.trim() || isSubmitting}
            className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white h-8 w-8 p-0 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
          </Button>
        )}
      </div>

      {/* Expanded Options */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-[var(--taskify-border)]/50 bg-[var(--background)]/80 backdrop-blur-sm">
          <div className="flex flex-col gap-4 mt-4">
            {/* Active Tags Display */}
            {(dueDate || priority !== 'normal') && (
              <div className="flex flex-wrap gap-2">
                {dueDate && (
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDateDisplay(dueDate)}
                    <button
                      onClick={() => setDueDate("")}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </Badge>
                )}
                {priority !== 'normal' && (
                  <Badge variant="secondary" className={`text-xs ${getPriorityColor(priority)}`}>
                    <Flag className="w-3 h-3 mr-1" />
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    <button
                      onClick={() => setPriority("normal")}
                      className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Options Row */}
            <div className="flex flex-wrap gap-2">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs border-[var(--taskify-border)] hover:border-[var(--taskify-content)] hover:bg-[var(--taskify-content)]/5"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Due Date
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4" align="start">
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-[var(--taskify-text-secondary)] mb-3">Quick options:</div>
                    {[
                      { label: 'Today', value: 'today' },
                      { label: 'Tomorrow', value: 'tomorrow' },
                      { label: 'Next Week', value: 'week' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDueDate(getQuickDateOption(option.value))}
                        className="w-full text-left px-3 py-2 text-sm rounded hover:bg-[var(--taskify-hover)] transition-colors"
                      >
                        {option.label}
                      </button>
                    ))}
                    <div className="border-t pt-3 mt-3">
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--taskify-border)] rounded text-sm bg-[var(--background)] focus:border-[var(--taskify-content)] focus:ring-1 focus:ring-[var(--taskify-content)] transition-all duration-200"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Priority Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`text-xs border-[var(--taskify-border)] hover:border-[var(--taskify-content)] hover:bg-[var(--taskify-content)]/5 ${
                      priority !== 'normal' ? getPriorityColor(priority) : ''
                    }`}
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {getPriorityIcon(priority)} {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-3" align="start">
                  <div className="space-y-2">
                    {[
                      { value: 'normal', label: 'Normal', icon: '🟢', color: 'hover:bg-green-50' },
                      { value: 'medium', label: 'Medium', icon: '🟡', color: 'hover:bg-yellow-50' },
                      { value: 'high', label: 'High', icon: '🔴', color: 'hover:bg-red-50' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setPriority(option.value as "normal" | "medium" | "high")}
                        className={`w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center gap-2 ${option.color} ${
                          priority === option.value ? 'bg-[var(--taskify-content)]/10 text-[var(--taskify-content)]' : ''
                        }`}
                      >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                        {priority === option.value && (
                          <span className="ml-auto text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearForm}
                className="text-xs text-[var(--taskify-text-secondary)] hover:text-[var(--taskify-text-primary)]"
              >
                Cancel
              </Button>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleSubmit()}
                  disabled={!newTask.trim() || isSubmitting}
                  className="bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white px-4 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 mr-2" />
                      Add Task
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Keyboard Hint */}
            <div className="text-xs text-[var(--taskify-text-secondary)]/70 text-center pt-2">
              Press Ctrl+Enter to add task quickly
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
