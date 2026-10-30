import React, { useState, useEffect, useRef } from 'react';
import { X, User, Phone, MapPin, Calendar, FileText, Check, AlertCircle, History, RotateCcw } from 'lucide-react';
import { Patient } from '../types';
import { patientSchema } from '../schemas/prontuario';

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'synced' | 'syncVersion'> & { id?: string }) => void;
  patientToEdit?: Patient | null;
}

const DRAFT_STORAGE_KEY = 'vitale_patient_form_draft_v1';

const INITIAL_FORM_DATA = {
  name: '',
  cpf: '',
  phone: '',
  birthDate: '1990-01-01',
  age: 36,
  gender: 'Feminino' as 'Feminino' | 'Masculino' | 'Outro',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: 'São Paulo',
  state: 'SP',
  cep: '',
  referencePoint: '',
  status: 'ativo' as Patient['status'],
  notes: '',
};

export const PatientModal: React.FC<PatientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  patientToEdit,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  const [lastAutoSaved, setLastAutoSaved] = useState<Date | null>(null);
  const isInitialMount = useRef(true);

  // Initialize form: Load edit data or restored draft from localStorage
  useEffect(() => {
    if (!isOpen) return;

    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name,
        cpf: patientToEdit.cpf,
        phone: patientToEdit.phone,
        birthDate: patientToEdit.birthDate,
        age: patientToEdit.age,
        gender: patientToEdit.gender || 'Feminino',
        street: patientToEdit.address.street,
        number: patientToEdit.address.number,
        complement: patientToEdit.address.complement || '',
        neighborhood: patientToEdit.address.neighborhood,
        city: patientToEdit.address.city,
        state: patientToEdit.address.state,
        cep: patientToEdit.address.cep,
        referencePoint: patientToEdit.address.referencePoint || '',
        status: patientToEdit.status,
        notes: patientToEdit.notes || '',
      });
      setIsDraftRestored(false);
    } else {
      // Check for saved draft in localStorage
      try {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          const hasMeaningfulContent = Boolean(
            parsed.name?.trim() ||
            parsed.cpf?.trim() ||
            parsed.phone?.trim() ||
            parsed.street?.trim() ||
            parsed.neighborhood?.trim() ||
            parsed.notes?.trim()
          );

          if (hasMeaningfulContent) {
            setFormData({ ...INITIAL_FORM_DATA, ...parsed });
            setIsDraftRestored(true);
            setErrors({});
            return;
          }
        }
      } catch (err) {
        console.warn('Falha ao restaurar rascunho de paciente:', err);
      }

      setFormData(INITIAL_FORM_DATA);
      setIsDraftRestored(false);
    }
    setErrors({});
  }, [patientToEdit, isOpen]);

  // Auto-save draft on form changes (only when creating a new patient)
  useEffect(() => {
    if (!isOpen || patientToEdit) return;

    // Check if form has any meaningful content before saving
    const hasContent = Boolean(
      formData.name.trim() ||
      formData.cpf.trim() ||
      formData.phone.trim() ||
      formData.street.trim() ||
      formData.neighborhood.trim() ||
      formData.notes.trim()
    );

    if (hasContent) {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
        setLastAutoSaved(new Date());
      } catch (err) {
        console.warn('Falha ao salvar rascunho de paciente:', err);
      }
    }
  }, [formData, isOpen, patientToEdit]);

  // Handle discard draft
  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (err) {}
    setFormData(INITIAL_FORM_DATA);
    setIsDraftRestored(false);
    setErrors({});
  };

  // Keyboard shortcut: Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Formatting helpers
  const formatCPF = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9)}`;
  };

  const formatPhone = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  const formatCEP = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    if (raw.length <= 5) return raw;
    return `${raw.slice(0, 5)}-${raw.slice(5)}`;
  };

  const handleBirthDateChange = (dateVal: string) => {
    const birthYear = new Date(dateVal).getFullYear();
    const currentYear = new Date().getFullYear();
    const calculatedAge = Math.max(0, currentYear - birthYear);
    setFormData((prev) => ({
      ...prev,
      birthDate: dateVal,
      age: calculatedAge,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payloadToValidate = {
      name: formData.name.trim(),
      cpf: formData.cpf.trim(),
      phone: formData.phone.trim(),
      birthDate: formData.birthDate,
      address: {
        street: formData.street.trim(),
        number: formData.number.trim(),
        complement: formData.complement.trim() || undefined,
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
        cep: formData.cep.trim(),
        referencePoint: formData.referencePoint.trim() || undefined,
      },
      notes: formData.notes.trim() || undefined,
    };

    const result = patientSchema.safeParse(payloadToValidate);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSave({
      id: patientToEdit?.id,
      name: formData.name.trim(),
      cpf: formData.cpf.trim(),
      phone: formData.phone.trim(),
      birthDate: formData.birthDate,
      age: formData.age,
      gender: formData.gender,
      address: {
        street: formData.street.trim(),
        number: formData.number.trim(),
        complement: formData.complement.trim() || undefined,
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
        cep: formData.cep.trim(),
        referencePoint: formData.referencePoint.trim() || undefined,
      },
      status: formData.status,
      notes: formData.notes.trim() || undefined,
    });

    // Remove draft once patient is successfully saved
    if (!patientToEdit) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (err) {}
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-yellow-950/20 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
                {patientToEdit ? 'Alterar Ficha de Paciente' : 'Novo Cadastro Vitale'}
              </h2>
              <p className="text-xs text-zinc-400">
                Atendimento Domiciliar Home Care • Armazenamento Local Seguro
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-850 transition-colors cursor-pointer"
            title="Fechar (seu rascunho permanecerá salvo)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Draft Restored Banner */}
          {isDraftRestored && !patientToEdit && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs text-yellow-300 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <History className="w-4 h-4 text-yellow-400 shrink-0" />
                <p className="truncate">
                  <span className="font-bold text-yellow-400">Rascunho recuperado:</span> Seus dados não salvos foram restaurados automaticamente.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="text-[11px] text-zinc-400 hover:text-yellow-400 underline cursor-pointer shrink-0 transition-colors"
              >
                Descartar rascunho
              </button>
            </div>
          )}

          {/* Dados Pessoais */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5 mb-3">
              <User className="w-3.5 h-3.5" />
              <span>Identificação da Paciente</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-medium mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Ferreira dos Santos"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  required
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
                {errors.cpf && <p className="text-red-400 text-xs mt-1">{errors.cpf}</p>}
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Telefone / WhatsApp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="(11) 98765-4321"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Data de Nascimento *
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => handleBirthDateChange(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
                  />
                  <span className="text-xs bg-zinc-900 px-3 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 whitespace-nowrap">
                    {formData.age} anos
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Gênero
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
                >
                  <option value="Feminino">Feminino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Endereço Home Care */}
          <div className="pt-2 border-t border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5 mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>Endereço de Atendimento Home Care</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  CEP *
                </label>
                <input
                  type="text"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) => setFormData({ ...formData, cep: formatCEP(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-medium mb-1">
                  Bairro (Destaque da Rota) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Moema, Jardins, Brooklin, Vila Madalena"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm font-medium focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-medium mb-1">
                  Rua / Logradouro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rua Oscar Freire"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Número *
                </label>
                <input
                  type="text"
                  required
                  placeholder="120"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-medium mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  placeholder="Apto 42, Bloco B"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">
                  Cidade / UF *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
                  />
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    className="w-14 text-center px-2 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-sm uppercase focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-zinc-300 font-medium mb-1">
                  Ponto de Referência / Portaria
                </label>
                <input
                  type="text"
                  placeholder="Ex: Interfone 42, estacionamento de visitante disponível na portaria"
                  value={formData.referencePoint}
                  onChange={(e) => setFormData({ ...formData, referencePoint: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>

          {/* Status e Observações */}
          <div className="pt-2 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                Status da Ficha
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value="ativo">Ativo (Atendimentos regulares)</option>
                <option value="em_atendimento">Em Atendimento Hoje</option>
                <option value="retorno_pendente">Retorno Pendente</option>
                <option value="arquivado">Arquivado</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">
                Notas Rápidas
              </label>
              <input
                type="text"
                placeholder="Preferências, histórico relevante..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Auto-save status feedback */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="hidden sm:inline">Salvamento automático de rascunho ativo</span>
              <span className="sm:hidden">Auto-save de rascunho ativo</span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 text-black text-sm font-bold shadow-lg shadow-yellow-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>{patientToEdit ? 'Salvar Alterações' : 'Cadastrar Paciente'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
