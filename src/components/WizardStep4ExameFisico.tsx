import React from 'react';
import { Eye, Layers, Compass, CheckCircle2 } from 'lucide-react';
import { Prontuario } from '../types';

interface Step4Props {
  data: Prontuario['etapa4'];
  onChange: (updated: Prontuario['etapa4']) => void;
  errors?: Record<string, string>;
}

const FITZPATRICK_DATA = [
  {
    type: 'I',
    colorHex: '#fae7db',
    label: 'Fototipo I - Muito Clara',
    desc: 'Queima sempre com muita facilidade, nunca bronzeia. Pele extremamente sensível.',
  },
  {
    type: 'II',
    colorHex: '#f3d2be',
    label: 'Fototipo II - Clara',
    desc: 'Queima com facilidade, bronzeia muito pouco ou raramente. Olhos e cabelos claros.',
  },
  {
    type: 'III',
    colorHex: '#e1b899',
    label: 'Fototipo III - Morena Clara',
    desc: 'Queima moderadamente, bronzeia gradualmente (Tom frequente no Brasil).',
  },
  {
    type: 'IV',
    colorHex: '#be8c63',
    label: 'Fototipo IV - Morena Moderada',
    desc: 'Queima pouco, bronzeia com facilidade. Propensão a hipercromias pós-inflamatórias.',
  },
  {
    type: 'V',
    colorHex: '#8c5836',
    label: 'Fototipo V - Morena Escura',
    desc: 'Raramente queima, bronzeia intensamente. Alta densidade de melanina tecidual.',
  },
  {
    type: 'VI',
    colorHex: '#4a2c1d',
    label: 'Fototipo VI - Pele Negra',
    desc: 'Nunca queima, profundamente pigmentada. Risco elevado de manchas por calor/tração.',
  },
];

const GLOGAU_DATA = [
  {
    type: 'I',
    title: 'Glogau I (Inicial - 20 a 30 anos)',
    desc: 'Fotoenvelhecimento precoce, sem ceratoses, rugas mínimas dinâmicas.',
  },
  {
    type: 'II',
    title: 'Glogau II (Em formação - 30 a 40 anos)',
    desc: 'Fotoenvelhecimento moderado, linhas de expressão dinâmicas em olhos e boca.',
  },
  {
    type: 'III',
    title: 'Glogau III (Avançado - 50 a 60 anos)',
    desc: 'Rugas estáticas visíveis mesmo em repouso facial, discromias solares evidentes.',
  },
  {
    type: 'IV',
    title: 'Glogau IV (Severo - 60+ anos)',
    desc: 'Rugas profundas por toda a face em repouso, flacidez dérmica avançada.',
  },
];

export const WizardStep4ExameFisico: React.FC<Step4Props> = ({
  data,
  onChange,
  errors = {},
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header banner */}
      <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-yellow-500/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-white">
              Etapa 4: Exame Físico & Biotipo Cutâneo Vitale
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              Classificação diagnóstica da pele: Fototipo de Fitzpatrick, fotoenvelhecimento de Glogau, biotipo e turgor.
            </p>
          </div>
        </div>
      </div>

      {/* Escala de Fitzpatrick */}
      <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-yellow-400" />
            <span>Escala de Fototipo de Fitzpatrick (I a VI) *</span>
          </label>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 font-bold">
            Fototipo {data.fitzpatrickScale}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FITZPATRICK_DATA.map((fitz) => {
            const isSelected = data.fitzpatrickScale === fitz.type;
            return (
              <div
                key={fitz.type}
                onClick={() => onChange({ ...data, fitzpatrickScale: fitz.type as any })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-850 border-yellow-400 ring-2 ring-yellow-400/50 shadow-lg'
                    : 'bg-black border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border border-white/20 shadow-inner"
                        style={{ backgroundColor: fitz.colorHex }}
                      />
                      <span className="font-bold text-xs text-white">
                        Tipo {fitz.type}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-300 font-semibold mb-1">
                    {fitz.label}
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {fitz.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Escala de Glogau */}
      <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800">
        <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-yellow-400" />
          <span>Classificação de Fotoenvelhecimento de Glogau *</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GLOGAU_DATA.map((glogau) => {
            const isSelected = data.glogauScale === glogau.type;
            return (
              <div
                key={glogau.type}
                onClick={() => onChange({ ...data, glogauScale: glogau.type as any })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-850 border-yellow-400 ring-2 ring-yellow-400/50 shadow-lg'
                    : 'bg-black border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-yellow-300">
                    {glogau.title}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-yellow-400 stroke-[2.5]" />}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {glogau.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Biotipo Cutâneo */}
      <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800">
        <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
          Biotipo Cutâneo (Tipo de Pele) *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { id: 'eudermica', label: 'Eudérmica (Normal)', desc: 'Equilibrada, textura suave' },
            { id: 'lipidica', label: 'Lipídica (Oleosa)', desc: 'Brilho excessivo, óstios dilatados' },
            { id: 'alipica', label: 'Alípica (Seca)', desc: 'Opaca, fina, propensa a rugas finas' },
            { id: 'mista', label: 'Mista', desc: 'Zona T lipídica e malares secos' },
            { id: 'sensivel', label: 'Sensível / Reativa', desc: 'Tendência a eritema e rosácea' },
          ].map((bio) => {
            const selected = data.skinBiotype === bio.id;
            return (
              <div
                key={bio.id}
                onClick={() => onChange({ ...data, skinBiotype: bio.id as any })}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  selected
                    ? 'bg-yellow-400/10 border-yellow-400 text-white font-bold'
                    : 'bg-black border-zinc-800 text-zinc-300 hover:bg-zinc-850'
                }`}
              >
                <div>
                  <span className="font-bold text-xs block text-white">{bio.label}</span>
                  <span className="text-[11px] text-zinc-400">{bio.desc}</span>
                </div>
                {selected && <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 ml-2 stroke-[2.5]" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Resumo do Exame Físico */}
      <div>
        <label className="block text-sm font-bold text-white mb-1">
          Resumo do Exame Clínico da Paciente *
        </label>
        <textarea
          rows={3}
          value={data.clinicalFindings}
          onChange={(e) => onChange({ ...data, clinicalFindings: e.target.value })}
          placeholder="Ex: Epiderme com bom tônus, mímica acentuada em região frontal e glabelar. Lábios com contorno preservado..."
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
        />
        {errors.clinicalFindings && (
          <p className="text-red-400 text-xs mt-1">{errors.clinicalFindings}</p>
        )}
      </div>
    </div>
  );
};
