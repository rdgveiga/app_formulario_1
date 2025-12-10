
import React, { useState } from 'react';
import { RespondiLogo } from './Icons';
import { UserProfile } from '../App';

interface FormItem {
  id: string;
  title: string;
  responses: number;
}

interface DashboardPageProps {
  user: UserProfile;
  forms: FormItem[];
  onCreateNew: () => void;
  onSelectForm: (form: FormItem) => void;
  onOpenSettings: () => void;
  onOpenTeams: () => void;
  onLogout: () => void;
  onUpgrade: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, forms, onCreateNew, onSelectForm, onOpenSettings, onOpenTeams, onLogout, onUpgrade }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Helper to generate initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const userInitials = getInitials(user.name);

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-inter">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <div className="w-[100px]">
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
          
          {/* User Profile Dropdown Trigger */}
          <div className="relative">
            <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 focus:outline-none"
            >
                <div 
                    className="w-9 h-9 rounded-full bg-[#b4155a] text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition-opacity"
                    title="Perfil"
                >
                    {userInitials}
                </div>
                <svg 
                    className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                    viewBox="0 0 448 512" 
                    fill="currentColor"
                >
                    <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/>
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden animate-fade-in origin-top-right">
                        
                        {/* User Info */}
                        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#b4155a] text-white flex items-center justify-center font-bold shrink-0">
                                {userInitials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 leading-tight truncate mr-2">
                                        {user.name}
                                    </p>
                                    <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                                        ATIVO
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <button 
                                onClick={() => { onOpenTeams(); setIsProfileOpen(false); }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Seus times
                            </button>
                            <button 
                                onClick={() => { onOpenSettings(); setIsProfileOpen(false); }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Configurações
                            </button>
                            <button 
                                onClick={onLogout}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border-none bg-transparent placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-lg text-gray-600"
              placeholder="Pesquisar formulário"
            />
          </div>

          <button 
            onClick={onCreateNew}
            className="bg-[#5c6ac4] hover:bg-[#4f5bba] text-white font-medium py-2 px-4 rounded shadow-sm transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            Criar novo
          </button>
        </div>

        {/* Forms List */}
        <div className="space-y-4">
          {forms.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in border-2 border-dashed border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                   <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                   </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Você ainda não tem formulários</h3>
                <p className="text-gray-500 mb-6 text-sm">Crie seu primeiro formulário para começar a coletar respostas.</p>
                <button 
                  onClick={onCreateNew}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-md shadow-sm transition-colors text-sm"
                >
                  Criar meu primeiro formulário
                </button>
             </div>
          ) : (
            forms.map((form) => (
              <div 
                key={form.id}
                onClick={() => onSelectForm(form)}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow group animate-fade-in"
              >
                <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                        <path d="M7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
                    </svg>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{form.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {form.responses === 0 ? 'Nenhuma resposta' : `${form.responses} resposta${form.responses > 1 ? 's' : ''}`}
                  </p>
                </div>

                <div className="opacity-0 group-hover:opacity-100 text-gray-400 pr-2 transition-opacity">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
