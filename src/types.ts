export interface Cliente {
  id: string;
  nombre: string;
  tipoPersona: 'Fisica' | 'Moral';
  rfc: string;
  correo: string;
  telefono: string;
  codigoPostal: string;
  estado?: string;
  municipio?: string;
  edad?: number; // Edad del conductor (factor de tarifa)
  genero?: 'Masculino' | 'Femenino'; // Género del conductor (factor de tarifa)
}

export interface Vehiculo {
  id: string;
  marca: string;
  modelo: string; // e.g. Jetta, Versa
  anio: number;
  version: string;
  descripcionCompleta: string;
  claveAmis?: string;
  armadoraGnp?: string;
  carroceriaGnp?: string;
  versionGnp?: string;
  valorReferencia?: number;
}

export interface CoberturaDetalle {
  nombre: string;
  sumaAsegurada: string;
  deducible: string;
  tipo: 'limite' | 'deducible' | 'amparada' | 'no_amparada';
}

export interface CoberturasPersonalizadasCliente {
  danosMaterialesDeducible?: string;
  roboTotalDeducible?: string;
  rcSumaAsegurada?: string;
  gastosMedicosSumaAsegurada?: string;
  autoSustituto?: boolean;
  roboParcial?: boolean;
  ceroDeducible?: boolean;
  rcExtendida?: boolean;
  rinesYLlantas?: boolean;
  auxilioVialPlus?: boolean;
  extensionCoah?: boolean;
  roboAutopartes?: boolean;
  gastosMedicosEspeciales?: boolean;
  roturaCristalesSinDeducible?: boolean;
  gapGarantiaAuto?: boolean;
  llavesYControles?: boolean;
  esteticaAutomotriz?: boolean;
  equipoEspecial?: boolean;
}

export interface ResultadoAseguradora {
  id: string;
  aseguradoraId: string;
  aseguradoraNombre: string;
  logo: string;
  primaNeta: number;
  derechoPoliza: number;
  iva: number;
  primaTotal: number;
  paquete: 'Amplia' | 'Limitada' | 'RC';
  formaPago: 'Anual' | 'Semestral' | 'Trimestral' | 'Mensual';
  sumaAseguradaVehiculo: number;
  coberturas: CoberturaDetalle[];
  status: 'exitoso' | 'error' | 'cargando';
  primaEstimada?: boolean; // true = prima simulada (posible variación); false/undefined = tarifa exacta confirmada
  errorMsg?: string;
  errorType?: 'auth' | 'mapping' | 'network' | 'business' | 'missing_config';
  recargosFraccionado?: number;
  primerPagoTotal?: number;
  pagosSubsecuentesTotal?: number;
  numeroPagos?: number;
  customConfigs?: CoberturasPersonalizadasCliente;
}

export type QuoteStatus =
  | 'Borrador'
  | 'Cotizando'
  | 'Cotizado'
  | 'En Revisión'
  | 'Aceptado'
  | 'Rechazado'
  | 'Cancelado'
  | 'Vencido';

export interface Cotizacion {
  id: string;
  folio: string;
  fechaCreacion: string;
  cliente: Cliente;
  vehiculo: Vehiculo;
  paqueteSeleccionado: 'Amplia' | 'Limitada' | 'RC';
  formaPagoSeleccionada: 'Anual' | 'Semestral' | 'Trimestral' | 'Mensual';
  status: QuoteStatus;
  userEmail: string;
  resultados: ResultadoAseguradora[];
}

export interface AseguradoraCredential {
  id: string;
  nombre: string;
  slug: string;
  logo: string;
  activo: boolean;
  credenciales: {
    [key: string]: string;
  };
}

export interface WSLog {
  id: string;
  timestamp: string;
  aseguradora: string;
  endpoint: string;
  status: number;
  tipo: 'Cotizacion' | 'Emision' | 'Catalogo';
  requestBody: string;
  responseBody: string;
  correcto: boolean;
  mensajeError?: string;
}
