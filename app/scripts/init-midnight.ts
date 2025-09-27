// scripts/init-midnight.ts
// Script to initialize the Midnight client

import { initializeMidnightClient } from '../src/lib/midnight';

async function init() {
  try {
    console.log('Initializing Midnight client...');
    const client = await initializeMidnightClient();
    console.log('Midnight client initialized successfully!');
    console.log('Client methods available:', Object.keys(client));
  } catch (error) {
    console.error('Failed to initialize Midnight client:', error);
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  init();
}

export default init;