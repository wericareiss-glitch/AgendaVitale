import { z } from 'zod';

export const patientSchema = z.object({
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use o formato 000.000.000-00'),
  phone: z.string().min(10, 'Telefone inválido com DDD'),
  birthDate: z.string().min(10, 'Informe a data de nascimento'),
  address: z.object({
    street: z.string().min(2, 'Informe o logradouro/rua'),
    number: z.string().min(1, 'Número do endereço obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, 'Bairro obrigatório para roteiro Home Care'),
    city: z.string().min(2, 'Cidade obrigatória'),
    state: z.string().length(2, 'UF deve ter 2 letras (ex: SP)'),
    cep: z.string().min(8, 'CEP obrigatório'),
    referencePoint: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export const etapa1Schema = z.object({
  mainComplaints: z.array(z.string()).min(1, 'Selecione ao menos 1 queixa estética principal'),
  complaintsDetails: z.string().min(5, 'Descreva a queixa detalhadamente para o prontuário'),
  expectations: z.string().min(3, 'Registre o alinhamento de expectativas da paciente'),
  previousProcedures: z.array(
    z.object({
      name: z.string().min(1, 'Nome do procedimento'),
      dateApprox: z.string().optional(),
      complications: z.string().optional(),
    })
  ).default([]),
});

export const etapa2Schema = z.object({
  isPregnantOrLactating: z.boolean(),
  autoimmuneDiseases: z.object({
    has: z.boolean(),
    details: z.string().optional(),
  }),
  activeHerpes: z.object({
    hasHistory: z.boolean(),
    isActiveNow: z.boolean(),
    prophylacticAntiviralTaken: z.boolean(),
  }),
  allergies: z.object({
    has: z.boolean(),
    list: z.array(z.string()),
  }),
  anticoagulantsOrAAS: z.boolean(),
  keloidHistory: z.boolean(),
  chronicDiseases: z.array(z.string()).default([]),
  permanentImplants: z.object({
    hasPMMA: z.boolean(),
    details: z.string().optional(),
  }),
  infectionAtSite: z.boolean(),
  clinicalRiskLevel: z.enum(['baixo', 'moderado', 'alto_red_flag']),
  observations: z.string().optional(),
}).refine((data) => {
  // If pregnant/lactating, must be flagged as high risk
  if (data.isPregnantOrLactating) {
    return data.clinicalRiskLevel === 'alto_red_flag';
  }
  return true;
}, {
  message: 'Paciente gestante/lactante é contraindicação absoluta (Red Flag crítico)',
  path: ['clinicalRiskLevel'],
});

export const etapa3Schema = z.object({
  sunscreenUsage: z.enum(['diario_com_reaplicacao', 'diario_sem_reaplicacao', 'esporadico', 'nunca']),
  sunscreenFps: z.number().min(0).max(100),
  skincareRoutine: z.array(z.string()).default([]),
  dailyWaterIntake: z.number().min(0.5, 'Consumo de água deve ser no mínimo 0.5L'),
  smoking: z.enum(['nao_fumante', 'fumante_esporadico', 'fumante_diario']),
  alcohol: z.enum(['nao_consome', 'social', 'moderado_frequente']),
  physicalActivity: z.enum(['sedentario', 'moderado', 'intenso']),
  sleepHours: z.number().min(3).max(16),
  stressLevel: z.enum(['baixo', 'moderado', 'elevado']),
  sunExposureHabit: z.enum(['rara', 'moderada', 'intensa_frequente']),
});

export const etapa4Schema = z.object({
  fitzpatrickScale: z.enum(['I', 'II', 'III', 'IV', 'V', 'VI']),
  glogauScale: z.enum(['I', 'II', 'III', 'IV']),
  skinBiotype: z.enum(['eudermica', 'lipidica', 'alipica', 'mista', 'sensivel']),
  turgorElasticity: z.enum(['preservada', 'moderadamente_reduzida', 'bastante_reduzida']),
  facialAsymmetries: z.string().optional(),
  clinicalFindings: z.string().min(3, 'Registre o resumo do exame físico cutâneo'),
});

export const productItemSchema = z.object({
  id: z.string(),
  productName: z.string().min(2, 'Nome do produto / marca obrigatório'),
  manufacturer: z.string().min(2, 'Fabricante obrigatório'),
  batchNumber: z.string().min(2, 'Lote do produto obrigatório para rastreabilidade ANVISA'),
  expirationDate: z.string().min(4, 'Data de validade obrigatória'),
  anvisaRegister: z.string().optional(),
  dosageOrVolume: z.string().min(1, 'Quantidade / dosagem / volume aplicado obrigatório'),
  applicationSite: z.string().min(2, 'Região anatômica da aplicação obrigatória'),
  needleOrCannula: z.string().optional(),
});

export const etapa5Schema = z.object({
  productsUsed: z.array(productItemSchema).min(1, 'Cadastre ao menos 1 produto utilizado com lote e validade sanitária'),
  tcleAccepted: z.literal(true, {
    message: 'A paciente ou responsável legal deve aceitar o TCLE',
  }),
  tcleCustomNotes: z.string().optional(),
  postCareGuidelines: z.array(z.string()).min(1, 'Mantenha ao menos 1 orientação pós-atendimento'),
});

export const auditComplianceSchema = z.object({
  signatureDataUrl: z.string().min(20, 'Assinatura digital manuscrita obrigatória'),
  signerName: z.string().min(3, 'Nome legível da paciente/assinante obrigatório'),
  signerCpf: z.string().min(11, 'CPF da paciente obrigatório'),
  signedAtUtc: z.string().min(10, 'Timestamp UTC obrigatório'),
});
