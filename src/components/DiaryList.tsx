import { DiaryEntry, Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Users, DollarSign, ArrowLeft, Settings, Calendar } from 'lucide-react';

interface DiaryListProps {
  project: Project;
  diaries: DiaryEntry[];
  onNew: () => void;
  onOpen: (diary: DiaryEntry) => void;
  onBack: () => void;
  onSettings: () => void;
  onPlanning: () => void;
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function getTotalStaff(diary: DiaryEntry): number {
  return diary.staffJpl.reduce((sum, s) => sum + s.quantity, 0) +
    diary.contractors.reduce((sum, c) => sum + c.employees, 0);
}

function getTotalFinancial(diary: DiaryEntry): number {
  return diary.executedServices.reduce((sum, s) => sum + s.executedDay * s.unitPrice, 0);
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const DiaryList = ({ project, diaries, onNew, onOpen, onBack, onSettings, onPlanning }: DiaryListProps) => {
  const sorted = [...diaries].sort((a, b) => b.number - a.number);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 animate-fade-in">
      <div className="bg-primary text-primary-foreground rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Diário de Obra</h1>
            <p className="text-primary-foreground/80 text-sm mt-1">{project.name}</p>
            <p className="text-primary-foreground/60 text-xs mt-0.5">Contrato: {project.contract}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={onPlanning} variant="secondary" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" /> Planejamento
            </Button>
            <Button onClick={onSettings} variant="secondary" size="sm" className="gap-2">
              <Settings className="h-4 w-4" /> Configurações
            </Button>
            <Button onClick={onNew} variant="secondary" size="lg" className="gap-2">
              <Plus className="h-5 w-5" /> Novo Diário
            </Button>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack} className="mt-2 text-primary-foreground/70 gap-1.5 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Voltar às Obras
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nenhum diário registrado</p>
          <p className="text-sm mt-1">Clique em "Novo Diário" para começar</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map(diary => {
            const totalStaff = getTotalStaff(diary);
            const totalFinancial = getTotalFinancial(diary);
            return (
              <Card
                key={diary.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary"
                onClick={() => onOpen(diary)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary font-bold rounded-md w-12 h-12 flex items-center justify-center text-lg">
                        {String(diary.number).padStart(2, '0')}
                      </div>
                      <div>
                        <p className="font-medium">Diário nº {String(diary.number).padStart(2, '0')}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(diary.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        {totalStaff} func.
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        {formatCurrency(totalFinancial)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiaryList;
