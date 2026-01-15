"use strict";

/**
 * Encodes a URL object into a URL-encoded string.
 * @param {Object} urlObj - The URL object to encode.
 * @returns {string} The URL-encoded string.
 */
export const urlEncode = urlObj => {
    return Object.entries(urlObj).join("&").replace(/,/g, "=").replace(/#/g, "%23");
};