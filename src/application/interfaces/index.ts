import { FusedData, CustomData, HistoryRecord } from '../../domain/entities';

export interface DataRepository {
  saveFusedData(data: FusedData): Promise<void>;
  saveCustomData(data: CustomData): Promise<void>;
  getHistory(page: number, limit: number): Promise<HistoryRecord[]>;
}

export interface CacheRepository {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMinutes: number): Promise<void>;
}

export interface StarWarsService {
  getCharacter(id: number): Promise<any>;
  getPlanet(url: string): Promise<any>;
  getRandomCharacter(): Promise<any>;
}

export interface WeatherService {
  getCurrentWeather(latitude: number, longitude: number): Promise<any>;
}

export interface DataFusionService {
  fuseStarWarsWithWeather(): Promise<FusedData>;
}
