import React, { useState } from 'react';
import { UserCheck, X, Check } from 'lucide-react';
import { ProfessionalProfile } from '../types';

interface ProfessionalSettingsModalProps {
  isOpen: boolean;
  profile: ProfessionalProfile;
  onClose: () => void;
  onSave: (updated: ProfessionalProfile) => void;
}

export const ProfessionalSettingsModal: React.FC<ProfessionalSettingsModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ProfessionalProfile>({ ...profile });

  React.useEffect(() => {
    if (isOpen) {
      setFormData({ ...profile });
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-white">
                Dados da Profissional Vitale
              </h2>
              <p className="text-xs text-zinc-400">
                Informações de conselho de classe emitidas nos prontuários e no TCLE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              Nome Completo da Profissional *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                Conselho de Classe *
              </label>
              <select
                value={formData.councilType}
                onChange={(e) => setFormData({ ...formData, councilType: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
              >
                <option value="COFEN">COFEN (Enfermagem)</option>
                <option value="CRBM">CRBM (Biomedicina)</option>
                <option value="CREFITO">CREFITO (Fisioterapia)</option>
                <option value="CRF">CRF (Farmácia)</option>
                <option value="CRM">CRM (Medicina)</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                Nº de Registro *
              </label>
              <input
                type="text"
                required
                value={formData.councilNumber}
                onChange={(e) => setFormData({ ...formData, councilNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                UF do Conselho
              </label>
              <input
                type="text"
                required
                maxLength={2}
                value={formData.councilState}
                onChange={(e) => setFormData({ ...formData, councilState: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono uppercase text-center focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              Especialidade / Título Profissional
            </label>
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">
              Nome da Marca / Clínica Home Care
            </label>
            <input
              type="text"
              value={formData.clinicOrBrand}
              onChange={(e) => setFormData({ ...formData, clinicOrBrand: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                Telefone / WhatsApp Comercial
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                E-mail para Notificações
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 text-black font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-yellow-950/40 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvar Dados</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
