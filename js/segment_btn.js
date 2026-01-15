"use strict";

/**
 * Import
 */
import { addEventOnElements } from "./utils/event.js";

/**
 * Handles the segmentation functionality for a given segment element.
 *
 * @param {HTMLElement} $segment - The segment element.
 * @param {Function} callback - A callback function to be called when a segment button is clicked, passing the selected segment value as an argument.
 */
export const segment = function ($segment, callback) {
    const $segmentBtns = $segment.querySelectorAll('[data-segment-btn]');
    let $lastSelectedSegmentBtn = $segment.querySelector('[data-segment-btn].selected');

    addEventOnElements($segmentBtns, 'click', function () {
        $lastSelectedSegmentBtn.classList.remove('selected');
        this.classList.add('selected');
        $lastSelectedSegmentBtn = this;
        callback(this.dataset.segmentValue);
    });
};