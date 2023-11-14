import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Mock the Prisma client module
// This replaces the actual PrismaClient with a deep mock, allowing for detailed test control
jest.mock('./client', () => ({
    __esModule: true,
    // Use mockDeep to create a deep mock of PrismaClient, which includes all methods and properties
    default: mockDeep<PrismaClient>(),
}));

// Import the mocked version of the Prisma client
import prisma from "./client";

// Before each test, reset all mocks to their initial state
// This ensures that each test starts with a clean slate, without any leftover state from previous tests
beforeEach(() => {
    mockReset(prismaMock);
});

// Export the mocked Prisma client as a DeepMockProxy type
// This allows the use of extended mocking features provided by jest-mock-extended
export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
