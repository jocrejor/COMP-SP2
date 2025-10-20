let User=[
  { "id": 1, "name": "Juan Pérez", "password": "hashed_juan123", "email": "juan.perez@example.com" },
  { "id": 2, "name": "María Gómez", "password": "hashed_maria456", "email": "maria.gomez@example.com" },
  { "id": 3, "name": "Carlos Ruiz", "password": "hashed_carlos789", "email": "carlos.ruiz@example.com" },
  { "id": 4, "name": "Lucía Torres", "password": "hashed_lucia321", "email": "lucia.torres@example.com" },
  { "id": 5, "name": "Andrés López", "password": "hashed_andres654", "email": "andres.lopez@example.com" }
]
let Category = [
  { "id": 1, "name": "Tecnología" },
  { "id": 2, "name": "Cultura" },
  { "id": 3, "name": "Política" },
  { "id": 4, "name": "Ciencia" },
  { "id": 5, "name": "Deportes" }
]
let New = 
[
  {
    "id": 1,
    "title": "Avance en Inteligencia Artificial",
    "description": "OpenAI presenta su nuevo modelo",
    "body": "GPT-4o supera los modelos anteriores en comprensión.",
    "id_category": 1,
    "id_user": 1,
    "id_image": 1,
    "date": "2025-10-13T10:00:00",
    "published": true
  },
  {
    "id": 2,
    "title": "Festival de Cine Europeo",
    "description": "Grandes producciones se presentan este año",
    "body": "El festival contará con directores reconocidos...",
    "id_category": 2,
    "id_user": 2,
    "id_image": 2,
    "date": "2025-10-12T15:45:00",
    "published": true
  },
  {
    "id": 3,
    "title": "Elecciones 2025: Lo que debes saber",
    "description": "Todo sobre las elecciones próximas",
    "body": "Analizamos los candidatos y propuestas.",
    "id_category": 3,
    "id_user": 3,
    "id_image": 3,
    "date": "2025-10-11T09:30:00",
    "published": false
  },
  {
    "id": 4,
    "title": "Nuevo telescopio espacial lanzado",
    "description": "Exploración del universo más profunda",
    "body": "El telescopio Artemis II fue lanzado ayer...",
    "id_category": 4,
    "id_user": 4,
    "id_image": 4,
    "date": "2025-10-10T22:00:00",
    "published": true
  },
  {
    "id": 5,
    "title": "Final de la Champions League",
    "description": "Un duelo de titanes",
    "body": "Real Madrid y Bayern Múnich se enfrentan...",
    "id_category": 5,
    "id_user": 5,
    "id_image": 5,
    "date": "2025-10-13T20:00:00",
    "published": false
  };
]
let Image=[
  {
    "id": 1,
    "url": "https://example.com/images/ia.jpg",
    "name": "Portada IA",
    "order": 0,
    "id_new": 1
  },
  {
    "id": 2,
    "url": "https://example.com/images/cine.jpg",
    "name": "Festival Cine",
    "order": 0,
    "id_new": 2
  },
  {
    "id": 3,
    "url": "https://example.com/images/politica.jpg",
    "name": "Elecciones",
    "order": 0,;
    "id_new": 3
  },
  {
    "id": 4,
    "url": "https://example.com/images/espacio.jpg",
    "name": "Telescopio Artemis",
    "order": 0,
    "id_new": 4
  },
  {
    "id": 5,
    "url": "https://example.com/images/champions.jpg",
    "name": "Final Champions",
    "order": 0,
    "id_new": 5
  }
]
let Contact=[
  {
    "id": 1,
    "name": "Ana Morales",
    "phone": "+34111111111",
    "email": "ana.morales@example.com",
    "subject": "Quisiera suscribirme al boletín de tecnología",
    "date": "2025-10-13T08:00:00"
  },
  {
    "id": 2,
    "name": "Luis Ramírez",
    "phone": "+34123456789",
    "email": "luis.ramirez@example.com",
    "subject": "Error al acceder a una noticia",
    "date": "2025-10-12T17:30:00"
  },
  {
    "id": 3,
    "name": "Beatriz León",
    "phone": "+34987654321",
    "email": "beatriz.leon@example.com",
    "subject": "Quiero colaborar con contenido",
    "date": "2025-10-11T12:15:00"
  },
  {
    "id": 4,
    "name": "Sergio Navarro",
    "phone": "+34012345678",
    "email": "sergio.navarro@example.com",
    "subject": "Felicitaciones por el reportaje de ciencia",
    "date": "2025-10-10T09:00:00"
  },
  {
    "id": 5,
    "name": "Carla Domínguez",
    "phone": "+34098765432",
    "email": "carla.dominguez@example.com",
    "subject": "¿Cuándo publican más noticias de deportes?",
    "date": "2025-10-09T14:00:00"
  }
]
