const Attribute = [

  { id: 1, name: "Procesador", family_id: 1 },
  { id: 2, name: "Número de núcleos", family_id: 1 },
  { id: 3, name: "Frecuencia CPU", family_id: 1 },
  { id: 4, name: "Memoria RAM", family_id: 1 },
  { id: 5, name: "Tarjeta gráfica", family_id: 1 },
  { id: 6, name: "Placa base", family_id: 1 },
  { id: 7, name: "Tipo de refrigeración", family_id: 1 },

  { id: 8, name: "Capacidad disco duro", family_id: 6 },
  { id: 9, name: "Tipo de disco (SSD/HDD)", family_id: 6 },
  { id: 10, name: "Velocidad de lectura/escritura", family_id: 6 },
  { id: 11, name: "Ranuras de expansión", family_id: 6 },

  { id: 12, name: "Resolución pantalla", family_id: 4 },
  { id: 13, name: "Tipo de pantalla", family_id: 4 },
  { id: 14, name: "Tamaño pantalla", family_id: 4 },
  { id: 15, name: "Brillo", family_id: 4 },
  { id: 16, name: "Contraste", family_id: 4 },

  { id: 17, name: "Puertos USB", family_id: 3 },
  { id: 18, name: "Puerto HDMI", family_id: 3 },
  { id: 19, name: "Bluetooth", family_id: 3 },
  { id: 20, name: "Wi-Fi", family_id: 3 },
  { id: 21, name: "NFC", family_id: 3 },

  { id: 22, name: "Capacidad batería", family_id: 5 },
  { id: 23, name: "Tipo de batería", family_id: 5 },
  { id: 24, name: "Duración batería", family_id: 5 },
  { id: 25, name: "Carga rápida", family_id: 5 },

  { id: 26, name: "Sistema operativo", family_id: 2 },
  { id: 27, name: "Versión OS", family_id: 2 },
  { id: 28, name: "Software incluido", family_id: 2 },
  { id: 29, name: "Compatibilidad con aplicaciones", family_id: 2 },
  { id: 30, name: "Actualizaciones automáticas", family_id: 2 }
];



const Productattribute = [
  
  { product_id: 1, attribute_id: 1, value: "Negro" },
  { product_id: 1, attribute_id: 3, value: "0.2 kg" },
  { product_id: 1, attribute_id: 5, value: "SoundBeat" },
  { product_id: 1, attribute_id: 12, value: "6 horas" },
  { product_id: 1, attribute_id: 18, value: "IPX4" },


  { product_id: 2, attribute_id: 2, value: "42 pulgadas" },
  { product_id: 2, attribute_id: 4, value: "Plástico y aluminio" },
  { product_id: 2, attribute_id: 5, value: "SmartVision" },
  { product_id: 2, attribute_id: 10, value: "A+" },
  { product_id: 2, attribute_id: 14, value: "Netflix, YouTube" },

 
  { product_id: 3, attribute_id: 1, value: "Gris" },
  { product_id: 3, attribute_id: 3, value: "1.4 kg" },
  { product_id: 3, attribute_id: 6, value: "AB14" },
  { product_id: 3, attribute_id: 13, value: "Wi-Fi 6" },
  { product_id: 3, attribute_id: 16, value: "3.2 GHz" },

  
  { product_id: 4, attribute_id: 2, value: "4 cm diámetro" },
  { product_id: 4, attribute_id: 4, value: "Silicona" },
  { product_id: 4, attribute_id: 5, value: "PulseFit" },
  { product_id: 4, attribute_id: 13, value: "Bluetooth 5.1" },
  { product_id: 4, attribute_id: 18, value: "IP68" },


  { product_id: 5, attribute_id: 1, value: "Negro" },
  { product_id: 5, attribute_id: 3, value: "1.2 kg" },
  { product_id: 5, attribute_id: 5, value: "Photon" },
  { product_id: 5, attribute_id: 11, value: "6000x4000 px" },
  { product_id: 5, attribute_id: 8, value: "Photon Ltd." },

  
  { product_id: 6, attribute_id: 1, value: "Blanco" },
  { product_id: 6, attribute_id: 2, value: "15 pulgadas" },
  { product_id: 6, attribute_id: 5, value: "EcoBook" },
  { product_id: 6, attribute_id: 12, value: "12 horas" },
  { product_id: 6, attribute_id: 16, value: "3.5 GHz" },

  
  { product_id: 7, attribute_id: 1, value: "Azul" },
  { product_id: 7, attribute_id: 2, value: "Pequeño" },
  { product_id: 7, attribute_id: 5, value: "AquaSound" },
  { product_id: 7, attribute_id: 15, value: "600 mAh" },
  { product_id: 7, attribute_id: 18, value: "IPX7" },

 
  { product_id: 8, attribute_id: 2, value: "27 pulgadas" },
  { product_id: 8, attribute_id: 4, value: "Aluminio" },
  { product_id: 8, attribute_id: 5, value: "UltraVision" },
  { product_id: 8, attribute_id: 11, value: "4K UHD" },
  { product_id: 8, attribute_id: 17, value: "230 V" },


  { product_id: 9, attribute_id: 1, value: "Rojo" },
  { product_id: 9, attribute_id: 3, value: "1.1 kg" },
  { product_id: 9, attribute_id: 5, value: "FirePhone" },
  { product_id: 9, attribute_id: 7, value: "2 años" },
  { product_id: 9, attribute_id: 9, value: "China" },


  { product_id: 10, attribute_id: 2, value: "12 pulgadas" },
  { product_id: 10, attribute_id: 4, value: "Aluminio" },
  { product_id: 10, attribute_id: 5, value: "MiniTab" },
  { product_id: 10, attribute_id: 12, value: "8 horas" },
  { product_id: 10, attribute_id: 15, value: "128 GB" },

 
  { product_id: 11, attribute_id: 1, value: "Plateado" },
  { product_id: 11, attribute_id: 3, value: "1.5 kg" },
  { product_id: 11, attribute_id: 5, value: "ProLaptop" },
  { product_id: 11, attribute_id: 13, value: "Wi-Fi 6E" },
  { product_id: 11, attribute_id: 16, value: "3.8 GHz" },


  { product_id: 12, attribute_id: 2, value: "20 cm" },
  { product_id: 12, attribute_id: 4, value: "Plástico" },
  { product_id: 12, attribute_id: 5, value: "GardenSensor" },
  { product_id: 12, attribute_id: 12, value: "24 horas" },
  { product_id: 12, attribute_id: 18, value: "IP65" },

 
  { product_id: 13, attribute_id: 1, value: "Verde" },
  { product_id: 13, attribute_id: 3, value: "2 kg" },
  { product_id: 13, attribute_id: 5, value: "EcoSpeaker" },
  { product_id: 13, attribute_id: 15, value: "1200 mAh" },
  { product_id: 13, attribute_id: 18, value: "IPX6" },

 
  { product_id: 14, attribute_id: 2, value: "32 pulgadas" },
  { product_id: 14, attribute_id: 4, value: "Aluminio" },
  { product_id: 14, attribute_id: 5, value: "VisionPlus" },
  { product_id: 14, attribute_id: 10, value: "A" },
  { product_id: 14, attribute_id: 14, value: "YouTube, Prime Video" },

 
  { product_id: 15, attribute_id: 1, value: "Negro" },
  { product_id: 15, attribute_id: 3, value: "0.5 kg" },
  { product_id: 15, attribute_id: 5, value: "MiniSpeaker" },
  { product_id: 15, attribute_id: 12, value: "7 horas" },
  { product_id: 15, attribute_id: 18, value: "IPX5" },

 
  { product_id: 16, attribute_id: 2, value: "10 pulgadas" },
  { product_id: 16, attribute_id: 4, value: "Aluminio" },
  { product_id: 16, attribute_id: 5, value: "TabLite" },
  { product_id: 16, attribute_id: 12, value: "10 horas" },
  { product_id: 16, attribute_id: 15, value: "64 GB" },

 
  { product_id: 17, attribute_id: 1, value: "Blanco" },
  { product_id: 17, attribute_id: 3, value: "0.3 kg" },
  { product_id: 17, attribute_id: 5, value: "SoundMini" },
  { product_id: 17, attribute_id: 15, value: "500 mAh" },
  { product_id: 17, attribute_id: 18, value: "IPX3" },

 
  { product_id: 18, attribute_id: 2, value: "17 pulgadas" },
  { product_id: 18, attribute_id: 4, value: "Aluminio" },
  { product_id: 18, attribute_id: 5, value: "ProDisplay" },
  { product_id: 18, attribute_id: 11, value: "Full HD" },
  { product_id: 18, attribute_id: 17, value: "220 V" },

  
  { product_id: 19, attribute_id: 1, value: "Gris claro" },
  { product_id: 19, attribute_id: 3, value: "0.9 kg" },
  { product_id: 19, attribute_id: 5, value: "AlphaWatch" },
  { product_id: 19, attribute_id: 12, value: "5 días" },
  { product_id: 19, attribute_id: 18, value: "IP67" },


  { product_id: 20, attribute_id: 2, value: "22 pulgadas" },
  { product_id: 20, attribute_id: 4, value: "Plástico" },
  { product_id: 20, attribute_id: 5, value: "SmartMonitor" },
  { product_id: 20, attribute_id: 10, value: "A+" },
  { product_id: 20, attribute_id: 14, value: "Netflix, Hulu" },


  { product_id: 21, attribute_id: 1, value: "Azul marino" },
  { product_id: 21, attribute_id: 3, value: "1.3 kg" },
  { product_id: 21, attribute_id: 5, value: "OceanSpeaker" },
  { product_id: 21, attribute_id: 15, value: "1000 mAh" },
  { product_id: 21, attribute_id: 18, value: "IPX7" },


  { product_id: 22, attribute_id: 2, value: "19 pulgadas" },
  { product_id: 22, attribute_id: 4, value: "Aluminio" },
  { product_id: 22, attribute_id: 5, value: "VisionMax" },
  { product_id: 22, attribute_id: 11, value: "2K" },
  { product_id: 22, attribute_id: 17, value: "230 V" },


  { product_id: 23, attribute_id: 1, value: "Rojo brillante" },
  { product_id: 23, attribute_id: 3, value: "0.6 kg" },
  { product_id: 23, attribute_id: 5, value: "FireMini" },
  { product_id: 23, attribute_id: 12, value: "9 horas" },
  { product_id: 23, attribute_id: 18, value: "IPX4" },


  { product_id: 24, attribute_id: 2, value: "16 pulgadas" },
  { product_id: 24, attribute_id: 4, value: "Aluminio" },
  { product_id: 24, attribute_id: 5, value: "TabPro" },
  { product_id: 24, attribute_id: 12, value: "11 horas" },
  { product_id: 24, attribute_id: 15, value: "256 GB" },

  { product_id: 25, attribute_id: 1, value: "Negro mate" },
  { product_id: 25, attribute_id: 3, value: "0.8 kg" },
  { product_id: 25, attribute_id: 5, value: "StealthPhone" },
  { product_id: 25, attribute_id: 7, value: "2 años" },
  { product_id: 25, attribute_id: 9, value: "USA" }
];


