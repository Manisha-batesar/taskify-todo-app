import type { Metadata } from "next"
import SignInForm from "@/components/auth/SignInForm"

export const metadata: Metadata = {
  title: "Sign In - Access Your Tasks",
  description: "Sign in to your Taskify account to access your tasks, projects, and productivity dashboard. Secure login with email or social authentication.",
  openGraph: {
    title: "Sign In to Taskify - Task Management App",
    description: "Access your personal task management dashboard. Sign in securely to continue organizing your projects and achieving your goals.",
    url: "/signin",
  },
  twitter: {
    title: "Sign In to Taskify - Task Management App",
    description: "Access your personal task management dashboard. Sign in securely to continue organizing your projects and achieving your goals.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SignInPage() {
  return <SignInForm />
}
