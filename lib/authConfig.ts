
import { Configuration, PopupRequest } from "@azure/msal-browser";

// Configuração do MSAL
// IMPORTANTE: Se receber erro "does not exist in tenant Microsoft Services",
// verifique no Portal Azure > App Registration > Authentication se o 
// "Supported account types" está marcado como:
// "Accounts in any organizational directory and personal Microsoft accounts"
export const msalConfig: Configuration = {
    auth: {
        clientId: process.env.VITE_MICROSOFT_CLIENT_ID || "YOUR_MICROSOFT_CLIENT_ID",
        // "common": Suporta contas pessoais e corporativas (se o app for multitenant+personal no Azure)
        // "consumers": Suporta APENAS contas pessoais (se o app for Personal only no Azure)
        // "organizations": Suporta APENAS contas corporativas
        authority: "https://login.microsoftonline.com/common", 
        redirectUri: window.location.origin, // Detecta automaticamente localhost ou vercel
    },
    cache: {
        cacheLocation: "sessionStorage", // Isso ajuda a manter o login ao recarregar a página
        storeAuthStateInCookie: false,
    }
};

// Escopos que solicitaremos ao usuário
export const loginRequest: PopupRequest = {
    scopes: ["User.Read"]
};
