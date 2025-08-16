# Taskify Todo App - AI Coding Assistant Guide

## Architecture Overview

This is a Next.js 15 task management app with **Supabase** for auth/database, **React Context** for state, and **shadcn/ui** components. The app follows a **dual-state pattern** where UI state is managed in React Context while database operations sync asynchronously.

### Core Data Flow
1. **Authentication**: Supabase auth → `AuthContext` → automatic user session management
2. **Tasks/Projects**: Database operations via `lib/` functions → Context state updates → UI re-renders
3. **Route Protection**: Client-side auth checks in layouts (middleware is currently disabled)

## Key Patterns & Conventions

### Context Architecture
- `AuthContext`: Manages user sessions, provides `signIn/signUp/signOut` methods
- `TaskContext`: Manages tasks, projects, and UI state (current view, filters, search)
- **Critical**: Both contexts are wrapped in root layout, contexts depend on each other (`TaskContext` uses `useAuth()`)

### Database Integration
- **Files**: `lib/supabase.ts`, `lib/tasks.ts`, `lib/projects.ts`
- **Pattern**: All database functions are async, handle auth checks internally via `supabase.auth.getUser()`
- **Schema**: `profiles` → `projects` → `tasks` (cascade deletes enabled)
- **Types**: `types/index.ts` defines UI types, `lib/` files define database types

### Component Structure
```
components/
├── auth/           # Authentication forms and protection
├── layout/         # Sidebar, Header, DashboardLayout
├── tasks/          # TaskCard, TaskInput, TaskList
├── projects/       # Project CRUD dialogs and lists
└── ui/             # shadcn/ui components (don't modify directly)
```

### Route Groups & Layouts
- `app/(auth)/`: Public routes with minimal layout
- `app/(protected)/`: Requires authentication, uses DashboardLayout
- **Current**: Route protection is client-side only in layout components

## Development Workflows

### Environment Setup
```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
```

### Database Schema Management
- **Schema**: `schema.sql` contains table definitions
- **Policies**: `supabase-policies.sql` for RLS (Row Level Security)
- Apply manually in Supabase dashboard or via CLI

### Adding New Features
1. **Database**: Update `schema.sql`, add to Supabase
2. **Types**: Add interfaces to `types/index.ts`
3. **Database Layer**: Create functions in `lib/` directory
4. **Context**: Add state/methods to appropriate context
5. **UI**: Create components following existing patterns

## Critical Implementation Details

### State Synchronization
- **Pattern**: Database operations update both database AND local context state
- **Example**: `addTask()` calls `createTask()` API then updates local `tasks` array
- **Gotcha**: Context state can be out of sync if database operations fail

### Authentication Flow
- Uses Supabase's `onAuthStateChange` listener in `AuthContext`
- User object constructed from session metadata: `session.user.user_metadata?.name`
- **Loading states**: All auth operations set `loading: true` during API calls

### Project-Task Relationship
- Tasks belong to projects via `project_id` foreign key
- UI uses `category` field which maps to project names
- **Helper functions**: `getProjectNameById()` and `getProjectIdByName()` in TaskContext

### UI State Management
- `currentView`: "today" | "project" | "inbox" | "search"
- `selectedProject`: Used when `currentView === "project"`
- **Date handling**: All dates as ISO strings (YYYY-MM-DD format)

## Common Patterns

### Database Function Pattern
```typescript
export async function createSomething(): Promise<DatabaseType | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')
  
  const { data, error } = await supabase.from('table').insert().select().single()
  if (error) throw error
  return data
}
```

### Context Method Pattern
```typescript
const addSomething = async (params: string) => {
  try {
    const dbResult = await createSomething(params)
    if (dbResult) {
      setLocalState(prev => [...prev, transformToUIType(dbResult)])
    }
  } catch (error) {
    console.error('Failed to add:', error)
  }
}
```

### Form Handling
- Uses `react-hook-form` with `zod` validation
- Error handling via return objects: `{ error?: string }`
- **Success flows**: Clear forms, close dialogs, update context state

## Important Files
- `context/TaskContext.tsx`: Central state management, contains most business logic
- `lib/tasks.ts` & `lib/projects.ts`: Database operations layer
- `app/layout.tsx`: Root layout with context providers
- `types/index.ts`: Core type definitions
- `schema.sql`: Database schema reference
