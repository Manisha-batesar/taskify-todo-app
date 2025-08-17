"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useTask } from "@/context/TaskContext"
import { Filter, Calendar, AlertCircle, X, Check } from "lucide-react"

interface FilterDropdownProps {
  showFilters: boolean
  setShowFilters: (show: boolean) => void
}

export default function FilterDropdown({ showFilters, setShowFilters }: FilterDropdownProps) {
  const { 
    filterPriority, 
    setFilterPriority, 
    filterDate, 
    setFilterDate 
  } = useTask()
  
  const [selectedDate, setSelectedDate] = useState("")
  
  const hasActiveFilters = filterPriority !== "all" || filterDate !== "all"

  const handleDateFilter = () => {
    if (selectedDate) {
      setFilterDate(selectedDate)
      setShowFilters(false)
    }
  }

  const handlePriorityFilter = (priority: string) => {
    setFilterPriority(priority)
    setShowFilters(false)
  }

  const handleWeekFilter = () => {
    setFilterDate("week")
    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilterPriority("all")
    setFilterDate("all")
    setSelectedDate("")
    setShowFilters(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'normal': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative ${hasActiveFilters ? "bg-[var(--taskify-content)] text-white hover:bg-[var(--taskify-accent)]" : "hover:bg-[var(--taskify-hover)]"}`}
        >
          <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
          {hasActiveFilters && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-0"
            >
              {(filterPriority !== "all" ? 1 : 0) + (filterDate !== "all" ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-0">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--taskify-border)] bg-[var(--taskify-background)]">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-[var(--taskify-text-primary)] flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter Tasks
            </h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <X className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          {hasActiveFilters && (
            <div className="flex gap-1 mt-2">
              {filterPriority !== "all" && (
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getPriorityColor(filterPriority)} capitalize`}
                >
                  {filterPriority} Priority
                  <button
                    onClick={() => setFilterPriority("all")}
                    className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              )}
              {filterDate !== "all" && (
                <Badge 
                  variant="secondary" 
                  className="text-xs text-blue-600 bg-blue-50 border-blue-200"
                >
                  <Calendar className="w-2.5 h-2.5 mr-1" />
                  {filterDate === "week" ? "This Week" : formatDate(filterDate)}
                  <button
                    onClick={() => setFilterDate("all")}
                    className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="p-2">
          {/* Priority Filter */}
          <div className="mb-4">
            <DropdownMenuLabel className="text-xs font-medium text-[var(--taskify-text-secondary)] uppercase tracking-wide px-2 py-1">
              Filter by Priority
            </DropdownMenuLabel>
            <div className="space-y-1">
              {[
                { value: 'high', label: 'High Priority', color: 'text-red-500', bgColor: 'hover:bg-red-50' },
                { value: 'medium', label: 'Medium Priority', color: 'text-yellow-500', bgColor: 'hover:bg-yellow-50' },
                { value: 'normal', label: 'Normal Priority', color: 'text-green-500', bgColor: 'hover:bg-green-50' }
              ].map((priority) => (
                <DropdownMenuItem 
                  key={priority.value}
                  onClick={() => handlePriorityFilter(priority.value)}
                  className={`cursor-pointer ${priority.bgColor} transition-colors`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-4 h-4 ${priority.color}`} />
                      <span className="font-medium">{priority.label}</span>
                    </div>
                    {filterPriority === priority.value && (
                      <Check className="w-4 h-4 text-[var(--taskify-content)]" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Date Filter */}
          <div className="mt-4">
            <DropdownMenuLabel className="text-xs font-medium text-[var(--taskify-text-secondary)] uppercase tracking-wide px-2 py-1">
              Filter by Due Date
            </DropdownMenuLabel>
            <div className="px-2 py-2 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--taskify-text-secondary)]" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 h-9 text-sm border-[var(--taskify-border)] focus:border-[var(--taskify-content)] focus:ring-1 focus:ring-[var(--taskify-content)]"
                    placeholder="Select date"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={handleDateFilter}
                  disabled={!selectedDate}
                  className="h-9 px-3 text-sm bg-[var(--taskify-content)] hover:bg-[var(--taskify-accent)] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </Button>
              </div>
              
              {/* Quick date filters */}
              <div className="space-y-1">
                <div className="text-xs text-[var(--taskify-text-secondary)] mb-2">Quick filters:</div>
                {[
                  { label: 'Today', value: new Date().toISOString().split('T')[0] },
                  { label: 'Tomorrow', value: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
                  { label: 'This Week', value: 'week' }
                ].map((quickFilter) => (
                  <button
                    key={quickFilter.label}
                    onClick={() => {
                      if (quickFilter.value === 'week') {
                        handleWeekFilter()
                      } else {
                        setSelectedDate(quickFilter.value)
                        setFilterDate(quickFilter.value)
                        setShowFilters(false)
                      }
                    }}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded hover:bg-[var(--taskify-hover)] transition-colors ${
                      filterDate === quickFilter.value ? 'bg-[var(--taskify-content)]/10 text-[var(--taskify-content)]' : ''
                    }`}
                  >
                    {quickFilter.label}
                    {filterDate === quickFilter.value && (
                      <Check className="w-3 h-3 float-right mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
