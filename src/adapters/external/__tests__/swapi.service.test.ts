import { SwapiService } from '../swapi.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SwapiService', () => {
  let swapiService: SwapiService;

  beforeEach(() => {
    swapiService = new SwapiService();
    jest.clearAllMocks();
  });

  describe('getCharacter', () => {
    it('should fetch character data successfully', async () => {
      const mockCharacterData = {
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.info/api/planets/1'
      };

      mockedAxios.get.mockResolvedValue({ data: mockCharacterData });

      const result = await swapiService.getCharacter(1);

      expect(mockedAxios.get).toHaveBeenCalledWith('https://swapi.info/api/people/1');
      expect(result).toEqual(mockCharacterData);
    });

    it('should throw error when API call fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(swapiService.getCharacter(1)).rejects.toThrow('Failed to fetch Star Wars character');
    });
  });

  describe('getPlanet', () => {
    it('should fetch planet data successfully', async () => {
      const mockPlanetData = {
        name: 'Tatooine',
        diameter: '10465',
        climate: 'arid',
        terrain: 'desert',
        population: '200000'
      };

      mockedAxios.get.mockResolvedValue({ data: mockPlanetData });

      const result = await swapiService.getPlanet('https://swapi.info/api/planets/1');

      expect(mockedAxios.get).toHaveBeenCalledWith('https://swapi.info/api/planets/1');
      expect(result).toEqual(mockPlanetData);
    });
  });

  describe('getRandomCharacter', () => {
    it('should fetch a random character', async () => {
      const mockCharacterData = {
        name: 'Random Character',
        height: '180',
        mass: '80'
      };

      mockedAxios.get.mockResolvedValue({ data: mockCharacterData });

      const result = await swapiService.getRandomCharacter();

      expect(mockedAxios.get).toHaveBeenCalled();
      expect(result).toEqual(mockCharacterData);
    });
  });
});
