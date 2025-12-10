
import React, { useEffect, useRef, useState } from 'react';
import { MicrosoftIcon, RespondidoLogo } from './Icons';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../lib/authConfig";
import { UserProfile } from '../App';

// --- CONFIGURAÇÃO ---
// Use process.env para variáveis de ambiente
// Na Vercel, defina a variável VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = process.env.VITE_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID_HERE"; 
// --------------------

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

// Helper simples para decodificar JWT (sem precisar de libs externas pesadas)
const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { instance } = useMsal();
  const [loginError, setLoginError] = useState<string | null>(null);

  // --- Lógica de Login Microsoft ---
  const handleMicrosoftLogin = async () => {
    setLoginError(null);
    try {
        const loginResponse = await instance.loginPopup(loginRequest);
        if (loginResponse && loginResponse.account) {
            console.log("Microsoft Login Sucesso:", loginResponse.account);
            
            // Cria o perfil baseado na resposta da Microsoft
            const userProfile: UserProfile = {
                name: loginResponse.account.name || "Usuário Microsoft",
                email: loginResponse.account.username || "",
                phone: "",
                cpf: "",
                plan: "Plano Grátis",
                responsesUsed: 0,
                responsesLimit: 100
            };
            
            onLogin(userProfile);
        }
    } catch (e: any) {
        console.error("Erro no login Microsoft:", e);
        
        // Tratamento de erros comuns para feedback visual
        if (e.message?.includes("does not exist in tenant") || e.message?.includes("não existe no locatário")) {
             setLoginError("Erro de configuração: O tipo da conta não é suportado pelo aplicativo (Verifique o 'signInAudience' no Azure).");
        } else if (e.errorCode === "user_cancelled") {
             setLoginError(null); // Usuário fechou o popup, não é erro crítico
        } else {
             setLoginError("Não foi possível conectar com a Microsoft. Tente novamente.");
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fallback para login manual (demo)
    const demoUser: UserProfile = {
        name: "Usuário Demo",
        email: "demo@respondido.app",
        phone: "",
        cpf: "",
        plan: "Plano Grátis",
        responsesUsed: 0,
        responsesLimit: 100
    };
    onLogin(demoUser);
  };

  const handleCredentialResponse = (response: any) => {
    // Decodifica o token do Google para pegar dados do usuário
    const payload = parseJwt(response.credential);
    
    if (payload) {
        console.log("Google Login Payload:", payload);
        const userProfile: UserProfile = {
            name: payload.name || "Usuário Google",
            email: payload.email || "",
            phone: "",
            cpf: "",
            plan: "Plano Grátis",
            responsesUsed: 0,
            responsesLimit: 100
        };
        onLogin(userProfile);
    } else {
        console.error("Falha ao decodificar token do Google");
        setLoginError("Erro ao processar login do Google.");
    }
  };

  useEffect(() => {
    // Carrega o script do Google Identity Services se ainda não estiver carregado
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        // Verifica se o Client ID foi configurado (não é o placeholder)
        if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "YOUR_CLIENT_ID_HERE") {
            try {
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
            } catch (error) {
                console.error("Erro ao inicializar Google Sign-In:", error);
            }
        } else {
            console.warn("Google Client ID não configurado.");
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup se necessário
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <div className="mb-8">
        <RespondidoLogo />
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
          <div className="w-full h-[46px] flex justify-center relative">
             <div ref={googleButtonRef} className="w-full z-10"></div>
             
             {/* Fallback/Placeholder se a config estiver ausente ou script falhar */}
             {(!window.google || GOOGLE_CLIENT_ID === "YOUR_CLIENT_ID_HERE") && (
                 <button 
                    onClick={() => onLogin({ name: "Usuário Teste", email: "teste@exemplo.com", phone: "", cpf: "", plan: "Grátis", responsesUsed: 0, responsesLimit: 100 })} // Fallback para login direto
                    className="absolute inset-0 w-full h-full bg-white border border-gray-300 rounded flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors z-0"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium text-[15px]">Fazer Login com o Google</span>
                 </button>
             )}
          </div>
          
          <button 
            onClick={handleMicrosoftLogin} 
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded transition duration-150 flex items-center justify-center gap-3 shadow-sm text-[15px]"
          >
            <MicrosoftIcon />
            <span>Entrar com Microsoft</span>
          </button>
        </div>

        {/* Error Message Display */}
        {loginError && (
             <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center">
                 {loginError}
             </div>
        )}

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
