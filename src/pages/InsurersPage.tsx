import React, { useState, useEffect } from 'react';
import type { AseguradoraCredential } from '../types';
import { getSavedInsurers, saveInsurers } from '../data/insurers';
import { useAuth } from '../lib/auth';
import { 
  Building, 
  ShieldCheck, 
  Settings, 
  Save, 
  Power, 
  Key, 
  AlertCircle,
  Clock,
  HelpCircle
} from 'lucide-react';

export default function InsurersPage() {
  const { user } = useAuth();
  const [insurers, setInsurers] = useState<AseguradoraCredential[]>([]);
  const [selectedIns, setSelectedIns] = useState<AseguradoraCredential | null>(null);
  const [editingCreds, setEditingCreds] = useState<{ [key: string]: string }>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const data = getSavedInsurers();
    setInsurers(data);
    if (data.length > 0) {
      setSelectedIns(data[0]);
      setEditingCreds(data[0].credenciales);
    }
  }, []);

  const handleSelectInsurer = (ins: AseguradoraCredential) => {
    setSelectedIns(ins);
    setEditingCreds(ins.credenciales);
    setSaveSuccess(false);
  };

  const handleToggleActive = (id: string) => {
    const updated = insurers.map(ins => {
      if (ins.id === id) {
        const nextState = !ins.activo;
        // If we toggled the currently selected insurer, reflect it
        if (selectedIns?.id === id) {
          setSelectedIns({ ...ins, activo: nextState });
        }
        return { ...ins, activo: nextState };
      }
      return ins;
    });
    setInsurers(updated);
    saveInsurers(updated);
  };

  const handleCredChange = (key: string, value: string) => {
    setEditingCreds(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIns) return;

    const updated = insurers.map(ins => {
      if (ins.id === selectedIns.id) {
        return {
          ...ins,
          credenciales: editingCreds,
        };
      }
      return ins;
    });

    setInsurers(updated);
    saveInsurers(updated);
    
    // Update selected context
    setSelectedIns(prev => prev ? { ...prev, credenciales: editingCreds } : null);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  const isEditable = user?.rol === 'admin' || user?.rol === 'gerente';

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-base font-black text-slate-900">Configuración de Aseguradoras</h2>
        <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">
          Credenciales, Variables de Comisión y Endpoints Oficiales de Web Services (WS)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Insurers Selector list */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs space-y-3">
          <span className="text-[10px] font-extrabold uppercase text-slate-450 tracking-wider block mb-1">
            Lista de Aseguradoras Afiliadas
          </span>

          <div className="space-y-2">
            {insurers.map((ins) => {
              const matchesSelected = selectedIns?.id === ins.id;
              return (
                <div
                  key={ins.id}
                  onClick={() => handleSelectInsurer(ins)}
                  className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                    matchesSelected 
                      ? 'border-blue-500 bg-blue-50/20 shadow-sm' 
                      : 'border-slate-150 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={ins.logo} 
                      alt={ins.nombre}
                      referrerPolicy="no-referrer"
                      className="w-11 h-9 object-contain rounded border border-slate-150 bg-white p-0.5"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-tight">
                        {ins.nombre}
                      </h4>
                      <span className="text-[9px] text-slate-500 font-medium">
                        Slug: {ins.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {/* Toggle button */}
                    <button
                      onClick={() => handleToggleActive(ins.id)}
                      disabled={!isEditable}
                      className={`p-1.5 rounded-lg border transition ${
                        ins.activo
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={ins.activo ? 'Desactivar comercialmente' : 'Activar comercialmente'}
                    >
                      <Power size={13} />
                    </button>
                    <span className={`text-[9px] font-bold uppercase ${ins.activo ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {ins.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Credentials editor form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          {selectedIns ? (
            <form onSubmit={handleSaveCredentials} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <Settings className="text-blue-500" size={18} />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 leading-none">
                      Credenciales de {selectedIns.nombre}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">
                      Identificadores y claves SOAP / REST
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${selectedIns.activo ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {selectedIns.activo ? 'Canal Operativo' : 'Canal Suspendido'}
                  </span>
                </div>
              </div>

              {saveSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Configuración de cotización persistida en el storage local.</span>
                </div>
              )}

              {/* Editing inputs */}
              {Object.keys(editingCreds).length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl text-xs space-y-1.5 font-sans">
                  <Key size={24} className="mx-auto text-slate-300" />
                  <h4 className="font-bold">Sin propiedades de autenticación</h4>
                  <p className="text-[10px]">Esta aseguradora no requiere de credenciales personalizadas adicionales para cotización genérica externa.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(editingCreds).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                        {key.replace(/_/g, ' ')}
                      </label>
                      <input
                        type={key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') ? 'text' : 'text'}
                        required
                        disabled={!isEditable}
                        value={value}
                        onChange={(e) => handleCredChange(key, e.target.value)}
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-250 rounded-lg p-2.5 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-800"
                        id={`cred-${key}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Save trigger bottom row */}
              <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40 p-4 -mx-5 -mb-5 rounded-b-2xl mt-4">
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <AlertCircle size={13} className="text-blue-500 shrink-0" />
                  <span>Se requiere rol Administrativo o de Gerencia para alterar estas variables.</span>
                </div>

                {isEditable && Object.keys(editingCreds).length > 0 && (
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
                    id="btn-save-credentials"
                  >
                    <Save size={15} /> Guardar Cambios
                  </button>
                )}
              </div>

            </form>
          ) : (
            <div className="p-10 text-center text-slate-400 space-y-2">
              <Building size={32} className="mx-auto text-slate-350 animate-pulse" />
              <p className="font-bold">Ninguna Aseguradora Elegida</p>
              <p className="text-xs">Selecciona un elemento de la lista izquierda para ingresar a sus directrices.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
