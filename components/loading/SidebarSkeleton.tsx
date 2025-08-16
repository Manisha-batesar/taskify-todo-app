import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function SidebarSkeleton() {
  return (
    <div className="w-64 bg-white border-r border-[var(--taskify-border)] flex flex-col h-full">
      {/* User section skeleton */}
      <div className="p-4 border-b border-[var(--taskify-border)]">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <Skeleton className="h-full w-full rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>

      {/* Search skeleton */}
      <div className="p-4 border-b border-[var(--taskify-border)]">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Navigation skeleton */}
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-16 mb-3" />
        
        {/* Nav items */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-6 ml-auto" />
          </div>
        ))}
      </div>

      {/* Projects section skeleton */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        
        {/* Project items */}
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom section skeleton */}
      <div className="p-4 border-t border-[var(--taskify-border)]">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
