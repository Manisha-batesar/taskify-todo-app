import { Skeleton } from "@/components/ui/skeleton"

export function WelcomeScreenSkeleton() {
  return (
    <div className="flex h-screen bg-[var(--taskify-background)]">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-sm sm:max-w-md w-full text-center space-y-6 sm:space-y-8">
          {/* Logo section skeleton */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <Skeleton className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-8 w-24 sm:h-9 sm:w-28" />
              <Skeleton className="h-4 w-32 sm:h-5 sm:w-36" />
            </div>
          </div>

          {/* Welcome message skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <Skeleton className="h-6 w-48 sm:h-7 sm:w-56 mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </div>

          {/* Auth buttons skeleton */}
          <div className="flex items-center justify-center flex-col w-full gap-4">
            <Skeleton className="h-11 sm:h-12 w-full" />
            <Skeleton className="h-11 sm:h-12 w-full" />
          </div>

          {/* Features section skeleton */}
          <div className="grid grid-cols-1 gap-4 mt-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-white/50 border border-[var(--taskify-border)]">
                <Skeleton className="w-5 h-5 rounded-full mt-0.5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
