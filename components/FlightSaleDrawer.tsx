
import React, { useState, useEffect } from 'react';
// Changed FlightOption to ServiceOption and used newly added Opportunity type
import { ServiceOption, Opportunity } from '../types';

interface Props {
  flight: ServiceOption | null;
  onClose: () => void;
  onSaveOpportunity: (opp: Opportunity) => void;
}

const FlightSaleDrawer: React.FC<Props> = ({ flight, onClose, onSaveOpportunity }) => {
  if (!flight) return null;

  const [markupType, setMarkupType] = useState<'percent' | 'fixed'>('percent');
  const [markupValue, setMarkupValue] = useState<number>(10);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [showRules, setShowRules] = useState<boolean>(false);

  useEffect(() => {
    let profit = markupType === 'percent' 
      ? (flight.price * markupValue) / 100 
      : markupValue;
    setFinalPrice(flight.price + profit);
  }, [flight, markupType, markupValue]);

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const shareToWhatsApp = () => {
    // Correctly using flight properties from ServiceOption
    const text = `*Cotação de Voo Profissional*%0A%0A✈️ *Cia:* ${flight.airline || 'N/A'}%0A📍 *Rota:* ${flight.origin || 'N/A'} ➔ ${flight.destination || 'N/A'}%0A🕒 *Partida:* ${flight.departureTime || 'N/A'}%0A🛬 *Chegada:* ${flight.arrivalTime || 'N/A'}%0A⏳ *Duração:* ${formatDuration(flight.durationMinutes || 0)}%0A🛑 *Escalas:* ${flight.stops === 0 ? 'Direto' : (flight.stops || 0)}%0A🛄 *Bagagem:* ${flight.baggageOrType || 'Não informada'}%0A🛋️ *Classe:* ${flight.cabinClass || 'Econômica'}%0A%0A💰 *Preço Final: ${flight.currency} ${finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}*%0A%0A_Interessado? Garanta sua vaga respondendo esta mensagem._`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleSave = () => {
    // Opportunity now properly matches the interface in types.ts
    const opp: Opportunity = {
      id: `${flight.id}-${Date.now()}`,
      flight,
      markupValue,
      markupType,
      finalPrice,
      internalNotes,
      savedAt: new Date().toISOString()
    };
    onSaveOpportunity(opp);
    alert('Oportunidade salva com sucesso!');
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end transition-opacity duration-300">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold">Configurar Venda</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Ranking #${flight.ranking} • {flight.recommendationType}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Info Técnica */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800">{flight.airline || 'Companhia Aérea'}</h3>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">{flight.cabinClass || 'Econômica'}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Duração Total</p>
                <p className="text-sm font-bold text-slate-700">{formatDuration(flight.durationMinutes || 0)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Bagagem</p>
                <p className="text-sm font-bold text-slate-700">{flight.baggageOrType || 'Sob consulta'}</p>
              </div>
            </div>

            {/* Regras Tarifárias Expansíveis */}
            <div className="border border-amber-200 rounded-xl overflow-hidden bg-amber-50/30">
              <button 
                onClick={() => setShowRules(!showRules)}
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-amber-800 uppercase hover:bg-amber-50 transition-colors"
              >
                Regras Tarifárias (Cancelamento/Alteração)
                <svg className={`w-4 h-4 transform transition-transform ${showRules ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {showRules && (
                <div className="p-3 pt-0 text-xs text-amber-700 leading-relaxed border-t border-amber-100">
                  {flight.fareRulesOrPolicy}
                </div>
              )}
            </div>
          </section>

          {/* Precificação */}
          <section className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-200 pb-2">Painel de Lucratividade</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Custo NET:</span>
              <span className="text-lg font-bold text-slate-700">{flight.currency} {flight.price.toLocaleString('pt-BR')}</span>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Definir Markup</label>
              <div className="flex border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <input 
                  type="number" 
                  value={markupValue}
                  onChange={(e) => setMarkupValue(Number(e.target.value))}
                  className="flex-1 px-4 py-3 outline-none font-black text-slate-800 text-lg"
                />
                <select 
                  value={markupType}
                  onChange={(e) => setMarkupType(e.target.value as any)}
                  className="bg-slate-100 px-4 border-l border-slate-300 text-xs font-black text-slate-600 outline-none uppercase"
                >
                  <option value="percent">% Lucro</option>
                  <option value="fixed">{flight.currency} Fixo</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 text-center">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Preço Final de Venda</p>
              <p className="text-5xl font-black text-blue-600 mt-2">
                <span className="text-xl mr-1 opacity-50">{flight.currency}</span>
                {finalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="bg-green-100 text-green-700 py-1.5 px-4 rounded-full text-[10px] font-black uppercase tracking-wider">
                  Sua Margem: +{flight.currency} {(finalPrice - flight.price).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          </section>

          {/* Notas Internas */}
          <section className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Notas Internas (Privado)</label>
            <textarea 
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Ex: Cliente prefere corredor, bagagem extra negociada..."
              className="w-full h-24 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
            />
          </section>

          {/* Ações */}
          <div className="space-y-3 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={shareToWhatsApp}
                className="flex flex-col items-center justify-center p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-all shadow-xl shadow-green-100 group"
              >
                <svg className="w-6 h-6 mb-1 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.347.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                <span className="text-[10px] font-black uppercase">WhatsApp</span>
              </button>
              <button 
                onClick={handleSave}
                className="flex flex-col items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-xl shadow-blue-100 group"
              >
                <svg className="w-6 h-6 mb-1 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                <span className="text-[10px] font-black uppercase tracking-tighter">Salvar Oportunidade</span>
              </button>
            </div>
            
            <button 
              // Changed from non-existent linkReserva to linkDireto which is defined in ServiceOption
              onClick={() => window.open(flight.linkDireto || '#', '_blank')}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-xs tracking-[0.2em] shadow-2xl hover:bg-black transition-all"
            >
              Emitir via Consolidadora
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default FlightSaleDrawer;
