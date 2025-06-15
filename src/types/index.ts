
import { z } from "zod";

// User type for authentication
export type User = {
  id: string;
  name: string;
  email: string;
  role: "industry" | "resale" | "rt" | "farmer" | "fiscal" | "admin";
  creaNumber?: string;
  creaValidated?: boolean;
};

// Adicionando o tipo NFeData para ser compartilhado
export type NFeData = {
  numero: string;
  dataEmissao: string;
  emitente: string;
  destinatario: string;
  valorTotal: string;
  fileName: string; // Adicionado para identificar o arquivo
};

// Schema para validação do formulário de propriedade
export const propertySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  ownerCpfCnpj: z.string().min(11, "CPF/CNPJ inválido."),
  totalArea: z.coerce.number().positive("A área deve ser um número positivo."),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  mainCulture: z.string().min(2, "A cultura principal é obrigatória."),
  address: z.string().min(5, "O endereço é obrigatório."),
  state: z.string().length(2, "O estado deve ser a sigla com 2 caracteres.").optional(), // Adicionado para US017
});

export type Property = z.infer<typeof propertySchema>;

// Schema e tipo para o Cadastro Ambiental Rural (CAR)
export const carSchema = z.object({
  idImovel: z.string(), // Código de inscrição no CAR
  tipo: z.string(),
  status: z.string(),
  siglaUf: z.string(),
  idMunicipio: z.string(),
  dataExtracao: z.string().optional(),
  dataAtualizacaoCar: z.string().optional(),
  condicao: z.string().optional(),
  modulosFiscais: z.coerce.number().optional(),
  area: z.coerce.number().optional(),
});

export type Car = z.infer<typeof carSchema>;

// Tipo para aplicação de insumos
export type Application = {
  id: string;
  date: string;
  product: string;
  dose: string;
  method: string;
  responsible: string; // Responsável técnico
  culture: string;
};

// Tipo para Notificações
export type Notification = {
  id: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
};

// Schema para validação do formulário de ART
export const artSchema = z.object({
  id: z.string().optional(),
  artNumber: z.string().min(1, "O número da ART é obrigatório."),
  issueDate: z.string().min(1, "A data de emissão é obrigatória."),
  propertyId: z.string().min(1, "A propriedade é obrigatória."),
  applicationId: z.string().min(1, "A aplicação é obrigatória."),
  fileUrl: z.string().optional(), // Para o PDF enviado
  lotNumber: z.string().optional(), // Número do lote do produto vendido
  nfNumber: z.string().optional(),  // Número da Nota Fiscal da venda
});

export type ART = z.infer<typeof artSchema>;

// Dados mock
export const MOCK_PROPERTIES: (Property & { applications: Application[], car?: Car })[] = [
  {
    id: "prop-1",
    name: "Fazenda Santa Luzia",
    ownerCpfCnpj: "123.456.789-00",
    totalArea: 150,
    latitude: -23.55052,
    longitude: -46.633308,
    mainCulture: "Soja",
    address: "Zona Rural, n° 100, Cidade Exemplo, SP",
    state: "SP",
    applications: [
      {
        id: "app-1",
        date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], // Amanhã
        product: "Herbicida Z-MAX",
        dose: "2L/ha",
        method: "Pulverização tratorizada",
        responsible: "João da Silva (CREA-SP 123456)",
        culture: "Soja",
      },
      {
        id: "app-2",
        date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0], // Em 3 dias
        product: "Fungicida Protetor",
        dose: "1.5L/ha",
        method: "Pulverização aérea",
        responsible: "João da Silva (CREA-SP 123456)",
        culture: "Soja",
      },
    ],
    car: {
        idImovel: "SP-3515807-ABCDE1234567890FABCDE1234567890F",
        tipo: "Imóvel Rural",
        status: "Ativo",
        condicao: "Aguardando análise",
        siglaUf: "SP",
        idMunicipio: "3515807",
        modulosFiscais: 15,
        area: 150, // hectare
        dataExtracao: "2025-02-20",
        dataAtualizacaoCar: "2025-02-21",
    }
  },
  {
    id: "prop-2",
    name: "Sítio Água Limpa",
    ownerCpfCnpj: "987.654.321-99",
    totalArea: 75,
    latitude: -22.906847,
    longitude: -43.172896,
    mainCulture: "Milho",
    address: "Estrada Vicinal, km 5, Outra Cidade, RJ",
    state: "RJ",
    applications: [
      {
        id: "app-3",
        date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], // Em 5 dias
        product: "Inseticida Guardião",
        dose: "500ml/ha",
        method: "Pulverização costal",
        responsible: "Maria Oliveira (CREA-RJ 654321)",
        culture: "Milho",
      },
    ],
  },
];

// Tipo para ART completa com dados denormalizados para exibição
export type FullART = ART & {
  propertyName: string;
  applicationProduct: string;
  applicationDate: string;
  responsible: string;
  culture: string;
  dose: string;
};

// Dados mock para ARTs
const prop1 = MOCK_PROPERTIES.find(p => p.id === 'prop-1');
const app1 = prop1?.applications.find(a => a.id === 'app-1');
const prop2 = MOCK_PROPERTIES.find(p => p.id === 'prop-2');
const app3 = prop2?.applications.find(a => a.id === 'app-3');

export const MOCK_ARTS: FullART[] = [
  {
    id: "art-1",
    artNumber: "2024123456",
    issueDate: "2024-06-12",
    propertyId: "prop-1",
    applicationId: "app-1",
    fileUrl: "/mock-art.pdf", // Link para o PDF
    lotNumber: "LOTE-HVZ-2405-001",
    nfNumber: "987654",
    // Dados denormalizados
    propertyName: prop1?.name || 'N/A',
    applicationProduct: app1?.product || 'N/A',
    applicationDate: app1?.date || 'N/A',
    responsible: app1?.responsible || 'N/A',
    culture: app1?.culture || 'N/A',
    dose: app1?.dose || 'N/A',
  },
  {
    id: "art-2",
    artNumber: "123456",
    issueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], // Dois dias atrás
    propertyId: "prop-2",
    applicationId: "app-3",
    fileUrl: "/mock-art-2.pdf",
    // Dados denormalizados
    propertyName: prop2?.name || 'N/A',
    applicationProduct: app3?.product || 'N/A',
    applicationDate: app3?.date || 'N/A',
    responsible: app3?.responsible || 'N/A',
    culture: app3?.culture || 'N/A',
    dose: app3?.dose || 'N/A',
  }
];

// Movimentação de Lote
export type Movimentacao = {
  data: string;
  evento: string;
  local: string;
  tipo: "Fabricação" | "Transporte" | "Venda" | "Aplicação" | "Recebimento" | "Processamento";
  responsavel: string;
  observacao?: string;
};

// Schema para Lote de Insumo
export const loteSchema = z.object({
  id: z.string().optional(),
  codigoLote: z.string(),
  insumo: z.string().min(1, "O nome do insumo é obrigatório."),
  fabricante: z.string().min(1, "O nome do fabricante é obrigatório."),
  composition: z.string().min(1, "A composição é obrigatória."),
  dataFabricacao: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "A data de fabricação é obrigatória.",
  }),
  dataValidade: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "A data de validade é obrigatória.",
  }),
});

export type Lote = z.infer<typeof loteSchema> & { movimentacoes: Movimentacao[] };

// Dados mock para Lotes
export const MOCK_LOTES: Lote[] = [
    {
    id: "lote-1",
    codigoLote: "LOTE-HVZ-2405-001",
    insumo: "Herbicida Z-MAX",
    fabricante: "AgroQuímica S.A.",
    composition: "Glifosato 50%",
    dataFabricacao: "2024-05-10",
    dataValidade: "2026-05-10",
    movimentacoes: [
      {
        data: "2024-05-10",
        evento: "Lote produzido",
        local: "AgroQuímica S.A. - Unidade Campinas",
        tipo: "Fabricação",
        responsavel: "Carlos Andrade",
      },
      {
        data: "2024-05-15",
        evento: "Transporte para Revenda AgroFuturo",
        local: "Revenda AgroFuturo - Unidade Cuiabá",
        tipo: "Transporte",
        responsavel: "LogiFácil Transportes",
        observacao: "Carga segurada",
      },
      {
        data: "2024-06-12",
        evento: "Venda para Produtor via ART 2024123456",
        local: "Revenda AgroFuturo",
        tipo: "Venda",
        responsavel: "Ana Costa",
        observacao: "NF-e: 987654",
      },
      {
        data: MOCK_PROPERTIES.find(p => p.id === 'prop-1')?.applications.find(a => a.id === 'app-1')?.date || 'N/A',
        evento: "Aplicação via Receituário",
        local: `Propriedade: ${MOCK_PROPERTIES.find(p => p.id === 'prop-1')?.name}`,
        tipo: "Aplicação",
        responsavel: `RT: ${MOCK_PROPERTIES.find(p => p.id === 'prop-1')?.applications.find(a => a.id === 'app-1')?.responsible}`,
        observacao: "Cultura: Soja",
      }
    ],
  },
  {
    id: "lote-2",
    codigoLote: "LOTE-FGX-2404-002",
    insumo: "Fungicida Protetor",
    fabricante: "AgroQuímica S.A.",
    composition: "Mancozeb 80%",
    dataFabricacao: "2024-04-20",
    dataValidade: "2026-04-20",
    movimentacoes: [
        {
            data: "2024-04-20",
            evento: "Lote produzido",
            local: "AgroQuímica S.A. - Unidade Anápolis",
            tipo: "Fabricação",
            responsavel: "Beatriz Lima",
        },
        {
            data: "2024-04-25",
            evento: "Transporte para Revenda Campo Forte",
            local: "Revenda Campo Forte - Unidade Rondonópolis",
            tipo: "Transporte",
            responsavel: "LogiFácil Transportes",
        }
    ]
  }
];

// Adicionando tipos e mocks para US016
export type RegisteredRT = {
  id: string;
  name: string;
  crea: string;
  state: "SP" | "RJ" | "MG" | "GO";
};

export const MOCK_REGISTERED_RTS: RegisteredRT[] = [
  { id: "rt-1", name: "João da Silva", crea: "CREA-SP 123456", state: "SP" },
  { id: "rt-2", name: "Maria Oliveira", crea: "CREA-RJ 654321", state: "RJ" },
  { id: "rt-3", name: "Carlos Pereira", crea: "CREA-SP 789012", state: "SP" },
  { id: "rt-4", name: "Ana Souza", crea: "CREA-MG 345678", state: "MG" },
  { id: "rt-5", name: "Pedro Martins", crea: "CREA-GO 901234", state: "GO" },
];
