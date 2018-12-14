"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThingsError = void 0;

class ThingsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ThingsError';
  }

}

exports.ThingsError = ThingsError;
//# sourceMappingURL=things-error.js.map