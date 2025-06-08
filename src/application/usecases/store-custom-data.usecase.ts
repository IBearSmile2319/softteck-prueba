import { DataRepository } from '../interfaces';
import { CustomData } from '../../domain/entities';
import { v4 as uuidv4 } from 'uuid';

export interface StoreCustomDataRequest {
  title: string;
  description: string;
  data: Record<string, any>;
}

export class StoreCustomDataUseCase {
  constructor(private dataRepository: DataRepository) {}

  async execute(request: StoreCustomDataRequest): Promise<CustomData> {
    try {
      const customData: CustomData = {
        id: uuidv4(),
        title: request.title,
        description: request.description,
        data: request.data,
        createdAt: new Date().toISOString()
      };

      await this.dataRepository.saveCustomData(customData);
      
      return customData;
    } catch (error) {
      throw new Error(`Failed to store custom data: ${error}`);
    }
  }
}
