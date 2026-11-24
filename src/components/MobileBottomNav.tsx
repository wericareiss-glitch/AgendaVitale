import React from 'react';
import { Home, Users, Calendar, PlusCircle, Sparkles, FileText } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'inicio' | 'pacientes' | 'prontuarios' | 'agenda' | 'perfil' | 'wal';
  setActiveTab: (tab: 'inicio' | 'pacientes' | 'prontuarios' | 'agenda' | 'perfil' | 'wal') => void;
  onOpenAppMenu: () => void;
  onOpenNewPatient: () => void;
  patientsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAppMenu,
  onOpenNewPatient,
  patientsCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-lg border-t border-zinc-800/90 px-3 py-2 pb-safe shadow-2xl flex items-center justify-between select-none">
      {/* 1. Início */}
      <button
        type="button"
        onClick={() => setActiveTab('inicio')}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'inicio'
            ? 'text-yellow-400 font-bold'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Home className="w-5 h-5 text-yellow-400" />
        <span className="text-[10px] mt-0.5">Início</span>
      </button>

      {/* 2. Pacientes */}
      <button
        type="button"
        onClick={() => setActiveTab('pacientes')}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
          activeTab === 'pacientes'
            ? 'text-yellow-400 font-bold'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Pacientes</span>
        {patientsCount > 0 && (
          <span className="absolute top-0 right-2 px-1.5 py-0.2 text-[9px] font-bold bg-yellow-400 text-black rounded-full">
            {patientsCount}
          </span>
        )}
      </button>

      {/* 3. Action Button Central (+ Paciente) */}
      <div className="flex-1 flex justify-center">
        <button
          type="button"
          onClick={onOpenNewPatient}
          className="-mt-5 w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-300 flex items-center justify-center text-black shadow-xl shadow-yellow-950/80 ring-4 ring-black cursor-pointer active:scale-95 transition-transform"
          title="Cadastrar Novo Paciente"
        >
          <PlusCircle className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* 4. Prontuários */}
      <button
        type="button"
        onClick={() => setActiveTab('prontuarios')}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'prontuarios'
            ? 'text-yellow-400 font-bold'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <FileText className="w-5 h-5 text-yellow-400" />
        <span className="text-[10px] mt-0.5">Prontuários</span>
      </button>

      {/* 5. Agenda */}
      <button
        type="button"
        onClick={() => setActiveTab('agenda')}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'agenda'
            ? 'text-yellow-400 font-bold'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Calendar className="w-5 h-5 text-yellow-400" />
        <span className="text-[10px] mt-0.5">Agenda</span>
      </button>
    </nav>
  );
};
