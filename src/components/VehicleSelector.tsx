import React, { useState, useEffect } from 'react';
import { 
  getBrands, 
  getYearsForBrand, 
  getModelsForBrandAndYear, 
  getVersionsForSelection 
} from '../data/catalog';
import type { Vehiculo } from '../types';
import { Car, CheckCircle2, AlertCircle } from 'lucide-react';

interface VehicleSelectorProps {
  onVehicleSelected: (vehiculo: Vehiculo | null) => void;
  initialVehicle?: Vehiculo | null;
}

export default function VehicleSelector({ onVehicleSelected, initialVehicle }: VehicleSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  
  const [brands, setBrands] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [versions, setVersions] = useState<Vehiculo[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<Vehiculo | null>(null);

  // Load brands on mount
  useEffect(() => {
    setBrands(getBrands());
    if (initialVehicle) {
      setSelectedBrand(initialVehicle.marca);
      setSelectedYear(initialVehicle.anio);
      setSelectedModel(initialVehicle.modelo);
      setSelectedVersionId(initialVehicle.id);
      setActiveVehicle(initialVehicle);
    }
  }, [initialVehicle]);

  // Load years when brand changes
  useEffect(() => {
    if (selectedBrand) {
      setYears(getYearsForBrand(selectedBrand));
      if (!initialVehicle || initialVehicle.marca !== selectedBrand) {
        setSelectedYear(0);
        setSelectedModel('');
        setVersions([]);
        setSelectedVersionId('');
        setActiveVehicle(null);
        onVehicleSelected(null);
      }
    } else {
      setYears([]);
      setSelectedYear(0);
    }
  }, [selectedBrand]);

  // Load models when year changes
  useEffect(() => {
    if (selectedBrand && selectedYear) {
      setModels(getModelsForBrandAndYear(selectedBrand, selectedYear));
      if (!initialVehicle || initialVehicle.anio !== selectedYear) {
        setSelectedModel('');
        setVersions([]);
        setSelectedVersionId('');
        setActiveVehicle(null);
        onVehicleSelected(null);
      }
    } else {
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedYear]);

  // Load versions when model changes
  useEffect(() => {
    if (selectedBrand && selectedYear && selectedModel) {
      const versionsList = getVersionsForSelection(selectedBrand, selectedYear, selectedModel);
      setVersions(versionsList);
      if (!initialVehicle || initialVehicle.modelo !== selectedModel) {
        setSelectedVersionId('');
        setActiveVehicle(null);
        onVehicleSelected(null);
      }
    } else {
      setVersions([]);
      setSelectedVersionId('');
    }
  }, [selectedModel]);

  // Trigger vehicle select
  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vId = e.target.value;
    setSelectedVersionId(vId);
    
    if (vId) {
      const found = versions.find(v => v.id === vId);
      if (found) {
        setActiveVehicle(found);
        onVehicleSelected(found);
      }
    } else {
      setActiveVehicle(null);
      onVehicleSelected(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Grid of selectors */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
            Marca
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            id="select-marca"
          >
            <option value="">-- Seleccionar --</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
            Año Modelo
          </label>
          <select
            value={selectedYear || ''}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            disabled={!selectedBrand}
            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            id="select-anio"
          >
            <option value="">-- Seleccionar --</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
            Submarca / Modelo
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedYear}
            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            id="select-modelo"
          >
            <option value="">-- Seleccionar --</option>
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
            Versión Especifica
          </label>
          <select
            value={selectedVersionId}
            onChange={handleVersionChange}
            disabled={!selectedModel || versions.length === 0}
            className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
            id="select-version"
          >
            <option value="">-- Seleccionar --</option>
            {versions.map(v => (
              <option key={v.id} value={v.id}>{v.version}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected vehicle profile box */}
      {activeVehicle && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div className="flex items-start gap-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-lg shrink-0 mt-0.5">
              <Car size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900 leading-tight">
                {activeVehicle.descripcionCompleta}
              </h4>
              <p className="text-xs text-blue-700 font-medium leading-relaxed mt-1">
                Año: <span className="font-bold">{activeVehicle.anio}</span> | Marca: <span className="font-bold">{activeVehicle.marca}</span>
              </p>
              
              {/* Technical mapping codes badge row */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {activeVehicle.claveAmis && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                    AMIS (Quálitas): {activeVehicle.claveAmis}
                  </span>
                )}
                {activeVehicle.armadoraGnp && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                    GNP: {activeVehicle.armadoraGnp}|{activeVehicle.carroceriaGnp}|{activeVehicle.versionGnp}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-blue-100">
            <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none mb-1">
              Determinación de Valor
            </span>
            <span className="text-xs text-emerald-600 font-bold flex items-center md:justify-end gap-1">
              <CheckCircle2 size={14} /> Web Service Automático
            </span>
            <span className="block text-[9px] text-slate-500 mt-1">
              El valor de referencia es de: <span className="font-semibold">${activeVehicle.valorReferencia?.toLocaleString('es-MX')} MXN</span>
            </span>
          </div>
        </div>
      )}

      {/* Info indicator when empty */}
      {!activeVehicle && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-amber-600" />
          <span>El valor del vehículo y cobertura se determinan en tiempo real vía Web Service de acuerdo a la tabla de cada aseguradora corporativa.</span>
        </div>
      )}
    </div>
  );
}
