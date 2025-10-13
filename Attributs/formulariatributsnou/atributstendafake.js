const attributes = [
  { id: 1, name: "Color" },
  { id: 2, name: "Tamaño" },
  { id: 3, name: "Peso" },
  { id: 4, name: "Material" },
  { id: 5, name: "Marca" },
  { id: 6, name: "Modelo" },
  { id: 7, name: "Garantía" },
  { id: 8, name: "Fabricante" },
  { id: 9, name: "Origen" },
  { id: 10, name: "Consumo energético" },
  { id: 11, name: "Resolución" },
  { id: 12, name: "Duración batería" },
  { id: 13, name: "Tipo de conexión" },
  { id: 14, name: "Compatibilidad" },
  { id: 15, name: "Capacidad" },
  { id: 16, name: "Frecuencia" },
  { id: 17, name: "Voltaje" },
  { id: 18, name: "Resistencia al agua" },
  { id: 19, name: "Temperatura máxima" },
  { id: 20, name: "Color secundario" }
];

const productAttributes = [

  { product_id: 1, attribute_id: 1, value: "Negro" },
  { product_id: 1, attribute_id: 2, value: "Pequeño" },
  { product_id: 1, attribute_id: 3, value: "0.2 kg" },
  { product_id: 1, attribute_id: 4, value: "Plástico" },
  { product_id: 1, attribute_id: 5, value: "SoundBeat" },
  { product_id: 1, attribute_id: 6, value: "ZX100" },
  { product_id: 1, attribute_id: 12, value: "6 horas" },
  { product_id: 1, attribute_id: 13, value: "Bluetooth 5.0" },
  { product_id: 1, attribute_id: 18, value: "IPX4" },
  { product_id: 1, attribute_id: 15, value: "500 mAh" },


  { product_id: 2, attribute_id: 1, value: "Negro" },
  { product_id: 2, attribute_id: 2, value: "42 pulgadas" },
  { product_id: 2, attribute_id: 3, value: "7.5 kg" },
  { product_id: 2, attribute_id: 4, value: "Plástico y aluminio" },
  { product_id: 2, attribute_id: 5, value: "SmartVision" },
  { product_id: 2, attribute_id: 11, value: "Full HD 1080p" },
  { product_id: 2, attribute_id: 10, value: "A+" },
  { product_id: 2, attribute_id: 17, value: "230 V" },
  { product_id: 2, attribute_id: 14, value: "Netflix, YouTube" },
  { product_id: 2, attribute_id: 7, value: "2 años" },


  { product_id: 3, attribute_id: 1, value: "Gris" },
  { product_id: 3, attribute_id: 2, value: "14 pulgadas" },
  { product_id: 3, attribute_id: 3, value: "1.4 kg" },
  { product_id: 3, attribute_id: 4, value: "Aluminio" },
  { product_id: 3, attribute_id: 5, value: "AlphaTech" },
  { product_id: 3, attribute_id: 6, value: "AB14" },
  { product_id: 3, attribute_id: 12, value: "10 horas" },
  { product_id: 3, attribute_id: 13, value: "Wi-Fi 6" },
  { product_id: 3, attribute_id: 15, value: "512 GB SSD" },
  { product_id: 3, attribute_id: 16, value: "3.2 GHz" },


  { product_id: 4, attribute_id: 1, value: "Negro" },
  { product_id: 4, attribute_id: 2, value: "4 cm diámetro" },
  { product_id: 4, attribute_id: 3, value: "45 g" },
  { product_id: 4, attribute_id: 4, value: "Silicona" },
  { product_id: 4, attribute_id: 5, value: "PulseFit" },
  { product_id: 4, attribute_id: 12, value: "5 días" },
  { product_id: 4, attribute_id: 18, value: "IP68" },
  { product_id: 4, attribute_id: 13, value: "Bluetooth 5.1" },
  { product_id: 4, attribute_id: 7, value: "1 año" },
  { product_id: 4, attribute_id: 9, value: "China" },


  { product_id: 5, attribute_id: 1, value: "Negro" },
  { product_id: 5, attribute_id: 2, value: "Mediano" },
  { product_id: 5, attribute_id: 3, value: "1.2 kg" },
  { product_id: 5, attribute_id: 4, value: "Aleación metálica" },
  { product_id: 5, attribute_id: 5, value: "Photon" },
  { product_id: 5, attribute_id: 6, value: "X200" },
  { product_id: 5, attribute_id: 11, value: "6000x4000 px" },
  { product_id: 5, attribute_id: 15, value: "64 GB SD" },
  { product_id: 5, attribute_id: 7, value: "3 años" },
  { product_id: 5, attribute_id: 8, value: "Photon Ltd." }
];

const products = [
  {
    id: 1,
    name: "Auriculares inalámbricos ZX",
    price: 59.99,
    description: "Auriculares Bluetooth con cancelación de ruido y estuche de carga.",
    family_id: 1
  },
  {
    id: 2,
    name: "Televisor LED 42'' SmartVision",
    price: 349.99,
    description: "Televisor Full HD con acceso a apps y Wi-Fi integrado.",
    family_id: 2
  },
  {
    id: 3,
    name: "Portátil AlphaBook 14",
    price: 729.0,
    description: "Portátil de 14'' con 16GB RAM, SSD 512GB y batería de larga duración.",
    family_id: 3
  },
  {
    id: 4,
    name: "Smartwatch PulseFit Pro",
    price: 129.99,
    description: "Reloj inteligente con medición cardíaca, GPS y resistencia al agua.",
    family_id: 4
  },
  {
    id: 5,
    name: "Cámara Reflex Photon X200",
    price: 899.0,
    description: "Cámara digital profesional con sensor de 24 MP y pantalla táctil.",
    family_id: 5
  }
];