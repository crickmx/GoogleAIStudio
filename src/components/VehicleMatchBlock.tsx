import React, { useState } from 'react';
import type { Vehiculo } from '../types';
import { Search, CheckCircle, ShieldCheck, X, Building, RefreshCw, AlertCircle } from 'lucide-react';

interface VehicleMatchBlockProps {
  vehicle: Vehiculo;
  insurerName: string;
  onConfirmMatch: (updatedKeys: { claveAmis?: string; armadoraGnp?: string; carroceriaGnp?: string; versionGnp?: string }) => void;
  onClose: () => void;
}

export default function VehicleMatchBlock({ vehicle, insurerName, onConfirmMatch, onClose }: VehicleMatchBlockProps) {
  const [searchTerm, setSearchTerm] = useState(vehicle.modelo);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [matchingResults, setMatchingResults] = useState<any[]>(() => {
    // Return mock homologation suggestions based on search text
    return [
      {
        id: 'res-1',
        description: `${vehicle.marca.toUpperCase()} ${vehicle.modelo.toUpperCase()} SENSE EQUIPADO`,
        amis: '0715602',
        gnp: 'NI|01|05',
        tarifa: 'T-Plus',
      },
      {
        id: 'res-2',
        description: `${vehicle.marca.toUpperCase()} ${vehicle.modelo.toUpperCase()} ADVANCE BASE`,
        amis: '0715603',
        gnp: 'NI|01|12',
        tarifa: 'T-Standard',
      },
      {
        id: 'res-3',
        description: `${vehicle.marca.toUpperCase()} ${vehicle.modelo.toUpperCase()} EXCLUSIVE CUSTOM`,
        amis: '0715604',
        gnp: 'NI|01|18',
        tarifa: 'T-Premium',
      },
    ];
  });

  const isGNP = insurerName.toLowerCase().includes('gnp');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate searching matching database
    const text = searchTerm.toLowerCase();
    const filtered = [
      {
        id: 'res-1',
        description: `${vehicle.marca.toUpperCase()} ${text.toUpperCase()} SENSE EQUIPADO`,
        amis: '0715602',
        gnp: 'NI|01|05',
        tarifa: 'T-Plus',
      },
      {
        id: 'res-2',
        description: `${vehicle.marca.toUpperCase()} ${text.toUpperCase()} ADVANCE BASE`,
        amis: '0715603',
        gnp: 'NI|01|12',
        tarifa: 'T-Standard',
      },
      {
        id: 'res-3',
        description: `${vehicle.marca.toUpperCase()} ${text.toUpperCase()} EXCLUSIVE CUSTOM`,
        amis: '0715604',
        gnp: 'NI|01|18',
        tarifa: 'T-Premium',
      },
    ];
    setMatchingResults(filtered);
  };

  const handleConfirm = (item: any) => {
    if (isGNP) {
      const parts = item.gnp.split('|');
      onConfirmMatch({
        armadoraGnp: parts[0],
        carroceriaGnp: parts[1],
        versionGnp: parts[2],
      });
    } else {
      onConfirmMatch({
        claveAmis: item.amis,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-250 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building size={18} className="text-blue-400" />
            <div>
              <h3 className="text-sm font-bold">Homologación Manual — {insurerName}</h3>
              <p className="text-[10px] text-slate-400 leading-none mt-1">
                Vincula el auto a la base de datos oficial
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-450 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Vehicle summary card context */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <span className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase block mb-1">
            Vehículo de la Cotización:
          </span>
          <div className="text-xs font-bold text-slate-850">
            {vehicle.descripcionCompleta} ({vehicle.anio})
          </div>
          <div className="flex items-center gap-4 text-[10px] text-slate-500 font-medium mt-1">
            <span>Clave Original AMIS: <strong className="font-mono">{vehicle.claveAmis || 'No asignada'}</strong></span>
            <span>GNP original: <strong className="font-mono">{vehicle.armadoraGnp ? `${vehicle.armadoraGnp}|${vehicle.carroceriaGnp}|${vehicle.versionGnp}` : 'No asignado'}</strong></span>
          </div>
        </div>

        {/* Content & Search form */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-350 rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-medium"
                placeholder="Buscar versión o palabra clave en servidor..."
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0"
            >
              <RefreshCw size={13} /> Buscar
            </button>
          </form>

          {/* Matches List */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">
              Coincidencias encontradas en {insurerName}:
            </span>

            <div className="space-y-2">
              {matchingResults.map((item) => {
                const itemKey = isGNP ? item.gnp : item.amis;
                const isSelected = selectedKey === itemKey;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedKey(itemKey)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-800 leading-tight">
                        {item.description}
                      </div>
                      {isSelected && (
                        <span className="text-[9px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                          <CheckCircle size={10} /> Elegido
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2 text-[10px] text-slate-500 font-medium">
                      <div>
                        Clave AMIS: <strong className="font-mono text-slate-700">{item.amis}</strong>
                      </div>
                      <div>
                        Clave GNP: <strong className="font-mono text-slate-700">{item.gnp}</strong>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirm(item);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition"
                        >
                          <ShieldCheck size={11} /> Confirmar Selección
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info message */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-1.5 shrink-0">
          <AlertCircle size={13} className="text-blue-500" />
          <span>La homologación asocia este registro de forma única para futuras cotizaciones de esta cuenta.</span>
        </div>

      </div>
    </div>
  );
}
