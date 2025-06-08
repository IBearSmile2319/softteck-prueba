import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { StoreCustomDataUseCase, StoreCustomDataRequest } from '../application/usecases/store-custom-data.usecase';
import { DynamoDataRepository } from '../adapters/repositories/dynamo-data.repository';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Método no permitido',
          message: 'Solo se permite el método POST'
        })
      };
    }

    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Cuerpo de solicitud requerido',
          message: 'Debe proporcionar datos en el cuerpo de la solicitud'
        })
      };
    }

    let requestData: StoreCustomDataRequest;
    try {
      requestData = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'JSON inválido',
          message: 'El cuerpo de la solicitud debe ser un JSON válido'
        })
      };
    }

    // Validate required fields
    if (!requestData.title || !requestData.description || !requestData.data) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          error: 'Campos requeridos faltantes',
          message: 'Se requieren los campos: title, description, data'
        })
      };
    }

    // Dependency injection
    const dataRepository = new DynamoDataRepository();
    const storeCustomDataUseCase = new StoreCustomDataUseCase(dataRepository);

    // Execute use case
    const result = await storeCustomDataUseCase.execute(requestData);

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      },
      body: JSON.stringify({
        success: true,
        data: result,
        message: 'Datos personalizados almacenados exitosamente'
      })
    };

  } catch (error) {
    console.error('Error in almacenar handler:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        message: 'Error al almacenar datos personalizados'
      })
    };
  }
};
