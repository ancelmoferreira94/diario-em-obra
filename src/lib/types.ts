export interface ServiceForecast {
  description: string;
  detail: string;
  jplOperating: boolean;
  jplStopped: boolean;
  thirdOperating: boolean;
  thirdStopped: boolean;
}

export interface StaffRow {
  team: string;
  role: string;
  quantity: number;
  observations: string;
}

export interface ContractorRow {
  contractNo: string;
  companyName: string;
  employees: number;
  contractObject: string;
}

export interface EquipmentRow {
  quantity: number;
  equipment: string;
  identification: string;
  operating: boolean;
  stopped: boolean;
}

export interface LeasedEquipmentRow {
  contractNo: string;
  equipment: string;
  identification: string;
  quantity: number;
  ownership: string;
  operating: boolean;
  stopped: boolean;
}

export interface ExecutedServiceRow {
  team: string;
  project: string;
  description: string;
  detail: string;
  unit: string;
  kmStart: string;
  kmEnd: string;
  executedDay: number;
  executedMonth: number;
  plannedMonth: number;
  unitPrice: number;
}

export interface PhotoEntry {
  id: string;
  dataUrl: string;
  highway: string;
  km: string;
}

export interface DiaryEntry {
  id: string;
  number: number;
  date: string;
  contract: string;
  highway: string;
  contractStart: string;
  contractEnd: string;
  serviceForecast: ServiceForecast[];
  staffJpl: StaffRow[];
  contractors: ContractorRow[];
  equipmentJpl: EquipmentRow[];
  leasedEquipment: LeasedEquipmentRow[];
  executedServices: ExecutedServiceRow[];
  observations: string;
  photos: PhotoEntry[];
}

export const DEFAULT_SERVICES: Omit<ServiceForecast, 'jplOperating' | 'jplStopped' | 'thirdOperating' | 'thirdStopped'>[] = [
  { description: 'Serviços Auxiliares', detail: 'CONCRETO CICLÓPICO FCK = 20 MPA' },
  { description: 'Serviços Auxiliares', detail: 'CONCRETO FCK = 20 MPA' },
  { description: 'Pavimentação', detail: 'TAPA BURACO COM PINTURA DE LIGAÇÃO' },
  { description: 'Pavimentação', detail: 'CORREÇÃO DE DEFEITOS POR FRESAGEM' },
  { description: 'Pavimentação', detail: 'MICRORREVESTIMENTO A FRIO' },
  { description: 'Conservação', detail: 'CONSERVAÇÃO ROTINEIRA' },
];

export const DEFAULT_STAFF: { team: string; roles: string[] }[] = [
  { team: 'Administrativa', roles: ['Gerente de Contrato', 'Equipe Técnica', 'Equipe Administrativa', 'Equipe de Segurança'] },
  { team: 'Conservação', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais'] },
  { team: 'Roçada', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais'] },
  { team: 'Pavimentação', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais', 'Sinalização', 'Profissionais Terceiros'] },
  { team: 'Britagem', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais'] },
  { team: 'Segurança do Trabalho', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais'] },
  { team: 'Micro Revestimento', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais'] },
  { team: 'Limpeza', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais'] },
  { team: 'Usina', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais'] },
  { team: 'Laboratório', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais'] },
  { team: 'Sinalização', roles: ['Encarregados/Supervisores', 'Profissionais Técnicos', 'Operacionais'] },
];

export const DEFAULT_EQUIPMENT: Omit<EquipmentRow, 'operating' | 'stopped'>[] = [
  { quantity: 1, equipment: 'CAMINHÃO CARROCERIA', identification: 'CC-1008' },
  { quantity: 1, equipment: 'REBOQUE', identification: 'RQ-1011' },
  { quantity: 1, equipment: 'VEÍCULO LEVE', identification: 'VL-1030' },
];

export const DEFAULT_CONTRACTORS: ContractorRow[] = [
  { contractNo: '040/ACG', companyName: 'Viaplan', employees: 5, contractObject: 'Conserva Rotineira' },
];

export const DEFAULT_EXECUTED_SERVICES: Omit<ExecutedServiceRow, 'kmStart' | 'kmEnd' | 'executedDay' | 'executedMonth' | 'plannedMonth'>[] = [
  { team: 'JPL GOMES', project: '511/2023', description: 'Serviços Auxiliares', detail: 'CONCRETO CICLÓPICO FCK = 20 MPA', unit: 'm³', unitPrice: 0 },
  { team: 'JPL GOMES', project: '511/2023', description: 'Serviços Auxiliares', detail: 'CONCRETO FCK = 20 MPA', unit: 'm³', unitPrice: 0 },
  { team: 'JPL GOMES', project: '511/2023', description: 'Pavimentação', detail: 'TAPA BURACO COM PINTURA DE LIGAÇÃO', unit: 't', unitPrice: 958.33 },
  { team: 'JPL GOMES', project: '511/2023', description: 'Pavimentação', detail: 'CORREÇÃO DE DEFEITOS POR FRESAGEM', unit: 'm³', unitPrice: 0 },
  { team: 'JPL GOMES', project: '511/2023', description: 'Pavimentação', detail: 'MICRORREVESTIMENTO A FRIO', unit: 'm²', unitPrice: 0 },
  { team: 'JPL GOMES', project: '511/2023', description: 'Conservação', detail: 'CONSERVAÇÃO ROTINEIRA', unit: 'mês', unitPrice: 97764.07 },
];

export function createNewDiary(diaries: DiaryEntry[]): DiaryEntry {
  const nextNumber = diaries.length > 0 ? Math.max(...diaries.map(d => d.number)) + 1 : 1;
  const today = new Date().toISOString().split('T')[0];

  return {
    id: crypto.randomUUID(),
    number: nextNumber,
    date: today,
    contract: '511/2023',
    highway: 'BR-060/MS - BR-262/MS',
    contractStart: '2023-10-01',
    contractEnd: '2026-09-30',
    serviceForecast: DEFAULT_SERVICES.map(s => ({
      ...s, jplOperating: false, jplStopped: false, thirdOperating: false, thirdStopped: false,
    })),
    staffJpl: DEFAULT_STAFF.flatMap(t =>
      t.roles.map(r => ({ team: t.team, role: r, quantity: 0, observations: '' }))
    ),
    contractors: [...DEFAULT_CONTRACTORS],
    equipmentJpl: DEFAULT_EQUIPMENT.map(e => ({ ...e, operating: false, stopped: false })),
    leasedEquipment: [],
    executedServices: DEFAULT_EXECUTED_SERVICES.map(s => ({
      ...s, kmStart: '', kmEnd: '', executedDay: 0, executedMonth: 0, plannedMonth: 0,
    })),
    observations: '',
    photos: [],
  };
}

export function getMonthlyAccumulated(
  diaries: DiaryEntry[],
  currentDiary: DiaryEntry,
  serviceIndex: number
): number {
  const currentDate = new Date(currentDiary.date);
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  return diaries
    .filter(d => {
      if (d.id === currentDiary.id) return false;
      const dd = new Date(d.date);
      return dd.getMonth() === month && dd.getFullYear() === year && dd <= currentDate;
    })
    .reduce((sum, d) => {
      const service = d.executedServices[serviceIndex];
      return sum + (service ? service.executedDay : 0);
    }, 0) + (currentDiary.executedServices[serviceIndex]?.executedDay || 0);
}
