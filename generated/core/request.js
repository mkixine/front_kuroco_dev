"use strict";
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/* prettier-ignore */
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore-start
const OpenAPI_1 = require("./OpenAPI");
// @ts-ignore-end
const getFormData_1 = require("./getFormData");
const getQueryString_1 = require("./getQueryString");
const requestUsingFetch_1 = require("./requestUsingFetch");
/**
 * Create the request.
 * @param options Request method options.
 * @returns Result object (see above)
 */
async function request(options) {
    // Escape path (RFC3986) and create the request URL
    let path = options.path.replace(/[:]/g, '_');
    let url = `${OpenAPI_1.OpenAPI.BASE}${path}`;
    // Create request headers
    const headers = new Headers({
        ...options.headers,
        Accept: 'application/json',
        'content-type': 'application/json',
    });
    // Create request settings
    const request = {
        headers,
        method: options.method,
        credentials: 'include',
    };
    // Add the query parameters (if defined).
    if (options.query) {
        url += getQueryString_1.getQueryString(options.query);
    }
    // Append formData as body
    if (options.formData) {
        request.body = getFormData_1.getFormData(options.formData);
    }
    else if (options.body) {
        // If this is blob data, then pass it directly to the body and set content type.
        // Otherwise we just convert request data to JSON string (needed for fetch api)
        if (options.body instanceof Blob) {
            request.body = options.body;
            if (options.body.type) {
                headers.set('Content-Type', options.body.type);
            }
        }
        else {
            request.body = JSON.stringify(options.body);
            headers.set('Content-Type', 'application/json');
        }
    }
    try {
        return await requestUsingFetch_1.requestUsingFetch(url, request, options.responseHeader);
    }
    catch (error) {
        return {
            url,
            ok: false,
            status: 0,
            statusText: '',
            body: error,
        };
    }
}
exports.request = request;
