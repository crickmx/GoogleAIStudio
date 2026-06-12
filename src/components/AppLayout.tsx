import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { 
  LogOut, 
  FileText, 
  PlusCircle, 
  Menu, 
  X,
  Home,
  User,
  Sparkles,
  Layers
} from 'lucide-react';

export type View = 
  | 'cotizador' 
  | 'cotizaciones';

export interface AppLayoutProps {
  currentView: View;
  onNavigate: (view: View) => void;
  children: React.ReactNode;
}

export default function AppLayout({ currentView, onNavigate, children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getBreadcrumbLabel = () => {
    switch(currentView) {
      case 'cotizador': return 'Nuevo Cotizador';
      case 'cotizaciones': return 'Mis Cotizaciones';
      default: return 'Inicio';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Top Main Navbar */}
      <header className="bg-white text-slate-900 h-16 px-6 flex items-center justify-between border-b border-slate-200 shrink-0 sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-hidden"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm tracking-widest text-white shadow-xs">
              MV
            </div>
            <div>
              <h1 className="text-base font-extrabold leading-none tracking-tight text-slate-900">MOVI Digital</h1>
              <span className="text-[10px] text-blue-650 font-mono tracking-wider font-extrabold">EMISIÓN & COTIZADOR</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* User information & Role Badge */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs text-slate-700 font-semibold">{user?.nombre}</span>
            <span className="text-[10px] text-blue-650 font-extrabold uppercase leading-none mt-1">
              {user?.rol === 'admin' ? 'Administrador' : 'Agente Autorizado'}
            </span>
          </div>

          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs border border-blue-200">
            {user?.nombre?.substr(0, 2).toUpperCase() || 'US'}
          </div>

          <button 
            onClick={() => logout()}
            className="p-1.5 px-3 rounded-xl text-slate-500 hover:text-red-650 hover:bg-slate-100 text-xs flex items-center gap-1.5 transition cursor-pointer font-bold"
            id="logout-btn"
            title="Cerrar sesión"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Breadcrumb strip */}
      <div className="bg-white border-b border-slate-200 shrink-0 px-6 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-500 shadow-xs">
        <div className="flex items-center gap-2">
          <Home size={14} className="text-slate-400" />
          <span className="text-slate-300">/</span>
          <span className="text-blue-700 tracking-wide font-bold">{getBreadcrumbLabel()}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold">Entorno en producción</span>
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar (Left) */}
        <aside className="hidden md:flex flex-col bg-white border-r border-slate-200 w-64 p-4 shrink-0 justify-between">
          <div className="space-y-6">
            <div className="px-3">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-1">
                Menú Comercial
              </span>
            </div>

            <nav className="space-y-1.5">
              <button
                onClick={() => onNavigate('cotizaciones')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition cursor-pointer ${
                  currentView === 'cotizaciones'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <FileText size={16} />
                <span>Mis Cotizaciones</span>
              </button>

              <button
                onClick={() => onNavigate('cotizador')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition cursor-pointer ${
                  currentView === 'cotizador'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <PlusCircle size={16} />
                <span>Nuevo Cotizador</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[10px] font-bold text-slate-500">
            <div className="flex justify-between">
              <span>Módulo:</span>
              <span className="text-slate-800">Cotizador Core</span>
            </div>
            <div className="flex justify-between">
              <span>Estado:</span>
              <span className="text-emerald-600">Conectado</span>
            </div>
          </div>
        </aside>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 bg-slate-900/60 z-40" onClick={() => setMobileMenuOpen(false)}>
            <div 
              className="bg-white w-72 h-full p-4 flex flex-col justify-between" 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-slate-900 font-extrabold text-sm flex items-center gap-2">
                    <Layers size={16} className="text-blue-600" /> MOVI NAVEGACIÓN
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => {
                      onNavigate('cotizaciones');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                      currentView === 'cotizaciones' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FileText size={16} />
                    <span>Mis Cotizaciones</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('cotizador');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer ${
                      currentView === 'cotizador' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <PlusCircle size={16} />
                    <span>Nuevo Cotizador</span>
                  </button>
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100 text-slate-550 text-xs font-semibold">
                <p>Usuario: {user?.nombre}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content Container Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
