import { useState, useCallback, useEffect } from 'react';
import { DiaryEntry, Project, createNewDiary, createDefaultProject, MonthlyPlanningEntry } from '@/lib/types';
import { loadDiaries, saveDiary, deleteDiary, loadProjects, saveProject, deleteProject, loadPlanning } from '@/lib/storage';
import DiaryList from '@/components/DiaryList';
import DiaryForm from '@/components/DiaryForm';
import ProjectList from '@/components/ProjectList';
import ProjectSettings from '@/components/ProjectSettings';
import MonthlyPlanning from '@/components/MonthlyPlanning';

type View = 'projects' | 'diaries' | 'form' | 'project-settings' | 'planning';

const Index = () => {
  const [view, setView] = useState<View>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentDiary, setCurrentDiary] = useState<DiaryEntry | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load projects on mount
  useEffect(() => {
    loadProjects().then(p => { setProjects(p); setLoading(false); });
  }, []);

  // Load diaries when project changes
  useEffect(() => {
    if (currentProject) {
      loadDiaries(currentProject.id).then(setDiaries);
    }
  }, [currentProject?.id]);

  const handleSelectProject = useCallback((project: Project) => {
    setCurrentProject(project);
    setView('diaries');
  }, []);

  const handleNewProject = useCallback(async () => {
    const p = createDefaultProject();
    const updated = await saveProject(p);
    setProjects(updated);
    setCurrentProject(p);
    setView('project-settings');
  }, []);

  const handleDeleteProject = useCallback(async (id: string) => {
    const updated = await deleteProject(id);
    setProjects(updated);
    setDiaries(prev => prev.filter(d => d.projectId !== id));
  }, []);

  const handleOpenSettings = useCallback((project: Project) => {
    setCurrentProject(project);
    setView('project-settings');
  }, []);

  const handleSaveProject = useCallback(async (project: Project) => {
    const updated = await saveProject(project);
    setProjects(updated);
    setCurrentProject(project);
    setView('diaries');
  }, []);

  const handleNewDiary = useCallback(() => {
    if (!currentProject) return;
    const planningEntries = loadPlanning();
    const newDiary = createNewDiary(currentProject, diaries, planningEntries);
    setCurrentDiary(newDiary);
    setReadOnly(false);
    setView('form');
  }, [currentProject, diaries]);

  const handleOpenDiary = useCallback((diary: DiaryEntry) => {
    setCurrentDiary(diary);
    setReadOnly(true);
    setView('form');
  }, []);

  const handleSaveDiary = useCallback(async (diary: DiaryEntry) => {
    const updated = await saveDiary(diary);
    setDiaries(updated);
    setView('diaries');
  }, []);

  const handleDeleteDiary = useCallback(async (id: string) => {
    if (!currentProject) return;
    const updated = await deleteDiary(id, currentProject.id);
    setDiaries(updated);
    setCurrentDiary(null);
    setView('diaries');
    toast.success('Diário excluído com sucesso!');
  }, [currentProject]);

  const handleCancel = useCallback(() => {
    if (view === 'form') setView('diaries');
    else if (view === 'project-settings') setView(currentProject ? 'diaries' : 'projects');
    else if (view === 'planning') setView('diaries');
    else setView('projects');
    setCurrentDiary(null);
  }, [view, currentProject]);

  const handleEdit = useCallback(() => setReadOnly(false), []);

  const handleOpenPlanning = useCallback(() => setView('planning'), []);

  const projectDiaries = currentProject
    ? diaries.filter(d => d.projectId === currentProject.id)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {view === 'projects' && (
        <ProjectList
          projects={projects}
          onSelect={handleSelectProject}
          onNew={handleNewProject}
          onDelete={handleDeleteProject}
          onSettings={handleOpenSettings}
        />
      )}
      {view === 'diaries' && currentProject && (
        <DiaryList
          project={currentProject}
          diaries={projectDiaries}
          onNew={handleNewDiary}
          onOpen={handleOpenDiary}
          onBack={() => setView('projects')}
          onSettings={() => { setView('project-settings'); }}
          onPlanning={handleOpenPlanning}
        />
      )}
      {view === 'form' && currentDiary && currentProject && (
        <DiaryForm
          project={currentProject}
          diary={currentDiary}
          allDiaries={diaries}
          readOnly={readOnly}
          onSave={handleSaveDiary}
          onCancel={handleCancel}
          onEdit={handleEdit}
          onBack={() => { setView('diaries'); setCurrentDiary(null); }}
          onDelete={handleDeleteDiary}
        />
      )}
      {view === 'project-settings' && currentProject && (
        <ProjectSettings
          project={currentProject}
          onSave={handleSaveProject}
          onCancel={handleCancel}
        />
      )}
      {view === 'planning' && currentProject && (
        <MonthlyPlanning
          project={currentProject}
          diaries={projectDiaries}
          onBack={handleCancel}
        />
      )}
    </div>
  );
};

export default Index;
