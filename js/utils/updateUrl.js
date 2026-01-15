"use strict";

/**
 * Import
 */
import { urlEncode } from "./urlEncode.js";

/**
 * Updates the URL with the provided filter object and search type.
 *
 * @param {Object} filterObj - An object containing the filters to be encoded in the URL.
 * @param {string} searchType - The type of search, eg. 'videos' or 'photos'.
 */
export const updateUrl = (filterObj, searchType) => {
    setTimeout(() => {
        const root = window.location.origin;
        const searchQuery = urlEncode(filterObj);

        window.location = `${root}/pages/${searchType}/${searchType}.html?${searchQuery}`;
    }, 500);
};