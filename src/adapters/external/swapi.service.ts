import axios from 'axios';
import { StarWarsService } from '../../application/interfaces';
import { StarWarsPlanet } from '../../domain/entities';

export class SwapiService implements StarWarsService {
  private readonly baseUrl = 'https://swapi.info/api';

  async getCharacter(id: number): Promise<StarWarsPlanet> {
    try {
      const response = await axios.get(`${this.baseUrl}/people/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Star Wars character: ${error}`);
    }
  }

  async getPlanet(url: string): Promise<StarWarsPlanet> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch Star Wars planet: ${error}`);
    }
  }

  async getRandomCharacter(): Promise<StarWarsPlanet> {
    // Get a random character between 1-83 (SWAPI range)
    const randomId = Math.floor(Math.random() * 83) + 1;
    return this.getCharacter(randomId);
  }
}
