
import React from 'react';
import { ServiceOption } from '../types';

interface Props {
  service: ServiceOption;
  onSelect: (service: ServiceOption) => void;
}

const ServiceCard: React.FC<Props> = ({ service, onSelect }) => {
  const isFlight = service.category === 'FLIGHT';

  const getBadgeStyle = () => {
    switch (service.recommendationType) {
      case 'VALUE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CHEAPEST': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREMIUM': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  const getCanalIcon = () => {
    switch (service.canalContratacao) {
      case 'SITE': return '🌐';
      case 'WHATSAPP': return '💬';
      case 'TELEFONE': return '📞';
      case 'CONSOLIDADORA': return '🏦';
      default: return '📄';
    }
  };

  // Trava de segurança para evitar erro de toLocaleString em valores indefinidos
  const safePrice = Number(service.price) || 0;

  return (
    <div className="bg-white rounded-[28px] border border-slate-200 p-6 md:p-8 hover:shadow-xl transition-all duration-300 group relative flex flex-col gap-6">
      <div className={`absolute top-0 left-0 w-2 h-full rounded-l-full ${isFlight ? 'bg-blue-600' : 'bg-rose-500'}`}></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${getBadgeStyle()}`}>
            {service.recommendationType || 'OPORTUNIDADE'} • RANK #{service.ranking}
          </div>
          {service.diaDaSemana && (
            <div className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              🗓️ {service.diaDaSemana}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          <span className="text-base">{getCanalIcon()}</span>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Via: {service.canalContratacao}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        <div className="flex-1 space-y-5">
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight group-hover:text-blue-600 transition-colors">
              {service.title}
            </h3>
            {isFlight && (
              <div className="mt-3 flex flex-col md:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1 italic">Partida</p>
                  <p className="text-lg font-black text-slate-900">{service.departureTime || '--:--'}</p>
                  <p className="text-[10px] font-bold text-blue-600">{service.origin}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <div className="w-full h-[1px] bg-slate-200 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg bg-slate-50 px-2">✈️</div>
                  </div>
                  <p className="text-[8px] font-black text-slate-400 mt-2 uppercase">{service.stops === 0 ? 'Direto' : `${service.stops} Escalas`}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1 italic">Chegada</p>
                  <p className="text-lg font-black text-slate-900">{service.arrivalTime || '--:--'}</p>
                  <p className="text-[10px] font-bold text-blue-600">{service.destination}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fonte da Pesquisa</p>
              <p className="text-[11px] font-black text-slate-800 uppercase italic">🔍 {service.fontePesquisa || 'IA Search'}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase">Origem: {service.origemInformacao || 'Rede Global'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Canais de Reserva</p>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-black text-blue-600 uppercase italic">👤 {service.contatoReserva}</p>
                <div className="flex gap-2">
                  {service.whatsappFornecedor && (
                    <a href={`https://wa.me/${service.whatsappFornecedor}`} target="_blank" className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[9px] font-black border border-green-200">WHATSAPP</a>
                  )}
                  {service.telefoneFornecedor && (
                    <a href={`tel:${service.telefoneFornecedor}`} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-[9px] font-black border border-blue-200">LIGAR</a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <p className="text-[10px] text-slate-600 italic leading-relaxed">
              <span className="text-blue-600 font-black not-italic uppercase mr-2 text-[9px] border-b border-blue-200 tracking-widest">Veredito IA:</span>
              {service.justification}
            </p>
          </div>
        </div>

        <div className="lg:w-72 flex flex-col items-center lg:items-end justify-center gap-4 lg:pl-8 lg:border-l border-slate-100 pt-6 lg:pt-0 border-t lg:border-t-0">
          <div className="text-center lg:text-right">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Custo Net Agente</p>
            <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic">
              <span className="text-base font-bold text-slate-300 mr-2">{service.currency || 'BRL'}</span>
              {safePrice.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </div>
          </div>
          
          <button 
            onClick={() => onSelect(service)}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            Configurar Lucro 💰
          </button>
          
          <div className="text-center lg:text-right space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reserva: {service.tipoReserva}</p>
            {service.horarioSimplificado && <p className="text-[10px] font-black text-blue-500 uppercase italic">Período: {service.horarioSimplificado}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
