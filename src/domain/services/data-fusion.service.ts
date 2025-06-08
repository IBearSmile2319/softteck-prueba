import { DataFusionService, StarWarsService, WeatherService, CacheRepository } from '../../application/interfaces';
import { FusedData, StarWarsCharacter, StarWarsPlanet, WeatherData } from '../entities';
import { v4 as uuidv4 } from 'uuid';

export class DataFusionDomainService implements DataFusionService {
  constructor(
    private starWarsService: StarWarsService,
    private weatherService: WeatherService,
    private cacheRepository: CacheRepository
  ) {}

  async fuseStarWarsWithWeather(): Promise<FusedData> {
    const cacheKey = (this.cacheRepository as any).generateKey('fusion', 'random', new Date().toDateString());
    
    // Check cache first
    const cachedData = await this.cacheRepository.get<FusedData>(cacheKey);
    if (cachedData) {
      console.log('Returning cached data:', cachedData);
      return cachedData;
    }

    try {
      // Get random Star Wars character
      const characterData = await this.starWarsService.getRandomCharacter();
      
      // Get planet information
      const planetData = await this.starWarsService.getPlanet(characterData.homeworld);
      
      // Get weather coordinates for the planet
      const coordinates = this.getPlanetCoordinates(planetData.name);
      
      // Get weather data
      const weatherData = await this.weatherService.getCurrentWeather(
        coordinates.latitude, 
        coordinates.longitude
      );

      // Normalize and fuse the data
      const fusedData: FusedData = {
        id: uuidv4(),
        character: this.normalizeCharacter(characterData),
        planet: this.normalizePlanet(planetData),
        weather: this.normalizeWeather(weatherData),
        fusedAt: new Date().toISOString()
      };

      // Cache the result for 30 minutes
      await this.cacheRepository.set(cacheKey, fusedData, 30);

      return fusedData;
    } catch (error) {
      throw new Error(`Failed to fuse data: ${error}`);
    }
  }

  private normalizeCharacter(data: any): StarWarsCharacter {
    return {
      name: data.name || 'Unknown',
      height: this.normalizeHeight(data.height),
      mass: this.normalizeMass(data.mass),
      birth_year: data.birth_year || 'Unknown',
      gender: data.gender || 'Unknown',
      homeworld: data.homeworld || 'Unknown',
      url: data.url || ''
    };
  }

  private normalizePlanet(data: any): StarWarsPlanet {
    return {
      name: data.name || 'Unknown',
      diameter: this.normalizeDiameter(data.diameter),
      climate: data.climate || 'Unknown',
      terrain: data.terrain || 'Unknown',
      population: this.normalizePopulation(data.population),
      url: data.url || ''
    };
  }

  private normalizeWeather(data: any): WeatherData {
    const current = data.current || {};
    return {
      temperature: this.normalizeTemperature(current.temperature_2m),
      windSpeed: this.normalizeWindSpeed(current.wind_speed_10m),
      humidity: current.relative_humidity_2m || undefined,
      time: current.time || new Date().toISOString()
    };
  }

  private normalizeHeight(height: string): string {
    if (!height || height === 'unknown') return 'Unknown';
    const heightNum = parseInt(height);
    if (isNaN(heightNum)) return height;
    return `${heightNum} cm`;
  }

  private normalizeMass(mass: string): string {
    if (!mass || mass === 'unknown') return 'Unknown';
    const massNum = parseFloat(mass.replace(',', ''));
    if (isNaN(massNum)) return mass;
    return `${massNum} kg`;
  }

  private normalizeDiameter(diameter: string): string {
    if (!diameter || diameter === 'unknown') return 'Unknown';
    const diameterNum = parseInt(diameter.replace(',', ''));
    if (isNaN(diameterNum)) return diameter;
    return `${diameterNum.toLocaleString()} km`;
  }

  private normalizePopulation(population: string): string {
    if (!population || population === 'unknown') return 'Unknown';
    const popNum = parseInt(population.replace(',', ''));
    if (isNaN(popNum)) return population;
    return popNum.toLocaleString();
  }

  private normalizeTemperature(temp: number): number {
    return Math.round((temp || 0) * 10) / 10; // Round to 1 decimal place
  }

  private normalizeWindSpeed(speed: number): number {
    return Math.round((speed || 0) * 10) / 10; // Round to 1 decimal place
  }

  private getPlanetCoordinates(planetName: string): { latitude: number; longitude: number } {
    const planetCoords: Record<string, { latitude: number; longitude: number }> = {
      'Tatooine': { latitude: 33.7490, longitude: -84.3880 },
      'Alderaan': { latitude: 46.2276, longitude: 2.2137 },
      'Yavin IV': { latitude: -3.4653, longitude: -62.2159 },
      'Hoth': { latitude: 71.0486, longitude: -8.0752 },
      'Dagobah': { latitude: 25.7617, longitude: -80.1918 },
      'Bespin': { latitude: 40.7128, longitude: -74.0060 },
      'Endor': { latitude: 47.7511, longitude: -120.7401 },
      'Naboo': { latitude: 45.4642, longitude: 9.1900 },
      'Coruscant': { latitude: 35.6762, longitude: 139.6503 },
      'Kamino': { latitude: -41.2865, longitude: 174.7762 }
    };

    return planetCoords[planetName] || { latitude: 52.52, longitude: 13.41 };
  }
}
