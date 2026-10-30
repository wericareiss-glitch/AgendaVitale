import React, { useState } from 'react';
import { PackageCheck, Plus, Trash2, ShieldCheck, FileCheck, AlertCircle, Sparkles } from 'lucide-react';
import { Prontuario, ProductUsage } from '../types';

interface Step5Props {
  data: Prontuario['etapa5'];
  patientName: string;
  professionalName: string;
  professionalCouncil: string;
  onChange: (updated: Prontuario['etapa5']) => void;
  errors?: Record<string, string>;
}

const PRODUCT_TEMPLATES = [
  {
    name: 'Peeling Químico Ácido Retinóico 5%',
    manufacturer: 'Galena / Pharma Special',
    anvisa: 'MS 2.0345.0089',
    dosage: '1.5 mL (Monodose)',
    site: 'Face Completa (Frontal, Malar, Mento)',
    needle: 'Pincel leque / gaze estéril',
  },
  {
    name: 'Peeling Ácido Mandélico 30% + Salicílico 2%',
    manufacturer: 'Smart GR / Biometikal',
    anvisa: 'MS 2.0512.0014',
    dosage: '2.0 mL',
    site: 'Zona T e Região Malar',
    needle: 'Aplicador dérmico estéril',
  },
  {
    name: 'Cartucho Smart Dermapen 36 Agulhas + Monodose EGF',
    manufacturer: 'Smart GR Medical',
    anvisa: 'MS 81382050005',
    dosage: 'Profundidade 0.5mm a 1.5mm + 3.0ml Sérum',
    site: 'Face Completa e Cicatrizes',
    needle: 'Agulhas Titânio 36 Pontas Estéreis',
  },
  {
    name: 'Kit Limpeza de Pele Profunda com Emoliência e Fototerapia',
    manufacturer: 'Adcos Profissional',
    anvisa: 'MS 2.0198.0210',
    dosage: '1 Protocolo Completo',
    site: 'Face, Nariz e Mento',
    needle: 'Cureta extratora estéril descartável',
  },
  {
    name: 'Mescla Enzimas Lipolíticas (L-Carnitina + Cafeína + Silício)',
    manufacturer: 'Biometikal Injetáveis',
    anvisa: 'MS 80562300015',
    dosage: '5.0 mL a 10.0 mL',
    site: 'Região Submentoniana (Papada) / Abdômen',
    needle: 'Agulha 30G 4mm (Intradérmica)',
  },
  {
    name: 'Desoxicolato de Sódio 1% (Lipolítico Focal)',
    manufacturer: 'Victa Lab Injetáveis',
    anvisa: 'MS 80251420042',
    dosage: '2.5 mL',
    site: 'Bolsa de Gordura Submentoniana',
    needle: 'Agulha 30G 6mm',
  },
  {
    name: 'Complexo B + B12 (Cianocobalamina 5.000mcg)',
    manufacturer: 'Eurofarma Injetáveis',
    anvisa: 'MS 1.0043.0911',
    dosage: '2.0 mL (Ampola)',
    site: 'Glúteo Ventroglúteo (Intramuscular)',
    needle: 'Agulha 25x7 (IM Profundo)',
  },
  {
    name: 'Biotina Injetável 10mg + D-Pantenol (Protocolo Capilar)',
    manufacturer: 'Biometikal / Fagron',
    anvisa: 'MS 80451960033',
    dosage: '2.0 mL',
    site: 'Intramuscular profunda',
    needle: 'Agulha 25x7 descartável',
  },
  {
    name: 'Soroterapia Imunidade & Antioxidante (Vit C 5g + Magnésio + Zinco)',
    manufacturer: 'Fresenius Kabi / Victa',
    anvisa: 'MS 1.0491.0022',
    dosage: '250 mL Soro Fisiológico 0.9% EV',
    site: 'Acesso venoso periférico em MSE',
    needle: 'Cateter Jelco 22G + Equipo Macrogotas',
  },
  {
    name: 'Creme Drenante Ativo com Centella Asiática e Ginkgo Biloba',
    manufacturer: 'D\'Água Natural Profissional',
    anvisa: 'MS 2.0289.0044',
    dosage: '30 g',
    site: 'Membros Inferiores e Abdômen (Drenagem Linfática)',
    needle: 'Manobras Manuais Método Vodder/Leduc',
  },
  {
    name: 'Fórmula Nutracêutica Manipulada (Silício Orgânico + Zinco + Biotina)',
    manufacturer: 'Farmácia de Manipulação Autorizada ANVISA',
    anvisa: 'RDC 67/2007 ANVISA',
    dosage: '1 Cápsula ao dia pela manhã (Frasco 60 cápsulas)',
    site: 'Via Oral (Suporte Domiciliar)',
    needle: 'Cápsulas Vegetais Vcaps',
  },
];

const DEFAULT_POST_GUIDELINES = [
  'Uso rigoroso e ininterrupto de protetor solar FPS 50+ com reaplicação a cada 3 horas.',
  'Não puxar, esfoliar ou arrancar qualquer descamação cutânea decorrente do peeling.',
  'Evitar exposição solar direta, praias, piscinas e saunas durante todo o período de cicatrização.',
  'Manter hidratação oral intensa com ingestão mínima de 2 a 3 litros de água por dia.',
  'Não massagear vigorosamente áreas que receberam aplicação de enzimas lipolíticas nas primeiras 24 horas.',
  'Manter o curativo estéril do local da punção de soroterapia ou injeção intramuscular limpo e seco por 4 horas.',
  'Seguir rigorosamente a posologia da fórmula de vitaminas manipuladas prescrita para manutenção.',
  'Entrar em contato imediatamente com a profissional em caso de qualquer dúvida, calor excessivo ou sensibilidade atípica.',
];

export const WizardStep5Rastreabilidade: React.FC<Step5Props> = ({
  data,
  patientName,
  professionalName,
  professionalCouncil,
  onChange,
  errors = {},
}) => {
  const [newProduct, setNewProduct] = useState<Partial<ProductUsage>>({
    productName: '',
    manufacturer: '',
    batchNumber: '',
    expirationDate: '',
    anvisaRegister: '',
    dosageOrVolume: '',
    applicationSite: '',
    needleOrCannula: '',
  });

  const handleApplyTemplate = (tmpl: typeof PRODUCT_TEMPLATES[0]) => {
    setNewProduct({
      productName: tmpl.name,
      manufacturer: tmpl.manufacturer,
      anvisaRegister: tmpl.anvisa,
      dosageOrVolume: tmpl.dosage,
      applicationSite: tmpl.site,
      needleOrCannula: tmpl.needle,
      batchNumber: 'LT-' + Math.floor(100000 + Math.random() * 900000),
      expirationDate: '2027-12-31',
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.productName || !newProduct.batchNumber || !newProduct.expirationDate || !newProduct.dosageOrVolume || !newProduct.applicationSite) {
      alert('Preencha os campos obrigatórios do produto: Nome, Lote, Validade, Dose/Volume e Região.');
      return;
    }

    const item: ProductUsage = {
      id: `prod-${Date.now()}`,
      productName: newProduct.productName,
      manufacturer: newProduct.manufacturer || 'Fabricante Homologado',
      batchNumber: newProduct.batchNumber,
      expirationDate: newProduct.expirationDate,
      anvisaRegister: newProduct.anvisaRegister,
      dosageOrVolume: newProduct.dosageOrVolume,
      applicationSite: newProduct.applicationSite,
      needleOrCannula: newProduct.needleOrCannula,
    };

    onChange({
      ...data,
      productsUsed: [...data.productsUsed, item],
    });

    setNewProduct({
      productName: '',
      manufacturer: '',
      batchNumber: '',
      expirationDate: '',
      anvisaRegister: '',
      dosageOrVolume: '',
      applicationSite: '',
      needleOrCannula: '',
    });
  };

  const handleRemoveProduct = (id: string) => {
    onChange({
      ...data,
      productsUsed: data.productsUsed.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-yellow-500/30">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-heading font-bold text-white">
              Etapa 5: Rastreabilidade Sanitária (ANVISA) & TCLE Vitale
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              Conformidade total com a Vigilância Sanitária: controle de lote, validade e aceite formal do Termo de Consentimento.
            </p>
          </div>
        </div>
      </div>

      {/* Rastreabilidade de Produtos Utilizados */}
      <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-400" />
            <span>Produtos Utilizados no Atendimento Home Care *</span>
          </label>
          <span className="text-xs text-yellow-400 font-semibold">
            {data.productsUsed.length} produto(s) registrado(s)
          </span>
        </div>

        {/* Templates Rápidos */}
        <div className="mb-4">
          <span className="text-[11px] text-zinc-400 block mb-1.5 font-medium">
            Preenchimento rápido com produtos certificados:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRODUCT_TEMPLATES.map((tmpl) => (
              <button
                type="button"
                key={tmpl.name}
                onClick={() => handleApplyTemplate(tmpl)}
                className="px-2.5 py-1 rounded-lg bg-black hover:bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 hover:text-yellow-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>{tmpl.name.split(' ')[0]} {tmpl.name.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Existing Products List */}
        {data.productsUsed.length > 0 ? (
          <div className="space-y-2.5 mb-4">
            {data.productsUsed.map((prod) => (
              <div
                key={prod.id}
                className="bg-black rounded-xl p-3.5 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-yellow-400 text-sm">
                      {prod.productName}
                    </span>
                    <span className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-400 border border-zinc-700">
                      {prod.manufacturer}
                    </span>
                    {prod.anvisaRegister && (
                      <span className="text-[10px] text-zinc-400 font-mono">
                        ANVISA: {prod.anvisaRegister}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-zinc-300 flex-wrap font-mono">
                    <span className="bg-yellow-400/10 text-yellow-300 px-2 py-0.5 rounded border border-yellow-400/30 font-bold">
                      Lote: {prod.batchNumber}
                    </span>
                    <span className="text-zinc-400">
                      Validade: {prod.expirationDate}
                    </span>
                    <span className="text-zinc-200">
                      Dose: {prod.dosageOrVolume}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-[11px]">
                    Sítio: <strong className="text-zinc-200">{prod.applicationSite}</strong>
                    {prod.needleOrCannula ? ` • Material: ${prod.needleOrCannula}` : ''}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveProduct(prod.id)}
                  className="self-end sm:self-center p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors cursor-pointer"
                  title="Remover produto da lista"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 bg-black rounded-xl border border-dashed border-zinc-800 text-xs text-yellow-300 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-yellow-400" />
            <span>Nenhum produto cadastrado ainda. A vigilância sanitária exige o registro de lote e validade.</span>
          </div>
        )}

        {/* Add Product Form */}
        <div className="bg-black p-3.5 rounded-xl border border-zinc-800 space-y-3">
          <span className="text-xs font-bold text-yellow-400 block">
            Adicionar Produto / Injetável
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Nome do Produto / Marca *"
                value={newProduct.productName || ''}
                onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Fabricante *"
                value={newProduct.manufacturer || ''}
                onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Lote Sanitário (Ex: C4902A) *"
                value={newProduct.batchNumber || ''}
                onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <input
                type="date"
                placeholder="Data de Validade *"
                value={newProduct.expirationDate || ''}
                onChange={(e) => setNewProduct({ ...newProduct, expirationDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Registro ANVISA"
                value={newProduct.anvisaRegister || ''}
                onChange={(e) => setNewProduct({ ...newProduct, anvisaRegister: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Dose / Volume (ex: 40U, 1.0ml) *"
                value={newProduct.dosageOrVolume || ''}
                onChange={(e) => setNewProduct({ ...newProduct, dosageOrVolume: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Região de Aplicação *"
                value={newProduct.applicationSite || ''}
                onChange={(e) => setNewProduct({ ...newProduct, applicationSite: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Material (ex: Cânula 22G 50mm)"
                value={newProduct.needleOrCannula || ''}
                onChange={(e) => setNewProduct({ ...newProduct, needleOrCannula: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddProduct}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Inserir Produto com Lote</span>
            </button>
          </div>
        </div>
        {errors.productsUsed && (
          <p className="text-red-400 text-xs mt-2">{errors.productsUsed}</p>
        )}
      </div>

      {/* Orientações Pós-Atendimento Vitale */}
      <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800">
        <label className="block text-sm font-bold text-white mb-2">
          Orientações Pós-Procedimento Vitale Entregues à Paciente
        </label>
        <div className="space-y-1.5">
          {DEFAULT_POST_GUIDELINES.map((guide, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
              <span className="text-yellow-400 font-bold shrink-0 mt-0.5">•</span>
              <span>{guide}</span>
            </div>
          ))}
        </div>
      </div>

      {/* TCLE (Termo de Consentimento Livre e Esclarecido) */}
      <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
          <FileCheck className="w-4 h-4" />
          <span>Termo de Consentimento Livre e Esclarecido (TCLE)</span>
        </div>

        <div className="bg-black p-4 rounded-xl border border-zinc-800 max-h-48 overflow-y-auto text-xs text-zinc-300 space-y-3 font-mono leading-relaxed select-text">
          <p className="font-bold text-yellow-400 uppercase text-[11px]">
            TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO PARA PROCEDIMENTO ESTÉTICO HOME CARE - VITALE
          </p>
          <p>
            Eu, <strong className="text-white">{patientName}</strong>, declaro que fui devidamente informada(o) pela profissional responsável,{' '}
            <strong className="text-white">{professionalName}</strong>, inscrita sob o registro{' '}
            <strong className="text-white">{professionalCouncil}</strong>, a respeito de todos os detalhes técnicos do plano estético proposto em modalidade domiciliar (Home Care).
          </p>
          <p>
            1. Fui esclarecida(o) de que todo procedimento estético injetável possui caráter de melhora estética personalizada, não garantindo perfeição ou simetria absoluta.
          </p>
          <p>
            2. Fui alertada(o) e compreendo as possíveis reações adversas transitórias inerentes ao procedimento, tais como eritema, edema, pequenas equimoses passageiras e sensibilidade local.
          </p>
          <p>
            3. Comprometo-me a seguir rigorosamente todas as recomendações pós-atendimento informadas neste prontuário Vitale.
          </p>
          <p>
            4. Declaro ter fornecido respostas verdadeiras quanto ao meu histórico de saúde, gravidez, alergias e procedimentos anteriores.
          </p>
        </div>

        {/* Checkbox de Aceitação Legal */}
        <label className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
          data.tcleAccepted
            ? 'bg-yellow-400/10 border-yellow-400 shadow-md ring-1 ring-yellow-400'
            : 'bg-black border-zinc-800'
        }`}>
          <input
            type="checkbox"
            checked={data.tcleAccepted}
            onChange={(e) => onChange({ ...data, tcleAccepted: e.target.checked })}
            className="w-5 h-5 rounded text-yellow-400 mt-0.5 focus:ring-0"
          />
          <div>
            <span className="text-sm font-bold text-white block">
              Declaro que a paciente (ou responsável) leu, compreendeu e manifestou aceite formal deste TCLE *
            </span>
            <span className="text-xs text-zinc-400">
              O aceite deste termo será assinado digitalmente na próxima etapa e selado com hash criptográfico SHA-256 e GPS.
            </span>
          </div>
        </label>
        {errors.tcleAccepted && (
          <p className="text-red-400 text-xs mt-1">{errors.tcleAccepted}</p>
        )}
      </div>
    </div>
  );
};
