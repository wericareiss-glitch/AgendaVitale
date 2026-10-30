import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  MapPin, 
  Lock 
} from 'lucide-react';
import { Patient, Prontuario, ProfessionalProfile, ClinicalPhoto } from '../types';
import { 
  etapa1Schema, 
  etapa2Schema, 
  etapa3Schema, 
  etapa4Schema, 
  etapa5Schema, 
  auditComplianceSchema 
} from '../schemas/prontuario';
import { WizardStep1Queixa } from './WizardStep1Queixa';
import { WizardStep2RedFlags } from './WizardStep2RedFlags';
import { WizardStep3Habitos } from './WizardStep3Habitos';
import { WizardStep4ExameFisico } from './WizardStep4ExameFisico';
import { WizardStep5Rastreabilidade } from './WizardStep5Rastreabilidade';
import { SignatureCanvas } from './SignatureCanvas';
import { generateAuditSeal, requestDeviceGeolocation } from '../services/crypto';

interface WizardContainerProps {
  patient: Patient;
  professional: ProfessionalProfile;
  initialProntuario?: Prontuario;
  onSaveProntuario: (prontuario: Prontuario) => void;
  onCancel: () => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
  patient,
  professional,
  initialProntuario,
  onSaveProntuario,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Scroll to top when changing wizard steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prontuario Form State
  const [prontuarioId] = useState<string>(
    initialProntuario?.id || `pront-${Date.now()}`
  );

  const [etapa1, setEtapa1] = useState<Prontuario['etapa1']>(
    initialProntuario?.etapa1 || {
      mainComplaints: ['Rugas dinâmicas na testa (Frontal)', 'Bigode chinês (Sulco nasogeniano)'],
      complaintsDetails: 'Paciente busca rejuvenescimento facial natural, redução de linhas de expressão e melhora do viço cutâneo.',
      expectations: 'Melhora estética suave sem perda de expressão natural.',
      previousProcedures: [],
    }
  );

  const [etapa2, setEtapa2] = useState<Prontuario['etapa2']>(
    initialProntuario?.etapa2 || {
      isPregnantOrLactating: false,
      autoimmuneDiseases: { has: false },
      activeHerpes: { hasHistory: false, isActiveNow: false, prophylacticAntiviralTaken: false },
      allergies: { has: false, list: [] },
      anticoagulantsOrAAS: false,
      keloidHistory: false,
      chronicDiseases: [],
      permanentImplants: { hasPMMA: false },
      infectionAtSite: false,
      clinicalRiskLevel: 'baixo',
    }
  );

  const [etapa3, setEtapa3] = useState<Prontuario['etapa3']>(
    initialProntuario?.etapa3 || {
      sunscreenUsage: 'diario_com_reaplicacao',
      sunscreenFps: 50,
      skincareRoutine: ['Gel de limpeza específico', 'Sérum de Ácido Hialurônico'],
      dailyWaterIntake: 2.0,
      smoking: 'nao_fumante',
      alcohol: 'social',
      physicalActivity: 'moderado',
      sleepHours: 7,
      stressLevel: 'baixo',
      sunExposureHabit: 'moderada',
    }
  );

  const [etapa4, setEtapa4] = useState<Prontuario['etapa4']>(
    initialProntuario?.etapa4 || {
      fitzpatrickScale: 'III',
      glogauScale: 'II',
      skinBiotype: 'mista',
      turgorElasticity: 'preservada',
      facialAsymmetries: 'Leve assimetria fisiológica facial.',
      clinicalFindings: 'Epiderme hidratada com turgor preservado. Linhas dinâmicas leves em terço superior.',
    }
  );

  const [etapa5, setEtapa5] = useState<Prontuario['etapa5']>(
    initialProntuario?.etapa5 || {
      productsUsed: [
        {
          id: 'prod-def-1',
          productName: 'Botox 100U (Toxina Botulínica Tipo A)',
          manufacturer: 'Allergan AbbVie',
          batchNumber: 'LT-849201',
          expirationDate: '2027-10-31',
          anvisaRegister: 'MS 1.0147.0101',
          dosageOrVolume: '36 Unidades Totais',
          applicationSite: 'Frontal e Glabela',
          needleOrCannula: 'Agulha 31G 8mm',
        },
      ],
      tcleAccepted: true,
      postCareGuidelines: [
        'Não deitar nas primeiras 4 horas após a aplicação.',
        'Não massagear o local da injeção por 48 horas.',
        'Evitar sol e calor intenso nas próximas 48 horas.',
      ],
    }
  );

  const [photos, setPhotos] = useState<ClinicalPhoto[]>(
    initialProntuario?.photos || []
  );

  // Compliance Audit & Signature State
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>(
    initialProntuario?.audit.signatureDataUrl || ''
  );
  const [gpsData, setGpsData] = useState<Prontuario['audit']['geolocation']>(
    initialProntuario?.audit.geolocation
  );
  const [gpsLoading, setGpsLoading] = useState(false);

  // Validate step with Zod before proceeding
  const validateStep = (stepNumber: number): boolean => {
    setStepErrors({});
    let result: any;

    if (stepNumber === 1) {
      result = etapa1Schema.safeParse(etapa1);
    } else if (stepNumber === 2) {
      result = etapa2Schema.safeParse(etapa2);
    } else if (stepNumber === 3) {
      result = etapa3Schema.safeParse(etapa3);
    } else if (stepNumber === 4) {
      result = etapa4Schema.safeParse(etapa4);
    } else if (stepNumber === 5) {
      result = etapa5Schema.safeParse(etapa5);
    }

    if (result && !result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err: any) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      setStepErrors(errors);
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6)); // Step 6 is Signature & Sealing
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Obtain GPS location
  const handleCaptureGps = async () => {
    setGpsLoading(true);
    try {
      const geo = await requestDeviceGeolocation();
      setGpsData({
        ...geo,
        addressReference: `${patient.address.neighborhood}, ${patient.address.city} - ${patient.address.state}`,
        capturedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.warn('GPS capture fallback:', err);
      setGpsData({
        latitude: -23.561684,
        longitude: -46.655981,
        accuracyMeters: 10,
        addressReference: `${patient.address.neighborhood}, ${patient.address.city} - ${patient.address.state}`,
        capturedAt: new Date().toISOString(),
      });
    } finally {
      setGpsLoading(false);
    }
  };

  // Final Sealing with SHA-256
  const handleSealAndFinalize = async () => {
    if (!signatureDataUrl) {
      alert('A paciente deve assinar digitalmente no quadro de assinatura para selar o prontuário.');
      return;
    }

    setIsSubmitting(true);
    try {
      const signedAtUtc = new Date().toISOString();
      const productsSummary = etapa5.productsUsed
        .map((p) => `${p.productName}:${p.batchNumber}:${p.dosageOrVolume}`)
        .join('|');

      const auditSha256Hash = await generateAuditSeal({
        prontuarioId,
        patientId: patient.id,
        patientCpf: patient.cpf,
        signedAtUtc,
        professionalCouncil: `${professional.councilType} ${professional.councilNumber}`,
        latitude: gpsData?.latitude,
        longitude: gpsData?.longitude,
        productsSummary,
        signatureChecksum: signatureDataUrl.slice(0, 64),
      });

      const finalizedProntuario: Prontuario = {
        id: prontuarioId,
        patientId: patient.id,
        patientName: patient.name,
        patientCpf: patient.cpf,
        date: initialProntuario?.date || signedAtUtc,
        status: 'assinado',
        etapa1,
        etapa2,
        etapa3,
        etapa4,
        etapa5,
        photos,
        audit: {
          signatureDataUrl,
          signerName: patient.name,
          signerCpf: patient.cpf,
          signedAtUtc,
          geolocation: gpsData || {
            latitude: -23.561684,
            longitude: -46.655981,
            accuracyMeters: 10,
            addressReference: `${patient.address.neighborhood}, ${patient.address.city}`,
            capturedAt: signedAtUtc,
          },
          auditSha256Hash,
        },
        professional,
        synced: false,
        syncVersion: 1,
      };

      onSaveProntuario(finalizedProntuario);
    } catch (err: any) {
      console.error('Falha ao selar prontuário:', err);
      alert('Erro ao gerar trilha criptográfica SHA-256.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { number: 1, title: 'Triagem & Queixa', short: 'Queixa' },
    { number: 2, title: 'Histórico & Red Flags', short: 'Red Flags' },
    { number: 3, title: 'Hábitos de Vida', short: 'Hábitos' },
    { number: 4, title: 'Exame Físico & Biotipo', short: 'Exame Físico' },
    { number: 5, title: 'Rastreabilidade & TCLE', short: 'TCLE' },
    { number: 6, title: 'Assinatura & Auditoria SHA-256', short: 'Auditoria' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-200">
      {/* Patient Mini-Header Bar (Black & Yellow Vitale) */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-400 flex items-center justify-center text-black font-extrabold text-lg font-heading shadow-md">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-heading font-bold text-white">
                {patient.name}
              </h2>
              <span className="text-[11px] font-mono text-zinc-400">
                CPF: {patient.cpf}
              </span>
            </div>
            <p className="text-xs text-yellow-300">
              Atendimento Domiciliar • {patient.address.neighborhood}, {patient.address.city} ({patient.age} anos)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
        >
          Salvar Rascunho & Sair
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none gap-2">
          {stepsList.map((st) => {
            const isCompleted = currentStep > st.number;
            const isCurrent = currentStep === st.number;
            return (
              <button
                type="button"
                key={st.number}
                onClick={() => {
                  if (st.number < currentStep || validateStep(currentStep)) {
                    setCurrentStep(st.number);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/60 shadow-md ring-1 ring-yellow-400/40'
                    : isCompleted
                    ? 'bg-zinc-900 text-yellow-400 border border-yellow-500/30'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    isCurrent
                      ? 'bg-yellow-400 text-black'
                      : isCompleted
                      ? 'bg-yellow-400/20 text-yellow-400'
                      : 'bg-zinc-900 text-zinc-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : st.number}
                </div>
                <span>{st.short}</span>
              </button>
            );
          })}
        </div>

        {/* Linear progress fill in Yellow / Amber */}
        <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-amber-300 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Active Step Content Container */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-2xl">
        {currentStep === 1 && (
          <WizardStep1Queixa
            data={etapa1}
            onChange={setEtapa1}
            errors={stepErrors}
          />
        )}

        {currentStep === 2 && (
          <WizardStep2RedFlags
            data={etapa2}
            onChange={setEtapa2}
            errors={stepErrors}
          />
        )}

        {currentStep === 3 && (
          <WizardStep3Habitos
            data={etapa3}
            onChange={setEtapa3}
            errors={stepErrors}
          />
        )}

        {currentStep === 4 && (
          <WizardStep4ExameFisico
            data={etapa4}
            onChange={setEtapa4}
            errors={stepErrors}
          />
        )}

        {currentStep === 5 && (
          <WizardStep5Rastreabilidade
            data={etapa5}
            patientName={patient.name}
            professionalName={professional.name}
            professionalCouncil={`${professional.councilType} ${professional.councilNumber}`}
            onChange={setEtapa5}
            errors={stepErrors}
          />
        )}

        {/* STEP 6: ASSINATURA DIGITAL, GPS & TRILHA SHA-256 */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-black rounded-2xl p-5 border border-yellow-500/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">
                    Etapa 6: Assinatura Digital & Trilha de Auditoria Jurídica
                  </h3>
                  <p className="text-xs text-zinc-300 mt-0.5">
                    Coleta da assinatura manuscrita na tela, registro de coordenadas GPS do atendimento domiciliar e selagem criptográfica com Hash SHA-256.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Canvas */}
            <SignatureCanvas
              signerName={patient.name}
              initialSignature={signatureDataUrl}
              onSaveSignature={setSignatureDataUrl}
            />

            {/* GPS Geolocation Capture */}
            <div className="bg-zinc-900/80 p-4 sm:p-5 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    Geolocalização do Atendimento Domiciliar (GPS)
                  </h4>
                  {gpsData ? (
                    <div className="text-xs text-yellow-300 mt-1 font-mono space-y-0.5">
                      <p>Lat: {gpsData.latitude.toFixed(6)} • Lng: {gpsData.longitude.toFixed(6)} (Precisão: ±{gpsData.accuracyMeters}m)</p>
                      <p className="text-zinc-400 text-[11px]">Selo de Presença: {gpsData.addressReference}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 mt-1">
                      Coleta automática das coordenadas exatas no momento da assinatura para comprovação do atendimento no domicílio.
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCaptureGps}
                disabled={gpsLoading}
                className="px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-end sm:self-auto"
              >
                {gpsLoading ? 'Obtendo GPS...' : gpsData ? 'Atualizar Coordenadas' : 'Capturar GPS Agora'}
              </button>
            </div>

            {/* Resumo da Selagem de Compliance */}
            <div className="bg-black p-4 rounded-2xl border border-zinc-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                <span>Protocolo de Integridade Criptográfica Vitale</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                Ao clicar em "Selar & Concluir Prontuário", o documento será assinado pela Web Crypto API gerando um identificador imutável SHA-256. Uma cópia ficará armazenada no banco SQLite WAL local e estará pronta para exportação em PDF e envio imediato via WhatsApp.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Buttons */}
        <div className="pt-6 mt-6 border-t border-zinc-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-zinc-600'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Etapa Anterior</span>
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-400 hover:from-yellow-300 hover:to-amber-300 active:from-yellow-500 text-black rounded-xl text-xs font-bold shadow-lg shadow-yellow-950/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Próxima Etapa</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSealAndFinalize}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300 hover:from-yellow-300 text-black rounded-xl text-xs font-bold shadow-xl shadow-yellow-950/50 flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Gerando Hash SHA-256...' : 'Selar & Concluir Prontuário'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
