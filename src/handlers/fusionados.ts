import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { GetFusedDataUseCase } from '../application/usecases/get-fused-data.usecase';
import { DataFusionDomainService } from '../domain/services/data-fusion.service';
import { SwapiService } from '../adapters/external/swapi.service';
import { OpenMeteoService } from '../adapters/external/openmeteo.service';
import { DynamoDataRepository } from '../adapters/repositories/dynamo-data.repository';
import { DynamoCacheRepository } from '../adapters/repositories/dynamo-cache.repository';

export const handler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  try {
    // Dependency injection
    const swapiService = new SwapiService();
    const weatherService = new OpenMeteoService();
    const cacheRepository = new DynamoCacheRepository();
    const dataRepository = new DynamoDataRepository();
    
    const dataFusionService = new DataFusionDomainService(
      swapiService,
      weatherService,
      cacheRepository
    );
    
    const getFusedDataUseCase = new GetFusedDataUseCase(
      dataFusionService,
      dataRepository
    );

    // Execute use case
    const result = await getFusedDataUseCase.execute();

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
        data: result,
        message: 'Datos fusionados obtenidos exitosamente'
      })
    };

  } catch (error) {
    console.error('Error in fusionados handler:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Error interno del servidor',
        message: 'Error al obtener datos fusionados'
      })
    };
  }
};
