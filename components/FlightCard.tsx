
import React from 'react';
// Changed FlightOption to ServiceOption as it is the base type for all services including flights
import { ServiceOption } from '../types';

interface Props {
  service: ServiceOption;
  onSelect: (service: ServiceOption) => void;
}

const FlightCard: React.FC<Props> = ({ service: flight, onSelect }) => {
  const getBadgeStyle = () => {
    switch (flight.recommendationType) {
      case 'VALUE': return 'bg-green-100 text-green-700 border-green-200 ring-green-500/30';
      case 'CHEAPEST': return 'bg-blue-100 text-blue-700 border-blue-200 ring-blue-500/30';
      case 'FASTEST': return 'bg-amber-100 text-amber-700 border-amber-200 ring-amber-500/30';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getLabel = () => {
    switch (flight.recommendationType) {
      case 'VALUE': return 'Melhor Custo-Benefício';
      case 'CHEAPEST': return 'Oportunidade de Preço';
      case 'FASTEST': return 'Conveniência Máxima';
      default: return `Opção #${flight.ranking}`;
    }
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className={`relative bg-white rounded-3xl shadow-sm border p-8 transition-all hover:shadow-2xl hover:translate-x-2 duration-300 ${flight.recommendationType !== 'NONE' ? 'ring-2 ring-opacity-50 ' + (flight.recommendationType === 'VALUE' ? 'ring-green-500' : flight.recommendationType === 'CHEAPEST' ? 'ring-blue-500' : 'ring-amber-500') : 'border-slate-200'}`}>
      
      {/* Ranking Badge */}
      <div className={`absolute -top-4 left-8 px-4 py-1.5 rounded-full text-[10px] font-black border ring-4 uppercase tracking-widest shadow-xl z-10 ${getBadgeStyle()}`}>
        {getLabel()}
      </div>
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl rotate-3">
              {flight.airline?.substring(0,2).toUpperCase() || 'FL'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-2xl text-slate-900 tracking-tighter uppercase">{flight.airline || 'Companhia Aérea'}</h3>
                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md font-black text-slate-500 uppercase tracking-widest">{flight.cabinClass || 'Econômica'}</span>
              </div>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-0.5">{flight.origin || 'N/A'} ➔ {flight.destination || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-12 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <div>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{flight.departureTime || '--:--'}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Decolagem</p>
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <p className="text-[10px] text-slate-900 font-black uppercase tracking-[0.2em] mb-2">
                {flight.stops === 0 ? 'Conexão Direta' : `${flight.stops || 0} ${flight.stops === 1 ? 'Escala' : 'Escalas'}`}
              </p>
              <div className="w-full h-1 bg-slate-200 relative rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-blue-500 w-1/3 animate-pulse"></div>
              </div>
              <p className="text-xs text-slate-500 font-black mt-2 uppercase tracking-widest">{formatDuration(flight.durationMinutes || 0)}</p>
            </div>

            <div className="text-right">
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{flight.arrivalTime || '--:--'}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Aterrissagem</p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto flex flex-col items-end shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-12">
          <p className="text-[10px] text-slate-400 font-black mb-1 tracking-[0.3em] uppercase">Tarifa Net Agente</p>
          <div className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">
            <span className="text-lg font-bold text-slate-300 mr-2">{flight.currency}</span>
            {flight.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <button 
            onClick={() => onSelect(flight)}
            className={`w-full lg:w-auto px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl ${flight.recommendationType === 'VALUE' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : flight.recommendationType === 'CHEAPEST' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-slate-900 hover:bg-black shadow-slate-200'}`}
          >
            Configurar Revenda
          </button>
        </div>
      </div>
      
      {flight.justification && (
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3">
          <div className="shrink-0 w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
            <span className="text-slate-700 font-black not-italic uppercase tracking-widest mr-2 underline decoration-blue-500/30 underline-offset-4">Parecer da IA:</span> 
            {flight.justification}
          </p>
        </div>
      )}
    </div>
  );
};

export default FlightCard;
