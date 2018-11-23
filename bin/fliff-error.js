"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FLIFFError = void 0;

class FLIFFError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FLIFFError';
  }

}

exports.FLIFFError = FLIFFError;
//# sourceMappingURL=fliff-error.js.map