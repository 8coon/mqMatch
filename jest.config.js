module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
  ],
  testMatch: [
      '**/?(*.)(spec).ts?(x)',
  ],
};
