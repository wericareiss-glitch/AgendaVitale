import React from 'react';
import { AlertCircle, Calendar, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { Patient } from '../types';

interface ScheduleAlertBannerProps {
  patients: Patient[];
  onStartProntuario: (patient: Patient) => void;
  onViewAgenda: () => void;
}

export const ScheduleAlertBanner: React.FC<ScheduleAlertBannerProps> = ({
  patients,
  onStartProntuario,
  onViewAgenda,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter patients scheduled for today or overdue
  const scheduledTodayList = patients.filter((p) => {
    if (!p.scheduledDate) return false;
    return p.scheduledDate.startsWith(todayStr);
  });

  const overdueScheduleList = patients.filter((p) => {
    if (!p.scheduledDate) return false;
    const pDate = p.scheduledDate.slice(0, 10);
    return pDate < todayStr && p.status !== 'arquivado';
  });

  if (scheduledTodayList.length === 0 && overdueScheduleList.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Overdue Schedules Alert */}
      {overdueScheduleList.length > 0 && (
        <div className="bg-gradient-to-r from-red-950/80 via-zinc-950 to-zinc-950 border border-red-500/40 rounded-2xl p-4 shadow-lg shadow-red-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-heading font-bold text-red-200">
                  Agendamentos Pendentes / Atrasados ({overdueScheduleList.length})
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                  Requer Ação
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                {overdueScheduleList.map((p) => p.name).join(', ')} possuem data de agendamento anterior a hoje. Verifique na agenda.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onViewAgenda}
              className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Ver na Agenda
            </button>
          </div>
        </div>
      )}

      {/* Scheduled Today Alert */}
      {scheduledTodayList.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-950/70 via-zinc-950 to-zinc-950 border border-yellow-500/40 rounded-2xl p-4 shadow-lg shadow-yellow-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-heading font-bold text-yellow-200">
                  Agendamentos para Hoje ({scheduledTodayList.length})
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-400/20 text-yellow-300 rounded-full border border-yellow-400/30">
                  Hoje
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                Atendimentos agendados para hoje: {scheduledTodayList.map((p) => p.name).join(', ')}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {scheduledTodayList.map((p) => {
              const rawPhone = p.phone.replace(/\D/g, '');
              const waUrl = `https://wa.me/55${rawPhone}?text=${encodeURIComponent(`Olá ${p.name}, tudo bem? Aqui é da Vitale Estética Home Care! Passando para confirmar nosso atendimento domiciliar agendado para hoje.`)}`;
              return (
                <div key={p.id} className="flex items-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <button
                    onClick={() => onStartProntuario(p)}
                    className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
                  >
                    Atender {p.name.split(' ')[0]}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
