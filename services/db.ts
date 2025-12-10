
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserProfile } from '../App';

// --- Tipos ---

export interface DatabaseForm {
  id: string; 
  user_id: string;
  title: string;
  content: any;
  is_published: boolean;
  created_at: string;
  responses_count?: number; 
}

// --- Funções de Usuário ---

/**
 * Cria um novo usuário no banco de dados (tabela profiles).
 * @param userData Dados do usuário
 * @param password Senha (para fins do clone armazenada aqui, em produção usar Supabase Auth)
 */
export const registerUser = async (userData: UserProfile, password?: string): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured() || !supabase) {
        // Fallback local se DB não conectado
        return userData;
    }

    try {
        // Verifica se já existe
        const { data: existing } = await supabase
            .from('profiles')
            .select('email')
            .eq('email', userData.email)
            .single();

        if (existing) {
            console.warn("Usuário já existe");
            return null; // Email em uso
        }

        // Insere novo perfil
        const { data, error } = await supabase
            .from('profiles')
            .insert([{
                email: userData.email,
                name: userData.name,
                phone: userData.phone,
                // Em um app real, a senha NUNCA deve ser salva em texto plano numa tabela pública.
                // Aqui estamos fazendo isso apenas para atender ao requisito do "Clone" sem backend complexo.
                // O ideal seria supabase.auth.signUp()
                password_hash: password ? btoa(password) : null, // encoding simples só pra não ficar plain text visualmente
                auth_source: 'email',
                plan: 'Plano Grátis',
                responses_limit: 100,
                responses_used: 0
            }])
            .select()
            .single();

        if (error) {
            console.error("Erro ao registrar:", error);
            return null;
        }

        return {
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            cpf: data.cpf || "",
            plan: data.plan || "Plano Grátis",
            responsesUsed: data.responses_used || 0,
            responsesLimit: data.responses_limit || 100
        };

    } catch (e) {
        console.error("Exceção no registro:", e);
        return null;
    }
};

/**
 * Realiza login checando a tabela profiles (Modo Clone)
 */
export const loginUser = async (email: string, password?: string): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured() || !supabase) return null;

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) return null;

        // Verifica senha (decodificação simples do base64 feito no registro)
        if (password) {
            const storedHash = data.password_hash;
            if (!storedHash || atob(storedHash) !== password) {
                return null;
            }
        }

        return {
            name: data.name,
            email: data.email,
            phone: data.phone || "",
            cpf: data.cpf || "",
            plan: data.plan || "Plano Grátis",
            responsesUsed: data.responses_used || 0,
            responsesLimit: data.responses_limit || 100
        };
    } catch (e) {
        return null;
    }
};

export const getOrCreateUserProfile = async (authData: UserProfile, authSource: string = 'email'): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured() || !supabase) {
    return authData;
  }

  try {
      // 1. Tenta buscar perfil existente
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', authData.email)
        .single();

      if (profile) {
        return {
            name: profile.name || authData.name,
            email: profile.email || authData.email,
            phone: profile.phone || "",
            cpf: profile.cpf || "",
            plan: profile.plan || "Plano Grátis",
            responsesUsed: profile.responses_used || 0,
            responsesLimit: profile.responses_limit || 100
        };
      }
      
      // 2. Se não encontrou, Cria Automaticamente (Social Login)
      // Como o usuário já autenticou no Google/Microsoft, confiamos e criamos a conta.
      const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{
              email: authData.email,
              name: authData.name,
              auth_source: authSource, // Salva a origem (google, microsoft)
              plan: 'Plano Grátis',
              responses_limit: 100,
              responses_used: 0
          }])
          .select()
          .single();

      if (newProfile) {
          return {
              name: newProfile.name,
              email: newProfile.email,
              phone: newProfile.phone || "",
              cpf: newProfile.cpf || "",
              plan: newProfile.plan,
              responsesUsed: newProfile.responses_used,
              responsesLimit: newProfile.responses_limit
          };
      }

      return authData;

  } catch (e) {
      console.error("Erro ao sincronizar perfil:", e);
      return authData;
  }
};

// --- Funções de Formulário ---

export const getUserForms = async (userIdOrEmail: string): Promise<any[]> => {
    if (!isSupabaseConfigured() || !supabase) return [];

    try {
        // Tenta filtrar por user_id se for UUID ou email se fizemos o link assim.
        // Neste clone, vamos tentar filtrar por email na tabela forms se existir, 
        // ou assumir que precisamos criar uma relação. 
        // Para simplificar: vamos buscar forms onde o user_id seja o email do user (se alterarmos a tabela forms) 
        // OU, vamos buscar tudo por enquanto se não tiver RLS.
        
        // Estratégia do Clone: Vamos buscar forms associados ao email do perfil.
        // Primeiro pegamos o ID do perfil
        const { data: profile } = await supabase.from('profiles').select('id').eq('email', userIdOrEmail).single();
        
        if (!profile) return [];

        const { data, error } = await supabase
            .from('forms')
            .select('*, responses(count)')
            .eq('user_id', profile.id) // Assumindo que forms.user_id é FK para profiles.id
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Erro ao buscar forms:', error.message);
            return [];
        }

        return data.map((f: any) => ({
            id: f.id.toString(),
            title: f.title,
            responses: f.responses?.[0]?.count || 0
        }));
    } catch (e) {
        return [];
    }
};

export const createNewForm = async (userEmail: string, title: string) => {
    if (!isSupabaseConfigured() || !supabase) {
        return { id: Date.now().toString(), title, responses: 0 };
    }

    try {
        // Busca ID do usuario pelo email
        const { data: profile } = await supabase.from('profiles').select('id').eq('email', userEmail).single();
        
        if (!profile) throw new Error("Perfil não encontrado");

        const { data, error } = await supabase
            .from('forms')
            .insert([{ user_id: profile.id, title: title, content: {} }]) 
            .select()
            .single();

        if (error) throw error;
        
        return {
            id: data.id.toString(),
            title: data.title,
            responses: 0
        };
    } catch (e) {
        console.warn("Fallback local criação form:", e);
        return { id: Date.now().toString(), title, responses: 0 };
    }
};
