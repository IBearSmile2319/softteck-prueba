import { DynamoDB } from 'aws-sdk';
import { DataRepository } from '../../application/interfaces';
import { FusedData, CustomData, HistoryRecord } from '../../domain/entities';

export class DynamoDataRepository implements DataRepository {
  private dynamodb: DynamoDB.DocumentClient;
  private tableName: string;

  constructor() {
    this.dynamodb = new DynamoDB.DocumentClient();
    this.tableName = process.env.DYNAMODB_TABLE || 'star-wars-weather-api-dev';
  }

  async saveFusedData(data: FusedData): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        id: data.id,
        timestamp: data.fusedAt,
        type: 'fused',
        data: data,
        ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year TTL
      }
    };

    try {
      await this.dynamodb.put(params).promise();
    } catch (error) {
      throw new Error(`Failed to save fused data: ${error}`);
    }
  }

  async saveCustomData(data: CustomData): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        id: data.id,
        timestamp: data.createdAt,
        type: 'custom',
        data: data,
        ttl: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year TTL
      }
    };

    try {
      await this.dynamodb.put(params).promise();
    } catch (error) {
      throw new Error(`Failed to save custom data: ${error}`);
    }
  }

  async getHistory(page: number = 1, limit: number = 10): Promise<HistoryRecord[]> {
    // For pagination, we'll need to scan the table and handle pagination manually
    // In a production environment, you might want to implement a more efficient approach
    
    const allItems: any[] = [];
    let lastEvaluatedKey: any = undefined;
    let scanCount = 0;
    const maxScans = 10; // Prevent infinite loops
    
    do {
      const params: DynamoDB.DocumentClient.ScanInput = {
        TableName: this.tableName,
        FilterExpression: '#type IN (:fusedType, :customType)',
        ExpressionAttributeNames: {
          '#type': 'type'
        },
        ExpressionAttributeValues: {
          ':fusedType': 'fused',
          ':customType': 'custom'
        },
        ExclusiveStartKey: lastEvaluatedKey
      };

      try {
        const result = await this.dynamodb.scan(params).promise();
        
        if (result.Items) {
          allItems.push(...result.Items);
        }
        
        lastEvaluatedKey = result.LastEvaluatedKey;
        scanCount++;
      } catch (error) {
        throw new Error(`Failed to get history: ${error}`);
      }
    } while (lastEvaluatedKey && scanCount < maxScans);

    // Sort by timestamp in descending order (newest first)
    const sortedItems = allItems.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = sortedItems.slice(startIndex, endIndex);

    return paginatedItems.map(item => ({
      id: item.id,
      type: item.type,
      data: item.data,
      timestamp: item.timestamp
    }));
  }
}
