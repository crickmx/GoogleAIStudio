import React, { useState } from 'react';
import { VEHICLE_CATALOG } from '../data/catalog';
import { Search, Database, Layers, CheckCircle2, SlidersHorizontal } from 'lucide-react';

export default function CatalogMasterPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('todos');

  // Load unique manufacturers
  const brands = Array.from(new Set(VEHICLE_CATALOG.map(v => v.marca))).sort();

  // Filter models
  const filteredCatalog = VEHICLE_CATALOG.filter(v => {
    const matchesSearch = 
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.descripcionCompleta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.claveAmis && v.claveAmis.includes(searchTerm));
    
    const matchesBrand = brandFilter === 'todos' || v.marca === brandFilter;

    return matchesSearch && matchesBrand;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900">Catálogo Vehicular Homologado</h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">
            Matriz Maestra de Equivalencias y Claves de Transferencia de Riesgo (AMIS / GNP)
          </p>
        </div>
        
        <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start shadow-xs">
          <Database size={14} /> Base de Datos Conectada
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3.5 text-slate-400" size={15} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-250 rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-medium"
            placeholder="Buscar por submarca (Jetta, Corolla...), clave AMIS o palabras clave de versión..."
            id="search-catalog"
          />
        </div>

        {/* Brand Filter */}
        <div>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full text-xs font-bold text-slate-700 bg-slate-50 border border-slate-250 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            id="filter-brand-catalog"
          >
            <option value="todos">Todas las Marcas ({brands.length})</option>
            {brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Catalog Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Detalle de Homologaciones</span>
          <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
            {filteredCatalog.length} Resultados
          </span>
        </div>

        {filteredCatalog.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Layers size={36} className="mx-auto text-slate-350" />
            <p className="font-extrabold text-slate-800 text-sm">Sin Modelos Encontrados</p>
            <p className="text-xs">Ajuste los términos de búsqueda o filtros para este fabricante.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-150 text-[10px] text-slate-450 font-black uppercase tracking-wider">
                  <th className="p-4">Marca</th>
                  <th className="p-4">Submarca / Año</th>
                  <th className="p-4">Versión Oficial</th>
                  <th className="p-4 text-center">Clave AMIS (Quálitas)</th>
                  <th className="p-4 text-center">Clave GNP (Armadora | Corr)</th>
                  <th className="p-4 text-right">Valor Promedio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredCatalog.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <span className="bg-slate-100/85 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-150 uppercase tracking-wider text-[10px] font-black">
                        {v.marca}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{v.modelo}</div>
                      <span className="text-[10px] text-slate-400 font-bold font-mono">MODELO {v.anio}</span>
                    </td>
                    <td className="p-4 max-w-[280px] truncate uppercase text-slate-650" title={v.version}>
                      {v.version}
                    </td>
                    <td className="p-4 text-center">
                      {v.claveAmis ? (
                        <span className="font-mono bg-blue-50 border border-blue-100 text-blue-800 font-black px-2 py-0.5 rounded text-[10px] tracking-wider">
                          {v.claveAmis}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold italic">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-center font-mono text-[10px]">
                      {v.armadoraGnp ? (
                        <span className="bg-teal-50 border border-teal-150 text-teal-800 font-extrabold px-2 py-0.5 rounded">
                          {v.armadoraGnp} | {v.carroceriaGnp} | {v.versionGnp}
                        </span>
                      ) : (
                        <span className="text-slate-450 italic">Faltante</span>
                      )}
                    </td>
                    <td className="p-4 text-right text-slate-900 font-black tracking-tight">
                      ${v.valorReferencia?.toLocaleString('es-MX')} MXN
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
