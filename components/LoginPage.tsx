
import React, { useEffect, useRef, useState } from 'react';
import { MicrosoftIcon, RespondidoLogo } from './Icons';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../lib/authConfig";
import { UserProfile } from '../App';
import { registerUser, loginUser, getOrCreateUserProfile } from '../services/db';

// --- CONFIGURAÇÃO ---
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

// Helper para decodificar JWT
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
  
  // States
  const [view, setView] = useState<'login' | 'register'>('register'); // Padrão 'register' conforme imagem 1
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
          ...formData,
          [e.target.id]: e.target.value
      });
  };

  // --- Login Social: Microsoft ---
  const handleMicrosoftLogin = async () => {
    setError(null);
    try {
        const loginResponse = await instance.loginPopup(loginRequest);
        if (loginResponse && loginResponse.account) {
            const tempUser: UserProfile = {
                name: loginResponse.account.name || "Usuário Microsoft",
                email: loginResponse.account.username || "",
                phone: "",
                cpf: "",
                plan: "Plano Grátis",
                responsesUsed: 0,
                responsesLimit: 100
            };
            
            // Sincroniza com DB (Auth Source: Microsoft)
            setLoading(true);
            const dbUser = await getOrCreateUserProfile(tempUser, 'microsoft');
            setLoading(false);
            
            onLogin(dbUser || tempUser);
        }
    } catch (e: any) {
        console.error("Erro login Microsoft:", e);
        if (e.message?.includes("does not exist in tenant")) {
             setError("Erro de configuração Azure: Conta não suportada pelo locatário.");
        } else if (e.errorCode !== "user_cancelled") {
             setError("Não foi possível conectar com a Microsoft.");
        }
    }
  };

  // --- Login Social: Google ---
  const handleCredentialResponse = async (response: any) => {
    const payload = parseJwt(response.credential);
    
    if (payload) {
        const tempUser: UserProfile = {
            name: payload.name || "Usuário Google",
            email: payload.email || "",
            phone: "",
            cpf: "",
            plan: "Plano Grátis",
            responsesUsed: 0,
            responsesLimit: 100
        };

        // Sincroniza com DB (Auth Source: Google)
        setLoading(true);
        const dbUser = await getOrCreateUserProfile(tempUser, 'google');
        setLoading(false);

        onLogin(dbUser || tempUser);
    } else {
        setError("Erro ao processar login do Google.");
    }
  };

  // --- Login Manual (Email/Senha) ---
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        const user = await loginUser(formData.email, formData.password);
        if (user) {
            onLogin(user);
        } else {
            setError("E-mail ou senha incorretos.");
        }
    } catch (err) {
        setError("Erro ao tentar fazer login. Tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  // --- Cadastro Manual ---
  const handleRegisterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validação simples
      if (!formData.name || !formData.email || !formData.password) {
          setError("Preencha todos os campos obrigatórios.");
          return;
      }

      setLoading(true);
      try {
          const newUser: UserProfile = {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              cpf: "",
              plan: "Plano Grátis",
              responsesUsed: 0,
              responsesLimit: 100
          };

          const registeredUser = await registerUser(newUser, formData.password);
          if (registeredUser) {
              onLogin(registeredUser);
          } else {
              setError("Não foi possível criar a conta. O e-mail já pode estar em uso.");
          }
      } catch (err) {
          setError("Erro ao criar conta.");
      } finally {
          setLoading(false);
      }
  };

  // Inicializa Google Button
  useEffect(() => {
    const loadGoogle = () => {
        if (window.google && googleButtonRef.current) {
            if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== "YOUR_CLIENT_ID_HERE") {
                try {
                    window.google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleCredentialResponse,
                        auto_select: false,
                    });
                    window.google.accounts.id.renderButton(
                        googleButtonRef.current,
                        { 
                            type: 'standard', 
                            theme: 'outline', 
                            size: 'large', 
                            text: view === 'register' ? 'signup_with' : 'signin_with', // Muda texto do botão
                            shape: 'rectangular',
                            logo_alignment: 'left',
                            width: '366'
                        }
                    );
                } catch (error) { console.error(error); }
            }
        }
    };

    // Retry simples caso o script não tenha carregado ainda
    const timeout = setTimeout(loadGoogle, 500);
    const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (script) {
        script.addEventListener('load', loadGoogle);
    } else {
        const newScript = document.createElement('script');
        newScript.src = "https://accounts.google.com/gsi/client";
        newScript.async = true;
        newScript.defer = true;
        newScript.onload = loadGoogle;
        document.body.appendChild(newScript);
    }

    return () => clearTimeout(timeout);
  }, [view]);

  // --- RENDER ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#f8f9fa]">
      
      {/* Logo */}
      <div className="mb-8">
        <RespondidoLogo />
      </div>

      {/* Card Principal */}
      <div className="w-full max-w-[400px] bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        
        {/* Header Dinâmico */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-[28px] font-bold text-gray-900 mb-2 font-inter">
              {view === 'register' ? 'Criar conta' : 'Entrar'}
          </h1>
          <p className="text-[15px] text-gray-600">
              {view === 'register' 
                ? 'Cadastre-se e crie sua conta em 60 segundos.' 
                : 'Bem-vindo de volta! Entre com seus dados.'}
          </p>
        </div>

        {/* --- REGISTER FORM (MODO CADASTRO) --- */}
        {view === 'register' && (
            <>
                 <div className="space-y-3 mb-6">
                    {/* Google */}
                    <div className="w-full h-[40px] flex justify-center relative mb-1">
                        <div ref={googleButtonRef} className="w-full"></div>
                        {(!window.google || GOOGLE_CLIENT_ID === "YOUR_CLIENT_ID_HERE") && (
                            <button className="w-full h-full bg-white border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 font-medium text-sm">
                                <svg className="w-4 h-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                                Cadastrar com Google
                            </button>
                        )}
                    </div>
                    {/* Microsoft */}
                    <button onClick={handleMicrosoftLogin} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded transition flex items-center justify-center gap-2 text-sm h-[40px]">
                        <MicrosoftIcon />
                        <span>Cadastrar com Microsoft</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="relative flex py-2 items-center mb-6">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Se preferir, use seu e-mail</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        id="name" 
                        placeholder="Nome"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 text-[15px] text-gray-900 bg-white rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 text-[15px] text-gray-900 bg-white rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                    <input 
                        type="tel" 
                        id="phone" 
                        placeholder="Telefone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 text-[15px] text-gray-900 bg-white rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Crie uma senha"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 text-[15px] text-gray-900 bg-white rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    />

                    <p className="text-xs text-gray-500 mt-2">
                        Ao criar uma conta, você concorda com os nossos <a href="#" className="underline">Termos e Condições</a>.
                    </p>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#00c853] hover:bg-[#00bfa5] text-white font-medium py-3 px-4 rounded transition duration-150 flex items-center justify-center gap-2 text-[15px] mt-2"
                    >
                        {loading ? 'Criando...' : (
                            <>Criar conta <span className="text-lg leading-none">→</span></>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-center text-sm text-gray-600">
                   <span className="mr-2">Já possui uma conta?</span>
                   <button 
                        onClick={() => { setView('login'); setError(null); }}
                        className="bg-transparent hover:bg-gray-50 text-blue-600 font-semibold py-1 px-3 border border-blue-200 rounded text-xs transition-colors"
                   >
                     Entrar
                   </button>
                </div>
            </>
        )}

        {/* --- LOGIN FORM (MODO LOGIN) --- */}
        {view === 'login' && (
             <>
                 <div className="space-y-3 mb-6">
                    {/* Google */}
                    <div className="w-full h-[40px] flex justify-center relative mb-1">
                        <div ref={googleButtonRef} className="w-full"></div>
                        {(!window.google || GOOGLE_CLIENT_ID === "YOUR_CLIENT_ID_HERE") && (
                            <button className="w-full h-full bg-white border border-gray-300 rounded flex items-center justify-center gap-2 hover:bg-gray-50 text-gray-700 font-medium text-sm">
                                <svg className="w-4 h-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>
                                Entrar com Google
                            </button>
                        )}
                    </div>
                    {/* Microsoft */}
                    <button onClick={handleMicrosoftLogin} className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded transition flex items-center justify-center gap-2 text-sm h-[40px]">
                        <MicrosoftIcon />
                        <span>Entrar com Microsoft</span>
                    </button>
                </div>

                <div className="relative flex py-2 items-center mb-6">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">ou entre com e-mail</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 text-[15px] text-gray-900 bg-white rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Senha"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="block w-full px-3 py-3 text-[15px] text-gray-900 bg-white rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <div className="text-right">
                      <a href="#" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
                        Esqueceu sua senha?
                      </a>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#4054b2] hover:bg-[#324394] text-white font-medium py-3 px-4 rounded transition duration-150 flex items-center justify-center gap-2 text-[15px]"
                    >
                         {loading ? 'Entrando...' : (
                            <>Entrar com E-mail <span className="text-lg leading-none">→</span></>
                         )}
                    </button>
                </form>

                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-center text-sm text-gray-600">
                   <span className="mr-2">Não possui uma conta?</span>
                   <button 
                        onClick={() => { setView('register'); setError(null); }}
                        className="bg-transparent hover:bg-gray-50 text-green-600 font-semibold py-1 px-3 border border-green-200 rounded text-xs transition-colors"
                   >
                     Criar conta
                   </button>
                </div>
             </>
        )}

        {/* Error Feedback */}
        {error && (
             <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center">
                 {error}
             </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;
