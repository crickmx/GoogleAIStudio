import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { Shield, Key, Mail, AlertTriangle, CheckCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor complete todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onLogin();
      }, 800);
    } else {
      setErrorMsg(res.error || 'Error al iniciar sesión.');
    }
  };

  const handleFillCredentials = (mEmail: string, mPass: string) => {
    setEmail(mEmail);
    setPassword(mPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white flex flex-col items-center justify-center p-4">
      
      {/* Brand logo header */}
      <div className="mb-6 text-center animate-fade-in">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-3xl tracking-wider shadow-xl mx-auto mb-3 border border-blue-400">
          MV
        </div>
        <h1 className="text-2xl font-black tracking-tight leading-none text-white">
          MOVI Cotizador
        </h1>
        <p className="text-xs text-blue-400 font-mono tracking-widest font-semibold uppercase mt-1.5">
          Enterprise Insurance platform
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6.5 relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">Ingresar a la Plataforma</h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestione carteras de seguros de auto en tiempo real.
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/60 border border-red-800 rounded-xl p-3 text-xs text-red-350 flex items-start gap-2 mb-4">
            <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-950/60 border border-emerald-800 rounded-xl p-3 text-xs text-emerald-350 flex items-start gap-2 mb-4 animate-pulse">
            <CheckCircle size={15} className="shrink-0 mt-0.5 text-emerald-400" />
            <span>Acceso autorizado. Iniciando espacio corporativo...</span>
          </div>
        )}

        {/* Credentials hints container */}
        <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800 mb-5">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">
            Perfiles de Prueba del Historial:
          </span>
          <div className="space-y-2">
            <button
              onClick={() => handleFillCredentials('ccjimenez@jiro.com.mx', 'Movi2024!')}
              className="w-full text-left bg-slate-900 hover:bg-slate-850 p-2 rounded-lg text-xs flex justify-between items-center transition border border-slate-800/80"
            >
              <div>
                <span className="block font-bold text-white text-[11px]">ccjimenez@jiro.com.mx</span>
                <span className="text-[10px] text-slate-400">Contraseña: <strong className="font-mono text-blue-450 font-semibold">Movi2024!</strong></span>
              </div>
              <span className="text-[9px] bg-blue-900/50 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase border border-blue-800/65">
                Admin
              </span>
            </button>

            <button
              onClick={() => handleFillCredentials('mariela@jiro.com.mx', 'Movi2024!')}
              className="w-full text-left bg-slate-900 hover:bg-slate-850 p-2 rounded-lg text-xs flex justify-between items-center transition border border-slate-800/80"
            >
              <div>
                <span className="block font-bold text-white text-[11px]">mariela@jiro.com.mx</span>
                <span className="text-[10px] text-slate-400">Contraseña: <strong className="font-mono text-blue-450 font-semibold">Movi2024!</strong></span>
              </div>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase border border-slate-700/60">
                Agente
              </span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Corporativo
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500" size={15} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs font-medium bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-3 placeholder:text-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                placeholder="ejemplo@jiro.com.mx"
                id="login-email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Contraseña de Acceso
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 text-slate-500" size={15} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs font-medium bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-3 placeholder:text-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
                placeholder="••••••••"
                id="login-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-xl text-xs font-extrabold transition shadow-lg flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Shield size={16} /> Validar Acceso
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <span className="text-[10px] text-slate-500">
            Jiro y Asociados S.A. de C.V. © {new Date().getFullYear()}
          </span>
        </div>

      </div>
    </div>
  );
}
