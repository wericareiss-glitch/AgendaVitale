import React from 'react';
import { Users, FileText, PlusCircle, Sparkles } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'pacientes' | 'novo_prontuario' | 'perfil' | 'wal';
  setActiveTab: (tab: 'pacientes' | 'novo_prontuario' | 'perfil' | 'wal') => void;
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
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-black/95 backdrop-blur-lg border-t border-zinc-800/90 px-4 py-2 pb-safe shadow-2xl flex items-center justify-between select-none">
      {/* 1. Pacientes & Agenda */}
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
        <span className="text-[11px] mt-0.5">Pacientes</span>
        {patientsCount > 0 && (
          <span className="absolute top-0 right-4 sm:right-6 px-1.5 py-0.2 text-[9px] font-bold bg-yellow-400 text-black rounded-full">
            {patientsCount}
          </span>
        )}
      </button>

      {/* 2. Prontuário */}
      <button
        type="button"
        onClick={() => setActiveTab('novo_prontuario')}
        className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'novo_prontuario'
            ? 'text-yellow-400 font-bold'
            : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <FileText className="w-5 h-5" />
        <span className="text-[11px] mt-0.5">Prontuário</span>
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

      {/* 4. Menu do Aplicativo */}
      <button
        type="button"
        onClick={onOpenAppMenu}
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-zinc-400 hover:text-yellow-400 transition-all cursor-pointer"
        title="Abrir Menu Vitale"
      >
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <span className="text-[11px] mt-0.5">Menu</span>
      </button>
    </nav>
  );
};
