import { useState, useCallback } from 'react';
import { DiaryEntry, createNewDiary } from '@/lib/types';
import { loadDiaries, saveDiary } from '@/lib/storage';
import DiaryList from '@/components/DiaryList';
import DiaryForm from '@/components/DiaryForm';

type View = 'list' | 'form';

const Index = () => {
  const [view, setView] = useState<View>('list');
  const [diaries, setDiaries] = useState<DiaryEntry[]>(loadDiaries);
  const [currentDiary, setCurrentDiary] = useState<DiaryEntry | null>(null);
  const [readOnly, setReadOnly] = useState(false);

  const handleNew = useCallback(() => {
    const newDiary = createNewDiary(diaries);
    setCurrentDiary(newDiary);
    setReadOnly(false);
    setView('form');
  }, [diaries]);

  const handleOpen = useCallback((diary: DiaryEntry) => {
    setCurrentDiary(diary);
    setReadOnly(true);
    setView('form');
  }, []);

  const handleSave = useCallback((diary: DiaryEntry) => {
    const updated = saveDiary(diary);
    setDiaries(updated);
    setView('list');
  }, []);

  const handleCancel = useCallback(() => {
    setView('list');
    setCurrentDiary(null);
  }, []);

  const handleEdit = useCallback(() => {
    setReadOnly(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {view === 'list' && (
        <DiaryList diaries={diaries} onNew={handleNew} onOpen={handleOpen} />
      )}
      {view === 'form' && currentDiary && (
        <DiaryForm
          diary={currentDiary}
          allDiaries={diaries}
          readOnly={readOnly}
          onSave={handleSave}
          onCancel={handleCancel}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Index;
