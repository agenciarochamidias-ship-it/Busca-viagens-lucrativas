
import React, { useState, useEffect } from 'react';
import { ServiceOption, PackageItem } from '../types';

interface Props {
  service: ServiceOption | null;
  onClose: () => void;
  onAddToPackage: (item: PackageItem) => void;
}

const ServiceSaleDrawer: React.FC<Props> = ({ service, onClose, onAddToPackage }) => {
  if (!service) return null;

  const [markupType, setMarkupType] = useState<'percent' | 'fixed'>('percent');
  const [markupValue, setMarkupValue] = useState<number>(15);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [internalNotes, setInternalNotes] = useState<string>('');

  const servicePrice = Number(service.price) || 0;

  useEffect(() => {
    let profit = markupType === 'percent' 
      ? (servicePrice * markupValue) / 100 
      : markupValue;
    
    if (isNaN(profit)) profit = 0;
    setFinalPrice(servicePrice + profit);
  }, [servicePrice, markupType, markupValue]);

  const handleAdd = () => {
    onAddToPackage({
      service,
      markupValue,
      markupType,
      finalPrice,
      internalNotes
    });
    onClose();
  };

  const lucroLiquido = (finalPrice || 0) - (servicePrice || 0);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-slide-in overflow-hidden border-l border-slate-100">
        
        {/* Header Profissional */}
        <div className="p-8 bg-slate-900 text-white flex items-center justify-between shrink-0 shadow-lg relative">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter italic">Gestão de Lucro</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.3em] mt-1">Configurador de Venda Final</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all border border-white/10 group">
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Resumo Rápido */}
          <section className="space-y-4">
             <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 relative shadow-inner">
                <span className="text-[9px] font-black text-slate-400 uppercase block mb-2 tracking-widest">Item Selecionado</span>
                <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight leading-tight">{service.title}</h3>
                <div className="mt-4 flex gap-6 items-center">
                   <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                      <span className="text-[10px] font-black text-slate-400 uppercase mr-2">Custo Net:</span>
                      <span className="text-xs font-black text-slate-900">{service.currency} {(servicePrice || 0).toLocaleString('pt-BR')}</span>
                   </div>
                   <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Rank #{service.ranking}</span>
                </div>
             </div>
          </section>

          {/* Controle de Markup - Visualmente Forte */}
          <section className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl space-y-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            
            <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] text-center border-b border-white/10 pb-6">Definir Margem de Lucro</h4>
            
            <div className="space-y-5">
              <label className="text-[10px] font-black text-slate-400 uppercase block text-center tracking-widest">Ajuste de Comissão</label>
              <div className="flex border-2 border-white/20 rounded-3xl overflow-hidden bg-white/5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all p-1">
                <input 
                  type="number" value={markupValue}
                  onChange={(e) => setMarkupValue(Number(e.target.value))}
                  className="flex-1 bg-transparent px-6 py-4 outline-none font-black text-3xl text-white w-20"
                />
                <select 
                  value={markupType}
                  onChange={(e) => setMarkupType(e.target.value as any)}
                  className="bg-white/10 px-6 text-[10px] font-black uppercase outline-none border-l border-white/10 text-blue-400 cursor-pointer hover:bg-white/20 transition-all"
                >
                  <option value="percent" className="bg-slate-900 text-white">Percentual (%)</option>
                  <option value="fixed" className="bg-slate-900 text-white">Fixo (R$)</option>
                </select>
              </div>
            </div>

            <div className="pt-10 border-t border-white/10 text-center space-y-6">
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Total para o Cliente</p>
                <p className="text-6xl font-black tracking-tighter italic leading-none flex items-center justify-center">
                  <span className="text-2xl font-bold text-white/20 mr-3">R$</span>
                  {(finalPrice || 0).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
              </div>
              
              <div className="inline-flex items-center gap-3 bg-emerald-500/10 text-emerald-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-500/30 shadow-lg animate-pulse">
                Lucro Líquido: +R$ {(lucroLiquido || 0).toLocaleString('pt-BR')} 📈
              </div>
            </div>
          </section>

          {/* Notas Profissionais */}
          <section className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
              <span className="text-lg">📝</span> Notas Internas do Pacote
            </label>
            <textarea 
              value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Ex: Tarifa bloqueada por 24h. Incluir bagagem de 23kg conforme negociado..."
              className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-[28px] text-sm font-medium focus:ring-8 focus:ring-blue-500/5 outline-none transition-all resize-none shadow-inner text-slate-700"
            />
          </section>

          <div className="pb-16 pt-6">
            <button 
              onClick={handleAdd}
              className="w-full py-6 bg-blue-600 text-white font-black rounded-3xl uppercase text-[12px] tracking-[0.3em] shadow-2xl hover:bg-blue-700 active:scale-95 transition-all transform hover:-translate-y-1"
            >
              Confirmar e Adicionar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default ServiceSaleDrawer;
