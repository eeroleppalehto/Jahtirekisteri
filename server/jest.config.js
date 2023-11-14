module.exports = {
    // Automatically clear mock calls, instances and results before every test
    // This ensures that tests do not have any side effects on each other
    clearMocks: true,

    // Specifies the Jest preset to use, 'ts-jest' is used for TypeScript
    // This helps Jest understand and work with TypeScript
    preset: 'ts-jest',

    // Specifies the environment in which the tests are executed
    // In this case, 'node' indicates a Node.js environment
    testEnvironment: 'node',

    // An array of paths to modules that run some code to configure or set up the testing environment
    // './singleton.ts' is your custom setup file which configures the mocked Prisma client
    setupFilesAfterEnv: ['./singleton.ts'],

    // Indicates whether Jest should generate coverage reports
    // When set to true, it will collect coverage information and report it
    collectCoverage: true,
};
