import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Context type definition for the application
// This context is used to pass around Prisma client instances in the application
export type Context = {
  prisma: PrismaClient // Prisma client instance for interacting with the database
};

// MockContext type definition for testing
// This context is used in tests to provide a mock Prisma client
export type MockContext = {
  prisma: DeepMockProxy<PrismaClient> // Mocked Prisma client instance
};

// Function to create a mock context
// This function initializes a mock Prisma client and returns a MockContext object
export const createMockContext = (): MockContext => {
    return {
        prisma: mockDeep<PrismaClient>(), // Initialize a deep mock of PrismaClient
    };
};
