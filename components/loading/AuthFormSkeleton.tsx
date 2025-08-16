import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AuthFormSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--taskify-background)] p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="space-y-2">
          {/* Title skeleton */}
          <Skeleton className="h-7 w-32 mx-auto" />
          {/* Subtitle skeleton */}
          <Skeleton className="h-4 w-48 mx-auto" />
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Email field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          {/* Password field skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          {/* Submit button skeleton */}
          <Skeleton className="h-10 w-full" />
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <Skeleton className="h-px flex-1" />
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-px flex-1" />
          </div>
          
          {/* Social login buttons */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          
          {/* Footer link skeleton */}
          <div className="text-center">
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
