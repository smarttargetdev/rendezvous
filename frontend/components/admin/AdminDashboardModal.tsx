import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  FileText, 
  Database, 
  Download, 
  AlertTriangle, 
  Check, 
  Ban, 
  Search, 
  RefreshCw, 
  Clock,
  HardDriveDownload,
  Building2
} from 'lucide-react';
import { AuditLog, ReportedUserTicket } from '../../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditLogs: AuditLog[];
  reports: ReportedUserTicket[];
  onModerateUser: (ticketId: string, action: 'ban' | 'dismiss') => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  auditLogs,
  reports,
  onModerateUser
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'moderation' | 'audit' | 'backup'>('metrics');
  const [searchLog, setSearchLog] = useState('');
  const [backupRunning, setBackupRunning] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchLog.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchLog.toLowerCase()) ||
      l.details.toLowerCase().includes(searchLog.toLowerCase())
  );

  const handleRunBackup = () => {
    setBackupRunning(true);
    setTimeout(() => {
      setBackupRunning(false);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 3000);
    }, 1500);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Data/Hora', 'Ator', 'IP', 'Acao', 'Categoria', 'Detalhes', 'Status'];
    const rows = auditLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.ipAddress}"`,
      `"${l.action}"`,
      `"${l.category}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rendezvous_relatorio_auditoria_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[92vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Admin Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Painel Administrativo & Compliance LGPD</h3>
                <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-400 text-[10px] font-bold">
                  Sessão Root Segura
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Moderação em tempo real, auditoria e métricas</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Exportar para Excel (CSV)"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Exportar Excel</span>
            </button>

            <button
              onClick={handleExportPDF}
              className="px-2.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Imprimir ou Salvar PDF"
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Relatório PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Subnav Tabs */}
        <div className="flex p-2 bg-neutral-950/70 border-b border-neutral-800 text-xs gap-1 shrink-0 overflow-x-auto no-scrollbar">
          {[
            { id: 'metrics', label: '📊 Métricas em Tempo Real' },
            { id: 'moderation', label: `🛡️ Fila de Moderação (${reports.length})` },
            { id: 'audit', label: '📜 Logs de Auditoria & LGPD' },
            { id: 'backup', label: '☁️ Backup na Nuvem' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {/* 1. METRICS TAB */}
          {activeTab === 'metrics' && (
            <div className="space-y-5">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="text-neutral-400 text-[11px] font-medium">Usuários Ativos (Radar)</div>
                  <div className="text-xl font-bold text-white font-mono">4.892</div>
                  <div className="text-[10px] text-emerald-400 font-medium">+14% nesta semana</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="text-neutral-400 text-[11px] font-medium">GMV Total Mensal</div>
                  <div className="text-xl font-bold text-white font-mono">R$ 489.200</div>
                  <div className="text-[10px] text-emerald-400 font-medium">Acompanhantes + Motéis</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="text-neutral-400 text-[11px] font-medium">Custódia Escrow Ativa</div>
                  <div className="text-xl font-bold text-amber-400 font-mono">R$ 84.500</div>
                  <div className="text-[10px] text-neutral-400">Proteção de encontros</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <div className="text-neutral-400 text-[11px] font-medium">Comissão Guia de Motéis</div>
                  <div className="text-xl font-bold text-rose-400 font-mono">R$ 58.700</div>
                  <div className="text-[10px] text-emerald-400 font-medium">321 suítes reservadas</div>
                </div>
              </div>

              {/* Monthly Activity Analytics Chart / Breakdown */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs">Desempenho por Categoria de Operação</h4>
                  <span className="text-[10px] text-neutral-400">Outubro 2026</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-300 mb-1">
                      <span>Reservas Guia de Motéis (Parceiros Oficiais)</span>
                      <span className="font-mono font-bold text-rose-400">62% (R$ 303.304)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-300 mb-1">
                      <span>Honorários e Cachês de Acompanhantes VIP</span>
                      <span className="font-mono font-bold text-amber-400">31% (R$ 151.652)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '31%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-neutral-300 mb-1">
                      <span>Assinaturas Rendezvous Club Obsidian</span>
                      <span className="font-mono font-bold text-cyan-400">7% (R$ 34.244)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: '7%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MODERATION QUEUE */}
          {activeTab === 'moderation' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs">Denúncias & Moderação de Imagens em Tempo Real</h4>
                <span className="text-[11px] text-neutral-400">{reports.length} ocorrências pendentes</span>
              </div>

              {reports.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 bg-neutral-950 rounded-2xl border border-neutral-800">
                  <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p>Fila de moderação limpa! Nenhum usuário reportado no momento.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {reports.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={ticket.reportedUserAvatar}
                          alt={ticket.reportedUserName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{ticket.reportedUserName}</span>
                            <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                              {ticket.reason.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-neutral-500">{ticket.createdAt}</span>
                          </div>
                          <p className="text-[11px] text-neutral-300 leading-snug">
                            "{ticket.comment}"
                          </p>
                          <div className="text-[10px] text-neutral-500">
                            ID do Infrator: {ticket.reportedUserId} · Denunciante: {ticket.reporterId}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => onModerateUser(ticket.id, 'dismiss')}
                          className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs transition-colors"
                        >
                          Descartar
                        </button>
                        <button
                          onClick={() => onModerateUser(ticket.id, 'ban')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-xs"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Banir Imediatamente</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. AUDIT LOGS & LGPD */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchLog}
                    onChange={(e) => setSearchLog(e.target.value)}
                    placeholder="Filtrar por ator, IP ou ação..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div className="text-[11px] text-neutral-400">
                  {filteredLogs.length} registros imutáveis gravados
                </div>
              </div>

              {/* Logs Table */}
              <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 text-[10px] text-neutral-400 font-bold uppercase tracking-wider bg-neutral-900/60">
                        <th className="p-3">Data/Hora</th>
                        <th className="p-3">Ator</th>
                        <th className="p-3">IP / Origem</th>
                        <th className="p-3">Ação</th>
                        <th className="p-3">Detalhes</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900 text-[11px]">
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="p-3 font-mono text-neutral-400 whitespace-nowrap">{log.timestamp}</td>
                          <td className="p-3 font-bold text-white whitespace-nowrap">{log.actor}</td>
                          <td className="p-3 font-mono text-neutral-400 whitespace-nowrap">{log.ipAddress}</td>
                          <td className="p-3 font-mono text-rose-400 font-semibold">{log.action}</td>
                          <td className="p-3 text-neutral-300 max-w-xs truncate">{log.details}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. CLOUD BACKUP */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Database className="w-4 h-4" />
                  <span>Sistema de Backup Automático na Nuvem</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Backups incrementais são executados a cada 1 hora e armazenados em múltiplos data centers geograficamente redundantes (AWS S3 + Cloud Storage) com criptografia AES-256 no repouso.
                </p>

                <div className="pt-2 border-t border-neutral-800/80 grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-neutral-500">Último Backup Automático:</span>
                    <div className="font-mono text-white font-semibold">Hoje às 17:00:00 UTC-3</div>
                  </div>
                  <div>
                    <span className="text-neutral-500">Tamanho do Snapshot:</span>
                    <div className="font-mono text-white font-semibold">4.8 GB (PostgreSQL + S3)</div>
                  </div>
                </div>
              </div>

              {backupSuccess ? (
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="font-bold text-xs text-white">Snapshot Manual Concluído com Sucesso!</div>
                    <div className="text-[11px]">Hash SHA-256 gerado e replicado com sucesso no bucket frio.</div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRunBackup}
                  disabled={backupRunning}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {backupRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Gerando Snapshot & Replicando na Nuvem...</span>
                    </>
                  ) : (
                    <>
                      <HardDriveDownload className="w-4 h-4" />
                      <span>Executar Backup Manual Agora</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
