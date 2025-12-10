
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import CreateFormPage from './components/CreateFormPage';
import EditorPage from './components/EditorPage';
import DashboardPage from './components/DashboardPage';
import UserSettingsPage from './components/UserSettingsPage';
import TeamsPage from './components/TeamsPage';
import UpgradePage from './components/UpgradePage';
import ChatWidget from './components/ChatWidget';

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

  // State for User Profile
  const [user, setUser] = useState<UserProfile>({
    name: "Rodrigo Veiga Baptista",
    email: "rodrigo@example.com",
    phone: "",
    cpf: "",
    plan: "Plano Grátis",
    responsesUsed: 0,
    responsesLimit: 100
  });

  const [currentFormTitle, setCurrentFormTitle] = useState('');
  const [editorInitialTab, setEditorInitialTab] = useState('editor');

  const handleLogin = () => {
    setCurrentPage('dashboard');
  };

  const handleCreateNewClick = () => {
    setCurrentPage('create');
  };

  const handleCreateForm = (title: string) => {
    const newForm: FormItem = {
      id: Date.now().toString(),
      title: title,
      responses: 0
    };
    setForms([newForm, ...forms]);
    setCurrentFormTitle(title);
    setEditorInitialTab('editor');
    setCurrentPage('editor');
  };

  const handleSelectForm = (form: FormItem) => {
    setCurrentFormTitle(form.title);
    setEditorInitialTab('respostas'); 
    setCurrentPage('editor');
  };

  const handleUpdateUser = (updatedData: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const handleUpgrade = () => {
    setCurrentPage('upgrade');
  };

  return (
    <div className="relative min-h-screen bg-[#f8f9fa]">
      {currentPage === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}
      
      {currentPage === 'dashboard' && (
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

      {currentPage === 'settings' && (
        <UserSettingsPage 
          user={user}
          onUpdateUser={handleUpdateUser}
          onBack={() => setCurrentPage('dashboard')}
          onOpenTeams={() => setCurrentPage('teams')}
          onLogout={() => setCurrentPage('login')}
          onUpgrade={handleUpgrade}
        />
      )}

      {currentPage === 'teams' && (
        <TeamsPage 
          user={user}
          onBack={() => setCurrentPage('dashboard')}
          onOpenSettings={() => setCurrentPage('settings')}
          onOpenTeams={() => setCurrentPage('teams')}
          onLogout={() => setCurrentPage('login')}
          onUpgrade={handleUpgrade}
        />
      )}

      {currentPage === 'upgrade' && (
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
