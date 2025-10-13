
let Family = [
  {
    "id": 1,
    "name": "Equipos informáticos",
    "image": "equipos_informaticos.jpg",
    "description": "Categoría principal de dispositivos y componentes de computación.",
    "parent_id": null
  },
  {
    "id": 2,
    "name": "Ordenadores",
    "image": "ordenadores.jpg",
    "description": "Equipos de cómputo que procesan información.",
    "parent_id": 1
  },
  {
    "id": 3,
    "name": "Periféricos",
    "image": "perifericos.jpg",
    "description": "Dispositivos que complementan el funcionamiento del ordenador.",
    "parent_id": 1
  },
  {
    "id": 4,
    "name": "Portátiles",
    "image": "portatiles.jpg",
    "description": "Ordenadores compactos y transportables.",
    "parent_id": 2
  },
  {
    "id": 5,
    "name": "Sobremesa",
    "image": "sobremesa.jpg",
    "description": "Ordenadores fijos de mayor potencia y capacidad de expansión.",
    "parent_id": 2
  },
  {
    "id": 6,
    "name": "Ratones",
    "image": "ratones.jpg",
    "description": "Periféricos de entrada para controlar el cursor.",
    "parent_id": 3
  },
  {
    "id": 7,
    "name": "Teclados",
    "image": "teclados.jpg",
    "description": "Periféricos de entrada para introducir texto y comandos.",
    "parent_id": 3
  },
  {
    "id": 8,
    "name": "Monitores",
    "image": "monitores.jpg",
    "description": "Periféricos de salida que muestran información visual.",
    "parent_id": 3
  },
  {
    "id": 9,
    "name": "Gaming Laptop",
    "image": "gaming_laptop.jpg",
    "description": "Portátil de alto rendimiento diseñado para videojuegos.",
    "parent_id": 4
  },
  {
    "id": 10,
    "name": "Mini PC",
    "image": "mini_pc.jpg",
    "description": "Ordenador de sobremesa compacto y eficiente en energía.",
    "parent_id": 5
  }
]

let Product = [
  { "id": 1, "name": "HP Pavilion 15", "price": 799.99, "description": "Portátil con procesador Intel Core i7, 16GB RAM y SSD 512GB.", "family_id": 4 },
  { "id": 2, "name": "Lenovo IdeaPad 3", "price": 599.00, "description": "Portátil ligero con AMD Ryzen 5 y pantalla Full HD.", "family_id": 4 },
  { "id": 3, "name": "Asus ZenBook 14", "price": 999.99, "description": "Ultraportátil con pantalla OLED y chasis de aluminio.", "family_id": 4 },
  { "id": 4, "name": "Acer Aspire 5", "price": 549.99, "description": "Portátil equilibrado para uso doméstico y oficina.", "family_id": 4 },
  { "id": 5, "name": "Gaming Laptop MSI Katana", "price": 1199.00, "description": "Portátil gamer con RTX 4060 y pantalla de 144Hz.", "family_id": 4 },

  { "id": 6, "name": "Dell OptiPlex 7010", "price": 649.50, "description": "Sobremesa compacto con procesador Intel i5.", "family_id": 5 },
  { "id": 7, "name": "HP Envy Desktop", "price": 899.99, "description": "PC de sobremesa de alto rendimiento con diseño moderno.", "family_id": 5 },
  { "id": 8, "name": "Lenovo ThinkCentre M70", "price": 749.00, "description": "Sobremesa empresarial con excelente fiabilidad.", "family_id": 5 },
  { "id": 9, "name": "Asus ROG Strix G10", "price": 1099.00, "description": "PC gamer con RTX 4070 y refrigeración avanzada.", "family_id": 5 },
  { "id": 10, "name": "Mini PC Intel NUC", "price": 499.99, "description": "PC compacto con bajo consumo energético.", "family_id": 5 },

  { "id": 11, "name": "Logitech MX Master 3", "price": 89.99, "description": "Ratón inalámbrico ergonómico con funciones avanzadas.", "family_id": 6 },
  { "id": 12, "name": "Razer DeathAdder V2", "price": 59.99, "description": "Ratón gamer con sensor óptico de alta precisión.", "family_id": 6 },
  { "id": 13, "name": "HP Wireless Mouse 200", "price": 19.99, "description": "Ratón inalámbrico básico para uso diario.", "family_id": 6 },
  { "id": 14, "name": "Apple Magic Mouse 2", "price": 99.00, "description": "Ratón multitáctil con batería recargable.", "family_id": 6 },
  { "id": 15, "name": "Logitech G Pro X Superlight", "price": 149.00, "description": "Ratón gamer ultraligero de alto rendimiento.", "family_id": 6 },

  { "id": 16, "name": "Corsair K70 RGB TKL", "price": 129.95, "description": "Teclado mecánico compacto con iluminación RGB.", "family_id": 7 },
  { "id": 17, "name": "Logitech G213 Prodigy", "price": 69.99, "description": "Teclado de membrana para gaming con iluminación.", "family_id": 7 },
  { "id": 18, "name": "Razer BlackWidow V4", "price": 179.99, "description": "Teclado mecánico RGB con switches verdes.", "family_id": 7 },
  { "id": 19, "name": "SteelSeries Apex 5", "price": 99.99, "description": "Teclado híbrido mecánico con pantalla OLED.", "family_id": 7 },
  { "id": 20, "name": "Apple Magic Keyboard", "price": 119.00, "description": "Teclado inalámbrico con batería recargable.", "family_id": 7 },

  { "id": 21, "name": "Samsung Odyssey G5", "price": 299.00, "description": "Monitor curvo QHD de 27 pulgadas.", "family_id": 8 },
  { "id": 22, "name": "LG UltraGear 32GN600", "price": 349.99, "description": "Monitor gaming de 32'' con 165Hz y HDR10.", "family_id": 8 },
  { "id": 23, "name": "Dell UltraSharp U2723QE", "price": 599.00, "description": "Monitor profesional 4K con panel IPS.", "family_id": 8 },
  { "id": 24, "name": "Asus ProArt PA278QV", "price": 399.00, "description": "Monitor de edición gráfica calibrado de fábrica.", "family_id": 8 },
  { "id": 25, "name": "BenQ Zowie XL2411K", "price": 229.99, "description": "Monitor eSports de 24'' y 144Hz.", "family_id": 8 },

  { "id": 26, "name": "MacBook Pro 14", "price": 1999.00, "description": "Portátil profesional con chip Apple M3 Pro.", "family_id": 9 },
  { "id": 27, "name": "ASUS ROG Zephyrus G14", "price": 1799.00, "description": "Portátil gamer de 14'' con GPU RTX 4060.", "family_id": 9 },
  { "id": 28, "name": "Lenovo Legion 5 Pro", "price": 1699.00, "description": "Portátil gaming QHD con sistema de refrigeración avanzado.", "family_id": 9 },
  { "id": 29, "name": "Acer Nitro 5", "price": 1099.00, "description": "Portátil gamer con gran relación calidad-precio.", "family_id": 9 },
  { "id": 30, "name": "HP Omen 16", "price": 1499.00, "description": "Portátil gamer con RTX 4070 y pantalla 165Hz.", "family_id": 9 },

  { "id": 31, "name": "Intel NUC 13 Pro", "price": 599.00, "description": "Mini PC con procesador Intel i7 de 13ª generación.", "family_id": 10 },
  { "id": 32, "name": "Beelink SER5", "price": 449.00, "description": "Mini PC compacto con Ryzen 7 5800H y SSD 512GB.", "family_id": 10 },
  { "id": 33, "name": "MINISFORUM UM790 Pro", "price": 649.00, "description": "Mini PC de alto rendimiento con AMD Ryzen 9.", "family_id": 10 },
  { "id": 34, "name": "Geekom Mini IT13", "price": 729.00, "description": "Mini PC versátil con puertos múltiples y 32GB RAM.", "family_id": 10 },
  { "id": 35, "name": "CHUWI HeroBox Pro", "price": 299.00, "description": "Mini PC económico para tareas de oficina.", "family_id": 10 },

  { "id": 36, "name": "iMac 24'' M3", "price": 1599.00, "description": "Ordenador todo en uno con chip M3 y pantalla Retina.", "family_id": 2 },
  { "id": 37, "name": "Dell XPS Tower", "price": 1299.00, "description": "Ordenador de alto rendimiento para tareas exigentes.", "family_id": 2 },
  { "id": 38, "name": "Lenovo ThinkStation P3", "price": 1899.00, "description": "Workstation profesional con tarjeta gráfica dedicada.", "family_id": 2 },
  { "id": 39, "name": "HP All-in-One 24", "price": 749.00, "description": "PC todo en uno con pantalla Full HD.", "family_id": 2 },
  { "id": 40, "name": "Asus ExpertCenter D5", "price": 899.00, "description": "Sobremesa de oficina silencioso y compacto.", "family_id": 2 },

  { "id": 41, "name": "Impresora HP LaserJet M140w", "price": 129.99, "description": "Impresora láser inalámbrica compacta.", "family_id": 3 },
  { "id": 42, "name": "Auriculares Logitech H390", "price": 49.99, "description": "Auriculares USB con micrófono y cancelación de ruido.", "family_id": 3 },
  { "id": 43, "name": "Webcam Logitech C920", "price": 89.99, "description": "Cámara Full HD para videollamadas y streaming.", "family_id": 3 },
  { "id": 44, "name": "Micrófono Blue Yeti", "price": 139.99, "description": "Micrófono profesional USB para grabación.", "family_id": 3 },
  { "id": 45, "name": "Altavoces Creative Pebble V3", "price": 59.99, "description": "Altavoces USB compactos con Bluetooth.", "family_id": 3 },

  { "id": 46, "name": "Placa base ASUS Prime B550M-A", "price": 129.00, "description": "Placa base para procesadores AMD Ryzen.", "family_id": 1 },
  { "id": 47, "name": "Tarjeta gráfica NVIDIA RTX 4080", "price": 1399.00, "description": "GPU de alto rendimiento para juegos y diseño 3D.", "family_id": 1 },
  { "id": 48, "name": "Fuente de alimentación Corsair RM750x", "price": 129.00, "description": "Fuente modular de 750W con certificación Gold.", "family_id": 1 },
  { "id": 49, "name": "Memoria RAM Kingston Fury 32GB", "price": 149.00, "description": "Kit DDR5 de alto rendimiento.", "family_id": 1 },
  { "id": 50, "name": "SSD Samsung 990 PRO 1TB", "price": 189.99, "description": "Unidad de almacenamiento NVMe de última generación.", "family_id": 1 }
]

Productimage = [

{ "id": 1,"name":"p_pavilion_15_front", "url":"https://www.hp.com/us-en/shop/pdp/hp-pavilion-laptop-15-eg3097nr","order": 1,"product_id": 1},
{ "id": 2,"name":"hp_pavilion_15_side", "url":"https://www.hp.com/us-en/shop/pdp/hp-pavilion-laptop-15-eg3097nr","order": 2,"product_id": 1},
{ "id": 3,"name":"hp_pavilion_15_back", "url":"https://www.hp.com/us-en/shop/pdp/hp-pavilion-laptop-15-eg3097nr","order": 3,"product_id": 1},
{ "id": 4,"name":"rtx4080_front", "url":"https://www.newegg.com/p/1FT-0004-00844","order": 1,"product_id": 47},
{ "id": 5,"name":"rtx4080_angled", "url":"https://www.newegg.com/p/1FT-0004-00844","order": 2,"product_id": 47},
{ "id": 6,"name":"rtx4080_backplate", "url":"https://www.newegg.com/p/1FT-0004-00844","order": 3,"product_id": 47},
{ "id": 7,"name":"inno3d_4080_front", "url":"https://inno3d.com/product/inno3d-geforce-rtx-4080-16gb-ichill-black","order": 1,"product_id": 47},
{ "id": 8,"name":"inno3d_4080_angle", "url":"https://inno3d.com/product/inno3d-geforce-rtx-4080-16gb-ichill-black","order": 2,"product_id": 47},
{ "id": 9,"name":"inno3d_4080_side", "url":"https://inno3d.com/product/inno3d-geforce-rtx-4080-16gb-ichill-black","order": 3,"product_id": 47}
]

let Order = [
  { "id": 1, "date": "2025-10-01 14:30", "payment": "Credit Card", "total_amount": 120.50, "shipping_amount": 5.00, "client_id": 101 },
  { "id": 2, "date": "2025-10-05 09:15", "payment": "PayPal", "total_amount": 75.99, "shipping_amount": 0.00, "client_id": 102 },
  { "id": 3, "date": "2025-10-07 18:45", "payment": "Bizum", "total_amount": 230.00, "shipping_amount": 10.00, "client_id": 103 },
  { "id": 4, "date": "2025-10-09 11:00", "payment": "Bank Transfer", "total_amount": 150.75, "shipping_amount": 7.50, "client_id": 104 },
  { "id": 5, "date": "2025-10-11 16:20", "payment": "Credit Card", "total_amount": 89.90, "shipping_amount": 0.00, "client_id": 105 },
  { "id": 6, "date": "2025-10-12 19:05", "payment": "PayPal", "total_amount": 300.00, "shipping_amount": 15.00, "client_id": 106 }
];

let Orderdetail = [
  { "id": 1, "order_id": 1, "product_id": 201, "discount": 0.00, "quantity": 2, "price": 25.00 },
  { "id": 2, "order_id": 1, "product_id": 202, "discount": 5.00, "quantity": 1, "price": 75.50 },
  { "id": 3, "order_id": 2, "product_id": 203, "discount": 0.00, "quantity": 3, "price": 20.00 },
  { "id": 4, "order_id": 3, "product_id": 201, "discount": 10.00, "quantity": 5, "price": 25.00 },
  { "id": 5, "order_id": 3, "product_id": 204, "discount": 0.00, "quantity": 2, "price": 50.00 }
];

