import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import type { Cotizacion, WSLog } from '../types';
import { 
  getWSLogs, 
  clearWSLogs,
  getSavedInsurers,
  calculateSimulatedQuote
} from '../data/insurers';
import { 
  TrendingUp, 
  Layers, 
  Building, 
  Activity, 
  PlusCircle, 
  RefreshCw, 
  Trash2, 
  FileText,
  AlertTriangle,
  Play,
  ArrowRight,
  User,
  Clock
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (view: any) => void;
  onSelectQuote: (quote: Cotizacion) => void;
}

export default function DashboardPage({ onNavigate, onSelectQuote }: DashboardPageProps) {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Cotizacion[]>([]);
  const [logs, setLogs] = useState<WSLog[]>([]);
  const [activeLogTab, setActiveLogTab] = useState<'all' | 'errors' | 'success'>('all');

  // Load quotes and logs from storage
  const loadData = () => {
    // Get quotes from localstorage or initialize
    const savedQuotes = localStorage.getItem('movi_quotes');
    let quotesArr: Cotizacion[] = [];
    if (savedQuotes) {
      try {
        quotesArr = JSON.parse(savedQuotes);
      } catch {
        quotesArr = [];
      }
    } else {
      // Seed some starter quotes if none exist
      const activeInsurers = getSavedInsurers();
      
      const seedBase = [
        {
          id: 'q-seed-1',
          folio: 'COT-20260610-721A',
          fechaCreacion: new Date(Date.now() - 3600000 * 4).toISOString(), // 4h ago
          cliente: {
            id: 'c-seed-1',
            nombre: 'Distribuidora Mueblera S.A. de C.V.',
            tipoPersona: 'Moral' as const,
            rfc: 'DMU090812F43',
            correo: 'contacto@distribuidorameb.com',
            telefono: '5561234567',
            codigoPostal: '06600',
          },
          vehiculo: {
            id: 'niss-versa-1',
            marca: 'Nissan',
            modelo: 'Versa',
            anio: 2024,
            version: 'Sense TM 1.6L',
            descripcionCompleta: 'NISSAN VERSA SENSE TRANS. MANUAL 1.6L 4 CIL',
            claveAmis: '0715602',
            valorReferencia: 334900,
          },
          paqueteSeleccionado: 'Amplia' as const,
          formaPagoSeleccionada: 'Anual' as const,
          status: 'Cotizado' as const,
          userEmail: 'ccjimenez@jiro.com.mx',
          resultados: [] as any[],
        },
        {
          id: 'q-seed-2',
          folio: 'COT-20260609-335B',
          fechaCreacion: new Date(Date.now() - 3600000 * 26).toISOString(), // 26h ago
          cliente: {
            id: 'c-seed-2',
            nombre: 'Alberto Gómez Ortiz',
            tipoPersona: 'Fisica' as const,
            rfc: 'GOOA851109G31',
            correo: 'alberto.gomez@gmail.com',
            telefono: '3349019283',
            codigoPostal: '44100',
          },
          vehiculo: {
            id: 'vw-jetta-2',
            marca: 'Volkswagen',
            modelo: 'Jetta',
            anio: 2024,
            version: 'Sportline TA 1.4T',
            descripcionCompleta: 'VW JETTA SPORTLINE TRANS. AUTOMATICA 1.4T TURBO 4 CIL',
            claveAmis: '0912303',
            armadoraGnp: 'VW',
            carroceriaGnp: '01',
            versionGnp: '10',
            valorReferencia: 539990,
          },
          paqueteSeleccionado: 'Amplia' as const,
          formaPagoSeleccionada: 'Semestral' as const,
          status: 'Cotizado' as const,
          userEmail: 'ccjimenez@jiro.com.mx',
          resultados: [] as any[],
        },
        {
          id: 'q-seed-3',
          folio: 'COT-20260603-945A',
          fechaCreacion: new Date('2026-06-03T09:45:22.000Z').toISOString(),
          cliente: {
            id: 'c-seed-3',
            nombre: 'Ernesto Ruiz López',
            tipoPersona: 'Fisica' as const,
            rfc: 'RULO641109G31',
            correo: 'ernesto.ruiz@hotmail.com',
            telefono: '9511029384',
            codigoPostal: '69700',
          },
          vehiculo: {
            id: 'kia-seltos-1',
            marca: 'Kia',
            modelo: 'Seltos',
            anio: 2022,
            version: 'EX 1.6L Automatica 5Ptasa',
            descripcionCompleta: 'KIA SELTOS EX 1.6L AUTOMATICA 5PTAS',
            claveAmis: 'P0440025',
            valorReferencia: 306090,
          },
          paqueteSeleccionado: 'Amplia' as const,
          formaPagoSeleccionada: 'Anual' as const,
          status: 'Cotizado' as const,
          userEmail: 'ccjimenez@jiro.com.mx',
          resultados: [] as any[],
        },
        {
          id: 'q-seed-4',
          folio: 'COT-20260605-025B',
          fechaCreacion: new Date('2026-06-05T14:50:14.000Z').toISOString(),
          cliente: {
            id: 'c-seed-4',
            nombre: 'Mauricio Pérez Guzmán',
            tipoPersona: 'Fisica' as const,
            rfc: 'PEGM880512A10',
            correo: 'mauricio.perez@gmail.com',
            telefono: '5549019283',
            codigoPostal: '03100',
          },
          vehiculo: {
            id: 'bmw-r1250gs-1',
            marca: 'BMW (Moto)',
            modelo: 'R1250GS',
            anio: 2022,
            version: 'Adventure 1254 CC',
            descripcionCompleta: 'MP BMW TODO TERRENO R1250GS ADVENTURE 1254 CC',
            claveAmis: 'M5000401',
            valorReferencia: 363400,
          },
          paqueteSeleccionado: 'Amplia' as const,
          formaPagoSeleccionada: 'Anual' as const,
          status: 'Cotizado' as const,
          userEmail: 'ccjimenez@jiro.com.mx',
          resultados: [] as any[],
        },
        {
          id: 'q-seed-5',
          folio: 'COT-20260610-115A',
          fechaCreacion: new Date('2026-06-10T12:00:00.000Z').toISOString(),
          cliente: {
            id: 'c-seed-5',
            nombre: 'Inversiones Especiales del Centro',
            tipoPersona: 'Moral' as const,
            rfc: 'IEC230101G31',
            correo: 'finanzas@iec.com.mx',
            telefono: '5520938412',
            codigoPostal: '11520',
          },
          vehiculo: {
            id: 'bmw-x5-1',
            marca: 'BMW',
            modelo: 'X5',
            anio: 2025,
            version: 'xDrive 50e L6 3.0T Hybrid',
            descripcionCompleta: 'BMW X5 XDRIVE 50E 5P L6 3.0T PHEV AUT.',
            claveAmis: '20754',
            valorReferencia: 1399000,
          },
          paqueteSeleccionado: 'Amplia' as const,
          formaPagoSeleccionada: 'Anual' as const,
          status: 'Cotizado' as const,
          userEmail: 'ccjimenez@jiro.com.mx',
          resultados: [] as any[],
        },
        {
          id: 'q-seed-6',
          folio: 'COT-20260609-112B',
          fechaCreacion: new Date('2026-06-09T12:00:00.000Z').toISOString(),
          cliente: {
            id: 'c-seed-6',
            nombre: 'Sofía Lara Mendoza',
            tipoPersona: 'Fisica' as const,
            rfc: 'LAMS000101G31',
            correo: 'sofia.lara@outlook.com',
            telefono: '9514029381',
            codigoPostal: '70000',
          },
          vehiculo: {
            id: 'hon-fit-1',
            marca: 'Honda',
            modelo: 'Fit',
            anio: 2020,
            version: 'Hit L4 1.5L CVT',
            descripcionCompleta: 'HONDA FIT HIT 5P L4 1.5L ABS BA AC R16 CVT',
            claveAmis: '8554',
            valorReferencia: 239200,
          },
          paqueteSeleccionado: 'Amplia' as const,
          formaPagoSeleccionada: 'Anual' as const,
          status: 'Cotizado' as const,
          userEmail: 'ccjimenez@jiro.com.mx',
          resultados: [] as any[],
        },
        {
          id: 'q-seed-7',
          folio: 'COT-20260527-SENT',
          fechaCreacion: new Date('2026-05-27T10:00:00.000Z').toISOString(),
          cliente: {
            id: 'c-seed-7',
            nombre: 'Gabriela Torres Solís',
            tipoPersona: 'Fisica' as const,
            rfc: 'TOSG750212G31',
            correo: 'gaby.torres@gmail.com',
            telefono: '2311029384',
            codigoPostal: '73930',
          },
          vehiculo: {
            id: 'niss-sentra-3',
            marca: 'Nissan',
            modelo: 'Sentra',
            anio: 2024,
            version: 'Advanced L4 2.0 CVT',
            descripcionCompleta: 'NISSAN SENTRA ADVANCED L4 2.0 CVT',
            claveAmis: '0715611',
            armadoraGnp: 'NI',
            carroceriaGnp: '02',
            versionGnp: '05',
            valorReferencia: 347634,
          },
          paqueteSeleccionado: 'Amplia' as const,
          formaPagoSeleccionada: 'Anual' as const,
          status: 'Cotizado' as const,
          userEmail: 'ccjimenez@jiro.com.mx',
          resultados: [] as any[],
        },
        {
          id: 'q-seed-8',
          folio: 'COT-20260526-SENT',
          fechaCreacion: new Date('2026-05-26T10:00:00.000Z').toISOString(),
          cliente: {
            id: 'c-seed-8',
            nombre: 'Rodolfo Castro Luna',
            tipoPersona: 'Fisica' as const,
            rfc: 'CALR750526G31',
            correo: 'rodolfo.castro@yahoo.com',
            telefono: '2311059381',
            codigoPostal: '73930',
          },
          vehiculo: {
            id: 'niss-sentra-4',
            marca: 'Nissan',
            modelo: 'Sentra',
            anio: 2025,
            version: 'Advanced L4 2.0 CVT',
            descripcionCompleta: 'NISSAN SENTRA ADVANCED L4 2.0 CVT',
            claveAmis: '0715611',
            armadoraGnp: 'NI',
            carroceriaGnp: '02',
            versionGnp: '05',
            valorReferencia: 347634,
          },
          paqueteSeleccionado: 'Amplia' as const,
          formaPagoSeleccionada: 'Anual' as const,
          status: 'Cotizado' as const,
          userEmail: 'ccjimenez@jiro.com.mx',
          resultados: [] as any[],
        }
      ];

      quotesArr = seedBase.map(q => {
        return {
          ...q,
          resultados: activeInsurers.map(ins => {
            return calculateSimulatedQuote(ins, q.vehiculo, q.cliente, q.paqueteSeleccionado, q.formaPagoSeleccionada);
          })
        };
      });

      localStorage.setItem('movi_quotes', JSON.stringify(quotesArr));
    }
    setQuotes(quotesArr);

    // Get Technical logs
    setLogs(getWSLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearLogs = () => {
    clearWSLogs();
    setLogs([]);
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (activeLogTab === 'errors') return !log.correcto;
    if (activeLogTab === 'success') return log.correcto;
    return true;
  });

  // Calculate metrics
  const totalPremium = quotes.reduce((acc, q) => acc + (q.resultados?.[0]?.primaTotal || 12000), 0);
  const averagePremium = quotes.length > 0 ? totalPremium / quotes.length : 0;
  const cotizadasCount = quotes.filter(q => q.status === 'Cotizado').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Emitido': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cotizado': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'En Revisión': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Borrador': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-650';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 rounded-2xl p-6.5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent pointer-events-none" />
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Bienvenido de vuelta, {user?.nombre}</h2>
          <p className="text-xs text-slate-300 font-medium leading-relaxed mt-1">
            Espacio de cotización en tiempo real. Configura credenciales y realiza análisis comparativos de póliza.
          </p>
        </div>
        <button
          onClick={() => onNavigate('cotizador')}
          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 group shadow border border-blue-500 cursor-pointer"
          id="btn-quick-new-quote"
        >
          <PlusCircle size={16} /> Nueva Cotización 
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Cotizaciones Totales
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1 leading-none tracking-tight">
              {quotes.length}
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-2">Guardadas en caché local</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <FileText size={18} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Cotizaciones Completas
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1 leading-none tracking-tight">
              {cotizadasCount}
            </p>
            <p className="text-[10px] text-emerald-600 font-bold mt-2">Con precios de WS</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <TrendingUp size={18} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Prima Promedio
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1 leading-none tracking-tight">
              ${Math.round(averagePremium).toLocaleString('es-MX')}
            </p>
            <p className="text-[10px] text-slate-400 font-medium mt-2">Valores en MXN</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
            <Layers size={18} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Aseguradoras Lista
            </p>
            <p className="text-2xl font-black text-slate-900 mt-1 leading-none tracking-tight">
              4 / 6
            </p>
            <p className="text-[10px] text-emerald-600 font-bold mt-2">Canal Operativo</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
            <Building size={18} />
          </div>
        </div>

      </div>

      {/* Main split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Quotes Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cotizaciones Recientes</h3>
              <p className="text-[10px] text-slate-450 leading-none mt-1">
                Últimos registros guardados localmente
              </p>
            </div>
            <button 
              onClick={() => onNavigate('cotizaciones')}
              className="text-xs text-blue-600 hover:text-blue-750 font-bold transition flex items-center gap-1"
            >
              Ver todas <ArrowRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                  <th className="pb-2.5">Folio</th>
                  <th className="pb-2.5">Cliente</th>
                  <th className="pb-2.5">Auto</th>
                  <th className="pb-2.5">Estatus</th>
                  <th className="pb-2.5">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-55 text-xs font-semibold text-slate-750">
                {quotes.slice(0, 5).map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 font-mono font-bold text-slate-800">{q.folio}</td>
                    <td className="py-3">
                      <div className="font-extrabold leading-tight text-slate-800">{q.cliente.nombre}</div>
                      <span className="text-[10px] text-slate-450 uppercase">{q.cliente.tipoPersona}</span>
                    </td>
                    <td className="py-3 max-w-[200px] truncate" title={q.vehiculo.descripcionCompleta}>
                      {q.vehiculo.marca} {q.vehiculo.modelo}
                      <span className="block text-[9px] text-slate-450">{q.vehiculo.anio} | {q.vehiculo.version}</span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] border px-2 py-0.5 rounded-full font-bold uppercase ${getStatusColor(q.status)}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => {
                          onSelectQuote(q);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-750 px-2.5 py-1 rounded text-[10px] font-bold transition cursor-pointer"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Workflow Actions & Support info */}
        <div className="space-y-4">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Activity size={16} className="text-blue-500 animate-pulse" /> Estado de Integraciones
            </h3>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="font-bold text-slate-850">Quálitas Cotización</span>
                </div>
                <span className="text-[9px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                  SOAP OK
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-850">GNP Preferente</span>
                </div>
                <span className="text-[9px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                  WSP OK
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-bold text-slate-850">ANA Seguros</span>
                </div>
                <span className="text-[9px] font-mono bg-amber-100 text-amber-750 px-1.5 py-0.5 rounded font-bold">
                  SOAP PEND
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-150">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="font-bold text-slate-850">El Potosí API</span>
                </div>
                <span className="text-[9px] font-mono bg-rose-100 text-rose-750 px-1.5 py-0.5 rounded font-bold text-right leading-tight max-w-[80px] break-words">
                  REST BLOCKED
                </span>
              </div>
            </div>
          </div>

          {/* Quick-Access tools panel */}
          <div className="bg-gradient-to-tr from-slate-900 to-slate-950 p-5 rounded-2xl text-white shadow-sm space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-blue-400 tracking-wider">
              Acceso a Administración
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={() => onNavigate('aseguradoras')}
                className="bg-slate-850 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-left transition font-semibold cursor-pointer"
              >
                Configurar Credenciales
              </button>
              <button 
                onClick={() => onNavigate('catalogo')}
                className="bg-slate-850 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-left transition font-semibold cursor-pointer"
              >
                Catálogo Homologado
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Corporate Technical Logs terminal (Auditor) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-slate-500" /> Historial de Logs Web Services (WS Logs)
            </h3>
            <p className="text-[10px] text-slate-400 leading-none mt-1">
              Registro de peticiones y respuestas para auditorías técnicas
            </p>
          </div>
          
          <div className="flex items-center gap-2 self-start shrink-0">
            {/* Filter buttons */}
            <div className="bg-slate-100 p-1 rounded-lg flex items-center text-[10px] font-bold">
              <button
                onClick={() => setActiveLogTab('all')}
                className={`px-2 py-1 rounded ${activeLogTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveLogTab('errors')}
                className={`px-2 py-1 rounded ${activeLogTab === 'errors' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-500'}`}
              >
                Errores
              </button>
              <button
                onClick={() => setActiveLogTab('success')}
                className={`px-2 py-1 rounded ${activeLogTab === 'success' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500'}`}
              >
                Exitosos
              </button>
            </div>

            <button
              onClick={handleClearLogs}
              className="p-1 px-2.5 hover:bg-red-50 text-red-650 hover:text-red-700 rounded text-[10px] font-bold flex items-center gap-1 transition"
              title="Borrar logs"
            >
              <Trash2 size={13} /> Limpiar
            </button>
            <button
              onClick={loadData}
              className="p-1 px-2 hover:bg-slate-100 text-slate-650 rounded text-[10px] font-bold flex items-center gap-1 transition"
              title="Recargar"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl text-xs space-y-1.5">
            <Clock size={24} className="mx-auto text-slate-350" />
            <p className="font-bold">Sin transacciones registradas</p>
            <p className="text-[10px]">Realiza cotizaciones para poblar el depurador corporativo.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div 
                key={log.id} 
                className={`border rounded-2xl overflow-hidden text-xs transition ${
                  log.correcto 
                    ? 'border-emerald-150 bg-emerald-50/15' 
                    : 'border-red-150 bg-red-50/15'
                }`}
              >
                
                {/* Log ribbon */}
                <div className={`p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b ${
                  log.correcto ? 'border-emerald-100' : 'border-red-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${log.correcto ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-extrabold text-slate-900">{log.aseguradora}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono font-bold">
                      {log.tipo}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                    <span>IP/Status: <strong className="font-mono">{log.status}</strong></span>
                    <span>Fecha: {new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Log contents (payload simulation) */}
                <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 font-mono text-[11px] text-slate-600">
                  <div className="space-y-1">
                    <span className="block text-[9px] font-sans font-black text-slate-400 uppercase tracking-widest leading-none">
                      Request Payload (Payload Enviado)
                    </span>
                    <pre className="p-2 border border-slate-200 bg-white rounded-lg h-24 overflow-y-auto whitespace-pre-wrap leading-tight text-slate-750">
                      {log.requestBody}
                    </pre>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[9px] font-sans font-black text-slate-400 uppercase tracking-widest leading-none">
                      Response XML / JSON (Respuesta Web Service)
                    </span>
                    <pre className={`p-2 border rounded-lg h-24 overflow-y-auto whitespace-pre-wrap leading-tight ${
                      log.correcto ? 'border-amber-200 bg-white text-slate-850' : 'border-red-200 bg-red-50/50 text-red-800'
                    }`}>
                      {log.responseBody}
                    </pre>
                  </div>
                </div>

                {/* Error Banner inside log block */}
                {!log.correcto && (
                  <div className="p-2 bg-red-100/50 border-t border-red-100 text-[10px] text-red-800 flex items-center gap-1">
                    <AlertTriangle size={13} className="shrink-0 text-red-700" />
                    <span><strong>Error diagnosticado:</strong> {log.mensajeError || 'Falla no especificada.'}</span>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
