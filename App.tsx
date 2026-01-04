
import React, { useState, useEffect } from 'react';
import { SearchParams, ServiceOption, PackageItem, ServiceCategory, TravelCategory } from './types';
import { searchTravelServices } from './geminiService';
import ServiceCard from './components/ServiceCard';
import ServiceSaleDrawer from './components/ServiceSaleDrawer';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'BUSCA' | 'PACOTE'>('BUSCA');
  const [results, setResults] = useState<Partial<Record<ServiceCategory, ServiceOption[]>>>({});
  const [currentPackage, setCurrentPackage] = useState<PackageItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Cálculo robusto para evitar erros de renderização
  const totalPacote = currentPackage.reduce((acc, item) => acc + (Number(item.finalPrice) || 0), 0);

  const getDefaultStartDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [params, setParams] = useState<SearchParams>({
    destination: '',
    origin: '',
    startDate: getDefaultStartDate(),
    endDate: '',
    passengers: 1,
    categories: ['FLIGHT', 'HOTEL'],
    travelCategory: 'STANDARD'
  });

  const handleQuickDate = (days: number) => {
    const start = new Date(params.startDate || new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + days);
    setParams({ ...params, endDate: end.toISOString().split('T')[0] });
  };

  const toggleCategory = (cat: ServiceCategory) => {
    setParams(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat) 
        : [...prev.categories, cat]
    }));
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (params.endDate && params.startDate && new Date(params.endDate) < new Date(params.startDate)) {
      alert("⚠️ A data de volta deve ser posterior à data de ida.");
      return;
    }

    if (!params.destination) {
      alert("⚠️ Informe o destino para realizar a busca.");
      return;
    }

    setLoading(true);
    setResults({}); // Limpa resultados anteriores para dar feedback de carregamento
    try {
      const { results: searchResults } = await searchTravelServices(params);
      setResults(searchResults);
      const initialCollapsed: Record<string, boolean> = {};
      Object.keys(searchResults).forEach(k => initialCollapsed[k] = false); // Abre por padrão após busca
      setCollapsedCategories(initialCollapsed);
      setActiveTab('BUSCA');
    } catch (error) {
      alert("Erro na busca inteligente. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans antialiased text-slate-900">
      <header className="bg-slate-900 text-white pt-8 pb-16 px-4 sticky top-0 z-[60] shadow-2xl border-b border-white/5">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">✈️</div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tighter italic">Busca Viagens Lucrativas</h1>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] opacity-80">Sourcing de Alta Performance</p>
              </div>
            </div>
            
            <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full md:w-auto">
              <button onClick={() => setActiveTab('BUSCA')} className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'BUSCA' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400'}`}>Busca de Ofertas</button>
              <button onClick={() => setActiveTab('PACOTE')} className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'PACOTE' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400'}`}>Minha Cotação ({currentPackage.length})</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 -mt-8 relative z-20">
        {activeTab === 'BUSCA' && (
          <div className="space-y-8">
            <form onSubmit={handleSearch} className="bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 md:p-10 space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">📍 Destino Final</label>
                  <input required type="text" placeholder="CIDADE OU PAÍS" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800 uppercase text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" value={params.destination} onChange={e => setParams({...params, destination: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">🛫 Origem (Partida)</label>
                  <input type="text" placeholder="AEROPORTO OU CIDADE" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 font-bold text-slate-800 uppercase text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" value={params.origin} onChange={e => setParams({...params, origin: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Calendário de Viagem</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex bg-slate-50 border border-slate-200 rounded-2xl p-4 gap-4 items-center">
                    <div className="flex-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Ida</p>
                      <input type="date" className="bg-transparent font-black text-slate-800 outline-none w-full text-xs" value={params.startDate} onChange={e => setParams({...params, startDate: e.target.value})} />
                    </div>
                    <div className="w-[1px] h-8 bg-slate-200"></div>
                    <div className="flex-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Volta</p>
                      <input type="date" className="bg-transparent font-black text-slate-800 outline-none w-full text-xs" value={params.endDate} onChange={e => setParams({...params, endDate: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {[3, 5, 7, 15].map(d => (
                      <button key={d} type="button" onClick={() => handleQuickDate(d)} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">+{d} Dias</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Serviços Obrigatórios</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    {id: 'FLIGHT', label: 'Voos', icon: '✈️'},
                    {id: 'HOTEL', label: 'Hotéis', icon: '🏨'},
                    {id: 'TRANSFER', label: 'Transfers', icon: '🚐'},
                    {id: 'EXPERIENCE', label: 'Experiências', icon: '🎟️'}
                  ].map(item => (
                    <button key={item.id} type="button" onClick={() => toggleCategory(item.id as ServiceCategory)} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${params.categories.includes(item.id as ServiceCategory) ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400'}`}>
                      <span>{item.icon}</span> {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 pt-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-2">Perfil do Passageiro</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                    {(['ECONOMIC', 'STANDARD', 'LUXURY'] as TravelCategory[]).map(cat => (
                      <button key={cat} type="button" onClick={() => setParams({...params, travelCategory: cat})} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all ${params.travelCategory === cat ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}>
                        {cat === 'ECONOMIC' ? 'Econômico' : cat === 'STANDARD' ? 'Padrão' : 'Luxo'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:w-1/3 flex items-end">
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3">
                    {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'BUSCAR MELHORES OFERTAS'}
                  </button>
                </div>
              </div>
            </form>

            <div className="space-y-6">
              {Object.entries(results).map(([cat, items]) => {
                const serviceItems = items as ServiceOption[];
                const isCollapsed = collapsedCategories[cat];
                if (!serviceItems || serviceItems.length === 0) return null;

                return (
                  <section key={cat} className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm animate-slide-up">
                    <button onClick={() => setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }))} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4 text-left">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${cat === 'FLIGHT' ? 'bg-blue-100 text-blue-600' : 'bg-rose-100 text-rose-600'}`}>{cat === 'FLIGHT' ? '✈️' : cat === 'HOTEL' ? '🏨' : cat === 'TRANSFER' ? '🚐' : '🎟️'}</div>
                        <div>
                          <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">{cat === 'FLIGHT' ? 'Voos Mapeados' : cat === 'HOTEL' ? 'Hospedagens' : cat === 'TRANSFER' ? 'Transfers' : 'Passeios'}</h2>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{serviceItems.length} opções encontradas</p>
                        </div>
                      </div>
                      <div className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}><svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg></div>
                    </button>
                    {!isCollapsed && <div className="p-6 pt-0 grid grid-cols-1 gap-6">{serviceItems.map(s => <ServiceCard key={s.id} service={s} onSelect={setSelectedService} />)}</div>}
                  </section>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'PACOTE' && (
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl border border-slate-100 animate-fade-in max-w-4xl mx-auto border-t-8 border-t-blue-600">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <h2 className="text-2xl font-black italic tracking-tighter">Proposta de <span className="text-blue-600">Viagem</span></h2>
              <div className="flex gap-3">
                <button onClick={() => window.print()} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Imprimir PDF</button>
                <button 
                  onClick={() => {
                    const msg = `*PROPOSTA DE VIAGEM*%0A%0A${currentPackage.map(p => `✅ *${p.service.category}:* ${p.service.title}`).join('%0A')}%0A%0A💰 *TOTAL: R$ ${(totalPacote || 0).toLocaleString('pt-BR')}*`;
                    window.open(`https://wa.me/?text=${msg}`, '_blank');
                  }}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                >Enviar WhatsApp</button>
              </div>
            </div>
            {currentPackage.length === 0 ? (
              <div className="py-20 text-center opacity-30 text-sm font-black uppercase tracking-widest">Nenhum item selecionado</div>
            ) : (
              <div className="space-y-6">
                {currentPackage.map(item => (
                  <div key={item.id} className="flex gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
                    <button onClick={() => setCurrentPackage(prev => prev.filter(i => i.id !== item.id))} className="absolute top-4 right-4 text-rose-400 p-2">✕</button>
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shrink-0">{item.service.category === 'FLIGHT' ? '✈️' : '🏨'}</div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-900 uppercase italic text-sm">{item.service.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.service.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Preço Final</p>
                      <p className="text-xl font-black text-slate-900">R$ {(Number(item.finalPrice) || 0).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-10 border-t-2 border-slate-100 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total da Cotação</p>
                  <p className="text-5xl font-black text-blue-600 italic">R$ {(totalPacote || 0).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <ServiceSaleDrawer 
        service={selectedService} 
        onClose={() => setSelectedService(null)}
        onAddToPackage={item => setCurrentPackage(prev => [...prev, { ...item, id: `${item.service.id}-${Date.now()}` }])}
      />

      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto shadow-2xl"></div>
            <h3 className="text-white text-lg font-black uppercase tracking-widest italic animate-pulse">Sourcing em Tempo Real...</h3>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-slide-up { animation: slideUp 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
