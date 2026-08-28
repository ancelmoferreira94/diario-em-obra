ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.diaries ADD COLUMN IF NOT EXISTS user_id uuid;

UPDATE public.projects SET user_id = '96dfe054-2faa-4b91-ad10-4bbe7a94abfb' WHERE user_id IS NULL;
UPDATE public.diaries SET user_id = '96dfe054-2faa-4b91-ad10-4bbe7a94abfb' WHERE user_id IS NULL;

ALTER TABLE public.projects ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.diaries ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.projects ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.diaries ALTER COLUMN user_id SET DEFAULT auth.uid();

DROP POLICY IF EXISTS authenticated_users_projects ON public.projects;
DROP POLICY IF EXISTS authenticated_users_diaries ON public.diaries;

CREATE POLICY "Users manage their own projects"
  ON public.projects FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users manage their own diaries"
  ON public.diaries FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS projects_user_id_idx ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS diaries_user_id_idx ON public.diaries(user_id);