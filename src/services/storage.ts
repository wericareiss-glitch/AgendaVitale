import { Patient, Prontuario, ProfessionalProfile } from '../types';

const STORAGE_KEYS = {
  PATIENTS: 'estetika_wal_patients_v1',
  PRONTUARIOS: 'estetika_wal_prontuarios_v1',
  PROFESSIONAL: 'estetika_wal_professional_v1',
  WAL_LOG: 'estetika_wal_journal_log_v1',
};

export const defaultProfessionalProfile: ProfessionalProfile = {
  name: 'Dra. Werica Reis Sousa',
  title: 'Enfermeira Esteta Especialista',
  councilType: 'COFEN',
  councilNumber: '999.350',
  councilState: 'PI',
  specialty: 'Estética Avançada',
  clinicOrBrand: 'Instituto Vitale - Estética Avançada',
  phone: '(86) 99484-292',
  email: 'vitale.domicilio@gmail.com',
};

// Seed realistic home care patients for immediate rich experience
const initialPatients: Patient[] = [
  {
    id: 'pat-001',
    name: 'Juliana Mendes Silveira',
    cpf: '342.781.908-45',
    phone: '(11) 99842-1205',
    birthDate: '1988-04-14',
    age: 38,
    gender: 'Feminino',
    address: {
      street: 'Rua Bela Cintra',
      number: '1420',
      complement: 'Apto 82',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      cep: '01415-001',
      referencePoint: 'Próximo à Alameda Santos, interfone 82B',
    },
    createdAt: '2026-10-15T14:30:00Z',
    updatedAt: '2026-10-28T16:00:00Z',
    status: 'ativo',
    notes: 'Pele com fototipo III. Muito pontual nos atendimentos domiciliares. Prefere anestésico tópico manipulado 20 min antes.',
    synced: true,
    syncVersion: 2,
  },
  {
    id: 'pat-002',
    name: 'Fernanda Albuquerque Prado',
    cpf: '219.543.871-12',
    phone: '(11) 98112-9090',
    birthDate: '1979-11-20',
    age: 46,
    gender: 'Feminino',
    address: {
      street: 'Alameda dos Maracatins',
      number: '980',
      complement: 'Bloco A - Apto 124',
      neighborhood: 'Moema',
      city: 'São Paulo',
      state: 'SP',
      cep: '04089-013',
      referencePoint: 'Portaria 24h, visitante identificado com RG',
    },
    createdAt: '2026-09-10T10:00:00Z',
    updatedAt: '2026-10-22T11:15:00Z',
    status: 'retorno_pendente',
    notes: 'Realizado Bioestimulador Sculptra há 30 dias. Retorno agendado para avaliação de estímulo neocolarescente.',
    synced: true,
    syncVersion: 1,
  },
  {
    id: 'pat-003',
    name: 'Beatriz Vasques Dornelles',
    cpf: '456.892.108-99',
    phone: '(11) 97321-4455',
    birthDate: '1995-07-03',
    age: 31,
    gender: 'Feminino',
    address: {
      street: 'Rua Harmonia',
      number: '550',
      complement: 'Casa 03',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
      cep: '05435-000',
      referencePoint: 'Vila de casas fechada com portão branco automático',
    },
    createdAt: '2026-10-20T09:00:00Z',
    updatedAt: '2026-10-20T09:00:00Z',
    status: 'ativo',
    notes: 'Primeira consulta de anamnese facial agendada para queixa de linhas perioculares e volume labial discreto.',
    synced: false,
    syncVersion: 1,
  },
  {
    id: 'pat-004',
    name: 'Renata Fontoura de Toledo',
    cpf: '188.742.339-01',
    phone: '(11) 99123-8877',
    birthDate: '1972-02-18',
    age: 54,
    gender: 'Feminino',
    address: {
      street: 'Avenida Higienópolis',
      number: '720',
      complement: 'Cobertura',
      neighborhood: 'Higienópolis',
      city: 'São Paulo',
      state: 'SP',
      cep: '01238-000',
      referencePoint: 'Edifício com manobrista',
    },
    createdAt: '2026-08-05T15:20:00Z',
    updatedAt: '2026-10-12T17:45:00Z',
    status: 'ativo',
    notes: 'Protocolo de fios de sustentação PDO espiculados e preenchimento de fossa temporal.',
    synced: true,
    syncVersion: 3,
  },
  {
    id: 'pat-005',
    name: 'Carlos Eduardo Nogueira',
    cpf: '312.449.880-60',
    phone: '(11) 98555-1122',
    birthDate: '1983-09-25',
    age: 43,
    gender: 'Masculino',
    address: {
      street: 'Rua dos Pinheiros',
      number: '1100',
      complement: 'Conjunto 14',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      cep: '05422-002',
      referencePoint: 'Próximo à estação Fradique Coutinho',
    },
    createdAt: '2026-10-01T11:00:00Z',
    updatedAt: '2026-10-19T14:30:00Z',
    status: 'ativo',
    notes: 'Toxina botulínica no terço superior facial (glabela forte / hipercinética e frontal). Não possui histórico alérgico.',
    synced: true,
    syncVersion: 1,
  }
];

// Initial realistic completed prontuário with digital signature and SHA-256 seal
const initialProntuarios: Prontuario[] = [
  {
    id: 'pront-2026-001',
    patientId: 'pat-001',
    patientName: 'Juliana Mendes Silveira',
    patientCpf: '342.781.908-45',
    date: '2026-10-25T14:45:00Z',
    status: 'assinado',
    etapa1: {
      mainComplaints: [
        'Melasma facial e hipercromias pós-inflamatórias',
        'Comedões abertos e fechados (cravos pretos e brancos)',
        'Cicatrizes atróficas de acne (Drug Delivery regenerador)',
        'Fadiga crônica, exaustão física e desânimo (B12 / Complexo B)'
      ],
      complaintsDetails: 'Paciente relata histórico de melasma malar e hipercromia pós-acneica associada a cansaço físico rotineiro. Busca renovação cutânea com peeling químico e microagulhamento somados a suplementação injetável de vitaminas.',
      expectations: 'Melhora progressiva da tonalidade e viço da pele, redução de cravos e estímulo de energia celular e disposição.',
      previousProcedures: [
        { name: 'Limpeza de Pele Profunda', dateApprox: 'Setembro de 2026', complications: 'Boa cicatrização' },
        { name: 'Peeling Mandélico Superficial', dateApprox: 'Julho de 2026', complications: 'Sem intercorrências' }
      ]
    },
    etapa2: {
      isPregnantOrLactating: false,
      autoimmuneDiseases: { has: false },
      activeHerpes: { hasHistory: true, isActiveNow: false, prophylacticAntiviralTaken: true },
      allergies: { has: true, list: ['Dipirona'] },
      anticoagulantsOrAAS: false,
      keloidHistory: false,
      chronicDiseases: [],
      permanentImplants: { hasPMMA: false },
      infectionAtSite: false,
      clinicalRiskLevel: 'baixo',
      observations: 'Pele íntegra sem lesões ativas. Teste de sensibilidade ao peeling prévio negativo.'
    },
    etapa3: {
      sunscreenUsage: 'diario_com_reaplicacao',
      sunscreenFps: 50,
      skincareRoutine: ['Gel de limpeza micelar', 'Sérum Vitamina C 15%', 'Protetor solar físico FPS 50'],
      dailyWaterIntake: 2.5,
      smoking: 'nao_fumante',
      alcohol: 'social',
      physicalActivity: 'moderado',
      sleepHours: 7,
      stressLevel: 'moderado',
      sunExposureHabit: 'moderada'
    },
    etapa4: {
      fitzpatrickScale: 'III',
      glogauScale: 'II',
      skinBiotype: 'mista',
      turgorElasticity: 'preservada',
      facialAsymmetries: 'Simetria facial preservada.',
      clinicalFindings: 'Epiderme com queratinização moderada e comedões abertos na zona T. Máculas hipercrômicas leves em dorso nasal e maçãs do rosto.'
    },
    etapa5: {
      productsUsed: [
        {
          id: 'prod-01',
          productName: 'Peeling Químico Ácido Mandélico 30% + Salicílico 2%',
          manufacturer: 'Smart GR / Biometikal',
          batchNumber: 'BMK-2026-904',
          expirationDate: '2027-10-31',
          anvisaRegister: 'MS 2.0512.0014',
          dosageOrVolume: '2.0 mL',
          applicationSite: 'Região Facial Completa e Zona T',
          needleOrCannula: 'Gaze estéril e pincel leque descartável'
        },
        {
          id: 'prod-02',
          productName: 'Complexo B + B12 (Cianocobalamina 5.000mcg IM)',
          manufacturer: 'Eurofarma Injetáveis',
          batchNumber: 'EUR-883120',
          expirationDate: '2028-02-28',
          anvisaRegister: 'MS 1.0043.0911',
          dosageOrVolume: '2.0 mL (1 Ampola IM)',
          applicationSite: 'Região Glútea Ventroglútea Esquerda',
          needleOrCannula: 'Seringa 3ml e Agulha descartável 25x7'
        }
      ],
      tcleAccepted: true,
      tcleCustomNotes: 'Termo de Consentimento Livre e Esclarecido Home Care homologado com orientações de fotoproteção e repouso de sol pós-peeling.',
      postCareGuidelines: [
        'Uso rigoroso e ininterrupto de protetor solar FPS 50+ a cada 3 horas.',
        'Não puxar, friccionar ou esfoliar a pele durante a descamação do peeling.',
        'Evitar banhos muito quentes, saunas e exposição direta ao sol nos próximos 7 dias.',
        'Ingestão hídrica de 2.5 litros de água por dia para potencializar a regeneração dérmica.',
        'Iniciar o uso da fórmula de vitaminas manipuladas a partir do dia seguinte.',
        'Entrar em contato em caso de qualquer desconforto atípico.'
      ]
    },
    photos: [
      {
        id: 'photo-antes-01',
        type: 'antes',
        angle: 'frontal',
        capturedAt: '2026-10-25T14:15:00Z',
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231e293b"/><circle cx="200" cy="180" r="110" fill="%23fcd34d" opacity="0.3"/><circle cx="200" cy="180" r="100" fill="%23e2e8f0"/><ellipse cx="170" cy="165" rx="12" ry="7" fill="%23334155"/><ellipse cx="230" cy="165" rx="12" ry="7" fill="%23334155"/><path d="M160 135 Q175 125 190 135" stroke="%2364748b" stroke-width="4" fill="none"/><path d="M210 135 Q225 125 240 135" stroke="%2364748b" stroke-width="4" fill="none"/><path d="M160 115 Q200 105 240 115" stroke="%2394a3b8" stroke-width="2" stroke-dasharray="3,3" fill="none"/><path d="M165 122 Q200 114 235 122" stroke="%2394a3b8" stroke-width="2" stroke-dasharray="3,3" fill="none"/><path d="M197 165 L203 165 L200 200 Z" fill="%2394a3b8"/><path d="M175 225 Q200 240 225 225" stroke="%23f43f5e" stroke-width="6" fill="none"/><text x="200" y="340" fill="%2394a3b8" font-size="14" text-anchor="middle" font-family="sans-serif">Registro Fotográfico ANTES - Frontal</text></svg>',
        notes: 'Registro fotográfico com linhas frontais e perioculares marcadas em mímica.'
      },
      {
        id: 'photo-depois-01',
        type: 'depois',
        angle: 'frontal',
        capturedAt: '2026-10-25T15:30:00Z',
        dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231e293b"/><circle cx="200" cy="180" r="110" fill="%2310b981" opacity="0.2"/><circle cx="200" cy="180" r="100" fill="%23f8fafc"/><ellipse cx="170" cy="165" rx="12" ry="7" fill="%23334155"/><ellipse cx="230" cy="165" rx="12" ry="7" fill="%23334155"/><path d="M160 135 Q175 125 190 135" stroke="%2364748b" stroke-width="4" fill="none"/><path d="M210 135 Q225 125 240 135" stroke="%2364748b" stroke-width="4" fill="none"/><path d="M197 165 L203 165 L200 200 Z" fill="%2394a3b8"/><path d="M172 225 Q200 242 228 225" stroke="%23e11d48" stroke-width="9" fill="none"/><text x="200" y="340" fill="%2310b981" font-size="14" text-anchor="middle" font-family="sans-serif">Registro Fotográfico PÓS-IMEDIATO</text></svg>',
        notes: 'Pós-procedimento imediato com hidratação labial uniforme e pontos de aplicação limpos com antisséptico clorexidina 0.5%.'
      }
    ],
    audit: {
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100"><path d="M20 60 Q50 10 90 45 T160 30 T220 70 T280 40" stroke="%230f766e" stroke-width="3" fill="none"/><text x="20" y="90" font-size="11" fill="%2364748b">Juliana Mendes Silveira - 342.781.908-45</text></svg>',
      signerName: 'Juliana Mendes Silveira',
      signerCpf: '342.781.908-45',
      signedAtUtc: '2026-10-25T15:35:12.890Z',
      geolocation: {
        latitude: -23.561492,
        longitude: -46.656012,
        accuracyMeters: 8,
        addressReference: 'Rua Bela Cintra, 1420 - Jardins, São Paulo - SP',
        capturedAt: '2026-10-25T15:35:10Z'
      },
      auditSha256Hash: 'a7c390f19c4d92ee44810fb881bce554b702ec9438ad4e569911e2fbc45a0b79'
    },
    professional: defaultProfessionalProfile,
    synced: true,
    syncVersion: 1
  }
];

export interface WalLogEntry {
  id: string;
  timestamp: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  table: 'patients' | 'prontuarios' | 'professional';
  entityId: string;
  dataSummary: string;
  synced: boolean;
}

class EstetikaStorageService {
  private memoryPatients: Map<string, Patient> = new Map();
  private memoryProntuarios: Map<string, Prontuario> = new Map();
  private professional: ProfessionalProfile = defaultProfessionalProfile;
  private walJournal: WalLogEntry[] = [];

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      // 1. Load Patients
      const storedPatients = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (storedPatients) {
        const parsed: Patient[] = JSON.parse(storedPatients);
        parsed.forEach((p) => this.memoryPatients.set(p.id, p));
      } else {
        initialPatients.forEach((p) => this.memoryPatients.set(p.id, p));
        this.persistPatients();
      }

      // 2. Load Prontuários
      const storedProntuarios = localStorage.getItem(STORAGE_KEYS.PRONTUARIOS);
      if (storedProntuarios) {
        const parsed: Prontuario[] = JSON.parse(storedProntuarios);
        parsed.forEach((pr) => this.memoryProntuarios.set(pr.id, pr));
      } else {
        initialProntuarios.forEach((pr) => this.memoryProntuarios.set(pr.id, pr));
        this.persistProntuarios();
      }

      // 3. Load Professional Profile (Fixed to Dra. Werica Reis Sousa)
      this.professional = { ...defaultProfessionalProfile };
      this.persistProfessional();

      // 4. Load WAL Journal
      const storedWal = localStorage.getItem(STORAGE_KEYS.WAL_LOG);
      if (storedWal) {
        this.walJournal = JSON.parse(storedWal);
      }
    } catch (e) {
      console.error('Error initializing Estetika local storage WAL engine:', e);
    }
  }

  private recordWal(action: WalLogEntry['action'], table: WalLogEntry['table'], entityId: string, summary: string) {
    const entry: WalLogEntry = {
      id: `wal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      action,
      table,
      entityId,
      dataSummary: summary,
      synced: false,
    };
    this.walJournal.unshift(entry);
    if (this.walJournal.length > 200) {
      this.walJournal.pop();
    }
    try {
      localStorage.setItem(STORAGE_KEYS.WAL_LOG, JSON.stringify(this.walJournal));
    } catch {
      // Ignore quota storage warnings
    }
  }

  private persistPatients() {
    try {
      const arr = Array.from(this.memoryPatients.values());
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(arr));
    } catch (e) {
      console.error('Falha ao persistir pacientes localmente:', e);
    }
  }

  private persistProntuarios() {
    try {
      const arr = Array.from(this.memoryProntuarios.values());
      localStorage.setItem(STORAGE_KEYS.PRONTUARIOS, JSON.stringify(arr));
    } catch (e) {
      console.error('Falha ao persistir prontuários localmente:', e);
    }
  }

  private persistProfessional() {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFESSIONAL, JSON.stringify(this.professional));
    } catch (e) {
      console.error('Falha ao persistir perfil profissional:', e);
    }
  }

  // --- Patients CRUD ---
  public getPatients(): Patient[] {
    return Array.from(this.memoryPatients.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getPatientById(id: string): Patient | undefined {
    return this.memoryPatients.get(id);
  }

  public savePatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt' | 'synced' | 'syncVersion'> & { id?: string }): Patient {
    const isNew = !patientData.id || !this.memoryPatients.has(patientData.id);
    const now = new Date().toISOString();
    const id = patientData.id || `pat-${Date.now()}`;

    const patient: Patient = {
      ...patientData,
      id,
      createdAt: isNew ? now : (this.memoryPatients.get(id)?.createdAt || now),
      updatedAt: now,
      synced: false, // marked for future cloud sync
      syncVersion: (this.memoryPatients.get(id)?.syncVersion || 0) + 1,
    };

    this.memoryPatients.set(id, patient);
    this.persistPatients();
    this.recordWal(isNew ? 'INSERT' : 'UPDATE', 'patients', id, `Paciente: ${patient.name} (${patient.address.neighborhood})`);
    return patient;
  }

  public deletePatient(id: string): boolean {
    const p = this.memoryPatients.get(id);
    if (!p) return false;
    const name = p.name;
    this.memoryPatients.delete(id);
    this.persistPatients();
    this.recordWal('DELETE', 'patients', id, `Excluído paciente: ${name}`);
    return true;
  }

  // --- Prontuários CRUD ---
  public getProntuarios(patientId?: string): Prontuario[] {
    const list = Array.from(this.memoryProntuarios.values());
    if (patientId) {
      return list.filter((pr) => pr.patientId === patientId).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getProntuarioById(id: string): Prontuario | undefined {
    return this.memoryProntuarios.get(id);
  }

  public saveProntuario(prontuario: Prontuario): Prontuario {
    const isNew = !this.memoryProntuarios.has(prontuario.id);
    const updated = {
      ...prontuario,
      synced: false,
      syncVersion: (this.memoryProntuarios.get(prontuario.id)?.syncVersion || 0) + 1,
    };

    this.memoryProntuarios.set(prontuario.id, updated);
    this.persistProntuarios();

    // Also update patient's updatedAt
    const patient = this.memoryPatients.get(prontuario.patientId);
    if (patient) {
      patient.updatedAt = new Date().toISOString();
      this.persistPatients();
    }

    this.recordWal(
      isNew ? 'INSERT' : 'UPDATE',
      'prontuarios',
      prontuario.id,
      `Prontuário ${prontuario.id} para ${prontuario.patientName} (${prontuario.status})`
    );

    return updated;
  }

  public deleteProntuario(id: string): boolean {
    if (!this.memoryProntuarios.has(id)) return false;
    this.memoryProntuarios.delete(id);
    this.persistProntuarios();
    this.recordWal('DELETE', 'prontuarios', id, `Excluído prontuário: ${id}`);
    return true;
  }

  // --- Professional Profile ---
  public getProfessional(): ProfessionalProfile {
    return { ...this.professional };
  }

  public saveProfessional(profile: ProfessionalProfile): void {
    this.professional = { ...profile };
    this.persistProfessional();
    this.recordWal('UPDATE', 'professional', 'self', `Atualizado cadastro: ${profile.name} (${profile.councilNumber})`);
  }

  // --- WAL journal & Cloud sync status ---
  public getWalJournal(): WalLogEntry[] {
    return [...this.walJournal];
  }

  public getSyncMetrics(): { pendingSyncCount: number; totalRecords: number; lastLocalWalTime: string } {
    let pending = 0;
    this.memoryPatients.forEach((p) => {
      if (!p.synced) pending++;
    });
    this.memoryProntuarios.forEach((pr) => {
      if (!pr.synced) pending++;
    });
    const total = this.memoryPatients.size + this.memoryProntuarios.size;
    const lastTime = this.walJournal[0]?.timestamp || new Date().toISOString();
    return {
      pendingSyncCount: pending,
      totalRecords: total,
      lastLocalWalTime: lastTime,
    };
  }

  public exportBackupJson(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        version: '1.0.0-estetika-wal',
        patients: Array.from(this.memoryPatients.values()),
        prontuarios: Array.from(this.memoryProntuarios.values()),
        professional: this.professional,
        walLog: this.walJournal,
      },
      null,
      2
    );
  }
}

export const storageService = new EstetikaStorageService();
