import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AuthDebugProps {
  onClose?: () => void;
}

export const AuthDebug: React.FC<AuthDebugProps> = ({ onClose }) => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    setLoading(true);
    try {
      // 1. Verificar sessão atual
      const { data: session } = await supabase.auth.getSession();
      
      // 2. Tentar buscar usuário atual
      let userProfile = null;
      let userError = null;
      if (session?.session?.user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.session.user.id)
            .single();
          userProfile = data;
          userError = error;
        } catch (err) {
          userError = err;
        }
      }

      // 3. Executar função de debug (se existir)
      let debugFunction = null;
      try {
        const { data, error } = await supabase.rpc('debug_auth_user');
        debugFunction = { data, error };
      } catch (err) {
        debugFunction = { error: err };
      }

      // 4. Verificar políticas RLS
      let rlsCheck = null;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1);
        rlsCheck = { success: !error, error };
      } catch (err) {
        rlsCheck = { success: false, error: err };
      }

      setDebugInfo({
        session: session?.session ? {
          user_id: session.session.user.id,
          email: session.session.user.email,
          authenticated: true
        } : { authenticated: false },
        userProfile,
        userError,
        debugFunction,
        rlsCheck,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@bioboxsys.com',
        password: 'password123' // Você pode alterar para a senha correta
      });
      
      console.log('Teste de login:', { data, error });
      
      // Executar debug após login
      setTimeout(runDebug, 1000);
    } catch (error) {
      console.error('Erro no teste de login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Debug de Autenticação</h2>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={runDebug}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Executando...' : 'Executar Debug'}
            </button>
            
            <button
              onClick={testLogin}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              Testar Login
            </button>
          </div>

          {debugInfo && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Resultado do Debug:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <h4 className="font-semibold">Como usar:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Executar Debug:</strong> Verifica o estado atual da autenticação</li>
              <li><strong>Testar Login:</strong> Tenta fazer login com admin@bioboxsys.com</li>
              <li>Verifique o console do navegador para logs detalhados</li>
              <li>Se houver erros de RLS, execute os scripts SQL de correção</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
