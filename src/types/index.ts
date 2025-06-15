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
export const MOCK_PROPERTIES: (Property & { applications: Application[] })[] = [
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
