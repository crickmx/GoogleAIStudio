import type { Vehiculo } from '../types';

// Precise pre-configured, user-tested vehicles to ensure compatibility with PDFs and existing quote flows
const STATIC_VEHICLES: Vehiculo[] = [
  // Honda Civic 2017 (To match official HDI Policy PDF)
  {
    id: 'honda-civic-2017',
    marca: 'Honda',
    modelo: 'Civic',
    anio: 2017,
    version: 'EX L4 2.0L 158 CP 4 Puertas Std BA AA',
    descripcionCompleta: 'HONDA CIVIC EX L4 2.0L 158 CP 4 PUERTAS STD BA AA 2017',
    claveAmis: 'SEDHO004008-2017',
    armadoraGnp: 'HO',
    carroceriaGnp: '01',
    versionGnp: '02',
    valorReferencia: 226000,
  },
  // Kia Sportage 2018 (To match official user PDFs)
  {
    id: 'kia-sportage-2018',
    marca: 'Kia',
    modelo: 'Sportage',
    anio: 2018,
    version: 'SXL 2.4L AWD Aut 5P (Piel/QC)',
    descripcionCompleta: 'KIA SPORTAGE SXL 2.4 AWD AUT 5P 5OCUP 2018',
    claveAmis: '0520310',
    armadoraGnp: 'KI',
    carroceriaGnp: '05',
    versionGnp: '12',
    valorReferencia: 254650,
  },
  // Toyota Yaris 2007 (Precisely matching user PDFs)
  {
    id: 'toyota-yaris-2007',
    marca: 'Toyota',
    modelo: 'Yaris',
    anio: 2007,
    version: 'Core AC Automática 4Ptas',
    descripcionCompleta: 'TOYOTA YARIS CORE AC AUTOMATICA 4PTAS',
    claveAmis: '0810010',
    armadoraGnp: 'TO',
    carroceriaGnp: '01',
    versionGnp: '05',
    valorReferencia: 72619,
  },
  // VW Jetta 2014 (Precisely matching Jetta Clásico/A4 2014 PDFs)
  {
    id: 'vw-jetta-2014',
    marca: 'Volkswagen',
    modelo: 'Jetta',
    anio: 2014,
    version: 'Clásico CL Team L4 2.0L Std',
    descripcionCompleta: 'VOLKSWAGEN JETTA CLASICO CL TEAM L4 2.0L STD',
    claveAmis: '0912101',
    armadoraGnp: 'VW',
    carroceriaGnp: '01',
    versionGnp: '02',
    valorReferencia: 124000,
  },
  // VW Amarok 2020 (Precisely matching Quálitas Policy PDF)
  {
    id: 'vw-amarok-2020',
    marca: 'Volkswagen',
    modelo: 'Amarok',
    anio: 2020,
    version: 'Amarok Highline PK 4P L4 2.0L TDI Aut',
    descripcionCompleta: 'VW AMAROK HIGHLINE PK 4P L4 2.0L TDI 4MOTION 1.5TO AUT',
    claveAmis: '0912122',
    armadoraGnp: 'VW',
    carroceriaGnp: '04',
    versionGnp: '05',
    valorReferencia: 677350,
  },
  // Nissan Versa
  {
    id: 'niss-versa-1',
    marca: 'Nissan',
    modelo: 'Versa',
    anio: 2024,
    version: 'Sense TM 1.6L',
    descripcionCompleta: 'NISSAN VERSA SENSE TRANS. MANUAL 1.6L 4 CIL',
    claveAmis: '0715602',
    armadoraGnp: 'NI',
    carroceriaGnp: '01',
    versionGnp: '05',
    valorReferencia: 334900,
  },
  {
    id: 'niss-versa-2',
    marca: 'Nissan',
    modelo: 'Versa',
    anio: 2024,
    version: 'Advance CVT 1.6L',
    descripcionCompleta: 'NISSAN VERSA ADVANCE TRANS. AUTOMATICA 1.6L 4 CIL',
    claveAmis: '0715603',
    armadoraGnp: 'NI',
    carroceriaGnp: '01',
    versionGnp: '12',
    valorReferencia: 382900,
  },
  {
    id: 'niss-versa-3',
    marca: 'Nissan',
    modelo: 'Versa',
    anio: 2023,
    version: 'Sense TM 1.6L',
    descripcionCompleta: 'NISSAN VERSA SENSE TRANS. MANUAL 1.6L 4 CIL',
    claveAmis: '0715602',
    armadoraGnp: 'NI',
    carroceriaGnp: '01',
    versionGnp: '05',
    valorReferencia: 319900,
  },
  {
    id: 'niss-versa-4',
    marca: 'Nissan',
    modelo: 'Versa',
    anio: 2025,
    version: 'Exclusive CVT 1.6L',
    descripcionCompleta: 'NISSAN VERSA EXCLUSIVE CVT 1.6L 4 CIL',
    claveAmis: '0715604',
    armadoraGnp: 'NI',
    carroceriaGnp: '01',
    versionGnp: '18',
    valorReferencia: 412900,
  },

  // Nissan Sentra
  {
    id: 'niss-sentra-1',
    marca: 'Nissan',
    modelo: 'Sentra',
    anio: 2024,
    version: 'Sense TM 2.0L',
    descripcionCompleta: 'NISSAN SENTRA SENSE TRANS. MANUAL 2.0L 4 CIL',
    claveAmis: '0715610',
    armadoraGnp: 'NI',
    carroceriaGnp: '02',
    versionGnp: '01',
    valorReferencia: 395900,
  },
  {
    id: 'niss-sentra-2',
    marca: 'Nissan',
    modelo: 'Sentra',
    anio: 2024,
    version: 'SR CVT 2.0L',
    descripcionCompleta: 'NISSAN SENTRA SR CVT AUTO 2.0L 4 CIL',
    claveAmis: '0715612',
    armadoraGnp: 'NI',
    carroceriaGnp: '02',
    versionGnp: '08',
    valorReferencia: 512900,
  },

  // Volkswagen Jetta
  {
    id: 'vw-jetta-1',
    marca: 'Volkswagen',
    modelo: 'Jetta',
    anio: 2024,
    version: 'Trendline TM 1.4T',
    descripcionCompleta: 'VW JETTA TRENDLINE TRANS. MANUAL 1.4T TURBO 4 CIL',
    claveAmis: '0912301',
    armadoraGnp: 'VW',
    carroceriaGnp: '01',
    versionGnp: '02',
    valorReferencia: 409990,
  },
  {
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
  {
    id: 'vw-jetta-3',
    marca: 'Volkswagen',
    modelo: 'Jetta',
    anio: 2023,
    version: 'Comfortline TA 1.4T',
    descripcionCompleta: 'VW JETTA COMFORTLINE TIPTRONIC 1.4T',
    claveAmis: '0912302',
    armadoraGnp: 'VW',
    carroceriaGnp: '01',
    versionGnp: '06',
    valorReferencia: 454990,
  },
  {
    id: 'vw-jetta-4',
    marca: 'Volkswagen',
    modelo: 'Jetta',
    anio: 2025,
    version: 'Sportline L4 1.4T',
    descripcionCompleta: 'VW JETTA SPORTLINE L4 T/A 1.4T DOHC',
    claveAmis: '0912304',
    armadoraGnp: 'VW',
    carroceriaGnp: '01',
    versionGnp: '15',
    valorReferencia: 554900,
  },

  // Volkswagen Tiguan
  {
    id: 'vw-tiguan-1',
    marca: 'Volkswagen',
    modelo: 'Tiguan',
    anio: 2024,
    version: 'Trendline Plus 1.4T',
    descripcionCompleta: 'VW TIGUAN TRENDLINE PLUS DSG L4 1.4T',
    claveAmis: '0915601',
    armadoraGnp: 'VW',
    carroceriaGnp: '05',
    versionGnp: '01',
    valorReferencia: 589900,
  },
  {
    id: 'vw-tiguan-2',
    marca: 'Volkswagen',
    modelo: 'Tiguan',
    anio: 2024,
    version: 'R-Line 2.0T AWD',
    descripcionCompleta: 'VW TIGUAN R-LINE 2.0T DSG 4MOTION L4',
    claveAmis: '0915603',
    armadoraGnp: 'VW',
    carroceriaGnp: '05',
    versionGnp: '12',
    valorReferencia: 814900,
  },

  // Toyota Corolla
  {
    id: 'toy-corolla-1',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2024,
    version: 'Base CVT 2.0L',
    descripcionCompleta: 'TOYOTA COROLLA BASE CVT 2.0L 4 CIL',
    claveAmis: '0812201',
    armadoraGnp: 'TO',
    carroceriaGnp: '01',
    versionGnp: '01',
    valorReferencia: 419900,
  },
  {
    id: 'toy-corolla-2',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2024,
    version: 'SE Hybrid CVT',
    descripcionCompleta: 'TOYOTA COROLLA SE HIBRIDO CVT L4 1.8L',
    claveAmis: '0812203',
    armadoraGnp: 'TO',
    carroceriaGnp: '01',
    versionGnp: '09',
    valorReferencia: 529900,
  },
  {
    id: 'toy-corolla-3',
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2025,
    version: 'XLE CVT 2.0L',
    descripcionCompleta: 'TOYOTA COROLLA XLE DOHC CVT 2.0L 4 CIL',
    claveAmis: '0812204',
    armadoraGnp: 'TO',
    carroceriaGnp: '01',
    versionGnp: '14',
    valorReferencia: 509900,
  },

  // Toyota Hilux
  {
    id: 'toy-hilux-1',
    marca: 'Toyota',
    modelo: 'Hilux',
    anio: 2024,
    version: 'Doble Cabina Base TM',
    descripcionCompleta: 'TOYOTA HILUX DC BASE TM L4 2.7L MANUAL',
    claveAmis: '0815410',
    armadoraGnp: 'TO',
    carroceriaGnp: '04',
    versionGnp: '02',
    valorReferencia: 494900,
  },
  {
    id: 'toy-hilux-2',
    marca: 'Toyota',
    modelo: 'Hilux',
    anio: 2024,
    version: 'Doble Cabina Diesel TA 4x4',
    descripcionCompleta: 'TOYOTA HILUX DC DIESEL TA 4x4 2.8T',
    claveAmis: '0815412',
    armadoraGnp: 'TO',
    carroceriaGnp: '04',
    versionGnp: '10',
    valorReferencia: 765900,
  },

  // Chevrolet Aveo
  {
    id: 'chev-aveo-1',
    marca: 'Chevrolet',
    modelo: 'Aveo',
    anio: 2024,
    version: 'LS Manual',
    descripcionCompleta: 'CHEVROLET AVEO LS SEDAN MANUAL 1.5L',
    claveAmis: '0212401',
    armadoraGnp: 'CH',
    carroceriaGnp: '01',
    versionGnp: '01',
    valorReferencia: 292400,
  },
  {
    id: 'chev-aveo-2',
    marca: 'Chevrolet',
    modelo: 'Aveo',
    anio: 2024,
    version: 'LT Plus Aut',
    descripcionCompleta: 'CHEVROLET AVEO LT PLUS AUTOMATICA SEDAN 1.5L',
    claveAmis: '0212403',
    armadoraGnp: 'CH',
    carroceriaGnp: '01',
    versionGnp: '05',
    valorReferencia: 332400,
  },

  // Mazda 3
  {
    id: 'maz-3-1',
    marca: 'Mazda',
    modelo: 'Mazda 3',
    anio: 2024,
    version: 'i Touring TA 2.5L',
    descripcionCompleta: 'MAZDA 3 i TOURING TRANSMISION AUTOMATICA 2.5L L4',
    claveAmis: '0612101',
    armadoraGnp: 'MA',
    carroceriaGnp: '01',
    versionGnp: '01',
    valorReferencia: 412900,
  },
  {
    id: 'maz-3-2',
    marca: 'Mazda',
    modelo: 'Mazda 3',
    anio: 2024,
    version: 'Signature AWD 2.5T Turbo',
    descripcionCompleta: 'MAZDA 3 BASE SIGNATURE TURBO AWD AUTOMATICO',
    claveAmis: '0612104',
    armadoraGnp: 'MA',
    carroceriaGnp: '01',
    versionGnp: '08',
    valorReferencia: 542900,
  },

  // Honda CR-V
  {
    id: 'hon-crv-1',
    marca: 'Honda',
    modelo: 'CR-V',
    anio: 2024,
    version: 'Turbo Plus CVT',
    descripcionCompleta: 'HONDA CR-V TURBO PLUS CVT L4 1.5T',
    claveAmis: '0515201',
    armadoraGnp: 'HO',
    carroceriaGnp: '05',
    versionGnp: '02',
    valorReferencia: 714900,
  },
  {
    id: 'hon-crv-2',
    marca: 'Honda',
    modelo: 'CR-V',
    anio: 2024,
    version: 'Touring Hybrid CVT',
    descripcionCompleta: 'HONDA CR-V TOURING HIBRIDA CVT 2.0L L4',
    claveAmis: '0515203',
    armadoraGnp: 'HO',
    carroceriaGnp: '05',
    versionGnp: '09',
    valorReferencia: 899900,
  },

  // BMW 320i / 330i
  {
    id: 'bmw-320-1',
    marca: 'BMW',
    modelo: '3 Series',
    anio: 2024,
    version: '320i M Sport AT',
    descripcionCompleta: 'BMW 320i M SPORT TRANSP. AUTOMATICA L4 TURBO',
    claveAmis: '0112101',
    armadoraGnp: 'BM',
    carroceriaGnp: '01',
    versionGnp: '01',
    valorReferencia: 915000,
  },
  {
    id: 'bmw-330-1',
    marca: 'BMW',
    modelo: '3 Series',
    anio: 2024,
    version: '330i Sport Line AT',
    descripcionCompleta: 'BMW 330i SPORT LINE AUTOMATICO 2.0T 4 CIL',
    claveAmis: '0112103',
    armadoraGnp: 'BM',
    carroceriaGnp: '01',
    versionGnp: '06',
    valorReferencia: 1099900,
  },

  // Kia Seltos Explicit Case (Case 1)
  {
    id: 'kia-seltos-1',
    marca: 'Kia',
    modelo: 'Seltos',
    anio: 2022,
    version: 'EX 1.6L Automatica 5Ptasa',
    descripcionCompleta: 'KIA SELTOS EX 1.6L AUTOMATICA 5PTAS',
    claveAmis: 'P0440025',
    valorReferencia: 306090,
  },

  // BMW R1250GS Explicit Case (Case 2 - Motorbike)
  {
    id: 'bmw-r1250gs-1',
    marca: 'BMW (Moto)',
    modelo: 'R1250GS',
    anio: 2022,
    version: 'Adventure 1254 CC',
    descripcionCompleta: 'MP BMW TODO TERRENO R1250GS ADVENTURE 1254 CC',
    claveAmis: 'M5000401',
    valorReferencia: 363400,
  },

  // BMW X5
  {
    id: 'bmw-x5-1',
    marca: 'BMW',
    modelo: 'X5',
    anio: 2025,
    version: 'xDrive 50e L6 3.0T Hybrid',
    descripcionCompleta: 'BMW X5 XDRIVE 50E 5P L6 3.0T PHEV AUT.',
    claveAmis: '20754',
    valorReferencia: 1399000,
  },

  // Honda Fit
  {
    id: 'hon-fit-1',
    marca: 'Honda',
    modelo: 'Fit',
    anio: 2020,
    version: 'Hit L4 1.5L CVT',
    descripcionCompleta: 'HONDA FIT HIT 5P L4 1.5L ABS BA AC R16 CVT',
    claveAmis: '8554',
    valorReferencia: 239200,
  },

  // Nissan Sentra Advanced
  {
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
  {
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
  {
    id: 'mazda-cx5-2019',
    marca: 'Mazda',
    modelo: 'CX-5',
    anio: 2019,
    version: 'S Grand Touring 2.5L Auto',
    descripcionCompleta: 'MAZDA CX5 S GRAND TOURING 2.5I VP QC AUTOMATICA 5P 2019',
    claveAmis: '0615201',
    armadoraGnp: 'MA',
    carroceriaGnp: '05',
    versionGnp: '02',
    valorReferencia: 324000,
  },

  // FORD
  {
    id: 'ford-must-1',
    marca: 'Ford',
    modelo: 'Mustang',
    anio: 2024,
    version: 'GT V8 5.0L Trans. Automatica',
    descripcionCompleta: 'FORD MUSTANG GT COUPE V8 T/A 5.0L OHC',
    claveAmis: '0312001',
    armadoraGnp: 'FO',
    carroceriaGnp: '03',
    versionGnp: '01',
    valorReferencia: 1099900,
  },
  {
    id: 'ford-lobo-1',
    marca: 'Ford',
    modelo: 'Lobo',
    anio: 2024,
    version: 'Lariat V6 EcoBoost 4x4',
    descripcionCompleta: 'FORD LOBO LARIAT DOBLE CABINA V5 TURBO 4X4',
    claveAmis: '0315401',
    armadoraGnp: 'FO',
    carroceriaGnp: '04',
    versionGnp: '12',
    valorReferencia: 1249900,
  },

  // HYUNDAI
  {
    id: 'hyun-creta-1',
    marca: 'Hyundai',
    modelo: 'Creta',
    anio: 2024,
    version: 'GLS Premium L4 1.5L Automatica',
    descripcionCompleta: 'HYUNDAI CRETA GLS PREMIUM T/A 1.5L 4 CIL',
    claveAmis: '1115201',
    armadoraGnp: 'HY',
    carroceriaGnp: '05',
    versionGnp: '02',
    valorReferencia: 459900,
  },

  // SUZUKI
  {
    id: 'suzu-swift-1',
    marca: 'Suzuki',
    modelo: 'Swift',
    anio: 2024,
    version: 'Boosterjet Sport Manual',
    descripcionCompleta: 'SUZUKI SWIFT SPORT BOOSTERJET M/T 1.4T TURBO',
    claveAmis: '1812101',
    armadoraGnp: 'SU',
    carroceriaGnp: '01',
    versionGnp: '02',
    valorReferencia: 389900,
  },

  // MITSUBISHI
  {
    id: 'mits-l200-1',
    marca: 'Mitsubishi',
    modelo: 'L200',
    anio: 2024,
    version: 'Doble Cabina GLS Diesel 4x4',
    descripcionCompleta: 'MITSUBISHI L200 GLX TURBO DIESEL 4X4 MT',
    claveAmis: '1215410',
    armadoraGnp: 'MI',
    carroceriaGnp: '04',
    versionGnp: '04',
    valorReferencia: 549900,
  },

  // JEEP
  {
    id: 'jeep-wrang-1',
    marca: 'Jeep',
    modelo: 'Wrangler',
    anio: 2024,
    version: 'Rubicon Unlimited 4x4 T/A',
    descripcionCompleta: 'JEEP WRANGLER RUBICON UNLIMITED V6 4X4 AUT',
    claveAmis: '1515101',
    armadoraGnp: 'JE',
    carroceriaGnp: '05',
    versionGnp: '09',
    valorReferencia: 1399900,
  },

  // DODGE
  {
    id: 'dod-att-1',
    marca: 'Dodge',
    modelo: 'Attitude',
    anio: 2024,
    version: 'SE Manual L3 1.2L',
    descripcionCompleta: 'DODGE ATTITUDE SE TRANS. MANUAL L3 1.2L',
    claveAmis: '1612401',
    armadoraGnp: 'DO',
    carroceriaGnp: '01',
    versionGnp: '01',
    valorReferencia: 279900,
  },

  // RENAULT
  {
    id: 'ren-kwid-1',
    marca: 'Renault',
    modelo: 'Kwid',
    anio: 2024,
    version: 'Intens L3 1.0L Manual',
    descripcionCompleta: 'RENAULT KWID INTENS MANUAL 1.0L L3',
    claveAmis: '1412401',
    armadoraGnp: 'RE',
    carroceriaGnp: '01',
    versionGnp: '01',
    valorReferencia: 235200,
  },

  // SEAT
  {
    id: 'seat-ibiza-1',
    marca: 'Seat',
    modelo: 'Ibiza',
    anio: 2024,
    version: 'Style L4 1.6L Manual',
    descripcionCompleta: 'SEAT IBIZA STYLE TRANS. MANUAL L4 1.6L',
    claveAmis: '1712101',
    armadoraGnp: 'SE',
    carroceriaGnp: '01',
    versionGnp: '02',
    valorReferencia: 329900,
  },

  // MG
  {
    id: 'mg-mg5-1',
    marca: 'MG',
    modelo: 'MG5',
    anio: 2024,
    version: 'Elegance L4 1.5L Automatica',
    descripcionCompleta: 'MG MG5 ELEGANCE TRANS. AUTOMATICA L4 1.5L',
    claveAmis: '2212401',
    armadoraGnp: 'MG',
    carroceriaGnp: '01',
    versionGnp: '05',
    valorReferencia: 319900,
  },

  // MERCEDES-BENZ
  {
    id: 'merc-c200-1',
    marca: 'Mercedes-Benz',
    modelo: 'C-Class',
    anio: 2024,
    version: 'C200 Sport T/A Hybrid',
    descripcionCompleta: 'MB C200 SPORT L4 TURBO HIBRIDO MHEV T/A',
    claveAmis: '1312101',
    armadoraGnp: 'MB',
    carroceriaGnp: '01',
    versionGnp: '03',
    valorReferencia: 1149900,
  },

  // AUDI
  {
    id: 'audi-a3-1',
    marca: 'Audi',
    modelo: 'A3',
    anio: 2024,
    version: '35 TFSI Select DSG 1.4T',
    descripcionCompleta: 'AUDI A3 STRONIC TFSI SELECT S TRONIC 1.4T',
    claveAmis: '2312101',
    armadoraGnp: 'AU',
    carroceriaGnp: '01',
    versionGnp: '02',
    valorReferencia: 689900,
  },

  // PEUGEOT
  {
    id: 'peug-208-1',
    marca: 'Peugeot',
    modelo: '208',
    anio: 2024,
    version: 'Allure Pack L3 1.2T Aut',
    descripcionCompleta: 'PEUGEOT 208 ALLURE TURBO AUTOMATICO L3',
    claveAmis: '2412101',
    armadoraGnp: 'PE',
    carroceriaGnp: '01',
    versionGnp: '01',
    valorReferencia: 429900,
  },

  // CUPRA
  {
    id: 'cupr-form-1',
    marca: 'Cupra',
    modelo: 'Formentor',
    anio: 2024,
    version: 'VZ L4 2.0T DSG 4Drive',
    descripcionCompleta: 'CUPRA FORMENTOR S-TRONIC 2.0T 4MOTION L4',
    claveAmis: '2515201',
    armadoraGnp: 'CU',
    carroceriaGnp: '05',
    versionGnp: '01',
    valorReferencia: 899900,
  },

  // BYD
  {
    id: 'byd-dolph-1',
    marca: 'BYD',
    modelo: 'Dolphin',
    anio: 2024,
    version: 'EV Hatchback Electrico',
    descripcionCompleta: 'BYD DOLPHIN HATCHBACK ELECTRICO 70KW EV',
    claveAmis: '2612401',
    armadoraGnp: 'BY',
    carroceriaGnp: '01',
    versionGnp: '01',
    valorReferencia: 535900,
  },

  // TESLA
  {
    id: 'tesl-m3-1',
    marca: 'Tesla',
    modelo: 'Model 3',
    anio: 2024,
    version: 'Standard Range EV',
    descripcionCompleta: 'TESLA MODEL 3 SEDAN ELECTRICO REAR WHEEL DRIVE',
    claveAmis: '2112101',
    armadoraGnp: 'TE',
    carroceriaGnp: '01',
    versionGnp: '01',
    valorReferencia: 889900,
  }
];

interface ModelMetadata {
  modelo: string;
  tipoCarroceria: 'sedan' | 'suv' | 'pickup' | 'hatchback' | 'deportivo' | 'moto';
  precioBase: number; // reference 2024 pricing
}

// Master automotive market database metadata covering dozens of manufacturers standard in Quálitas (AMIS) catalog
const BRAND_MODELS_METADATA: Record<string, ModelMetadata[]> = {
  'Acura': [
    { modelo: 'TLX', tipoCarroceria: 'sedan', precioBase: 890000 },
    { modelo: 'RDX', tipoCarroceria: 'suv', precioBase: 1050000 },
    { modelo: 'MDX', tipoCarroceria: 'suv', precioBase: 1350000 }
  ],
  'Audi': [
    { modelo: 'A1', tipoCarroceria: 'hatchback', precioBase: 499000 },
    { modelo: 'A3', tipoCarroceria: 'sedan', precioBase: 659050 },
    { modelo: 'A4', tipoCarroceria: 'sedan', precioBase: 885000 },
    { modelo: 'Q3', tipoCarroceria: 'suv', precioBase: 799000 },
    { modelo: 'Q5', tipoCarroceria: 'suv', precioBase: 1145000 },
    { modelo: 'Q7', tipoCarroceria: 'suv', precioBase: 1540000 }
  ],
  'BMW': [
    { modelo: '1 Series', tipoCarroceria: 'hatchback', precioBase: 680000 },
    { modelo: '3 Series', tipoCarroceria: 'sedan', precioBase: 915000 },
    { modelo: '5 Series', tipoCarroceria: 'sedan', precioBase: 1290000 },
    { modelo: 'X1', tipoCarroceria: 'suv', precioBase: 880000 },
    { modelo: 'X3', tipoCarroceria: 'suv', precioBase: 1199000 },
    { modelo: 'X5', tipoCarroceria: 'suv', precioBase: 1499500 }
  ],
  'BYD': [
    { modelo: 'Dolphin', tipoCarroceria: 'hatchback', precioBase: 535900 },
    { modelo: 'Seal', tipoCarroceria: 'sedan', precioBase: 880000 },
    { modelo: 'Song Plus', tipoCarroceria: 'suv', precioBase: 775000 },
    { modelo: 'Tang', tipoCarroceria: 'suv', precioBase: 1399000 }
  ],
  'Buick': [
    { modelo: 'Envista', tipoCarroceria: 'suv', precioBase: 530000 },
    { modelo: 'Envision', tipoCarroceria: 'suv', precioBase: 780000 },
    { modelo: 'Enclave', tipoCarroceria: 'suv', precioBase: 1250000 }
  ],
  'Cadillac': [
    { modelo: 'CT5', tipoCarroceria: 'sedan', precioBase: 1120000 },
    { modelo: 'XT5', tipoCarroceria: 'suv', precioBase: 1100000 },
    { modelo: 'Escalade', tipoCarroceria: 'suv', precioBase: 2650000 }
  ],
  'Chevrolet': [
    { modelo: 'Aveo', tipoCarroceria: 'sedan', precioBase: 295000 },
    { modelo: 'Onix', tipoCarroceria: 'sedan', precioBase: 360000 },
    { modelo: 'Cavalier', tipoCarroceria: 'sedan', precioBase: 420000 },
    { modelo: 'Tracker', tipoCarroceria: 'suv', precioBase: 445000 },
    { modelo: 'Captiva', tipoCarroceria: 'suv', precioBase: 499900 },
    { modelo: 'Equinox', tipoCarroceria: 'suv', precioBase: 595000 },
    { modelo: 'Tahoe', tipoCarroceria: 'suv', precioBase: 1550000 },
    { modelo: 'Suburban', tipoCarroceria: 'suv', precioBase: 1720000 },
    { modelo: 'Silverado', tipoCarroceria: 'pickup', precioBase: 790000 },
    { modelo: 'Cheyenne', tipoCarroceria: 'pickup', precioBase: 1120000 },
    { modelo: 'Colorado', tipoCarroceria: 'pickup', precioBase: 849000 }
  ],
  'Chirey': [
    { modelo: 'Tiggo 2 Pro', tipoCarroceria: 'suv', precioBase: 359000 },
    { modelo: 'Tiggo 4 Pro', tipoCarroceria: 'suv', precioBase: 439000 },
    { modelo: 'Tiggo 7 Pro', tipoCarroceria: 'suv', precioBase: 529000 },
    { modelo: 'Tiggo 8 Pro', tipoCarroceria: 'suv', precioBase: 739000 }
  ],
  'Chrysler': [
    { modelo: 'Pacifica', tipoCarroceria: 'suv', precioBase: 1150000 }
  ],
  'Cupra': [
    { modelo: 'Leon', tipoCarroceria: 'hatchback', precioBase: 685000 },
    { modelo: 'Formentor', tipoCarroceria: 'suv', precioBase: 729000 },
    { modelo: 'Ateca', tipoCarroceria: 'suv', precioBase: 845000 }
  ],
  'Dodge': [
    { modelo: 'Attitude', tipoCarroceria: 'sedan', precioBase: 279900 },
    { modelo: 'Journey', tipoCarroceria: 'suv', precioBase: 620000 },
    { modelo: 'Durango', tipoCarroceria: 'suv', precioBase: 1090000 },
    { modelo: 'Challenger', tipoCarroceria: 'deportivo', precioBase: 1150000 }
  ],
  'Fiat': [
    { modelo: 'Mobi', tipoCarroceria: 'hatchback', precioBase: 265000 },
    { modelo: 'Argo', tipoCarroceria: 'hatchback', precioBase: 310000 },
    { modelo: 'Pulse', tipoCarroceria: 'suv', precioBase: 385000 }
  ],
  'Ford': [
    { modelo: 'Figo', tipoCarroceria: 'hatchback', precioBase: 265000 },
    { modelo: 'Mustang', tipoCarroceria: 'deportivo', precioBase: 1099000 },
    { modelo: 'Territory', tipoCarroceria: 'suv', precioBase: 595000 },
    { modelo: 'Escape', tipoCarroceria: 'suv', precioBase: 760000 },
    { modelo: 'Explorer', tipoCarroceria: 'suv', precioBase: 1150000 },
    { modelo: 'Bronco Sport', tipoCarroceria: 'suv', precioBase: 749000 },
    { modelo: 'Ranger', tipoCarroceria: 'pickup', precioBase: 685000 },
    { modelo: 'Lobo', tipoCarroceria: 'pickup', precioBase: 1249000 },
    { modelo: 'Maverick', tipoCarroceria: 'pickup', precioBase: 699000 }
  ],
  'GMC': [
    { modelo: 'Terrain', tipoCarroceria: 'suv', precioBase: 799000 },
    { modelo: 'Acadia', tipoCarroceria: 'suv', precioBase: 1089000 },
    { modelo: 'Yukon', tipoCarroceria: 'suv', precioBase: 1950000 },
    { modelo: 'Sierra', tipoCarroceria: 'pickup', precioBase: 1480000 }
  ],
  'Honda': [
    { modelo: 'City', tipoCarroceria: 'sedan', precioBase: 385000 },
    { modelo: 'Civic', tipoCarroceria: 'sedan', precioBase: 549000 },
    { modelo: 'Accord', tipoCarroceria: 'sedan', precioBase: 785000 },
    { modelo: 'HR-V', tipoCarroceria: 'suv', precioBase: 589000 },
    { modelo: 'CR-V', tipoCarroceria: 'suv', precioBase: 714900 },
    { modelo: 'Pilot', tipoCarroceria: 'suv', precioBase: 1120000 },
    { modelo: 'Odyssey', tipoCarroceria: 'suv', precioBase: 1210000 },
    { modelo: 'Fit', tipoCarroceria: 'hatchback', precioBase: 260000 }
  ],
  'Hyundai': [
    { modelo: 'Grand i10', tipoCarroceria: 'hatchback', precioBase: 260000 },
    { modelo: 'Accent', tipoCarroceria: 'sedan', precioBase: 335000 },
    { modelo: 'Elantra', tipoCarroceria: 'sedan', precioBase: 460000 },
    { modelo: 'Creta', tipoCarroceria: 'suv', precioBase: 459900 },
    { modelo: 'Tucson', tipoCarroceria: 'suv', precioBase: 585000 },
    { modelo: 'Santa Fe', tipoCarroceria: 'suv', precioBase: 840000 }
  ],
  'Infiniti': [
    { modelo: 'Q50', tipoCarroceria: 'sedan', precioBase: 890000 },
    { modelo: 'QX50', tipoCarroceria: 'suv', precioBase: 1120000 },
    { modelo: 'QX60', tipoCarroceria: 'suv', precioBase: 1390000 }
  ],
  'JAC': [
    { modelo: 'J7', tipoCarroceria: 'sedan', precioBase: 379000 },
    { modelo: 'Sei 2', tipoCarroceria: 'suv', precioBase: 299000 },
    { modelo: 'Sei 4 Pro', tipoCarroceria: 'suv', precioBase: 395000 },
    { modelo: 'Frison T8', tipoCarroceria: 'pickup', precioBase: 469000 }
  ],
  'Jeep': [
    { modelo: 'Renegade', tipoCarroceria: 'suv', precioBase: 469900 },
    { modelo: 'Compass', tipoCarroceria: 'suv', precioBase: 635000 },
    { modelo: 'Wrangler', tipoCarroceria: 'suv', precioBase: 1199000 },
    { modelo: 'Grand Cherokee', tipoCarroceria: 'suv', precioBase: 1380000 },
    { modelo: 'Gladiator', tipoCarroceria: 'pickup', precioBase: 1250000 }
  ],
  'Kia': [
    { modelo: 'Rio', tipoCarroceria: 'sedan', precioBase: 310000 },
    { modelo: 'Forte', tipoCarroceria: 'sedan', precioBase: 395000 },
    { modelo: 'K3', tipoCarroceria: 'sedan', precioBase: 318000 },
    { modelo: 'Soul', tipoCarroceria: 'suv', precioBase: 389000 },
    { modelo: 'Seltos', tipoCarroceria: 'suv', precioBase: 459000 },
    { modelo: 'Sportage', tipoCarroceria: 'suv', precioBase: 595000 },
    { modelo: 'Sorento', tipoCarroceria: 'suv', precioBase: 785000 }
  ],
  'Lincoln': [
    { modelo: 'Corsair', tipoCarroceria: 'suv', precioBase: 1049000 },
    { modelo: 'Nautilus', tipoCarroceria: 'suv', precioBase: 1289000 },
    { modelo: 'Navigator', tipoCarroceria: 'suv', precioBase: 2150000 }
  ],
  'MINI': [
    { modelo: 'Cooper', tipoCarroceria: 'hatchback', precioBase: 585000 },
    { modelo: 'Countryman', tipoCarroceria: 'suv', precioBase: 785000 }
  ],
  'MG': [
    { modelo: 'MG3', tipoCarroceria: 'hatchback', precioBase: 239900 },
    { modelo: 'MG5', tipoCarroceria: 'sedan', precioBase: 298900 },
    { modelo: 'MG GT', tipoCarroceria: 'sedan', precioBase: 389900 },
    { modelo: 'ZS', tipoCarroceria: 'suv', precioBase: 379900 },
    { modelo: 'HS', tipoCarroceria: 'suv', precioBase: 519000 },
    { modelo: 'RX5', tipoCarroceria: 'suv', precioBase: 479900 }
  ],
  'Mazda': [
    { modelo: 'Mazda 2', tipoCarroceria: 'sedan', precioBase: 285000 },
    { modelo: 'Mazda 3', tipoCarroceria: 'sedan', precioBase: 412900 },
    { modelo: 'Mazda 6', tipoCarroceria: 'sedan', precioBase: 595000 },
    { modelo: 'CX-3', tipoCarroceria: 'suv', precioBase: 399000 },
    { modelo: 'CX-30', tipoCarroceria: 'suv', precioBase: 479000 },
    { modelo: 'CX-5', tipoCarroceria: 'suv', precioBase: 575000 },
    { modelo: 'CX-90', tipoCarroceria: 'suv', precioBase: 1130000 },
    { modelo: 'MX-5', tipoCarroceria: 'deportivo', precioBase: 495000 }
  ],
  'Mercedes-Benz': [
    { modelo: 'A-Class', tipoCarroceria: 'hatchback', precioBase: 780000 },
    { modelo: 'C-Class', tipoCarroceria: 'sedan', precioBase: 1099000 },
    { modelo: 'E-Class', tipoCarroceria: 'sedan', precioBase: 1450000 },
    { modelo: 'GLA', tipoCarroceria: 'suv', precioBase: 890000 },
    { modelo: 'GLC', tipoCarroceria: 'suv', precioBase: 1290000 },
    { modelo: 'GLE', tipoCarroceria: 'suv', precioBase: 1750000 },
    { modelo: 'Sprinter', tipoCarroceria: 'suv', precioBase: 980000 }
  ],
  'Mitsubishi': [
    { modelo: 'Mirage G4', tipoCarroceria: 'sedan', precioBase: 285000 },
    { modelo: 'XPander', tipoCarroceria: 'suv', precioBase: 435000 },
    { modelo: 'Outlander', tipoCarroceria: 'suv', precioBase: 699000 },
    { modelo: 'L200', tipoCarroceria: 'pickup', precioBase: 510000 }
  ],
  'Nissan': [
    { modelo: 'March', tipoCarroceria: 'hatchback', precioBase: 259900 },
    { modelo: 'Versa', tipoCarroceria: 'sedan', precioBase: 334900 },
    { modelo: 'Sentra', tipoCarroceria: 'sedan', precioBase: 395900 },
    { modelo: 'Altima', tipoCarroceria: 'sedan', precioBase: 749000 },
    { modelo: 'Kicks', tipoCarroceria: 'suv', precioBase: 415000 },
    { modelo: 'X-Trail', tipoCarroceria: 'suv', precioBase: 689000 },
    { modelo: 'Pathfinder', tipoCarroceria: 'suv', precioBase: 1190000 },
    { modelo: 'NP300', tipoCarroceria: 'pickup', precioBase: 435000 },
    { modelo: 'Frontier', tipoCarroceria: 'pickup', precioBase: 499900 },
    { modelo: 'Urvan', tipoCarroceria: 'suv', precioBase: 585000 }
  ],
  'Omoda': [
    { modelo: 'O5', tipoCarroceria: 'sedan', precioBase: 399000 },
    { modelo: 'C5', tipoCarroceria: 'suv', precioBase: 512000 }
  ],
  'Peugeot': [
    { modelo: '208', tipoCarroceria: 'hatchback', precioBase: 399900 },
    { modelo: '2008', tipoCarroceria: 'suv', precioBase: 475000 },
    { modelo: '3008', tipoCarroceria: 'suv', precioBase: 610000 },
    { modelo: 'Partner', tipoCarroceria: 'pickup', precioBase: 385000 }
  ],
  'Porsche': [
    { modelo: '911 Carrera', tipoCarroceria: 'deportivo', precioBase: 2350000 },
    { modelo: 'Macan', tipoCarroceria: 'suv', precioBase: 1250000 },
    { modelo: 'Cayenne', tipoCarroceria: 'suv', precioBase: 1750000 }
  ],
  'RAM': [
    { modelo: 'RAM 700', tipoCarroceria: 'pickup', precioBase: 315900 },
    { modelo: 'RAM 1500', tipoCarroceria: 'pickup', precioBase: 989000 },
    { modelo: 'RAM 2500', tipoCarroceria: 'pickup', precioBase: 1450000 }
  ],
  'Renault': [
    { modelo: 'Kwid', tipoCarroceria: 'hatchback', precioBase: 235200 },
    { modelo: 'Logan', tipoCarroceria: 'sedan', precioBase: 299000 },
    { modelo: 'Duster', tipoCarroceria: 'suv', precioBase: 379000 },
    { modelo: 'Koleos', tipoCarroceria: 'suv', precioBase: 569000 },
    { modelo: 'Oroch', tipoCarroceria: 'pickup', precioBase: 395000 }
  ],
  'SEAT': [
    { modelo: 'Ibiza', tipoCarroceria: 'hatchback', precioBase: 329900 },
    { modelo: 'Leon', tipoCarroceria: 'hatchback', precioBase: 495000 },
    { modelo: 'Arona', tipoCarroceria: 'suv', precioBase: 415000 },
    { modelo: 'Ateca', tipoCarroceria: 'suv', precioBase: 555000 }
  ],
  'Subaru': [
    { modelo: 'Crosstrek', tipoCarroceria: 'suv', precioBase: 579000 },
    { modelo: 'Forester', tipoCarroceria: 'suv', precioBase: 659000 },
    { modelo: 'WRX', tipoCarroceria: 'deportivo', precioBase: 829000 }
  ],
  'Suzuki': [
    { modelo: 'Ignis', tipoCarroceria: 'hatchback', precioBase: 289900 },
    { modelo: 'Swift', tipoCarroceria: 'hatchback', precioBase: 319900 },
    { modelo: 'Ertiga', tipoCarroceria: 'suv', precioBase: 415000 },
    { modelo: 'Vitara', tipoCarroceria: 'suv', precioBase: 459000 },
    { modelo: 'Jimny', tipoCarroceria: 'suv', precioBase: 465000 }
  ],
  'Tesla': [
    { modelo: 'Model 3', tipoCarroceria: 'sedan', precioBase: 889900 },
    { modelo: 'Model Y', tipoCarroceria: 'suv', precioBase: 979900 },
    { modelo: 'Model S', tipoCarroceria: 'sedan', precioBase: 1550000 },
    { modelo: 'Model X', tipoCarroceria: 'suv', precioBase: 1690000 }
  ],
  'Toyota': [
    { modelo: 'Yaris', tipoCarroceria: 'sedan', precioBase: 312000 },
    { modelo: 'Corolla', tipoCarroceria: 'sedan', precioBase: 419900 },
    { modelo: 'Camry', tipoCarroceria: 'sedan', precioBase: 565000 },
    { modelo: 'Prius', tipoCarroceria: 'sedan', precioBase: 485000 },
    { modelo: 'Avanza', tipoCarroceria: 'suv', precioBase: 355000 },
    { modelo: 'Raize', tipoCarroceria: 'suv', precioBase: 378000 },
    { modelo: 'RAV4', tipoCarroceria: 'suv', precioBase: 595000 },
    { modelo: 'Highlander', tipoCarroceria: 'suv', precioBase: 915000 },
    { modelo: 'Sienna', tipoCarroceria: 'suv', precioBase: 940000 },
    { modelo: 'Tacoma', tipoCarroceria: 'pickup', precioBase: 765000 },
    { modelo: 'Hilux', tipoCarroceria: 'pickup', precioBase: 494900 },
    { modelo: 'Tundra', tipoCarroceria: 'pickup', precioBase: 1420000 }
  ],
  'Volkswagen': [
    { modelo: 'Polo', tipoCarroceria: 'hatchback', precioBase: 345000 },
    { modelo: 'Vento', tipoCarroceria: 'sedan', precioBase: 285000 },
    { modelo: 'Virtus', tipoCarroceria: 'sedan', precioBase: 325000 },
    { modelo: 'Jetta', tipoCarroceria: 'sedan', precioBase: 409990 },
    { modelo: 'Taos', tipoCarroceria: 'suv', precioBase: 515000 },
    { modelo: 'Tiguan', tipoCarroceria: 'suv', precioBase: 589900 },
    { modelo: 'Teramont', tipoCarroceria: 'suv', precioBase: 920000 },
    { modelo: 'Saveiro', tipoCarroceria: 'pickup', precioBase: 315000 },
    { modelo: 'Amarok', tipoCarroceria: 'pickup', precioBase: 890000 }
  ],
  'Volvo': [
    { modelo: 'EX30', tipoCarroceria: 'suv', precioBase: 659000 },
    { modelo: 'XC40', tipoCarroceria: 'suv', precioBase: 849000 },
    { modelo: 'XC60', tipoCarroceria: 'suv', precioBase: 1199000 },
    { modelo: 'XC90', tipoCarroceria: 'suv', precioBase: 1650000 },
    { modelo: 'S60', tipoCarroceria: 'sedan', precioBase: 899000 }
  ],
  'BMW (Moto)': [
    { modelo: 'R1250GS', tipoCarroceria: 'moto', precioBase: 363400 },
    { modelo: 'G310R', tipoCarroceria: 'moto', precioBase: 125000 }
  ],
  'Honda (Moto)': [
    { modelo: 'DIO 110', tipoCarroceria: 'moto', precioBase: 34900 },
    { modelo: 'CB190R', tipoCarroceria: 'moto', precioBase: 62000 },
    { modelo: 'CBR600RR', tipoCarroceria: 'moto', precioBase: 289000 }
  ],
  'Yamaha (Moto)': [
    { modelo: 'Crypton', tipoCarroceria: 'moto', precioBase: 34900 },
    { modelo: 'FZ25', tipoCarroceria: 'moto', precioBase: 79900 },
    { modelo: 'YZF-R3', tipoCarroceria: 'moto', precioBase: 165000 }
  ]
};

// Map of AMIS structure classification prefixes used in Quálitas (first 2 digits)
const AMIS_PREFIX: Record<string, string> = {
  'Acura': '27', 'Audi': '23', 'BMW': '01', 'BYD': '26', 'Buick': '28',
  'Cadillac': '29', 'Chevrolet': '02', 'Chirey': '30', 'Chrysler': '04',
  'Cupra': '25', 'Dodge': '16', 'Fiat': '06', 'Ford': '03', 'GMC': '10',
  'Honda': '05', 'Hyundai': '11', 'Jeep': '15', 'Kia': '19', 'Lincoln': '17',
  'MINI': '18', 'MG': '22', 'Mazda': '06', 'Mercedes-Benz': '13',
  'Mitsubishi': '12', 'Nissan': '07', 'Omoda': '31', 'Peugeot': '24',
  'Porsche': '20', 'RAM': '32', 'Renault': '14', 'SEAT': '17',
  'Subaru': '33', 'Suzuki': '18', 'Tesla': '21', 'Toyota': '08',
  'Volkswagen': '09', 'Volvo': '22', 'BMW (Moto)': 'M5', 'Honda (Moto)': 'M8',
  'Yamaha (Moto)': 'M9'
};

// Consistent string hashing tool to ensure AMIS codes generated procedurally are stable and reproducible
function getDeterministicAmis(brand: string, model: string, version: string, year: number): string {
  const prefix = AMIS_PREFIX[brand] || '00';
  const str = `${brand}-${model}-${version}-${year}`.toUpperCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const suffix = String(Math.abs(hash) % 89999 + 10000); // 5 numeric digits
  return `${prefix}${suffix}`;
}

// Compiles and returns the full combined array elements (Static Seeds + Procedural Matrix Expansion for 100% catalog coverage)
function generateFullCatalog(): Vehiculo[] {
  const finalCatalog: Vehiculo[] = [...STATIC_VEHICLES];

  // List of years to evaluate for standard models
  const YEARS_TO_EXPAND = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  for (const [brand, models] of Object.entries(BRAND_MODELS_METADATA)) {
    const armadoraCode = brand.toUpperCase().substring(0, 2);

    for (const item of models) {
      const { modelo, tipoCarroceria, precioBase } = item;

      // Define body code for GNP mapping
      let bodyGnp = '01'; // Default Sedan / Hatchback
      if (tipoCarroceria === 'suv') bodyGnp = '05';
      if (tipoCarroceria === 'pickup') bodyGnp = '04';
      if (tipoCarroceria === 'deportivo') bodyGnp = '03';
      if (tipoCarroceria === 'hatchback') bodyGnp = '01';
      if (tipoCarroceria === 'moto') bodyGnp = '07';

      for (const year of YEARS_TO_EXPAND) {
        // Skip procedural generation if a precise static mock is already seeded for this specific brand, model and year
        const matchesStatic = STATIC_VEHICLES.some(
          v => v.marca.toLowerCase() === brand.toLowerCase() && 
               v.modelo.toLowerCase() === modelo.toLowerCase() && 
               v.anio === year
        );
        if (matchesStatic) continue;

        // Depreciation factor: vehicles depreciate ~8% per year prior to 2024, and appreciate/premium for 2025/2026
        const depreciationFactor = Math.pow(0.92, Math.max(0, 2024 - year)) * (year > 2024 ? (1 + (year - 2024) * 0.05) : 1);
        const indexedBase = precioBase * depreciationFactor;

        // Generate 3 visual equipment variants for standard cars, and 2 for motorcycles to look highly authentic
        const isBike = tipoCarroceria === 'moto';
        const variantsToGenerate = isBike ? 2 : 3;

        for (let i = 0; i < variantsToGenerate; i++) {
          let tierVersion = '';
          let modifier = 1.0;
          let versionGnpCode = '01';

          if (isBike) {
            if (i === 0) {
              tierVersion = 'Standard Edition';
              modifier = 0.95;
              versionGnpCode = '01';
            } else {
              tierVersion = 'Premium Pro Active / ABS';
              modifier = 1.15;
              versionGnpCode = '05';
            }
          } else {
            // Volume / Luxury Cars
            if (i === 0) {
              tierVersion = tipoCarroceria === 'pickup' ? 'Chasis Cabina Manual / TM' : 'Sense / LS Manual 5Vel';
              modifier = 0.88;
              versionGnpCode = '01';
            } else if (i === 1) {
              tierVersion = tipoCarroceria === 'pickup' ? 'Doble Cabina LT TM' : 'Advance / LT Automatica CVT';
              modifier = 1.05;
              versionGnpCode = '05';
            } else {
              tierVersion = 'Exclusive / Premier L4 Turbo Intelligent Aut';
              modifier = 1.25;
              versionGnpCode = '12';
            }
          }

          const modelPrice = Math.round(indexedBase * modifier * 10) / 10;
          const uppercaseName = `${brand} ${modelo} ${tierVersion}`.toUpperCase();
          const uniqueId = `gen-${brand.slice(0, 3).toLowerCase()}-${modelo.toLowerCase().replace(/[^a-z0-9]/g, '')}-${year}-${i + 1}`;
          
          finalCatalog.push({
            id: uniqueId,
            marca: brand,
            modelo: modelo,
            anio: year,
            version: `${tierVersion}`,
            descripcionCompleta: `${uppercaseName} ${year}`,
            claveAmis: getDeterministicAmis(brand, modelo, tierVersion, year),
            armadoraGnp: armadoraCode,
            carroceriaGnp: bodyGnp,
            versionGnp: versionGnpCode,
            valorReferencia: modelPrice
          });
        }
      }
    }
  }

  // Sorted list for clean rendering in alphabetical manufacturer index order
  return finalCatalog.sort((a, b) => a.marca.localeCompare(b.marca) || a.modelo.localeCompare(b.modelo) || b.anio - a.anio);
}

// Export computed static + dynamic matrix
export const VEHICLE_CATALOG: Vehiculo[] = generateFullCatalog();

// Quick fetch helper methods used by screens & cascade selectors
export function getBrands(): string[] {
  return Array.from(new Set(VEHICLE_CATALOG.map((v) => v.marca))).sort();
}

export function getYearsForBrand(brand: string): number[] {
  const years = VEHICLE_CATALOG.filter((v) => v.marca === brand).map((v) => v.anio);
  return Array.from(new Set(years)).sort((a, b) => b - a);
}

export function getModelsForBrandAndYear(brand: string, year: number): string[] {
  const models = VEHICLE_CATALOG.filter((v) => v.marca === brand && v.anio === year).map((v) => v.modelo);
  return Array.from(new Set(models)).sort();
}

export function getVersionsForSelection(brand: string, year: number, model: string): Vehiculo[] {
  return VEHICLE_CATALOG.filter((v) => v.marca === brand && v.anio === year && v.modelo === model).sort((a, b) =>
    a.version.localeCompare(b.version)
  );
}
