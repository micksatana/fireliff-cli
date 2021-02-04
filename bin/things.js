"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Things = exports.FailedToGetTrialProducts404 = exports.FailedToGetTrialProducts401 = exports.FailedToGetTrialProducts = exports.FailedToGetProduct404 = exports.FailedToGetProduct401 = exports.FailedToGetProduct = exports.FailedToGetDevicesByProductUser404 = exports.FailedToGetDevicesByProductUser401 = exports.FailedToGetDevicesByProductUser = exports.FailedToGetDeviceByDeviceUser404 = exports.FailedToGetDeviceByDeviceUser401 = exports.FailedToGetDeviceByDeviceUser = exports.FailedToDeleteTrialProduct404 = exports.FailedToDeleteTrialProduct401 = exports.FailedToDeleteTrialProduct = exports.FailedToCreateTrial403 = exports.FailedToCreateTrial401 = exports.FailedToCreateTrial400 = exports.FailedToCreateTrial = exports.InvalidValue = exports.FailedNotFound = exports.FailedCertification = void 0;

var _os = require("os");

require("./colors-set-theme");

var _functionsConfig = require("./functions-config");

var _thingsCreateTrialRequest = require("./things-create-trial-request");

var _thingsError = require("./things-error");

var _thingsGetDeviceByDeviceUserRequest = require("./things-get-device-by-device-user-request");

var _thingsGetDevicesByProductUserRequest = require("./things-get-devices-by-product-user-request");

var _thingsGetProductRequest = require("./things-get-product-request");

var _thingsGetTrialProductsRequest = require("./things-get-trial-products-request");

var _thingsDeleteTrialProductRequest = require("./things-delete-trial-product-request");

const FailedCertification = `Certification failed.`.warn;
exports.FailedCertification = FailedCertification;
const FailedNotFound = `Either not found or you do not have access rights.`.warn;
exports.FailedNotFound = FailedNotFound;
const InvalidValue = `The request contains an invalid value.`.warn;
exports.InvalidValue = InvalidValue;
const FailedToCreateTrial = `Failed to create trial product`.error;
exports.FailedToCreateTrial = FailedToCreateTrial;
const FailedToCreateTrial400 = `Failed to create trial product`.error + _os.EOL + InvalidValue;
exports.FailedToCreateTrial400 = FailedToCreateTrial400;
const FailedToCreateTrial401 = `Failed to create trial product`.error + _os.EOL + FailedCertification;
exports.FailedToCreateTrial401 = FailedToCreateTrial401;
const FailedToCreateTrial403 = `Failed to create trial product`.error + _os.EOL + `We have already reached the maximum number of trial products (maximum of 10). Delete unnecessary trial products.`.warn;
exports.FailedToCreateTrial403 = FailedToCreateTrial403;
const FailedToDeleteTrialProduct = `Failed to delete trial product`.error;
exports.FailedToDeleteTrialProduct = FailedToDeleteTrialProduct;
const FailedToDeleteTrialProduct401 = FailedToDeleteTrialProduct + _os.EOL + FailedCertification;
exports.FailedToDeleteTrialProduct401 = FailedToDeleteTrialProduct401;
const FailedToDeleteTrialProduct404 = FailedToDeleteTrialProduct + _os.EOL + FailedNotFound;
exports.FailedToDeleteTrialProduct404 = FailedToDeleteTrialProduct404;
const FailedToGetDeviceByDeviceUser = `Failed to get device information by device user`.error;
exports.FailedToGetDeviceByDeviceUser = FailedToGetDeviceByDeviceUser;
const FailedToGetDeviceByDeviceUser401 = FailedToGetDeviceByDeviceUser + _os.EOL + FailedCertification;
exports.FailedToGetDeviceByDeviceUser401 = FailedToGetDeviceByDeviceUser401;
const FailedToGetDeviceByDeviceUser404 = FailedToGetDeviceByDeviceUser + _os.EOL + FailedNotFound;
exports.FailedToGetDeviceByDeviceUser404 = FailedToGetDeviceByDeviceUser404;
const FailedToGetDevicesByProductUser = `Failed to get devices information by product user`.error;
exports.FailedToGetDevicesByProductUser = FailedToGetDevicesByProductUser;
const FailedToGetDevicesByProductUser401 = FailedToGetDevicesByProductUser + _os.EOL + FailedCertification;
exports.FailedToGetDevicesByProductUser401 = FailedToGetDevicesByProductUser401;
const FailedToGetDevicesByProductUser404 = FailedToGetDevicesByProductUser + _os.EOL + FailedNotFound;
exports.FailedToGetDevicesByProductUser404 = FailedToGetDevicesByProductUser404;
const FailedToGetProduct = `Failed to get product`.error;
exports.FailedToGetProduct = FailedToGetProduct;
const FailedToGetProduct401 = FailedToGetProduct + _os.EOL + FailedCertification;
exports.FailedToGetProduct401 = FailedToGetProduct401;
const FailedToGetProduct404 = FailedToGetProduct + _os.EOL + FailedNotFound;
exports.FailedToGetProduct404 = FailedToGetProduct404;
const FailedToGetTrialProducts = `Failed to get trial information`.error;
exports.FailedToGetTrialProducts = FailedToGetTrialProducts;
const FailedToGetTrialProducts401 = FailedToGetTrialProducts + _os.EOL + FailedCertification;
exports.FailedToGetTrialProducts401 = FailedToGetTrialProducts401;
const FailedToGetTrialProducts404 = FailedToGetTrialProducts + _os.EOL + FailedNotFound;
exports.FailedToGetTrialProducts404 = FailedToGetTrialProducts404;

class Things {
  static get ErrorMessages() {
    return {
      FailedToCreateTrial,
      FailedToCreateTrial400,
      FailedToCreateTrial401,
      FailedToCreateTrial403,
      FailedToDeleteTrialProduct,
      FailedToDeleteTrialProduct401,
      FailedToDeleteTrialProduct404,
      FailedToGetProduct,
      FailedToGetProduct401,
      FailedToGetProduct404,
      FailedToGetDeviceByDeviceUser,
      FailedToGetDeviceByDeviceUser401,
      FailedToGetDeviceByDeviceUser404,
      FailedToGetDevicesByProductUser,
      FailedToGetDevicesByProductUser401,
      FailedToGetDevicesByProductUser404,
      FailedToGetTrialProducts,
      FailedToGetTrialProducts401,
      FailedToGetTrialProducts404
    };
  }

  constructor() {}
  /**
   *
   * @param {string} liff LIFF ID
   * @param {string} name Product name
   */


  async createTrialProduct(liff, name) {
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
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToCreateTrial400, error.response));
      } else if (error.response.status === 401) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToCreateTrial401, error.response));
      } else if (error.response.status === 403) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToCreateTrial403, error.response));
      } else {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToCreateTrial, error.response));
      }
    }

    return res.data;
  }
  /**
   *
   * @param {string} productId Product ID
   */


  async deleteTrialProduct(productId) {
    const req = new _thingsDeleteTrialProductRequest.ThingsDeleteTrialProductRequest({
      accessToken: _functionsConfig.FunctionsConfig.AccessToken
    });
    let res;

    try {
      res = await req.send(productId);
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToDeleteTrialProduct401, error.response));
      } else if (error.response.status === 404) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToDeleteTrialProduct404, error.response));
      } else {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToDeleteTrialProduct, error.response));
      }
    }

    return res.data;
  }
  /**
   *
   * @param {string} deviceId Device ID
   * @param {string} userId User ID
   */


  async getDeviceByDeviceUser(deviceId, userId) {
    const req = new _thingsGetDeviceByDeviceUserRequest.ThingsGetDeviceByDeviceUserRequest({
      accessToken: _functionsConfig.FunctionsConfig.AccessToken
    });
    let res;

    try {
      res = await req.send(deviceId, userId);
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetDeviceByDeviceUser401, error.response));
      } else if (error.response.status === 404) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetDeviceByDeviceUser404, error.response));
      } else {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetDeviceByDeviceUser, error.response));
      }
    }

    return res.data;
  }
  /**
   *
   * @param {string} productId Product ID
   * @param {string} userId User ID
   */


  async getDevicesByProductUser(productId, userId) {
    const req = new _thingsGetDevicesByProductUserRequest.ThingsGetDevicesByProductUserRequest({
      accessToken: _functionsConfig.FunctionsConfig.AccessToken
    });
    let res;

    try {
      res = await req.send(productId, userId);
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetDevicesByProductUser401, error.response));
      } else if (error.response.status === 404) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetDevicesByProductUser404, error.response));
      } else {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetDevicesByProductUser, error.response));
      }
    }

    return res.data;
  }
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
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetProduct401, error.response));
      } else if (error.response.status === 404) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetProduct404, error.response));
      } else {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetProduct, error.response));
      }
    }

    return res.data;
  }

  async getTrialProducts() {
    const req = new _thingsGetTrialProductsRequest.ThingsGetTrialProductsRequest({
      accessToken: _functionsConfig.FunctionsConfig.AccessToken
    });
    let res;

    try {
      res = await req.send();
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetTrialProducts401, error.response));
      } else if (error.response.status === 404) {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetTrialProducts404, error.response));
      } else {
        return Promise.reject(new _thingsError.ThingsError(Things.ErrorMessages.FailedToGetTrialProducts, error.response));
      }
    }

    return res.data;
  }

}

exports.Things = Things;
//# sourceMappingURL=things.js.map