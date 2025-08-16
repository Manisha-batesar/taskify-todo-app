// SEO Component
export { default as SEO } from './SEO'

// Auth Components
export { default as WelcomeScreen } from './auth/WelcomeScreen'
export { default as SignInForm } from './auth/SignInForm'
export { default as SignUpForm } from './auth/SignUpForm'
export { default as ProtectedRoute } from './auth/ProtectedRoute'

// Layout Components
export { default as Sidebar } from './layout/Sidebar'
export { default as Header } from './layout/Header'
export { default as DashboardLayout } from './layout/DashboardLayout'

// Task Components
export { default as TaskCard } from './tasks/TaskCard'
export { default as TaskInput } from './tasks/TaskInput'
export { default as TaskList } from './tasks/TaskList'

// Project Components
export { default as ProjectDialog } from './projects/ProjectDialog'
export { default as ProjectList } from './projects/ProjectList'
export { default as ProjectItem } from './projects/ProjectItem'
export { default as AddProjectDialog } from './projects/AddProjectForm' // Legacy export

// Loading Components
export { AuthFormSkeleton } from './loading/AuthFormSkeleton'
export { WelcomeScreenSkeleton } from './loading/WelcomeScreenSkeleton'
export { TaskListSkeleton } from './loading/TaskListSkeleton'
export { SidebarSkeleton } from './loading/SidebarSkeleton'
export { HeaderSkeleton } from './loading/HeaderSkeleton'
export { DashboardSkeleton } from './loading/DashboardSkeleton'
export { TodayTasksSkeleton } from './loading/TodayTasksSkeleton'
