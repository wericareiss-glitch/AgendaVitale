import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Search, 
  Layers, 
  Filter 
} from 'lucide-react';
import { Prontuario } from '../types';

interface Step1Props {
  data: Prontuario['etapa1'];
  onChange: (updated: Prontuario['etapa1']) => void;
  errors?: Record<string, string>;
}

export interface ClinicalCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  complaints: string[];
}

export const CLINICAL_PROCEDURES_CATEGORIES: ClinicalCategory[] = [
  {
    id: 'peeling',
    name: 'Peeling',
    icon: '🧪',
    description: 'Renovação celular, despigmentação e afinamento da camada córnea',
    complaints: [
      'Melasma facial e hipercromias pós-inflamatórias',
      'Manchas senis / solares e fotoenvelhecimento dérmico',
      'Queratose, textura áspera e irregular da pele',
      'Opacidade cutânea e falta de viço / glow facial',
      'Linhas finas superficiais e uniformização do tom',
      'Controle de queratinização e excesso de descamação'
    ],
  },
  {
    id: 'microagulhamento',
    name: 'Microagulhamento',
    icon: '🪡',
    description: 'Indução percutânea de colágeno (IPC) e infusão drug delivery',
    complaints: [
      'Cicatrizes atróficas de acne (Drug Delivery regenerador)',
      'Poros dilatados e rugosidades na textura da pele',
      'Estrias corporais brancas e violáceas',
      'Alopécia e eflúvio telógeno (estimulação do folículo capilar)',
      'Flacidez dérmica inicial e estímulo de neocolagênese',
      'Linhas finas periorais (código de barras) e periorbitais'
    ],
  },
  {
    id: 'limpeza_pele',
    name: 'Limpeza de Pele',
    icon: '🫧',
    description: 'Higienização profunda, desobstrução folicular e controle lipídico',
    complaints: [
      'Comedões abertos e fechados (cravos pretos e brancos)',
      'Míliuns e pápulas de retenção queratinosa',
      'Excesso de sebo, oleosidade e brilho na Zona T',
      'Pele asfixiada e sobrecarregada por poluição urbana',
      'Poros obstruídos e preparo para outros procedimentos',
      'Foliculite ou cravos em costas / colo (corporal)'
    ],
  },
  {
    id: 'enzimas_lipolitica',
    name: 'Enzimas Lipolíticas',
    icon: '⚡',
    description: 'Intradermoterapia / mesoterapia lipolítica para gordura localizada',
    complaints: [
      'Gordura submentoniana localizada (Papada facial)',
      'Gordura abdominal localizada (infra e supra-umbilical)',
      'Gordura em flancos e dorso posterior (linha do sutiã)',
      'Gordura em culotes e prega infraglútea (bananinha)',
      'Gordura pré-axilar e gordura localizada nos braços',
      'Celulite inflamatória e fibroedema gelóide (PEFE)'
    ],
  },
  {
    id: 'vitaminas_injetaveis',
    name: 'Vitaminas Injetáveis',
    icon: '💉',
    description: 'Suplementação intramuscular e subcutânea de micronutrientes',
    complaints: [
      'Queda capilar acentuada e unhas quebradiças (Biotina)',
      'Fadiga crônica, exaustão física e desânimo (B12 / Complexo B)',
      'Baixa resistência imunológica e lentidão na recuperação física',
      'Estímulo de síntese de colágeno sistêmico e antioxidantes',
      'Aceleração metabólica e suporte a emagrecimento assistido',
      'Fadiga muscular e lentidão na recuperação pós-treino'
    ],
  },
  {
    id: 'soroterapia',
    name: 'Soroterapia',
    icon: '💧',
    description: 'Terapia de infusão endovenosa para desintoxicação e bioestimulação',
    complaints: [
      'Desidratação celular profunda e esgotamento fisiológico',
      'Estresse oxidativo e inflamação celular (Detox Endovenoso)',
      'Baixa imunidade recorrente e estresse crônico (Protocolo Immunity)',
      'Fadiga mental, névoa cognitiva e síndrome de Burnout',
      'Protocolo Anti-Aging com Vitamina C em megadose e antioxidantes',
      'Recuperação metabólica, reidratação eletrolítica e jet lag'
    ],
  },
  {
    id: 'drenagem',
    name: 'Drenagem',
    icon: '🤲',
    description: 'Estímulo manual do sistema linfático e alívio do edema intersticial',
    complaints: [
      'Retenção de líquidos e edema em tornozelos e pernas',
      'Inchaço facial matinal e bolsas linfáticas perioculares',
      'Sensação de peso, cansaço e estase venolinfática nas pernas',
      'Recuperação de edema pós-procedimento estético home care',
      'Desintoxicação corporal e retenção hídrica pré-menstrual',
      'Edema corporal geral com necessidade de alívio e bem-estar'
    ],
  },
  {
    id: 'vitaminas_manipulavel',
    name: 'Vitaminas Manipuláveis',
    icon: '💊',
    description: 'Prescrição nutracêutica oral personalizada para suporte estético contínuo',
    complaints: [
      'Suporte nutracêutico oral contínuo para fortalecimento capilar e unhas',
      'Silício orgânico e colágeno hidrolisado para firmeza dérmica',
      'Fotoproteção oral e coadjuvante no clareamento de manchas (Polypodium)',
      'Antioxidantes orais (Coenzima Q10, Resveratrol e Vitamina C/E)',
      'Modulação oral de oleosidade e acne (Zinco Quelato + Niacinamida)',
      'Manutenção preventiva contra radicais livres e envelhecimento precoce'
    ],
  },
];

export const WizardStep1Queixa: React.FC<Step1Props> = ({
  data,
  onChange,
  errors = {},
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [customComplaintInput, setCustomComplaintInput] = useState<string>('');

  const [newProcedureName, setNewProcedureName] = useState('');
  const [newProcedureDate, setNewProcedureDate] = useState('');
  const [newProcedureComp, setNewProcedureComp] = useState('');

  const toggleComplaint = (complaint: string) => {
    const current = [...data.mainComplaints];
    const exists = current.includes(complaint);
    const updated = exists
      ? current.filter((c) => c !== complaint)
      : [...current, complaint];

    onChange({
      ...data,
      mainComplaints: updated,
    });
  };

  const handleAddCustomComplaint = () => {
    if (!customComplaintInput.trim()) return;
    const trimmed = customComplaintInput.trim();
    if (!data.mainComplaints.includes(trimmed)) {
      onChange({
        ...data,
        mainComplaints: [...data.mainComplaints, trimmed],
      });
    }
    setCustomComplaintInput('');
  };

  const handleAddPreviousProcedure = () => {
    if (!newProcedureName.trim()) return;
    const item = {
      name: newProcedureName.trim(),
      dateApprox: newProcedureDate.trim() || undefined,
      complications: newProcedureComp.trim() || 'Nenhuma complicação relatada',
    };
    onChange({
      ...data,
      previousProcedures: [...data.previousProcedures, item],
    });
    setNewProcedureName('');
    setNewProcedureDate('');
    setNewProcedureComp('');
  };

  const handleRemovePreviousProcedure = (index: number) => {
    const updated = data.previousProcedures.filter((_, i) => i !== index);
    onChange({
      ...data,
      previousProcedures: updated,
    });
  };

  // Filter categories and complaints
  const displayedCategories = CLINICAL_PROCEDURES_CATEGORIES.filter((cat) => {
    if (activeCategory === 'todos') return true;
    return cat.id === activeCategory;
  });

  return (
    <div className="space-y-7 animate-in fade-in duration-150">
      {/* Intro Box: Clinical Scope Vitale */}
      <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-yellow-500/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-heading font-bold text-white">
                Etapa 1: Triagem & Queixa Principal por Procedimento
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-yellow-400/10 text-yellow-300 text-[10px] font-bold border border-yellow-400/30">
                8 Procedimentos Especializados
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              A clínica atua exclusivamente com <strong className="text-yellow-300">Peeling, Microagulhamento, Limpeza de Pele, Enzimas Lipolíticas, Vitaminas Injetáveis, Soroterapia, Drenagem</strong> e <strong className="text-yellow-300">Vitaminas Manipuláveis</strong>. Selecione as queixas correspondentes ao plano de tratamento da paciente.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Complaints Summary Badge Box */}
      {data.mainComplaints.length > 0 && (
        <div className="bg-zinc-950 p-3.5 sm:p-4 rounded-2xl border border-yellow-400/30 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-yellow-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Queixas Selecionadas para o Atendimento ({data.mainComplaints.length}):
            </span>
            <button
              type="button"
              onClick={() => onChange({ ...data, mainComplaints: [] })}
              className="text-[11px] text-zinc-400 hover:text-red-400 underline cursor-pointer"
            >
              Limpar todas
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {data.mainComplaints.map((c) => (
              <span
                key={c}
                onClick={() => toggleComplaint(c)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-yellow-400 text-black hover:bg-yellow-300 transition-colors cursor-pointer"
                title="Clique para remover"
              >
                <span>{c}</span>
                <span className="text-black/60 font-bold ml-0.5">×</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Procedure Filter Pills (The 8 Clinical Pillars) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-yellow-400" />
            <span>Filtrar por Procedimento da Clínica</span>
          </label>

          {/* Quick Search inside complaints */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar queixa..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-yellow-400 w-full sm:w-48"
            />
          </div>
        </div>

        {/* Scrollable Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveCategory('todos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeCategory === 'todos'
                ? 'bg-yellow-400 text-black shadow-md shadow-yellow-950/40 ring-1 ring-yellow-300'
                : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850 border border-zinc-800'
            }`}
          >
            Todos os 8 Procedimentos
          </button>

          {CLINICAL_PROCEDURES_CATEGORIES.map((cat) => {
            const isCatActive = activeCategory === cat.id;
            const countInCat = cat.complaints.filter((c) => data.mainComplaints.includes(c)).length;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCatActive
                    ? 'bg-yellow-400 text-black font-bold shadow-md ring-1 ring-yellow-300'
                    : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-850 border border-zinc-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {countInCat > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isCatActive ? 'bg-black text-yellow-300' : 'bg-yellow-400/20 text-yellow-300'
                    }`}
                  >
                    {countInCat}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized Complaints Sections */}
      <div className="space-y-5">
        {displayedCategories.map((category) => {
          // Filter complaints inside this category by searchFilter
          const filteredComplaints = category.complaints.filter((c) =>
            searchFilter ? c.toLowerCase().includes(searchFilter.toLowerCase()) : true
          );

          if (filteredComplaints.length === 0) return null;

          return (
            <div
              key={category.id}
              className="bg-zinc-900/50 border border-zinc-850 rounded-2xl p-4 sm:p-5 space-y-3"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                      {category.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400">{category.description}</p>
                  </div>
                </div>

                <span className="text-[10px] text-yellow-400 font-mono font-semibold uppercase tracking-wider hidden sm:inline">
                  Vitale Care
                </span>
              </div>

              {/* Chips Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredComplaints.map((complaint) => {
                  const isSelected = data.mainComplaints.includes(complaint);
                  return (
                    <button
                      type="button"
                      key={complaint}
                      onClick={() => toggleComplaint(complaint)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left transition-all flex items-start gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-400 text-black font-bold shadow-md ring-2 ring-yellow-300'
                          : 'bg-black/60 text-zinc-300 hover:bg-zinc-800/80 border border-zinc-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-black text-yellow-400 border-black'
                            : 'border-zinc-700 bg-zinc-900'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="flex-1 leading-snug">{complaint}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {errors.mainComplaints && (
          <p className="text-red-400 text-xs font-semibold px-1">{errors.mainComplaints}</p>
        )}
      </div>

      {/* Add Custom / Other Complaint Option */}
      <div className="bg-zinc-900/40 p-3.5 rounded-2xl border border-zinc-850 flex items-center gap-2">
        <input
          type="text"
          placeholder="Adicionar queixa personalizada / observação específica..."
          value={customComplaintInput}
          onChange={(e) => setCustomComplaintInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCustomComplaint();
            }
          }}
          className="flex-1 bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
        />
        <button
          type="button"
          onClick={handleAddCustomComplaint}
          className="px-3.5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Incluir</span>
        </button>
      </div>

      {/* Detalhamento Clínico da Queixa */}
      <div>
        <label className="block text-sm font-bold text-white mb-1">
          Detalhamento Clínico da Queixa *
        </label>
        <p className="text-xs text-zinc-400 mb-2">
          Histórico do incômodo, evolução temporal, fototipo e rotinas cosméticas prévias.
        </p>
        <textarea
          rows={3}
          value={data.complaintsDetails}
          onChange={(e) => onChange({ ...data, complaintsDetails: e.target.value })}
          placeholder="Ex: Paciente refere manchas de melasma malar há 3 anos pós-gestação, além de retenção hídrica em pernas e cansaço constante. Procura protocolo integrado de peeling, soroterapia e drenagem home care..."
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
        />
        {errors.complaintsDetails && (
          <p className="text-red-400 text-xs mt-1">{errors.complaintsDetails}</p>
        )}
      </div>

      {/* Expectativas da Paciente */}
      <div>
        <label className="block text-sm font-bold text-white mb-1">
          Alinhamento de Expectativas com a Paciente *
        </label>
        <p className="text-xs text-zinc-400 mb-2">
          Alinhamento do protocolo de sessões, cuidados com protetor solar pós-peeling/microagulhamento e adesão à suplementação.
        </p>
        <textarea
          rows={2}
          value={data.expectations}
          onChange={(e) => onChange({ ...data, expectations: e.target.value })}
          placeholder="Ex: Alinhada a necessidade de 4 sessões combinadas e uso rigoroso de protetor solar FPS 50+, hidratação e adesão à fórmula de vitaminas manipuladas..."
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
        />
        {errors.expectations && (
          <p className="text-red-400 text-xs mt-1">{errors.expectations}</p>
        )}
      </div>

      {/* Procedimentos Estéticos Anteriores */}
      <div className="bg-zinc-900/60 rounded-2xl p-4 sm:p-5 border border-zinc-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-white">
              Histórico de Procedimentos Estéticos Prévios
            </h4>
            <p className="text-xs text-zinc-400">
              Histórico de peelings prévios, microagulhamento, mesoterapia/enzimas, soroterapia ou drenagens realizadas.
            </p>
          </div>
        </div>

        {/* Existing list */}
        {data.previousProcedures.length > 0 ? (
          <div className="space-y-2 mb-4">
            {data.previousProcedures.map((proc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-black px-3.5 py-2.5 rounded-xl border border-zinc-800 text-xs text-zinc-200"
              >
                <div>
                  <span className="font-bold text-yellow-400">{proc.name}</span>
                  {proc.dateApprox && (
                    <span className="text-zinc-400 ml-2">({proc.dateApprox})</span>
                  )}
                  {proc.complications && (
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Intercorrências/Evolução: {proc.complications}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemovePreviousProcedure(idx)}
                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                  title="Remover procedimento"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500 italic mb-4">
            Nenhum procedimento anterior registrado até o momento.
          </p>
        )}

        {/* Add new procedure fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800">
          <input
            type="text"
            placeholder="Procedimento (ex: Peeling Químico)"
            value={newProcedureName}
            onChange={(e) => setNewProcedureName(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
          />
          <input
            type="text"
            placeholder="Data aprox. (ex: Out/2025)"
            value={newProcedureDate}
            onChange={(e) => setNewProcedureDate(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Intercorrência (ex: Nenhuma)"
              value={newProcedureComp}
              onChange={(e) => setNewProcedureComp(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={handleAddPreviousProcedure}
              className="px-3 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
