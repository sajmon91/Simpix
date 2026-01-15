"use strict";


/**
 * Adds an event listener to each element in the provided array.
 *
 * @param {HTMLElement[]} $elements - An array of HTML elements to add the event listener to.
 * @param {string} eventType - The type of event to listen for (e.g. 'click', 'keydown').
 * @param {function} callback - The callback function to execute when the event is triggered.
 */
export const addEventOnElements = function ($elements, eventType, callback) {
    $elements.forEach($element => $element.addEventListener(eventType, callback));
};