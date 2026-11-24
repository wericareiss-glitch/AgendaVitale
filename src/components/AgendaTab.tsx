import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  MessageSquare,
  Edit3,
  FileText,
  Plus,
  Trash2,
  Bell,
  BellRing
} from 'lucide-react';
import { Patient } from '../types';
import { notificationService } from '../services/notifications';

interface AgendaTabProps {
  patients: Patient[];
  onEditPatient: (patient: Patient) => void;
  onStartProntuario: (patient: Patient) => void;
  onSavePatientSchedule: (patientId: string, scheduledDate?: string) => void;
}

export const AgendaTab: React.FC<AgendaTabProps> = ({
  patients,
  onEditPatient,
  onStartProntuario,
  onSavePatientSchedule,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'compromissos' | 'todos_clientes'>('compromissos');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  const handleToggleNotifications = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      alert('Lembretes push ativados com sucesso! Você será notificado sobre os atendimentos do dia.');
    } else {
      alert('Permissão de notificação negada ou não suportada pelo navegador.');
    }
  };

  // Quick scheduling modal state
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [tempScheduled, setTempScheduled] = useState('');

  const todayStr = new Date().toISOString().slice(0, 10);

  const handleOpenQuickEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setTempScheduled(patient.scheduledDate ? patient.scheduledDate.slice(0, 16) : '');
  };

  const handleSaveQuickSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPatient) {
      onSavePatientSchedule(
        editingPatient.id, 
        tempScheduled ? new Date(tempScheduled).toISOString() : undefined
      );
      setEditingPatient(null);
    }
  };

  const handleClearSchedule = (patient: Patient) => {
    if (confirm(`Deseja remover o agendamento de ${patient.name}?`)) {
      onSavePatientSchedule(patient.id, undefined);
    }
  };

  // Filter patients with appointments
  const scheduledPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.includes(searchTerm) ||
      p.address.neighborhood.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (!p.scheduledDate && activeSubTab === 'compromissos') return false;

    if (dateFilter) {
      return p.scheduledDate && p.scheduledDate.startsWith(dateFilter);
    }

    return true;
  });

  const sortedAppointments = [...scheduledPatients].sort((a, b) => {
    const dateA = a.scheduledDate || '9999-12-31';
    const dateB = b.scheduledDate || '9999-12-31';
    return dateA.localeCompare(dateB);
  });

  const allFilteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.cpf.includes(searchTerm) ||
    p.address.neighborhood.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-900">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
            Organização de Atendimentos Domiciliares
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
            Agenda de Agendamentos
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
            Visualize compromissos confirmados e agende novos horários para cada cliente com total clareza.
          </p>
        </div>

        {/* Counters & Push Notification Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleToggleNotifications}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              notificationsEnabled
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-yellow-400'
            }`}
          >
            {notificationsEnabled ? <BellRing className="w-4 h-4 text-emerald-400" /> : <Bell className="w-4 h-4 text-yellow-400" />}
            <span>{notificationsEnabled ? 'Lembretes Push Ativos' : 'Ativar Lembretes Push'}</span>
          </button>

          <div className="bg-zinc-900 border border-zinc-800 px-3.5 py-2 rounded-2xl flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-yellow-400" />
            <div className="text-xs">
              <span className="text-zinc-400">Total Agendados:</span>{' '}
              <span className="font-bold text-white">{patients.filter(p => p.scheduledDate).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs & Search Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Sub tabs switcher */}
          <div className="flex items-center gap-2 w-full sm:w-auto bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setActiveSubTab('compromissos')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'compromissos'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📅 Agendamentos Confirmados ({patients.filter(p => p.scheduledDate).length})
            </button>

            <button
              onClick={() => setActiveSubTab('todos_clientes')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'todos_clientes'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              👥 Todos os Clientes ({patients.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar cliente ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* Date Filter Bar for Appointments */}
        {activeSubTab === 'compromissos' && (
          <div className="flex items-center justify-between pt-3 border-t border-zinc-900 flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Filtrar por data específica:</span>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-white text-xs cursor-pointer focus:outline-none focus:border-yellow-400"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-yellow-400 hover:underline font-bold text-xs ml-1"
                >
                  Limpar Data
                </button>
              )}
            </div>

            <span className="text-xs text-zinc-500">
              Mostrando agendamentos ordenados cronologicamente
            </span>
          </div>
        )}
      </div>

      {/* ===================== VIEW 1: AGENDAMENTOS CONFIRMADOS ===================== */}
      {activeSubTab === 'compromissos' && (
        sortedAppointments.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-12 text-center space-y-3">
            <CalendarIcon className="w-12 h-12 text-yellow-500/50 mx-auto" />
            <h3 className="text-base font-heading font-bold text-white">Nenhum agendamento encontrado</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Nenhum cliente possui horário agendado no momento. Clique na aba <strong className="text-white">"Todos os Clientes"</strong> acima para selecionar e agendar atendimentos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAppointments.map((patient) => {
              const rawPhone = patient.phone.replace(/\D/g, '');
              const schedText = patient.scheduledDate
                ? new Date(patient.scheduledDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
                : 'Não agendado';

              const whatsappMsg = `Olá ${patient.name}, tudo bem? Aqui é da Vitale Estética Home Care! Passando para confirmar nosso atendimento agendado para ${schedText}. Nos vemos em breve!`;
              const whatsappUrl = `https://wa.me/55${rawPhone}?text=${encodeURIComponent(whatsappMsg)}`;

              return (
                <div
                  key={patient.id}
                  className="bg-zinc-900/90 border border-zinc-800 hover:border-yellow-500/40 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-heading font-bold text-base text-white truncate">
                          {patient.name}
                        </h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-yellow-400 shrink-0" />
                          <span>Bairro: <strong className="text-zinc-200">{patient.address.neighborhood}</strong></span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenQuickEdit(patient)}
                          className="p-2 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 transition-colors cursor-pointer"
                          title="Alterar Data"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleClearSchedule(patient)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors cursor-pointer"
                          title="Remover Agendamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Schedule Box */}
                    <div className="bg-black/70 rounded-2xl p-3 border border-zinc-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-yellow-400" />
                          <span>Data e Horário:</span>
                        </span>
                        <span className="font-mono font-bold text-yellow-300">
                          {schedText}
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
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => onStartProntuario(patient)}
                      className="py-2 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-md"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Atender</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ===================== VIEW 2: TODOS OS CLIENTES (FÁCIL AGENDAMENTO) ===================== */}
      {activeSubTab === 'todos_clientes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allFilteredPatients.map((patient) => {
            const schedText = patient.scheduledDate
              ? new Date(patient.scheduledDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
              : 'Sem agendamento';

            return (
              <div
                key={patient.id}
                className="bg-zinc-900/90 border border-zinc-800 hover:border-yellow-500/40 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
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
                      className="px-3 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Agendar</span>
                    </button>
                  </div>

                  <div className="bg-black/60 rounded-2xl p-3 border border-zinc-800 space-y-1 text-xs">
                    <p className="text-zinc-300 flex items-center justify-between">
                      <span className="text-zinc-400">Agendamento:</span>
                      <span className="font-mono font-bold text-yellow-300">{schedText}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono">{patient.phone}</span>
                  <button
                    onClick={() => onStartProntuario(patient)}
                    className="text-yellow-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Iniciar Atendimento →</span>
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
                    Definir Data de Agendamento
                  </h3>
                  <p className="text-xs text-zinc-400 truncate max-w-[220px]">
                    {editingPatient.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingPatient(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuickSchedule} className="space-y-4 text-xs">
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
                  Salvar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
