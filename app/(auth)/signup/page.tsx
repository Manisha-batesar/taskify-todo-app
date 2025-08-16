import type { Metadata } from "next"
import SignUpForm from "@/components/auth/SignUpForm"

export const metadata: Metadata = {
  title: "Sign Up - Start Your Productivity Journey",
  description: "Create your free Taskify account and start organizing your tasks, projects, and goals. Join thousands of users who've transformed their productivity with Taskify.",
  openGraph: {
    title: "Sign Up for Taskify - Free Task Management App",
    description: "Create your free account and start organizing your tasks, projects, and goals. Join thousands of productive users on Taskify today.",
    url: "/signup",
  },
  twitter: {
    title: "Sign Up for Taskify - Free Task Management App",
    description: "Create your free account and start organizing your tasks, projects, and goals. Join thousands of productive users on Taskify today.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SignUpPage() {
  return <SignUpForm />
}
