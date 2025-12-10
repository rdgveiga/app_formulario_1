import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo atual (development/production)
  // O terceiro argumento '' carrega todas as variáveis, não apenas as com prefixo VITE_
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      port: 3000,
    },
    // Define substituições globais de constantes para usar process.env no código cliente
    // Isso expõe todas as variáveis carregadas pelo loadEnv no objeto process.env do navegador
    define: {
      'process.env': env,
    },
  };
});