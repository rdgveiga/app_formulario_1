
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import CreateFormPage from './components/CreateFormPage';
import EditorPage from './components/EditorPage';
import DashboardPage from './components/DashboardPage';
import UserSettingsPage from './components/UserSettingsPage';
import TeamsPage from './components/TeamsPage';
import UpgradePage from './components/UpgradePage';
import ChatWidget from './components/ChatWidget';
import { getOrCreateUserProfile, getUserForms, createNewForm } from './services/db';

interface FormItem {
  id: string;
  title: string;
  responses: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  plan: string;
  responsesUsed: number;
  responsesLimit: number;
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'create' | 'editor' | 'settings' | 'teams' | 'upgrade'>('login');
  
  // State for forms management
  const [forms, setForms] = useState<FormItem[]>([]);

  // State for User Profile - Inicialmente null até o login
  const [user, setUser] = useState<UserProfile | null>(null);

  const [currentFormTitle, setCurrentFormTitle] = useState('');
  const [editorInitialTab, setEditorInitialTab] = useState('editor');

  // Load forms when user is set
  useEffect(() => {
    if (user && user.email) {
        const loadForms = async () => {
            // Em uma app real com Supabase Auth, usariamos o ID do usuário.
            // Aqui, usamos o email para simular a busca ou ID se disponível.
            const userForms = await getUserForms(user.email);
            setForms(userForms);
        };
        loadForms();
    }
  }, [user]);

  const handleLogin = async (userData: UserProfile) => {
    // Tenta sincronizar com o DB (ou usa o perfil local se falhar)
    try {
        const dbProfile = await getOrCreateUserProfile(userData);
        setUser(dbProfile || userData);
    } catch (e) {
        console.error("Erro ao sincronizar perfil, usando dados locais", e);
        setUser(userData);
    }
    setCurrentPage('dashboard');
  };

  const handleCreateNewClick = () => {
    setCurrentPage('create');
  };

  const handleCreateForm = async (title: string) => {
    // Optimistic update
    const tempId = Date.now().toString();
    const newForm: FormItem = {
      id: tempId,
      title: title,
      responses: 0
    };
    setForms([newForm, ...forms]);
    setCurrentFormTitle(title);
    setEditorInitialTab('editor');
    setCurrentPage('editor');

    // DB call
    if (user) {
        try {
            await createNewForm(user.email, title); // Usando email como ID temporário para compatibilidade com a demo
            // Em produção recarregariamos os forms para ter o ID real
        } catch (e) {
            console.error("Erro ao criar form no DB", e);
        }
    }
  };

  const handleSelectForm = (form: FormItem) => {
    setCurrentFormTitle(form.title);
    setEditorInitialTab('respostas'); 
    setCurrentPage('editor');
  };

  const handleUpdateUser = (updatedData: Partial<UserProfile>) => {
    if (user) {
        setUser({ ...user, ...updatedData });
    }
  };

  const handleUpgrade = () => {
    setCurrentPage('upgrade');
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa]">
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}
      
      {currentPage === 'dashboard' && user && (
        <DashboardPage 
          user={user}
          forms={forms}
          onCreateNew={handleCreateNewClick}
          onSelectForm={handleSelectForm}
          onOpenSettings={() => setCurrentPage('settings')}
          onOpenTeams={() => setCurrentPage('teams')}
          onLogout={() => setCurrentPage('login')}
          onUpgrade={handleUpgrade}
        />
      )}

      {currentPage === 'settings' && user && (
        <UserSettingsPage 
          user={user}
          onUpdateUser={handleUpdateUser}
          onBack={() => setCurrentPage('dashboard')}
          onOpenTeams={() => setCurrentPage('teams')}
          onLogout={() => setCurrentPage('login')}
          onUpgrade={handleUpgrade}
        />
      )}

      {currentPage === 'teams' && user && (
        <TeamsPage 
          user={user}
          onBack={() => setCurrentPage('dashboard')}
          onOpenSettings={() => setCurrentPage('settings')}
          onOpenTeams={() => setCurrentPage('teams')}
          onLogout={() => setCurrentPage('login')}
          onUpgrade={handleUpgrade}
        />
      )}

      {currentPage === 'upgrade' && user && (
        <UpgradePage 
          user={user}
          onBack={() => setCurrentPage('dashboard')}
          onOpenSettings={() => setCurrentPage('settings')}
          onOpenTeams={() => setCurrentPage('teams')}
          onLogout={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'create' && (
        <CreateFormPage 
          onBack={() => setCurrentPage('dashboard')} 
          onCreate={handleCreateForm}
        />
      )}
      
      {currentPage === 'editor' && (
        <EditorPage 
          formTitle={currentFormTitle}
          initialTab={editorInitialTab}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      
      <ChatWidget />
    </div>
  );
};

export default App;
