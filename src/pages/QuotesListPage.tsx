import React, { useState, useEffect } from 'react';
import type { Cotizacion, QuoteStatus, Cliente, Vehiculo } from '../types';
import { INSURERS_SEED, calculateSimulatedQuote } from '../data/insurers';
import { VEHICLE_CATALOG } from '../data/catalog';
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
    
    // Seed dynamically calculated quotes matching the cases
    const seedQuotes: Cotizacion[] = [];
    
    const yarisObj = VEHICLE_CATALOG.find(v => v.id === 'toyota-yaris-2007');
    const sportageObj = VEHICLE_CATALOG.find(v => v.id === 'kia-sportage-2018');
    const jettaObj = VEHICLE_CATALOG.find(v => v.id === 'vw-jetta-2014');
    const mazdaObj = VEHICLE_CATALOG.find(v => v.id === 'mazda-cx5-2019');
    
    const insurers = INSURERS_SEED;

    // 1. Yaris 2007 (18 años)
    if (yarisObj) {
      const client: Cliente = {
        id: 'c-yaris-18',
        nombre: 'Juan Carlos Ruiz (Yaris - Joven)',
        tipoPersona: 'Fisica',
        rfc: 'RUJC080612HP9',
        correo: 'juancarlos.ruiz@hotmail.com',
        telefono: '3318901243',
        codigoPostal: '47800',
        edad: 18,
        genero: 'Masculino'
      };
      const results = insurers.map(ins => calculateSimulatedQuote(ins, yarisObj, client, 'Amplia', 'Anual'));
      seedQuotes.push({
        id: 'seed-yaris-18',
        folio: 'COT-20260610-YAR18',
        fechaCreacion: '2026-06-10T15:00:13.000Z',
        cliente: client,
        vehiculo: yarisObj,
        paqueteSeleccionado: 'Amplia',
        formaPagoSeleccionada: 'Anual',
        status: 'Cotizado',
        userEmail: 'ccjimenez@jiro.com.mx',
        resultados: results
      });
    }

    // 2. Yaris 2007 (56 años)
    if (yarisObj) {
      const client: Cliente = {
        id: 'c-yaris-56',
        nombre: 'Alejandro Mendoza (Yaris - Adulto)',
        tipoPersona: 'Fisica',
        rfc: 'MEAL700215KR8',
        correo: 'a.mendoza@potosi.com',
        telefono: '4441559812',
        codigoPostal: '47780',
        edad: 56,
        genero: 'Masculino'
      };
      const results = insurers.map(ins => calculateSimulatedQuote(ins, yarisObj, client, 'Amplia', 'Anual'));
      seedQuotes.push({
        id: 'seed-yaris-56',
        folio: 'COT-20260610-YAR56',
        fechaCreacion: '2026-06-10T11:42:00.000Z',
        cliente: client,
        vehiculo: yarisObj,
        paqueteSeleccionado: 'Amplia',
        formaPagoSeleccionada: 'Anual',
        status: 'Cotizado',
        userEmail: 'ccjimenez@jiro.com.mx',
        resultados: results
      });
    }

    // 3. Sportage 2018
    if (sportageObj) {
      const client: Cliente = {
        id: 'c-sportage-25',
        nombre: 'Diego Sebastián López (Sportage)',
        tipoPersona: 'Fisica',
        rfc: 'LODD010410HJ5',
        correo: 'diego.lopez@gmail.com',
        telefono: '4775128954',
        codigoPostal: '37129',
        edad: 25,
        genero: 'Masculino'
      };
      const results = insurers.map(ins => calculateSimulatedQuote(ins, sportageObj, client, 'Amplia', 'Anual'));
      seedQuotes.push({
        id: 'seed-sportage-25',
        folio: 'COT-20260421-SPO25',
        fechaCreacion: '2026-04-21T12:00:00.000Z',
        cliente: client,
        vehiculo: sportageObj,
        paqueteSeleccionado: 'Amplia',
        formaPagoSeleccionada: 'Anual',
        status: 'Cotizado',
        userEmail: 'ccjimenez@jiro.com.mx',
        resultados: results
      });
    }

    // 4. Mazda CX-5 2019
    if (mazdaObj) {
      const client: Cliente = {
        id: 'c-mazda-69',
        nombre: 'María Teresa Jiménez (Mazda)',
        tipoPersona: 'Fisica',
        rfc: 'JIMA570912ML4',
        correo: 'teresa.jimenez@outlook.com',
        telefono: '4431897654',
        codigoPostal: '58280',
        edad: 69,
        genero: 'Femenino'
      };
      const results = insurers.map(ins => calculateSimulatedQuote(ins, mazdaObj, client, 'Amplia', 'Anual'));
      seedQuotes.push({
        id: 'seed-mazda-69',
        folio: 'COT-20260612-MAZ69',
        fechaCreacion: '2026-06-12T09:48:19.000Z',
        cliente: client,
        vehiculo: mazdaObj,
        paqueteSeleccionado: 'Amplia',
        formaPagoSeleccionada: 'Anual',
        status: 'Cotizado',
        userEmail: 'ccjimenez@jiro.com.mx',
        resultados: results
      });
    }

    // 5. Jetta 2014
    if (jettaObj) {
      const client: Cliente = {
        id: 'c-jetta-81',
        nombre: 'Benjamín Silva (Jetta)',
        tipoPersona: 'Fisica',
        rfc: 'SIBM450520TS3',
        correo: 'benjamin.silva@yahoo.com.mx',
        telefono: '4441223344',
        codigoPostal: '78395',
        edad: 81,
        genero: 'Masculino'
      };
      const results = insurers.map(ins => calculateSimulatedQuote(ins, jettaObj, client, 'Amplia', 'Anual'));
      seedQuotes.push({
        id: 'seed-jetta-81',
        folio: 'COT-20260602-JET81',
        fechaCreacion: '2026-06-02T10:15:00.000Z',
        cliente: client,
        vehiculo: jettaObj,
        paqueteSeleccionado: 'Amplia',
        formaPagoSeleccionada: 'Anual',
        status: 'Cotizado',
        userEmail: 'ccjimenez@jiro.com.mx',
        resultados: results
      });
    }

    let parsedQuotes: Cotizacion[] = [];
    if (saved) {
      try {
        parsedQuotes = JSON.parse(saved);
      } catch {
        parsedQuotes = [];
      }
    }

    // Check if any seed quote is missing from parsed, if so add it
    let modified = false;
    seedQuotes.forEach(seedQ => {
      const exists = parsedQuotes.some(q => q.id === seedQ.id);
      if (!exists) {
        parsedQuotes.push(seedQ);
        modified = true;
      }
    });

    // Also update any existing seed quotes to match fresh calculations
    const updatedQuotes = parsedQuotes.map(q => {
      if (q.id && q.id.startsWith('seed-')) {
        const freshResults = insurers.map(ins => 
          calculateSimulatedQuote(ins, q.vehiculo, q.cliente, q.paqueteSeleccionado, q.formaPagoSeleccionada)
        );
        
        const oldSum = q.resultados?.reduce((acc, r) => acc + r.primaTotal, 0) || 0;
        const newSum = freshResults.reduce((acc, r) => acc + r.primaTotal, 0);

        if (Math.abs(oldSum - newSum) > 0.01 || q.resultados?.length !== freshResults.length) {
          modified = true;
          return {
            ...q,
            resultados: freshResults
          };
        }
      }
      return q;
    });

    if (modified || !saved) {
      localStorage.setItem('movi_quotes', JSON.stringify(updatedQuotes));
    }

    setQuotes(updatedQuotes);
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
