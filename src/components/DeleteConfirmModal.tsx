import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Patient } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  patient,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !patient) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-heading font-bold text-white mb-2">
          Excluir Ficha de Paciente?
        </h3>

        <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
          Tem certeza de que deseja excluir permanentemente a ficha de{' '}
          <strong className="text-white font-bold">{patient.name}</strong> (CPF: {patient.cpf})?
        </p>

        <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 text-xs text-red-300 mb-5">
          Aviso legal: O registro será arquivado do banco de dados local da aplicação e uma entrada no Journal WAL registrará a exclusão para fins de conformidade.
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-850 text-sm font-medium transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-950/50 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, Excluir Ficha</span>
          </button>
        </div>
      </div>
    </div>
  );
};
