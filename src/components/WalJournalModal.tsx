import React from 'react';
import { Database, X, Download, Check, Clock } from 'lucide-react';
import { storageService } from '../services/storage';

interface WalJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalJournalModal: React.FC<WalJournalModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const logs = storageService.getWalJournal();
  const metrics = storageService.getSyncMetrics();

  const handleDownloadBackup = () => {
    const jsonStr = storageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitale-backup-wal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-yellow-950/20 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-white">
                Engine SQLite WAL Vitale
              </h2>
              <p className="text-xs text-zinc-400">
                Arquitetura Offline-First 100% autônoma com marcações de sincronização para Nuvem / Supabase
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync & WAL Overview cards */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 font-medium block">Total de Entidades</span>
              <span className="text-xl font-heading font-bold text-white mt-1 block">
                {metrics.totalRecords}
              </span>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 font-medium block">Transações no WAL</span>
              <span className="text-xl font-heading font-bold text-yellow-400 mt-1 block">
                {logs.length}
              </span>
            </div>

            <div className="bg-zinc-900/80 p-3.5 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 font-medium block">Preparado p/ Supabase</span>
              <span className="text-xl font-heading font-bold text-emerald-400 mt-1 block flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3]" /> Pronto
              </span>
            </div>
          </div>

          {/* Download JSON Backup */}
          <div className="bg-black p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">
                Backup Completo dos Prontuários Vitale (JSON)
              </span>
              <span className="text-[11px] text-zinc-400">
                Exporte todo o histórico clínico local para salvaguarda de segurança da informação.
              </span>
            </div>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo JSON</span>
            </button>
          </div>

          {/* WAL Transactions Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>Histórico de Transações do Journal WAL</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-black p-2.5 rounded-xl border border-zinc-850 text-[11px] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.action === 'INSERT'
                          ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                          : log.action === 'UPDATE'
                          ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="text-zinc-300 font-medium">
                      {log.dataSummary}
                    </span>
                  </div>

                  <span className="text-zinc-500 font-mono text-[10px] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
