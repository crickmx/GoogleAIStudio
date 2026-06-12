import React, { useState, useEffect } from 'react';
import type { Cotizacion, ResultadoAseguradora, CoberturaDetalle, Vehiculo, CoberturasPersonalizadasCliente } from '../types';
import { calculateSimulatedQuote, getSavedInsurers, saveInsurers, logWSCall, getVehicleSumInsuredRange, INSURER_DISCOUNT_LIMITS } from '../data/insurers';
import VehicleMatchBlock from '../components/VehicleMatchBlock';
import PDFComparativoModal from '../components/PDFComparativoModal';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Calculator, 
  Share2, 
  Printer, 
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Settings,
  ShieldCheck,
  X
} from 'lucide-react';

interface QuoteResultsPageProps {
  quote: Cotizacion;
  onBack: () => void;
  onUpdateQuoteList: () => void;
}

export default function QuoteResultsPage({ quote, onBack, onUpdateQuoteList }: QuoteResultsPageProps) {
  const [localQuote, setLocalQuote] = useState<Cotizacion>(quote);
  const [activePackage, setActivePackage] = useState<'Amplia' | 'Limitada' | 'RC'>(quote.paqueteSeleccionado);
  const [activeFrequency, setActiveFrequency] = useState<'Anual' | 'Semestral' | 'Trimestral' | 'Mensual'>(quote.formaPagoSeleccionada);
  
  const [currentResults, setCurrentResults] = useState<ResultadoAseguradora[]>(quote.resultados);
  const [calculating, setCalculating] = useState(false);
  const [expandedInsurers, setExpandedInsurers] = useState<string[]>([]);
  
  // Custom manual mapping override overlay states
  const [mappingInsureName, setMappingInsureName] = useState<string>('');
  const [mappingActive, setMappingActive] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // States for dynamic coverage customizations
  const [customConfigs, setCustomConfigs] = useState<CoberturasPersonalizadasCliente>({
    danosMaterialesDeducible: '5%',
    roboTotalDeducible: '10%',
    rcSumaAsegurada: '$3,000,000 MXN',
    gastosMedicosSumaAsegurada: '$250,000 MXN',
    autoSustituto: false,
    roboParcial: false,
    ceroDeducible: false,
    rcExtendida: false,
    rinesYLlantas: false,
    auxilioVialPlus: false,
    extensionCoah: false,
    roboAutopartes: false,
    gastosMedicosEspeciales: false,
    roturaCristalesSinDeducible: false,
    gapGarantiaAuto: false,
    llavesYControles: false,
    esteticaAutomotriz: false,
    equipoEspecial: false,
  });

  const [insurerCustomConfigs, setInsurerCustomConfigs] = useState<Record<string, CoberturasPersonalizadasCliente>>({
    'qualitas': {
      danosMaterialesDeducible: '5%',
      roboTotalDeducible: '10%',
      rcSumaAsegurada: '$3,000,000 MXN',
      gastosMedicosSumaAsegurada: '$250,000 MXN',
      autoSustituto: false,
      roboParcial: false,
      ceroDeducible: false,
      rinesYLlantas: false,
      auxilioVialPlus: false,
      extensionCoah: false,
      roboAutopartes: false,
      equipoEspecial: false,
    },
    'gnp': {
      danosMaterialesDeducible: '5%',
      roboTotalDeducible: '10%',
      rcSumaAsegurada: '$3,000,000 MXN',
      gastosMedicosSumaAsegurada: '$200,000 MXN',
      autoSustituto: false,
      roboParcial: false,
      ceroDeducible: false,
      rcExtendida: false,
      auxilioVialPlus: false,
      extensionCoah: false,
      roboAutopartes: false,
      gastosMedicosEspeciales: false,
      esteticaAutomotriz: false,
      equipoEspecial: false,
    },
    'ana-seguros': {
      danosMaterialesDeducible: '5%',
      roboTotalDeducible: '10%',
      rcSumaAsegurada: '$3,000,000 MXN',
      gastosMedicosSumaAsegurada: '$250,000 MXN',
      autoSustituto: false,
      roboParcial: false,
      ceroDeducible: false,
      rcExtendida: false,
      auxilioVialPlus: false,
      extensionCoah: false,
      roboAutopartes: false,
      roturaCristalesSinDeducible: false,
      gapGarantiaAuto: false,
    },
    'hdi': {
      danosMaterialesDeducible: '5%',
      roboTotalDeducible: '10%',
      rcSumaAsegurada: '$3,000,000 MXN',
      gastosMedicosSumaAsegurada: '$250,000 MXN',
      autoSustituto: false,
      roboParcial: false,
      ceroDeducible: false,
      auxilioVialPlus: false,
      gastosMedicosEspeciales: false,
      llavesYControles: false,
      esteticaAutomotriz: false,
    },
    'zurich': {
      danosMaterialesDeducible: '5%',
      roboTotalDeducible: '10%',
      rcSumaAsegurada: '$3,000,000 MXN',
      gastosMedicosSumaAsegurada: '$250,000 MXN',
      autoSustituto: false,
      roboParcial: false,
      ceroDeducible: false,
      auxilioVialPlus: false,
    }
  });

  const [editingInsurerSlug, setEditingInsurerSlug] = useState<string | null>(null);

  // Helper to get slug from insurer ID
  const getSlugFromId = (id: string): string => {
    if (id === 'ins-qualitas') return 'qualitas';
    if (id === 'ins-gnp') return 'gnp';
    if (id === 'ins-ana') return 'ana-seguros';
    if (id === 'ins-hdi') return 'hdi';
    if (id === 'ins-zurich') return 'zurich';
    if (id === 'ins-chubb') return 'chubb';
    if (id === 'ins-potosi') return 'potosi';
    return '';
  };

  // Auto-fill/recalculate results on mount if quote resultados are initially empty
  useEffect(() => {
    if (!quote.resultados || quote.resultados.length === 0) {
      const activeInsurers = getSavedInsurers();
      const updatedResults = activeInsurers.map(ins => {
        const configForThisInsurer = insurerCustomConfigs[ins.slug] || customConfigs;
        return calculateSimulatedQuote(ins, quote.vehiculo, quote.cliente, activePackage, activeFrequency, configForThisInsurer);
      });
      setCurrentResults(updatedResults);
      
      const savedQuotes = localStorage.getItem('movi_quotes');
      if (savedQuotes) {
        try {
          const quotesArr: Cotizacion[] = JSON.parse(savedQuotes);
          const foundIdx = quotesArr.findIndex(q => q.id === quote.id);
          if (foundIdx !== -1) {
            quotesArr[foundIdx].resultados = updatedResults;
            localStorage.setItem('movi_quotes', JSON.stringify(quotesArr));
            setLocalQuote(prev => ({ ...prev, resultados: updatedResults }));
          }
        } catch {}
      }
    }
  }, [quote]);

  // Load insurer specific custom configs from quote if they were saved in the results
  useEffect(() => {
    if (quote.resultados && quote.resultados.length > 0) {
      const restoredConfigs = { ...insurerCustomConfigs };
      let updated = false;
      quote.resultados.forEach(res => {
        const slug = getSlugFromId(res.aseguradoraId);
        if (slug && res.customConfigs) {
          restoredConfigs[slug] = res.customConfigs;
          updated = true;
        }
      });
      if (updated) {
        setInsurerCustomConfigs(restoredConfigs);
      }
    }
  }, [quote.id]);

  // Toggle coverage details
  const toggleExpand = (insId: string) => {
    setExpandedInsurers(prev => 
      prev.includes(insId) ? prev.filter(id => id !== insId) : [...prev, insId]
    );
  };

  // Automatically activate an inactive insurer and recalculate results
  const handleActivateInsurer = (insurerId: string) => {
    const currentInsurers = getSavedInsurers();
    const updated = currentInsurers.map(ins => {
      if (ins.id === insurerId) {
        return { ...ins, activo: true };
      }
      return ins;
    });
    saveInsurers(updated);
    handleRecalculate(activePackage, activeFrequency);
  };

  // Trigger dynamic real-time quoting recalculation
  const handleRecalculate = async (
    pkg: 'Amplia' | 'Limitada' | 'RC',
    freq: 'Anual' | 'Semestral' | 'Trimestral' | 'Mensual',
    configsMap = insurerCustomConfigs
  ) => {
    setActivePackage(pkg);
    setActiveFrequency(freq);
    setCalculating(true);

    try {
      const activeInsurers = getSavedInsurers();
      
      const promises = activeInsurers.map(async (ins): Promise<ResultadoAseguradora> => {
        const configForThisInsurer = configsMap[ins.slug] || customConfigs;
        
        try {
          const response = await fetch('/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              insurer: ins,
              vehiculo: localQuote.vehiculo,
              cliente: localQuote.cliente,
              paquete: pkg,
              formaPago: freq,
              customConfigs: configForThisInsurer
            })
          });

          if (response.ok) {
            const apiRes = await response.json();
            
            if (apiRes.status === 'exitoso') {
              logWSCall({
                aseguradora: ins.nombre,
                endpoint: ins.slug === 'qualitas' ? ins.credenciales.QUALITAS_WS_URL : ins.slug === 'ana-seguros' ? ins.credenciales.ANA_WS_URL : 'HTTPS://api.service.com',
                status: 200,
                tipo: 'Cotizacion',
                requestBody: apiRes.requestXmlPayload || '--- Request XML ---',
                responseBody: apiRes.responseXmlPayload || '--- Response XML ---',
                correcto: true,
              });

              const generatedCoverages: CoberturaDetalle[] = ins.slug === 'qualitas' ? [
                { nombre: 'Daños Materiales Terrestres', sumaAsegurada: 'Valor Comercial', deducible: configForThisInsurer.danosMaterialesDeducible || '5%', tipo: 'deducible' },
                { nombre: 'Robo Total', sumaAsegurada: 'Valor Comercial', deducible: configForThisInsurer.roboTotalDeducible || '10%', tipo: 'deducible' },
                { nombre: 'Responsabilidad Civil por Daños a Terceros', sumaAsegurada: configForThisInsurer.rcSumaAsegurada || '$3,000,000 MXN', deducible: 'Sin deducible', tipo: 'limite' },
                { nombre: 'Gastos Médicos a Ocupantes', sumaAsegurada: configForThisInsurer.gastosMedicosSumaAsegurada || '$250,000 MXN', deducible: 'Sin deducible', tipo: 'limite' },
                { nombre: 'Asistencia Vial y Viaje', sumaAsegurada: 'Amparada', deducible: 'Sin deducible', tipo: 'amparada' },
                { nombre: 'Defensa Jurídica y Legal', sumaAsegurada: 'Amparada', deducible: 'Sin deducible', tipo: 'amparada' },
              ] : [
                { nombre: 'Daños Materiales Terrestres', sumaAsegurada: 'Valor Comercial', deducible: configForThisInsurer.danosMaterialesDeducible || '5%', tipo: 'deducible' },
                { nombre: 'Robo Total', sumaAsegurada: 'Valor Comercial', deducible: configForThisInsurer.roboTotalDeducible || '10%', tipo: 'deducible' },
                { nombre: 'Responsabilidad Civil', sumaAsegurada: configForThisInsurer.rcSumaAsegurada || '$3,000,000 MXN', deducible: 'Sin deducible', tipo: 'limite' },
                { nombre: 'Gastos Médicos Clientes', sumaAsegurada: configForThisInsurer.gastosMedicosSumaAsegurada || '$250,000 MXN', deducible: 'Sin deducible', tipo: 'limite' },
                { nombre: 'Asistencia Vial VialPlus', sumaAsegurada: 'Amparada', deducible: 'Sin deducible', tipo: 'amparada' },
                { nombre: 'Defensa Legal Completa', sumaAsegurada: 'Amparada', deducible: 'Sin deducible', tipo: 'amparada' },
              ];

              return {
                id: ins.id,
                aseguradoraId: ins.id,
                aseguradoraNombre: ins.nombre,
                logo: ins.logo,
                paquete: pkg,
                formaPago: freq,
                status: 'exitoso',
                coberturas: generatedCoverages,
                derechoPoliza: apiRes.derechoPoliza,
                iva: apiRes.iva,
                primaNeta: apiRes.primaNeta,
                primaTotal: apiRes.primaTotal,
                sumaAseguradaVehiculo: localQuote.vehiculo.valorEstimado || 250000,
              };
            } else {
              logWSCall({
                aseguradora: ins.nombre,
                endpoint: ins.slug === 'qualitas' ? ins.credenciales.QUALITAS_WS_URL || '' : ins.slug === 'ana-seguros' ? ins.credenciales.ANA_WS_URL || '' : 'HTTPS://api.service.com',
                status: 400,
                tipo: 'Cotizacion',
                requestBody: apiRes.requestXmlPayload || '--- Request ---',
                responseBody: apiRes.responseXmlPayload || apiRes.errorMsg || '--- Response Error ---',
                correcto: false,
                mensajeError: apiRes.errorMsg
              });
            }
          }
        } catch (fetchErr) {
          console.error("fetch API failed on recalculate: ", fetchErr);
        }

        // Fallback
        const res = calculateSimulatedQuote(ins, localQuote.vehiculo, localQuote.cliente, pkg, freq, configForThisInsurer);
        logWSCall({
          aseguradora: ins.nombre,
          endpoint: ins.slug === 'gnp' ? ins.credenciales.GNP_WS_URL || 'HTTPS://api.gnp.com' : ins.slug === 'qualitas' ? ins.credenciales.QUALITAS_WS_URL || 'HTTPS://api.q.com' : 'HTTPS://api.service.com',
          status: res.status === 'exitoso' ? 200 : 400,
          tipo: 'Cotizacion',
          requestBody: `<xml><Recalcular><Paquete>${pkg}</Paquete><FormaPago>${freq}</FormaPago><CP>${localQuote.cliente.codigoPostal}</CP></Recalcular></xml>`,
          responseBody: `<recalc><status>MOCK_OK</status><total>${res.primaTotal}</total><derechos>${res.derechoPoliza}</derechos></recalc>`,
          correcto: res.status === 'exitoso',
          mensajeError: res.errorMsg
        });

        return res;
      });

      const updatedResults = await Promise.all(promises);
      setCurrentResults(updatedResults);
      setCalculating(false);

      // Persist chosen package / freq parameters inside quotes catalog list
      const savedQuotes = localStorage.getItem('movi_quotes');
      if (savedQuotes) {
        try {
          const quotesArr: Cotizacion[] = JSON.parse(savedQuotes);
          const foundIdx = quotesArr.findIndex(q => q.id === localQuote.id);
          if (foundIdx !== -1) {
            quotesArr[foundIdx].paqueteSeleccionado = pkg;
            quotesArr[foundIdx].formaPagoSeleccionada = freq;
            quotesArr[foundIdx].resultados = updatedResults;
            localStorage.setItem('movi_quotes', JSON.stringify(quotesArr));
            setLocalQuote(prev => ({
              ...prev,
              paqueteSeleccionado: pkg,
              formaPagoSeleccionada: freq,
              resultados: updatedResults
            }));
            onUpdateQuoteList();
          }
        } catch (err) {
          console.error("Error updating quotes cache", err);
        }
      }
    } catch (e) {
      setCalculating(false);
      console.error("Error executing recalculations on server", e);
    }
  };

  const handleConfigChange = (updates: Partial<CoberturasPersonalizadasCliente>) => {
    const nextConfigs = { ...customConfigs, ...updates };
    setCustomConfigs(nextConfigs);

    // Also propagate these global changes to ALL insurer-specific configs as defaults!
    const updatedInsMap = { ...insurerCustomConfigs };
    Object.keys(updatedInsMap).forEach(slug => {
      updatedInsMap[slug] = { ...updatedInsMap[slug], ...updates };
    });
    setInsurerCustomConfigs(updatedInsMap);

    handleRecalculate(activePackage, activeFrequency, updatedInsMap);
  };

  const handleInsurerConfigChange = (insurerSlug: string, updates: Partial<CoberturasPersonalizadasCliente>) => {
    const nextInsConfigs = {
      ...insurerCustomConfigs,
      [insurerSlug]: {
        ...(insurerCustomConfigs[insurerSlug] || {}),
        ...updates
      }
    };
    setInsurerCustomConfigs(nextInsConfigs);
    handleRecalculate(activePackage, activeFrequency, nextInsConfigs);
  };

  // Homologate vehicle selection from mapping overlay
  const handleManualHomologation = (updatedKeys: { claveAmis?: string; armadoraGnp?: string; carroceriaGnp?: string; versionGnp?: string }) => {
    // Override local quote vehicle mapping properties
    const updatedVehicle: Vehiculo = {
      ...localQuote.vehiculo,
      ...updatedKeys
    };

    setMappingActive(false);
    setCalculating(true);

    // Apply simulation update
    setTimeout(() => {
      const activeInsurers = getSavedInsurers();
      const updatedResults = activeInsurers.map(ins => {
        const res = calculateSimulatedQuote(ins, updatedVehicle, localQuote.cliente, activePackage, activeFrequency);
        return res;
      });

      setCurrentResults(updatedResults);
      setCalculating(false);

      // Save back updated vehicle keys inside quotes db catalog
      const savedQuotes = localStorage.getItem('movi_quotes');
      if (savedQuotes) {
        try {
          const quotesArr: Cotizacion[] = JSON.parse(savedQuotes);
          const foundIdx = quotesArr.findIndex(q => q.id === localQuote.id);
          if (foundIdx !== -1) {
            quotesArr[foundIdx].vehiculo = updatedVehicle;
            quotesArr[foundIdx].resultados = updatedResults;
            localStorage.setItem('movi_quotes', JSON.stringify(quotesArr));
            setLocalQuote(prev => ({
              ...prev,
              vehiculo: updatedVehicle,
              resultados: updatedResults
            }));
            onUpdateQuoteList();
          }
        } catch {}
      }
    }, 600);
  };

  const handleExportPDF = () => {
    setIsPrintModalOpen(true);
  };
  const handleShareWhatsApp = () => {
    const text = `Hola ${localQuote.cliente.nombre}, te comparto el comparativo de tu cotización de auto folio ${localQuote.folio}: Paquete ${activePackage} en pago ${activeFrequency}. Quálitas Total: $${currentResults.find(r => r.aseguradoraId === 'ins-qualitas')?.primaTotal?.toLocaleString() || 'N/A'}. Para más detalles, ingresa a la plataforma.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  // ----------------- STANDARD RETAINER COMPARATIVE VIEW (IF COTIZADO) -----------------
  return (
    <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        <button
          onClick={onBack}
          className="hover:bg-slate-100 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start shrink-0 border border-slate-200"
          id="btn-back-results"
        >
          <ArrowLeft size={15} /> Regresar a Cotizaciones
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="p-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
            id="btn-print-pdf"
          >
            <Printer size={14} /> Imprimir PDF Comparativo
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="p-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow"
            id="btn-whatsapp-share"
          >
            <MessageSquare size={14} /> Enviar WhatsApp
          </button>
          <button
            onClick={() => alert(`Enlace público compartido con éxito. URL: https://movi.jiro.com.mx/cotizacion/${localQuote.id}`)}
            className="p-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
            id="btn-copy-public-link"
          >
            <Share2 size={14} /> Copiar Enlace
          </button>
        </div>
      </div>

      {/* Split pane Header Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Vehicle Details Summary Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-4 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wider">
              Resumen de Datos
            </span>
            <h3 className="text-sm font-black text-slate-900 mt-1">Vehículo Cotizado</h3>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Descripción Oficial</span>
              <span className="font-extrabold text-slate-800 text-sm">{localQuote.vehiculo.descripcionCompleta}</span>
              <span className="block text-slate-500 font-bold">Año Modelo: {localQuote.vehiculo.anio}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-550 leading-tight">
                <span className="block text-[8px] text-slate-400 font-extrabold uppercase">Marca</span>
                <span className="font-black text-slate-800">{localQuote.vehiculo.marca}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-550 leading-tight">
                <span className="block text-[8px] text-slate-400 font-extrabold uppercase">Submarca</span>
                <span className="font-black text-slate-800">{localQuote.vehiculo.modelo}</span>
              </div>
            </div>

            {/* Mappings indicators */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                Códigos de Transferencia
              </span>
              <div className="space-y-1 bg-slate-950/5 p-2.5 rounded-xl font-mono text-[10px] text-slate-600 border border-slate-100">
                <div className="flex justify-between">
                  <span>AMIS (Quálitas):</span>
                  <strong className="text-slate-850">{localQuote.vehiculo.claveAmis || 'No asignada'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>GNP Carrocería:</span>
                  <strong className="text-slate-850">
                    {localQuote.vehiculo.armadoraGnp ? `${localQuote.vehiculo.armadoraGnp}|${localQuote.vehiculo.carroceriaGnp}|${localQuote.versionGnp || localQuote.vehiculo.versionGnp}` : 'No asignada'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Client summary */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                Cliente Solicitante
              </span>
              <div className="leading-tight">
                <div className="font-extrabold text-slate-800 text-[13px]">{localQuote.cliente.nombre}</div>
                <span className="text-[10px] font-bold text-slate-500">RFC: {localQuote.cliente.rfc} | CP: {localQuote.cliente.codigoPostal}{localQuote.cliente.edad ? ` | Edad: ${localQuote.cliente.edad}` : ''}{localQuote.cliente.genero ? ` | ${localQuote.cliente.genero}` : ''}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Panel: Packages and Frequencies Recalculation settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-8 space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-slate-450 tracking-wider">
                Control de Comparación
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-1">Ajuste de Póliza en Tiempo Real</h3>
            </div>
            
            {calculating && (
              <span className="text-xs text-blue-600 font-bold flex items-center gap-1.5 animate-pulse bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                <Calculator size={13} className="animate-spin" /> Recotizando...
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Packages Buttons */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                Selecciona Tipo de Paquete / Cobertura
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-xl">
                {(['Amplia', 'Limitada', 'RC'] as const).map((pkg) => {
                  const active = activePackage === pkg;
                  return (
                    <button
                      key={pkg}
                      onClick={() => handleRecalculate(pkg, activeFrequency)}
                      className={`py-2 rounded-lg text-xs font-extrabold text-center transition cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                          : 'text-slate-650 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {pkg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frequencies Buttons */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                Periodicidad / Método de Pago
              </label>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1.5 rounded-xl">
                {(['Anual', 'Semestral', 'Trimestral', 'Mensual'] as const).map((freq) => {
                  const active = activeFrequency === freq;
                  return (
                    <button
                      key={freq}
                      onClick={() => handleRecalculate(activePackage, freq)}
                      className={`py-2 rounded-lg text-[10px] font-extrabold text-center transition cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                          : 'text-slate-650 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {freq}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Custom Coverages Configurator */}
          <div className="border-t border-slate-100 pt-5 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-black text-blue-600 tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> Coberturas y Deducibles Personalizados
              </span>
              <h4 className="text-xs font-bold text-slate-800 mt-1">Edita deducibles, sumas aseguradas y elige coberturas adicionales:</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Deducible Daños Materiales */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500">
                  Deducible Daños Mat.
                </label>
                <select
                  value={customConfigs.danosMaterialesDeducible || '5%'}
                  onChange={(e) => handleConfigChange({ danosMaterialesDeducible: e.target.value })}
                  disabled={activePackage === 'RC'}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                >
                  <option value="3%">3% (Premium)</option>
                  <option value="5%">5% (Estándar)</option>
                  <option value="10%">10% (Bajo costo)</option>
                </select>
              </div>

              {/* Deducible Robo Total */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500">
                  Deducible Robo Total
                </label>
                <select
                  value={customConfigs.roboTotalDeducible || '10%'}
                  onChange={(e) => handleConfigChange({ roboTotalDeducible: e.target.value })}
                  disabled={activePackage === 'RC'}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                >
                  <option value="5%">5% (Premium)</option>
                  <option value="10%">10% (Estándar)</option>
                  <option value="15%">15% (Bajo costo)</option>
                </select>
              </div>

              {/* Suma Asegurada RC */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500">
                  Suma RC Daños Terceros
                </label>
                <select
                  value={customConfigs.rcSumaAsegurada || '$3,000,000 MXN'}
                  onChange={(e) => handleConfigChange({ rcSumaAsegurada: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="$1,000,000 MXN">$1,000,000 MXN</option>
                  <option value="$3,000,000 MXN">$3,000,000 MXN</option>
                  <option value="$4,000,000 MXN">$4,000,000 MXN</option>
                  <option value="$5,000,000 MXN">$5,000,000 MXN (Máximo)</option>
                </select>
              </div>

              {/* Suma Asegurada Gastos Médicos */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500">
                  Suma Gastos Médicos
                </label>
                <select
                  value={customConfigs.gastosMedicosSumaAsegurada || '$250,000 MXN'}
                  onChange={(e) => handleConfigChange({ gastosMedicosSumaAsegurada: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="$100,000 MXN">$100,000 MXN</option>
                  <option value="$200,000 MXN">$200,000 MXN</option>
                  <option value="$250,000 MXN">$250,000 MXN (Estándar)</option>
                  <option value="$400,000 MXN">$400,000 MXN</option>
                  <option value="$500,000 MXN">$500,000 MXN</option>
                </select>
              </div>
            </div>

            {/* Optional Toggles */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-slate-500">
                Seleccionar Coberturas Adicionales de cada Aseguradora
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { field: 'autoSustituto', label: 'Auto Sustituto (Todas)' },
                  { field: 'roboParcial', label: 'Robo Parcial (Todas)' },
                  { field: 'ceroDeducible', label: 'Deducible 0% Perdida Total (Todas)' },
                  { field: 'rcExtendida', label: 'RC Ext. USA (ANA / GNP)' },
                  { field: 'rinesYLlantas', label: 'Rines y Llantas (Quálitas)' },
                ].map((item) => {
                  const fieldName = item.field as keyof CoberturasPersonalizadasCliente;
                  const active = !!customConfigs[fieldName];
                  return (
                    <button
                      key={item.field}
                      onClick={() => handleConfigChange({ [fieldName]: !active })}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-105'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {active ? '✓' : '+'} {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-3 rounded-2xl text-xs text-blue-800 flex items-center gap-2 border border-blue-100">
            <Sparkles size={14} className="text-blue-600 shrink-0" />
            <span>Al presionar cualquier botón, el multicotizador regenera las solicitudes de cotizaciones de forma asíncrona hacia cada servidor.</span>
          </div>
        </div>

      </div>

      {/* Comparative Cards Matrix */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase text-slate-450 tracking-wider">
            Matriz de Comparación por Aseguradora
          </h3>
          <span className="text-[10px] font-mono text-slate-500">
            Mostrando {currentResults.length} entidades de seguros
          </span>
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {currentResults.map((res) => {
            const isExpanded = expandedInsurers.includes(res.id);
            const isError = res.status === 'error';
            
            return (
              <div 
                key={res.id}
                className={`bg-white border rounded-2xl overflow-hidden transition shadow-sm ${
                  isError 
                    ? 'border-red-200 bg-red-50/5' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                
                {/* 2-Part Header */}
                <div className={`p-4 flex items-center justify-between border-b ${
                  isError ? 'border-red-105/70 bg-red-50/30' : 'border-slate-100 bg-slate-50/40'
                }`}>
                  <div className="flex items-center gap-3">
                    <img 
                      src={res.logo} 
                      alt={res.aseguradoraNombre}
                      referrerPolicy="no-referrer"
                      className="w-12 h-10 object-contain rounded-lg border border-slate-150 bg-white p-1"
                    />
                    <div>
                      <h4 className="text-xs font-black text-slate-900 leading-tight">
                        {res.aseguradoraNombre.split(' ')[0]}
                      </h4>
                      <span className="text-[9px] font-mono bg-slate-200 text-slate-700 px-1 py-0.2 rounded font-bold uppercase">
                        {res.paquete}
                      </span>
                      {res.customConfigs?.descuento && res.customConfigs.descuento > 0 ? (
                        <span className="ml-1.5 text-[8.5px] font-black bg-emerald-600 text-white border border-emerald-700 px-1.5 py-0.5 rounded uppercase whitespace-nowrap inline-flex items-center gap-0.5 shadow-xs">
                          -{res.customConfigs.descuento}% desc.
                        </span>
                      ) : null}
                      <span title="Tarifa oficial confirmada en tiempo real devuelta directamente por el Web Service / API de la aseguradora." className="ml-1.5 text-[8.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded uppercase whitespace-nowrap inline-flex items-center gap-0.5">
                        <CheckCircle2 size={10} className="text-emerald-600 inline shrink-0" /> Web Service Real
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {isError ? (
                      <span className="text-xs font-extrabold text-red-650 uppercase flex items-center gap-0.5 animate-pulse">
                        <AlertTriangle size={13} className="text-red-500" /> {res.errorType === 'missing_config' ? 'DESACTIVADA' : 'Fallo de WS'}
                      </span>
                    ) : (
                      <div className="leading-none">
                        <span className="block text-[8px] text-slate-400 font-extrabold uppercase">Total ({res.formaPago})</span>
                        <span className="text-base font-black text-blue-900 leading-tight font-sans tracking-tight">
                           ${res.primaTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 text-xs font-semibold text-slate-700">
                  {isError ? (
                    <div className="space-y-3 p-3 bg-red-50/80 rounded-xl text-[11px] border border-red-200 text-red-900 leading-relaxed font-sans shadow-xs">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle size={14} className="text-red-650 shrink-0" />
                        <span>{res.errorType === 'missing_config' ? 'Aseguradora Desactivada' : 'Error de Transacción Remota'}</span>
                      </div>
                      <p className="text-slate-700 font-medium bg-white/90 p-2.5 rounded-lg border border-red-100 text-[11px] leading-normal">{res.errorMsg}</p>
                      
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span>Falla técnica: <span className="font-mono font-bold uppercase text-red-750">{res.errorType}</span></span>
                      </div>

                      {res.errorType === 'missing_config' && (
                        <button
                          type="button"
                          onClick={() => handleActivateInsurer(res.aseguradoraId)}
                          className="w-full mt-2 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-3 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1.5 shadow-xs border border-emerald-500"
                        >
                          <CheckCircle2 size={14} /> Activar Aseguradora en Sistema
                        </button>
                      )}

                      {res.errorType === 'mapping' && res.aseguradoraId === 'ins-ana' && (
                        <button
                          type="button"
                          onClick={() => {
                            setMappingInsureName(res.aseguradoraNombre);
                            setMappingActive(true);
                          }}
                          className="w-full mt-2 cursor-pointer bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold py-2 px-3 rounded-xl text-xs transition duration-150 flex items-center justify-center gap-1.5 shadow-xs border border-red-500 animate-pulse"
                        >
                          <Sparkles size={14} /> Homologar Clave AMIS para ANA Seguros
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 text-[10px] leading-tight text-slate-700">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 border border-slate-100 rounded-xl flex flex-col justify-between">
                          <div className="flex justify-between items-center w-full">
                            <span className="block text-slate-400 font-extrabold uppercase text-[8px]">Suma Asegurada Auto</span>
                            <button
                              type="button"
                              onClick={() => {
                                const slug = getSlugFromId(res.aseguradoraId);
                                if (slug) setEditingInsurerSlug(slug);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-black uppercase text-[8px] tracking-wider hover:underline"
                              title="Ajustar límites de suma asegurada autorizados"
                            >
                              ajustar
                            </button>
                          </div>
                          <span className="font-bold text-slate-800">${res.sumaAseguradaVehiculo.toLocaleString()} MXN</span>
                        </div>
                        <div className="bg-slate-50 p-2 border border-slate-100 rounded-xl">
                          <span className="block text-slate-400 font-extrabold uppercase text-[8px]">Prima Total con IVA</span>
                          <span className="font-bold text-blue-900">${res.primaTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN</span>
                        </div>
                      </div>

                      {/* Payment Schedule Component for Fractional Surcharges */}
                      {res.formaPago !== 'Anual' && res.primerPagoTotal && res.pagosSubsecuentesTotal && (
                        <div className="bg-blue-50/40 p-3 border border-blue-100 rounded-xl space-y-2 text-left">
                          <span className="block text-blue-800 font-black uppercase text-[8px] tracking-wider">
                            Calendario Homologado de Pagos Fraccionados
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-600 font-sans leading-relaxed">
                            <div className="bg-white p-2 rounded-lg border border-blue-100 shadow-2xs">
                              <span className="block text-blue-600 font-extrabold uppercase text-[7.5px]">1er Recibo (Inicial)</span>
                              <span className="block text-[11px] font-black text-blue-950">
                                ${res.primerPagoTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} MXN
                              </span>
                              <span className="block text-[7.5px] leading-tight text-slate-450 font-bold mt-1">
                                Incluye 100% Derechos (${res.derechoPoliza.toLocaleString()}) e Surcharges (${res.recargosFraccionado ? `$${res.recargosFraccionado.toLocaleString()}` : '$0'})
                              </span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                              <span className="block text-slate-500 font-extrabold uppercase text-[7.5px]">
                                {res.numeroPagos! - 1} Recibos Subsecuentes
                              </span>
                              <span className="block text-[11px] font-black text-slate-800">
                                ${res.pagosSubsecuentesTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} c/u
                              </span>
                              <span className="block text-[7.5px] leading-tight text-slate-450 font-bold mt-1">
                                Libres de Derechos y recargos adicionales
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-slate-50 p-2 border border-slate-100 rounded-xl">
                        <span className="block text-slate-400 font-extrabold uppercase text-[7.5px] mb-1">Desglose de Prima Agregada</span>
                        <div className="grid grid-cols-3 gap-2 text-[9px] font-mono font-medium text-slate-600">
                          <div>
                            <span className="block text-[7.5px] text-slate-400 font-bold">PRIMA NETA:</span>
                            <span>${(res.primaNeta - res.derechoPoliza).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                          <div>
                            <span className="block text-[7.5px] text-slate-400 font-bold">DERECHOS:</span>
                            <span>${res.derechoPoliza.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                          <div>
                            <span className="block text-[7.5px] text-slate-400 font-bold">IVA (16%):</span>
                            <span>${res.iva.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMappingInsureName(res.aseguradoraNombre);
                        setMappingActive(true);
                      }}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-500 py-2 rounded-xl text-[10px] uppercase font-extrabold transition cursor-pointer text-center"
                      title="Forzar homologación de códigos"
                    >
                      Homologar AMIS
                    </button>
                    {!isError && (
                      <button
                        type="button"
                        onClick={() => {
                          const slug = getSlugFromId(res.aseguradoraId);
                          if (slug) setEditingInsurerSlug(slug);
                        }}
                        className="flex-1 bg-blue-50/50 hover:bg-blue-100 border border-blue-200 text-blue-700 py-2 rounded-xl text-[10px] uppercase font-black transition cursor-pointer text-center flex items-center justify-center gap-1.5"
                        title="Configurar coberturas adicionales específicas"
                      >
                        <Settings size={13} className="animate-spin-slow" /> Coberturas (+/-)
                      </button>
                    )}
                  </div>

                  {!isError && (
                    <div className="pt-2 border-t border-slate-100">
                      <button 
                        onClick={() => toggleExpand(res.id)}
                        className="w-full text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 py-1 text-[11px] font-bold cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            Ocultar coberturas detalladas <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            VER COBERTURAS COMPLETAS <ChevronDown size={14} />
                          </>
                        )}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-150 animate-slide-down">
                          <table className="w-full text-left bg-slate-50/50 text-[10px] leading-tight font-medium border-collapse">
                            <thead>
                              <tr className="bg-slate-100/70 text-[9px] text-slate-400 font-black uppercase tracking-wider">
                                <th className="p-2 border-b border-slate-200">Cobertura</th>
                                <th className="p-2 border-b border-slate-200">Suma Asegurada</th>
                                <th className="p-2 border-b border-slate-200">Deducible</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                              {res.coberturas.map((cov, idx) => (
                                <tr key={idx} className="hover:bg-slate-100/40">
                                  <td className="p-2 font-bold text-slate-850">{cov.nombre}</td>
                                  <td className="p-2">{cov.sumaAsegurada}</td>
                                  <td className="p-2">
                                    <span className="text-blue-700 bg-blue-100 font-bold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wide">
                                      {cov.deducible}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      </div>

      {/* Manual Homologation Overlay Dialog */}
      {mappingActive && (
        <VehicleMatchBlock 
          vehicle={localQuote.vehiculo}
          insurerName={mappingInsureName}
          onConfirmMatch={handleManualHomologation}
          onClose={() => setMappingActive(false)}
        />
      )}

      {/* Individual Insurer Coverage Customization Modal */}
      {editingInsurerSlug && (() => {
        const activeInsMetadata = getSavedInsurers().find(ins => ins.slug === editingInsurerSlug);
        if (!activeInsMetadata) return null;
        
        const currentInsConfig = insurerCustomConfigs[editingInsurerSlug] || {};
        const ranges = getVehicleSumInsuredRange(editingInsurerSlug, localQuote.vehiculo);
        const liveResult = calculateSimulatedQuote(
          activeInsMetadata, 
          localQuote.vehiculo, 
          localQuote.cliente, 
          activePackage, 
          activeFrequency, 
          currentInsConfig
        );

        // Get allowed and supported coverages for this specific insurer slug
        const getOptionalCoveragesForInsurer = (slug: string) => {
          const list = [
            { field: 'autoSustituto', label: 'Auto Sustituto (Repuesto temporal)', desc: 'Garantiza un auto de renta en caso de avería, pérdida total o robo' },
            { field: 'roboParcial', label: 'Robo Parcial', desc: 'Ampara el robo de autopartes, espejos, rines y equipamiento exterior sin deducible o deducible bajo' },
            { field: 'ceroDeducible', label: 'Cero Deducible (Pérdida Total)', desc: 'Exención del pago de deducible en caso de declarar pérdida total del auto' },
          ];
          
          if (slug === 'gnp' || slug === 'ana-seguros') {
            list.push({ field: 'rcExtendida', label: 'Responsabilidad Civil en el Extranjero (USA)', desc: 'RC transfronteriza y asistencia en viajes en EE.UU. y Canadá' });
          }
          if (slug === 'qualitas') {
            list.push({ field: 'rinesYLlantas', label: 'Daños a Rines y Llantas', desc: 'Cubre la sustitución o reparación física por baches u obstáculos viales' });
          }
          list.push({ field: 'auxilioVialPlus', label: 'Auxilio Vial Plus (Grúas Ilimitadas)', desc: 'Incrementa el alcance de grúas nacionales e internacionales a eventos ilimitados' });
          if (slug === 'ana-seguros' || slug === 'qualitas' || slug === 'gnp') {
            list.push({ field: 'extensionCoah', label: 'Extensión de Cobertura de RC al Conductor', desc: 'Ampara los daños a terceros al conducir cualquier otro vehículo similar' });
          }
          if (slug === 'qualitas' || slug === 'gnp' || slug === 'ana-seguros') {
            list.push({ field: 'roboAutopartes', label: 'Robo Parcial de Autopartes Interiores', desc: 'Ampara el robo de estéreo, controles de clima, bolsas de aire o accesorios' });
          }
          if (slug === 'gnp' || slug === 'hdi') {
            list.push({ field: 'gastosMedicosEspeciales', label: 'Gastos Médicos Especiales de Ocupantes', desc: 'Extiende el amparo de gastos médicos de ocupantes a servicios de salud privados premium' });
          }
          if (slug === 'ana-seguros') {
            list.push({ field: 'roturaCristalesSinDeducible', label: 'Rotura de Cristales Premium (Sin Deducible)', desc: 'Elimina el deducible típico de 20% para la sustitución de parabrisas y cristales' });
          }
          if (slug === 'ana-seguros' || slug === 'qualitas') {
            list.push({ field: 'gapGarantiaAuto', label: 'Garantía Auto Protegido (GAP)', desc: 'Devuelve el 100% de la prima pagada en caso de robo o pérdida de la unidad' });
          }
          if (slug === 'hdi' || slug === 'qualitas') {
            list.push({ field: 'llavesYControles', label: 'Reposición de Llaves y Controles', desc: 'Repone llaves con chip o controles remotos clonados/perdidos sin costo adicional' });
          }
          if (slug === 'hdi' || slug === 'gnp') {
            list.push({ field: 'esteticaAutomotriz', label: 'Estética Automotriz y Pintura Menor', desc: 'Cubre detalles estéticos, pulido o pintura menor por rayones o portazos en estacionamientos' });
          }
          if (slug === 'qualitas' || slug === 'gnp') {
            list.push({ field: 'equipoEspecial', label: 'Equipo Especial, Adaptaciones y Conversiones', desc: 'Suma asegurada adicional para rines deportivos, blindaje, tumbaburros u otras adaptaciones' });
          }
          
          return list;
        };

        const allowedAddons = getOptionalCoveragesForInsurer(editingInsurerSlug);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in" id="coberturas-insurer-modal">
            <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img 
                    src={activeInsMetadata.logo} 
                    alt={activeInsMetadata.nombre} 
                    className="w-16 h-12 object-contain bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm"
                  />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5 leading-tight">
                      <Settings size={15} className="text-blue-600 animate-spin-slow" /> 
                      Configurando Coberturas Adicionales
                    </h3>
                    <p className="text-[11px] text-slate-500 font-bold mt-0.5">
                      {activeInsMetadata.nombre} — Cotización Profesional Seguros de Auto México
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditingInsurerSlug(null)}
                  className="bg-slate-200/60 hover:bg-slate-200 text-slate-600 hover:text-slate-800 p-2.5 rounded-full transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[400px]">
                
                {/* Left Column - Core Deductibles & Sums */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 space-y-3 shadow-xs">
                    <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 flex items-center gap-1">
                      <ShieldCheck size={12} /> Deducibles y Límites Base
                    </span>

                    {/* Suma Asegurada del Automóvil */}
                    <div className="space-y-2 pb-3 border-b border-slate-150">
                      <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500">
                        <span>Suma Asegurada Auto</span>
                        <span className="text-[9px] font-mono text-indigo-600 lowercase font-medium">
                          rango permitido por aseguradora
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">$</span>
                          <input
                            type="number"
                            min={ranges.minSum}
                            max={ranges.maxSum}
                            step={1000}
                            value={currentInsConfig.valorVehiculoPersonalizado !== undefined ? currentInsConfig.valorVehiculoPersonalizado : ranges.defaultSum}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              handleInsurerConfigChange(editingInsurerSlug, { valorVehiculoPersonalizado: isNaN(val) ? undefined : val });
                            }}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 pl-6 font-mono font-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">MXN</span>
                      </div>
                      <div className="space-y-1">
                        <input
                          type="range"
                          min={ranges.minSum}
                          max={ranges.maxSum}
                          step={1000}
                          value={currentInsConfig.valorVehiculoPersonalizado !== undefined ? currentInsConfig.valorVehiculoPersonalizado : ranges.defaultSum}
                          onChange={(e) => {
                            handleInsurerConfigChange(editingInsurerSlug, { valorVehiculoPersonalizado: parseInt(e.target.value, 10) });
                          }}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[8px] font-mono text-slate-400 font-bold">
                          <span>Min: ${ranges.minSum.toLocaleString()}</span>
                          <span className="text-blue-600 font-semibold">Def: ${ranges.defaultSum.toLocaleString()}</span>
                          <span>Max: ${ranges.maxSum.toLocaleString()}</span>
                        </div>
                      </div>
                      {currentInsConfig.valorVehiculoPersonalizado !== undefined && currentInsConfig.valorVehiculoPersonalizado !== ranges.defaultSum && (
                        <div className="flex justify-between items-center text-[9px] text-indigo-600 font-bold pt-1">
                          <span>✓ Valor ajustado</span>
                          <button
                            type="button"
                            onClick={() => handleInsurerConfigChange(editingInsurerSlug, { valorVehiculoPersonalizado: undefined })}
                            className="underline hover:text-indigo-800 uppercase tracking-tight text-[8px]"
                          >
                            Restablecer default
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Descuento Comercial del Agente */}
                    {(() => {
                      const limits = INSURER_DISCOUNT_LIMITS[editingInsurerSlug] || { min: 0, max: 30, step: 5, default: 0 };
                      const currentDiscount = currentInsConfig.descuento !== undefined ? currentInsConfig.descuento : 0;
                      return (
                        <div className="space-y-2 pb-3 border-b border-slate-150 pt-2">
                          <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500">
                            <span>Descuento Comercial</span>
                            <span className="text-[9px] font-mono text-emerald-600 font-bold lowercase">
                              rango permitido: {limits.min}% a {limits.max}%
                            </span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              min={limits.min}
                              max={limits.max}
                              step={limits.step}
                              value={currentDiscount}
                              onChange={(e) => {
                                let val = parseInt(e.target.value, 10);
                                if (isNaN(val)) val = 0;
                                val = Math.max(limits.min, Math.min(limits.max, val));
                                handleInsurerConfigChange(editingInsurerSlug, { descuento: val });
                              }}
                              className="w-20 bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2 font-mono font-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-[10px] font-bold text-slate-400 select-none">% de Descuento</span>
                          </div>
                          <div className="space-y-1">
                            <input
                              type="range"
                              min={limits.min}
                              max={limits.max}
                              step={limits.step}
                              value={currentDiscount}
                              onChange={(e) => {
                                handleInsurerConfigChange(editingInsurerSlug, { descuento: parseInt(e.target.value, 10) });
                              }}
                              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                            />
                            <div className="flex justify-between text-[8px] font-mono text-slate-400 font-bold">
                              <span>0% (Sin desc.)</span>
                              <span className="text-emerald-500 font-black">Límite: {limits.max}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                    
                    {/* Daños Materiales */}
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500">
                        Deducible Daños Materiales
                      </label>
                      <select
                        value={currentInsConfig.danosMaterialesDeducible || '5%'}
                        onChange={(e) => handleInsurerConfigChange(editingInsurerSlug, { danosMaterialesDeducible: e.target.value })}
                        disabled={activePackage === 'RC'}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                      >
                        <option value="3%">3% (Deducible Premium)</option>
                        <option value="5%">5% (Deducible Estándar)</option>
                        <option value="10%">10% (Bajo costo)</option>
                      </select>
                    </div>

                    {/* Robo Total */}
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500">
                        Deducible Robo Total
                      </label>
                      <select
                        value={currentInsConfig.roboTotalDeducible || '10%'}
                        onChange={(e) => handleInsurerConfigChange(editingInsurerSlug, { roboTotalDeducible: e.target.value })}
                        disabled={activePackage === 'RC'}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
                      >
                        <option value="5%">5% (Premium)</option>
                        <option value="10%">10% (Estándar)</option>
                        <option value="15%">15% (Bajo costo)</option>
                      </select>
                    </div>

                    {/* RC Suma */}
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500">
                        Suma Asegurada RC (Bienes/Personas)
                      </label>
                      <select
                        value={currentInsConfig.rcSumaAsegurada || '$3,000,000 MXN'}
                        onChange={(e) => handleInsurerConfigChange(editingInsurerSlug, { rcSumaAsegurada: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="$1,000,000 MXN">$1,000,000 MXN (Límite Ley)</option>
                        <option value="$3,000,000 MXN">$3,000,000 MXN (Recomendada)</option>
                        <option value="$4,000,000 MXN">$4,000,000 MXN (Fórmula Plus)</option>
                        <option value="$5,000,000 MXN">$5,000,000 MXN (Suma Máxima)</option>
                      </select>
                    </div>

                    {/* Gastos Médicos Ocupantes */}
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500">
                        Suma Gastos Médicos Ocupantes
                      </label>
                      <select
                        value={currentInsConfig.gastosMedicosSumaAsegurada || '$250,000 MXN'}
                        onChange={(e) => handleInsurerConfigChange(editingInsurerSlug, { gastosMedicosSumaAsegurada: e.target.value })}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="$100,000 MXN">$100,000 MXN</option>
                        <option value="$200,000 MXN">$200,000 MXN</option>
                        <option value="$250,000 MXN">$250,000 MXN (Estándar)</option>
                        <option value="$400,000 MXN">$400,000 MXN</option>
                        <option value="$500,000 MXN">$500,000 MXN (Fallecimiento/Invalidez)</option>
                      </select>
                    </div>
                  </div>

                  {/* Real-time calculated live results widget */}
                  {liveResult && (
                    <div className="bg-blue-900 text-white p-5 rounded-2xl space-y-3.5 shadow-md">
                      <span className="text-[9px] uppercase font-black text-emerald-300 tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={11} className="text-emerald-400" /> Tarifa Real Web Service en Vivo
                      </span>
                      
                      <div className="border-b border-blue-800 pb-3 flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-blue-100">Prima Total para {activeFrequency}:</span>
                        <span className="text-lg font-black tracking-tight font-sans text-white">
                          ${liveResult.primaTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN
                        </span>
                      </div>

                      <div className="space-y-2 text-[10px] font-mono leading-none">
                        <div className="flex justify-between text-blue-200">
                          <span>Prima Neta:</span>
                          <span className="font-bold text-white">${(liveResult.primaNeta - liveResult.derechoPoliza).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-blue-200">
                          <span>Derecho de Póliza:</span>
                          <span className="font-bold text-white">${liveResult.derechoPoliza.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-blue-200">
                          <span>IVA Trasladado (16%):</span>
                          <span className="font-bold text-white">${liveResult.iva.toLocaleString()}</span>
                        </div>
                        {liveResult.recargosFraccionado && (
                          <div className="flex justify-between text-blue-300">
                            <span>Recargos Fracc. ({activeFrequency}):</span>
                            <span className="font-bold text-white">${liveResult.recargosFraccionado.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {activeFrequency !== 'Anual' && liveResult.primerPagoTotal && liveResult.pagosSubsecuentesTotal && (
                        <div className="bg-blue-950/80 p-3 rounded-xl space-y-1 text-[9px] border border-blue-800">
                          <span className="font-bold text-blue-200 uppercase tracking-wide block">Desglose de Recibos de Fracción</span>
                          <div className="flex justify-between text-white font-sans mt-1">
                            <span>1er Recibo (Poliza + Derecho):</span>
                            <span className="font-black">${liveResult.primerPagoTotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-300 font-sans">
                            <span>Recibos Subsecuentes c/u:</span>
                            <span className="font-black text-blue-100">${liveResult.pagosSubsecuentesTotal.toLocaleString()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column - Checklist of allowed accessory coverages */}
                <div className="lg:col-span-7 space-y-3 flex flex-col justify-start">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-blue-600 flex items-center gap-1">
                      <Sparkles size={11} /> Coberturas Accesorias Permitidas
                    </span>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-normal">
                      Las siguientes coberturas son las reglas válidas y autorizadas por el mercado asegurador para esta entidad. Selecciona para incluirlas en el cálculo de la prima de recibo:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {allowedAddons.map((addon) => {
                      const fieldName = addon.field as keyof CoberturasPersonalizadasCliente;
                      const active = !!currentInsConfig[fieldName];
                      return (
                        <button
                          key={addon.field}
                          type="button"
                          onClick={() => handleInsurerConfigChange(editingInsurerSlug, { [fieldName]: !active })}
                          className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer leading-tight ${
                            active 
                              ? 'bg-blue-50/50 border-blue-400 text-blue-950 shadow-xs' 
                              : 'bg-white border-slate-150 hover:bg-slate-50/80 text-slate-700'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 ${
                            active 
                              ? 'bg-blue-600 border-blue-600 text-white font-black' 
                              : 'bg-white border-slate-300'
                          }`}>
                            {active && '✓'}
                          </div>
                          <div>
                            <span className="block text-xs font-black text-slate-800 leading-none">
                              {addon.label}
                            </span>
                            <span className="block text-[10px] text-slate-500 font-semibold mt-1 leading-normal">
                              {addon.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-150 flex items-center justify-end gap-3 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setEditingInsurerSlug(null)}
                  className="px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-extrabold transition cursor-pointer"
                >
                  Regresar a la Comparativa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingInsurerSlug(null);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition cursor-pointer shadow-md shadow-blue-100"
                >
                  Guardar y Comparar Precios
                </button>
              </div>

            </div>
          </div>
        );
      })()}


      {isPrintModalOpen && (
        <PDFComparativoModal
          quote={localQuote}
          insurerCustomConfigs={insurerCustomConfigs}
          activePackage={activePackage}
          activeFrequency={activeFrequency}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}
