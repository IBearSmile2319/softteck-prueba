// Setup file for Jest tests
import { DynamoDB } from 'aws-sdk';

// Mock AWS SDK
jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      get: jest.fn(),
      put: jest.fn(),
      query: jest.fn(),
      scan: jest.fn()
    }))
  }
}));

// Mock axios
jest.mock('axios');

// Setup environment variables for tests
process.env.DYNAMODB_TABLE = 'test-table';
process.env.CACHE_TABLE = 'test-cache-table';
process.env.AWS_REGION = 'us-east-1';

// Global test timeout
jest.setTimeout(30000);
