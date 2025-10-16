const Attribute = [
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
  { id: 20, name: "Color secundario" },
  { id: 21, name: "Peso máximo soportado" },
  { id: 22, name: "Velocidad" },
  { id: 23, name: "Conectividad" },
  { id: 24, name: "Sensor" },
  { id: 25, name: "Tipo de pantalla" },
  { id: 26, name: "Iluminación" },
  { id: 27, name: "Altura" },
  { id: 28, name: "Anchura" },
  { id: 29, name: "Profundidad" },
  { id: 30, name: "Material del cable" }
];


const Productattribute = [
  // Producto 1
  { product_id: 1, attribute_id: 1, value: "Negro" },
  { product_id: 1, attribute_id: 3, value: "0.2 kg" },
  { product_id: 1, attribute_id: 5, value: "SoundBeat" },
  { product_id: 1, attribute_id: 12, value: "6 horas" },
  { product_id: 1, attribute_id: 18, value: "IPX4" },

  // Producto 2
  { product_id: 2, attribute_id: 2, value: "42 pulgadas" },
  { product_id: 2, attribute_id: 4, value: "Plástico y aluminio" },
  { product_id: 2, attribute_id: 5, value: "SmartVision" },
  { product_id: 2, attribute_id: 10, value: "A+" },
  { product_id: 2, attribute_id: 14, value: "Netflix, YouTube" },

  // Producto 3
  { product_id: 3, attribute_id: 1, value: "Gris" },
  { product_id: 3, attribute_id: 3, value: "1.4 kg" },
  { product_id: 3, attribute_id: 6, value: "AB14" },
  { product_id: 3, attribute_id: 13, value: "Wi-Fi 6" },
  { product_id: 3, attribute_id: 16, value: "3.2 GHz" },

  // Producto 4
  { product_id: 4, attribute_id: 2, value: "4 cm diámetro" },
  { product_id: 4, attribute_id: 4, value: "Silicona" },
  { product_id: 4, attribute_id: 5, value: "PulseFit" },
  { product_id: 4, attribute_id: 13, value: "Bluetooth 5.1" },
  { product_id: 4, attribute_id: 18, value: "IP68" },

  // Producto 5
  { product_id: 5, attribute_id: 1, value: "Negro" },
  { product_id: 5, attribute_id: 3, value: "1.2 kg" },
  { product_id: 5, attribute_id: 5, value: "Photon" },
  { product_id: 5, attribute_id: 11, value: "6000x4000 px" },
  { product_id: 5, attribute_id: 8, value: "Photon Ltd." },

  // Producto 6
  { product_id: 6, attribute_id: 1, value: "Blanco" },
  { product_id: 6, attribute_id: 2, value: "15 pulgadas" },
  { product_id: 6, attribute_id: 5, value: "EcoBook" },
  { product_id: 6, attribute_id: 12, value: "12 horas" },
  { product_id: 6, attribute_id: 16, value: "3.5 GHz" },

  // Producto 7
  { product_id: 7, attribute_id: 1, value: "Azul" },
  { product_id: 7, attribute_id: 2, value: "Pequeño" },
  { product_id: 7, attribute_id: 5, value: "AquaSound" },
  { product_id: 7, attribute_id: 15, value: "600 mAh" },
  { product_id: 7, attribute_id: 18, value: "IPX7" },

  // Producto 8
  { product_id: 8, attribute_id: 2, value: "27 pulgadas" },
  { product_id: 8, attribute_id: 4, value: "Aluminio" },
  { product_id: 8, attribute_id: 5, value: "UltraVision" },
  { product_id: 8, attribute_id: 11, value: "4K UHD" },
  { product_id: 8, attribute_id: 17, value: "230 V" },

  // Producto 9
  { product_id: 9, attribute_id: 1, value: "Rojo" },
  { product_id: 9, attribute_id: 3, value: "1.1 kg" },
  { product_id: 9, attribute_id: 5, value: "FirePhone" },
  { product_id: 9, attribute_id: 7, value: "2 años" },
  { product_id: 9, attribute_id: 9, value: "China" },

  // Producto 10
  { product_id: 10, attribute_id: 2, value: "12 pulgadas" },
  { product_id: 10, attribute_id: 4, value: "Aluminio" },
  { product_id: 10, attribute_id: 5, value: "MiniTab" },
  { product_id: 10, attribute_id: 12, value: "8 horas" },
  { product_id: 10, attribute_id: 15, value: "128 GB" },

  // Producto 11
  { product_id: 11, attribute_id: 1, value: "Plateado" },
  { product_id: 11, attribute_id: 3, value: "1.5 kg" },
  { product_id: 11, attribute_id: 5, value: "ProLaptop" },
  { product_id: 11, attribute_id: 13, value: "Wi-Fi 6E" },
  { product_id: 11, attribute_id: 16, value: "3.8 GHz" },

  // Producto 12
  { product_id: 12, attribute_id: 2, value: "20 cm" },
  { product_id: 12, attribute_id: 4, value: "Plástico" },
  { product_id: 12, attribute_id: 5, value: "GardenSensor" },
  { product_id: 12, attribute_id: 12, value: "24 horas" },
  { product_id: 12, attribute_id: 18, value: "IP65" },

  // Producto 13
  { product_id: 13, attribute_id: 1, value: "Verde" },
  { product_id: 13, attribute_id: 3, value: "2 kg" },
  { product_id: 13, attribute_id: 5, value: "EcoSpeaker" },
  { product_id: 13, attribute_id: 15, value: "1200 mAh" },
  { product_id: 13, attribute_id: 18, value: "IPX6" },

  // Producto 14
  { product_id: 14, attribute_id: 2, value: "32 pulgadas" },
  { product_id: 14, attribute_id: 4, value: "Aluminio" },
  { product_id: 14, attribute_id: 5, value: "VisionPlus" },
  { product_id: 14, attribute_id: 10, value: "A" },
  { product_id: 14, attribute_id: 14, value: "YouTube, Prime Video" },

  // Producto 15
  { product_id: 15, attribute_id: 1, value: "Negro" },
  { product_id: 15, attribute_id: 3, value: "0.5 kg" },
  { product_id: 15, attribute_id: 5, value: "MiniSpeaker" },
  { product_id: 15, attribute_id: 12, value: "7 horas" },
  { product_id: 15, attribute_id: 18, value: "IPX5" },

  // Producto 16
  { product_id: 16, attribute_id: 2, value: "10 pulgadas" },
  { product_id: 16, attribute_id: 4, value: "Aluminio" },
  { product_id: 16, attribute_id: 5, value: "TabLite" },
  { product_id: 16, attribute_id: 12, value: "10 horas" },
  { product_id: 16, attribute_id: 15, value: "64 GB" },

  // Producto 17
  { product_id: 17, attribute_id: 1, value: "Blanco" },
  { product_id: 17, attribute_id: 3, value: "0.3 kg" },
  { product_id: 17, attribute_id: 5, value: "SoundMini" },
  { product_id: 17, attribute_id: 15, value: "500 mAh" },
  { product_id: 17, attribute_id: 18, value: "IPX3" },

  // Producto 18
  { product_id: 18, attribute_id: 2, value: "17 pulgadas" },
  { product_id: 18, attribute_id: 4, value: "Aluminio" },
  { product_id: 18, attribute_id: 5, value: "ProDisplay" },
  { product_id: 18, attribute_id: 11, value: "Full HD" },
  { product_id: 18, attribute_id: 17, value: "220 V" },

  // Producto 19
  { product_id: 19, attribute_id: 1, value: "Gris claro" },
  { product_id: 19, attribute_id: 3, value: "0.9 kg" },
  { product_id: 19, attribute_id: 5, value: "AlphaWatch" },
  { product_id: 19, attribute_id: 12, value: "5 días" },
  { product_id: 19, attribute_id: 18, value: "IP67" },

  // Producto 20
  { product_id: 20, attribute_id: 2, value: "22 pulgadas" },
  { product_id: 20, attribute_id: 4, value: "Plástico" },
  { product_id: 20, attribute_id: 5, value: "SmartMonitor" },
  { product_id: 20, attribute_id: 10, value: "A+" },
  { product_id: 20, attribute_id: 14, value: "Netflix, Hulu" },

  // Producto 21
  { product_id: 21, attribute_id: 1, value: "Azul marino" },
  { product_id: 21, attribute_id: 3, value: "1.3 kg" },
  { product_id: 21, attribute_id: 5, value: "OceanSpeaker" },
  { product_id: 21, attribute_id: 15, value: "1000 mAh" },
  { product_id: 21, attribute_id: 18, value: "IPX7" },

  // Producto 22
  { product_id: 22, attribute_id: 2, value: "19 pulgadas" },
  { product_id: 22, attribute_id: 4, value: "Aluminio" },
  { product_id: 22, attribute_id: 5, value: "VisionMax" },
  { product_id: 22, attribute_id: 11, value: "2K" },
  { product_id: 22, attribute_id: 17, value: "230 V" },

  // Producto 23
  { product_id: 23, attribute_id: 1, value: "Rojo brillante" },
  { product_id: 23, attribute_id: 3, value: "0.6 kg" },
  { product_id: 23, attribute_id: 5, value: "FireMini" },
  { product_id: 23, attribute_id: 12, value: "9 horas" },
  { product_id: 23, attribute_id: 18, value: "IPX4" },

  // Producto 24
  { product_id: 24, attribute_id: 2, value: "16 pulgadas" },
  { product_id: 24, attribute_id: 4, value: "Aluminio" },
  { product_id: 24, attribute_id: 5, value: "TabPro" },
  { product_id: 24, attribute_id: 12, value: "11 horas" },
  { product_id: 24, attribute_id: 15, value: "256 GB" },

  // Producto 25
  { product_id: 25, attribute_id: 1, value: "Negro mate" },
  { product_id: 25, attribute_id: 3, value: "0.8 kg" },
  { product_id: 25, attribute_id: 5, value: "StealthPhone" },
  { product_id: 25, attribute_id: 7, value: "2 años" },
  { product_id: 25, attribute_id: 9, value: "USA" }
];


