import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Prontuario } from '../types';

interface Step2Props {
  data: Prontuario['etapa2'];
  onChange: (updated: Prontuario['etapa2']) => void;
  errors?: Record<string, string>;
}

export const WizardStep2RedFlags: React.FC<Step2Props> = ({
  data,
  onChange,
  errors = {},
}) => {
  const handlePregnantToggle = (val: boolean) => {
    onChange({
      ...data,
      isPregnantOrLactating: val,
      clinicalRiskLevel: val ? 'alto_red_flag' : data.clinicalRiskLevel,
    });
  };

  const commonAllergies = ['Lidocaína', 'Látex', 'Dipirona', 'Anti-inflamatórios (AINEs)', 'Iodo', 'Penicilina / Amoxicilina', 'Cosméticos / Perfumes'];

  const toggleAllergy = (allergy: string) => {
    const list = [...data.allergies.list];
    const exists = list.includes(allergy);
    const updated = exists ? list.filter((a) => a !== allergy) : [...list, allergy];
    onChange({
      ...data,
      allergies: {
        has: updated.length > 0,
        list: updated,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Red Flag Critical Header Banner */}
      <div className="bg-gradient-to-r from-red-950/70 via-zinc-900 to-black rounded-2xl p-4 sm:p-5 border border-red-600/40 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-heading font-bold text-white">
                Etapa 2: Histórico Clínico & Red Flags (Contraindicações)
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full">
                Segurança Vitale
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1">
              Rigor clínico: triagem de condições que contraindicam ou exigem precauções estritas antes de injetáveis home care.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Gestante / Lactante - RED FLAG CRÍTICO */}
      <div className={`p-4 rounded-2xl border transition-all ${
        data.isPregnantOrLactating 
          ? 'bg-red-950/60 border-red-500 shadow-lg ring-1 ring-red-500' 
          : 'bg-zinc-900/80 border-zinc-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                1. Paciente está Gestante ou em Período de Amamentação (Lactante)?
              </span>
              <span className="text-[10px] uppercase font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                Contraindicação Absoluta
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Toxina botulínica e a maioria dos injetáveis e anestésicos são contraindicados pelo risco teratogênico / excreção no leite.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => handlePregnantToggle(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                !data.isPregnantOrLactating
                  ? 'bg-emerald-500 text-black shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Não (Apto)
            </button>
            <button
              type="button"
              onClick={() => handlePregnantToggle(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                data.isPregnantOrLactating
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Sim (Red Flag)
            </button>
          </div>
        </div>

        {data.isPregnantOrLactating && (
          <div className="mt-3 p-3 rounded-xl bg-red-900/40 border border-red-600/60 text-xs text-red-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>
              <strong>ALERTA CRÍTICO:</strong> Procedimento estético injetável não recomendado. O prontuário sinalizará impedimento legal e ético.
            </span>
          </div>
        )}
      </div>

      {/* 2. Doenças Autoimunes */}
      <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-sm text-white">
              2. Doenças Autoimunes em Atividade ou Tratamento Biológico?
            </span>
            <p className="text-xs text-zinc-400 mt-0.5">
              Lúpus Eritematoso, Tireoidite de Hashimoto ativa, Esclerodermia, Psoríase extensa, Artrite Reumatoide.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => onChange({ ...data, autoimmuneDiseases: { has: false, details: '' } })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                !data.autoimmuneDiseases.has
                  ? 'bg-emerald-500 text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...data, autoimmuneDiseases: { has: true, details: data.autoimmuneDiseases.details || '' } })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                data.autoimmuneDiseases.has
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              Sim
            </button>
          </div>
        </div>

        {data.autoimmuneDiseases.has && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Especifique a doença e medicamentos em uso"
              value={data.autoimmuneDiseases.details || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  autoimmuneDiseases: { has: true, details: e.target.value },
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
            />
          </div>
        )}
      </div>

      {/* 3. Herpes Labial / Facial */}
      <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <span className="font-bold text-sm text-white block mb-1">
          3. Histórico de Herpes Simplex e Lesão Atual
        </span>
        <p className="text-xs text-zinc-400 mb-3">
          Fundamental para preenchimento labial (risco de reativação herpética).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black border border-zinc-800 cursor-pointer">
            <input
              type="checkbox"
              checked={data.activeHerpes.hasHistory}
              onChange={(e) =>
                onChange({
                  ...data,
                  activeHerpes: { ...data.activeHerpes, hasHistory: e.target.checked },
                })
              }
              className="rounded text-yellow-400 focus:ring-0"
            />
            <span className="text-xs text-zinc-200">Possui histórico prévio</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black border border-zinc-800 cursor-pointer">
            <input
              type="checkbox"
              checked={data.activeHerpes.isActiveNow}
              onChange={(e) =>
                onChange({
                  ...data,
                  activeHerpes: { ...data.activeHerpes, isActiveNow: e.target.checked },
                })
              }
              className="rounded text-red-500 focus:ring-0"
            />
            <span className={`text-xs ${data.activeHerpes.isActiveNow ? 'text-red-400 font-bold' : 'text-zinc-200'}`}>
              Lesão ativa no momento
            </span>
          </label>

          <label className="flex items-center gap-2 p-2.5 rounded-xl bg-black border border-zinc-800 cursor-pointer">
            <input
              type="checkbox"
              checked={data.activeHerpes.prophylacticAntiviralTaken}
              onChange={(e) =>
                onChange({
                  ...data,
                  activeHerpes: { ...data.activeHerpes, prophylacticAntiviralTaken: e.target.checked },
                })
              }
              className="rounded text-emerald-400 focus:ring-0"
            />
            <span className="text-xs text-emerald-400 font-medium">Profilaxia antiviral feita</span>
          </label>
        </div>
      </div>

      {/* 4. Alergias Conhecidas */}
      <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-sm text-white">
            4. Alergias Conhecidas (Anestésicos, Látex, Medicamentos)
          </span>
          <span className="text-xs text-yellow-400 font-medium">
            {data.allergies.list.length > 0 ? `${data.allergies.list.length} selecionada(s)` : 'Nenhuma'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {commonAllergies.map((allergy) => {
            const selected = data.allergies.list.includes(allergy);
            return (
              <button
                type="button"
                key={allergy}
                onClick={() => toggleAllergy(allergy)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selected
                    ? 'bg-yellow-400 text-black ring-2 ring-yellow-300'
                    : 'bg-black text-zinc-300 border border-zinc-800 hover:bg-zinc-850'
                }`}
              >
                {selected ? '✓ ' : ''}{allergy}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Implantes e Queloides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.anticoagulantsOrAAS}
            onChange={(e) => onChange({ ...data, anticoagulantsOrAAS: e.target.checked })}
            className="rounded text-yellow-400 mt-0.5 focus:ring-0"
          />
          <div>
            <span className="text-xs font-bold text-zinc-200 block">
              Uso de Anticoagulantes / AAS / Ginkgo Biloba
            </span>
            <span className="text-[11px] text-zinc-400">
              Risco aumentado de equimoses e hematomas volumosos.
            </span>
          </div>
        </label>

        <label className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer ${
          data.permanentImplants.hasPMMA ? 'bg-red-950/40 border-red-500/80' : 'bg-zinc-900/80 border-zinc-800'
        }`}>
          <input
            type="checkbox"
            checked={data.permanentImplants.hasPMMA}
            onChange={(e) =>
              onChange({
                ...data,
                permanentImplants: { ...data.permanentImplants, hasPMMA: e.target.checked },
              })
            }
            className="rounded text-red-500 mt-0.5 focus:ring-0"
          />
          <div>
            <span className="text-xs font-bold text-white block">
              Presença de Implantes Definitivos (PMMA / Silicone)
            </span>
            <span className="text-[11px] text-zinc-400">
              Contraindicação para injeção de ácido hialurônico no mesmo plano anatômico.
            </span>
          </div>
        </label>
      </div>

      {/* Classificação do Risco Clínico Global */}
      <div className="bg-black rounded-2xl p-4 border border-zinc-800">
        <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
          Classificação do Risco Clínico Global da Sessão
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled={data.isPregnantOrLactating}
            onClick={() => onChange({ ...data, clinicalRiskLevel: 'baixo' })}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              data.clinicalRiskLevel === 'baixo'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Baixo Risco</span>
          </button>

          <button
            type="button"
            disabled={data.isPregnantOrLactating}
            onClick={() => onChange({ ...data, clinicalRiskLevel: 'moderado' })}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              data.clinicalRiskLevel === 'moderado'
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Moderado</span>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...data, clinicalRiskLevel: 'alto_red_flag' })}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              data.clinicalRiskLevel === 'alto_red_flag'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Alto / Red Flag</span>
          </button>
        </div>
      </div>
    </div>
  );
};
