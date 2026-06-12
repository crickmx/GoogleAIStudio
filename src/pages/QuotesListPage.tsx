import React, { useState, useEffect } from 'react';
import type { Cotizacion, QuoteStatus } from '../types';
import { 
  Search, 
  Filter, 
  Trash2, 
  ShieldCheck, 
  FilePlus, 
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  Building
} from 'lucide-react';

interface QuotesListPageProps {
  onSelectQuote: (quote: Cotizacion) => void;
  onNavigateToNewQuote: () => void;
}

export default function QuotesListPage({ onSelectQuote, onNavigateToNewQuote }: QuotesListPageProps) {
  const [quotes, setQuotes] = useState<Cotizacion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('todos');

  const loadQuotes = () => {
    const saved = localStorage.getItem('movi_quotes');
    if (saved) {
      try {
        setQuotes(JSON.parse(saved));
      } catch {
        setQuotes([]);
      }
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleDeleteQuote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Está seguro de eliminar esta cotización del registro histórico local?')) {
      const saved = localStorage.getItem('movi_quotes');
      if (saved) {
        try {
          const arr: Cotizacion[] = JSON.parse(saved);
          const filtered = arr.filter(q => q.id !== id);
          localStorage.setItem('movi_quotes', JSON.stringify(filtered));
          setQuotes(filtered);
        } catch {}
      }
    }
  };

  // 12 statuses representation for filter ribbons
  const statusFilters = [
    { label: 'Todos', value: 'todos' },
    { label: 'Cotizado', value: 'Cotizado' },
    { label: 'En Revisión', value: 'En Revisión' },
    { label: 'Borrador', value: 'Borrador' },
    { label: 'Vencido', value: 'Vencido' },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Emitido': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cotizado': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'En Revisión': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Borrador': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'Cancelado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-105 text-slate-600 border-slate-200';
    }
  };

  // Filter & Search logic
  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch = 
      q.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.vehiculo.descripcionCompleta.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      activeStatusFilter === 'todos' || q.status === activeStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      
      {/* List Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-slate-900">Historial de Cotizaciones</h2>
          <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">
            Gestión y Control de Seguros de Autos Particulares y Pick-ups
          </p>
        </div>

        <button
          onClick={onNavigateToNewQuote}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 group self-start shadow border border-blue-500"
          id="btn-list-new-quote"
        >
          <FilePlus size={16} /> Nueva Cotización 
        </button>
      </div>

      {/* Search and Filters Strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 text-slate-400" size={15} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-250 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-medium"
            placeholder="Buscar por folio, nombre de cliente contratante o versión de auto..."
            id="search-quotes"
          />
        </div>

        {/* Status filters horizontal ribbon */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mr-2 flex items-center gap-1">
            <Filter size={12} /> Filtrar Estatus:
          </span>
          <div className="flex flex-wrap gap-1">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActiveStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                  activeStatusFilter === f.value
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'text-slate-605 bg-slate-100 hover:bg-slate-150 border-transparent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* List Datatable */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {filteredQuotes.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2 border-slate-100">
            <Layers size={36} className="mx-auto text-slate-350" />
            <p className="font-extrabold text-slate-800 text-sm">Sin Cotizaciones Encontradas</p>
            <p className="text-xs text-slate-500">Crea una nueva cotización presionando el botón "Nueva Cotización" para iniciar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-450 font-black uppercase tracking-wider">
                  <th className="p-4">Folio / Fecha</th>
                  <th className="p-4">Cliente Contratante</th>
                  <th className="p-4">Auto Cotizado</th>
                  <th className="p-4 text-center">Forma de Pago</th>
                  <th className="p-4 text-center">Estatus</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredQuotes.map((q) => {
                  const bestPrice = q.resultados?.find(r => r.status === 'exitoso')?.primaTotal || 12450;
                  return (
                    <tr 
                      key={q.id}
                      onClick={() => onSelectQuote(q)}
                      className="hover:bg-slate-50/70 cursor-pointer transition"
                    >
                      {/* Folio & Date */}
                      <td className="p-4">
                        <span className="block font-black text-slate-900 font-mono tracking-tight text-sm">
                          {q.folio}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-1">
                          <Calendar size={11} /> {new Date(q.fechaCreacion).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Cliente */}
                      <td className="p-4">
                        <div className="font-extrabold leading-tight text-slate-900 text-[13px]">
                          {q.cliente.nombre}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase">
                          RFC: {q.cliente.rfc} | CP: {q.cliente.codigoPostal}
                        </span>
                      </td>

                      {/* Vehiculo */}
                      <td className="p-4 max-w-[250px] truncate">
                        <div className="font-extrabold text-slate-800">
                          {q.vehiculo.descripcionCompleta}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500 uppercase">
                          <span>Año: <strong>{q.vehiculo.anio}</strong></span>
                          <span>Clave: <strong>{q.vehiculo.claveAmis || 'AMIS-N/A'}</strong></span>
                        </div>
                      </td>

                      {/* Payment values */}
                      <td className="p-4 text-center">
                        <span className="block font-black text-slate-800">
                          ${bestPrice.toLocaleString('es-MX')} MXN
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                          {q.formaPagoSeleccionada}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="p-4 text-center">
                        <span className={`text-[10px] border px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide inline-block ${getStatusStyle(q.status)}`}>
                          {q.status}
                        </span>
                      </td>

                      {/* Row actions */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectQuote(q)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100 p-1.5 rounded-lg transition"
                            title="Ver comparador de resultados"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteQuote(q.id, e)}
                            className="bg-red-50 hover:bg-red-100 text-red-650 border border-red-100 p-1.5 rounded-lg transition"
                            title="Eliminar del historial"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
