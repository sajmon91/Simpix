"use strict";

/**
 * Convert url string to object
 * 
 * @param {String} urlString Url string to be decoded
 * @returns {Object} Url object
 */
export const urlDecode = urlString => {
    return Object.fromEntries(urlString.replace(/%23/g, '#').replace(/%20/g, ' ').split('&').map(i => i.split('=')));
};