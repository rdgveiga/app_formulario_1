
import React, { useState } from 'react';
import { RespondidoLogo } from './Icons';
import { UserProfile } from '../App';

interface UpgradePageProps {
  user: UserProfile;
  onBack: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenTeams: () => void;
}

const UpgradePage: React.FC<UpgradePageProps> = ({ user, onBack, onLogout, onOpenSettings, onOpenTeams }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Helper to generate initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userInitials = getInitials(user.name);

  // Pricing Data
  const pricing = {
    solo: {
        monthly: "R$ 69,00",
        yearly: "R$ 57,00"
    },
    pro: {
        monthly: "R$ 179,00",
        yearly: "R$ 147,00"
    },
    business: {
        monthly: "R$ 289,00",
        yearly: "R$ 237,00"
    }
  };

  // Feature Icons
  const CheckIcon = () => (
    <svg className="w-4 h-4 text-[#00c853] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 448 512">
        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
    </svg>
  );

  const CrossIcon = () => (
    <svg className="w-3 h-3 mt-1 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 384 512">
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
    </svg>
  );

  const InfoIcon = () => (
      <svg className="w-3 h-3 text-gray-300 ml-1 hover:text-gray-500 cursor-help transition-colors shrink-0" fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
  );

  // Helper component for list items
  const FeatureItem = ({ included, text, info = false }: { included: boolean, text: string, info?: boolean }) => (
      <li className={`flex items-start gap-3 text-sm ${included ? 'text-gray-800' : 'text-gray-400'}`}>
          {included ? <CheckIcon /> : <CrossIcon />}
          <span className="flex-1 leading-tight flex items-center">
              {text}
              {info && <InfoIcon />}
          </span>
      </li>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-inter text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
        <div className="flex items-center gap-4">
           <div className="w-[100px] cursor-pointer" onClick={onBack}>
             <RespondidoLogo className="w-full h-auto" />
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center">
             <button className="bg-[#00c853] hover:bg-[#00bfa5] text-white text-xs font-bold px-3 py-1.5 rounded uppercase transition-colors shadow-sm cursor-default">
                Faça upgrade!
             </button>
          </div>
          
          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
            >
                <div className="w-9 h-9 rounded-full bg-[#b4155a] text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity">
                    {userInitials}
                </div>
                <svg className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} viewBox="0 0 448 512" fill="currentColor"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
            </button>

            {isProfileOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden animate-fade-in origin-top-right">
                        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#b4155a] text-white flex items-center justify-center font-bold shrink-0">
                                {userInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 leading-tight truncate mr-2">
                                        {user.name}
                                    </p>
                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">ATIVO</span>
                                </div>
                            </div>
                        </div>
                        <div className="py-2">
                            <button onClick={() => { onOpenTeams(); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Seus times</button>
                            <button onClick={() => { onOpenSettings(); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Configurações</button>
                            <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Sair</button>
                        </div>
                    </div>
                </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full pb-20 overflow-y-auto">
        <header className="container mx-auto px-6 max-w-6xl mt-16 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Planos simples e transparentes</h1>
            <p className="text-gray-600 max-w-2xl text-lg">
                Lembre-se, somos uma empresa brasileira. Você paga sempre em real, sem taxas internacionais ou variação cambial. Oferecemos boleto para plano anual.
            </p>
        </header>

        <section className="container mx-auto px-6 max-w-[1400px] mt-12">
            
            {/* Toggle Tabs */}
            <div className="flex justify-center md:justify-start mb-8">
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    <button 
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Mensal
                    </button>
                    <button 
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Anual
                        <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded">20% off</span>
                    </button>
                </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Free Plan */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col hover:border-gray-300 transition-colors shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Grátis</h2>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">R$ 0,00</h3>
                    <p className="text-sm text-gray-500 mb-8 mt-4 min-h-[40px]">Para pequenos projetos pessoais que estão iniciando</p>
                    
                    <button className="w-full bg-gray-100 text-gray-400 font-bold py-3 rounded mb-8 cursor-default">
                        Plano atual
                    </button>

                    <ul className="space-y-4 flex-1">
                        <FeatureItem included={true} text="100 respostas por mês" info={true} />
                        <FeatureItem included={true} text="3 formulários" />
                        <FeatureItem included={true} text="Recebe até 100MB em arquivos" />
                        <FeatureItem included={true} text="Personalize cores e logotipo" />
                        <FeatureItem included={true} text="Busca de CEP" info={true} />
                        <FeatureItem included={true} text="Suporte em português" info={true} />
                        <FeatureItem included={false} text="Remover a nossa marca" />
                        <FeatureItem included={false} text="Redirecionar ao final" />
                        <FeatureItem included={false} text="Exigir e-mail de trabalho" />
                        <FeatureItem included={false} text="Validação de CPF e CNPJ" />
                        <FeatureItem included={false} text="Integração com Calendly" />
                        <FeatureItem included={false} text="Google Analytics" />
                        <FeatureItem included={false} text="Facebook Pixel" />
                        <FeatureItem included={false} text="Google Tag Manager" />
                        <FeatureItem included={false} text="Múltiplos usuários" />
                        <FeatureItem included={false} text="Times e Permissões" />
                        <FeatureItem included={false} text="Domínio personalizado" />
                    </ul>
                </div>

                {/* Solo Plan */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col hover:border-gray-300 transition-colors shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Solo</h2>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1 flex items-end gap-1">
                        {billingCycle === 'yearly' ? pricing.solo.yearly : pricing.solo.monthly}
                        <div className="flex flex-col items-start ml-1">
                            <span className="text-xs text-gray-500 font-normal">/ mês</span>
                            {billingCycle === 'yearly' && <span className="text-[10px] text-gray-400 font-normal leading-none">(pago anual)</span>}
                        </div>
                    </h3>
                    <p className="text-sm text-gray-500 mb-8 mt-4 min-h-[40px]">Para projetos pessoais que precisam de mais recursos</p>
                    
                    <button className="w-full bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded mb-8 transition-colors shadow-sm">
                        Assinar →
                    </button>

                    <ul className="space-y-4 flex-1">
                        <FeatureItem included={true} text="1.000 respostas por mês" info={true} />
                        <FeatureItem included={true} text="Formulários ilimitados" />
                        <FeatureItem included={true} text="Recebe até 1 GB em arquivos" />
                        <FeatureItem included={true} text="Personalize cores e logotipo" />
                        <FeatureItem included={true} text="Busca de CEP" info={true} />
                        <FeatureItem included={true} text="Suporte em português" info={true} />
                        <FeatureItem included={false} text="Remover a nossa marca" />
                        <FeatureItem included={false} text="Redirecionar ao final" />
                        <FeatureItem included={false} text="Exigir e-mail de trabalho" />
                        <FeatureItem included={false} text="Validação de CPF e CNPJ" />
                        <FeatureItem included={false} text="Integração com Calendly" />
                        <FeatureItem included={false} text="Google Analytics" />
                        <FeatureItem included={false} text="Facebook Pixel" />
                        <FeatureItem included={false} text="Google Tag Manager" />
                        <FeatureItem included={false} text="Múltiplos usuários" />
                        <FeatureItem included={false} text="Times e Permissões" />
                        <FeatureItem included={false} text="Domínio personalizado" />
                    </ul>
                </div>

                {/* Pro Plan */}
                <div className="bg-white border-2 border-blue-500 rounded-lg p-6 flex flex-col shadow-lg relative transform md:-translate-y-2 z-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">PRO</h2>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1 flex items-end gap-1">
                        {billingCycle === 'yearly' ? pricing.pro.yearly : pricing.pro.monthly}
                        <div className="flex flex-col items-start ml-1">
                            <span className="text-xs text-gray-500 font-normal">/ mês</span>
                            {billingCycle === 'yearly' && <span className="text-[10px] text-gray-400 font-normal leading-none">(pago anual)</span>}
                        </div>
                    </h3>
                    <p className="text-sm text-gray-500 mb-8 mt-4 min-h-[40px]">Para projetos profissionais com campos exclusivos</p>
                    
                    <button className="w-full bg-[#5c6ac4] hover:bg-[#4f5bba] text-white font-bold py-3 rounded mb-8 transition-colors shadow-md">
                        Assinar →
                    </button>

                    <ul className="space-y-4 flex-1">
                        <FeatureItem included={true} text="5.000 respostas por mês" info={true} />
                        <FeatureItem included={true} text="Formulários ilimitados" />
                        <FeatureItem included={true} text="Recebe até 5 GB em arquivos" />
                        <FeatureItem included={true} text="Personalize cores e logotipo" />
                        <FeatureItem included={true} text="Busca de CEP" info={true} />
                        <FeatureItem included={true} text="Suporte em português" info={true} />
                        <FeatureItem included={true} text="Remover a nossa marca" info={true} />
                        <FeatureItem included={true} text="Redirecionar ao final" info={true} />
                        <FeatureItem included={true} text="Exigir e-mail de trabalho" info={true} />
                        <FeatureItem included={true} text="Validação de CPF e CNPJ" info={true} />
                        <FeatureItem included={true} text="Integração com Calendly" info={true} />
                        <FeatureItem included={true} text="Google Analytics" info={true} />
                        <FeatureItem included={true} text="Facebook Pixel" info={true} />
                        <FeatureItem included={true} text="Google Tag Manager" info={true} />
                        <FeatureItem included={false} text="Múltiplos usuários" />
                        <FeatureItem included={false} text="Times e Permissões" />
                        <FeatureItem included={false} text="Domínio personalizado" />
                    </ul>
                </div>

                {/* Business Plan */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col hover:border-gray-300 transition-colors shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Empresa</h2>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1 flex items-end gap-1">
                        {billingCycle === 'yearly' ? pricing.business.yearly : pricing.business.monthly}
                        <div className="flex flex-col items-start ml-1">
                            <span className="text-xs text-gray-500 font-normal">/ mês</span>
                            {billingCycle === 'yearly' && <span className="text-[10px] text-gray-400 font-normal leading-none">(pago anual)</span>}
                        </div>
                    </h3>
                    <p className="text-sm text-gray-500 mb-8 mt-4 min-h-[40px]">Para empresas e times que precisam colaborar</p>
                    
                    <button className="w-full bg-[#111827] hover:bg-black text-white font-bold py-3 rounded mb-8 transition-colors shadow-sm">
                        Assinar →
                    </button>

                    <ul className="space-y-4 flex-1">
                        <FeatureItem included={true} text="15.000 respostas por mês" info={true} />
                        <FeatureItem included={true} text="Formulários ilimitados" />
                        <FeatureItem included={true} text="Recebe até 10 GB em arquivos" />
                        <FeatureItem included={true} text="Personalize cores e logotipo" />
                        <FeatureItem included={true} text="Busca de CEP" info={true} />
                        <FeatureItem included={true} text="Suporte em português" info={true} />
                        <FeatureItem included={true} text="Remover a nossa marca" info={true} />
                        <FeatureItem included={true} text="Redirecionar ao final" info={true} />
                        <FeatureItem included={true} text="Exigir e-mail de trabalho" info={true} />
                        <FeatureItem included={true} text="Validação de CPF e CNPJ" info={true} />
                        <FeatureItem included={true} text="Integração com Calendly" info={true} />
                        <FeatureItem included={true} text="Google Analytics" info={true} />
                        <FeatureItem included={true} text="Facebook Pixel" info={true} />
                        <FeatureItem included={true} text="Google Tag Manager" info={true} />
                        <FeatureItem included={true} text="Múltiplos usuários" info={true} />
                        <FeatureItem included={true} text="Times e Permissões" info={true} />
                        <FeatureItem included={true} text="Domínio personalizado" info={true} />
                    </ul>
                </div>

            </div>
        </section>

        <section className="container mx-auto px-6 max-w-6xl mt-20 mb-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 border-t border-gray-200 pt-12">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Boleto bancário?</h3>
                <p className="text-gray-600 text-sm">
                    Nós aceitamos pagamento com boleto bancário nos planos anuais, <button className="text-blue-600 font-semibold hover:underline">solicite aqui</button>.
                </p>
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Precisa de mais recursos?</h3>
                <p className="text-gray-600 text-sm">
                    Se você precisa de um número maior de recursos, <button className="text-blue-600 font-semibold hover:underline">converse com a gente</button> sobre um plano customizado.
                </p>
            </div>
        </section>
      </main>
    </div>
  );
};

export default UpgradePage;
