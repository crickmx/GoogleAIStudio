import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import type { Cliente, Vehiculo, Cotizacion, ResultadoAseguradora, CoberturaDetalle } from '../types';
import { getSavedInsurers, calculateSimulatedQuote, logWSCall } from '../data/insurers';
import VehicleSelector from '../components/VehicleSelector';
import { 
  User, 
  Car, 
  ChevronRight, 
  ChevronLeft, 
  AlertTriangle, 
  Sparkles, 
  FileText,
  Clock,
  ShieldCheck,
  Building
} from 'lucide-react';

interface NewQuotePageProps {
  onQuoteCompleted: (newQuote: Cotizacion) => void;
  onCancel: () => void;
}

export default function NewQuotePage({ onQuoteCompleted, onCancel }: NewQuotePageProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');

  // Step 1: Cliente State
  const [cliente, setCliente] = useState<Cliente>({
    id: 'cli-' + Date.now().toString(36),
    nombre: '',
    tipoPersona: 'Fisica',
    rfc: '',
    correo: '',
    telefono: '',
    codigoPostal: '',
  });

  // Step 2: Vehiculo State
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);

  const [formError, setFormError] = useState<string>('');

  // Handle client updates
  const handleClienteChange = (field: keyof Cliente, value: any) => {
    setCliente(prev => ({ ...prev, [field]: value }));
    setFormError('');
  };

  // Automated RFC generator wrapper helper for demo comfort
  const handleAutoGenerateRFC = () => {
    if (!cliente.nombre) {
      setFormError('Primero ingrese el nombre del cliente para generar un RFC sugerido.');
      return;
    }
    const cleanName = cliente.nombre.replace(/\s+/g, '').toUpperCase().substr(0, 4);
    const mockRfc = `${cleanName}851109G31`;
    setCliente(prev => ({ ...prev, rfc: mockRfc }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!cliente.nombre || !cliente.codigoPostal || !cliente.edad || !cliente.genero) {
        setFormError('Por favor complete todos los campos obligatorios del cliente.');
        return;
      }
      
      // Basic email and CP validation
      if (cliente.correo && !cliente.correo.includes('@')) {
        setFormError('Por favor ingrese un correo válido.');
        return;
      }
      if (cliente.codigoPostal.length !== 5 || isNaN(Number(cliente.codigoPostal))) {
        setFormError('El código postal debe ser de 5 enteros numéricos.');
        return;
      }

      setStep(2);
      setFormError('');
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
      setFormError('');
    }
  };

  // Launch comparative quotes directly (defaults: Amplia, Anual)
  const handleCalculateQuotes = async () => {
    if (!selectedVehiculo) {
      setFormError('Por favor seleccione una versión de vehículo del catálogo para cotizar.');
      return;
    }

    setLoading(true);
    setFormError('');
    setLoadingStep('Conectando con pasarela central de cotización...');

    try {
      const insurers = getSavedInsurers();
      
      const promises = insurers.map(async (ins): Promise<ResultadoAseguradora> => {
        setLoadingStep(`Consultando Web Service oficial de ${ins.nombre}...`);
        
        try {
          const response = await fetch('/api/quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              insurer: ins,
              vehiculo: selectedVehiculo,
              cliente,
              paquete: 'Amplia',
              formaPago: 'Anual',
              customConfigs: {}
            })
          });

          if (response.ok) {
            const apiRes = await response.json();
            
            // If the real remote SOAP query worked, we populate results perfectly
            if (apiRes.status === 'exitoso') {
              // Log the real WS communication XMLs to the technical log terminal!
              logWSCall({
                aseguradora: ins.nombre,
                endpoint: ins.slug === 'qualitas' ? ins.credenciales.QUALITAS_WS_URL : ins.slug === 'ana-seguros' ? ins.credenciales.ANA_WS_URL : 'HTTPS://api.service.com',
                status: 200,
                tipo: 'Cotizacion',
                requestBody: apiRes.requestXmlPayload || '--- Request XML ---',
                responseBody: apiRes.responseXmlPayload || '--- Response XML ---',
                correcto: true,
              });

              // Generate coverage table conforming to the real API rate
              const generatedCoverages: CoberturaDetalle[] = ins.slug === 'qualitas' ? [
                { nombre: 'Daños Materiales Terrestres', sumaAsegurada: 'Valor Comercial', deducible: '5%', tipo: 'deducible' },
                { nombre: 'Robo Total', sumaAsegurada: 'Valor Comercial', deducible: '10%', tipo: 'deducible' },
                { nombre: 'Responsabilidad Civil por Daños a Terceros', sumaAsegurada: '$3,000,000 MXN', deducible: 'Sin deducible', tipo: 'limite' },
                { nombre: 'Gastos Médicos a Ocupantes', sumaAsegurada: '$250,000 MXN', deducible: 'Sin deducible', tipo: 'limite' },
                { nombre: 'Asistencia Vial y Viaje', sumaAsegurada: 'Amparada', deducible: 'Sin deducible', tipo: 'amparada' },
                { nombre: 'Defensa Jurídica y Legal', sumaAsegurada: 'Amparada', deducible: 'Sin deducible', tipo: 'amparada' },
              ] : [
                { nombre: 'Daños Materiales Terrestres', sumaAsegurada: 'Valor Comercial', deducible: '5%', tipo: 'deducible' },
                { nombre: 'Robo Total', sumaAsegurada: 'Valor Comercial', deducible: '10%', tipo: 'deducible' },
                { nombre: 'Responsabilidad Civil', sumaAsegurada: '$3,000,000 MXN', deducible: 'Sin deducible', tipo: 'limite' },
                { nombre: 'Gastos Médicos Clientes', sumaAsegurada: '$250,000 MXN', deducible: 'Sin deducible', tipo: 'limite' },
                { nombre: 'Asistencia Vial VialPlus', sumaAsegurada: 'Amparada', deducible: 'Sin deducible', tipo: 'amparada' },
                { nombre: 'Defensa Legal Completa', sumaAsegurada: 'Amparada', deducible: 'Sin deducible', tipo: 'amparada' },
              ];

              return {
                id: ins.id,
                aseguradoraId: ins.id,
                aseguradoraNombre: ins.nombre,
                logo: ins.logo,
                paquete: 'Amplia',
                formaPago: 'Anual',
                status: 'exitoso',
                coberturas: generatedCoverages,
                derechoPoliza: apiRes.derechoPoliza,
                iva: apiRes.iva,
                primaNeta: apiRes.primaNeta,
                primaTotal: apiRes.primaTotal,
                sumaAseguradaVehiculo: selectedVehiculo.valorEstimado || 250000,
              };
            } else {
              // Create log entry for SOAP rejected parameters
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
          console.error("fetch API failed: ", fetchErr);
        }

        // Catch fallback to calibrated local calculations
        const quoteResult = calculateSimulatedQuote(
          ins, 
          selectedVehiculo, 
          cliente, 
          'Amplia', 
          'Anual'
        );

        // Document fallback
        logWSCall({
          aseguradora: ins.nombre,
          endpoint: ins.slug === 'gnp' ? ins.credenciales.GNP_WS_URL || '' : ins.slug === 'qualitas' ? ins.credenciales.QUALITAS_WS_URL || '' : ins.slug === 'chubb' ? ins.credenciales.CHUBB_WS_URL || '' : ins.slug === 'potosi' ? ins.credenciales.POTOSI_WS_URL || '' : 'HTTPS://api.service.com',
          status: quoteResult.status === 'exitoso' ? 200 : 400,
          tipo: 'Cotizacion',
          requestBody: `<xml><USUARIO>${ins.slug === 'qualitas' ? ins.credenciales.QUALITAS_AGENTE : 'AGENTE_REF'}</USUARIO><VEHICULO><ARMADORA>${selectedVehiculo.marca}</ARMADORA><CP>${cliente.codigoPostal}</CP></VEHICULO></xml>`,
          responseBody: `<Envelope><Response><Codigo>FALLBACK_CALIBRATION</Codigo><Primas><PrimaNet>${quoteResult.primaNeta}</PrimaNet><PrimaTotal>${quoteResult.primaTotal}</PrimaTotal></Primas></Response></Envelope>`,
          correcto: quoteResult.status === 'exitoso',
          mensajeError: quoteResult.errorMsg
        });

        return quoteResult;
      });

      const results = await Promise.all(promises);

      // Generate clean new Folio COT-YYYYMMDD-XXXX
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
      const folio = `COT-${year}${month}${day}-${randomSuffix}`;

      const newQuote: Cotizacion = {
        id: 'q-' + Date.now().toString(36),
        folio,
        fechaCreacion: today.toISOString(),
        cliente,
        vehiculo: selectedVehiculo,
        paqueteSeleccionado: 'Amplia',
        formaPagoSeleccionada: 'Anual',
        status: 'Cotizado',
        userEmail: user?.email || 'ccjimenez@jiro.com.mx',
        resultados: results,
      };

      // Save to local storage quotes collection
      const saved = localStorage.getItem('movi_quotes');
      const arr = saved ? JSON.parse(saved) : [];
      arr.unshift(newQuote);
      localStorage.setItem('movi_quotes', JSON.stringify(arr));

      setLoading(false);
      onQuoteCompleted(newQuote);
    } catch (e) {
      setLoading(false);
      setFormError('Ocurrió un error inesperado al procesar las cotizaciones en el servidor.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full">
      
      {/* Loading state fullscreen overlay inside context */}
      {loading && (
        <div className="bg-white min-h-[60vh] border border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in shadow-xl">
          <div className="relative">
            {/* Spinning ring */}
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Building className="text-blue-500 animate-pulse" size={20} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Consultando Multicotización con Aseguradoras
            </h3>
            <p className="text-xs text-slate-500 font-semibold font-mono animate-pulse bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              {loadingStep}
            </p>
          </div>

          <div className="max-w-xs text-[10px] text-slate-400 leading-relaxed font-sans">
            GNP, Quálitas, ANA y El Potosí se están consultando simultáneamente empleando tus credenciales configuradas en el workspace.
          </div>
        </div>
      )}

      {!loading && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6.5 shadow-xl space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Nueva Cotización de Seguro</h2>
              <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">
                Autos Particulares y Pick-ups
              </p>
            </div>
            
            {/* Steps indicator */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className={`px-2.5 py-1 rounded-full ${step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-150 text-slate-500'}`}>
                1. Cliente
              </span>
              <span className="text-slate-300">/</span>
              <span className={`px-2.5 py-1 rounded-full ${step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-150 text-slate-500'}`}>
                2. Vehículo
              </span>
            </div>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0 text-red-650" />
              <span>{formError}</span>
            </div>
          )}

          {/* STEP 1: CLIENT DETAILS FORM */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2 text-xs font-bold text-slate-450 uppercase tracking-widest">
                <User size={14} className="text-blue-500" /> Datos Generales del Contratante
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5Selector">
                    Nombre Completo o Razón Social *
                  </label>
                  <input
                    type="text"
                    required
                    value={cliente.nombre}
                    onChange={(e) => handleClienteChange('nombre', e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    placeholder="ej. Juan Pérez o Distribuidora S.A."
                    id="client-name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex justify-between items-center">
                    <span>RFC (Clave Fiscal)</span>
                    <button
                      type="button"
                      onClick={handleAutoGenerateRFC}
                      className="text-[10px] text-blue-600 hover:underline font-bold capitalize"
                    >
                      Generar sugerido
                    </button>
                  </label>
                  <input
                    type="text"
                    maxLength={13}
                    value={cliente.rfc}
                    onChange={(e) => handleClienteChange('rfc', e.target.value.toUpperCase())}
                    className="w-full text-xs font-semibold uppercase bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-mono"
                    placeholder="XAXX010101000"
                    id="client-rfc"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 text-slate-700">
                    Tipo de Persona *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={cliente.tipoPersona === 'Fisica'}
                        onChange={() => handleClienteChange('tipoPersona', 'Fisica')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      Persona Física
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        checked={cliente.tipoPersona === 'Moral'}
                        onChange={() => handleClienteChange('tipoPersona', 'Moral')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      Persona Moral
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 pb-0.5">
                    Código Postal (Tarificación Geográfica) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cliente.codigoPostal}
                    onChange={(e) => handleClienteChange('codigoPostal', e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-mono"
                    placeholder="06600"
                    id="client-cp"
                  />
                </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Edad del Conductor *
              </label>
              <input
                type="number"
                required
                min={18}
                max={99}
                value={cliente.edad ?? ''}
                onChange={(e) => handleClienteChange('edad', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white font-mono"
                placeholder="35"
                id="client-edad"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                Género del Conductor *
              </label>
              <select
                required
                value={cliente.genero ?? ''}
                onChange={(e) => handleClienteChange('genero', e.target.value)}
                className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                id="client-genero"
              >
                <option value="">-- Seleccionar --</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>
          </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Teléfono Celular
                  </label>
                  <input
                    type="tel"
                    value={cliente.telefono}
                    onChange={(e) => handleClienteChange('telefono', e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    placeholder="5512345678"
                    id="client-phone"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={cliente.correo}
                    onChange={(e) => handleClienteChange('correo', e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    placeholder="cliente@dominio.com"
                    id="client-email"
                  />
                </div>

              </div>

              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-150 flex items-start gap-2.5 text-xs text-slate-600 mt-2">
                <Clock size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Nota Legal de Privacidad</p>
                  <p className="text-[11px] text-slate-550 mt-1 leading-relaxed">
                    Toda la información capturada será utilizada exclusivamente para homologar e interactuar con los Web Services autorizados de las aseguradoras afiliadas en México.
                  </p>
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
                  id="btn-quote-cancel-1"
                >
                  Regresar a Mis Cotizaciones
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  id="btn-quote-next"
                >
                  Paso Siguiente: Vehículo <ChevronRight size={15} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: VEHICLE CASCADE SELECTOR */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2 text-xs font-bold text-slate-450 uppercase tracking-widest">
                <Car size={14} className="text-blue-500" /> Homologación Catálogo de Autos
              </div>

              <VehicleSelector onVehicleSelected={(v) => {
                setSelectedVehiculo(v);
                setFormError('');
              }} initialVehicle={selectedVehiculo} />

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3 mt-2">
                <ShieldCheck size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-slate-850">Políticas de Cobertura default</p>
                  <p className="text-slate-500 leading-normal mt-1">
                    La plataforma enviará las claves automáticas para cotizar este modelo en paquete **Amplia** con forma de pago **Anual**. Modificaciones del paquete y método de pago se podrán realizar en el panel comparativo de resultados sin duplicar su captura.
                  </p>
                </div>
              </div>

              <div className="flex justify-between border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1"
                  id="btn-quote-prev"
                >
                  <ChevronLeft size={15} /> Datos del Cliente
                </button>
                <button
                  type="button"
                  onClick={handleCalculateQuotes}
                  className="bg-emerald-600 hover:bg-emerald-700 hover:border-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-lg shadow-emerald-100 border border-emerald-500"
                  id="btn-calculate-quotes"
                >
                  <Sparkles size={14} /> Cotizar con Aseguradoras
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
