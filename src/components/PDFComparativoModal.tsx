import React, { useState, useEffect } from 'react';
import { X, Printer, CheckCircle2, AlertTriangle, HelpCircle, FileText, User, Phone, Edit3 } from 'lucide-react';
import type { Cotizacion, ResultadoAseguradora, CoberturaDetalle, CoberturasPersonalizadasCliente } from '../types';
import { calculateSimulatedQuote, getSavedInsurers, INSURER_DISCOUNT_LIMITS } from '../data/insurers';

interface PDFComparativoModalProps {
  quote: Cotizacion;
  insurerCustomConfigs: Record<string, CoberturasPersonalizadasCliente>;
  activePackage: 'Amplia' | 'Limitada' | 'RC';
  activeFrequency: 'Anual' | 'Semestral' | 'Trimestral' | 'Mensual';
  onClose: () => void;
}

export default function PDFComparativoModal({
  quote,
  insurerCustomConfigs,
  activePackage,
  activeFrequency,
  onClose,
}: PDFComparativoModalProps) {
  // Available insurers in the current quote
  const availableInsurers = getSavedInsurers().filter(ins => ins.activo);

  // States for customizing the PDF
  const [selectedPackages, setSelectedPackages] = useState<('Amplia' | 'Limitada' | 'RC')[]>([activePackage]);
  const [selectedFrequencies, setSelectedFrequencies] = useState<('Anual' | 'Semestral' | 'Trimestral' | 'Mensual')[]>([activeFrequency]);
  const [selectedInsurers, setSelectedInsurers] = useState<string[]>(availableInsurers.map(ins => ins.slug));
  
  // Agent Details state
  const [agentName, setAgentName] = useState('Edith Jiménez');
  const [agentPhone, setAgentPhone] = useState('55 4321 0987');
  const [additionalNotes, setAdditionalNotes] = useState('La presente cotización tiene una vigencia oficial de 15 días naturales a partir de la fecha de emisión. Precios en MXN e IVA incluido.');

  // Automatically include activePackage and activeFrequency if they change externally
  useEffect(() => {
    if (!selectedPackages.includes(activePackage)) {
      setSelectedPackages(prev => [...prev, activePackage]);
    }
  }, [activePackage]);

  useEffect(() => {
    if (!selectedFrequencies.includes(activeFrequency)) {
      setSelectedFrequencies(prev => [...prev, activeFrequency]);
    }
  }, [activeFrequency]);

  // Handle packages selection (at least one must be selected)
  const togglePackage = (pkg: 'Amplia' | 'Limitada' | 'RC') => {
    if (selectedPackages.includes(pkg)) {
      if (selectedPackages.length > 1) {
        setSelectedPackages(selectedPackages.filter(p => p !== pkg));
      }
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  // Handle frequencies selection (at least one must be selected)
  const toggleFrequency = (freq: 'Anual' | 'Semestral' | 'Trimestral' | 'Mensual') => {
    if (selectedFrequencies.includes(freq)) {
      if (selectedFrequencies.length > 1) {
        setSelectedFrequencies(selectedFrequencies.filter(f => f !== freq));
      }
    } else {
      setSelectedFrequencies([...selectedFrequencies, freq]);
    }
  };

  // Handle insurers selection
  const toggleInsurer = (slug: string) => {
    if (selectedInsurers.includes(slug)) {
      if (selectedInsurers.length > 1) {
        setSelectedInsurers(selectedInsurers.filter(s => s !== slug));
      }
    } else {
      setSelectedInsurers([...selectedInsurers, slug]);
    }
  };

  // Compute all combinations of calculations on the fly for the preview & print
  const getRecalculatedQuoteMatrix = () => {
    const matrix: Record<string, Record<string, Record<string, ResultadoAseguradora>>> = {};
    
    selectedInsurers.forEach(insSlug => {
      const insMetadata = availableInsurers.find(ins => ins.slug === insSlug);
      if (!insMetadata) return;

      matrix[insSlug] = {};
      selectedPackages.forEach(pkg => {
        matrix[insSlug][pkg] = {};
        selectedFrequencies.forEach(freq => {
          const configForThisIns = insurerCustomConfigs[insSlug] || {};
          const result = calculateSimulatedQuote(insMetadata, quote.vehiculo, quote.cliente, pkg, freq, configForThisIns);
          matrix[insSlug][pkg][freq] = result;
        });
      });
    });

    return matrix;
  };

  const quoteMatrix = getRecalculatedQuoteMatrix();

  // Print function: triggers standard window print on a dedicated print preview block
  const handlePrint = () => {
    // We create a temporary style block to configure print page margins, hiding other elements and showing only our printable area.
    const styleId = 'print-pdf-layout-styles';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    styleEl.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #printable-pdf-document, #printable-pdf-document * {
          visibility: visible !important;
        }
        #printable-pdf-document {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          background: white !important;
          color: black !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        @page {
          size: letter portrait;
          margin: 1.2cm 1.2cm 1.2cm 1.2cm;
        }
        .page-break-before {
          page-break-before: always !important;
          break-before: page !important;
        }
        .no-print {
          display: none !important;
        }
      }
    `;

    setTimeout(() => {
      window.print();
    }, 150);
  };

  const getInsurerShortName = (slug: string) => {
    switch (slug) {
      case 'qualitas': return 'Quálitas';
      case 'gnp': return 'GNP';
      case 'ana-seguros': return 'ANA';
      case 'hdi': return 'HDI';
      case 'zurich': return 'Zurich';
      case 'chubb': return 'Chubb';
      case 'potosi': return 'El Potosí';
      default: return slug.toUpperCase();
    }
  };

  const getFormaPagoLabel = (freq: string) => {
    switch (freq) {
      case 'Anual': return 'Contado (Anual)';
      case 'Semestral': return 'Semestral';
      case 'Trimestral': return 'Trimestral';
      case 'Mensual': return 'Mensual';
      default: return freq;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-slate-50 w-full max-w-7xl h-[92vh] rounded-2.5xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Configurador de PDF Comparativo Profesional</h2>
              <p className="text-xs text-slate-500 font-bold">Personaliza coberturas, formas de pago y datos de contacto antes de descargar o imprimir</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-xl transition border border-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Split screen */}
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden min-h-0">
          
          {/* Left panel: Customizer Sidebar */}
          <div className="w-full md:w-[35%] lg:w-[30%] bg-white md:border-r border-b md:border-b-0 border-slate-200 p-6 overflow-y-auto shrink-0 space-y-6">
            
            {/* Sec 1: Coberturas (Paquetes) */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">1. Coberturas a Incluir</span>
              <div className="grid grid-cols-3 gap-2">
                {(['Amplia', 'Limitada', 'RC'] as const).map(pkg => {
                  const isSelected = selectedPackages.includes(pkg);
                  return (
                    <button
                      key={pkg}
                      onClick={() => togglePackage(pkg)}
                      className={`p-3 rounded-2xl text-xs font-black transition flex flex-col items-center justify-center gap-1 border border-dashed ${
                        isSelected 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs">{pkg}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[9px] text-slate-400 font-bold">Puedes seleccionar múltiples paquetes para mostrar tablas comparativas secuenciales.</p>
            </div>

            {/* Sec 2: Formas de Pago */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">2. Formas de Pago a Mostrar</span>
              <div className="grid grid-cols-2 gap-2">
                {(['Anual', 'Semestral', 'Trimestral', 'Mensual'] as const).map(freq => {
                  const isSelected = selectedFrequencies.includes(freq);
                  return (
                    <button
                      key={freq}
                      onClick={() => toggleFrequency(freq)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                        isSelected 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{getFormaPagoLabel(freq)}</span>
                      <input 
                        type="checkbox" 
                        checked={isSelected} 
                        readOnly 
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sec 3: Aseguradoras */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">3. Aseguradoras a Comparar</span>
              <div className="space-y-2">
                {availableInsurers.map(ins => {
                  const isSelected = selectedInsurers.includes(ins.slug);
                  const discount = insurerCustomConfigs[ins.slug]?.descuento || 0;
                  return (
                    <div 
                      key={ins.slug}
                      onClick={() => toggleInsurer(ins.slug)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                        isSelected
                          ? 'bg-slate-50 border-slate-300'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={ins.logo} 
                          alt={ins.nombre} 
                          className="h-6 w-12 object-contain bg-slate-100 p-0.5 rounded border border-slate-200 shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="text-xs font-black text-slate-800">{getInsurerShortName(ins.slug)}</p>
                          {discount > 0 && (
                            <span className="text-[9px] font-black text-emerald-600">Con -{discount}% desc. aplicado</span>
                          )}
                        </div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        readOnly
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sec 4: Datos del Contacto */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider block">4. Información del Agente</span>
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <User size={11} /> Nombre del Ejecutivo
                  </span>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg p-2 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Phone size={11} /> Teléfono / WhatsApp
                  </span>
                  <input
                    type="text"
                    value={agentPhone}
                    onChange={(e) => setAgentPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg p-2 font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    <Edit3 size={11} /> Clausulado o Notas Adicionales
                  </span>
                  <textarea
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg p-2 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right panel: Printable Live PDF Preview (Paper style) */}
          <div className="flex-1 w-full bg-slate-250 p-4 md:p-6 overflow-auto flex flex-col items-center">
            
            <div className="w-full max-w-[21cm] mb-4 flex justify-between items-center sm:px-2 shrink-0">
              <span className="text-xs font-bold text-slate-500">Vista previa del Comparativo (Formato Carta)</span>
              <button
                onClick={handlePrint}
                className="bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-md"
              >
                <Printer size={15} /> Imprimir / Guardar como PDF
              </button>
            </div>

            {/* Letter Document Container */}
            <div 
              id="printable-pdf-document"
              className="w-full max-w-[21cm] bg-white border border-slate-350 shadow-lg p-[1.5cm] rounded bg-white text-slate-900 leading-normal font-sans"
              style={{ minHeight: '29.7cm' }}
            >
              
              {/* PDF Document Header Block */}
              <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 select-none">
                    <div className="h-6 w-6 bg-slate-900 rounded-lg flex items-center justify-center font-black text-white text-xs tracking-tighter">
                      M
                    </div>
                    <span className="font-extrabold text-slate-900 text-sm italic tracking-widest font-mono">MOVI / <span className="font-thin text-slate-650">JIRO SEGUROS</span></span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Plataforma Broker Multicotizadora Homologada</p>
                </div>
                
                <div className="text-right">
                  <div className="bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 inline-block">
                    <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Folio Oficial</span>
                    <span className="text-xs font-mono font-bold text-slate-900">{quote.folio}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold mt-1.5 font-mono">Fecha: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Title Section */}
              <div className="my-6 text-center">
                <h1 className="text-base font-black text-slate-900 uppercase tracking-wide">Comparativa Ejecutiva de Seguro de Automóvil</h1>
                <div className="h-0.5 bg-blue-100 max-w-xs mx-auto mt-1"></div>
              </div>

              {/* Client and Vehicle Metadata Details Dual Grid */}
              <div className="grid grid-cols-2 gap-4 my-4">
                
                {/* Client Block */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="text-[10px] uppercase font-black text-blue-800 tracking-wider">Datos del Cliente</h4>
                  <div className="text-[11px] space-y-1 text-slate-700">
                    <p><span className="font-bold text-slate-900">Asegurado:</span> {quote.cliente.nombre}</p>
                    <p><span className="font-bold text-slate-900">RFC:</span> {quote.cliente.rfc || 'No especificado'}</p>
                    <p><span className="font-bold text-slate-900">Persona:</span> {quote.cliente.tipoPersona === 'Fisica' ? 'Física' : 'Moral'}</p>
                    <p><span className="font-bold text-slate-900">Código Postal:</span> {quote.cliente.codigoPostal}</p>
                    {quote.cliente.correo && (
                      <p className="truncate"><span className="font-bold text-slate-900">Correo:</span> {quote.cliente.correo}</p>
                    )}
                  </div>
                </div>

                {/* Vehicle Block */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="text-[10px] uppercase font-black text-blue-800 tracking-wider">Detalles del Vehículo</h4>
                  <div className="text-[11px] space-y-1 text-slate-700">
                    <p className="font-bold text-slate-900 truncate">{quote.vehiculo.descripcionCompleta}</p>
                    <p><span className="font-bold text-slate-900">Marca:</span> {quote.vehiculo.marca}</p>
                    <p><span className="font-bold text-slate-900">Submarca:</span> {quote.vehiculo.modelo}</p>
                    <p><span className="font-bold text-slate-900">Año Modelo:</span> {quote.vehiculo.anio}</p>
                    {quote.vehiculo.valorReferencia && (
                      <p><span className="font-bold text-slate-900">Valor Comercial Ref:</span> ${quote.vehiculo.valorReferencia.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN</p>
                    )}
                  </div>
                </div>

              </div>

              {/* COMPARATIVE TABLES LOOP (For each selected Package) */}
              {selectedPackages.map((pkg, pIndex) => {
                return (
                  <div key={pkg} className={`space-y-4 my-6 ${pIndex > 0 ? 'page-break-before pt-6 border-t border-slate-200' : ''}`}>
                    
                    {/* Package Ribbon Banner */}
                    <div className="bg-slate-800 text-white px-4 py-2 rounded-lg flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-wider">Plan / Cobertura: {pkg}</span>
                      <span className="text-[9px] font-mono font-bold text-slate-300">Resumen Comparativo de Primas Oficiales</span>
                    </div>

                    {/* Frequencies Comparison Grid Table */}
                    <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white shadow-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                            <th className="p-3">Aseguradora</th>
                            {selectedFrequencies.map(freq => (
                              <th key={freq} className="p-3 text-right">{getFormaPagoLabel(freq)}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {selectedInsurers.map(insSlug => {
                            const insurerObj = availableInsurers.find(i => i.slug === insSlug);
                            if (!insurerObj) return null;
                            
                            return (
                              <tr key={insSlug} className="hover:bg-slate-50/50">
                                
                                {/* Insurer details column */}
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={insurerObj.logo} 
                                      alt={insurerObj.nombre} 
                                      className="h-5 w-10 object-contain shrink-0 bg-white" 
                                      referrerPolicy="no-referrer"
                                    />
                                    <div>
                                      <span className="font-black text-slate-900 block">{getInsurerShortName(insSlug)}</span>
                                      {insurerCustomConfigs[insSlug]?.descuento ? (
                                        <span className="text-[8px] font-extrabold text-emerald-600 block leading-tight">-{insurerCustomConfigs[insSlug].descuento}% desc</span>
                                      ) : null}
                                    </div>
                                  </div>
                                </td>

                                {/* Payment values for selected frequencies */}
                                {selectedFrequencies.map(freq => {
                                  const result = quoteMatrix[insSlug]?.[pkg]?.[freq];
                                  if (!result || result.status !== 'exitoso') {
                                    return (
                                      <td key={freq} className="p-3 text-right text-slate-400 font-bold">
                                        No disponible
                                      </td>
                                    );
                                  }
                                  
                                  const isLowestPremium = selectedInsurers.every(otherSlug => {
                                    const otherRes = quoteMatrix[otherSlug]?.[pkg]?.[freq];
                                    if (!otherRes || otherRes.status !== 'exitoso') return true;
                                    return result.primaTotal <= otherRes.primaTotal;
                                  });

                                  return (
                                    <td key={freq} className="p-3 text-right">
                                      <span className={`font-black tracking-tight text-xs ${isLowestPremium ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg font-black' : 'text-slate-800'}`}>
                                        ${result.primaTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </span>
                                      
                                      {/* Fractional payment breakdowns detail print format (if not annual) */}
                                      {freq !== 'Anual' && result.numeroPagos && result.primerPagoTotal && result.pagosSubsecuentesTotal ? (
                                        <span className="block text-[8px] text-slate-400 font-medium leading-normal mt-0.5 font-mono">
                                          1er Pago: ${result.primerPagoTotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })} + {result.numeroPagos - 1} de ${result.pagosSubsecuentesTotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                                        </span>
                                      ) : null}
                                    </td>
                                  );
                                })}

                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Coverage comparison detailed chart */}
                    <div className="space-y-2 mt-4">
                      <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">Condiciones de Deducibles y Coberturas Clave</span>
                      <div className="border border-slate-200 rounded-xl overflow-hidden text-[10px]">
                        <div className="grid grid-cols-5 bg-slate-50 border-b border-slate-100 font-bold p-2 text-slate-500 uppercase">
                          <div className="col-span-1">Concepto clave</div>
                          {selectedInsurers.map(insSlug => (
                            <div key={insSlug} className="text-center">{getInsurerShortName(insSlug)}</div>
                          ))}
                        </div>
                        
                        <div className="divide-y divide-slate-100 text-[10.5px]">
                          {/* 1. Daños Materiales */}
                          <div className="grid grid-cols-5 p-2 bg-white hover:bg-slate-50/50">
                            <div className="col-span-1 font-bold text-slate-800">Daños Materiales</div>
                            {selectedInsurers.map(insSlug => {
                              const configForThisIns = insurerCustomConfigs[insSlug] || {};
                              return (
                                <div key={insSlug} className="text-center text-slate-700 font-medium">
                                  {pkg === 'RC' ? 'No Amparado' : (configForThisIns.danosMaterialesDeducible || '5%')}
                                </div>
                              );
                            })}
                          </div>

                          {/* 2. Robo Total */}
                          <div className="grid grid-cols-5 p-2 bg-white hover:bg-slate-50/50">
                            <div className="col-span-1 font-bold text-slate-800">Robo Total</div>
                            {selectedInsurers.map(insSlug => {
                              const configForThisIns = insurerCustomConfigs[insSlug] || {};
                              return (
                                <div key={insSlug} className="text-center text-slate-700 font-medium">
                                  {pkg === 'RC' ? 'No Amparado' : (configForThisIns.roboTotalDeducible || '10%')}
                                </div>
                              );
                            })}
                          </div>

                          {/* 3. Responsabilidad Civil */}
                          <div className="grid grid-cols-5 p-2 bg-white hover:bg-slate-50/50">
                            <div className="col-span-1 font-bold text-slate-800">Responsabilidad Civil</div>
                            {selectedInsurers.map(insSlug => {
                              const configForThisIns = insurerCustomConfigs[insSlug] || {};
                              return (
                                <div key={insSlug} className="text-center text-slate-700 font-medium font-mono text-[10px]">
                                  {configForThisIns.rcSumaAsegurada || '$3,000,000 MXN'}
                                </div>
                              );
                            })}
                          </div>

                          {/* 4. Gastos Médicos Ocupantes */}
                          <div className="grid grid-cols-5 p-2 bg-white hover:bg-slate-50/50">
                            <div className="col-span-1 font-bold text-slate-800">Gastos Médicos</div>
                            {selectedInsurers.map(insSlug => {
                              const configForThisIns = insurerCustomConfigs[insSlug] || {};
                              return (
                                <div key={insSlug} className="text-center text-slate-700 font-medium font-mono text-[10px]">
                                  {configForThisIns.gastosMedicosSumaAsegurada || '$200,000 MXN'}
                                </div>
                              );
                            })}
                          </div>

                          {/* 5. Auto Sustituto (Opcional) */}
                          <div className="grid grid-cols-5 p-2 bg-white hover:bg-slate-50/50">
                            <div className="col-span-1 font-bold text-slate-800">Auto Sustituto</div>
                            {selectedInsurers.map(insSlug => {
                              const configForThisIns = insurerCustomConfigs[insSlug] || {};
                              const active = !!configForThisIns.autoSustituto;
                              return (
                                <div key={insSlug} className="text-center">
                                  <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold ${active ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-400'}`}>
                                    {active ? 'Incluido' : 'Opcional'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* 6. Extensión Auxilio Vial */}
                          <div className="grid grid-cols-5 p-2 bg-white hover:bg-slate-50/50">
                            <div className="col-span-1 font-bold text-slate-800">Asistencia Vial</div>
                            {selectedInsurers.map(insSlug => {
                              return (
                                <div key={insSlug} className="text-center text-slate-700 font-medium">
                                  Amparado (Completo)
                                </div>
                              );
                            })}
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Clausulados / Notes Section */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-8 space-y-2">
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">Condiciones Generales y Notas del Consultor</span>
                <p className="text-[10px] text-slate-650 leading-relaxed whitespace-pre-line font-medium">
                  {additionalNotes}
                </p>
              </div>

              {/* Agent Contact Details and Signature Area Footer Grid */}
              <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-slate-200">
                
                {/* Executive details */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Tu Consultor de Seguros Autorizado</span>
                  <p className="text-xs font-black text-slate-900">{agentName}</p>
                  <p className="text-xs text-slate-600 font-bold flex items-center gap-1 font-mono">
                    WhatsApp: {agentPhone}
                  </p>
                  <p className="text-[9px] text-slate-400 leading-normal font-medium max-w-xs">
                    Respaldado por el catálogo consolidado de agentes de MOVI. Para cualquier aclaración adicional, comunícate con tu ejecutivo.
                  </p>
                </div>

                {/* Signature box */}
                <div className="flex flex-col items-center justify-end">
                  <div className="w-48 border-b border-slate-400 h-10"></div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-2">Firma del Ejecutivo</span>
                </div>

              </div>

              {/* Legal Disclaimer */}
              <div className="mt-8 text-center text-[8px] text-slate-400 font-medium leading-relaxed border-t border-slate-100 pt-4">
                El presente documento es una cotización informativa y no constituye un contrato de adhesión formal de seguros. Las primas, recargos y coberturas estimadas pueden variar dependiendo de la dictaminación de riesgos formal de cada compañía aseguradora asociada al momento de la emisión. MOVI / JIRO Seguros actúa rigurosamente bajo el marco legal regulatorio de la Comisión Nacional de Seguros y Fianzas (CNSF).
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
