import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Calendar, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Filter,
  Layers,
  Printer
} from 'lucide-react';
import { Patient, Prontuario } from '../types';

interface ProntuariosTabProps {
  patients: Patient[];
  prontuarios: Prontuario[];
  onViewProntuario: (prontuario: Prontuario) => void;
  onStartProntuario: (patient: Patient) => void;
  onOpenNewProntuarioSelector: () => void;
}

export const ProntuariosTab: React.FC<ProntuariosTabProps> = ({
  patients,
  prontuarios,
  onViewProntuario,
  onStartProntuario,
  onOpenNewProntuarioSelector,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('todos');

  const getPatient = (patientId: string): Patient | undefined => {
    return patients.find((p) => p.id === patientId);
  };

  const filteredProntuarios = prontuarios.filter((pr) => {
    const patient = getPatient(pr.patientId);
    const patientName = patient ? patient.name.toLowerCase() : '';
    const query = searchQuery.toLowerCase();

    const complaintsText = (pr.etapa1?.mainComplaints || []).join(' ').toLowerCase() + ' ' + (pr.etapa1?.complaintsDetails || '').toLowerCase();
    const productsText = (pr.etapa5?.productsUsed || []).map(p => `${p.productName} ${p.batchNumber}`).join(' ').toLowerCase();

    const matchesSearch =
      patientName.includes(query) ||
      complaintsText.includes(query) ||
      productsText.includes(query) ||
      pr.id.toLowerCase().includes(query);

    const matchesPatient =
      selectedPatientId === 'todos' || pr.patientId === selectedPatientId;

    return matchesSearch && matchesPatient;
  });

  // Sort by date descending (newest first)
  const sortedProntuarios = [...filteredProntuarios].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-900/85">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
            Histórico Clínico • Instituto Vitale
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Prontuários & Sessões Realizadas
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Acesse rapidamente todas as fichas de atendimento, anamneses e registros de sessões anteriores de cada paciente.
          </p>
        </div>

        <button
          onClick={onOpenNewProntuarioSelector}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 text-black rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-yellow-950/40 cursor-pointer"
        >
          <FileText className="w-4 h-4 stroke-[2.5]" />
          <span>+ Novo Atendimento</span>
        </button>
      </div>

      {/* Search & Patient Filter Bar */}
      <div className="bg-zinc-950/90 border border-zinc-850 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="relative md:col-span-7">
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por paciente, queixas, produtos, lotes ou ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="md:col-span-5 relative">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-2xl px-3.5 py-2.5">
              <Filter className="w-4 h-4 text-yellow-400 shrink-0" />
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none cursor-pointer"
              >
                <option value="todos" className="bg-zinc-950 text-white">Todas as Pacientes ({patients.length})</option>
                {patients.map((pat) => (
                  <option key={pat.id} value={pat.id} className="bg-zinc-950 text-white">
                    {pat.name} ({prontuarios.filter(p => p.patientId === pat.id).length} sessões)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Prontuarios List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span className="font-heading font-bold text-sm text-white">
            Sessões Registradas ({sortedProntuarios.length})
          </span>
          <span className="font-mono text-[11px]">
            Selo SHA-256 Ativo
          </span>
        </div>

        {sortedProntuarios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedProntuarios.map((pr) => {
              const patient = getPatient(pr.patientId);
              const formattedDate = new Date(pr.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const mainComplaint = (pr.etapa1?.mainComplaints || []).join(', ') || pr.etapa1?.complaintsDetails || 'Atendimento clínico estético domiciliar';
              const firstProduct = pr.etapa5?.productsUsed?.[0];

              return (
                <div
                  key={pr.id}
                  className="bg-zinc-950/80 border border-zinc-900 hover:border-yellow-400/50 rounded-3xl p-5 sm:p-6 transition-all shadow-md flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0 font-bold font-heading">
                          {patient ? patient.name.slice(0, 2).toUpperCase() : 'VT'}
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-base text-white group-hover:text-yellow-400 transition-colors">
                            {patient ? patient.name : 'Paciente Removida'}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3 h-3 text-yellow-400" />
                        <span>Selado</span>
                      </span>
                    </div>

                    <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-zinc-900 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-zinc-500 block">Queixas / Procedimento:</span>
                        <p className="text-zinc-200 font-medium mt-0.5 line-clamp-2">
                          {mainComplaint}
                        </p>
                      </div>

                      {firstProduct && (
                        <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Produto: <span className="text-yellow-300 font-medium">{firstProduct.productName}</span></span>
                          <span className="text-zinc-400">Lote: <span className="font-mono text-zinc-300">{firstProduct.batchNumber}</span></span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between gap-2">
                    {patient && (
                      <button
                        onClick={() => onStartProntuario(patient)}
                        className="text-xs text-zinc-400 hover:text-yellow-400 font-medium transition-colors cursor-pointer flex items-center gap-1"
                        title="Reutilizar dados desta paciente para nova sessão"
                      >
                        <Layers className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Nova Sessão (Reutilizar)</span>
                      </button>
                    )}

                    <button
                      onClick={() => onViewProntuario(pr)}
                      className="ml-auto px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <span>Abrir Prontuário</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-zinc-950/80 rounded-3xl border border-zinc-850 p-12 sm:p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-yellow-400">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">Nenhum prontuário localizado</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              {searchQuery || selectedPatientId !== 'todos'
                ? 'Nenhum registro corresponde aos filtros aplicados.'
                : 'Conclua seu primeiro atendimento para gerar o prontuário com assinatura digital.'}
            </p>
            <button
              onClick={onOpenNewProntuarioSelector}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              + Iniciar Novo Atendimento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
