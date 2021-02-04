export class ThingsError extends Error {
  constructor(message, response) {
    super(message);
    this.name = 'ThingsError';
    this.response = response;
  }
}
