module.exports = {
  testEnvironment: 'node',
  setupFiles: ['./setupEnv.js'],
  globals: {
    API_KEY: process.env.API_KEY || 'your-default-api-key'
  }
};