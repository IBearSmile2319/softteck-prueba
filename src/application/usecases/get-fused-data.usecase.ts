import { DataFusionService, DataRepository } from '../interfaces';
import { FusedData } from '../../domain/entities';

export class GetFusedDataUseCase {
  constructor(
    private dataFusionService: DataFusionService,
    private dataRepository: DataRepository
  ) {}

  async execute(): Promise<FusedData> {
    try {
      // Get fused data from external APIs
      const fusedData = await this.dataFusionService.fuseStarWarsWithWeather();
      
      // Store in database for history
      await this.dataRepository.saveFusedData(fusedData);
      
      return fusedData;
    } catch (error) {
      throw new Error(`Failed to get fused data: ${error}`);
    }
  }
}
