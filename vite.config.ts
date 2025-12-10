
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo atual
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      port: 3000,
    },
    // Substituição segura de variáveis de ambiente.
    // Em vez de substituir todo o 'process.env' (o que quebra o React em produção),
    // substituímos apenas as chaves específicas que o app utiliza.
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
      'process.env.VITE_MICROSOFT_CLIENT_ID': JSON.stringify(env.VITE_MICROSOFT_CLIENT_ID),
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || "https://klzfztmzqlrfecvsdsvs.supabase.co"),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsemZ6dG16cWxyZmVjdnNkc3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNzgzODksImV4cCI6MjA4MDk1NDM4OX0.i-ftQ5ctn2_oSsbDwEWVFTLJq-_EEkZtWhf9qS1RUEs"),
    },
  };
});