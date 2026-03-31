import { DiaryEntry, Project } from '@/lib/types';
import logoJpl from '@/assets/logo-jpl.jpg';
import logoPez from '@/assets/logo-pez.jpg';

interface PrintProps {
  diary: DiaryEntry;
  project: Project;
  financialData: { group: string; dayValue: number; monthValue: number; plannedValue: number }[];
  financialTotal: { dayValue: number; monthValue: number; plannedValue: number };
}

function formatDateBR(dateStr: string) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function fmt(value: number, decimals = 3): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtCur(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const WEEKDAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

const DiaryPrintLayout = ({ diary, project, financialData, financialTotal }: PrintProps) => {
  const dateObj = new Date(diary.date + 'T12:00:00');
  const weekday = WEEKDAYS[dateObj.getDay()];
  const totalStaff = diary.staffJpl.reduce((s, r) => s + r.quantity, 0);
  const totalContractorStaff = diary.contractors.reduce((s, c) => s + c.employees, 0);
  const totalEquipment = diary.equipmentJpl.reduce((s, e) => s + e.quantity, 0);
  const totalLeasedEquipment = diary.leasedEquipment.reduce((s, e) => s + e.quantity, 0);

  // Group staff by team
  const teams: { team: string; members: typeof diary.staffJpl }[] = [];
  diary.staffJpl.forEach(s => {
    const existing = teams.find(t => t.team === s.team);
    if (existing) existing.members.push(s);
    else teams.push({ team: s.team, members: [s] });
  });

  return (
    <div className="print-layout">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print-layout { display: block !important; }
        }
        .print-layout {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 8pt;
          color: #000;
          background: #fff;
          max-width: 210mm;
          margin: 0 auto;
          padding: 5mm;
        }
        .print-layout table {
          width: 100%;
          border-collapse: collapse;
        }
        .print-layout th, .print-layout td {
          border: 1px solid #333;
          padding: 2px 4px;
          text-align: left;
          vertical-align: middle;
        }
        .print-layout th {
          background: #1a237e;
          color: #fff;
          font-weight: bold;
          text-align: center;
          font-size: 8pt;
        }
        .section-header {
          background: #283593;
          color: #fff;
          text-align: center;
          font-weight: bold;
          font-size: 9pt;
          padding: 4px;
        }
        .team-header {
          background: #e8eaf6;
          font-weight: bold;
        }
        .total-row {
          background: #e8eaf6;
          font-weight: bold;
        }
        .logo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }
        .logo-header img {
          height: 50px;
        }
        .header-table td {
          border: 1px solid #333;
          padding: 3px 6px;
          font-size: 8pt;
        }
        .header-title {
          background: #1a237e;
          color: #fff;
          text-align: center;
          font-size: 14pt;
          font-weight: bold;
          padding: 8px;
        }
        .weather-box {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-right: 12px;
        }
        .weather-check {
          width: 10px;
          height: 10px;
          border: 1px solid #333;
          display: inline-block;
        }
        .weather-check.checked {
          background: #333;
        }
        .financial-section td, .financial-section th {
          text-align: center;
        }
        .text-right { text-align: right !important; }
        .text-center { text-align: center !important; }
        .text-left { text-align: left !important; }
        .page-break { page-break-before: always; }
      `}</style>

      {/* Page 1 */}
      {/* Header with logos */}
      <div className="logo-header">
        <img src={logoJpl} alt="JPL Gomes" />
        <img src={logoPez} alt="Grupo PEZ" />
      </div>

      {/* Contract info header */}
      <table style={{ marginBottom: 4 }}>
        <tbody>
          <tr>
            <td style={{ width: '15%' }}><strong>Contrato(s):</strong></td>
            <td style={{ width: '35%' }}>{project.contract}</td>
            <td rowSpan={4} className="header-title" style={{ width: '50%' }}>DIÁRIO DE OBRA</td>
          </tr>
          <tr>
            <td><strong>Início:</strong></td>
            <td>{formatDateBR(project.contractStart)} &nbsp;&nbsp; <strong>Término:</strong> {formatDateBR(project.contractEnd)}</td>
          </tr>
          <tr>
            <td><strong>Rodovia(s):</strong></td>
            <td style={{ fontSize: '7pt' }}>{project.highway}</td>
          </tr>
          <tr>
            <td><strong>Escritório(s):</strong></td>
            <td>{project.office}</td>
          </tr>
        </tbody>
      </table>

      {/* Date and weather row */}
      <table style={{ marginBottom: 4 }}>
        <tbody>
          <tr>
            <td style={{ width: '20%', textAlign: 'center', fontWeight: 'bold', fontSize: '10pt' }}>
              {formatDateBR(diary.date)}
            </td>
            <td style={{ width: '15%', textAlign: 'center' }}>{weekday}</td>
            <td>
              <span className="weather-box"><span className={`weather-check ${diary.weather.clear ? 'checked' : ''}`}></span> Céu Claro</span>
              <span className="weather-box"><span className={`weather-check ${diary.weather.cloudyRain ? 'checked' : ''}`}></span> Nublado - panc. chuvas</span>
              <span className="weather-box"><span className={`weather-check ${diary.weather.cloudy ? 'checked' : ''}`}></span> Nublado</span>
              <span className="weather-box"><span className={`weather-check ${diary.weather.rainy ? 'checked' : ''}`}></span> Chuvoso</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Service Forecast */}
      <table style={{ marginBottom: 4 }}>
        <thead>
          <tr>
            <th colSpan={4} className="section-header">PREVISÃO DE SERVIÇOS</th>
            <th colSpan={2} style={{ fontSize: '7pt' }}>{formatDateBR(diary.date)}</th>
          </tr>
          <tr>
            <th colSpan={2}>Serviços</th>
            <th colSpan={2}>JPL GOMES</th>
            <th colSpan={2}>TERCEIRO</th>
          </tr>
          <tr>
            <th>Descrição</th>
            <th>Detalhamento da atividade</th>
            <th>Operando</th>
            <th>Parado</th>
            <th>Operando</th>
            <th>Parado</th>
          </tr>
        </thead>
        <tbody>
          {diary.serviceForecast.map((s, i) => (
            <tr key={i}>
              <td>{s.description}</td>
              <td>{s.detail}</td>
              <td className="text-center">{s.jplOperating ? 'X' : ''}</td>
              <td className="text-center">{s.jplStopped ? 'X' : ''}</td>
              <td className="text-center">{s.thirdOperating ? 'X' : ''}</td>
              <td className="text-center">{s.thirdStopped ? 'X' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Staff */}
      <table style={{ marginBottom: 4 }}>
        <thead>
          <tr><th colSpan={3} className="section-header">QUADRO DE PESSOAL - JPL GOMES</th></tr>
          <tr>
            <th>Função</th>
            <th style={{ width: '15%' }}>Quantidade</th>
            <th style={{ width: '30%' }}>Observações</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, ti) => {
            const teamTotal = team.members.reduce((s, m) => s + m.quantity, 0);
            return [
              <tr key={`team-${ti}`} className="team-header">
                <td><strong>Equipe: {team.team}</strong></td>
                <td className="text-center"><strong>{teamTotal}</strong></td>
                <td></td>
              </tr>,
              ...team.members.filter(m => m.quantity > 0).map((m, mi) => (
                <tr key={`member-${ti}-${mi}`}>
                  <td style={{ paddingLeft: 16 }}>{m.role}</td>
                  <td className="text-center">{m.quantity}</td>
                  <td>{m.observations}</td>
                </tr>
              )),
            ];
          })}
          <tr className="total-row">
            <td><strong>TOTAL QUADRO CONCRETA</strong></td>
            <td className="text-center"><strong>{totalStaff}</strong></td>
            <td className="text-center">0</td>
          </tr>
        </tbody>
      </table>

      {/* Contractors */}
      <table style={{ marginBottom: 4 }}>
        <thead>
          <tr><th colSpan={4} className="section-header">QUADRO DE EMPREITEIROS</th></tr>
          <tr>
            <th>Contrato nº</th>
            <th>Razão Social</th>
            <th>Nº Funcionários</th>
            <th>Objeto do Contrato</th>
          </tr>
        </thead>
        <tbody>
          {diary.contractors.map((c, i) => (
            <tr key={i}>
              <td>{c.contractNo}</td>
              <td>{c.companyName}</td>
              <td className="text-center">{c.employees}</td>
              <td>{c.contractObject}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan={2}><strong>TOTAL QUADRO DE EMPREITEIROS</strong></td>
            <td className="text-center"><strong>{totalContractorStaff}</strong></td>
            <td></td>
          </tr>
          <tr className="total-row">
            <td colSpan={2}><strong>TOTAL QUADRO CONCRETA + TOTAL QUADRO DE EMPREITEIROS</strong></td>
            <td className="text-center"><strong>{totalStaff + totalContractorStaff}</strong></td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {/* Equipment JPL */}
      <table style={{ marginBottom: 4 }}>
        <thead>
          <tr><th colSpan={5} className="section-header">ACOMPANHAMENTO DE EQUIPAMENTOS - TBL</th></tr>
          <tr>
            <th>Quantidade</th>
            <th>Equipamento / Veículo</th>
            <th>Prefixos / Identificação</th>
            <th>Operando</th>
            <th>Parado</th>
          </tr>
        </thead>
        <tbody>
          {diary.equipmentJpl.map((eq, i) => (
            <tr key={i}>
              <td className="text-center">{eq.quantity}</td>
              <td>{eq.equipment}</td>
              <td>{eq.identification}</td>
              <td className="text-center">{eq.operating ? 'X' : ''}</td>
              <td className="text-center">{eq.stopped ? 'X' : ''}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td className="text-center"><strong>{totalEquipment}</strong></td>
            <td colSpan={2}><strong>TOTAL QUADRO DE EQUIPAMENTOS CONCRETA</strong></td>
            <td colSpan={2}></td>
          </tr>
        </tbody>
      </table>

      {/* Leased Equipment */}
      <table style={{ marginBottom: 4 }}>
        <thead>
          <tr><th colSpan={7} className="section-header">ACOMPANHAMENTO DE EQUIPAMENTOS - LOCADOS</th></tr>
          <tr>
            <th>Contrato nº</th>
            <th>Equipamento / Veículo</th>
            <th>Identificação</th>
            <th>Quant.</th>
            <th>Propriedade</th>
            <th>Operando</th>
            <th>Parado</th>
          </tr>
        </thead>
        <tbody>
          {diary.leasedEquipment.length === 0 ? (
            <tr><td colSpan={7} className="text-center" style={{ height: 16 }}></td></tr>
          ) : diary.leasedEquipment.map((eq, i) => (
            <tr key={i}>
              <td>{eq.contractNo}</td>
              <td>{eq.equipment}</td>
              <td>{eq.identification}</td>
              <td className="text-center">{eq.quantity}</td>
              <td>{eq.ownership}</td>
              <td className="text-center">{eq.operating ? 'X' : ''}</td>
              <td className="text-center">{eq.stopped ? 'X' : ''}</td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan={3}><strong>TOTAL QUADRO DE EQUIPAMENTOS LOCADOS</strong></td>
            <td className="text-center"><strong>{totalLeasedEquipment}</strong></td>
            <td colSpan={3}></td>
          </tr>
          <tr className="total-row">
            <td colSpan={3}><strong>TOTAL EQUIPAMENTOS CONCRETA + EQUIPAMENTOS LOCADOS</strong></td>
            <td className="text-center"><strong>{totalEquipment + totalLeasedEquipment}</strong></td>
            <td colSpan={3}></td>
          </tr>
        </tbody>
      </table>

      {/* Executed Services */}
      <table style={{ marginBottom: 4 }}>
        <thead>
          <tr>
            <th colSpan={7} className="section-header">SERVIÇOS EXECUTADOS</th>
            <th colSpan={3} style={{ fontSize: '7pt' }}>{formatDateBR(diary.date)}</th>
          </tr>
          <tr>
            <th rowSpan={2}>Equipe<br/>Execução</th>
            <th rowSpan={2}>Projeto</th>
            <th colSpan={2}>Serviço</th>
            <th rowSpan={2}>UN</th>
            <th rowSpan={2}>Km<br/>Inicial</th>
            <th rowSpan={2}>Km<br/>Final</th>
            <th>Executado</th>
            <th>Executado</th>
            <th>Previsto</th>
          </tr>
          <tr>
            <th>Descrição</th>
            <th>Detalhamento</th>
            <th>Dia</th>
            <th>Mês</th>
            <th>Mês</th>
          </tr>
        </thead>
        <tbody>
          {diary.executedServices.map((s, i) => (
            <tr key={i}>
              <td style={{ fontSize: '7pt', fontWeight: 'bold' }}>{s.team}</td>
              <td style={{ fontSize: '7pt' }}>{s.project}</td>
              <td style={{ fontSize: '7pt' }}>{s.description}</td>
              <td style={{ fontSize: '7pt' }}>{s.detail}</td>
              <td className="text-center" style={{ fontSize: '7pt' }}>{s.unit}</td>
              <td className="text-center" style={{ fontSize: '7pt' }}>{s.kmStart}</td>
              <td className="text-center" style={{ fontSize: '7pt' }}>{s.kmEnd}</td>
              <td className="text-center" style={{ fontSize: '7pt' }}>{fmt(s.executedDay)}</td>
              <td className="text-center" style={{ fontSize: '7pt' }}>{fmt(s.executedMonth)}</td>
              <td className="text-center" style={{ fontSize: '7pt' }}>{s.plannedMonth ? fmt(s.plannedMonth) : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Financial Control */}
      <table style={{ marginBottom: 4 }} className="financial-section">
        <thead>
          <tr>
            <th colSpan={4} className="section-header">CONTROLE FINANCEIRO</th>
            <th colSpan={2} style={{ fontSize: '7pt' }}>{formatDateBR(diary.date)}</th>
          </tr>
          <tr>
            <th rowSpan={2}>Grupo de Produção</th>
            <th>Dia</th>
            <th>Acumulado Mensal</th>
            <th>Planejado Mensal</th>
            <th rowSpan={2} colSpan={2}>Gráfico Financeiro</th>
          </tr>
          <tr>
            <th>(R$)</th>
            <th>(R$)</th>
            <th>(R$)</th>
          </tr>
        </thead>
        <tbody>
          {financialData.map(f => {
            const pct = f.plannedValue > 0 ? Math.round((f.monthValue / f.plannedValue) * 100) : 0;
            return (
              <tr key={f.group}>
                <td className="text-left">{f.group}</td>
                <td>{fmtCur(f.dayValue)}</td>
                <td>{fmtCur(f.monthValue)}</td>
                <td>{fmtCur(f.plannedValue)}</td>
                <td colSpan={2}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ flex: 1, height: 10, background: '#e0e0e0', borderRadius: 2 }}>
                      <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: '#1a237e', borderRadius: 2 }}></div>
                    </div>
                    <span style={{ fontSize: '7pt' }}>{pct}%</span>
                  </div>
                </td>
              </tr>
            );
          })}
          <tr className="total-row">
            <td className="text-left"><strong>TOTAL</strong></td>
            <td><strong>{fmtCur(financialTotal.dayValue)}</strong></td>
            <td><strong>{fmtCur(financialTotal.monthValue)}</strong></td>
            <td><strong>{fmtCur(financialTotal.plannedValue)}</strong></td>
            <td colSpan={2}>
              {(() => {
                const pct = financialTotal.plannedValue > 0 ? Math.round((financialTotal.monthValue / financialTotal.plannedValue) * 100) : 0;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ flex: 1, height: 10, background: '#e0e0e0', borderRadius: 2 }}>
                      <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: '#1a237e', borderRadius: 2 }}></div>
                    </div>
                    <span style={{ fontSize: '7pt' }}>{pct}%</span>
                  </div>
                );
              })()}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Page 2 - Observations and Photos */}
      <div className="page-break"></div>

      {/* Observations */}
      <table style={{ marginBottom: 8 }}>
        <thead>
          <tr><th className="section-header">OBSERVAÇÕES</th></tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ minHeight: 120, whiteSpace: 'pre-wrap', padding: 8, verticalAlign: 'top' }}>
              {diary.observations || '\u00A0'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Photos */}
      {diary.photos.length > 0 && (
        <div>
          <p style={{ fontWeight: 'bold', marginBottom: 4, fontSize: '9pt' }}>Fotos:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {diary.photos.map((photo, i) => (
              <div key={photo.id} style={{ border: '1px solid #333', padding: 2, background: '#e8eaf6' }}>
                <img src={photo.dataUrl} alt={`Foto ${i + 1}`} style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                <div style={{ fontSize: '7pt', padding: '2px 4px' }}>
                  <div><strong>Rodovia:</strong> {photo.highway}</div>
                  <div><strong>Km:</strong> {photo.km}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiaryPrintLayout;
