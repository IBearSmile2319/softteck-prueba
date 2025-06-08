export interface StarWarsCharacter {
  name: string;
  height: string;
  mass: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  url: string;
}

export interface StarWarsPlanet {
  name: string;
  diameter: string;
  climate: string;
  terrain: string;
  population: string;
  url: string;
}

export interface WeatherData {
  temperature: number;
  windSpeed: number;
  humidity?: number;
  time: string;
}

export interface FusedData {
  id: string;
  character: StarWarsCharacter;
  planet: StarWarsPlanet;
  weather: WeatherData;
  fusedAt: string;
}

export interface CustomData {
  id: string;
  title: string;
  description: string;
  data: Record<string, any>;
  createdAt: string;
}

export interface HistoryRecord {
  id: string;
  type: 'fused' | 'custom';
  data: FusedData | CustomData;
  timestamp: string;
}
