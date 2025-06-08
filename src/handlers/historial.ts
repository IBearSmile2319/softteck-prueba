import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { GetHistoryUseCase, GetHistoryRequest } from '../application/usecases/get-history.usecase';
import { DynamoDataRepository } from '../adapters/repositories/dynamo-data.repository';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const page = queryParams.page ? parseInt(queryParams.page) : 1;
    const limit = queryParams.limit ? parseInt(queryParams.limit) : 10;

    // Validate query parameters
    if (isNaN(page) || page < 1) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Parámetro de página inválido',
          message: 'El parámetro "page" debe ser un número entero mayor a 0'
        })
      };
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Parámetro de límite inválido',
          message: 'El parámetro "limit" debe ser un número entero entre 1 y 100'
        })
      };
    }

    const request: GetHistoryRequest = { page, limit };

    // Dependency injection
    const dataRepository = new DynamoDataRepository();
    const getHistoryUseCase = new GetHistoryUseCase(dataRepository);

    // Execute use case
    const result = await getHistoryUseCase.execute(request);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: JSON.stringify({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: 'Historial obtenido exitosamente'
      })
    };

  } catch (error) {
    console.error('Error in historial handler:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        message: 'Error al obtener el historial'
      })
    };
  }
};
