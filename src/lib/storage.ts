import { DiaryEntry, Project, MonthlyPlanningEntry } from './types';

const PROJECTS_KEY = 'jpl-gomes-projects';
const DIARIES_KEY = 'jpl-gomes-diarios';
const PLANNING_KEY = 'jpl-gomes-planning';

// Projects
export function loadProjects(): Project[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function saveProject(project: Project): Project[] {
  const projects = loadProjects();
  const index = projects.findIndex(p => p.id === project.id);
  if (index >= 0) projects[index] = project;
  else projects.push(project);
  saveProjects(projects);
  return projects;
}

export function deleteProject(id: string): Project[] {
  const projects = loadProjects().filter(p => p.id !== id);
  saveProjects(projects);
  // Also delete associated diaries and planning
  const diaries = loadDiaries().filter(d => d.projectId !== id);
  saveDiaries(diaries);
  const planning = loadPlanning().filter(p => p.projectId !== id);
  savePlanning(planning);
  return projects;
}

// Diaries
export function loadDiaries(): DiaryEntry[] {
  try {
    const data = localStorage.getItem(DIARIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function saveDiaries(diaries: DiaryEntry[]): void {
  localStorage.setItem(DIARIES_KEY, JSON.stringify(diaries));
}

export function saveDiary(diary: DiaryEntry): DiaryEntry[] {
  const diaries = loadDiaries();
  const index = diaries.findIndex(d => d.id === diary.id);
  if (index >= 0) diaries[index] = diary;
  else diaries.push(diary);
  saveDiaries(diaries);
  return diaries;
}

export function deleteDiary(id: string): DiaryEntry[] {
  const diaries = loadDiaries().filter(d => d.id !== id);
  saveDiaries(diaries);
  return diaries;
}

// Monthly Planning
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
