import { EOL } from 'os';
import './colors-set-theme';
import { FunctionsConfig } from './functions-config';
import { ThingsCreateTrialRequest } from './things-create-trial-request';
import { ThingsError } from './things-error';
import { ThingsGetDeviceByDeviceUserRequest } from './things-get-device-by-device-user-request';
import { ThingsGetDevicesByProductUserRequest } from './things-get-devices-by-product-user-request';
import { ThingsGetProductRequest } from './things-get-product-request';
import { ThingsGetTrialProductsRequest } from './things-get-trial-products-request';
import { ThingsDeleteTrialProductRequest } from './things-delete-trial-product-request';

export const FailedCertification = `Certification failed.`.warn;
export const FailedNotFound = `Either not found or you do not have access rights.`
  .warn;
export const InvalidValue = `The request contains an invalid value.`.warn;

export const FailedToCreateTrial = `Failed to create trial product`.error;
export const FailedToCreateTrial400 =
  `Failed to create trial product`.error + EOL + InvalidValue;
export const FailedToCreateTrial401 =
  `Failed to create trial product`.error + EOL + FailedCertification;
export const FailedToCreateTrial403 =
  `Failed to create trial product`.error +
  EOL +
  `We have already reached the maximum number of trial products (maximum of 10). Delete unnecessary trial products.`
    .warn;

export const FailedToDeleteTrialProduct = `Failed to delete trial product`
  .error;
export const FailedToDeleteTrialProduct401 =
  FailedToDeleteTrialProduct + EOL + FailedCertification;
export const FailedToDeleteTrialProduct404 =
  FailedToDeleteTrialProduct + EOL + FailedNotFound;

export const FailedToGetDeviceByDeviceUser = `Failed to get device information by device user`
  .error;
export const FailedToGetDeviceByDeviceUser401 =
  FailedToGetDeviceByDeviceUser + EOL + FailedCertification;
export const FailedToGetDeviceByDeviceUser404 =
  FailedToGetDeviceByDeviceUser + EOL + FailedNotFound;

export const FailedToGetDevicesByProductUser = `Failed to get devices information by product user`
  .error;
export const FailedToGetDevicesByProductUser401 =
  FailedToGetDevicesByProductUser + EOL + FailedCertification;
export const FailedToGetDevicesByProductUser404 =
  FailedToGetDevicesByProductUser + EOL + FailedNotFound;

export const FailedToGetProduct = `Failed to get product`.error;
export const FailedToGetProduct401 =
  FailedToGetProduct + EOL + FailedCertification;
export const FailedToGetProduct404 = FailedToGetProduct + EOL + FailedNotFound;

export const FailedToGetTrialProducts = `Failed to get trial information`.error;
export const FailedToGetTrialProducts401 =
  FailedToGetTrialProducts + EOL + FailedCertification;
export const FailedToGetTrialProducts404 =
  FailedToGetTrialProducts + EOL + FailedNotFound;

export class Things {
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
      FailedToGetTrialProducts404,
    };
  }

  constructor() {}

  /**
   *
   * @param {string} liff LIFF ID
   * @param {string} name Product name
   */
  async createTrialProduct(liff, name) {
    const req = new ThingsCreateTrialRequest({
      accessToken: FunctionsConfig.AccessToken,
    });
    let res;

    try {
      res = await req.send(liff, name);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToCreateTrial +
              EOL +
              error.response.data.detail.warn
          )
        );
      } else if (error.response.status === 400) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToCreateTrial400,
            error.response
          )
        );
      } else if (error.response.status === 401) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToCreateTrial401,
            error.response
          )
        );
      } else if (error.response.status === 403) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToCreateTrial403,
            error.response
          )
        );
      } else {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToCreateTrial,
            error.response
          )
        );
      }
    }

    return res.data;
  }

  /**
   *
   * @param {string} productId Product ID
   */
  async deleteTrialProduct(productId) {
    const req = new ThingsDeleteTrialProductRequest({
      accessToken: FunctionsConfig.AccessToken,
    });
    let res;

    try {
      res = await req.send(productId);
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToDeleteTrialProduct401,
            error.response
          )
        );
      } else if (error.response.status === 404) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToDeleteTrialProduct404,
            error.response
          )
        );
      } else {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToDeleteTrialProduct,
            error.response
          )
        );
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
    const req = new ThingsGetDeviceByDeviceUserRequest({
      accessToken: FunctionsConfig.AccessToken,
    });
    let res;

    try {
      res = await req.send(deviceId, userId);
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetDeviceByDeviceUser401,
            error.response
          )
        );
      } else if (error.response.status === 404) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetDeviceByDeviceUser404,
            error.response
          )
        );
      } else {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetDeviceByDeviceUser,
            error.response
          )
        );
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
    const req = new ThingsGetDevicesByProductUserRequest({
      accessToken: FunctionsConfig.AccessToken,
    });
    let res;

    try {
      res = await req.send(productId, userId);
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetDevicesByProductUser401,
            error.response
          )
        );
      } else if (error.response.status === 404) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetDevicesByProductUser404,
            error.response
          )
        );
      } else {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetDevicesByProductUser,
            error.response
          )
        );
      }
    }

    return res.data;
  }

  /**
   *
   * @param {string} deviceId Device ID
   */
  async getProduct(deviceId) {
    const req = new ThingsGetProductRequest({
      accessToken: FunctionsConfig.AccessToken,
    });
    let res;

    try {
      res = await req.send(deviceId);
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetProduct401,
            error.response
          )
        );
      } else if (error.response.status === 404) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetProduct404,
            error.response
          )
        );
      } else {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetProduct,
            error.response
          )
        );
      }
    }

    return res.data;
  }

  async getTrialProducts() {
    const req = new ThingsGetTrialProductsRequest({
      accessToken: FunctionsConfig.AccessToken,
    });
    let res;

    try {
      res = await req.send();
    } catch (error) {
      if (error.response.status === 401) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetTrialProducts401,
            error.response
          )
        );
      } else if (error.response.status === 404) {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetTrialProducts404,
            error.response
          )
        );
      } else {
        return Promise.reject(
          new ThingsError(
            Things.ErrorMessages.FailedToGetTrialProducts,
            error.response
          )
        );
      }
    }

    return res.data;
  }
}
