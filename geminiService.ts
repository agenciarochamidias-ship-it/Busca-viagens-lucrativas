
import { GoogleGenAI, Type } from "@google/genai";
import { ServiceOption, SearchParams, ServiceCategory } from "./types";

export const searchTravelServices = async (params: SearchParams): Promise<{ results: Partial<Record<ServiceCategory, ServiceOption[]>> }> => {
  // Inicialização rápida
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const categoryLabels = {
    'ECONOMIC': 'ECONÔMICO',
    'STANDARD': 'CUSTO-BENEFÍCIO',
    'LUXURY': 'LUXO/PREMIUM'
  };

  // Prompt simplificado para execução rápida no modelo Flash
  const prompt = `
    Aja como um buscador de viagens ultra-rápido. 
    OBJETIVO: Encontrar as 3 melhores opções de ${params.categories.join(', ')} para ${params.destination}.
    SAÍDA: ${params.origin || 'Qualquer aeroporto'}. 
    DATAS: ${params.startDate} a ${params.endDate}.
    PERFIL: ${params.travelCategory ? categoryLabels[params.travelCategory] : 'PADRÃO'}.

    REGRAS DE OURO (JSON APENAS):
    - Traduza tudo para PORTUGUÊS.
    - OBRIGATÓRIO: fontePesquisa (ex: Google Flights), origemInformacao, canalContratacao (SITE, WHATSAPP, TELEFONE ou CONSOLIDADORA), contatoReserva, diaDaSemana, horarioSimplificado (Manhã/Tarde/Noite).
    - Para VOOS: inclua partida, destino, horários exatos e escalas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Modelo Flash para velocidade máxima
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            FLIGHT: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { 
              id: { type: Type.STRING }, title: { type: Type.STRING }, provider: { type: Type.STRING }, price: { type: Type.NUMBER }, currency: { type: Type.STRING },
              origin: { type: Type.STRING }, destination: { type: Type.STRING }, departureTime: { type: Type.STRING }, arrivalTime: { type: Type.STRING }, 
              airline: { type: Type.STRING }, stops: { type: Type.INTEGER }, duration: { type: Type.STRING }, details: { type: Type.STRING },
              ranking: { type: Type.INTEGER }, recommendationType: { type: Type.STRING }, justification: { type: Type.STRING },
              fontePesquisa: { type: Type.STRING }, origemInformacao: { type: Type.STRING }, telefoneFornecedor: { type: Type.STRING }, whatsappFornecedor: { type: Type.STRING },
              canalContratacao: { type: Type.STRING }, contatoReserva: { type: Type.STRING }, tipoReserva: { type: Type.STRING }, diaDaSemana: { type: Type.STRING }, horarioSimplificado: { type: Type.STRING }
            } } },
            HOTEL: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { 
              id: { type: Type.STRING }, title: { type: Type.STRING }, price: { type: Type.NUMBER }, currency: { type: Type.STRING },
              details: { type: Type.STRING }, ranking: { type: Type.INTEGER }, justification: { type: Type.STRING },
              fontePesquisa: { type: Type.STRING }, origemInformacao: { type: Type.STRING }, telefoneFornecedor: { type: Type.STRING }, whatsappFornecedor: { type: Type.STRING },
              canalContratacao: { type: Type.STRING }, contatoReserva: { type: Type.STRING }, tipoReserva: { type: Type.STRING }, diaDaSemana: { type: Type.STRING }
            } } },
            TRANSFER: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { 
              id: { type: Type.STRING }, title: { type: Type.STRING }, price: { type: Type.NUMBER }, details: { type: Type.STRING }, fontePesquisa: { type: Type.STRING }, canalContratacao: { type: Type.STRING }
            } } },
            EXPERIENCE: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { 
              id: { type: Type.STRING }, title: { type: Type.STRING }, price: { type: Type.NUMBER }, details: { type: Type.STRING }, fontePesquisa: { type: Type.STRING }, canalContratacao: { type: Type.STRING }
            } } }
          }
        }
      }
    });

    const results = JSON.parse(response.text || '{}');
    Object.keys(results).forEach(cat => {
      if (Array.isArray(results[cat])) {
        results[cat] = results[cat].map((item: any) => ({ ...item, category: cat }));
      }
    });

    return { results };
  } catch (error) {
    console.error("Erro na busca Gemini:", error);
    return { results: {} };
  }
};
