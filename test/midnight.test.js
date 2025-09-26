import { getTestEnvironment } from '@midnight-ntwrk/midnight-js-testing';

beforeAll(async () => {
testEnvironment = getTestEnvironment(logger);
environmentConfiguration = await testEnvironment.start();
walletProvider = await testEnvironment.getMidnightWalletProvider();
});

afterAll(async () => {
await testEnvironment.shutdown();
});