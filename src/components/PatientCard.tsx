import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, 
  MapPin, 
  Phone, 
  FileText, 
  Edit3, 
  Trash2, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Clock
} from 'lucide-react';
import { Patient, Prontuario } from '../types';

interface PatientCardProps {
  patient: Patient;
  latestProntuario?: Prontuario;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
  onStartProntuario: (patient: Patient) => void;
  onViewHistory: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  latestProntuario,
  onEdit,
  onDelete,
  onStartProntuario,
  onViewHistory,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rawPhone = patient.phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${rawPhone}?text=${encodeURIComponent(
    `Olá ${patient.name}, tudo bem? Aqui é da Vitale Home Care! Confirmando nosso atendimento domiciliar.`
  )}`;

  const fullAddress = `${patient.address.street}, ${patient.address.number}, ${patient.address.neighborhood}, ${patient.address.city} - ${patient.address.state}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const getStatusBadge = (status: Patient['status']) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ativo</span>;
      case 'em_atendimento':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">Hoje</span>;
      case 'retorno_pendente':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">Retorno Pendente</span>;
      case 'arquivado':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">Arquivado</span>;
    }
  };

  return (
    <div className="bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 rounded-3xl p-4 sm:p-5 transition-all shadow-md hover:shadow-xl hover:shadow-yellow-950/20 flex flex-col justify-between relative group">
      <div>
        {/* Header of the Card */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white truncate">
                {patient.name}
              </h3>
              {getStatusBadge(patient.status)}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
              <span>CPF: <span className="font-mono text-zinc-300">{patient.cpf}</span></span>
              <span>•</span>
              <span>{patient.age} anos</span>
              {patient.gender && (
                <>
                  <span>•</span>
                  <span>{patient.gender}</span>
                </>
              )}
            </div>
          </div>

          {/* Context Menu (3 Pontos ⋮) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-zinc-400 hover:text-yellow-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Opções do Paciente"
              title="Menu de Contexto"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 w-48 bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl py-1.5 z-30 animate-in fade-in duration-100">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(patient);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-900 hover:text-yellow-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-yellow-400" />
                  <span>Alterar Dados</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onStartProntuario(patient);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-900 hover:text-yellow-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Novo Prontuário</span>
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onViewHistory(patient);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-900 hover:text-yellow-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>Ver Histórico</span>
                </button>

                <div className="my-1 border-t border-zinc-800" />

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(patient);
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs font-medium text-red-400 hover:bg-red-950/40 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Excluir Ficha</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Address & Home Care info */}
        <div className="bg-black/60 rounded-2xl p-3 border border-zinc-800/80 mb-3 space-y-2 text-xs">
          <div className="flex items-start gap-2 text-zinc-300">
            <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-yellow-300 bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/30">
                  Bairro: {patient.address.neighborhood}
                </span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-zinc-400 hover:text-yellow-300 hover:underline flex items-center gap-0.5"
                  title="Abrir no Google Maps"
                >
                  <span>Ver Rota</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-zinc-300 mt-1 leading-relaxed">
                {patient.address.street}, {patient.address.number}
                {patient.address.complement ? ` - ${patient.address.complement}` : ''}
              </p>
              {patient.address.referencePoint && (
                <p className="text-zinc-500 text-[11px] italic mt-0.5">
                  Ref: {patient.address.referencePoint}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-mono text-zinc-300">{patient.phone}</span>
            </div>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Latest Clinical Record Snippet */}
        {latestProntuario ? (
          <div className="bg-black/40 rounded-xl p-2.5 border border-zinc-800 text-xs mb-3">
            <div className="flex items-center justify-between text-zinc-400 mb-1">
              <span className="flex items-center gap-1 text-[11px] text-yellow-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Prontuário Vitale Selado
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {new Date(latestProntuario.date).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <p className="text-zinc-300 line-clamp-1">
              {latestProntuario.etapa5.productsUsed.map((p) => p.productName).join(', ') || 'Procedimentos realizados'}
            </p>
          </div>
        ) : (
          <div className="bg-black/20 rounded-xl p-2.5 border border-dashed border-zinc-800 text-xs text-zinc-500 mb-3 flex items-center justify-between">
            <span>Nenhum prontuário registrado</span>
            <span className="text-[10px] text-yellow-400 font-medium">Apto para anamnese</span>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="pt-2 flex items-center gap-2">
        <button
          onClick={() => onStartProntuario(patient)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-yellow-950/50 transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Iniciar Atendimento</span>
        </button>

        <button
          onClick={() => onViewHistory(patient)}
          className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          title="Ver histórico de prontuários"
        >
          <span>Ficha</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
