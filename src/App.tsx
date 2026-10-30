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
  ArrowRight
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
import { storageService } from './services/storage';
import { Patient, Prontuario, ProfessionalProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'pacientes' | 'novo_prontuario' | 'perfil' | 'wal'>('pacientes');

  // App icon dropdown menu state
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);

  // Patients & Prontuários state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [professional, setProfessional] = useState<ProfessionalProfile>(storageService.getProfessional());

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
    setActiveTab('novo_prontuario');
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

  // Filtered patients for Prontuario selection
  const selectablePatientsForProntuario = patients.filter((pat) => {
    if (!prontuarioPatientSearch) return true;
    const query = prontuarioPatientSearch.toLowerCase();
    return (
      pat.name.toLowerCase().includes(query) ||
      pat.cpf.includes(query) ||
      pat.address.neighborhood.toLowerCase().includes(query)
    );
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
      />

      {/* Main Container with Generous Spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-14">
        {/* ===================== TAB 1: PACIENTES & AGENDA ===================== */}
        {activeTab === 'pacientes' && (
          <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-150">
            {/* Top Section: Title & Actions Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-900/80">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                  Painel Clínico Domiciliar
                </span>
                <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                  Agenda & Fichas de Pacientes
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
                  Gerencie atendimentos domiciliares, histórico clínico e prontuários com conformidade técnica e operação 100% offline.
                </p>
              </div>

              <button
                onClick={() => {
                  setPatientToEdit(null);
                  setIsPatientModalOpen(true);
                }}
                className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 hover:to-amber-300 text-black rounded-2xl text-xs sm:text-sm font-bold shadow-lg shadow-yellow-950/40 active:scale-98 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Novo Paciente</span>
              </button>
            </div>

            {/* SEÇÃO 1: Resumo Operacional em Cards Discretos */}
            <section className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400">
                  Resumo Operacional
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Sincronização Local WAL Ativa
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {/* Metric 1 */}
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-3xl p-4 sm:p-5 hover:border-zinc-800 transition-colors shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-zinc-400 font-medium">Total de Pacientes</span>
                    <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-yellow-400">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                      {patients.length}
                    </span>
                    <span className="text-[11px] text-zinc-400">fichas</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-3xl p-4 sm:p-5 hover:border-zinc-800 transition-colors shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-zinc-400 font-medium">Prontuários Selados</span>
                    <div className="w-9 h-9 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-heading text-yellow-400">
                      {prontuarios.length}
                    </span>
                    <span className="text-[11px] text-zinc-400">com SHA-256</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-3xl p-4 sm:p-5 hover:border-zinc-800 transition-colors shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-zinc-400 font-medium">Retornos Pendentes</span>
                    <div className="w-9 h-9 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-300">
                      {patients.filter((p) => p.status === 'retorno_pendente').length}
                    </span>
                    <span className="text-[11px] text-zinc-400">pacientes</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-zinc-950/70 border border-zinc-900 rounded-3xl p-4 sm:p-5 hover:border-zinc-800 transition-colors shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-zinc-400 font-medium">Rotas de Bairros</span>
                    <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-yellow-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold font-heading text-zinc-100">
                      {allNeighborhoods.length}
                    </span>
                    <span className="text-[11px] text-zinc-400">regiões</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SEÇÃO 2: Card Discreto de Controle e Filtros de Pacientes */}
            <section className="bg-zinc-950/90 border border-zinc-850/90 rounded-3xl p-5 sm:p-7 shadow-xl shadow-black/50 space-y-5">
              {/* Header do Grupo de Filtros */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800/70">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-yellow-400" />
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    Pesquisa & Filtros de Atendimento
                  </h2>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpar Filtros</span>
                  </button>
                )}
              </div>

              {/* Linha Principal de Busca e Status */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 sm:gap-4">
                {/* Campo de Busca Ampliado e Confortável */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Pesquisar por nome da paciente, bairro ou CPF..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-16 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Filtro por Status Segmentado e Elegante */}
                <div className="p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {(['todos', 'ativo', 'em_atendimento', 'retorno_pendente'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-yellow-400 text-black shadow-md font-bold'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                      }`}
                    >
                      {st === 'todos' && 'Todos'}
                      {st === 'ativo' && 'Ativos'}
                      {st === 'em_atendimento' && 'Hoje'}
                      {st === 'retorno_pendente' && 'Retornos'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Linha Secundária: Filtro por Rotas de Bairro */}
              {allNeighborhoods.length > 0 && (
                <div className="pt-2 border-t border-zinc-850/60 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
                  <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Filtrar por Rota:</span>
                  </span>

                  <button
                    onClick={() => setNeighborhoodFilter('todos')}
                    className={`px-3 py-1.5 rounded-xl text-[11px] transition-all shrink-0 cursor-pointer ${
                      neighborhoodFilter === 'todos'
                        ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold'
                        : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Todas as Regiões
                  </button>

                  {allNeighborhoods.map((bairro) => (
                    <button
                      key={bairro}
                      onClick={() => setNeighborhoodFilter(bairro)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] transition-all shrink-0 cursor-pointer ${
                        neighborhoodFilter === bairro
                          ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold'
                          : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {bairro}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* SEÇÃO 3: Fichas de Pacientes (Grid com Espaçamento Amplo) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-white">
                    Fichas Cadastradas
                  </span>
                  <span className="text-zinc-400">·</span>
                  <span className="text-zinc-400">
                    {filteredPatients.length} de {patients.length} pacientes
                  </span>
                </div>

                {hasActiveFilters && (
                  <span className="text-yellow-400 text-xs">
                    Filtros ativos aplicados
                  </span>
                )}
              </div>

              {filteredPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                  {filteredPatients.map((patient) => {
                    const latestProntuario = prontuarios.find((pr) => pr.patientId === patient.id);
                    return (
                      <PatientCard
                        key={patient.id}
                        patient={patient}
                        latestProntuario={latestProntuario}
                        onEdit={handleOpenEditPatient}
                        onDelete={handleOpenDeletePatient}
                        onStartProntuario={handleStartProntuario}
                        onViewHistory={handleViewPatientHistory}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="bg-zinc-950/80 rounded-3xl border border-zinc-850 p-12 sm:p-16 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-yellow-400">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white">Nenhum paciente localizado</h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                      {hasActiveFilters
                        ? 'Nenhum paciente coincide com os termos ou rotas pesquisadas. Tente limpar os filtros para visualizar todas as fichas.'
                        : 'Cadastre seu primeiro paciente para iniciar o atendimento domiciliar Vitale.'}
                    </p>
                  </div>
                  <div className="pt-2">
                    {hasActiveFilters ? (
                      <button
                        onClick={handleResetFilters}
                        className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Limpar Filtros de Busca
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setPatientToEdit(null);
                          setIsPatientModalOpen(true);
                        }}
                        className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
                      >
                        + Cadastrar Novo Paciente
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ===================== TAB 2: PRONTUÁRIO ===================== */}
        {activeTab === 'novo_prontuario' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {activeProntuarioPatient ? (
              <WizardContainer
                patient={activeProntuarioPatient}
                professional={professional}
                onSaveProntuario={handleSaveProntuario}
                onCancel={() => {
                  setActiveProntuarioPatient(null);
                  setActiveTab('pacientes');
                }}
              />
            ) : (
              /* Seletor Espaçoso e Elegante de Paciente para Prontuário */
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-zinc-950/90 border border-zinc-850 rounded-3xl p-6 sm:p-10 space-y-7 shadow-2xl">
                  {/* Cabeçalho do Seletor */}
                  <div className="text-center space-y-3 pb-4 border-b border-zinc-850">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 mx-auto flex items-center justify-center shadow-md">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                        Atendimento Clínico
                      </span>
                      <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                        Novo Prontuário
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
                      Selecione a paciente para abrir o fluxo de anamnese, triagem de contraindicações, rastreabilidade de lote e selagem com assinatura digital SHA-256.
                    </p>
                  </div>

                  {/* Campo de Busca Rápida de Paciente */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold uppercase tracking-wider text-yellow-400 text-[11px]">
                        Selecione a Paciente para o Atendimento:
                      </label>
                      <span className="text-zinc-400 text-[11px]">
                        {selectablePatientsForProntuario.length} disponíveis
                      </span>
                    </div>

                    <div className="relative">
                      <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Buscar paciente por nome, bairro ou CPF..."
                        value={prontuarioPatientSearch}
                        onChange={(e) => setProntuarioPatientSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                      />
                      {prontuarioPatientSearch && (
                        <button
                          onClick={() => setProntuarioPatientSearch('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                        >
                          Limpar
                        </button>
                      )}
                    </div>

                    {/* Lista Confortável com Scrollbar Suave */}
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {selectablePatientsForProntuario.map((pat) => (
                        <div
                          key={pat.id}
                          onClick={() => setActiveProntuarioPatient(pat)}
                          className="p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-yellow-400/60 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="space-y-1 min-w-0 pr-3">
                            <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-yellow-400 transition-colors truncate">
                              {pat.name}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
                              <span>CPF: <span className="font-mono text-zinc-300">{pat.cpf}</span></span>
                              <span>·</span>
                              <span>{pat.age} anos</span>
                              <span>·</span>
                              <span className="text-yellow-300/80 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-yellow-400 inline" />
                                {pat.address.neighborhood}
                              </span>
                            </div>
                          </div>

                          <span className="shrink-0 text-xs font-bold text-yellow-400 bg-yellow-400/10 px-3.5 py-2 rounded-xl border border-yellow-400/30 group-hover:bg-yellow-400 group-hover:text-black flex items-center gap-1.5 transition-all">
                            <span>Iniciar</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      ))}

                      {selectablePatientsForProntuario.length === 0 && (
                        <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-850 text-center space-y-2">
                          <p className="text-xs text-zinc-400">
                            Nenhuma paciente encontrada com o termo "{prontuarioPatientSearch}".
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rodapé de Ações do Seletor */}
                  <div className="pt-4 border-t border-zinc-850 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('pacientes')}
                      className="text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Voltar para Agenda
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPatientToEdit(null);
                        setIsPatientModalOpen(true);
                      }}
                      className="text-xs text-yellow-400 hover:underline font-bold cursor-pointer"
                    >
                      + Cadastrar Nova Paciente
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
    </div>
  );
}

