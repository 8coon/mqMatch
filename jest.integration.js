module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
  testMatch: [
      '**/?(*.)(test).ts?(x)',
  ],
};
