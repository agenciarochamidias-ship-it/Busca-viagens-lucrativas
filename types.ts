
export type ServiceCategory = 'FLIGHT' | 'HOTEL' | 'EXPERIENCE' | 'TRANSFER';
export type TravelCategory = 'ECONOMIC' | 'STANDARD' | 'LUXURY';

export interface ServiceOption {
  id: string;
  category: ServiceCategory;
  title: string;
  provider: string;
  price: number;
  currency: string;
  location?: string;
  origin?: string;
  destination?: string;
  departureTime?: string;
  arrivalTime?: string;
  airline?: string;
  stops?: number;
  duration?: string;
  durationMinutes?: number;
  cabinClass?: string;
  details: string;
  baggageOrType?: string;
  fareRulesOrPolicy: string;
  searchIdentifier: string;
  ranking: number;
  recommendationType: 'VALUE' | 'CHEAPEST' | 'FASTEST' | 'PREMIUM' | 'NONE';
  justification: string;
  
  // Sourcing e Contato (Requisitos Obrigatórios)
  fontePesquisa: string; // Nome do site/plataforma
  origemInformacao: string; // Ex: Consolidadora, Site Oficial
  telefoneFornecedor?: string;
  whatsappFornecedor?: string;
  canalContratacao: 'SITE' | 'TELEFONE' | 'WHATSAPP' | 'CONSOLIDADORA';
  contatoReserva: string; // Com quem falar (Setor ou Nome)
  tipoReserva: 'DIRETA NO SITE' | 'VIA TELEFONE' | 'VIA WHATSAPP' | 'VIA AGENTE';
  linkDireto?: string;
  
  // Informações de Horários Simplificadas
  diaDaSemana?: string;
  horarioSimplificado?: string;
}

export interface PackageItem {
  id: string;
  service: ServiceOption;
  markupValue: number;
  markupType: 'percent' | 'fixed';
  finalPrice: number;
  internalNotes: string;
  customTitle?: string;
  customDescription?: string;
}

/**
 * Opportunity interface used for saving specific service configurations
 */
export interface Opportunity {
  id: string;
  flight: ServiceOption;
  markupValue: number;
  markupType: 'percent' | 'fixed';
  finalPrice: number;
  internalNotes: string;
  savedAt: string;
}

export interface SearchParams {
  destination: string;
  origin?: string;
  startDate: string;
  endDate: string;
  passengers: number;
  categories: ServiceCategory[];
  travelCategory?: TravelCategory;
}
