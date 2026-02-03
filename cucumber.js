const config = {
  paths: ['features/**/*.feature'],
  import: ['features/**/*.ts'],
  format: ['summary', 'progress'],
  formatOptions: { snippetInterface: 'async-await' }
};

export default config;
