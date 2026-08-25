import { useState } from 'react';
import { Project, ServiceCatalogItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProjectSettingsProps {
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ProjectSettings = ({ project: initial, onSave, onCancel }: ProjectSettingsProps) => {
  const [project, setProject] = useState<Project>({ ...initial });

  const update = <K extends keyof Project>(key: K, value: Project[K]) => {
    setProject(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(project);
    toast.success('Obra salva com sucesso!');
  };

  const addService = () => {
    const newService: ServiceCatalogItem = {
      id: crypto.randomUUID(),
      description: '',
      detail: '',
      unit: '',
      unitPrice: 0,
    };
    update('serviceCatalog', [...project.serviceCatalog, newService]);
  };

  const removeService = (index: number) => {
    update('serviceCatalog', project.serviceCatalog.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: keyof ServiceCatalogItem, value: string | number) => {
    const arr = [...project.serviceCatalog];
    arr[index] = { ...arr[index], [field]: value };
    update('serviceCatalog', arr);
  };

  const addStaffTeam = () => {
    update('defaultStaff', [...project.defaultStaff, { team: '', roles: [''] }]);
  };

  const addEquipment = () => {
    update('defaultEquipment', [...project.defaultEquipment, { quantity: 1, equipment: '', identification: '' }]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animate-fade-in">
      <div className="bg-primary text-primary-foreground rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">Configurações da Obra</h1>
            <p className="text-primary-foreground/70 text-sm">{project.name || 'Nova Obra'}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleSave} className="gap-1.5">
              <Save className="h-4 w-4" /> Salvar
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-primary-foreground/80 gap-1.5">
              <X className="h-4 w-4" /> Cancelar
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 mb-4">
          <TabsTrigger value="general" className="text-xs px-3 py-1.5">Dados Gerais</TabsTrigger>
          <TabsTrigger value="services" className="text-xs px-3 py-1.5">Catálogo de Serviços</TabsTrigger>
          <TabsTrigger value="staff" className="text-xs px-3 py-1.5">Equipes</TabsTrigger>
          <TabsTrigger value="equipment" className="text-xs px-3 py-1.5">Equipamentos</TabsTrigger>
          <TabsTrigger value="contractors" className="text-xs px-3 py-1.5">Empreiteiros</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <div className="bg-card rounded-lg p-6 border space-y-4">
            <h2 className="section-title">Dados Gerais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome da Obra</label>
                <Input value={project.name} onChange={e => update('name', e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contrato</label>
                <Input value={project.contract} onChange={e => update('contract', e.target.value)} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Rodovia(s)</label>
                <Input value={project.highway} onChange={e => update('highway', e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Escritório</label>
                <Input value={project.office} onChange={e => update('office', e.target.value)} className="mt-1" />
              </div>
              <div></div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Início do Contrato</label>
                <Input type="date" value={project.contractStart} onChange={e => update('contractStart', e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Término do Contrato</label>
                <Input type="date" value={project.contractEnd} onChange={e => update('contractEnd', e.target.value)} className="mt-1" />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Service Catalog */}
        <TabsContent value="services">
          <div className="bg-card rounded-lg p-6 border overflow-x-auto">
            <h2 className="section-title">Catálogo de Serviços</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Defina os serviços disponíveis para esta obra. Esses serviços serão usados na previsão e nos serviços executados de cada diário.
            </p>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Descrição (Grupo)</th>
                  <th>Detalhamento</th>
                  <th>Unidade</th>
                  <th className="text-right">Preço Unitário (R$)</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {project.serviceCatalog.map((s, i) => (
                  <tr key={s.id}>
                    <td>
                      <Input value={s.description} className="h-8"
                        onChange={e => updateService(i, 'description', e.target.value)} />
                    </td>
                    <td>
                      <Input value={s.detail} className="h-8"
                        onChange={e => updateService(i, 'detail', e.target.value)} />
                    </td>
                    <td>
                      <Input value={s.unit} className="h-8 w-20"
                        onChange={e => updateService(i, 'unit', e.target.value)} />
                    </td>
                    <td>
                      <Input type="number" step="0.01" value={s.unitPrice || ''} className="h-8 w-32 text-right"
                        onChange={e => updateService(i, 'unitPrice', parseFloat(e.target.value) || 0)} />
                    </td>
                    <td>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeService(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={addService}>
              <Plus className="h-4 w-4" /> Adicionar Serviço
            </Button>
          </div>
        </TabsContent>

        {/* Staff */}
        <TabsContent value="staff">
          <div className="bg-card rounded-lg p-6 border">
            <h2 className="section-title">Equipes Padrão</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Defina as equipes e funções padrão para os diários desta obra.
            </p>
            {project.defaultStaff.map((team, ti) => (
              <div key={ti} className="mb-4 p-4 border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Input value={team.team} className="h-8 font-semibold" placeholder="Nome da Equipe"
                    onChange={e => {
                      const arr = [...project.defaultStaff];
                      arr[ti] = { ...arr[ti], team: e.target.value };
                      update('defaultStaff', arr);
                    }} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive shrink-0"
                    onClick={() => update('defaultStaff', project.defaultStaff.filter((_, i) => i !== ti))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {team.roles.map((role, ri) => (
                  <div key={ri} className="flex items-center gap-2 ml-4 mb-1">
                    <Input value={role} className="h-7 text-sm" placeholder="Função"
                      onChange={e => {
                        const arr = [...project.defaultStaff];
                        const roles = [...arr[ti].roles];
                        roles[ri] = e.target.value;
                        arr[ti] = { ...arr[ti], roles };
                        update('defaultStaff', arr);
                      }} />
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive shrink-0"
                      onClick={() => {
                        const arr = [...project.defaultStaff];
                        arr[ti] = { ...arr[ti], roles: arr[ti].roles.filter((_, i) => i !== ri) };
                        update('defaultStaff', arr);
                      }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="ml-4 mt-1 text-xs gap-1"
                  onClick={() => {
                    const arr = [...project.defaultStaff];
                    arr[ti] = { ...arr[ti], roles: [...arr[ti].roles, ''] };
                    update('defaultStaff', arr);
                  }}>
                  <Plus className="h-3 w-3" /> Função
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={addStaffTeam}>
              <Plus className="h-4 w-4" /> Adicionar Equipe
            </Button>
          </div>
        </TabsContent>

        {/* Equipment */}
        <TabsContent value="equipment">
          <div className="bg-card rounded-lg p-6 border overflow-x-auto">
            <h2 className="section-title">Equipamentos Padrão</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-16">Qtd</th>
                  <th>Equipamento/Veículo</th>
                  <th>Prefixo/Identificação</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {project.defaultEquipment.map((eq, i) => (
                  <tr key={i}>
                    <td><Input type="number" min={0} value={eq.quantity || ''} className="h-8 w-16 text-center"
                      onChange={e => {
                        const arr = [...project.defaultEquipment];
                        arr[i] = { ...arr[i], quantity: parseInt(e.target.value) || 0 };
                        update('defaultEquipment', arr);
                      }} /></td>
                    <td><Input value={eq.equipment} className="h-8"
                      onChange={e => {
                        const arr = [...project.defaultEquipment];
                        arr[i] = { ...arr[i], equipment: e.target.value };
                        update('defaultEquipment', arr);
                      }} /></td>
                    <td><Input value={eq.identification} className="h-8"
                      onChange={e => {
                        const arr = [...project.defaultEquipment];
                        arr[i] = { ...arr[i], identification: e.target.value };
                        update('defaultEquipment', arr);
                      }} /></td>
                    <td><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                      onClick={() => update('defaultEquipment', project.defaultEquipment.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={addEquipment}>
              <Plus className="h-4 w-4" /> Adicionar Equipamento
            </Button>
          </div>
        </TabsContent>

        {/* Contractors */}
        <TabsContent value="contractors">
          <div className="bg-card rounded-lg p-6 border overflow-x-auto">
            <h2 className="section-title">Empreiteiros Padrão</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Contrato nº</th>
                  <th>Razão Social</th>
                  <th className="w-24">Nº Func.</th>
                  <th>Objeto do Contrato</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {project.defaultContractors.map((c, i) => (
                  <tr key={i}>
                    <td><Input value={c.contractNo} className="h-8"
                      onChange={e => {
                        const arr = [...project.defaultContractors];
                        arr[i] = { ...arr[i], contractNo: e.target.value };
                        update('defaultContractors', arr);
                      }} /></td>
                    <td><Input value={c.companyName} className="h-8"
                      onChange={e => {
                        const arr = [...project.defaultContractors];
                        arr[i] = { ...arr[i], companyName: e.target.value };
                        update('defaultContractors', arr);
                      }} /></td>
                    <td><Input type="number" min={0} value={c.employees || ''} className="h-8 w-20 text-center"
                      onChange={e => {
                        const arr = [...project.defaultContractors];
                        arr[i] = { ...arr[i], employees: parseInt(e.target.value) || 0 };
                        update('defaultContractors', arr);
                      }} /></td>
                    <td><Input value={c.contractObject} className="h-8"
                      onChange={e => {
                        const arr = [...project.defaultContractors];
                        arr[i] = { ...arr[i], contractObject: e.target.value };
                        update('defaultContractors', arr);
                      }} /></td>
                    <td><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"
                      onClick={() => update('defaultContractors', project.defaultContractors.filter((_, j) => j !== i))}>
                      <Trash2 className="h-4 w-4" /></Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="outline" size="sm" className="mt-3 gap-1.5"
              onClick={() => update('defaultContractors', [...project.defaultContractors, { contractNo: '', companyName: '', employees: 0, contractObject: '' }])}>
              <Plus className="h-4 w-4" /> Adicionar Empreiteiro
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectSettings;
