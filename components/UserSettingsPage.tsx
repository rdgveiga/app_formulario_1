
import React, { useState, useEffect } from 'react';
import { RespondiLogo } from './Icons';
import { UserProfile } from '../App';

interface UserSettingsPageProps {
  user: UserProfile;
  onUpdateUser: (data: Partial<UserProfile>) => void;
  onBack: () => void;
  onOpenTeams: () => void;
  onLogout: () => void;
  onUpgrade: () => void;
}

const UserSettingsPage: React.FC<UserSettingsPageProps> = ({ user, onUpdateUser, onBack, onOpenTeams, onLogout, onUpgrade }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Local state for editing form
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    cpf: user.cpf
  });

  // Helper to generate initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userInitials = getInitials(user.name);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
  };

  const handleSave = () => {
      onUpdateUser(formData);
      // Optional: Show success message toast
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-inter text-gray-900">
      {/* Header - Reused style from Dashboard */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <div className="w-[100px] cursor-pointer" onClick={onBack}>
             <RespondiLogo className="w-full h-auto" />
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onUpgrade}
            className="bg-[#00c853] hover:bg-[#00bfa5] text-white text-xs font-bold px-3 py-1.5 rounded uppercase transition-colors shadow-sm"
          >
            Faça upgrade!
          </button>
          
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
                            <button onClick={() => { onOpenTeams(); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors bg-gray-50 font-medium">Seus times</button>
                            <button onClick={() => { setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Configurações</button>
                            <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Sair</button>
                        </div>
                    </div>
                </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sua conta</h1>
            <p className="text-gray-500">Configurações da sua conta.</p>
        </div>

        <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Plano atual</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                <div>
                    <div className="text-lg font-bold text-gray-900 mb-1">{user.plan}</div>
                    <div className="text-sm text-gray-600 mb-1">{user.responsesUsed}/{user.responsesLimit} respostas recebidas</div>
                    <div className="text-xs text-gray-400">O limite atualiza no 1º dia do mês</div>
                </div>
                <button 
                    onClick={onUpgrade}
                    className="bg-[#00C853] hover:bg-[#00BFA5] text-white text-sm font-bold py-2 px-4 rounded shadow-sm transition-colors uppercase"
                >
                    Assinar um plano
                </button>
            </div>
        </section>

        <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Dados pessoais</h2>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" 
                        placeholder="Sua resposta..." 
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" 
                        placeholder="Sua resposta..." 
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone</label>
                    <p className="text-xs text-gray-500 mb-2">É por esse número que você receberá informações importantes sobre a sua conta.</p>
                    <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white mb-2" 
                        placeholder="(xx) xxxxx-xxxx" 
                    />
                    
                    <span className="inline-block bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded mb-4">NÃO VERIFICADO</span>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded p-4 flex flex-col items-start gap-3">
                        <p className="text-sm text-blue-800">Verifique seu telefone para poder utilizar este número para recuperar sua conta caso necessário</p>
                        <button className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold py-1.5 px-3 rounded transition-colors uppercase">
                            Enviar código de verificação
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        CPF/CNPJ
                        <div className="group relative">
                            <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                A nota fiscal será emitida automaticamente em até 5 dias após um pagamento.
                            </div>
                        </div>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Informe o CPF ou CNPJ para emissão da nota fiscal</p>
                    <input 
                        type="text" 
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" 
                        placeholder="CPF/CNPJ" 
                    />
                </div>

                <div className="pt-2">
                    <button 
                        onClick={handleSave}
                        className="bg-[#111827] hover:bg-black text-white font-medium py-2 px-6 rounded shadow-sm transition-colors text-sm"
                    >
                        Atualizar
                    </button>
                </div>
            </div>
        </section>

        <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Segurança</h2>
            <button className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded shadow-sm transition-colors text-sm">
                Solicitar alteração de senha
            </button>
        </section>

      </main>
    </div>
  );
};

export default UserSettingsPage;
