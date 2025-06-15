
import { z } from "zod";

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
    address: "Zona Rural, n° 100, Cidade Exemplo, UF",
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
    address: "Estrada Vicinal, km 5, Outra Cidade, UF",
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
};

// Dados mock para ARTs
const prop1 = MOCK_PROPERTIES.find(p => p.id === 'prop-1');
const app1 = prop1?.applications.find(a => a.id === 'app-1');

export const MOCK_ARTS: FullART[] = [
  {
    id: "art-1",
    artNumber: "2024123456",
    issueDate: "2024-06-12",
    propertyId: "prop-1",
    applicationId: "app-1",
    fileUrl: "/mock-art.pdf", // Link para o PDF
    // Dados denormalizados
    propertyName: prop1?.name || 'N/A',
    applicationProduct: app1?.product || 'N/A',
    applicationDate: app1?.date || 'N/A',
    responsible: app1?.responsible || 'N/A',
  }
];

