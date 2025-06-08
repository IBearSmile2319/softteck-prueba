import { GetFusedDataUseCase } from '../get-fused-data.usecase';
import { DataFusionService, DataRepository } from '../../interfaces';
import { FusedData } from '../../../domain/entities';

describe('GetFusedDataUseCase', () => {
  let useCase: GetFusedDataUseCase;
  let mockDataFusionService: jest.Mocked<DataFusionService>;
  let mockDataRepository: jest.Mocked<DataRepository>;

  beforeEach(() => {
    mockDataFusionService = {
      fuseStarWarsWithWeather: jest.fn()
    } as jest.Mocked<DataFusionService>;

    mockDataRepository = {
      saveFusedData: jest.fn(),
      saveCustomData: jest.fn(),
      getHistory: jest.fn()
    } as jest.Mocked<DataRepository>;

    useCase = new GetFusedDataUseCase(mockDataFusionService, mockDataRepository);
  });

  it('should successfully get and save fused data', async () => {
    const mockFusedData: FusedData = {
      id: 'test-id',
      character: {
        name: 'Luke Skywalker',
        height: '172 cm',
        mass: '77 kg',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.info/api/planets/1',
        url: 'https://swapi.info/api/people/1'
      },
      planet: {
        name: 'Tatooine',
        diameter: '10,465 km',
        climate: 'arid',
        terrain: 'desert',
        population: '200,000',
        url: 'https://swapi.info/api/planets/1'
      },
      weather: {
        temperature: 25.5,
        windSpeed: 10.2,
        humidity: 45,
        time: '2024-01-01T12:00:00Z'
      },
      fusedAt: '2024-01-01T12:00:00Z'
    };

    mockDataFusionService.fuseStarWarsWithWeather.mockResolvedValue(mockFusedData);
    mockDataRepository.saveFusedData.mockResolvedValue();

    const result = await useCase.execute();

    expect(mockDataFusionService.fuseStarWarsWithWeather).toHaveBeenCalledTimes(1);
    expect(mockDataRepository.saveFusedData).toHaveBeenCalledWith(mockFusedData);
    expect(result).toEqual(mockFusedData);
  });

  it('should throw error when fusion service fails', async () => {
    mockDataFusionService.fuseStarWarsWithWeather.mockRejectedValue(new Error('Fusion error'));

    await expect(useCase.execute()).rejects.toThrow('Failed to get fused data');
  });

  it('should throw error when repository save fails', async () => {
    const mockFusedData: FusedData = {
      id: 'test-id',
      character: {} as any,
      planet: {} as any,
      weather: {} as any,
      fusedAt: '2024-01-01T12:00:00Z'
    };

    mockDataFusionService.fuseStarWarsWithWeather.mockResolvedValue(mockFusedData);
    mockDataRepository.saveFusedData.mockRejectedValue(new Error('Save error'));

    await expect(useCase.execute()).rejects.toThrow('Failed to get fused data');
  });
});
