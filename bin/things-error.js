"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThingsError = void 0;

class ThingsError extends Error {
  constructor(message, response) {
    super(message);
    this.name = 'ThingsError';
    this.response = response;
  }

}

exports.ThingsError = ThingsError;
//# sourceMappingURL=things-error.js.map