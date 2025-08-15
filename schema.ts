create table public.profiles (
  id uuid not null default extensions.uuid_generate_v4 (),
  email text not null,
  name text null,
  created_at timestamp without time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_email_key unique (email)
) TABLESPACE pg_default;

create table public.projects (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid null,
  title text not null,
  description text null,
  created_at timestamp without time zone null default now(),
  constraint projects_pkey primary key (id),
  constraint projects_user_id_fkey foreign KEY (user_id) references profiles (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.tasks (
  id uuid not null default extensions.uuid_generate_v4 (),
  project_id uuid null,
  title text not null,
  description text null,
  due_date date null,
  completed boolean null default false,
  created_at timestamp without time zone null default now(),
  constraint tasks_pkey primary key (id),
  constraint tasks_project_id_fkey foreign KEY (project_id) references projects (id) on delete CASCADE
) TABLESPACE pg_default;

