import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
import { ProfessionalProfile } from '../types';

interface AppLockModalProps {
  isLocked: boolean;
  professional: ProfessionalProfile;
  onUnlock: (pin: string) => boolean;
}

export const AppLockModal: React.FC<AppLockModalProps> = ({
  isLocked,
  professional,
  onUnlock,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);

  if (!isLocked) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(pinInput);
    if (!success) {
      setError(true);
      setPinInput('');
    } else {
      setError(false);
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none">
      <div className="bg-zinc-950 border border-yellow-500/40 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl shadow-yellow-950/50 space-y-6 text-center animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-yellow-400 via-amber-400 to-yellow-300 flex items-center justify-center mx-auto text-black shadow-xl shadow-yellow-950/60 ring-4 ring-yellow-400/20">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-400">
            Segurança & Proteção de Dados Clínicos
          </span>
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
            Aplicativo Bloqueado
          </h2>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Área restrita de atendimento domiciliar de <strong className="text-white">{professional.name}</strong> ({professional.councilType} {professional.councilNumber}). Digite sua senha PIN para desbloquear.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={6}
              autoFocus
              placeholder="Digite o PIN de Segurança (ex: 1234)"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setError(false);
              }}
              className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 flex items-center justify-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>PIN incorreto. (Padrão inicial: 1234)</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 text-black font-extrabold rounded-2xl text-sm shadow-xl shadow-yellow-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            <span>Desbloquear Prontuários</span>
          </button>
        </form>

        <div className="pt-3 border-t border-zinc-900 text-[10px] text-zinc-500 flex items-center justify-center gap-2">
          <span>Proteção contra vazamento de dados de pacientes • LGPD</span>
        </div>
      </div>
    </div>
  );
};
