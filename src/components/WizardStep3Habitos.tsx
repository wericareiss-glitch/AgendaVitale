import React from 'react';
import { Sun, Droplets, Flame, Shield, Heart } from 'lucide-react';
import { Prontuario } from '../types';

interface Step3Props {
  data: Prontuario['etapa3'];
  onChange: (updated: Prontuario['etapa3']) => void;
  errors?: Record<string, string>;
}

export const WizardStep3Habitos: React.FC<Step3Props> = ({
  data,
  onChange,
  errors = {},
}) => {
  const commonSkincare = [
    'Gel de limpeza específico',
    'Vitamina C tópica matinal',
    'Sérum de Ácido Hialurônico',
    'Creme reparador de barreira',
    'Ácidos noturnos (Retinóides / Glicólico)',
    'Antioxidantes orais',
    'Niacinamida',
  ];

  const toggleSkincare = (item: string) => {
    const list = [...data.skincareRoutine];
    const exists = list.includes(item);
    const updated = exists ? list.filter((i) => i !== item) : [...list, item];
    onChange({ ...data, skincareRoutine: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header banner */}
      <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-yellow-500/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-white">
              Etapa 3: Hábitos de Vida & Rotina de Cuidados Vitale
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              Avaliação do comportamento diário, hidratação hídrica, fotoexposição e rotinas cosméticas que influenciam na durabilidade dos procedimentos.
            </p>
          </div>
        </div>
      </div>

      {/* Protetor Solar e Fotoproteção */}
      <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
          <Shield className="w-4 h-4" />
          <span>Fotoproteção & Protetor Solar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Frequência de Uso do Protetor Solar
            </label>
            <select
              value={data.sunscreenUsage}
              onChange={(e) => onChange({ ...data, sunscreenUsage: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
            >
              <option value="diario_com_reaplicacao">Diário com reaplicação regular (Ideal)</option>
              <option value="diario_sem_reaplicacao">Diário pela manhã (Sem reaplicar)</option>
              <option value="esporadico">Esporádico (Apenas em dias de sol)</option>
              <option value="nunca">Não utiliza regularmente</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Fator de Proteção Solar (FPS) Habitual
            </label>
            <div className="flex gap-2">
              {[30, 50, 60, 70, 99].map((fps) => (
                <button
                  type="button"
                  key={fps}
                  onClick={() => onChange({ ...data, sunscreenFps: fps })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    data.sunscreenFps === fps
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'bg-black text-zinc-400 border border-zinc-800 hover:bg-zinc-850'
                  }`}
                >
                  FPS {fps}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consumo Diário de Água & Hidratação */}
      <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
            <Droplets className="w-4 h-4 text-yellow-400" />
            <span>Ingestão Hídrica Diária (Água)</span>
          </div>
          <span className="font-heading font-extrabold text-lg text-yellow-400 bg-black px-3.5 py-1 rounded-xl border border-yellow-500/40 font-mono">
            {data.dailyWaterIntake.toFixed(1)} Litros / dia
          </span>
        </div>

        <p className="text-xs text-zinc-400 mb-4">
          A hidratação tecidual é determinante para a captação e acomodação de moléculas de ácido hialurônico e neoformação de colágeno.
        </p>

        <div className="space-y-3">
          <input
            type="range"
            min="0.5"
            max="5.0"
            step="0.1"
            value={data.dailyWaterIntake}
            onChange={(e) => onChange({ ...data, dailyWaterIntake: parseFloat(e.target.value) })}
            className="w-full accent-yellow-400 cursor-pointer h-2 bg-black rounded-lg"
          />

          <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>0.5 L (Crítico)</span>
            <span className="text-yellow-400 font-bold">2.0 L (Recomendado)</span>
            <span>3.5 L (Excelente)</span>
            <span>5.0 L</span>
          </div>
        </div>
      </div>

      {/* Skincare Atual */}
      <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800">
        <label className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
          Rotina Domiciliar de Skincare Atual
        </label>
        <div className="flex flex-wrap gap-2">
          {commonSkincare.map((item) => {
            const selected = data.skincareRoutine.includes(item);
            return (
              <button
                type="button"
                key={item}
                onClick={() => toggleSkincare(item)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selected
                    ? 'bg-yellow-400 text-black shadow-md ring-2 ring-yellow-300'
                    : 'bg-black text-zinc-300 border border-zinc-800 hover:bg-zinc-850'
                }`}
              >
                {selected ? '✓ ' : ''}{item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hábitos de Vida Gerais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Tabagismo */}
        <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
          <label className="block text-xs font-medium text-zinc-300 mb-2 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-yellow-400" />
            <span>Tabagismo</span>
          </label>
          <select
            value={data.smoking}
            onChange={(e) => onChange({ ...data, smoking: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
          >
            <option value="nao_fumante">Não fumante</option>
            <option value="fumante_esporadico">Esporádico / Vape ocasional</option>
            <option value="fumante_diario">Fumante diário (Alerta de vasoconstrição)</option>
          </select>
        </div>

        {/* Consumo Alcoólico */}
        <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
          <label className="block text-xs font-medium text-zinc-300 mb-2 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-yellow-400" />
            <span>Consumo de Bebidas Alcoólicas</span>
          </label>
          <select
            value={data.alcohol}
            onChange={(e) => onChange({ ...data, alcohol: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
          >
            <option value="nao_consome">Não consome</option>
            <option value="social">Consumo social moderado</option>
            <option value="moderado_frequente">Consumo frequente</option>
          </select>
        </div>
      </div>
    </div>
  );
};
