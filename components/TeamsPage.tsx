
import React, { useState } from 'react';
import { RespondiLogo } from './Icons';
import { UserProfile } from '../App';

interface TeamsPageProps {
  user: UserProfile;
  onBack: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenTeams: () => void;
  onUpgrade: () => void;
}

const TeamsPage: React.FC<TeamsPageProps> = ({ user, onBack, onLogout, onOpenSettings, onOpenTeams, onUpgrade }) => {
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
    <div className="min-h-screen bg-[#f8f9fa] font-inter text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20 shrink-0">
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
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl animate-fade-in">
            {/* Illustration Placeholder */}
            <div className="mb-8 flex justify-center">
                <div className="w-64 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        <path d="M20.2 12.87c.86.6 1.8 1.33 1.8 2.13v2h-3v-2c0-.36-.2-.7-.5-.98.34-.35.85-.75 1.7-1.15zM4.3 12.87c.85.4 1.36.8 1.7 1.15-.3.28-.5.62-.5.98v2h-3v-2c0-.8.94-1.53 1.8-2.13z" opacity="0.3"/>
                    </svg>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                Traga o seu time! 
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">Beta</span>
            </h1>
            
            <h2 className="text-lg text-gray-600 mb-10 max-w-lg mx-auto leading-relaxed">
                Trabalhar sozinho é chato. Crie times, adicione colegas, compartilhe acesso a formulários.
            </h2>

            <div>
                <button 
                    onClick={onUpgrade}
                    className="inline-block bg-[#111827] hover:bg-black text-white font-medium py-3 px-8 rounded shadow-sm hover:shadow transition duration-150 text-[15px]"
                >
                    Atualizar para o plano Empresas
                </button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default TeamsPage;
