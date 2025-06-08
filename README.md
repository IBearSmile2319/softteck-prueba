# Star Wars Weather API

## 🚀 Características

- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **APIs Externas**: Integración con SWAPI (Star Wars) y OpenMeteo (clima)
- **Cache**: Sistema de caché con TTL de 30 minutos
- **Base de Datos**: DynamoDB para almacenamiento y caché
- **Documentación**: Swagger UI integrado
- **Serverless**: Despliegue en AWS Lambda con API Gateway
- **TypeScript**: Tipado
- **Testing**: Pruebas unitarias con Jest

## 📋 Requisitos

- Node.js 20+
- AWS CLI configurado
- Serverless Framework
- Cuenta de AWS

## 🛠 Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd star-wars-weather-api

# Instalar dependencias
npm install

# Configurar Serverless Framework (si no está instalado)
npm install -g serverless
```

## 🚀 Desarrollo Local

```bash
# Ejecutar en modo offline
npm run offline

# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage de tests
npm run test:coverage

# Linting
npm run lint
npm run lint:fix
```

## 📱 Endpoints

### GET /fusionados
Obtiene datos fusionados de Star Wars y meteorológicos.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "character": {
      "name": "Luke Skywalker",
      "height": "172 cm",
      "mass": "77 kg",
      "birth_year": "19BBY",
      "gender": "male",
      "homeworld": "https://swapi.info/api/planets/1",
      "url": "https://swapi.info/api/people/1"
    },
    "planet": {
      "name": "Tatooine",
      "diameter": "10,465 km",
      "climate": "arid",
      "terrain": "desert",
      "population": "200,000",
      "url": "https://swapi.info/api/planets/1"
    },
    "weather": {
      "temperature": 25.5,
      "windSpeed": 10.2,
      "humidity": 45,
      "time": "2024-01-01T12:00:00Z"
    },
    "fusedAt": "2024-01-01T12:00:00Z"
  },
  "message": "Datos fusionados obtenidos exitosamente"
}
```

### POST /almacenar
Almacena datos personalizados.

**Cuerpo de la solicitud:**
```json
{
  "title": "Mi configuración",
  "description": "Configuración personalizada",
  "data": {
    "theme": "dark",
    "language": "es"
  }
}
```

### GET /historial
Obtiene el historial paginado de datos almacenados.

**Parámetros de consulta:**
- `page`: Número de página (por defecto: 1)
- `limit`: Elementos por página (por defecto: 10, máximo: 100)

### GET /api-docs
Documentación Swagger interactiva.

## 🏗 Arquitectura

```
src/
├── handlers/           # Controladores Lambda
├── application/        # Casos de uso e interfaces
│   ├── usecases/      # Lógica de aplicación
│   └── interfaces/    # Contratos/Puertos
├── domain/            # Lógica de negocio
│   ├── entities/      # Entidades del dominio
│   └── services/      # Servicios del dominio
├── adapters/          # Implementaciones de infraestructura
│   ├── external/      # APIs externas
│   └── repositories/  # Almacenamiento de datos
└── test/              # Configuración de pruebas
```

## ☁️ Despliegue

```bash
# Despliegue en desarrollo
npm run deploy:dev

# Despliegue en producción
npm run deploy:prod

# Despliegue general
npm run deploy
```

## 🧪 Testing

El proyecto incluye pruebas unitarias para:
- Servicios externos (SWAPI, OpenMeteo)
- Casos de uso
- Repositorios
- Handlers

```bash
# Ejecutar todas las pruebas
npm test

# Generar reporte de cobertura
npm run test:coverage
```

## 📊 Caché

El sistema implementa caché con las siguientes características:
- **TTL**: 30 minutos para datos de APIs externas
- **Storage**: DynamoDB con TTL automático
- **Keys**: Generadas basadas en fecha y tipo de consulta

## 🔧 Configuración

### Variables de Entorno
- `DYNAMODB_TABLE`: Tabla principal de datos
- `CACHE_TABLE`: Tabla de caché
- `AWS_REGION`: Región de AWS (por defecto: us-east-1)

### Optimización de Costos AWS
- **Memory**: 512MB (optimizado para el workload)
- **Timeout**: 30 segundos
- **DynamoDB**: Pay-per-request billing
- **Lambda**: Provisioned concurrency solo si es necesario

## 🌐 APIs Externas

### Star Wars API (SWAPI)
- **Base URL**: https://swapi.info/api/
- **Endpoints utilizados**: 
  - `/people/{id}`: Información de personajes
  - `/planets/{id}`: Información de planetas

### OpenMeteo API
- **Base URL**: https://api.open-meteo.com/v1/
- **Endpoint**: `/forecast`
- **Parámetros**: latitude, longitude, current weather data

## 📚 Documentación

La documentación completa de la API está disponible en el endpoint `/api-docs` una vez desplegado el servicio.

## 🌍 API Desplegada

La API está desplegada en AWS y accesible a través de los siguientes endpoints:

### Endpoints

```
GET - https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev/fusionados
POST - https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev/almacenar
GET - https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev/historial
GET - https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev/api-docs
```

### Funciones Lambda

```
fusionados: star-wars-weather-api-dev-fusionados (24 MB)
almacenar: star-wars-weather-api-dev-almacenar (24 MB)
historial: star-wars-weather-api-dev-historial (24 MB)
swagger: star-wars-weather-api-dev-swagger (24 MB)
```

### Ejemplos con curl

#### Obtener datos fusionados
```bash
curl -X GET https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev/fusionados
```

#### Almacenar datos personalizados
```bash
curl -X POST https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev/almacenar \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi configuración",
    "description": "Configuración personalizada",
    "data": {
      "theme": "dark",
      "language": "es"
    }
  }'
```

#### Obtener historial (con paginación)
```bash
# Página por defecto (1) y límite por defecto (10)
curl -X GET https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev/historial

# Con parámetros de paginación
curl -X GET "https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev/historial?page=2&limit=20"
```

#### Acceder a la documentación Swagger
```bash
# Abrir este enlace en el navegador
https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev/api-docs
```

