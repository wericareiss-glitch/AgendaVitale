import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  MessageSquare,
  Edit3,
  FileText
} from 'lucide-react';
import { Patient } from '../types';

interface AgendaTabProps {
  patients: Patient[];
  onEditPatient: (patient: Patient) => void;
  onStartProntuario: (patient: Patient) => void;
  onSavePatientDates: (patientId: string, scheduledDate?: string, returnDate?: string) => void;
}

export const AgendaTab: React.FC<AgendaTabProps> = ({
  patients,
  onEditPatient,
  onStartProntuario,
  onSavePatientDates,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'todos' | 'agendados' | 'retornos' | 'hoje'>('todos');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');

  // Editing state for quick date modification modal or inline picker
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [tempScheduled, setTempScheduled] = useState('');
  const [tempReturn, setTempReturn] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);

  const handleOpenQuickEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setTempScheduled(patient.scheduledDate ? patient.scheduledDate.slice(0, 16) : '');
    setTempReturn(patient.returnDate ? patient.returnDate.slice(0, 10) : '');
  };

  const handleSaveQuickDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      onSavePatientDates(
        editingPatient.id, 
        tempScheduled ? new Date(tempScheduled).toISOString() : undefined,
        tempReturn ? new Date(tempReturn).toISOString() : undefined
      );
      setEditingPatient(null);
    }
  };

  // Filter patients based on search & view filter
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm) ||
      patient.address.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'agendados') {
      return Boolean(patient.scheduledDate);
    }
    if (filterType === 'retornos') {
      return Boolean(patient.returnDate);
    }
    if (filterType === 'hoje') {
      const isTodaySched = patient.scheduledDate && patient.scheduledDate.startsWith(todayStr);
      const isTodayReturn = patient.returnDate && patient.returnDate.startsWith(todayStr);
      return isTodaySched || isTodayReturn;
    }

    if (selectedDateFilter) {
      const schedMatch = patient.scheduledDate && patient.scheduledDate.startsWith(selectedDateFilter);
      const returnMatch = patient.returnDate && patient.returnDate.startsWith(selectedDateFilter);
      return schedMatch || returnMatch;
    }

    return true;
  });

  // Sort patients: those with upcoming dates first
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const dateA = a.scheduledDate || a.returnDate || '9999-12-31';
    const dateB = b.scheduledDate || b.returnDate || '9999-12-31';
    return dateA.localeCompare(dateB);
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-900">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
            Gerenciamento de Agenda & Retornos Home Care
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Agenda de Atendimentos & Retornos
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Selecione e organize a data de agendamento e a data de retorno clínico para cada cliente cadastrado com facilidade.
          </p>
        </div>

        {/* Stats summary badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-2xl flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-yellow-400" />
            <div className="text-xs">
              <span className="text-zinc-400">Agendados:</span>{' '}
              <span className="font-bold text-white">{patients.filter(p => p.scheduledDate).length}</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-2xl flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <span className="text-zinc-400">Retornos:</span>{' '}
              <span className="font-bold text-white">{patients.filter(p => p.returnDate).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou bairro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            onClick={() => setFilterType('todos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'todos'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850 border border-zinc-800'
            }`}
          >
            Todos ({patients.length})
          </button>

          <button
            onClick={() => setFilterType('hoje')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'hoje'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850 border border-zinc-800'
            }`}
          >
            Compromissos Hoje
          </button>

          <button
            onClick={() => setFilterType('agendados')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'agendados'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850 border border-zinc-800'
            }`}
          >
            Com Agendamento
          </button>

          <button
            onClick={() => setFilterType('retornos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'retornos'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850 border border-zinc-800'
            }`}
          >
            Com Retorno
          </button>

          {/* Date Picker Filter */}
          <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs">
            <span className="text-zinc-400">Data:</span>
            <input
              type="date"
              value={selectedDateFilter}
              onChange={(e) => {
                setSelectedDateFilter(e.target.value);
                setFilterType('todos');
              }}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
            />
            {selectedDateFilter && (
              <button
                onClick={() => setSelectedDateFilter('')}
                className="text-yellow-400 hover:underline ml-1 font-bold text-[10px]"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Patients List Grid for Agenda */}
      {sortedPatients.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-12 text-center space-y-3">
          <CalendarIcon className="w-12 h-12 text-yellow-500/50 mx-auto" />
          <h3 className="text-base font-heading font-bold text-white">Nenhum compromisso encontrado</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Nenhum paciente corresponde aos filtros de agendamento ou retorno selecionados. Clique em "Agendar / Retorno" em qualquer paciente para definir as datas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPatients.map((patient) => {
            const rawPhone = patient.phone.replace(/\D/g, '');
            const schedText = patient.scheduledDate
              ? new Date(patient.scheduledDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
              : 'Não agendado';
            
            const returnText = patient.returnDate
              ? new Date(patient.returnDate).toLocaleDateString('pt-BR', { dateStyle: 'medium' })
              : 'Não definido';

            const whatsappMsg = `Olá ${patient.name}, tudo bem? Aqui é da Vitale Estética Home Care! Passando para confirmar seu atendimento agendado para ${schedText}${patient.returnDate ? ` e data de retorno para ${returnText}` : ''}. Nos vemos em breve!`;
            const whatsappUrl = `https://wa.me/55${rawPhone}?text=${encodeURIComponent(whatsappMsg)}`;

            return (
              <div
                key={patient.id}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-yellow-500/40 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-heading font-bold text-base text-white truncate">
                        {patient.name}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Bairro: <span className="text-yellow-400 font-medium">{patient.address.neighborhood}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenQuickEdit(patient)}
                      className="px-3 py-1.5 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Selecionar / Alterar Data de Agendamento e Retorno"
                    >
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Agendar</span>
                    </button>
                  </div>

                  {/* Dates Box */}
                  <div className="bg-black/60 rounded-2xl p-3 border border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-yellow-400" />
                        <span>Data Agendamento:</span>
                      </span>
                      <span className={`font-mono font-bold ${patient.scheduledDate ? 'text-yellow-300' : 'text-zinc-500'}`}>
                        {schedText}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-zinc-800">
                      <span className="text-zinc-400 flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>Data de Retorno:</span>
                      </span>
                      <span className={`font-mono font-bold ${patient.returnDate ? 'text-amber-300' : 'text-zinc-500'}`}>
                        {returnText}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono">{patient.phone}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Lembrete WhatsApp</span>
                  </a>

                  <button
                    onClick={() => onStartProntuario(patient)}
                    className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Iniciar Prontuário para este cliente"
                  >
                    <FileText className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Atender</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK DATE EDIT MODAL */}
      {editingPatient && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-yellow-500/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">
                    Definir Agenda & Retorno
                  </h3>
                  <p className="text-xs text-zinc-400 truncate max-w-[220px]">
                    {editingPatient.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingPatient(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuickDates} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Data e Horário de Agendamento
                </label>
                <input
                  type="datetime-local"
                  value={tempScheduled}
                  onChange={(e) => setTempScheduled(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Data de Retorno / Revisão
                </label>
                <input
                  type="date"
                  value={tempReturn}
                  onChange={(e) => setTempReturn(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-bold shadow-lg shadow-yellow-950/40 cursor-pointer"
                >
                  Salvar Datas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
