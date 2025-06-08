import axios from 'axios';
import { WeatherService } from '../../application/interfaces';

export class OpenMeteoService implements WeatherService {
  private readonly baseUrl = 'https://api.open-meteo.com/v1';

  async getCurrentWeather(latitude: number, longitude: number): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          latitude,
          longitude,
          timezone: 'auto'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error}`);
    }
  }

  // Helper method to get coordinates for Star Wars planets
  getPlanetCoordinates(planetName: string): { latitude: number; longitude: number } {
    const planetCoords: Record<string, { latitude: number; longitude: number }> = {
      'Tatooine': { latitude: 33.7490, longitude: -84.3880 }, // Desert planet - similar to Arizona
      'Alderaan': { latitude: 46.2276, longitude: 2.2137 }, // Peaceful planet - similar to France
      'Yavin IV': { latitude: -3.4653, longitude: -62.2159 }, // Jungle moon - similar to Amazon
      'Hoth': { latitude: 71.0486, longitude: -8.0752 }, // Ice planet - similar to Arctic
      'Dagobah': { latitude: 25.7617, longitude: -80.1918 }, // Swamp planet - similar to Everglades
      'Bespin': { latitude: 40.7128, longitude: -74.0060 }, // Cloud city - similar to New York
      'Endor': { latitude: 47.7511, longitude: -120.7401 }, // Forest moon - similar to Washington forests
      'Naboo': { latitude: 45.4642, longitude: 9.1900 }, // Beautiful planet - similar to Italy
      'Coruscant': { latitude: 35.6762, longitude: 139.6503 }, // City planet - similar to Tokyo
      'Kamino': { latitude: -41.2865, longitude: 174.7762 } // Ocean planet - similar to New Zealand
    };

    return planetCoords[planetName] || { latitude: 52.52, longitude: 13.41 }; // Default to Berlin
  }
}
