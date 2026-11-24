import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  FileText, 
  Clock, 
  ShieldCheck,
  UserPlus,
  SlidersHorizontal,
  RotateCcw,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PatientCard } from './components/PatientCard';
import { PatientModal } from './components/PatientModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { WizardContainer } from './components/WizardContainer';
import { ProntuarioViewerModal } from './components/ProntuarioViewerModal';
import { ProfessionalSettingsModal } from './components/ProfessionalSettingsModal';
import { WalJournalModal } from './components/WalJournalModal';
import { AgendaTab } from './components/AgendaTab';
import { ProntuariosTab } from './components/ProntuariosTab';
import { AppLockModal } from './components/AppLockModal';
import { ScheduleAlertBanner } from './components/ScheduleAlertBanner';
import { storageService } from './services/storage';
import { notificationService } from './services/notifications';
import { Patient, Prontuario, ProfessionalProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'pacientes' | 'prontuarios' | 'agenda' | 'perfil' | 'wal'>('inicio');

  // App icon dropdown menu state
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);

  // Patients & Prontuários state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [professional, setProfessional] = useState<ProfessionalProfile>(storageService.getProfessional());
  const [isLocked, setIsLocked] = useState(true);
  const [activeProntuarioInitial, setActiveProntuarioInitial] = useState<Prontuario | undefined>(undefined);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'em_atendimento' | 'retorno_pendente'>('todos');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState<string>('todos');

  // Prontuario patient selector search
  const [prontuarioPatientSearch, setProntuarioPatientSearch] = useState('');

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const [activeProntuarioPatient, setActiveProntuarioPatient] = useState<Patient | null>(null);
  const [activeViewerProntuario, setActiveViewerProntuario] = useState<Prontuario | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const [isProfModalOpen, setIsProfModalOpen] = useState(false);
  const [isWalModalOpen, setIsWalModalOpen] = useState(false);

  // Load data from offline SQLite WAL engine
  const refreshData = () => {
    const pts = storageService.getPatients();
    const prs = storageService.getProntuarios();
    setPatients(pts);
    setProntuarios(prs);
    setProfessional(storageService.getProfessional());
  };

  useEffect(() => {
    refreshData();
    notificationService.startScheduler(() => storageService.getPatients());
    return () => {
      notificationService.stopScheduler();
    };
  }, []);

  // Handlers for Patients
  const handleSavePatient = (patientData: any) => {
    storageService.savePatient(patientData);
    refreshData();
  };

  const handleOpenEditPatient = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsPatientModalOpen(true);
  };

  const handleOpenDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      storageService.deletePatient(patientToDelete.id);
      setIsDeleteModalOpen(false);
      setPatientToDelete(null);
      refreshData();
    }
  };

  // Handlers for Prontuários & Wizard
  const handleStartProntuario = (patient: Patient) => {
    setActiveProntuarioPatient(patient);
    const patientPrs = prontuarios.filter(pr => pr.patientId === patient.id);
    if (patientPrs.length > 0) {
      const reuse = confirm(
        `Cliente ${patient.name} possui atendimento anterior.\n\nDeseja reutilizar os mesmos dados, anamnese e procedimentos da última sessão para este novo atendimento (várias sessões)?\n\n• OK: Reutilizar dados anteriores\n• Cancelar: Iniciar atendimento em branco`
      );
      if (reuse) {
        const latest = patientPrs[0];
        setActiveProntuarioInitial({
          ...latest,
          id: `pront-${Date.now()}`,
          date: new Date().toISOString(),
          status: 'rascunho',
        });
      } else {
        setActiveProntuarioInitial(undefined);
      }
    } else {
      setActiveProntuarioInitial(undefined);
    }
  };

  const handleUnlock = (pin: string) => {
    const correctPin = professional.securityPin || '1234';
    if (pin === correctPin) {
      setIsLocked(false);
      return true;
    }
    return false;
  };

  const handleSavePatientSchedule = (patientId: string, scheduledDate?: string) => {
    const p = storageService.getPatientById(patientId);
    if (p) {
      storageService.savePatient({
        ...p,
        scheduledDate,
      });
      refreshData();
    }
  };

  const handleSaveProntuario = (newProntuario: Prontuario) => {
    storageService.saveProntuario(newProntuario);
    refreshData();
    setActiveProntuarioPatient(null);
    setActiveViewerProntuario(newProntuario);
    setIsViewerOpen(true);
    setActiveTab('pacientes');
  };

  const handleViewPatientHistory = (patient: Patient) => {
    const patientProntuarios = prontuarios.filter((pr) => pr.patientId === patient.id);
    if (patientProntuarios.length > 0) {
      setActiveViewerProntuario(patientProntuarios[0]);
      setIsViewerOpen(true);
    } else {
      if (confirm(`A paciente ${patient.name} ainda não possui prontuários concluídos. Deseja iniciar a anamnese agora?`)) {
        handleStartProntuario(patient);
      }
    }
  };

  // Neighborhoods extraction for fast Home Care filtering
  const allNeighborhoods = Array.from(new Set(patients.map((p) => p.address.neighborhood))).filter(Boolean);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'todos' || neighborhoodFilter !== 'todos';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('todos');
    setNeighborhoodFilter('todos');
  };

  // Filtered patients calculation
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.address.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.cpf.includes(searchQuery);

    const matchesStatus =
      statusFilter === 'todos' || patient.status === statusFilter;

    const matchesNeighborhood =
      neighborhoodFilter === 'todos' || patient.address.neighborhood === neighborhoodFilter;

    return matchesSearch && matchesStatus && matchesNeighborhood;
  });

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans select-none">
      {/* Header with Clickable App Icon Menu */}
      <Header
        activeTab={activeTab}
        professional={professional}
        setActiveTab={(tab) => {
          if (tab === 'perfil') {
            setIsProfModalOpen(true);
          } else if (tab === 'wal') {
            setIsWalModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenNewPatientModal={() => {
          setPatientToEdit(null);
          setIsPatientModalOpen(true);
        }}
        isAppMenuOpen={isAppMenuOpen}
        setIsAppMenuOpen={setIsAppMenuOpen}
        onLockApp={() => setIsLocked(true)}
      />

      {/* Main Container with Generous Spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-14">
        {/* ===================== WIZARD CONTAINER (WHEN ATENDIMENTO IS ACTIVE) ===================== */}
        {activeProntuarioPatient ? (
          <div className="space-y-8 animate-in fade-in duration-150">
            <WizardContainer
              patient={activeProntuarioPatient}
              professional={professional}
              initialProntuario={activeProntuarioInitial}
              onSaveProntuario={handleSaveProntuario}
              onCancel={() => {
                setActiveProntuarioPatient(null);
                setActiveProntuarioInitial(undefined);
                setActiveTab('prontuarios');
              }}
            />
          </div>
        ) : (
          <>
            {/* ===================== TAB 1: INÍCIO ===================== */}
            {activeTab === 'inicio' && (
              <div className="space-y-8 animate-in fade-in duration-150">
                {/* Top Welcome Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-900/80">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                      Painel Inicial • Instituto Vitale
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                      Bem-vinda, {professional.name.split(' ')[0]}
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                      Visão geral de seus atendimentos domiciliares, indicadores operacionais e acesso rápido aos pacientes.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('agenda')}
                      className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-yellow-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Ver Agenda
                    </button>
                    <button
                      onClick={() => {
                        setPatientToEdit(null);
                        setIsPatientModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 text-black rounded-xl text-xs font-bold shadow-lg shadow-yellow-950/40 cursor-pointer"
                    >
                      + Novo Paciente
                    </button>
                  </div>
                </div>

                {/* Schedule Alert Banner */}
                <ScheduleAlertBanner
                  patients={patients}
                  onStartProntuario={handleStartProntuario}
                  onViewAgenda={() => setActiveTab('agenda')}
                />

                {/* Pacientes Recentes & Últimos Prontuários */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* Pacientes Recentes */}
                  <div className="bg-zinc-950/80 border border-zinc-900 rounded-3xl p-5 sm:p-6 space-y-4 shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-yellow-400" />
                        <span>Pacientes Recentes</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('pacientes')}
                        className="text-xs text-yellow-400 hover:underline font-semibold cursor-pointer"
                      >
                        Ver Todos ({patients.length}) →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {patients.slice(0, 4).map((pat) => (
                        <div
                          key={pat.id}
                          onClick={() => handleStartProntuario(pat)}
                          className="p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-yellow-400/40 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="space-y-0.5 min-w-0 pr-3">
                            <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-yellow-400 transition-colors truncate">
                              {pat.name}
                            </h4>
                            <p className="text-[11px] text-zinc-400">
                              CPF: {pat.cpf} • {pat.address.neighborhood}
                            </p>
                          </div>
                          <span className="shrink-0 text-[11px] font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-1.5 rounded-xl border border-yellow-400/30 group-hover:bg-yellow-400 group-hover:text-black transition-all">
                            Atender
                          </span>
                        </div>
                      ))}

                      {patients.length === 0 && (
                        <p className="text-xs text-zinc-500 text-center py-6">Nenhum paciente cadastrado.</p>
                      )}
                    </div>
                  </div>

                  {/* Últimos Prontuários */}
                  <div className="bg-zinc-950/80 border border-zinc-900 rounded-3xl p-5 sm:p-6 space-y-4 shadow-md">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                      <h3 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-yellow-400" />
                        <span>Últimos Prontuários Realizados</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('prontuarios')}
                        className="text-xs text-yellow-400 hover:underline font-semibold cursor-pointer"
                      >
                        Ver Todos ({prontuarios.length}) →
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {prontuarios.slice(0, 3).map((pr) => {
                        const pat = patients.find(p => p.id === pr.patientId);
                        const dateFormatted = new Date(pr.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
                        return (
                          <div
                            key={pr.id}
                            onClick={() => {
                              setActiveViewerProntuario(pr);
                              setIsViewerOpen(true);
                            }}
                            className="p-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-yellow-400/40 transition-all cursor-pointer flex items-center justify-between group"
                          >
                            <div className="space-y-0.5 min-w-0 pr-3">
                              <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-yellow-400 transition-colors truncate">
                                {pat ? pat.name : 'Paciente'}
                              </h4>
                              <p className="text-[11px] text-zinc-400 truncate">
                                {dateFormatted} • {pr.etapa1?.mainComplaints?.[0] || 'Atendimento estético'}
                              </p>
                            </div>
                            <span className="shrink-0 text-[11px] font-bold text-zinc-300 bg-zinc-800 px-2.5 py-1.5 rounded-xl border border-zinc-700 group-hover:bg-yellow-400 group-hover:text-black transition-all">
                              Abrir
                            </span>
                          </div>
                        );
                      })}

                      {prontuarios.length === 0 && (
                        <p className="text-xs text-zinc-500 text-center py-6">Nenhum prontuário selado ainda.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===================== TAB 2: PACIENTES ===================== */}
            {activeTab === 'pacientes' && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-900/80">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                      Gestão de Cadastros
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                      Fichas de Pacientes
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                      Lista completa de pacientes cadastrados para atendimentos domiciliares.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setPatientToEdit(null);
                      setIsPatientModalOpen(true);
                    }}
                    className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 text-black rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-yellow-950/40 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Novo Paciente</span>
                  </button>
                </div>

                <section className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                    <span className="font-heading font-bold text-sm text-white">
                      Fichas Cadastradas ({filteredPatients.length})
                    </span>
                  </div>

                  {filteredPatients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {filteredPatients.map((patient) => {
                        const latestPront = prontuarios.find((pr) => pr.patientId === patient.id);
                        return (
                          <PatientCard
                            key={patient.id}
                            patient={patient}
                            latestProntuario={latestPront}
                            onEdit={handleOpenEditPatient}
                            onDelete={handleOpenDeletePatient}
                            onStartProntuario={handleStartProntuario}
                            onViewHistory={handleViewPatientHistory}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-zinc-950/80 rounded-3xl border border-zinc-850 p-12 sm:p-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-yellow-400">
                        <Users className="w-8 h-8" />
                      </div>
                      <h3 className="text-base font-bold text-white">Nenhum paciente localizado</h3>
                      <p className="text-xs text-zinc-400 max-w-md mx-auto">
                        Cadastre seu primeiro paciente ou ajuste os filtros na aba Início.
                      </p>
                      <button
                        onClick={() => {
                          setPatientToEdit(null);
                          setIsPatientModalOpen(true);
                        }}
                        className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold shadow-md cursor-pointer"
                      >
                        + Cadastrar Novo Paciente
                      </button>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* ===================== TAB: PRONTUÁRIOS ===================== */}
            {activeTab === 'prontuarios' && (
              <ProntuariosTab
                patients={patients}
                prontuarios={prontuarios}
                onViewProntuario={(pr) => {
                  setActiveViewerProntuario(pr);
                  setIsViewerOpen(true);
                }}
                onStartProntuario={handleStartProntuario}
                onOpenNewProntuarioSelector={() => {
                  setActiveTab('pacientes');
                }}
              />
            )}

            {/* ===================== TAB: AGENDA ===================== */}
            {activeTab === 'agenda' && (
              <AgendaTab
                patients={patients}
                onEditPatient={handleOpenEditPatient}
                onStartProntuario={handleStartProntuario}
                onSavePatientSchedule={handleSavePatientSchedule}
              />
            )}
          </>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'perfil') {
            setIsProfModalOpen(true);
          } else if (tab === 'wal') {
            setIsWalModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenAppMenu={() => setIsAppMenuOpen(true)}
        onOpenNewPatient={() => {
          setPatientToEdit(null);
          setIsPatientModalOpen(true);
        }}
        patientsCount={patients.length}
      />

      {/* Patient Create / Edit Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        patientToEdit={patientToEdit}
        onClose={() => {
          setIsPatientModalOpen(false);
          setPatientToEdit(null);
        }}
        onSave={handleSavePatient}
      />

      {/* Delete Patient Confirm Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        patient={patientToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPatientToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Prontuario & PDF / Imagem Viewer Modal */}
      <ProntuarioViewerModal
        isOpen={isViewerOpen}
        prontuario={activeViewerProntuario}
        patient={patients.find((p) => p.id === activeViewerProntuario?.patientId) || null}
        onClose={() => {
          setIsViewerOpen(false);
          setActiveViewerProntuario(null);
        }}
      />

      {/* Professional Settings Modal */}
      <ProfessionalSettingsModal
        isOpen={isProfModalOpen}
        profile={professional}
        onClose={() => setIsProfModalOpen(false)}
        onSave={(updated) => {
          storageService.saveProfessional(updated);
          setProfessional(updated);
        }}
      />

      {/* WAL Journal & SQLite Info Modal */}
      <WalJournalModal
        isOpen={isWalModalOpen}
        onClose={() => setIsWalModalOpen(false)}
      />

      {/* App Security Lock Modal */}
      <AppLockModal
        isLocked={isLocked}
        professional={professional}
        onUnlock={handleUnlock}
      />
    </div>
  );
}
