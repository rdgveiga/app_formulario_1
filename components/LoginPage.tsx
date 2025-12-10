
import React, { useEffect, useRef } from 'react';
import { MicrosoftIcon, RespondiLogo } from './Icons';

// --- CONFIGURAÇÃO ---
// Cole seu Client ID do Google Cloud aqui
const GOOGLE_CLIENT_ID = "YOUR_CLIENT_ID_HERE"; 
// --------------------

interface LoginPageProps {
  onLogin: () => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleCredentialResponse = (response: any) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // Aqui você enviaria o token para seu backend para validação real.
    // Para este frontend, vamos apenas prosseguir.
    onLogin();
  };

  useEffect(() => {
    // Carrega o script do Google Identity Services se ainda não estiver carregado
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Renderiza o botão oficial do Google dentro da nossa div
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { 
            type: 'standard', 
            theme: 'outline', 
            size: 'large', 
            text: 'sign_in_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: '366' // Tenta preencher a largura (pode variar dependendo do container pai)
          }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup se necessário
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <div className="mb-8">
        <RespondiLogo />
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[400px]">
        
        {/* Header Text */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-gray-900 mb-2 font-inter">Entrar</h1>
          <p className="text-[15px] text-gray-600">Entre com seus dados de acesso.</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          {/* Google Button Container (Renderizado pelo script do Google) */}
          <div className="w-full h-[46px] flex justify-center">
             <div ref={googleButtonRef} className="w-full"></div>
             {/* Fallback visual caso o JS falhe ou Client ID seja inválido */}
             {!window.google && (
                 <div className="w-full h-full bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                    Aguardando Google...
                 </div>
             )}
          </div>
          
          <button 
            onClick={onLogin} 
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded transition duration-150 flex items-center justify-center gap-3 shadow-sm text-[15px]"
          >
            <MicrosoftIcon />
            <span>Entrar com Microsoft</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Se preferir...</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative group">
              <input 
                type="email" 
                id="email"
                placeholder=" "
                className="block px-3 pb-2.5 pt-4 w-full text-[15px] text-gray-900 bg-white rounded border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer h-[50px]"
              />
              <label 
                htmlFor="email" 
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                E-mail
              </label>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <input 
                type="password" 
                id="password"
                placeholder=" "
                className="block px-3 pb-2.5 pt-4 w-full text-[15px] text-gray-900 bg-white rounded border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 peer h-[50px]"
              />
              <label 
                htmlFor="password" 
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Sua senha
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full bg-[#111827] hover:bg-black text-white font-medium py-3 px-4 rounded transition duration-150 flex items-center justify-center gap-2 text-[15px]"
              >
                Entrar <span className="text-lg leading-none">→</span>
              </button>
            </div>
            
            {/* Forgot Password */}
            <div className="text-center mt-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                Esqueceu sua senha?
              </a>
            </div>
          </div>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-transparent flex items-center justify-center text-sm text-gray-600">
           <span className="mr-2">Não possui uma conta?</span>
           <button className="bg-transparent hover:bg-gray-50 text-gray-900 font-semibold py-1.5 px-3 border border-gray-300 rounded text-xs transition-colors">
             Criar conta
           </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
