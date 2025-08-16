import { Skeleton } from "@/components/ui/skeleton"

export function HeaderSkeleton() {
  return (
    <header className="bg-white border-b border-[var(--taskify-border)] px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side - Menu and title */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 lg:hidden" />
          <Skeleton className="h-6 w-32" />
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 md:hidden" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </header>
  )
}
