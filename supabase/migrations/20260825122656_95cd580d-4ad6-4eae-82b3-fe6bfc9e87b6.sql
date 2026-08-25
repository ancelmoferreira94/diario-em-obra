DROP POLICY IF EXISTS "public access projects" ON public.projects;
DROP POLICY IF EXISTS "public access diaries" ON public.diaries;

REVOKE ALL ON public.projects FROM anon;
REVOKE ALL ON public.diaries FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.diaries TO authenticated;
GRANT ALL ON public.projects TO service_role;
GRANT ALL ON public.diaries TO service_role;

CREATE POLICY "authenticated_users_projects" ON public.projects
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_users_diaries" ON public.diaries
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);