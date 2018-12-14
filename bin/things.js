"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Things = exports.FailedToCreateTrial403 = exports.FailedToCreateTrial401 = exports.FailedToCreateTrial400 = exports.FailedToCreateTrial = exports.FailedToGetProduct404 = exports.FailedToGetProduct401 = exports.FailedToGetProduct = exports.InvalidValue = exports.FailedNotFound = exports.FailedCertification = void 0;

var _os = require("os");

require("./colors-set-theme");

var _functionsConfig = require("./functions-config");

var _thingsCreateTrialRequest = require("./things-create-trial-request");

var _thingsError = require("./things-error");

var _thingsGetProductRequest = require("./things-get-product-request");

const FailedCertification = `Certification failed.`.warn;
exports.FailedCertification = FailedCertification;
const FailedNotFound = `Either not found or you do not have access rights.`.warn;
exports.FailedNotFound = FailedNotFound;
const InvalidValue = `The request contains an invalid value.`.warn;
exports.InvalidValue = InvalidValue;
const FailedToGetProduct = `Failed to get product`.error;
exports.FailedToGetProduct = FailedToGetProduct;
const FailedToGetProduct401 = FailedToGetProduct + _os.EOL + FailedCertification;
exports.FailedToGetProduct401 = FailedToGetProduct401;
const FailedToGetProduct404 = FailedToGetProduct + _os.EOL + FailedNotFound;
exports.FailedToGetProduct404 = FailedToGetProduct404;
const FailedToCreateTrial = `Failed to create trial product`.error;
exports.FailedToCreateTrial = FailedToCreateTrial;
const FailedToCreateTrial400 = `Failed to create trial product`.error + _os.EOL + InvalidValue;
exports.FailedToCreateTrial400 = FailedToCreateTrial400;
const FailedToCreateTrial401 = `Failed to create trial product`.error + _os.EOL + FailedCertification;
exports.FailedToCreateTrial401 = FailedToCreateTrial401;
const FailedToCreateTrial403 = `Failed to create trial product`.error + _os.EOL + `We have already reached the maximum number of trial products (maximum of 10). Delete unnecessary trial products.`.warn;
exports.FailedToCreateTrial403 = FailedToCreateTrial403;

class Things {
  static get ErrorMessages() {
    return {
      FailedToGetProduct,
      FailedToGetProduct401,
      FailedToGetProduct404,
      FailedToCreateTrial,
      FailedToCreateTrial400,
      FailedToCreateTrial401,
      FailedToCreateTrial403
    };
  }

  constructor() {}
  /**
   * 
   * @param {string} deviceId Device ID
   */


  async getProduct(deviceId) {
    const req = new _thingsGetProductRequest.ThingsGetProductRequest({
      accessToken: _functionsConfig.FunctionsConfig.AccessToken
    });
    let res;

    try {
      res = await req.send(deviceId);
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetProduct401));
      } else if (error.response.status === 404) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetProduct404));
      } else {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetProduct));
      }
    }

    return res.data;
  }
  /**
   * 
   * @param {string} liff LIFF ID
   * @param {string} name Product name
   */


  async createTrial(liff, name) {
    const req = new _thingsCreateTrialRequest.ThingsCreateTrialRequest({
      accessToken: _functionsConfig.FunctionsConfig.AccessToken
    });
    let res;

    try {
      res = await req.send(liff, name);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToCreateTrial + _os.EOL + error.response.data.detail.warn));
      } else if (error.response.status === 400) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToCreateTrial400));
      } else if (error.response.status === 401) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToCreateTrial401));
      } else if (error.response.status === 403) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToCreateTrial403));
      } else {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToCreateTrial));
      }
    }

    return res.data;
  }

}

exports.Things = Things;
//# sourceMappingURL=things.js.map