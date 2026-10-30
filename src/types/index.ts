export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string; // Bairro (busca rápida)
  city: string;
  state: string;
  cep: string;
  referencePoint?: string; // Ponto de referência para Home Care
}

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  phone: string; // WhatsApp
  birthDate: string;
  age: number;
  gender?: 'Feminino' | 'Masculino' | 'Outro';
  address: Address;
  createdAt: string;
  updatedAt: string;
  status: 'ativo' | 'em_atendimento' | 'retorno_pendente' | 'arquivado';
  notes?: string;
  synced: boolean;
  syncVersion: number;
}

export interface ProductUsage {
  id: string;
  productName: string; // Ex: Botox Allergan, Rennova Fill, Radiesse, Fios de PDO
  manufacturer: string;
  batchNumber: string; // Lote obrigatório ANVISA
  expirationDate: string; // Validade
  anvisaRegister?: string;
  dosageOrVolume: string; // Ex: 40U, 1.0ml, 4 fios
  applicationSite: string; // Ex: Frontal e Glabela, Lábios, Malar
  needleOrCannula?: string; // Ex: Agulha 30G 4mm, Cânula 22G 50mm
}

export interface ClinicalPhoto {
  id: string;
  type: 'antes' | 'depois' | 'retorno';
  angle: 'frontal' | 'perfil_direito' | 'perfil_esquerdo' | 'obliqua_direita' | 'obliqua_esquerda' | 'detalhe';
  dataUrl: string;
  capturedAt: string;
  notes?: string;
}

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  addressReference?: string;
  capturedAt: string;
}

export interface ProfessionalProfile {
  name: string;
  title: string; // Ex: Enfermeira Esteta Especialista
  councilType: 'COFEN' | 'CRBM' | 'CREFITO' | 'CRF' | 'CRM';
  councilNumber: string;
  councilState: string;
  specialty: string;
  clinicOrBrand: string;
  phone: string;
  email: string;
}

export interface Prontuario {
  id: string;
  patientId: string;
  patientName: string;
  patientCpf: string;
  date: string;
  status: 'rascunho' | 'concluido' | 'assinado';
  
  // Etapa 1: Triagem & Queixa Principal
  etapa1: {
    mainComplaints: string[];
    complaintsDetails: string;
    expectations: string;
    previousProcedures: Array<{ name: string; dateApprox?: string; complications?: string }>;
  };

  // Etapa 2: Histórico Clínico & Red Flags (Restrições)
  etapa2: {
    isPregnantOrLactating: boolean; // Contraindicação absoluta
    autoimmuneDiseases: { has: boolean; details?: string };
    activeHerpes: { hasHistory: boolean; isActiveNow: boolean; prophylacticAntiviralTaken: boolean };
    allergies: { has: boolean; list: string[] };
    anticoagulantsOrAAS: boolean;
    keloidHistory: boolean;
    chronicDiseases: string[];
    permanentImplants: { hasPMMA: boolean; details?: string };
    infectionAtSite: boolean;
    clinicalRiskLevel: 'baixo' | 'moderado' | 'alto_red_flag';
    observations?: string;
  };

  // Etapa 3: Hábitos de Vida & Cuidados
  etapa3: {
    sunscreenUsage: 'diario_com_reaplicacao' | 'diario_sem_reaplicacao' | 'esporadico' | 'nunca';
    sunscreenFps: number;
    skincareRoutine: string[];
    dailyWaterIntake: number; // Litros
    smoking: 'nao_fumante' | 'fumante_esporadico' | 'fumante_diario';
    alcohol: 'nao_consome' | 'social' | 'moderado_frequente';
    physicalActivity: 'sedentario' | 'moderado' | 'intenso';
    sleepHours: number;
    stressLevel: 'baixo' | 'moderado' | 'elevado';
    sunExposureHabit: 'rara' | 'moderada' | 'intensa_frequente';
  };

  // Etapa 4: Exame Físico & Biotipo Cutâneo
  etapa4: {
    fitzpatrickScale: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
    glogauScale: 'I' | 'II' | 'III' | 'IV';
    skinBiotype: 'eudermica' | 'lipidica' | 'alipica' | 'mista' | 'sensivel';
    turgorElasticity: 'preservada' | 'moderadamente_reduzida' | 'bastante_reduzida';
    facialAsymmetries?: string;
    clinicalFindings: string;
  };

  // Etapa 5: Rastreabilidade Sanitária (ANVISA) & TCLE
  etapa5: {
    productsUsed: ProductUsage[];
    tcleAccepted: boolean;
    tcleCustomNotes?: string;
    postCareGuidelines: string[];
  };

  // Fotos
  photos: ClinicalPhoto[];

  // Compliance & Trilha de Auditoria Digital (SHA-256)
  audit: {
    signatureDataUrl?: string;
    signerName: string;
    signerCpf: string;
    signedAtUtc?: string;
    geolocation?: GeolocationData;
    auditSha256Hash?: string;
  };

  professional: ProfessionalProfile;
  synced: boolean;
  syncVersion: number;
}
