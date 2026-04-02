export interface ServiceCatalogItem {
  id: string;
  description: string;
  detail: string;
  unit: string;
  unitPrice: number;
}

export interface ServiceForecast {
  serviceId: string;
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
  serviceId: string;
  team: string;
  project: string;
  description: string;
  detail: string;
  unit: string;
  unitPrice: number;
  kmStart: string;
  kmEnd: string;
  executedDay: number;
  executedMonth: number;
  plannedMonth: number;
}

export interface PhotoEntry {
  id: string;
  dataUrl: string;
  highway: string;
  km: string;
}

export interface MonthlyPlanningEntry {
  id: string;
  projectId: string;
  month: number; // 0-11
  year: number;
  services: { serviceId: string; plannedMonth: number }[];
  observations: string;
}

export interface Project {
  id: string;
  name: string;
  contract: string;
  highway: string;
  office: string;
  contractStart: string;
  contractEnd: string;
  serviceCatalog: ServiceCatalogItem[];
  defaultStaff: { team: string; roles: string[] }[];
  defaultEquipment: Omit<EquipmentRow, 'operating' | 'stopped'>[];
  defaultContractors: ContractorRow[];
}

export interface DiaryEntry {
  id: string;
  projectId: string;
  number: number;
  date: string;
  weather: { clear: boolean; cloudyRain: boolean; cloudy: boolean; rainy: boolean };
  serviceForecast: ServiceForecast[];
  staffJpl: StaffRow[];
  contractors: ContractorRow[];
  equipmentJpl: EquipmentRow[];
  leasedEquipment: LeasedEquipmentRow[];
  executedServices: ExecutedServiceRow[];
  observations: string;
  photos: PhotoEntry[];
}

// Default project template
export const DEFAULT_SERVICE_CATALOG: ServiceCatalogItem[] = [
  { id: crypto.randomUUID(), description: 'Serviços Auxiliares', detail: 'CONCRETO CICLÓPICO FCK = 20 MPA', unit: 'm³', unitPrice: 0 },
  { id: crypto.randomUUID(), description: 'Serviços Auxiliares', detail: 'CONCRETO FCK = 20 MPA', unit: 'm³', unitPrice: 0 },
  { id: crypto.randomUUID(), description: 'Pavimentação', detail: 'TAPA BURACO COM PINTURA DE LIGAÇÃO', unit: 't', unitPrice: 958.33 },
  { id: crypto.randomUUID(), description: 'Pavimentação', detail: 'CORREÇÃO DE DEFEITOS POR FRESAGEM', unit: 'm³', unitPrice: 0 },
  { id: crypto.randomUUID(), description: 'Pavimentação', detail: 'MICRORREVESTIMENTO A FRIO', unit: 'm²', unitPrice: 0 },
  { id: crypto.randomUUID(), description: 'Conservação', detail: 'CONSERVAÇÃO ROTINEIRA', unit: 'mês', unitPrice: 97764.07 },
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

export function createDefaultProject(): Project {
  return {
    id: crypto.randomUUID(),
    name: 'JPL GOMES — BR-060/BR-262',
    contract: '511/2023',
    highway: 'BR-060/MS - KM 321,80 AO KM 355,70 / BR-262/MS - KM 343,70 AO KM 366,80',
    office: 'Campo Grande - MS',
    contractStart: '2023-10-01',
    contractEnd: '2026-09-30',
    serviceCatalog: DEFAULT_SERVICE_CATALOG.map(s => ({ ...s, id: crypto.randomUUID() })),
    defaultStaff: DEFAULT_STAFF.map(s => ({ ...s })),
    defaultEquipment: DEFAULT_EQUIPMENT.map(e => ({ ...e })),
    defaultContractors: DEFAULT_CONTRACTORS.map(c => ({ ...c })),
  };
}

export function createNewDiary(project: Project, diaries: DiaryEntry[]): DiaryEntry {
  const projectDiaries = diaries.filter(d => d.projectId === project.id);
  const nextNumber = projectDiaries.length > 0 ? Math.max(...projectDiaries.map(d => d.number)) + 1 : 1;
  const today = new Date().toISOString().split('T')[0];

  return {
    id: crypto.randomUUID(),
    projectId: project.id,
    number: nextNumber,
    date: today,
    weather: { clear: false, cloudyRain: false, cloudy: false, rainy: false },
    serviceForecast: project.serviceCatalog.map(s => ({
      serviceId: s.id,
      description: s.description,
      detail: s.detail,
      jplOperating: false,
      jplStopped: false,
      thirdOperating: false,
      thirdStopped: false,
    })),
    staffJpl: project.defaultStaff.flatMap(t =>
      t.roles.map(r => ({ team: t.team, role: r, quantity: 0, observations: '' }))
    ),
    contractors: [...project.defaultContractors],
    equipmentJpl: project.defaultEquipment.map(e => ({ ...e, operating: false, stopped: false })),
    leasedEquipment: [],
    executedServices: project.serviceCatalog.map(s => ({
      serviceId: s.id,
      team: 'JPL GOMES',
      project: project.contract,
      description: s.description,
      detail: s.detail,
      unit: s.unit,
      unitPrice: s.unitPrice,
      kmStart: '',
      kmEnd: '',
      executedDay: 0,
      executedMonth: 0,
      plannedMonth: 0,
    })),
    observations: '',
    photos: [],
  };
}

/**
 * Get the service execution date (D-1) for a diary date.
 */
export function getServiceDateFromDiary(diaryDate: string): string {
  const d = new Date(diaryDate + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/**
 * Get the month/year of the service execution (D-1), not the diary date.
 * The diary of day 1 still belongs to the previous month's accumulation.
 */
export function getServiceMonthYear(diaryDate: string): { month: number; year: number } {
  const serviceDate = getServiceDateFromDiary(diaryDate);
  const d = new Date(serviceDate + 'T12:00:00');
  return { month: d.getMonth(), year: d.getFullYear() };
}

export function getMonthlyAccumulated(
  diaries: DiaryEntry[],
  currentDiary: DiaryEntry,
  serviceIndex: number
): number {
  const currentServiceDate = getServiceDateFromDiary(currentDiary.date);
  const currentSD = new Date(currentServiceDate + 'T12:00:00');
  const month = currentSD.getMonth();
  const year = currentSD.getFullYear();

  return diaries
    .filter(d => {
      if (d.id === currentDiary.id) return false;
      if (d.projectId !== currentDiary.projectId) return false;
      const sd = new Date(getServiceDateFromDiary(d.date) + 'T12:00:00');
      return sd.getMonth() === month && sd.getFullYear() === year && sd <= currentSD;
    })
    .reduce((sum, d) => {
      const service = d.executedServices[serviceIndex];
      return sum + (service ? service.executedDay : 0);
    }, 0) + (currentDiary.executedServices[serviceIndex]?.executedDay || 0);
}
