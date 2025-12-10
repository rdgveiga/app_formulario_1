
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserProfile } from '../App';

// --- Tipos ---

export interface DatabaseForm {
  id: string; // Supabase usa BigInt, mas front trata melhor como string nos IDs
  user_id: string;
  title: string;
  content: any; // JSON do conteúdo do form (perguntas, estilos)
  is_published: boolean;
  created_at: string;
  responses_count?: number; // Campo virtual/join
}

// --- Funções de Usuário ---

export const getOrCreateUserProfile = async (authData: UserProfile): Promise<UserProfile | null> => {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn("Supabase não configurado. Usando dados locais.");
    return authData;
  }

  // Tenta buscar perfil existente pelo email
  try {
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
      
      // Se não encontrou, retornamos o authData para uso local
      // (Em um cenário real, fariamos um Insert, mas isso requer que o Auth User ID exista no Supabase)
      return authData;

  } catch (e) {
      console.error("Erro ao buscar perfil:", e);
      return authData;
  }
};

// --- Funções de Formulário ---

export const getUserForms = async (userIdOrEmail: string): Promise<any[]> => {
    if (!isSupabaseConfigured() || !supabase) return [];

    // Tenta buscar forms (em um cenário real de clone simples, podemos não ter FKs estritas)
    // Se a tabela usar UUID para user_id, a query por email vai falhar se não fizermos join.
    // Para este demo, vamos retornar vazio se der erro, mas permitir a UI funcionar.
    try {
        const { data, error } = await supabase
            .from('forms')
            .select('*, responses(count)')
            // Aqui assumimos que talvez tenhamos salvo com ID ou Email, dependendo da implementação
            // Em produção real, usariamos apenas user_id (UUID)
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('Erro ao buscar formulários (pode ser normal se for primeiro acesso):', error.message);
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

export const createNewForm = async (userId: string, title: string) => {
    if (!isSupabaseConfigured() || !supabase) {
        return { id: Date.now().toString(), title, responses: 0 };
    }

    // Tenta inserir. Se falhar por causa de FK (porque o usuário não está no Auth do Supabase),
    // apenas logamos e retornamos sucesso local para não travar a UI.
    try {
        // Precisamos de um UUID válido se a coluna for UUID.
        // Se for texto, podemos passar o email.
        // Assumindo estrutura flexível para o clone:
        const { data, error } = await supabase
            .from('forms')
            .insert([{ title: title, content: {} }]) // Simplificado
            .select()
            .single();

        if (error) throw error;
        
        return {
            id: data.id.toString(),
            title: data.title,
            responses: 0
        };
    } catch (e) {
        console.warn("Operação de DB falhou (fallback local):", e);
        return { id: Date.now().toString(), title, responses: 0 };
    }
};
