import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Wifi, 
  WifiOff, 
  Database, 
  Users, 
  FileText, 
  UserCheck, 
  ChevronDown, 
  PlusCircle, 
  Download, 
  X
} from 'lucide-react';
import { storageService } from '../services/storage';
import { ProfessionalProfile } from '../types';

interface HeaderProps {
  activeTab: 'pacientes' | 'novo_prontuario' | 'perfil' | 'wal';
  setActiveTab: (tab: 'pacientes' | 'novo_prontuario' | 'perfil' | 'wal') => void;
  onOpenNewPatientModal: () => void;
  isAppMenuOpen?: boolean;
  setIsAppMenuOpen?: (open: boolean) => void;
  professional?: ProfessionalProfile;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewPatientModal,
  isAppMenuOpen: externalMenuOpen,
  setIsAppMenuOpen: externalSetMenuOpen,
  professional: propProfessional,
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuOpen = externalMenuOpen !== undefined ? externalMenuOpen : internalMenuOpen;
  const setMenuOpen = externalSetMenuOpen !== undefined ? externalSetMenuOpen : setInternalMenuOpen;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncMetrics, setSyncMetrics] = useState(storageService.getSyncMetrics());
  const professional = propProfessional || storageService.getProfessional();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const interval = setInterval(() => {
      setSyncMetrics(storageService.getSyncMetrics());
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, setMenuOpen]);

  const handleDownloadBackup = () => {
    const jsonStr = storageService.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitale-backup-wal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  return (
    <header className="bg-black/95 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40 transition-all select-none">
      {/* Top Banner / Compliance & Offline Status bar (Black & Yellow Vitale) */}
      <div className="bg-zinc-950 px-3 sm:px-4 py-1.5 border-b border-zinc-800/80 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-yellow-400 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
          </span>
          <span className="text-zinc-100 font-bold tracking-wide">
            {professional.clinicOrBrand || 'Vitale Estética Home Care'}
          </span>
          <span className="text-zinc-500 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline">
            {professional.name} ({professional.councilType} {professional.councilNumber})
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline/Online Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-[11px] font-medium text-yellow-300">Conectado</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-medium text-amber-400">Offline 100%</span>
              </>
            )}
          </div>

          {/* SQLite WAL Storage Badge */}
          <button
            onClick={() => setActiveTab('wal')}
            title="Armazenamento local SQLite WAL integrado"
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 text-zinc-300 cursor-pointer transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[11px] font-medium text-zinc-300 hidden sm:inline">SQLite WAL</span>
            {syncMetrics.pendingSyncCount > 0 ? (
              <span className="px-1.5 py-0.2 text-[10px] bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-full font-mono">
                {syncMetrics.pendingSyncCount}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-mono">
                OK
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* BRAND & CLICKABLE APP ICON MENU TRIGGER */}
        <div className="relative" ref={menuRef}>
          <div 
            onClick={() => setMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group p-1 -m-1 rounded-2xl hover:bg-zinc-900 transition-colors"
            title="Toque no ícone para abrir o menu do aplicativo Vitale"
          >
            {/* Clickable Icon with Gold/Yellow gradient */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-yellow-950/50 group-hover:scale-105 active:scale-95 transition-transform ring-2 ring-yellow-400/40">
              <Sparkles className="w-5 h-5 text-black" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-base sm:text-lg text-white tracking-tight">
                  <span className="text-yellow-400">Vitale</span> <span className="text-zinc-200">Home Care</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 group-hover:text-yellow-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180 text-yellow-400' : ''}`} />
              </div>
            </div>
          </div>

          {/* ================= CLICKABLE APP ICON DROPDOWN MENU ================= */}
          {isMenuOpen && (
            <div className="absolute left-0 top-14 w-80 sm:w-88 bg-zinc-950 border border-yellow-500/30 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-3 duration-150">
              {/* Menu Header with Profile Summary - Subtitle removed as requested */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-white leading-tight">
                      Vitale Home Care Pro
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Professional Mini Info */}
              <div className="bg-black p-3 rounded-2xl border border-zinc-800 mb-3 text-xs">
                <span className="text-[10px] text-yellow-400 font-semibold uppercase tracking-wider block">
                  Responsável Técnica
                </span>
                <p className="font-bold text-white mt-0.5 truncate">{professional.name}</p>
                <p className="text-[11px] text-zinc-400 font-mono">
                  {professional.councilType} {professional.councilNumber} • {professional.specialty}
                </p>
              </div>

              {/* Navigation & Action Links */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenNewPatientModal();
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 border border-yellow-400/30 font-semibold flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-yellow-400" />
                  <span>+ Cadastrar Novo Paciente</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setActiveTab('pacientes');
                  }}
                  className="w-full text-left p-2.5 rounded-xl text-zinc-200 hover:bg-zinc-900 hover:text-yellow-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4 text-zinc-400" />
                  <span>Agenda & Fichas de Pacientes</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setActiveTab('novo_prontuario');
                  }}
                  className="w-full text-left p-2.5 rounded-xl text-zinc-200 hover:bg-zinc-900 hover:text-yellow-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-yellow-400" />
                  <span>Prontuário</span>
                </button>

                <div className="my-2 border-t border-zinc-800" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setActiveTab('perfil');
                  }}
                  className="w-full text-left p-2.5 rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-yellow-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-yellow-400" />
                  <span>Dados do Conselho (COFEN / CRBM)</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setActiveTab('wal');
                  }}
                  className="w-full text-left p-2.5 rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-yellow-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Database className="w-4 h-4 text-zinc-400" />
                  <span>Engine SQLite WAL & Métricas</span>
                </button>

                <button
                  onClick={handleDownloadBackup}
                  className="w-full text-left p-2.5 rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-yellow-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-yellow-400" />
                  <span>Baixar Backup Completo (JSON)</span>
                </button>
              </div>

              {/* Compliance footer note */}
              <div className="mt-3 pt-2.5 border-t border-zinc-800 text-[10px] text-zinc-500 flex items-center justify-between">
                <span>Auditoria Criptográfica SHA-256</span>
                <span className="text-yellow-400 font-semibold">Offline</span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('pacientes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pacientes'
                ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pacientes & Agenda</span>
          </button>

          <button
            onClick={() => setActiveTab('novo_prontuario')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'novo_prontuario'
                ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <FileText className="w-4 h-4 text-yellow-400" />
            <span>Prontuário</span>
          </button>

          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'perfil'
                ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-yellow-400" />
            <span>Profissional & TCLE</span>
          </button>

          <button
            onClick={onOpenNewPatientModal}
            className="flex items-center gap-1.5 ml-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-black rounded-xl text-sm font-bold shadow-lg shadow-yellow-950/40 transition-all cursor-pointer"
          >
            <span>+ Novo Paciente</span>
          </button>
        </nav>

        {/* Mobile quick "+ Paciente" button */}
        <button
          onClick={onOpenNewPatientModal}
          className="md:hidden flex items-center gap-1 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          <span>+ Paciente</span>
        </button>
      </div>
    </header>
  );
};
