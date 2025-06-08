import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const swaggerDoc = {
  openapi: '3.0.0',
  info: {
    title: 'Star Wars Weather API',
    version: '1.0.0',
    description: 'API RESTful que fusiona datos de Star Wars con información meteorológica',
    contact: {
      name: 'API Support',
      email: 'support@starwarsweather.com'
    }
  },
  servers: [
    {
      url: 'https://f90i87xne5.execute-api.us-east-1.amazonaws.com/dev',
      description: 'Production server'
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  paths: {
    '/fusionados': {
      get: {
        summary: 'Obtener datos fusionados',
        description: 'Consulta ambas APIs (Star Wars y meteorológica) y devuelve los datos fusionados. La respuesta se almacena en base de datos y se cachea por 30 minutos.',
        tags: ['Data Fusion'],
        responses: {
          '200': {
            description: 'Datos fusionados obtenidos exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      $ref: '#/components/schemas/FusedData'
                    },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Error interno del servidor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/almacenar': {
      post: {
        summary: 'Almacenar datos personalizados',
        description: 'Permite almacenar información personalizada (no relacionada con las APIs externas) en la base de datos.',
        tags: ['Data Storage'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CustomDataRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Datos almacenados exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      $ref: '#/components/schemas/CustomData'
                    },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Solicitud inválida',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Error interno del servidor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    },
    '/historial': {
      get: {
        summary: 'Obtener historial de datos',
        description: 'Retorna el historial de todas las respuestas almacenadas, ordenado cronológicamente y paginado.',
        tags: ['History'],
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Número de página (por defecto: 1)',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              default: 1
            }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Número de elementos por página (por defecto: 10, máximo: 100)',
            required: false,
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 10
            }
          }
        ],
        responses: {
          '200': {
            description: 'Historial obtenido exitosamente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/HistoryRecord'
                      }
                    },
                    pagination: {
                      $ref: '#/components/schemas/Pagination'
                    },
                    message: { type: 'string' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Parámetros de consulta inválidos',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '500': {
            description: 'Error interno del servidor',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      FusedData: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          character: { $ref: '#/components/schemas/StarWarsCharacter' },
          planet: { $ref: '#/components/schemas/StarWarsPlanet' },
          weather: { $ref: '#/components/schemas/WeatherData' },
          fusedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'character', 'planet', 'weather', 'fusedAt']
      },
      StarWarsCharacter: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          height: { type: 'string' },
          mass: { type: 'string' },
          birth_year: { type: 'string' },
          gender: { type: 'string' },
          homeworld: { type: 'string' },
          url: { type: 'string' }
        }
      },
      StarWarsPlanet: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          diameter: { type: 'string' },
          climate: { type: 'string' },
          terrain: { type: 'string' },
          population: { type: 'string' },
          url: { type: 'string' }
        }
      },
      WeatherData: {
        type: 'object',
        properties: {
          temperature: { type: 'number', description: 'Temperatura en grados Celsius' },
          windSpeed: { type: 'number', description: 'Velocidad del viento en km/h' },
          humidity: { type: 'number', description: 'Humedad relativa en %' },
          time: { type: 'string', format: 'date-time' }
        }
      },
      CustomData: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          data: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'title', 'description', 'data', 'createdAt']
      },
      CustomDataRequest: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Título de los datos personalizados' },
          description: { type: 'string', description: 'Descripción de los datos' },
          data: { type: 'object', description: 'Datos personalizados (objeto JSON)' }
        },
        required: ['title', 'description', 'data'],
        example: {
          title: 'Mi configuración personalizada',
          description: 'Configuración de usuario para la aplicación',
          data: {
            theme: 'dark',
            language: 'es',
            notifications: true
          }
        }
      },
      HistoryRecord: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['fused', 'custom'] },
          data: {
            oneOf: [
              { $ref: '#/components/schemas/FusedData' },
              { $ref: '#/components/schemas/CustomData' }
            ]
          },
          timestamp: { type: 'string', format: 'date-time' }
        }
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          hasMore: { type: 'boolean' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', default: false },
          error: { type: 'string' },
          message: { type: 'string' }
        }
      }
    }
  },
  tags: [
    {
      name: 'Data Fusion',
      description: 'Operaciones para fusionar datos de APIs externas'
    },
    {
      name: 'Data Storage',
      description: 'Operaciones para almacenar datos personalizados'
    },
    {
      name: 'History',
      description: 'Operaciones para consultar el historial de datos'
    }
  ]
};

export const handler: APIGatewayProxyHandler = async (): Promise<APIGatewayProxyResult> => {
  try {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Star Wars Weather API Documentation</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui.css" />
        <style>
          html {
            box-sizing: border-box;
            overflow: -moz-scrollbars-vertical;
            overflow-y: scroll;
          }
          *, *:before, *:after {
            box-sizing: inherit;
          }
          body {
            margin:0;
            background: #fafafa;
          }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui-bundle.js"></script>
        <script src="https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui-standalone-preset.js"></script>
        <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerDoc)},
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
        };
        </script>
      </body>
    </html>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*'
      },
      body: html
    };

  } catch (error) {
    console.error('Error in swagger handler:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
        message: 'Error al generar la documentación'
      })
    };
  }
};
