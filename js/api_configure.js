"use strict";

/**
 * Import
 */
import { urlEncode } from './utils/urlEncode.js';


const API_KEY = "{YOUR-PEXELS-API-KEY}";

const headers = new Headers();
headers.append("Authorization", API_KEY);

const requestOptions = { headers };

/**
 * Fetch data from Pexels
 * @param {string} url Fetch URL
 * @param {Function} successCallback Success callback function
 */
const fetchData = async function (url, successCallback) {
    const response = await fetch(url, requestOptions);

    if (response.ok){
        const data = await response.json();
        successCallback(data);
    }
};

let requestUrl = '';
const root = {
    default: 'https://api.pexels.com/v1/',
    videos: 'https://api.pexels.com/videos/',
}

export const client = {
    photos: {
        /**
         * Search photos
         * @param {Object} parameters Url Object
         * @param {Function} callback Callback function
         */
        search(parameters, callback) {
            requestUrl = `${root.default}search?${urlEncode(parameters)}`;
            fetchData(requestUrl, callback);
        },

        /**
         * Curated photos
         * @param {Object} parameters Url Object
         * @param {Function} callback Callback function
         */
        curated(parameters, callback) {
            fetchData(`${root.default}curated?${urlEncode(parameters)}`, callback);
        },

        /**
         * Get single photo detail
         * @param {string} id Photo ID
         * @param {Function} callback Callback function
         */
        detail(id, callback) {
            fetchData(`${root.default}photos/${id}`, callback);
        }
    },

    videos: {
        /**
         * Search videos
         * @param {Object} parameters Url Object
         * @param {Function} callback Callback function
         */
        search(parameters, callback) {
            requestUrl = `${root.videos}search?${urlEncode(parameters)}`;
            fetchData(requestUrl, callback);
        },

        /**
         * Popular videos
         * @param {Object} parameters Url Object
         * @param {Function} callback Callback function
         */
        popular(parameters, callback) {
            fetchData(`${root.videos}popular?${urlEncode(parameters)}`, callback);
        },

        /**
         * Get single video detail
         * @param {string} id Video ID
         * @param {Function} callback Callback function
         */
        detail(id, callback) {
            fetchData(`${root.videos}videos/${id}`, callback);
        }
    },

    collections: {
        /**
         * Featured collections
         * @param {Object} parameters Url Object
         * @param {Function} callback Callback function
         */
        featured(parameters, callback) {
            requestUrl = `${root.default}collections/featured?${urlEncode(parameters)}`;
            fetchData(requestUrl, callback);
        },

        /**
         * Get a collection medias
         * @param {string} id Collection ID
         * @param {Object} parameters Url Object
         * @param {Function} callback Callback function
         */
        detail(id, parameters, callback) {
            requestUrl = `${root.default}collections/${id}?${urlEncode(parameters)}`;
            fetchData(requestUrl, callback);
        }
    }
}