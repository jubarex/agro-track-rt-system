
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// O bloco 'if' que lança o erro foi temporariamente removido para permitir que o app funcione sem uma conexão ativa com o Supabase.
// Valores de espaço reservado são fornecidos para inicializar o cliente, mas as chamadas de API reais nas páginas serão desabilitadas.
// Quando você reconectar ao Supabase, este arquivo deve ser revertido para lançar um erro se as chaves estiverem faltando.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-anon-key'
);
