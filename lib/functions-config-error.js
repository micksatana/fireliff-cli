export class FunctionsConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FunctionsConfigError';
  }
}
