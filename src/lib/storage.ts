import { DiaryEntry, Project, MonthlyPlanningEntry } from './types';
import { supabase } from '@/integrations/supabase/client';

// Projects
export async function loadProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) { console.error('loadProjects error:', error); return []; }
  return (data || []).map(row => ({ ...row.data as unknown as Project, id: row.id, name: row.name }));
}

export async function saveProject(project: Project): Promise<Project[]> {
  const { id, name, ...rest } = project;
  const { error } = await supabase.from('projects').upsert({
    id,
    name,
    data: { ...project } as unknown as Record<string, unknown>,
  });
  if (error) console.error('saveProject error:', error);
  return loadProjects();
}

export async function deleteProject(id: string): Promise<Project[]> {
  // Diaries cascade on delete
  await supabase.from('planning').delete().eq('project_id', id).then(() => {});
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) console.error('deleteProject error:', error);
  return loadProjects();
}

// Diaries
export async function loadDiaries(projectId?: string): Promise<DiaryEntry[]> {
  let query = supabase.from('diaries').select('*');
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error } = await query;
  if (error) { console.error('loadDiaries error:', error); return []; }
  return (data || []).map(row => row.data as unknown as DiaryEntry);
}

export async function saveDiary(diary: DiaryEntry): Promise<DiaryEntry[]> {
  const { error } = await supabase.from('diaries').upsert({
    id: diary.id,
    project_id: diary.projectId,
    data: { ...diary } as unknown as Record<string, unknown>,
  });
  if (error) console.error('saveDiary error:', error);
  return loadDiaries(diary.projectId);
}

export async function deleteDiary(id: string, projectId: string): Promise<DiaryEntry[]> {
  const { error } = await supabase.from('diaries').delete().eq('id', id);
  if (error) console.error('deleteDiary error:', error);
  return loadDiaries(projectId);
}

// Monthly Planning - keep in localStorage for now (no table yet)
const PLANNING_KEY = 'jpl-gomes-planning';

export function loadPlanning(): MonthlyPlanningEntry[] {
  try {
    const data = localStorage.getItem(PLANNING_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function savePlanning(entries: MonthlyPlanningEntry[]): void {
  localStorage.setItem(PLANNING_KEY, JSON.stringify(entries));
}

export function savePlanningEntry(entry: MonthlyPlanningEntry): MonthlyPlanningEntry[] {
  const entries = loadPlanning();
  const index = entries.findIndex(e => e.id === entry.id);
  if (index >= 0) entries[index] = entry;
  else entries.push(entry);
  savePlanning(entries);
  return entries;
}
