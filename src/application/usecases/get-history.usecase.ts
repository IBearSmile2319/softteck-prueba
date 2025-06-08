import { DataRepository } from '../interfaces';
import { HistoryRecord } from '../../domain/entities';

export interface GetHistoryRequest {
  page?: number;
  limit?: number;
}

export interface GetHistoryResponse {
  data: HistoryRecord[];
  pagination: {
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export class GetHistoryUseCase {
  constructor(private dataRepository: DataRepository) {}

  async execute(request: GetHistoryRequest = {}): Promise<GetHistoryResponse> {
    try {
      const page = request.page || 1;
      const limit = request.limit || 10;

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        throw new Error('Parámetros de paginación inválidos');
      }

      const data = await this.dataRepository.getHistory(page, limit);
      
      return {
        data,
        pagination: {
          page,
          limit,
          hasMore: data.length === limit // Simple check for more data
        }
      };
    } catch (error) {
      throw new Error(`Failed to get history: ${error}`);
    }
  }
}
