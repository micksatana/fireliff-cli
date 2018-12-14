import { EOL } from 'os';
import './colors-set-theme';
import { FunctionsConfig } from './functions-config';
import { ThingsCreateTrialRequest } from './things-create-trial-request';
import { ThingsError } from './things-error';
import { ThingsGetProductRequest } from './things-get-product-request';

export const FailedCertification = `Certification failed.`.warn;
export const FailedNotFound = `Either not found or you do not have access rights.`.warn;
export const InvalidValue = `The request contains an invalid value.`.warn;

export const FailedToGetProduct = `Failed to get product`.error;
export const FailedToGetProduct401 = FailedToGetProduct + EOL + FailedCertification;
export const FailedToGetProduct404 = FailedToGetProduct + EOL + FailedNotFound;

export const FailedToCreateTrial = `Failed to create trial product`.error;
export const FailedToCreateTrial400 = `Failed to create trial product`.error + EOL + InvalidValue;
export const FailedToCreateTrial401 = `Failed to create trial product`.error + EOL + FailedCertification;
export const FailedToCreateTrial403 = `Failed to create trial product`.error + EOL + `We have already reached the maximum number of trial products (maximum of 10). Delete unnecessary trial products.`.warn;

export class Things {

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

    constructor() { }

    /**
     * 
     * @param {string} deviceId Device ID
     */
    async getProduct(deviceId) {
        const req = new ThingsGetProductRequest({ accessToken: FunctionsConfig.AccessToken });
        let res;

        try {
            res = await req.send(deviceId);
        } catch (error) {
            if (error.response.status === 401) {
                return Promise.reject(new ThingsError(Things.ErrorMessages.FailedToGetProduct401));
            } else if (error.response.status === 404) {
                return Promise.reject(new ThingsError(Things.ErrorMessages.FailedToGetProduct404));
            } else {
                return Promise.reject(new ThingsError(Things.ErrorMessages.FailedToGetProduct));
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
        const req = new ThingsCreateTrialRequest({ accessToken: FunctionsConfig.AccessToken });
        let res;

        try {
            res = await req.send(liff, name);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                return Promise.reject(new ThingsError(Things.ErrorMessages.FailedToCreateTrial + EOL + error.response.data.detail.warn));
            } else if (error.response.status === 400) {
                return Promise.reject(new ThingsError(Things.ErrorMessages.FailedToCreateTrial400));
            } else if (error.response.status === 401) {
                return Promise.reject(new ThingsError(Things.ErrorMessages.FailedToCreateTrial401));
            } else if (error.response.status === 403) {
                return Promise.reject(new ThingsError(Things.ErrorMessages.FailedToCreateTrial403));
            } else {
                return Promise.reject(new ThingsError(Things.ErrorMessages.FailedToCreateTrial));
            }
        }

        return res.data;
    }

}
