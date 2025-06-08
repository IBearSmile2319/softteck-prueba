import { DynamoDB } from 'aws-sdk';
import { CacheRepository } from '../../application/interfaces';

export class DynamoCacheRepository implements CacheRepository {
  private dynamodb: DynamoDB.DocumentClient;
  private tableName: string;

  constructor() {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.tableName = process.env.CACHE_TABLE || 'star-wars-weather-api-cache-dev';
  }

  async get<T>(key: string): Promise<T | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        cacheKey: key
      }
    };

    try {
      const result = await this.dynamodb.get(params).promise();
      
      if (!result.Item) {
        return null;
      }

      // Check if item has expired (additional safety check)
      const now = Math.floor(Date.now() / 1000);
      if (result.Item.ttl && result.Item.ttl < now) {
        return null;
      }

      return result.Item.data as T;
    } catch (error) {
      console.error(`Failed to get cache item: ${error}`);
      return null;
    }
  }

  /**
   * Stores a value in the DynamoDB cache with the specified TTL
   * El valor predeterminado para el TTL en data-fusion.service.ts es de 30 minutos
   * para las consultas de las APIs externas (SWAPI y OpenMeteo)
   * @param key - The cache key
   * @param value - The value to cache
   * @param ttlMinutes - Time to live in minutes (default: 30 minutes in DataFusionService)
   */
  async set<T>(key: string, value: T, ttlMinutes: number): Promise<void> {
    const ttl = Math.floor(Date.now() / 1000) + (ttlMinutes * 60);
    
    const params = {
      TableName: this.tableName,
      Item: {
        cacheKey: key,
        data: value,
        ttl: ttl,
        createdAt: new Date().toISOString()
      }
    };

    try {
      await this.dynamodb.put(params).promise();
    } catch (error) {
      console.error(`Failed to set cache item: ${error}`);
      throw new Error(`Failed to cache data: ${error}`);
    }
  }

  generateKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(':')}`;
  }
}
